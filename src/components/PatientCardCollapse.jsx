import { useContext, useState } from 'react';
import { MedContext } from '../context/MedContext';

const PatientCardCollapse = ({ userData }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const { setIsContentExpanded } = useContext(MedContext);

    return (
        <div className="fadeInRight rounded-lg h-full flex flex-col transition-all duration-300 ease-in-out w-full max-w-full overflow-hidden">
            {/* Header Section */}
            <div className="p-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-medium text-gray-800 truncate">Appointments</h2>
                    <button
                        onClick={() => setIsContentExpanded(true)}
                        className="flex-shrink-0 text-gray-500 p-2 rounded-full hover:text-gray-900 animate-fadeInLeft"
                    >
                        <img src="/notes.svg" className="w-5 h-5" alt="Notes" />
                    </button>
                </div>
                <p className="text-sm text-gray-600 mt-1 truncate">Today, 10:00 - 11:00</p>
            </div>

            {/* Main Content */}
            <div className="bg-[#ffffffc2] rounded-lg flex-grow flex flex-col mx-1">
                {/* Patient Profile Section */}
                <div className="p-4 border-b border-gray-200 relative before:absolute before:left-0 before:top-0
before:h-full before:w-1 before:bg-green-500 before:rounded-tl-lg before:z-10">
                    <div className="flex flex-col items-start gap-3 mb-4 ">
                        <div className="flex-shrink-0 h-12 w-12 rounded-full bg-gray-200 overflow-hidden">
                            <img
                                src='/avatar.png'
                                alt="Patient"
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                    e.currentTarget.src = '/default-profile.png';
                                    e.currentTarget.onerror = null;
                                }}
                            />
                        </div>
                        <div className="min-w-0 ">
                            <p className="text-sm text-primary-text truncate w-3/4">Name: <span className='text-body-text'>{userData.name}</span> </p>
                            <p className="text-sm text-primary-text truncate">Patient ID: <span className='text-body-text'>#{userData?._id?.slice(-6)}</span> </p>
                            <p className="text-sm text-primary-text truncate">MRN:<span className='text-body-text'> TEMP12345</span> </p>
                        </div>
                    </div>
                </div>

                {/* Patient Details Section */}
                <div className="p-4 border-b border-gray-200">
                    <p className="text-sm text-primary-text truncate w-3/4">Sex:<span className='text-body-text'>{userData.gender}</span> </p>
                    <p className="text-sm text-primary-text truncate">Weight:<span className='text-body-text'>64kg</span> </p>
                    <p className="text-sm text-primary-text truncate">Age:<span className='text-body-text'>32</span> </p>
                </div>

                {/* Metrics Section */}
                <div className="p-4 flex-grow">
                    <div className="flex flex-wrap gap-2">
                        <button className="flex items-center gap-2 text-xs sm:text-sm border border-gray-500 text-gray-500 rounded-xl px-2 py-0.5 min-w-0 overflow-hidden">
                            <img src="/bp.svg" className="w-4 h-4 flex-shrink-0" alt="Blood Pressure" />
                            <span className="truncate animate-fadeInUp">120/80 mmHg</span>
                        </button>
                        <button className="flex items-center gap-2 text-xs sm:text-sm border border-gray-500 text-gray-500 rounded-xl px-2 py-0.5 min-w-0 overflow-hidden">
                            <img src="/glucose.svg" className="w-4 h-4 flex-shrink-0" alt="Glucose" />
                            <span className="truncate animate-fadeInUp">95 mg/dL</span>
                        </button>
                        <button className="flex items-center gap-2 text-xs sm:text-sm border border-gray-500 text-gray-500 rounded-xl px-2 py-0.5 min-w-0 overflow-hidden">
                            <img src="/o2.svg" className="w-4 h-4 flex-shrink-0" alt="Oxygen" />
                            <span className="truncate animate-fadeInUp">98%</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PatientCardCollapse;