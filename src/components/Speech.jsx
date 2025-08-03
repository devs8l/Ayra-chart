import { useState, useEffect, useContext, useRef } from 'react';
import { Mic, MicOff, X } from 'lucide-react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { ChatContext } from '../context/ChatContext';

export default function SpeechRecognitionApp() {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable
  } = useSpeechRecognition();

  const { setInputMessage, setIsSpeechActive } = useContext(ChatContext);
  
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  // Audio visualization refs
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const microphoneRef = useRef(null);
  const animationFrameRef = useRef(null);
  const canvasRef = useRef(null);
  
  // Track when user is speaking
  useEffect(() => {
    if (!listening) {
      setIsSpeaking(false);
      return;
    }
    
    // Simple heuristic: if transcript changes, assume speaking
    const timer = setTimeout(() => setIsSpeaking(false), 1000);
    setIsSpeaking(true);
    
    return () => clearTimeout(timer);
  }, [transcript, listening]);
  
  // Handle transcript visibility
  useEffect(() => {
    if (transcript) setVisible(true);
  }, [transcript]);
  
  // Check browser support
  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      setError('Your browser does not support speech recognition.');
    } else if (!isMicrophoneAvailable) {
      setError('Microphone access is not available. Please check your permissions.');
    } else {
      setError(null);
    }
  }, [browserSupportsSpeechRecognition, isMicrophoneAvailable]);

  // Initialize audio context and visualizer
  useEffect(() => {
    if (!listening) {
      // Clean up if not listening
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (microphoneRef.current) {
        microphoneRef.current.disconnect();
        microphoneRef.current = null;
      }
      if (analyserRef.current) {
        analyserRef.current.disconnect();
        analyserRef.current = null;
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
      return;
    }

    // Initialize audio context if not already done
    if (!audioContextRef.current) {
      try {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 256;

        // Get microphone access
        navigator.mediaDevices.getUserMedia({ audio: true })
          .then(stream => {
            microphoneRef.current = audioContextRef.current.createMediaStreamSource(stream);
            microphoneRef.current.connect(analyserRef.current);
            drawVisualizer();
          })
          .catch(err => console.error('Error accessing microphone:', err));
      } catch (error) {
        console.error('Audio context error:', error);
      }
    } else {
      // If already initialized, just start the visualizer
      drawVisualizer();
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [listening]);

  // Visualizer drawing function
  const drawVisualizer = () => {
    if (!analyserRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const analyser = analyserRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animationFrameRef.current = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Center line (baseline)
      const centerY = canvas.height / 2;
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.3)';
      ctx.beginPath();
      ctx.moveTo(0, centerY);
      ctx.lineTo(canvas.width, centerY);
      ctx.stroke();

      // Draw symmetric waveform from center
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#3b82f6';
      ctx.beginPath();

      const sliceWidth = canvas.width / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 255;
        const y = centerY - (v * centerY); // Move up from center

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      // Complete the mirrored path
      for (let i = bufferLength - 1; i >= 0; i--) {
        const v = dataArray[i] / 255;
        const y = centerY + (v * centerY); // Move down from center
        ctx.lineTo(x, y);
        x -= sliceWidth;
      }

      ctx.closePath();
      
      // Fill with gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, 'rgba(59, 130, 246, 0.2)');
      gradient.addColorStop(0.5, 'rgba(59, 130, 246, 0.1)');
      gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');
      ctx.fillStyle = gradient;
      ctx.fill();
      ctx.stroke();
    };

    draw();
  };
  
  const toggleListening = () => {
    if (listening) {
      SpeechRecognition.stopListening();
      setInputMessage(transcript);
      setIsSpeechActive(false);
    } else {
      resetTranscript();
      setVisible(false);
      SpeechRecognition.startListening({ continuous: true, language: 'en-US' });
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
        <p className="text-gray-600">
          Try using Chrome or Edge on desktop for best results.
        </p>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className='absolute top-4 right-4 cursor-pointer' onClick={() => setIsSpeechActive(false)}>
        <X size={18}/>
      </div>
      
      {/* Transcript display */}
      <div className={`mb-8 max-w-lg w-full text-xl text-center transition-opacity duration-300 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}>
        {transcript || (listening ? 'Listening...' : 'Press the microphone to start')}
      </div>
      
      {/* Audio visualizer */}
      {listening && (
        <div className="relative w-full max-w-md h-24 mb-8 flex items-center justify-center">
          <canvas 
            ref={canvasRef} 
            width={800} 
            height={96}
            className="w-full h-full"
          />
          
        </div>
      )}
      
      {/* Microphone button */}
      <div className="flex flex-col items-center">
        <button
          onClick={toggleListening}
          disabled={!!error}
          className={`w-16 h-16 rounded-full flex items-center justify-center relative ${
            listening ? 'bg-red-500' : 'bg-blue-500 hover:bg-blue-600'
          } transition-colors ${error ? 'opacity-50' : ''}`}
        >
          {listening ? (
            <Mic size={24} color="white" />
          ) : (
            <MicOff size={24} color="white" />
          )}
          {listening && (
            <span className="absolute inset-0 rounded-full bg-red-500 opacity-0 animate-ping"></span>
          )}
        </button>
        <p className="mt-3 text-gray-600">
          {listening ? (isSpeaking ? 'Speaking...' : 'Listening...') : 'Tap to speak'}
        </p>
      </div>
    </div>
  );
}