import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center h-64">
      <div className="loading-spinner rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
  );
};

export default LoadingSpinner;