import React, { useState, useContext } from 'react';
import { Plus, Download } from 'lucide-react';

// Mock context for demonstration - replace with your actual MedContext
const MedContext = React.createContext({
  selectedUser: null,
  isUserSelected: false
});

const Billingcode = () => {
    const { selectedUser, isUserSelected } = useContext(MedContext);
    
    // Temporary data - replace with actual data from props or context
    const [billingCodes, setBillingCodes] = useState([
        {
            id: 1,
            code: 'R53.83',
            type: 'ICD-10',
            description: 'Other Fatigue',
            status: true
        },
        {
            id: 2,
            code: 'M79.7',
            type: 'ICD-10',
            description: 'Fibromyalgia',
            status: false
        },
        {
            id: 3,
            code: 'R63.0',
            type: 'ICD-10',
            description: 'Anorexia (loss of appetite)',
            status: false
        },
        {
            id: 4,
            code: 'G47.00',
            type: 'ICD-10',
            description: 'Insomnia, unspecified',
            status: false
        },
        {
            id: 5,
            code: 'R06.00',
            type: 'ICD-10',
            description: 'Dyspnea, unspecified',
            status: false
        },
        {
            id: 6,
            code: 'M25.60',
            type: 'ICD-10',
            description: 'Stiffness of unspecified joint',
            status: false
        },
        {
            id: 7,
            code: 'R50.9',
            type: 'ICD-10',
            description: 'Fever, unspecified',
            status: false
        },
        {
            id: 8,
            code: 'R20.8',
            type: 'ICD-10',
            description: 'Other disturbances of skin s...',
            status: false
        }
    ]);

    const handleStatusChange = (id) => {
        setBillingCodes(prev => 
            prev.map(code => 
                code.id === id ? { ...code, status: !code.status } : code
            )
        );
    };

    const handleAddCode = () => {
        // Future implementation for adding new codes
        console.log('Add new billing code');
    };

    const handleDownloadPDF = () => {
        // Future implementation for PDF download
        console.log('Download as PDF');
    };

    const handleUpdateEMR = () => {
        // Future implementation for EMR update
        console.log('Update EMR');
    };

    const getTypeColor = (type) => {
        switch (type) {
            case 'ICD-10':
                return 'bg-blue-100 text-blue-800';
            case 'CPT':
                return 'bg-orange-100 text-orange-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="flex flex-col h-full bg-white">
            {/* Header with checkbox */}
            <div className="flex items-center gap-2 p-4 border-b border-gray-200">
                <input 
                    type="checkbox" 
                    id="generate" 
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500" 
                    defaultChecked 
                />
                <label htmlFor="generate" className="text-sm text-gray-900">
                    Generate Codes and review <span className="text-gray-500">(beta)</span>
                </label>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-6 p-4 border-b border-gray-200">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">ICD-10</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">CPT</span>
                </div>
                <button 
                    onClick={handleAddCode}
                    className="ml-auto flex items-center gap-2 px-3 py-1 text-sm text-gray-600 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Add
                </button>
            </div>

            {/* Scrollable Table Container - Takes remaining space */}
            <div className="flex-1 overflow-hidden ">
                <div className="h-full overflow-y-auto">
                    <table className="w-full">
                        <thead className="bg-white sticky top-0 border-b border-gray-200">
                            <tr className="divide-x divide-gray-200">
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Code
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Type
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Description
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {billingCodes.map((code) => (
                                <tr key={code.id} className="hover:bg-gray-50 divide-x divide-gray-200">
                                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                        {code.code}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${
                                                code.type === 'ICD-10' ? 'bg-blue-500' : 'bg-orange-500'
                                            }`}></div>
                                            <span className="text-sm text-gray-900">{code.type}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-900">
                                        {code.description}
                                    </td>
                                    <td className="px-4 py-3">
                                        <input
                                            type="checkbox"
                                            checked={code.status}
                                            onChange={() => handleStatusChange(code.id)}
                                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Fixed Action buttons at bottom */}
            <div className="flex gap-2 justify-end items-center p-4 border-t border-gray-200 mt-auto">
                <button 
                    onClick={handleDownloadPDF}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition-colors"
                >
                    <Download className="w-4 h-4" />
                    Download as PDF
                </button>
                <button 
                    onClick={handleUpdateEMR}
                    className="bg-[#1A73E8] cursor-pointer text-md hover:bg-blue-600 text-white font-medium py-2 px-8 rounded-sm"
                >
                    Update EMR
                </button>
            </div>
        </div>
    );
};

export default Billingcode;