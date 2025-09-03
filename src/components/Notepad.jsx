import React, { useState, useRef, useEffect, useContext } from 'react';
import { ChevronDown, ChevronUp, Bold, Italic, Link, List, ListOrdered, Undo, Redo } from 'lucide-react';
import { MedContext } from "../context/MedContext";
import { showUserToast } from './CustomToast';
import { generatePatientPDF, notesPDF } from '../Services/pdfGenerator';

const Notepad = ({dashboardData}) => {
    const {
        selectedUser,
        isUserSelected,
        transcriptText,
        isGeneratePreChartClicked, setIsGeneratePreChartClicked
    } = useContext(MedContext);

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [pdfDropupOpen, setPdfDropupOpen] = useState(false);
    const [selectedFormat, setSelectedFormat] = useState("Normal");
    const [updateFromTranscript, setUpdateFromTranscript] = useState(false);
    const editorRef = useRef(null);
    const [activeFormats, setActiveFormats] = useState({
        bold: false,
        italic: false,
        list: false,
        orderedList: false
    });
    const [showPlaceholder, setShowPlaceholder] = useState(true);
    const [userNotes, setUserNotes] = useState(() => {
        const savedNotes = localStorage.getItem('userNotes');
        return savedNotes ? JSON.parse(savedNotes) : {};
    });
    const [currentNote, setCurrentNote] = useState({
        title: '',
        content: ''
    });

    useEffect(() => {
        if (isUserSelected && selectedUser) {
            const userId = selectedUser._id || selectedUser.id;
            if (userId) {
                const userNote = userNotes[userId] || {
                    title: `${selectedUser.name}'s Notes`,
                    content: ''
                };

                setCurrentNote(userNote);

                if (editorRef.current) {
                    editorRef.current.innerHTML = userNote.content;
                    setShowPlaceholder(userNote.content === '' || userNote.content.trim() === '');
                }
            }
        } else {
            setCurrentNote({
                title: 'General Notes',
                content: ''
            });

            if (editorRef.current) {
                editorRef.current.innerHTML = '';
                setShowPlaceholder(true);
            }
        }
    }, [selectedUser, isUserSelected]);

    useEffect(() => {
        localStorage.setItem('userNotes', JSON.stringify(userNotes));
    }, [userNotes]);

    useEffect(() => {
        if (updateFromTranscript && transcriptText && editorRef.current) {
            const currentContent = editorRef.current.innerHTML;
            const transcriptContent = transcriptText.replace(/\n/g, '<br/>');

            if (showPlaceholder || currentContent.trim() === '') {
                editorRef.current.innerHTML = transcriptContent;
                updateNoteContent(transcriptContent);
                setShowPlaceholder(false);
            } else {
                editorRef.current.innerHTML += `<br/><br/>${transcriptContent}`;
                updateNoteContent(currentContent + `<br/><br/>${transcriptContent}`);
            }
        }
    }, [updateFromTranscript, transcriptText, isGeneratePreChartClicked]);

    const PRECHART_TEMPLATE = `<b>CLINICAL OVERVIEW:</b>
- 35-year-old female presenting for pre-chemo checkup prior to 3rd cycle
- Previously tolerated 2 cycles of chemotherapy (Doxorubicin and Cyclophosphamide)
- Primary diagnosis: Breast Cancer
- Side effects reported: Moderate nausea, moderate fatigue, severe hair loss
- No critical alerts at this time (continuous monitoring recommended)
<br/>
<br/>

<b>BLOOD ESSENTIALS:</b>
- WBC: 4.2 x 10³/μL
- RBC: 4.5 x 10¹²/L
- Hemoglobin: 10.2 g/dL (Critical)
- PLT: 145 x 10³/μL
- CA 15-3: 35 U/mL (Critical)
- NT-proBNP: 420 pg/mL (Critical)
- LVEF: 49%
<br/>
<br/>

<b>CURRENT TREATMENT:</b>
- Doxorubicin 60 mg/m²
- Cyclophosphamide 600 mg/m²
- Ondansetron 8 mg (for nausea)
- Vitamin B12 1000 mcg
<br/>
<br/>

<b>TREATMENT RESPONSE:</b>
- 26.5% tumor reduction (current size: 2.5 cm)
- WBC recovery from nadir of 3.3 x 10³/μL (post-Cycle 1) to 4.2 x 10³/μL
<br/>
<br/>

<b>VITAL SIGNS:</b>
- BP: 120/80 mmHg
- Blood Sugar: 95 mg/dL
- O2 Saturation: 97%
- Heart Rate: 72 bpm
<br/>
<br/>

<b>HEMATOLOGICAL STATUS:</b>
- WBC: 4.2 x 10³/μL (Normal)
- ANC: 2.7 x 10³/μL (Normal)
- Hemoglobin: 10.2 g/dL (Critical)
- Platelets: 220 x 10³/μL (Non-Critical)
- WBC Nadir (Cycle 1): 1.8 x 10³/μL (Normal)
- ANC Nadir (Cycle 2): 0.9 x 10³/μL (Normal)
<br/>
<br/>

<b>PLAN:</b>
- Continue current chemotherapy regimen
- Monitor for myelosuppression
- Manage side effects (anti-emetics for nausea)
- Schedule next cycle as planned
- Follow-up blood work prior to next cycle`;

    useEffect(() => {
        if (isGeneratePreChartClicked && editorRef.current) {
            editorRef.current.innerHTML = PRECHART_TEMPLATE;
            updateNoteContent(PRECHART_TEMPLATE);
            setShowPlaceholder(false);
        }
    }, [isGeneratePreChartClicked]);

    useEffect(() => {
        if (editorRef.current) {
            editorRef.current.contentEditable = true;
            editorRef.current.focus();
        }
    }, []);

    const handlePaste = (e) => {
        e.preventDefault();

        if (showPlaceholder) {
            editorRef.current.innerHTML = '';
            setShowPlaceholder(false);
        }

        const text = (e.clipboardData || window.clipboardData).getData('text/plain');
        document.execCommand('insertText', false, text);

        if (editorRef.current) {
            updateNoteContent(editorRef.current.innerHTML);
        }
    };

    const updateNoteContent = (content) => {
        setCurrentNote(prev => ({
            ...prev,
            content: content
        }));
    };

    const saveCurrentNotes = (showToast = false) => {
        if (editorRef.current) {
            const content = editorRef.current.innerHTML;
            updateNoteContent(content);

            if (isUserSelected && selectedUser) {
                const userId = selectedUser._id || selectedUser.id;
                if (userId) {
                    if (showToast) {
                        editorRef.current.innerHTML = '';
                        setShowPlaceholder(true);

                        const clearedContent = '';
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

    const checkFormatting = () => {
        setActiveFormats({
            bold: document.queryCommandState('bold'),
            italic: document.queryCommandState('italic'),
            list: document.queryCommandState('insertUnorderedList'),
            orderedList: document.queryCommandState('insertOrderedList')
        });
    };

    const execCommand = (command, value = null) => {
        if (showPlaceholder) {
            editorRef.current.innerHTML = '';
            setShowPlaceholder(false);
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
        if (showPlaceholder) {
            editorRef.current.innerHTML = '';
            updateNoteContent('');
            setShowPlaceholder(false);
            editorRef.current.focus();
        }
    };

    const handleEditorInput = (e) => {
        if (editorRef.current) {
            const content = editorRef.current.innerHTML;
            const isEmpty = content === '' || content === '<br>' || content.trim() === '';

            if (isEmpty && !showPlaceholder) {
                setShowPlaceholder(true);
            } else if (!isEmpty && showPlaceholder) {
                setShowPlaceholder(false);
            }

            updateNoteContent(content);
        }
    };

    const handleEditorKeyDown = (e) => {
        if (showPlaceholder && (e.key.length === 1 || e.key === 'Enter' || e.key === 'Backspace')) {
            editorRef.current.innerHTML = '';
            setShowPlaceholder(false);
        }
    };

    const getTitlePlaceholder = () => {
        if (isUserSelected && selectedUser) {
            return `${selectedUser.name}'s notes`;
        }
        return "General notes";
    };

    const handlePdfDropupToggle = () => {
        setPdfDropupOpen(!pdfDropupOpen);
    };

    const handlePdfOptionClick = async(option) => {
        console.log(`Selected: ${option}`);
        setPdfDropupOpen(false);
        if (option === 'Pre-Chart') {
            if (!dashboardData) return;
                const patientData = {
                    name: dashboardData.patientInfo.name,
                    age: dashboardData.patientInfo.age,
                    gender: dashboardData.patientInfo.gender,
                    diagnosis: dashboardData.patientInfo.diagnosis,
                };

                const pdf = await generatePatientPDF(patientData);
                pdf.save(`${patientData.name}_medical_report.pdf`);
        }
        else if (option === 'Notes') {
            if (!dashboardData) return;
            const patientData = {
                name: dashboardData.patientInfo.name,
                age: dashboardData.patientInfo.age,
                gender: dashboardData.patientInfo.gender,
                diagnosis: dashboardData.patientInfo.diagnosis,
            };

            const pdf = await notesPDF(patientData,PRECHART_TEMPLATE);
            pdf.save(`${patientData.name}_clinical_notes-from-notes.pdf`);
        }
    };

    return (
        <div className="flex flex-col h-full bg-white   overflow-hidden">
            

            {/* Formatting Toolbar */}
            <div className="w-full p-3 border-b border-gray-200 bg-white">
                <div className="flex items-center gap-2 flex-wrap">
                    <button className="text-gray-500 p-1 hover:bg-gray-100 rounded" onClick={handleUndo}>
                        <Undo size={18} />
                    </button>
                    <button className="text-gray-500 p-1 hover:bg-gray-100 rounded" onClick={handleRedo}>
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
                        className={`text-gray-500 cursor-pointer p-1 rounded ${activeFormats.bold ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                        onClick={handleBold}
                    >
                        <Bold size={18} />
                    </button>
                    <button
                        className={`text-gray-500 cursor-pointer p-1 rounded ${activeFormats.italic ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                        onClick={handleItalic}
                    >
                        <Italic size={18} />
                    </button>
                    <button className="text-gray-500 p-1 hover:bg-gray-100 rounded" onClick={handleLink}>
                        <Link size={18} />
                    </button>
                    <button
                        className={`text-gray-500 p-1 rounded ${activeFormats.list ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                        onClick={handleUnorderedList}
                    >
                        <List size={18} />
                    </button>
                    <button
                        className={`text-gray-500 p-1 rounded ${activeFormats.orderedList ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                        onClick={handleOrderedList}
                    >
                        <ListOrdered size={18} />
                    </button>
                </div>
            </div>

            {/* Rich Text Editor Area - Scrollable */}
            <div className="flex-1 overflow-y-auto relative">
                {showPlaceholder && (
                    <div className="absolute top-4 left-4 text-gray-400 pointer-events-none z-10">
                        Start typing notes manually, or click 'Generate Notes' to generate AI notes.
                    </div>
                )}
                <div
                    className="p-4 outline-none min-h-full"
                    ref={editorRef}
                    onClick={handleEditorClick}
                    onInput={handleEditorInput}
                    onKeyDown={handleEditorKeyDown}
                    onPaste={handlePaste}
                    onMouseUp={checkFormatting}
                    onKeyUp={checkFormatting}
                />
            </div>

            {/* Buttons - Fixed at bottom */}
            <div className="p-4 gap-3 flex justify-end border-t border-gray-200 bg-white">
                <div className="relative">
                    <button
                        onClick={handlePdfDropupToggle}
                        className="border-[#1A73E8] border flex items-center justify-center gap-3 cursor-pointer text-xs text-[#1A73E8] font-medium py-2 px-6 rounded-md hover:bg-blue-50 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 17 17" fill="none">
                            <path d="M8.5 12.5L3.5 7.5L4.9 6.05L7.5 8.65V0.5H9.5V8.65L12.1 6.05L13.5 7.5L8.5 12.5ZM2.5 16.5C1.95 16.5 1.47917 16.3042 1.0875 15.9125C0.695833 15.5208 0.5 15.05 0.5 14.5V11.5H2.5V14.5H14.5V11.5H16.5V14.5C16.5 15.05 16.3042 15.5208 15.9125 15.9125C15.5208 16.3042 15.05 16.5 14.5 16.5H2.5Z" fill="#1A73E8" />
                        </svg>
                        Download as PDF
                        <div className='border-l border-[#1a73e879] pl-2'>
                            {pdfDropupOpen ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
                        </div>
                    </button>

                    {/* PDF Dropup Menu */}
                    {pdfDropupOpen && (
                        <div className="absolute bottom-full left-0 mb-2 w-48 bg-[#3472C91A] border border-gray-200 rounded-lg shadow-lg z-10">
                            <div className="p-1 flex flex-col gap-1">
                                <button
                                    onClick={() => handlePdfOptionClick('Pre-Chart')}
                                    className="w-full text-left text-[#3472C9] bg-[#FBFCFE] cursor-pointer rounded-sm px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-3 transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                        <path d="M3.55556 12.4444H5.33333V6.22222H3.55556V12.4444ZM7.11111 12.4444H8.88889V3.55556H7.11111V12.4444ZM10.6667 12.4444H12.4444V8.88889H10.6667V12.4444ZM1.77778 16C1.28889 16 0.87037 15.8259 0.522222 15.4778C0.174074 15.1296 0 14.7111 0 14.2222V1.77778C0 1.28889 0.174074 0.87037 0.522222 0.522222C0.87037 0.174074 1.28889 0 1.77778 0H14.2222C14.7111 0 15.1296 0.174074 15.4778 0.522222C15.8259 0.87037 16 1.28889 16 1.77778V14.2222C16 14.7111 15.8259 15.1296 15.4778 15.4778C15.1296 15.8259 14.7111 16 14.2222 16H1.77778ZM1.77778 14.2222H14.2222V1.77778H1.77778V14.2222Z" fill="#3472C9" />
                                    </svg>
                                    Pre-Chart
                                </button>
                                <button
                                    onClick={() => handlePdfOptionClick('Notes')}
                                    className="w-full text-left text-[#3472C9] bg-[#FBFCFE] cursor-pointer rounded-sm px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-3 transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="17" viewBox="0 0 18 17" fill="none">
                                        <path d="M0 10.5V8.5H7V10.5H0ZM0 6.5V4.5H11V6.5H0ZM0 2.5V0.5H11V2.5H0ZM9 16.5V13.425L14.525 7.925C14.675 7.775 14.8417 7.66667 15.025 7.6C15.2083 7.53333 15.3917 7.5 15.575 7.5C15.775 7.5 15.9667 7.5375 16.15 7.6125C16.3333 7.6875 16.5 7.8 16.65 7.95L17.575 8.875C17.7083 9.025 17.8125 9.19167 17.8875 9.375C17.9625 9.55833 18 9.74167 18 9.925C18 9.74167 17.9667 9.79583 17.9 9.9875C17.8333 10.1792 17.725 10.35 17.575 10.5L12.075 16.5H9ZM10.5 15H11.45L14.475 11.95L14.025 11.475L13.55 11.025L10.5 14.05V15ZM14.025 11.475L13.55 11.025L14.475 11.95L14.025 11.475Z" fill="#3472C9" />
                                    </svg>
                                    Notes
                                </button>
                                <button
                                    onClick={() => handlePdfOptionClick('Chart + Notes')}
                                    className="w-full text-left text-[#3472C9] bg-[#FBFCFE] cursor-pointer rounded-sm px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-3 transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                        <path d="M3.2 9.6V11.2H1.6C1.16 11.2 0.783333 11.0433 0.47 10.73C0.156667 10.4167 0 10.04 0 9.6V1.6C0 1.16 0.156667 0.783333 0.47 0.47C0.783333 0.156667 1.16 0 1.6 0H9.6C10.04 0 10.4167 0.156667 10.73 0.47C11.0433 0.783333 11.2 1.16 11.2 1.6V3.2H9.6V1.6H1.6V9.6H3.2ZM6.4 16C5.96 16 5.58333 15.8433 5.27 15.53C4.95667 15.2167 4.8 14.84 4.8 14.4V6.4C4.8 5.96 4.95667 5.58333 5.27 5.27C5.58333 4.95667 5.96 4.8 6.4 4.8H14.4C14.84 4.8 15.2167 4.95667 15.53 5.27C15.8433 5.58333 16 5.96 16 6.4V14.4C16 14.84 15.8433 15.2167 15.53 15.53C15.2167 15.8433 14.84 16 14.4 16H6.4ZM6.4 14.4H14.4V6.4H6.4V14.4Z" fill="#3472C9" />
                                    </svg>
                                    Chart + Notes
                                </button>
                            </div>
                        </div>
                    )}
                </div>
                <button
                    className="bg-[#1A73E8] cursor-pointer text-xs hover:bg-blue-600 text-white font-medium py-2 px-8 rounded-sm transition-colors"
                    onClick={() => setIsGeneratePreChartClicked(true)}
                >
                    Generate Notes
                </button>
            </div>
        </div>
    );
};

export default Notepad;