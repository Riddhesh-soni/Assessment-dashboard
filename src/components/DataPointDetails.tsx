import { useEffect, useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface DataPointDetailsProps {
  dataPoint: any;
  onClose: () => void;
}

const DataPointDetails = ({ dataPoint, onClose }: DataPointDetailsProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger fade-in animation
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 200); // Wait for fade-out animation
  };

  return (
    <div className="fixed inset-0 z-40 pointer-events-none">
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div
          className={`bg-white rounded-lg shadow-xl border border-gray-200 p-6 max-w-md w-full pointer-events-auto transition-all duration-200 ${
            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Data Point Details</h3>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Time</p>
                  <p className="text-lg font-semibold text-gray-900">{dataPoint.time}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Variable</p>
                  <p className="text-lg font-semibold text-gray-900">{dataPoint.variable}</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Current Value</p>
                  <p className="text-2xl font-bold text-blue-900">{dataPoint.value}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-blue-600">Status</p>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Normal
                  </span>
                </div>
              </div>
            </div>

            {/* Additional data points */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">All Values at {dataPoint.time}</h4>
              <div className="space-y-2">
                {Object.entries(dataPoint).map(([key, value]) => {
                  if (key !== 'time' && key !== 'variable' && typeof value === 'number') {
                    return (
                      <div key={key} className="flex justify-between items-center py-1">
                        <span className="text-sm text-gray-600">{key}</span>
                        <span className="text-sm font-medium text-gray-900">{value}</span>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-3 pt-4 border-t border-gray-200">
              <button
                onClick={handleClose}
                className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
              <button className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors">
                Export Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataPointDetails; 