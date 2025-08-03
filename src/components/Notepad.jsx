import React, { useState, useRef, useEffect, useContext } from 'react';
import { ChevronDown, Bold, Italic, Link, List, ListOrdered, Undo, Redo } from 'lucide-react';
import { MedContext } from "../context/MedContext";
import { showUserToast } from './CustomToast';

const Notepad = () => {
    const { 
        selectedUser, 
        isUserSelected, 
        transcriptText 
    } = useContext(MedContext);
    
    const [dropdownOpen, setDropdownOpen] = useState(false);
    //heading
    const [selectedFormat, setSelectedFormat] = useState("Normal");
    const [updateFromTranscript, setUpdateFromTranscript] = useState(false);
    const editorRef = useRef(null);
    const [activeFormats, setActiveFormats] = useState({
        bold: false,
        italic: false,
        list: false,
        orderedList: false
    });

    // Store notes content per user with titles
    const [userNotes, setUserNotes] = useState(() => {
        const savedNotes = localStorage.getItem('userNotes');
        return savedNotes ? JSON.parse(savedNotes) : {};
    });

    // Current note state
    const [currentNote, setCurrentNote] = useState({
        title: '',
        content: ''
    });

    // Load user's notes when selected user changes
    useEffect(() => {
        if (isUserSelected && selectedUser) {
            const userId = selectedUser._id || selectedUser.id;
            if (userId) {
                const userNote = userNotes[userId] || {
                    title: `${selectedUser.name}'s Notes`,
                    content: '<p class="text-gray-400">Write your notes here...</p>'
                };
                
                setCurrentNote(userNote);
                
                if (editorRef.current) {
                    editorRef.current.innerHTML = userNote.content;
                }
            }
        } else {
            setCurrentNote({
                title: 'General Notes',
                content: '<p class="text-gray-400">Write your notes here...</p>'
            });
            
            if (editorRef.current) {
                editorRef.current.innerHTML = '<p class="text-gray-400">Write your notes here...</p>';
            }
        }
    }, [selectedUser, isUserSelected]);

    // Save notes to localStorage when they change
    useEffect(() => {
        localStorage.setItem('userNotes', JSON.stringify(userNotes));
    }, [userNotes]);

    // Handle transcript updates
    useEffect(() => {
        if (updateFromTranscript && transcriptText && editorRef.current) {
            const currentContent = editorRef.current.innerHTML;
            const transcriptContent = transcriptText.replace(/\n/g, '<br/>');

            if (currentContent.includes('Write your notes here...') || currentContent.trim() === '') {
                editorRef.current.innerHTML = transcriptContent;
                updateNoteContent(transcriptContent);
            } else {
                editorRef.current.innerHTML += `<br/><br/>${transcriptContent}`;
                updateNoteContent(currentContent + `<br/><br/>${transcriptContent}`);
            }
        }
    }, [updateFromTranscript, transcriptText]);

    // Initialize the editor
    useEffect(() => {
        if (editorRef.current) {
            editorRef.current.contentEditable = true;
            editorRef.current.focus();
        }
    }, []);

    // Update note content in state
    const updateNoteContent = (content) => {
        setCurrentNote(prev => ({
            ...prev,
            content: content
        }));
    };

    // Save notes for the current user
    const saveCurrentNotes = (showToast = false) => {
        if (editorRef.current) {
            const content = editorRef.current.innerHTML;
            updateNoteContent(content);

            if (isUserSelected && selectedUser) {
                const userId = selectedUser._id || selectedUser.id;
                if (userId) {
                    if (showToast) {
                        editorRef.current.innerHTML = '<p class="text-gray-400">Write your notes here...</p>';
                        
                        const clearedContent = '<p class="text-gray-400">Write your notes here...</p>';
                        updateNoteContent(clearedContent);
                        
                        setUserNotes(prev => ({
                            ...prev,
                            [userId]: {
                                title: `${selectedUser.name}'s Notes`,
                                content: clearedContent
                            }
                        }));

                        showUserToast({
                            name: selectedUser.name,
                            profilePicture: selectedUser.profileImage || '/default-profile.png'
                        });
                    } else {
                        setUserNotes(prev => ({
                            ...prev,
                            [userId]: {
                                title: currentNote.title,
                                content: content
                            }
                        }));
                    }
                }
            } else {
                setUserNotes(prev => ({
                    ...prev,
                    general: {
                        title: currentNote.title,
                        content: content
                    }
                }));
            }
        }
    };

    // Formatting functions
    const checkFormatting = () => {
        setActiveFormats({
            bold: document.queryCommandState('bold'),
            italic: document.queryCommandState('italic'),
            list: document.queryCommandState('insertUnorderedList'),
            orderedList: document.queryCommandState('insertOrderedList')
        });
    };

    const execCommand = (command, value = null) => {
        if (editorRef.current?.textContent?.trim() === 'Write your notes here...') {
            editorRef.current.innerHTML = '';
            editorRef.current.classList.remove('text-gray-400');
        }

        document.execCommand(command, false, value);
        if (editorRef.current) {
            editorRef.current.focus();
        }
        checkFormatting();
        
        if (editorRef.current) {
            updateNoteContent(editorRef.current.innerHTML);
        }
    };

    const handleBold = () => execCommand('bold');
    const handleItalic = () => execCommand('italic');
    const handleLink = () => {
        const url = prompt('Enter URL:');
        if (url) execCommand('createLink', url);
    };
    const handleUnorderedList = () => execCommand('insertUnorderedList');
    const handleOrderedList = () => execCommand('insertOrderedList');
    const handleUndo = () => execCommand('undo');
    const handleRedo = () => execCommand('redo');

    const handleFormat = (e) => {
        setSelectedFormat(e.target.value);
        execCommand('removeFormat');

        switch (e.target.value) {
            case 'Heading 1':
                execCommand('formatBlock', '<h1>');
                break;
            case 'Heading 2':
                execCommand('formatBlock', '<h2>');
                break;
            case 'Heading 3':
                execCommand('formatBlock', '<h3>');
                break;
            default:
                execCommand('formatBlock', '<p>');
        }
    };

    const handleEditorClick = () => {
        if (editorRef.current?.textContent?.trim() === 'Write your notes here...') {
            editorRef.current.innerHTML = '';
            updateNoteContent('');
            editorRef.current.classList.remove('text-gray-400');
        }
    };

    const handleEditorInput = () => {
        if (editorRef.current) {
            updateNoteContent(editorRef.current.innerHTML);
        }
    };

    const getTitlePlaceholder = () => {
        if (isUserSelected && selectedUser) {
            return `${selectedUser.name}'s notes`;
        }
        return "General notes";
    };

    return (
        <div className="flex flex-col h-full">
            {/* Note Title */}
            

            {/* Checkboxes */}
            {isUserSelected && (
                <div className="p-4 space-y-2 animate-fadeInLeft [animation-delay:300ms] border-b border-gray-200">
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="update"
                            className="w-4 h-4 text-blue-500"
                            checked={updateFromTranscript}
                            onChange={(e) => setUpdateFromTranscript(e.target.checked)}
                        />
                        <label htmlFor="update" className="text-sm">
                            Update from transcript and review <span className="text-gray-500">(beta)</span>
                        </label>
                    </div>

                </div>
            )}

            {/* Formatting Toolbar */}
            <div className="w-full p-4 border-b border-gray-200 animate-fadeInLeft [animation-delay:400ms]">
                <div className="flex items-center gap-2 flex-wrap">
                    <button className="text-gray-500 p-1" onClick={handleUndo}>
                        <Undo size={18} />
                    </button>
                    <button className="text-gray-500 p-1" onClick={handleRedo}>
                        <Redo size={18} />
                    </button>
                    <div className="relative">
                        <select
                            className="appearance-none bg-white border border-gray-200 rounded px-3 py-1 text-sm"
                            value={selectedFormat}
                            onChange={handleFormat}
                        >
                            <option>Normal</option>
                            <option>Heading 1</option>
                            <option>Heading 2</option>
                            <option>Heading 3</option>
                        </select>
                    </div>
                    <button
                        className={`text-gray-500 cursor-pointer p-1 ${activeFormats.bold ? 'bg-gray-200' : ''}`}
                        onClick={handleBold}
                    >
                        <Bold size={18} />
                    </button>
                    <button
                        className={`text-gray-500 cursor-pointer p-1 ${activeFormats.italic ? 'bg-gray-200' : ''}`}
                        onClick={handleItalic}
                    >
                        <Italic size={18} />
                    </button>
                    <button className="text-gray-500 p-1" onClick={handleLink}>
                        <Link size={18} />
                    </button>
                    <button
                        className={`text-gray-500 p-1 ${activeFormats.list ? 'bg-gray-200' : ''}`}
                        onClick={handleUnorderedList}
                    >
                        <List size={18} />
                    </button>
                    <button
                        className={`text-gray-500 p-1 ${activeFormats.orderedList ? 'bg-gray-200' : ''}`}
                        onClick={handleOrderedList}
                    >
                        <ListOrdered size={18} />
                    </button>
                </div>
            </div>

            {/* Rich Text Editor Area - Now takes remaining space */}
            <div 
                className="flex-1 p-4 outline-none overflow-y-auto animate-fadeInLeft [animation-delay:500px]"
                ref={editorRef}
                onClick={handleEditorClick}
                onInput={handleEditorInput}
                onMouseUp={checkFormatting}
                onKeyUp={checkFormatting}
                style={{ minHeight: '200px' }}
            />

            {/* Update Button - Fixed at bottom */}
            <div className="p-4 flex justify-end border-t border-gray-200 animate-fadeInLeft [animation-delay:600ms] mt-auto">
                <button
                    className="bg-[#1A73E8] cursor-pointer text-md hover:bg-blue-600 text-white font-medium py-2 px-8 rounded-sm"
                    onClick={() => saveCurrentNotes(true)}
                >
                    Update EMR
                </button>
            </div>
        </div>
    );
};

export default Notepad;