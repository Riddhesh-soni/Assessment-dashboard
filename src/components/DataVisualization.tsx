import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import type { Variable } from '../store/slices/variablesSlice';

interface DataVisualizationProps {
  variables: Variable[];
  onDataPointHover: (dataPoint: any) => void;
  onDataPointLeave: () => void;
}

const DataVisualization = ({ variables, onDataPointHover, onDataPointLeave }: DataVisualizationProps) => {
  // Generate sample data based on active variables
  const activeVariables = variables.filter(v => v.isActive);
  
  const generateData = () => {
    const data = [];
    for (let i = 0; i < 12; i++) {
      const dataPoint: any = { time: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][i] };
      activeVariables.forEach(variable => {
        let value = variable.value;
        if (variable.name === 'Temperature') {
          value = 20 + Math.sin(i * Math.PI / 6) * 10 + (Math.random() - 0.5) * 5;
        } else if (variable.name === 'Humidity') {
          value = 50 + Math.cos(i * Math.PI / 6) * 20 + (Math.random() - 0.5) * 10;
        } else if (variable.name === 'Pressure') {
          value = 1013 + Math.sin(i * Math.PI / 3) * 5 + (Math.random() - 0.5) * 3;
        } else if (variable.name === 'Wind Speed') {
          value = 10 + Math.abs(Math.sin(i * Math.PI / 4)) * 15 + (Math.random() - 0.5) * 8;
        }
        dataPoint[variable.name] = Math.round(value * 100) / 100;
      });
      data.push(dataPoint);
    }
    return data;
  };

  const data = generateData();

  // Neon/lime/yellow colors for lines
  const colors = ['#D4FF3F', '#F7FF00', '#00FFC6', '#FFB800', '#8B5CF6'];

  const handleMouseMove = (event: any) => {
    if (event.activePayload && event.activePayload[0]) {
      const dataPoint = {
        ...event.activePayload[0].payload,
        variable: event.activePayload[0].dataKey,
        value: event.activePayload[0].value,
      };
      onDataPointHover(dataPoint);
    }
  };

  const handleMouseLeave = () => {
    onDataPointLeave();
  };

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis 
            dataKey="time" 
            stroke="#fff"
            fontSize={13}
            tick={{ fill: '#fff' }}
          />
          <YAxis 
            stroke="#fff"
            fontSize={13}
            tick={{ fill: '#fff' }}
            axisLine={{ stroke: '#fff' }}
            tickLine={{ stroke: '#fff' }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: '#18191A',
              border: '1px solid #D4FF3F',
              borderRadius: '8px',
              color: '#fff',
            }}
            labelStyle={{ color: '#D4FF3F' }}
            itemStyle={{ color: '#fff' }}
          />
          {activeVariables.map((variable, index) => (
            <Line
              key={variable.id}
              type="monotone"
              dataKey={variable.name}
              stroke={colors[index % colors.length]}
              strokeWidth={2}
              dot={{ fill: colors[index % colors.length], strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: colors[index % colors.length], strokeWidth: 2 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-4">
        {activeVariables.map((variable, index) => (
          <div key={variable.id} className="flex items-center space-x-2">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: colors[index % colors.length] }}
            />
            <span className="text-sm text-gray-100">{variable.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DataVisualization; 