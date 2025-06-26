import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import { closeSlideOver } from '../store/slices/uiSlice';
import { updateVariable } from '../store/slices/variablesSlice';
import { XMarkIcon } from '@heroicons/react/24/outline';

const SlideOverCard = () => {
  const dispatch = useDispatch();
  const { variables } = useSelector((state: RootState) => state.variables);

  const handleClose = () => {
    dispatch(closeSlideOver());
  };

  const handleVariableChange = (variableId: string, value: number) => {
    dispatch(updateVariable({ id: variableId, value }));
  };

  return (
    <div className="fixed inset-0 overflow-hidden z-50">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        onClick={handleClose}
      />
      
      {/* Slide-over panel */}
      <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
        <div className="w-screen max-w-md">
          <div className="h-full flex flex-col bg-white shadow-xl">
            {/* Header */}
            <div className="px-4 py-6 bg-gray-50 sm:px-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">Edit Variables</h2>
                <button
                  type="button"
                  className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  onClick={handleClose}
                >
                  <span className="sr-only">Close panel</span>
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="relative flex-1 px-4 sm:px-6 overflow-y-auto">
              <div className="space-y-6 py-6">
                {variables.map((variable) => (
                  <div key={variable.id} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        {variable.name}
                      </label>
                      <p className="mt-1 text-sm text-gray-500">{variable.description}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Current: {variable.value} {variable.unit}</span>
                        <span>Range: {variable.min} - {variable.max}</span>
                      </div>
                      
                      <input
                        type="range"
                        min={variable.min}
                        max={variable.max}
                        step={(variable.max - variable.min) / 100}
                        value={variable.value}
                        onChange={(e) => handleVariableChange(variable.id, parseFloat(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                      />
                      
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{variable.min} {variable.unit}</span>
                        <span>{variable.max} {variable.unit}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="flex-shrink-0 px-4 py-4 flex justify-end space-x-3 bg-gray-50">
              <button
                type="button"
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={handleClose}
              >
                Cancel
              </button>
              <button
                type="button"
                className="bg-indigo-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={handleClose}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlideOverCard; 