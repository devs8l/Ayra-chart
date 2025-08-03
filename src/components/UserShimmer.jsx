import React from 'react';

const UserShimmer = () => {
  return (
    <div className=" min-h-screen p-4">
      {/* Header Card (simplified) */}
      <div className="animate-pulse h-12 bg-gray-300 rounded-lg mb-4"></div>
      
      {/* User Info Card */}
      <div className="animate-pulse h-24 bg-gray-300 rounded-lg mb-4 border-l-4 border-green-400"></div>
      
      {/* Tabs (simplified) */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="animate-pulse h-12 bg-gray-300 rounded-lg"></div>
        <div className="animate-pulse h-12 bg-gray-300 rounded-lg"></div>
      </div>
      
      {/* Filter Row */}
      <div className="flex gap-2 mb-4">
        <div className="animate-pulse h-12 w-1/12 bg-gray-300 rounded-lg"></div>
        <div className="animate-pulse h-12 w-5/12 bg-gray-300 rounded-lg"></div>
        <div className="animate-pulse h-12 w-6/12 bg-gray-300 rounded-lg"></div>
      </div>
      
      {/* Content Area */}
      <div className="flex gap-2">
        <div className="w-1/12">
          <div className="animate-pulse h-full bg-gray-300 rounded-lg"></div>
        </div>
        <div className="w-11/12 space-y-4">
          {[1, 2, 3, 4, 5].map((_, index) => (
            <div key={index} className="animate-pulse h-16 bg-gray-300 rounded-lg"></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserShimmer;