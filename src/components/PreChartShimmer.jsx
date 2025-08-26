import React from 'react';

const PreChartShimmer = () => {
  return (
    <div className='flex flex-col items-center w-full h-full justify-start'>
      <div className="space-y-10 w-[90%] h-full mt-8">
        {/* Patient Overview Card */}
        <div className="animate-pulse">
          {/* Header with icon and title */}
          <div className="flex items-center gap-2 mb-4">
            <div className="w-5 h-5 bg-gray-300 rounded"></div>
            <div className="h-6 bg-gray-300 w-40 rounded"></div>
          </div>
          
          {/* Status indicators */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
              <div className="h-4 bg-gray-300 w-20 rounded"></div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
              <div className="h-4 bg-gray-300 w-32 rounded"></div>
            </div>
          </div>
          
          {/* Main content paragraph */}
          <div className="space-y-4 mb-4">
            <div className="h-4 bg-gray-300 w-full rounded"></div>
            <div className="h-4 bg-gray-300 w-4/5 rounded"></div>
          </div>
          
          {/* Last updated */}
          <div className="h-3 bg-gray-300 w-36 rounded mb-4"></div>
          
          {/* Arrow icon */}
          <div className="flex justify-end">
            <div className="w-4 h-4 bg-gray-300 rounded"></div>
          </div>
        </div>

        {/* Allergies Card */}
        <div className="animate-pulse">
          {/* Header with icon and title */}
          <div className="flex items-center gap-2 mb-4">
            <div className="w-5 h-5 bg-gray-300 rounded"></div>
            <div className="h-6 bg-gray-300 w-24 rounded"></div>
          </div>
          
          {/* Allergy count */}
          <div className="h-4 bg-gray-300 w-20 rounded mb-4"></div>
          
          {/* Allergy items grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* First allergy item */}
            <div className="bg-gray-100 p-6 rounded-lg">
              <div className="space-y-6">
                <div className="h-4 bg-gray-300 w-32 rounded"></div>
                <div className="h-4 bg-gray-300 w-16 rounded"></div>
              </div>
              <div className="flex justify-end mt-3">
                <div className="w-4 h-4 bg-gray-300 rounded"></div>
              </div>
            </div>
            
            {/* Second allergy item */}
            <div className="bg-gray-100 p-6 rounded-lg">
              <div className="space-y-6">
                <div className="h-4 bg-gray-300 w-32 rounded"></div>
                <div className="h-4 bg-gray-300 w-28 rounded"></div>
              </div>
              <div className="flex justify-end mt-3">
                <div className="w-4 h-4 bg-gray-300 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreChartShimmer;