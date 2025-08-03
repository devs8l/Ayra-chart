// FollowUpText.js
import React, { useContext } from 'react';
import { X } from 'lucide-react';
import { ChatContext } from '../context/ChatContext';

const FollowUpText = ({ selectedText }) => {
    

    return (
        <div className="w-full mb-2 px-2">
            <div className="flex flex-wrap gap-2">
                <h2>{selectedText}</h2>
            </div>
        </div>
    );
};

export default FollowUpText;