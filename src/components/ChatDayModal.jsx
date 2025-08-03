import React from 'react';
import { X } from 'lucide-react';

const ChatDayModal = ({ isOpen, selectedDay, onClose }) => {
  if (!isOpen || !selectedDay) return null;

  // Function to render a section based on its type
  const renderSection = (section, sectionIndex) => {
    switch (section.type) {
      case 'heading':
        return (
          <h2 key={`section-${sectionIndex}`} className="text-lg font-bold mt-4 mb-2">
            {section.content}
          </h2>
        );
      case 'subheading':
        return (
          <h3 key={`section-${sectionIndex}`} className="text-md font-semibold mt-3 mb-1">
            {section.content}
          </h3>
        );
      case 'paragraph':
        return (
          <p key={`section-${sectionIndex}`} className="text-sm mb-2">
            {section.content}
          </p>
        );
      case 'list':
        return (
          <ul key={`section-${sectionIndex}`} className="list-disc pl-5 mb-2">
            {section.items.map((item, itemIndex) => (
              <li key={`item-${itemIndex}`} className="text-sm mb-1">
                {item}
              </li>
            ))}
          </ul>
        );
      default:
        return (
          <div key={`section-${sectionIndex}`} className="text-sm mb-2">
            {section.content}
          </div>
        );
    }
  };

  // Function to render message content based on type
  const renderMessageContent = (message) => {
    if (!message.content) return null;

    // Handle string content (legacy format)
    if (typeof message.content === 'string') {
      return <p className="text-sm">{message.content}</p>;
    }

    // Handle structured content (new format)
    if (message.content.sections || message.content.summary) {
      return (
        <div className="space-y-2">
          {message.content.sections?.map((section, index) => (
            <React.Fragment key={`section-${index}`}>
              {renderSection(section, index)}
            </React.Fragment>
          ))}
          
          {message.content.summary && (
            <div className="mt-4 p-3 bg-gray-50 rounded">
              <h3 className="font-semibold mb-1">Summary</h3>
              <p className="text-sm">{message.content.summary}</p>
            </div>
          )}
        </div>
      );
    }

    // Handle visit summary format
    if (message.content.visitData) {
      return (
        <div className="text-sm">
          <h4 className="font-bold mb-2">Visit Summary</h4>
          <p>{message.content.visitData}</p>
          {message.content.questions && (
            <div className="mt-2">
              <h4 className="font-bold mb-1">Follow-up Questions</h4>
              <ul className="list-disc pl-5">
                {message.content.questions.map((q, i) => (
                  <li key={i}>{q}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      );
    }

    return <p className="text-sm">Unsupported message format</p>;
  };

  return (
    <div className="absolute top-0 left-0  w-full h-full flex justify-center items-start p-2 z-50">
      <div className="bg-white rounded-md shadow-xl border border-gray-200 w-full  max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
          <h3 className="text-lg font-medium text-gray-900">
            Chat History - {selectedDay.date}
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {selectedDay.messages.map((message, index) => (
            <div 
              key={index} 
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`
                max-w-[80%] rounded-lg p-3
                ${message.type === 'user' 
                  ? 'bg-blue-100 text-blue-900' 
                  : message.type === 'summary'
                    ? 'bg-gray-100 text-gray-900'
                    : 'bg-gray-50 text-gray-900'
                }`
              }>
                {renderMessageContent(message)}
                
                {message.files && message.files.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {message.files.map((file, fileIndex) => (
                      <div
                        key={fileIndex}
                        className="p-2 rounded flex justify-between items-center cursor-pointer hover:bg-blue-50"
                        onClick={() => handleDocumentClick(file)}
                      >
                        <div className="flex items-center">
                          <img 
                            src="/doc.svg" 
                            className="w-3 h-3 mr-1" 
                            alt="Document" 
                          />
                          <span className="text-xs truncate max-w-[150px]">
                            {file.name}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatDayModal;