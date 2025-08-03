import React, { useState, useEffect, useRef } from 'react';

const AnimatedMarkdown = ({
  structuredData,
  typingSpeed = 1,
  onComplete,
  messageId,
  setAnimatedMessages,
  animatedMessages,
  setResponseConclusion,
  isUserScrolledUp
}) => {
  const [displayedSections, setDisplayedSections] = useState([]);
  const [displayedSummary, setDisplayedSummary] = useState(null);
  const [fadeInWords, setFadeInWords] = useState({});
  const [isComplete, setIsComplete] = useState(false);
  const [opacity, setOpacity] = useState(0);
  const contentRef = useRef([]);
  const summaryRef = useRef(null);
  const currentSectionRef = useRef(0);
  const currentWordRef = useRef(0);
  const animatingSummaryRef = useRef(false);
  const timerRef = useRef(null);
  const contentEndRef = useRef(null);
  const scrollIntervalRef = useRef(null);


  const handleSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim() !== '') {
      console.log("Selected text:", selection.toString());

      // Optional: You can also get more details about the selection
      const range = selection.getRangeAt(0);
      console.log("Selection details:", {
        text: selection.toString(),
        startContainer: range.startContainer,
        startOffset: range.startOffset,
        endContainer: range.endContainer,
        endOffset: range.endOffset
      });
    }
  };
  useEffect(() => {
    // Add event listeners for mouseup (click release) and keyup (keyboard selection)
    document.addEventListener('mouseup', handleSelection);
    document.addEventListener('keyup', handleSelection);

    return () => {
      // Clean up event listeners
      document.removeEventListener('mouseup', handleSelection);
      document.removeEventListener('keyup', handleSelection);
    };
  }, []);

  // Process text to handle both <b> tags and **content** formatting
  const processFormatting = (text) => {
    if (!text) return '';
    // Replace both <b> tags and **content** with <strong> tags
    let processed = text.replace(/<b>(.*?)<\/b>|\*\*(.*?)\*\*/g, (match, p1, p2) => {
      return `<strong>${p1 || p2}</strong>`;
    });
    return processed;
  };

  // Process sections into words for animation
  const processSectionsIntoWords = (sections) => {
    return sections.map(section => {
      let processedSection = { ...section };

      if (section.type === 'list') {
        processedSection.items = section.items.map(item => {
          const processedItem = processFormatting(item);
          return processedItem.split(/(\s+)/).filter(Boolean);
        });
      } else if (section.content) {
        const processedContent = processFormatting(section.content);
        processedSection.words = processedContent.split(/(\s+)/).filter(Boolean);
      }

      return processedSection;
    });
  };

  // Process summary into words for animation
  const processSummaryIntoWords = (summary) => {
    if (!summary) return null;
    const processedContent = processFormatting(summary);
    return processedContent.split(/(\s+)/).filter(Boolean);
  };

  // Initialize animation state
  useEffect(() => {
    const alreadyAnimated = animatedMessages && animatedMessages.includes(messageId);

    if (alreadyAnimated) {
      setDisplayedSections(structuredData.sections);
      if (structuredData.summary) {
        setDisplayedSummary({
          content: structuredData.summary,
          displayedWords: processFormatting(structuredData.summary).split(/(\s+)/).filter(Boolean)
        });
      }
      setOpacity(1);
      setIsComplete(true);
      return;
    }

    contentRef.current = processSectionsIntoWords(structuredData.sections);
    if (structuredData.summary) {
      summaryRef.current = processSummaryIntoWords(structuredData.summary);
    }
    currentSectionRef.current = 0;
    currentWordRef.current = 0;
    animatingSummaryRef.current = false;
    setDisplayedSections([]);
    setDisplayedSummary(null);
    setFadeInWords({});
    setIsComplete(false);
    setOpacity(0);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (scrollIntervalRef.current) clearInterval(scrollIntervalRef.current);
    };
  }, [structuredData, messageId, animatedMessages, setResponseConclusion]);

  // Fade-in effect for the overall message
  useEffect(() => {
    if (displayedSections.length > 0 && opacity < 1) {
      const fadeTimer = setTimeout(() => {
        setOpacity(prev => Math.min(prev + 0.1, 1));
      }, 15);
      return () => clearTimeout(fadeTimer);
    }
  }, [displayedSections, opacity]);

  // Continuous scroll effect during animation (when user isn't scrolled up)
  useEffect(() => {
    if (isComplete || isUserScrolledUp) {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
        scrollIntervalRef.current = null;
      }
      return;
    }

    // Only start scrolling if we're not already scrolling
    if (!scrollIntervalRef.current && contentEndRef.current) {
      scrollIntervalRef.current = setInterval(() => {
        if (!isUserScrolledUp && contentEndRef.current) {
          contentEndRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest'
          });
        }
      }, 300); // Scroll check every 300ms
    }

    return () => {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
      }
    };
  }, [isComplete, isUserScrolledUp]);

  // Animation effect
  useEffect(() => {
    if (isComplete || (animatedMessages && animatedMessages.includes(messageId))) return;

    const animateText = () => {
      const sectionsToDisplay = [...displayedSections];
      const newFadeInWords = { ...fadeInWords };
      const wordsPerStep = 3; // Process 3 words at a time

      // Handle animation of the main content sections
      if (currentSectionRef.current < contentRef.current.length && !animatingSummaryRef.current) {
        const currentSection = contentRef.current[currentSectionRef.current];

        if (currentSection.type === 'list') {
          // Similar logic but process multiple words at once
          if (!sectionsToDisplay[currentSectionRef.current]) {
            sectionsToDisplay[currentSectionRef.current] = {
              ...currentSection,
              items: currentSection.items.map(() => [])
            };
          }

          let totalWordsProcessed = 0;
          let currentItemIndex = 0;

          for (let i = 0; i < currentSection.items.length; i++) {
            if (currentWordRef.current < totalWordsProcessed + currentSection.items[i].length) {
              currentItemIndex = i;
              break;
            }
            totalWordsProcessed += currentSection.items[i].length;
          }

          const wordIndexInItem = currentWordRef.current - totalWordsProcessed;
          const wordsRemaining = currentSection.items[currentItemIndex].length - wordIndexInItem;
          const wordsToProcess = Math.min(wordsPerStep, wordsRemaining);

          if (wordIndexInItem < currentSection.items[currentItemIndex].length) {
            // Process multiple words at once
            sectionsToDisplay[currentSectionRef.current].items[currentItemIndex] =
              currentSection.items[currentItemIndex].slice(0, wordIndexInItem + wordsToProcess);

            // Set all processed words to fade in
            for (let i = 0; i < wordsToProcess; i++) {
              const wordKey = `${currentSectionRef.current}-list-${currentItemIndex}-${wordIndexInItem + i}`;
              newFadeInWords[wordKey] = true;

              setTimeout(() => {
                setFadeInWords(prev => {
                  const updated = { ...prev };
                  delete updated[wordKey];
                  return updated;
                });
              }, 200);
            }

            currentWordRef.current += wordsToProcess;

            if (wordIndexInItem + wordsToProcess === currentSection.items[currentItemIndex].length) {
              if (currentItemIndex === currentSection.items.length - 1) {
                currentSectionRef.current++;
                currentWordRef.current = 0;
              }
            }
          }
        } else if (currentSection.words) {
          // For regular content with words
          if (!sectionsToDisplay[currentSectionRef.current]) {
            sectionsToDisplay[currentSectionRef.current] = {
              ...currentSection,
              displayedWords: []
            };
          }

          const wordsRemaining = currentSection.words.length - currentWordRef.current;
          const wordsToProcess = Math.min(wordsPerStep, wordsRemaining);

          if (currentWordRef.current < currentSection.words.length) {
            sectionsToDisplay[currentSectionRef.current].displayedWords =
              currentSection.words.slice(0, currentWordRef.current + wordsToProcess);

            // Set all processed words to fade in
            for (let i = 0; i < wordsToProcess; i++) {
              const wordKey = `${currentSectionRef.current}-${currentWordRef.current + i}`;
              newFadeInWords[wordKey] = true;

              setTimeout(() => {
                setFadeInWords(prev => {
                  const updated = { ...prev };
                  delete updated[wordKey];
                  return updated;
                });
              }, 200);
            }

            currentWordRef.current += wordsToProcess;

            if (currentWordRef.current === currentSection.words.length) {
              currentSectionRef.current++;
              currentWordRef.current = 0;
            }
          }
        } else {
          sectionsToDisplay[currentSectionRef.current] = { ...currentSection };
          currentSectionRef.current++;
          currentWordRef.current = 0;
        }

        setDisplayedSections(sectionsToDisplay);
        setFadeInWords(newFadeInWords);

        if (setResponseConclusion && structuredData.summary) {
          const totalSections = contentRef.current.length;
          if (currentSectionRef.current >= totalSections / 2) {
            setResponseConclusion(structuredData.summary);
          }
        }

        timerRef.current = setTimeout(animateText, typingSpeed);
      }
      // Handle summary animation similarly
      else if (summaryRef.current && (!displayedSummary || displayedSummary.displayedWords.length < summaryRef.current.length)) {
        animatingSummaryRef.current = true;
        const currentSummary = displayedSummary || {
          content: structuredData.summary,
          displayedWords: []
        };

        const summaryWordIndex = currentSummary.displayedWords.length;
        const wordsRemaining = summaryRef.current.length - summaryWordIndex;
        const wordsToProcess = Math.min(wordsPerStep, wordsRemaining);

        if (summaryWordIndex < summaryRef.current.length) {
          currentSummary.displayedWords = summaryRef.current.slice(0, summaryWordIndex + wordsToProcess);

          for (let i = 0; i < wordsToProcess; i++) {
            const wordKey = `summary-${summaryWordIndex + i}`;
            newFadeInWords[wordKey] = true;

            setTimeout(() => {
              setFadeInWords(prev => {
                const updated = { ...prev };
                delete updated[wordKey];
                return updated;
              });
            }, 200);
          }

          setDisplayedSummary(currentSummary);
          setFadeInWords(newFadeInWords);
          timerRef.current = setTimeout(animateText, typingSpeed);
        } else {
          completeAnimation();
        }
      } else {
        completeAnimation();
      }
    };

    const completeAnimation = () => {
      setIsComplete(true);
      if (setAnimatedMessages) {
        setAnimatedMessages(prev => {
          if (prev && prev.includes(messageId)) {
            return prev;
          }
          return [...(prev || []), messageId];
        });
      }

      if (setResponseConclusion && structuredData.summary) {
        setResponseConclusion(structuredData.summary);
      }

      if (onComplete) onComplete();
    };

    timerRef.current = setTimeout(animateText, typingSpeed);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [typingSpeed, isComplete, onComplete, messageId, animatedMessages, setAnimatedMessages, setResponseConclusion, displayedSections, displayedSummary, fadeInWords, structuredData]);

  // Render a word with HTML content (including <strong> tags)
  const renderWord = (word, sectionIndex, wordIndex, itemIndex = null, isSummary = false) => {
    const wordKey = isSummary
      ? `summary-${wordIndex}`
      : (itemIndex !== null
        ? `${sectionIndex}-list-${itemIndex}-${wordIndex}`
        : `${sectionIndex}-${wordIndex}`);

    const isFadingIn = fadeInWords[wordKey];

    return (
      <span
        key={wordKey}
        className={`word ${isFadingIn ? 'fade-in-word' : ''}`}
        dangerouslySetInnerHTML={{ __html: word }}
      />
    );
  };

  // Render a section based on its type
  const renderSection = (section, sectionIndex) => {
    switch (section.type) {
      case 'heading':
        return (
          <h2 key={`section-${sectionIndex}`} className="medical-heading">
            {section.displayedWords
              ? section.displayedWords.map((word, i) => renderWord(word, sectionIndex, i))
              : <span dangerouslySetInnerHTML={{ __html: processFormatting(section.content) }} />}
          </h2>
        );
      case 'subheading':
        return (
          <h3 key={`section-${sectionIndex}`} className="medical-subheading">
            {section.displayedWords
              ? section.displayedWords.map((word, i) => renderWord(word, sectionIndex, i))
              : <span dangerouslySetInnerHTML={{ __html: processFormatting(section.content) }} />}
          </h3>
        );
      case 'paragraph':
        return (
          <p key={`section-${sectionIndex}`} className="medical-paragraph">
            {section.displayedWords
              ? section.displayedWords.map((word, i) => renderWord(word, sectionIndex, i))
              : <span dangerouslySetInnerHTML={{ __html: processFormatting(section.content) }} />}
          </p>
        );
      case 'list':
        return (
          <ul key={`section-${sectionIndex}`} className="medical-list">
            {(section.items || []).map((item, itemIndex) => {
              // Only render list items that have been fully processed
              if (Array.isArray(item) && item.length > 0) {
                return (
                  <li key={`list-item-${itemIndex}`} className="medical-list-item">
                    {item.map((word, wordIndex) =>
                      renderWord(word, sectionIndex, wordIndex, itemIndex)
                    )}
                  </li>
                );
              } else if (typeof item === 'string') {
                return (
                  <li key={`list-item-${itemIndex}`} className="medical-list-item">
                    <span dangerouslySetInnerHTML={{ __html: processFormatting(item) }} />
                  </li>
                );
              }
              return null;
            }).filter(Boolean)}
          </ul>
        );
      default:
        return (
          <div key={`section-${sectionIndex}`}>
            {section.displayedWords
              ? section.displayedWords.map((word, i) => renderWord(word, sectionIndex, i))
              : <span dangerouslySetInnerHTML={{ __html: processFormatting(section.content) }} />}
          </div>
        );
    }
  };

  // Render the summary section
  const renderSummary = () => {
    if (!displayedSummary) return null;

    return (
      <div className="summary-section">
        <h3 className="medical-subheading">Summary</h3>
        <p className="medical-paragraph">
          {displayedSummary.displayedWords.map((word, i) =>
            renderWord(word, 'summary', i, null, true)
          )}
        </p>
      </div>
    );
  };

  return (
    <div className="animated-markdown-container" style={{ opacity }}>
      {displayedSections.map((section, index) => (
        <React.Fragment key={`section-fragment-${index}`}>
          {renderSection(section, index)}
        </React.Fragment>
      ))}

      {renderSummary()}

      <div ref={contentEndRef} className="content-end-marker" />

      <style jsx>{`
        .word {
          display: inline;
          white-space: pre-wrap;
        }
        .fade-in-word {
          animation: fadeIn 0.2s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .content-end-marker {
          height: 1px;
          width: 100%;
        }
      `}</style>
    </div>
  );
};

export default AnimatedMarkdown;