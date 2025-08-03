import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { getSummaryFollowUp } from '../Services/apiService';
import ShimmerLoader from './ShimmerLoader';

export default function FollowUpTabs({ handleSuggestionClick, responseConclusion, messageId, cachedFollowUps, setCachedFollowUps }) {
  const [activeTab, setActiveTab] = useState('followUp');
  const [isLoading, setIsLoading] = useState(false);
  const [followUpItems, setFollowUpItems] = useState([]);

  const trends = [
    "Blood pressure has been steadily decreasing over the last 3 visits",
    "Weight has fluctuated by 5% since initial consultation",
    "Medication adherence reported at 85% compliance"
  ];
  useEffect(() => {
    if (cachedFollowUps && cachedFollowUps[messageId]) {
      setFollowUpItems(cachedFollowUps[messageId]);
    }
  }, [messageId, cachedFollowUps]);

  // Fetch data only if we don't have it cached and we have a conclusion
  useEffect(() => {
    if (responseConclusion && (!cachedFollowUps || !cachedFollowUps[messageId])) {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          const result = await getSummaryFollowUp(`${responseConclusion}+'question should be short and concise`);
          const newFollowUps = result.questions || [];
          setFollowUpItems(newFollowUps);

          // Update the cache
          if (setCachedFollowUps) {
            setCachedFollowUps(prev => ({
              ...prev,
              [messageId]: newFollowUps
            }));
          }
        } catch (error) {
          console.error(error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchData();
    }
  }, [responseConclusion, messageId, cachedFollowUps, setCachedFollowUps]);

  return (
    <div className="max-w-xl mt-5">
      {/* Tabs */}
      <div className="flex gap-7">
        <button
          className={`py-2 px-0 font-medium text-sm ${activeTab === 'followUp'
            ? 'text-gray-800 border-b-2 border-gray-800'
            : 'text-gray-500'
            }`}
          onClick={() => setActiveTab('followUp')}
        >
          Follow Up
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
        {activeTab === 'followUp' && (
          <div className="space-y-4">
            {isLoading ? (
              <ShimmerLoader/>
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