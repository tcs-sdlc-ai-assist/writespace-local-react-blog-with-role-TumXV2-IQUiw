import React from 'react';

export default function StatCard({ label, value, icon }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 flex items-center gap-4">
      {icon && (
        <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 text-xl">
          {icon}
        </div>
      )}
      <div className="flex flex-col">
        <span className="text-2xl font-bold text-gray-800">{value}</span>
        <span className="text-sm text-gray-500">{label}</span>
      </div>
    </div>
  );
}