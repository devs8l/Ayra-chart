import React, { useContext } from 'react';
import { MedContext } from '../context/MedContext';

const SummaryNoteBox = ({
    boxwidth = '1/2',
    lineclamp = true,
    marginTop = '10',
    messageId,
    currentVisit,
    handleSuggestionClick,
    setResponseConclusion
}) => {
    const {
        isSummaryBoxActive,
        setIsSummaryBoxActive,
        setActiveSummaryData,
        activeSummaryData
    } = useContext(MedContext);

    console.log("Current Visit Data:", currentVisit);
    

    const handleBoxClick = () => {
        if (!isSummaryBoxActive) {
            setActiveSummaryData({
                visitData: currentVisit,
                messageId
            });
        }
        setIsSummaryBoxActive(!isSummaryBoxActive);
    };

    const formatDate = (dateString) => {
        if (!dateString) return null;
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return null;

            const day = date.getDate();
            const month = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(date);
            const weekday = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(date);

            const getDaySuffix = (d) => {
                if (d >= 11 && d <= 13) return 'th';
                switch (d % 10) {
                    case 1: return 'st';
                    case 2: return 'nd';
                    case 3: return 'rd';
                    default: return 'th';
                }
            };

            return `${day}${getDaySuffix(day)} ${month} (${weekday})`;
        } catch (error) {
            console.error('Invalid date format:', dateString);
            return null;
        }
    };

    const getHeaderContent = () => {
        // Handle different types of visit data
        if (currentVisit?.visitType === 'medicalSummary') {
            return formatDate(currentVisit.date) || 'Visit';
        }
        if (currentVisit?.allergies) {
            return `Allergies: ${currentVisit.allergies}`;
        }
        if (currentVisit?.medicine?.name) {
            return `Medicine: ${currentVisit.medicine.name}`;
        }
        if (currentVisit?.problems) {
            return 'Problems';
        }
        if (currentVisit?.healthMetrics) {
            return `${currentVisit.healthMetrics.metric} Reading`;
        }
        if (currentVisit?.vaccines) {
            return `Vaccines: ${currentVisit.vaccines.name}`;
        }
        if (currentVisit?.vitalData) {
            return `Patient Vitals`;
        }
        if (currentVisit?.visitType === 'medicalVisit') {
            return (
                `Doctor Visit` + ` for ${currentVisit.diagnosis}` + ` on ${currentVisit.formattedDate} .`
            );
        }
        if( currentVisit?.visitType === 'chart') {
            return `${currentVisit.noteType}`;
        }
        return 'Summary';
    };

    const getContent = () => {
        if (currentVisit?.visitType === 'medicalSummary') {
            return currentVisit.notes;
        }
        if (currentVisit?.allergies) {
            return `Patient is allergic to: ${currentVisit.allergies}`;
        }
        if (currentVisit?.medicine?.name) {
            return `Prescribed ${currentVisit.medicine.name} (${currentVisit.medicine.dosage}) for ${currentVisit.medicine.diagnosis} - ${currentVisit.medicine.duration}`;
        }
        if (currentVisit?.problems) {
            return `Problems: ${currentVisit.problems.join(', ')}`;
        }
        if (currentVisit?.healthMetrics) {
            return `Patient noted ${currentVisit.healthMetrics.value} - ${currentVisit.healthMetrics.metric} on ${formatDate(currentVisit.healthMetrics.date)}`;
        }
        if (currentVisit?.vaccines) {
            if (currentVisit?.vaccines.status === 'Completed') {
                return `Patient was vaccinated with ${currentVisit?.vaccines.name} (${currentVisit?.vaccines.type}) on ${formatDate(currentVisit?.vaccines.date)}`;
              } else {
                return `Patient has ${currentVisit?.vaccines.name} (${currentVisit?.vaccines.type}) in progress, started on ${formatDate(currentVisit?.vaccines.date)}`;
              }
        }
        if (currentVisit?.vitalData) {
            return `Patient's ${currentVisit.vitalData.vitalName}: ${currentVisit.vitalData.vitalValue}`;
        }
        
        if (currentVisit?.visitType === 'medicalVisit') {
            // Format prescriptions if they exist
            const prescriptionsText = currentVisit.prescriptions?.length
                ? `Prescribed: ${currentVisit.prescriptions.map(p =>
                    `${p.medicine} (${p.dosage} for ${p.duration})`
                ).join(', ')}. `
                : '';

            // Format treatments if they exist
            const treatmentsText = currentVisit.treatments?.length
                ? `Treatments performed: ${currentVisit.treatments.map(t =>
                    `${t.procedure} with result: ${t.result}`
                ).join('; ')}. `
                : '';

            // Format notes if they exist
            const notesText = currentVisit.notes
                ? `Clinical notes: ${currentVisit.notes}. `
                : '';

            return (
                `Medical visit with Dr. ${currentVisit.doctor.name} (${currentVisit.doctor.specialization}) ` +
                `on ${currentVisit.formattedDate}. ` +
                `Primary diagnosis: ${currentVisit.diagnosis}. ` +
                `Consultation duration: ${currentVisit.duration}. ` +
                prescriptionsText +
                treatmentsText +
                notesText
            );
        }
        if( currentVisit?.visitType === 'chart') {
            return `${currentVisit.notes}`;
        }
        return 'No content available';
    };

    const imgUrl = isSummaryBoxActive ? "/collapse.svg" : "/stretch.svg";

    return (
        <div className={`w-${boxwidth} mb-4  mt-${marginTop} animate-fadeInUp relative`}>
            <div className={`${isSummaryBoxActive ? '' : 'white-grad'} absolute top-0 left-0 w-full h-full`}></div>
            <div className="rounded-lg shadow-md overflow-hidden border border-gray-300 relative">
                <div className="bg-white py-4">
                    <div className="flex justify-between items-center border-b border-gray-300 px-6 py-2">
                        <div className="font-medium text-gray-800 mb-3">
                            {getHeaderContent()}
                        </div>
                        <button
                            onClick={handleBoxClick}
                            className="text-gray-500 hover:text-gray-700 cursor-pointer mb-3"
                        >
                            <img src={imgUrl} alt={isSummaryBoxActive ? "Collapse" : "Expand"} />
                        </button>
                    </div>

                    <div className={`mt-3 px-6 py-2 ${isSummaryBoxActive ? 'text-gray-800' : 'text-[#9BA2AD]'} ${lineclamp ? 'line-clamp-1' : ''}`}>
                        {getContent()}
                    </div>
                </div>
                <div className="absolute left-0 top-0 h-full w-1 bg-[#1A73E880] rounded-l-lg"></div>
            </div>
        </div>
    );
};

export default SummaryNoteBox;