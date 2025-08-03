import React, { useState, useEffect } from 'react';
import { Check, Loader2 } from 'lucide-react';

const LoadingSteps = ({ isPatientSpecific = false }) => {
    const [activeSteps, setActiveSteps] = useState([]);
    const steps = isPatientSpecific
        ? [
            "Opening profile",
            "Skimming prescription records",
            "Matching records"
        ]
        : [
            "Analyzing your query",
            "Processing system data",
            "Compiling insights"
        ];

    useEffect(() => {
        // Fast completion for first step (500ms)
        const timer1 = setTimeout(() => {
            setActiveSteps(prev => [...prev, 0]);
        }, 300);

        // Medium speed for second step (1500ms)
        const timer2 = setTimeout(() => {
            setActiveSteps(prev => [...prev, 1]);
        }, 1200);

        // Slow completion for last step (3000ms)
        const timer3 = setTimeout(() => {
            setActiveSteps(prev => [...prev, 2]);
        }, 3000);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
            clearTimeout(timer3);
        };
    }, []);

    return (
        <div className="flex justify-start">
            <div className="text-gray-800 max-w-[90%] sm:max-w-[85%] md:max-w-[80%] lg:max-w-[80%] xl:max-w-[80%] rounded-xl p-3 sm:p-3 md:p-4 lg:p-4 xl:p-4">
                <div className="flex items-center space-x-5 mb-2">
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="h-8 object-cover"
                        src="/loading-star.mkv"
                    >
                       

                    </video>
                    <span className="text-sm font-medium text-gray-600">
                        Ayra is processing your query...
                    </span>
                </div>

                <div className="space-y-2 ml-12 border-l border-gray-300 pl-4">
                    {steps.map((step, index) => {
                        const isActive = activeSteps.includes(index);
                        const isCompleted = activeSteps.some(stepIdx => stepIdx > index);

                        return (
                            <div
                                key={index}
                                className={`flex items-center transition-colors duration-300 ${isActive || isCompleted ? 'text-blue-500' : 'text-gray-400'}`}
                            >
                                <span className="text-xs sm:text-sm">
                                    {step}
                                </span>
                                <div className="w-5 h-5 flex items-center justify-center mr-2">
                                    {isCompleted ? (
                                        <Check className="w-3.5 h-3.5 text-blue-500" />
                                    ) : isActive ? (
                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    ) : (
                                        <div className="" />
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default LoadingSteps;