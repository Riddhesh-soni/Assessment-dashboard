import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import { toggleVariable, setSelectedVariable } from '../store/slices/variablesSlice';
import { setHoveredVariable } from '../store/slices/uiSlice';
import type { Variable } from '../store/slices/variablesSlice';

interface VariablesPanelProps {
  variables: Variable[];
}

const VariablesPanel = ({ variables }: VariablesPanelProps) => {
  const dispatch = useDispatch();
  const { selectedVariableId, hoveredVariableId } = useSelector((state: RootState) => ({
    selectedVariableId: state.variables.selectedVariableId,
    hoveredVariableId: state.ui.hoveredVariableId,
  }));

  const handleVariableToggle = (variableId: string) => {
    dispatch(toggleVariable(variableId));
  };

  const handleVariableHover = (variableId: string | null) => {
    dispatch(setHoveredVariable(variableId));
  };

  const handleVariableSelect = (variableId: string) => {
    dispatch(setSelectedVariable(variableId));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Variables Panel</h3>
      <div className="space-y-3">
        {variables.map((variable) => (
          <div
            key={variable.id}
            className={`relative p-4 rounded-lg border transition-all duration-200 cursor-pointer ${
              variable.isActive
                ? 'border-indigo-200 bg-indigo-50'
                : 'border-gray-200 bg-gray-50'
            } ${
              selectedVariableId === variable.id
                ? 'ring-2 ring-indigo-500'
                : ''
            }`}
            onClick={() => handleVariableSelect(variable.id)}
            onMouseEnter={() => handleVariableHover(variable.id)}
            onMouseLeave={() => handleVariableHover(null)}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h4 className="text-sm font-medium text-gray-900">{variable.name}</h4>
                  <span className="text-xs text-gray-500">{variable.unit}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{variable.value}</p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleVariableToggle(variable.id);
                }}
                className={`w-4 h-4 rounded-full border-2 transition-colors ${
                  variable.isActive
                    ? 'bg-indigo-600 border-indigo-600'
                    : 'bg-white border-gray-300'
                }`}
              >
                {variable.isActive && (
                  <svg className="w-2 h-2 text-white mx-auto" fill="currentColor" viewBox="0 0 8 8">
                    <path d="M6.564.75l-3.59 3.612-1.538-1.55L0 4.26 2.974 7.25 8 2.193z" />
                  </svg>
                )}
              </button>
            </div>

            {/* Hover Tooltip */}
            {hoveredVariableId === variable.id && (
              <div className="absolute z-10 left-full ml-2 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-xs rounded-lg px-3 py-2 max-w-xs">
                <p className="font-medium">{variable.name}</p>
                <p className="text-gray-300 mt-1">{variable.description}</p>
                <p className="text-gray-300 mt-1">
                  Range: {variable.min} - {variable.max} {variable.unit}
                </p>
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45"></div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default VariablesPanel; 