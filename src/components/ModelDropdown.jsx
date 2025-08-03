import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

const ModelDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedModel, setSelectedModel] = useState('Model 1');
    const dropdownRef = useRef(null);

    const models = [
        { id: 1, name: 'Model 1' },
        { id: 2, name: 'Model 2' }
    ];

    // Handle click outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const selectModel = (modelName) => {
        setSelectedModel(modelName);
        setIsOpen(false);
    };

    return (
        <div className="relative w-36" ref={dropdownRef}>
            {/* Dropdown Button */}
            <button
                className="flex items-center justify-between w-full px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none"
                onClick={toggleDropdown}
                aria-haspopup="true"
                aria-expanded={isOpen}
            >
                <div className="flex items-center">
                    <div className="w-5 h-5 mr-2">
                        <img src="/star.svg" alt="" />
                    </div>
                    <span>{selectedModel}</span>
                </div>
                <ChevronDown className={`w-4 h-4 ml-2 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute z-10 top-[-10vh] w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                    <ul className="py-1">
                        {models.map((model) => (
                            <li key={model.id}>
                                <button
                                    className="flex items-center w-full px-3 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                                    onClick={() => selectModel(model.name)}
                                >
                                    <div className="w-5 h-5 mr-2">
                                        <img src="/star.svg" alt="" />
                                    </div>
                                    {model.name}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default ModelDropdown;