import React from 'react';

const StatCard = ({ title, value, icon }) => {
  return (
    <div className="card">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="h-10 w-10 rounded-md bg-indigo-500 text-white flex items-center justify-center">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={icon} />
              </svg>
            </div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd>
                <div className="text-lg font-medium text-gray-900">{value}</div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatCard;