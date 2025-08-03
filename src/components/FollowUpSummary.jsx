import { useContext, useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { MedContext } from '../context/MedContext';
import ShimmerLoader from './ShimmerLoader';
import { getSummaryFollowUp } from '../Services/apiService';

export default function FollowUpSummary({ handleSuggestionClick, cachedFollowUps, currentVisit, messageId, questions, setCachedFollowUps, responseConclusion }) {
  const [activeTab, setActiveTab] = useState('actions');
  const [isLoading, setIsLoading] = useState(false);
  const [followUpItems, setFollowUpItems] = useState([]);
  const { isAllergysBoxSelected, } = useContext(MedContext)


  const trends = [
    "Blood pressure has been steadily decreasing over the last 3 visits",
    "Weight has fluctuated by 5% since initial consultation",
    "Medication adherence reported at 85% compliance"
  ];

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

  const getContent = () => {
    if (currentVisit?.visitType === 'medicalSummary') {
      return currentVisit.notes;
    }
    if (currentVisit?.allergies) {
      return `Patient is allergic to: ${currentVisit.allergies}`;
    }
    if (currentVisit?.name) {
      return `Prescribed ${currentVisit.name} (${currentVisit.dosage}) for ${currentVisit.diagnosis} - ${currentVisit.duration}`;
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
    return 'No content available';
  };


  const fetchData = async () => {
    setIsLoading(true);
    // try {
    //   const result = await getSummaryFollowUp(`${getContent()}+'question should be short and concise`);
    //   console.log("API Response:", result); // Debug log

    //   // Ensure we have questions or default to empty array
    //   questions = result?.questions || [];
    //   console.log("Questions to add:", questions); // Debug log
    //   setFollowUpItems(questions);
    // } catch (error) {
    //   console.error("Error getting follow-up:", error);
    // } finally {
    //   setIsLoading(false);
    //   console.log("Loading finished");
    // }
  }

  useEffect(() => {
    fetchData();
  }, [messageId, cachedFollowUps]);
  console.log("Cached Follow Ups:", cachedFollowUps);



  return (
    <div className="max-w-xl mt-15 ml-10 animate-fadeInUp">
      {/* Tabs */}
      <div className="flex gap-7">
        <button
          className={`py-2 px-0 font-medium text-sm ${activeTab === 'actions'
            ? 'text-gray-800 border-b-2 border-gray-800'
            : 'text-gray-500'
            }`}
          onClick={() => setActiveTab('actions')}
        >
          Actions
        </button>
        <button
          className={`py-2 px-0 font-medium text-sm ${activeTab === 'trends'
            ? 'text-gray-800 border-b-2 border-gray-800'
            : 'text-gray-500'
            }`}
          onClick={() => setActiveTab('trends')}
        >
          Trends
        </button>
      </div>

      {/* Content */}
      <div className="mt-8">
        {activeTab === 'actions' && (
          <div className="space-y-4">
            {isLoading ? (
              <ShimmerLoader />
            ) : followUpItems.length > 0 ? (
              followUpItems.map((item, index) => (
                <div
                  key={index}
                  onClick={() => handleSuggestionClick(item.question)}
                  className="cursor-pointer flex items-start gap-2 animate-fadeInUp"
                >
                  <img src="/arrow-follow.svg" alt="" />
                  <p className="text-sm text-gray-700">{item.question}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                No follow-up questions available
              </div>
            )}
          </div>
        )}

        {activeTab === 'trends' && (
          <div className="space-y-4">
            {trends.map((item, index) => (
              <div
                key={index}
                onClick={() => handleSuggestionClick(item)}
                className="cursor-pointer flex items-start gap-2 animate-fadeInUp"
              >
                <ArrowRight size={18} className="text-gray-500 mt-1 flex-shrink-0" />
                <p className="text-sm text-gray-700">{item}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}