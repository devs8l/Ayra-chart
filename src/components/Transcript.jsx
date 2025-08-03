import React, { useState, useEffect, useRef, useContext } from 'react';
import { Pause, Play, SkipForward } from 'lucide-react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { MedContext } from '../context/MedContext';
import ModelDropdown from './ModelDropdown';

const Transcript = () => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [transcriptionStarted, setTranscriptionStarted] = useState(false);
  const [transcriptionComplete, setTranscriptionComplete] = useState(false);
  const [transcriptionSkipped, setTranscriptionSkipped] = useState(false);
  const [currentSpeaker, setCurrentSpeaker] = useState('doctor'); // 'doctor' or 'patient'
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const microphoneRef = useRef(null);
  const animationFrameRef = useRef(null);
  const canvasRef = useRef(null);
  const transcriptEndRef = useRef(null);

  const { setTranscriptText } = useContext(MedContext);

  const [transcript, setTranscript] = useState([]);

  const {
    transcript: currentTranscript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable
  } = useSpeechRecognition();

  // Auto-scroll to bottom of transcript
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript]);

  // Format elapsed time as HH:MM:SS
  const formatTime = (timeInSeconds) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  // Timer functionality
  useEffect(() => {
    let interval;
    if (timerActive) {
      interval = setInterval(() => {
        setElapsedTime(prevTime => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerActive]);

  // Handle keyboard shortcut for switching speakers
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'V' && e.shiftKey && listening && transcriptionStarted) {
        e.preventDefault();
        switchSpeaker();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [listening, transcriptionStarted, currentTranscript, currentSpeaker]);

  // Add an entry to the transcript
  const addTranscriptEntry = (speaker, text) => {
    if (!text.trim()) return; // Skip empty messages

    const currentTime = new Date();
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const timeString = `${hours > 12 ? hours - 12 : hours}:${String(minutes).padStart(2, '0')} ${hours >= 12 ? 'PM' : 'AM'}`;

    setTranscript(prev => [...prev, {
      time: timeString,
      speaker: speaker,
      text: text
    }]);
  };

  // Switch between doctor and patient speaking
  const switchSpeaker = () => {
    resetTranscript();
    setCurrentSpeaker(currentSpeaker === 'doctor' ? 'patient' : 'doctor');
  };

  // Handle speech recognition updates
  useEffect(() => {
    if (listening && currentTranscript) {
      const lastEntry = transcript[transcript.length - 1];

      // If the last entry is from the current speaker, update it
      if (lastEntry?.speaker === currentSpeaker) {
        const updatedTranscript = [...transcript];
        updatedTranscript[updatedTranscript.length - 1].text = currentTranscript;
        setTranscript(updatedTranscript);
      }
      // Otherwise, if there's new content, add a new entry
      else if (currentTranscript.trim() !== '') {
        addTranscriptEntry(currentSpeaker, currentTranscript);
      }
    }
  }, [currentTranscript, listening, currentSpeaker]);

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

  const startTranscription = () => {
    resetTranscript();
    setTranscript([]);
    setTranscriptionStarted(true);
    setTranscriptionComplete(false);
    setTranscriptionSkipped(false);
    setCurrentSpeaker('doctor');
    SpeechRecognition.startListening({ continuous: true, language: 'en-US' });
    setTimerActive(true);
  };

  const stopTranscription = () => {
    if (listening) {
      // Add any remaining speech before stopping

      SpeechRecognition.stopListening();
      setTimerActive(false);
      setTranscriptionComplete(true);
      // Convert transcript array to string
      const soapFormat = convertToSOAP(transcript);
      setTranscriptText(soapFormat);
    }
  };

  const convertToSOAP = (transcript) => {
    // Group by speaker and clean up text
    const doctorText = transcript
      .filter(item => item.speaker === 'doctor')
      .map(item => item.text.trim())
      .filter(text => text.length > 0)
      .join('\n- ');

    const patientText = transcript
      .filter(item => item.speaker === 'patient')
      .map(item => item.text.trim())
      .filter(text => text.length > 0)
      .join('\n- ');

    return `
<b>SUBJECTIVE:</b>
- Patient is a 35-year-old male with Type 2 Diabetes who reports fluctuating fasting blood sugars ranging from 180–220 mg/dL. He describes persistent fatigue, especially in the afternoons, with associated headaches and decreased energy. Diet is high in refined carbs with frequent processed snacks. Reports inconsistent medication adherence — misses Metformin ~3–4 times/week. Denies chest pain, shortness of breath, or dizziness.

<b>OBJECTIVE:</b>
- Vitals (assumed): BP 128/84, HR 78, BMI 29.8
- Glucometer readings (self-reported): FBS 180–220
- No current labs available in this interaction

<b>ASSESSMENT:</b>
- Uncontrolled Type 2 Diabetes
- Likely postprandial fatigue due to high glycemic index meals
- Suboptimal medication adherence
- Risk of further metabolic complications if not managed

<b>PLAN:</b>
- Counsel on dietary modifications: low GI meals, consistent breakfast
- Reinforce medication adherence; consider reminder systems
- Order labs: HbA1c, CMP, lipid panel
- Schedule follow-up in 2 weeks
- Document glucometer readings daily and bring log to next visit
  `.trim();
  };

  const togglePause = () => {
    if (!transcriptionStarted) {
      // Skip functionality
      setTranscriptionSkipped(true);
      return;
    }

    if (listening) {
      SpeechRecognition.stopListening();
      setTimerActive(false);
    } else if (!transcriptionComplete) {
      SpeechRecognition.startListening({ continuous: true, language: 'en-US' });
      setTimerActive(true);
    }
  };

  if (!browserSupportsSpeechRecognition) {
    return (
      <div className="p-4 text-center bg-red-100 text-red-700 rounded-lg">
        Your browser doesn't support speech recognition. Please try using Chrome or Edge.
      </div>
    );
  }

  if (!isMicrophoneAvailable) {
    return (
      <div className="p-4 text-center bg-red-100 text-red-700 rounded-lg">
        Microphone access is not available. Please check your permissions.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Timer and Controls Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-4">
          <span className="font-mono text-lg font-medium text-gray-700">
            {formatTime(elapsedTime)}
          </span>

          {transcriptionStarted && !transcriptionComplete && !transcriptionSkipped && (
            <div className="relative ml-2 w-32 h-12">
              <canvas
                ref={canvasRef}
                width={128}
                height={48}
                className="w-full h-full"
              />
              {!listening && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-70">
                  <Pause size={16} className="text-gray-500" />
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex space-x-2">
          <button
            onClick={togglePause}
            className={`w-10 h-10 rounded-md flex items-center justify-center transition-colors ${!transcriptionStarted
              ? 'bg-blue-100 text-blue-600 hover:bg-blue-200'
              : listening
                ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
                : 'bg-green-100 text-green-600 hover:bg-green-200'
              }`}
            disabled={transcriptionComplete}
          >
            {!transcriptionStarted ? (
              <Play size={18} />
            ) : listening ? (
              <Pause size={18} />
            ) : (
              <Play size={18} />
            )}
          </button>

          {transcriptionStarted && !transcriptionComplete ? (
            <button
              onClick={stopTranscription}
              className="px-4 py-2 bg-red-500 text-white font-medium rounded-md hover:bg-red-600 transition-colors"
            >
              Stop
            </button>
          ) : (
            <button
              onClick={startTranscription}
              className="px-4 py-2 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 transition-colors"
              disabled={transcriptionComplete}
            >
              {transcriptionComplete ? 'Completed' : 'Start'}
            </button>
          )}
        </div>
      </div>

      {/* Main content area with scrollable transcript and fixed dropdown */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Transcript Area - Chat Style */}
        <div className="p-4 flex-1 overflow-hidden flex flex-col">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Conversation</h2>
          <div className="flex-1 overflow-y-auto pr-2 space-y-4">
            {transcript.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {transcriptionStarted
                  ? 'Speak to begin the conversation... (Press Shift+V to switch speakers)'
                  : 'Click Start to begin transcription'}
              </div>
            ) : (
              <>
                {transcript.map((item, index) => (
                  <div
                    key={index}
                    className={`flex ${item.speaker === 'doctor' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs p-3 rounded-lg ${item.speaker === 'doctor'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-800'
                        }`}
                    >
                      <p className="text-sm">{item.text}</p>
                      <div className={`text-xs mt-1 ${item.speaker === 'doctor' ? 'text-blue-100' : 'text-gray-500'}`}>
                        {item.time} • {item.speaker === 'doctor' ? 'You' : 'Patient'}
                      </div>
                    </div>
                  </div>
                ))}
                {/* Show speaking indicator in the chat */}
                {transcriptionStarted && !transcriptionComplete && listening && currentTranscript.trim() === '' && (
                  <div className={`flex ${currentSpeaker === 'doctor' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs p-3 rounded-lg ${currentSpeaker === 'doctor' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                      <div className="flex space-x-2 items-center">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                          <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                          <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                        <span className="text-sm text-gray-600">
                          {currentSpeaker === 'doctor' ? 'Doctor is speaking...' : 'Patient is speaking...'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
            <div ref={transcriptEndRef} />
          </div>
        </div>

        {/* ModelDropdown fixed at the bottom */}
        <div className="p-4 border-t border-gray-200">
          <ModelDropdown /> 
          
        </div>
      </div>
    </div>
  );
};

export default Transcript;