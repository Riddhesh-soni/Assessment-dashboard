import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store/store';
import { openSlideOver, setHoveredDataPoint, closeSlideOver } from '../store/slices/uiSlice';
// import VariablesPanel from '../components/VariablesPanel';
// import DataVisualization from '../components/DataVisualization';
import SlideOverCard from '../components/SlideOverCard';
import DataPointDetails from '../components/DataPointDetails';
import { Battery100Icon, BoltIcon, SparklesIcon, ArrowPathRoundedSquareIcon, ArrowUpTrayIcon, ChevronUpIcon } from '@heroicons/react/24/solid';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from 'recharts';
import { QuestionMarkCircleIcon, ArrowUpIcon, CheckIcon } from '@heroicons/react/24/outline';
import {
  Bars3Icon,
  HomeIcon,
  BellIcon,
  CameraIcon,
  Cog6ToothIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';
import type { Label, TooltipProps } from 'recharts';
import type { CSSProperties } from 'react';

const chartData = [
  { month: 'Apr', value: 42000 },
  { month: 'May', value: 39000 },
  { month: 'Jun', value: 47000 },
  { month: 'Jul', value: 44000 },
  { month: 'Aug', value: 69000 },
  { month: 'Sep', value: 47000 },
  { month: 'Oct', value: 51000 },
];

const kpis = [
  {
    title: 'Infrastructure Units',
    value: '€421.07',
    desc: 'This value refers to the infrastructure units for this metric.',
  },
  {
    title: 'Charging Growth',
    value: '33.07',
    desc: 'This value refers to the charging growth for this metric.',
  },
  {
    title: 'Localization change',
    value: '21.9%',
    desc: 'This value refers to the localization change for this metric.',
  },
  {
    title: 'Fleet growth',
    value: '7.03%',
    desc: 'This value refers to the fleet growth for this metric.',
  },
];

const TOOLTIP_HEIGHT = 93; // px, matches your class
const TOOLTIP_MARGIN = 12; // px, space above the point

const CustomTooltip = ({ active, payload, label, coordinate }: any) => {
  if (active && payload && payload.length && coordinate) {
    const value = payload[0].value;
    const formattedValue = `$${(value / 1000).toFixed(2)}k`;
    const percent = 4.6; // Replace with your logic
    const percentLabel = 'above target'; // Replace with your logic

    // Position the tooltip above the data point
    const style: React.CSSProperties = {
      position: 'absolute',
      left: coordinate.x - 193 / 2, // center horizontally (193px is your tooltip width)
      top: coordinate.y - TOOLTIP_HEIGHT - TOOLTIP_MARGIN,
      pointerEvents: 'none',
      zIndex: 1000,
    };

    return (
      <div style={style} className="w-[193px] h-[93px] border border-[#525252] rounded-[5px] p-5 bg-[#22232433] backdrop-blur-[10px] flex flex-col gap-[10px]">
        <div className="flex items-center justify-between mb-1">
          <span className="text-white font-bold text-lg">{formattedValue}</span>
          <QuestionMarkCircleIcon className="w-4 h-4 text-[#BBBBBB]" />
        </div>
        <div className="flex items-center gap-2 text-[#B6FF6C] text-sm">
          <span className="w-4 h-4 flex items-center justify-center rounded-full border-2 border-[#D4FF3F] bg-[#232323]">
            <ArrowUpIcon className="w-4 h-4 text-[#D4FF3F]" />
          </span>
          <span>{percent}% {percentLabel}</span>
        </div>
      </div>
    );
  }
  return null;
};

// Reusable category section component
const CategorySection = ({
  title,
  buttons,
  selected,
  onSelect,
  setHoveredPill
}: {
  title: string;
  buttons: { id: string; label: string }[];
  selected: string[];
  onSelect: (id: string) => void;
  setHoveredPill: (id: string | null) => void;
}) => (
  <div className="mb-4">
    <div className="text-left font-inter font-medium text-[15px] leading-[150%] tracking-[-0.023em] text-[#D5D5D5] mb-2">
      {title}
    </div>
    <div className="flex flex-wrap gap-4">
      {buttons.map(({ id, label }) => {
        const isSelected = selected.includes(id);
        return (
          <button
            key={id}
            type="button"
            onClick={() => onSelect(id)}
            onMouseEnter={() => setHoveredPill(id)}
            onMouseLeave={() => setHoveredPill(null)}
            className={`flex items-center h-[33px] px-4 py-1 rounded-full font-medium text-[15px] gap-2 transition 
              top-[5px] right-[5px] bottom-[5px] left-[10px] gap-20px
            `}
            style={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 400,
              fontSize: '15px',
              lineHeight: '150%',
              letterSpacing: '-2%',
              backgroundColor: isSelected ? '#CCFF001A' : '#5959594D',
              borderRadius: '100px',
              border: isSelected ? '1px solid #C9FF3B' : '1px solid #EEEEEE',
              color: isSelected ? '#C8E972FD' : '#D5D5D5',
            }}
          >
            {/* Button Text */}
            <span className="flex-1 text-left">{label}</span>
            {/* Icons on the right */}
            <span className="flex items-center gap-2">
              {/* Sparkle Icon */}
              <span className={`flex items-center justify-center w-5 h-5 rounded-full p-[3px] ${!isSelected ? 'text-[#D5D5D5]' : 'text-[#C8E972FD]'}`}>
                <SparklesIcon className="size-[16px]" />
              </span>
              {/* Plus Icon */}
              <span className={`flex items-center justify-center w-5 h-5 rounded-full p-[3px]'}`}>
                
                {isSelected ? <CheckIcon className="size-[16px] text-[#C9FF3B]" /> : 
                <svg width="16" height="16" fill="none" color='#D5D5D5' viewBox="0 0 20 20">
                <path d="M10 4V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M4 10H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  </div>
);

function handleToggle(selected: string[], setSelected: (val: string[]) => void, id: string) {
  setSelected(
    selected.includes(id)
      ? selected.filter(selId => selId !== id)
      : [...selected, id]
  );
}

function getLabelById(id: string) {
  const allButtons = [...category1Buttons, ...category2Buttons, ...category3Buttons];
  return allButtons.find(btn => btn.id === id)?.label || '';
}

function getDescriptionById(id: string) {
  // Map ids to descriptions as needed
  if (id === 'cat1-2') return "But what truly sets Switch apart is its versatility. ...";
  // Add more cases for other ids
  return "No description available.";
}

const category1Buttons = [
  { id: 'cat1-1', label: 'Carbon 1' },
  { id: 'cat1-2', label: 'Co2 Distribution' },
  { id: 'cat1-3', label: 'Fleet sizing' },
];
const category2Buttons = [
  { id: 'cat2-1', label: 'Parking Rate' },
  { id: 'cat2-2', label: 'Border Rate' },
  { id: 'cat2-3', label: 'Request rate' },
  { id: 'cat2-4', label: 'Variable 1' },
  { id: 'cat2-5', label: 'Variable 2' },
  { id: 'cat2-6', label: 'Variable 3' },
];
const category3Buttons = [
  { id: 'cat3-1', label: 'Variable 4' },
  { id: 'cat3-2', label: 'Variable 5' },
  { id: 'cat3-3', label: 'Variable 6' },
];

export default function Dashboard() {
  const dispatch = useDispatch();
  const { isSlideOverOpen, hoveredDataPoint } = useSelector((state: RootState) => state.ui);
  const { variables } = useSelector((state: RootState) => state.variables);
  const [activeTab, setActiveTab] = useState('Charging Stations');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showNav, setShowNav] = useState(false);
  const [hoveredPill, setHoveredPill] = useState<string | null>(null);
  const [selectedPill, setSelectedPill] = useState<string>('Parking Rate');
  const [selectedCategory, setSelectedCategory] = useState<string>('Parking Rate');
  const [selectedCat1, setSelectedCat1] = useState<string[]>([]);
  const [selectedCat2, setSelectedCat2] = useState<string[]>([]);
  const [selectedCat3, setSelectedCat3] = useState<string[]>([]);

  useEffect(() => {
    if (isSlideOverOpen) {
      setSelectedIndex(0); // or last used
      setShowNav(true);
      const timer = setTimeout(() => setShowNav(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [isSlideOverOpen]);

  const handleNext = () => setSelectedIndex(i => Math.min(i + 1, variables.length - 1));
  const handlePrev = () => setSelectedIndex(i => Math.max(i - 1, 0));

  return (
    <div className="w-screen h-screen flex">
      {/* Sidebar */}
      <aside className="w-[80px] h-screen bg-[#000000] border-r border-[#525252] flex flex-col items-center justify-between py-4">
        {/* Top section */}
        <div className="flex flex-col items-center gap-6 w-full">
          <Bars3Icon className="w-7 h-7 text-white mb-2" />
          <span className="w-10 h-10 flex items-center justify-center bg-[#232323] rounded-full">
            <HomeIcon className="w-6 h-6 text-white" />
          </span>
          <BellIcon className="w-6 h-6 text-[#888888]" />
          <CameraIcon className="w-6 h-6 text-[#888888]" />
          <ArrowUpTrayIcon className="w-6 h-6 text-[#888888]" />
          <Cog6ToothIcon className="w-6 h-6 text-[#888888]" />
        </div>
        {/* Bottom section */}
        <div className="flex flex-col items-center w-full">
          <UserCircleIcon className="w-7 h-7 text-white" />
        </div>
      </aside>
      {/* Main content */}
      <section className=" bg-[#161618] border border-[#525252] flex-1 flex flex-col">
        {/* Header */}
        <header
          className="w-full bg-[#000000] border-b border-[#525252] w-[calc(100vw-80px)] h-[87px] top-[5px] flex justify-between items-center pt-5 pb-5 pl-6 pr-6"
        >
          <div className="flex items-center space-x-2 md:space-x-4">
            {['Charging Stations', 'Fleet Sizing', 'Parking'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`h-10 p-8 gap-2.5 rounded text-sm text-[#FFFFFF] font-medium transition-all cursor-pointer`}
                style={{
                  background: activeTab === tab ? '#242424' : '#000000',
                  border: activeTab === tab ? '0.67px solid #5A5A5A' : '0.67px solid transparent',
                  padding: '4px 12px',
                  borderRadius: '4px',
                  fontSize: '16px',
                  fontWeight: '500',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                  color: '#FFFFFF'
                }}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="flex items-center space-x-2 md:space-x-3">
            <div className="flex items-center gap-2 w-full">
              <div className="relative flex-1">
                <input
                  className="w-full h-9 rounded-[5px] border border-transparent bg-[#18181A] pl-10 pr-3 text-[#EDEDED] font-inter font-medium text-[14px] leading-[150%] tracking-[-0.023em] placeholder-[#A3A3A3]"
                  placeholder="Search"
                />
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A3A3A3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8" strokeWidth="2" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" strokeWidth="2" />
                </svg>
              </div>
              <button className="flex items-center gap-2 h-9 px-4 rounded-[4px] border border-[#5A5A5A] bg-[#18181A] text-[#FFFFFF]" style={{border: '1px solid #5A5A5A', borderColor: '#5A5A5A'}}>
                <svg className="w-4 h-4 text-[#B9B9B9]" /* ...icon... */ />
                Autofill
              </button>
              <button className="flex items-center gap-2 h-9 px-4 rounded-[4px] bg-[#C9FF3B] text-[#18181A] font-[Roobert_TRIAL] font-medium text-[16px] leading-[150%] tracking-[-0.02em] shadow-[1px_2px_1px_0px_#00000040]">
                <svg className="w-4 h-4" /* ...icon... */ />
                Rerun
              </button>
            </div>
          </div>
        </header>
        {/* Data/chart section */}
        <div
          className="flex-1 border border-[#525252] bg-[#232323] overflow-y-auto"
          style={{
            borderTopRightRadius: 5,
            borderBottomRightRadius: 5,
            borderBottomLeftRadius: 5,
            width: 'calc(100vw - 80px)',
            height: 'calc(100vh - 87px - 5px)',
          }}
        >
          <div className="mx-auto p-4 sm:p-8">
            {/* Title and scenario results */}
            <div className="flex items-center justify-between mb-4" style={{
              fontFamily: 'Roobert TRIAL, sans-serif',
              fontWeight: 700,
              lineHeight: '150%',
              color: '#FFFFFFFF'
            }}>
              <div className="flex items-center h-12 top-10">
                <BoltIcon className="w-[30px] h-[30px] mr-2 text-[#FFFFFF] fill-[#FFFFFF]" />
                <span className="text-[32px] font-bold m-0 p-0">Charging Station</span>
              </div>
              <div className="flex items-center gap-5 h-[41px]">
                <span className="w-[39px] h-[41px] bg-[#242424] rounded-[4px] pt-[1px] pr-[1px] border border-[#5A5A5A] flex items-center justify-center -rotate-90">
                  <ArrowPathRoundedSquareIcon className="w-[21px] h-[18px] text-gray-300" />
                </span>
                <button
                  onClick={() => dispatch(openSlideOver())}
                  className="h-[41px] bg-[#242424] border border-[#5A5A5A] rounded-[5px] px-6 flex items-center justify-center text-[#FFFFFF]"
                >
                  Edit Variables
                </button>
                <span className="w-[39px] h-[41px] bg-[#242424] rounded-[4px] pr-2 border border-[#5A5A5A] flex items-center justify-center">
                <ArrowUpTrayIcon className="w-6 h-6 text-gray-300 ml-2" />
                </span>
              </div>
            </div>
            <div className="bg-[#232323] rounded mb-2 flex flex-col gap-[24px]">
              {/* Header */}
              <div className="flex justify-between items-center px-4 py-2">
                <div className="flex items-center gap-2.5">
                  <SparklesIcon className="size-[18px] text-[#DCFF7FFD]" />
                  <span
                    className="font-[Roobert\ TRIAL] font-semibold text-[24px]  text-[#DCFF7FFD] px-2 rounded"
                  >
                    Best Scenario Results
                  </span>
                </div>
                <span className="w-[34px] h-[44px] bg-[#18181A] border border-[#C8E972] rounded-[56px] pt-[10px] pr-[5px] pb-[10px] pl-[5px] gap-[10px] flex items-center justify-center">
                  <ChevronUpIcon className="w-5 h-5 text-lime-300" />
                </span>
              </div>
              {/* Content rows */}
              <div className=" font-[Inter] font-semibold text-[16px]  text-[#C9FF3B] flex items-center justify-between border-[0.5px] border-[#C8E972] rounded-[6px] pt-[15px] pr-[24px] pb-[15px] pl-[24px] bg-[##CCFF0005]">
              The best found configuration based on profit is characterized by 11 zones (max) with charging stations and 48 total number of poles.
                <span className="w-6 h-6 text-[#C8E972]">•••</span>
            </div>
              <div className=" font-[Inter] font-semibold text-[16px]  text-[#C9FF3B] flex items-center justify-between border-[0.5px] border-[#C8E972] rounded-[6px] pt-[15px] pr-[24px] pb-[15px] pl-[24px] bg-[##CCFF0005]">
              The best found configuration based on satisfied demand is characterized by 11 zones (max) with charging stations and 48 total number of poles.
              <span className="w-6 h-6 text-[#C8E972]">•••</span>
              </div>
            </div>
            
            {/* Graphs and KPIs */}
            <div className={`relative flex flex-col lg:flex-row gap-8 mt-8 ${isSlideOverOpen ? 'opacity-50' : ''}`}>
              <div className="w-full lg:w-3/5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-bold text-white">Graphs</span>
               
              </div>
              <div className="bg-[#232323] border border-[#525252] flex flex-col gap-4 rounded-[5px] p-8 shadow-[0_4px_4px_0_#00000040] w-full">
                <div className="h-[340px] w-full">
                <button
                  className="ml-auto mr-6 h-[32px] bg-[#18181A80] border border-[] rounded-[5px] pt-[5px] pr-[4px] pb-[15px] pl-[4px] gap-[10px] flex items-center"
                >
                  <span className="font-inter font-medium text-[14px] leading-[150%] tracking-[-0.04em] text-[#FCFCFC]">
                    Unsatisfied Demand %
                  </span>
                  <svg className="w-6 h-6 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M19 9l-7 7-7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid stroke="#333" strokeDasharray="3 3" />
                      <XAxis
                        dataKey="month"
                        tick={({ x, y, payload }) => (
                          <g transform={`translate(${x},${y})`}>
                            <text fill="#fff" fontSize={13} textAnchor="middle" y={0}>{payload.value}</text>
                            {payload.value === 'May' && (
                              <text fill="#888" fontSize={10} textAnchor="middle" y={15}>Now</text>
                            )}
                          </g>
                        )}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        domain={[20000, 100000]}
                        ticks={[20000, 40000, 60000, 80000, 100000]}
                        tickFormatter={v => `$${v / 1000}K`}
                        tick={{ fill: '#fff', fontSize: 13 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip
                        content={(props) => <CustomTooltip {...props} />}
                        cursor={{ stroke: '#D4FF3F', strokeDasharray: '3 3' }}
                      />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#D4FF3F"
                        strokeWidth={3}
                        dot={{ r: 6, stroke: '#D4FF3F', strokeWidth: 2, fill: '#232323' }}
                        activeDot={{ r: 8, fill: '#D4FF3F', stroke: '#fff', strokeWidth: 2 }}
                      />
                      <ReferenceLine
                        segment={[
                          { x: 'Jul', y: 0 },
                          { x: 'Jul', y: 69000 }
                        ]}
                    stroke="#D4FF3F"
                        strokeDasharray="6 6"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              </div>
            

              {/* KPI Section */}
              {!isSlideOverOpen &&
              <div className="w-full lg:w-2/5">
              
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-2xl font-bold text-white">Key Performance Indicators</span>
                    <button
                      className="flex items-center h-[33px] opacity-80 border border-[#EEEEEE] border-[0.5px] rounded-[20px] bg-[#5959594D] px-[10px] py-[5px] gap-[20px]"
                      style={{
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: 400,
                        fontSize: '15px',
                        lineHeight: '150%',
                        letterSpacing: '-2%',
                      }}
                    >
                      {/* First Icon (Sparkles) */}
                      <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#232323] border border-[#C9FF3B]">
                        <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
                          <path d="M6 8l4 4 4-4" stroke="#C9FF3B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      {/* Button Text */}
                      <span className="text-[#EDEDED]">Variable 1</span>
                      {/* Second Icon (Plus) */}
                      <span className="flex items-center justify-center w-[20px] h-[20px] rounded-[20px] bg-[#D5D5D5] p-[3px] ml-[10px]">
                        <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                          <path d="M10 4V16" stroke="#888888" strokeWidth="2" strokeLinecap="round"/>
                          <path d="M4 10H16" stroke="#888888" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                      </span>
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {kpis.map((kpi, i) => (
                      <div
                        key={kpi.title}
                        className=" 
                        w-[241px] h-[215px] top-[-1px] left-[0px] rounded-[1px] gap-[32px]
                        bg-[#18181A] rounded-lg p-6 border border-[#525252] text-white flex flex-col justify-between shadow-[0_4px_4px_0_#00000040] mb-1"
                      >
                        <div className="flex items-center justify-between">
                          <div className="font-inter font-medium text-[18px] leading-[100%] tracking-[-0.04em] text-[#FFFFFF]">
                            {kpi.title}
                          </div>
                          <QuestionMarkCircleIcon className="size-[14px] text-[#888888]" />
                        </div>
                        <div className="font-inter font-light text-[12px] leading-[150%] tracking-normal align-middle text-[#BBBBBB] px-1 rounded">
                          {kpi.desc}
                        </div>
                        <div className="font-[Roobert_TRIAL] font-bold text-[32px] leading-[88%] tracking-[-0.02em] text-right align-middle text-[#FFFFFF] px-2 rounded">
                          {kpi.value}
                        </div>
                    </div>
                  ))}
                  </div>
                
              </div>
              }
             
            </div>
          </div>

        </div>
          {isSlideOverOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-end backdrop-blur-xs backdrop-brightness-75">
              <div className="h-full flex items-center justify-end w-full">
                <div className="bg-[#18181A] border border-[#525252] rounded-[10px] shadow-2xl p-6 w-[50vw] max-w-none h-full flex flex-col">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4 h-[36px] top-[42px] left-[32px] justify-content-space-between">
                    <span className="text-lg font-bold text-white">Edit Variables</span>
                    <button
                      className="text-white text-2xl"
                      onClick={() => dispatch(closeSlideOver())}
                    >
                      X
                    </button>
                  </div>
                  {/* Search, Autofill, Rerun */}
                  <div className="flex justify-between gap-2 mb-4">
                    <div className='w-full'>

                    <div className="relative w-full">
                      <input
                        className="w-full h-9 rounded-[5px] border border-[#525252] bg-[#232323] pl-10 pr-3 text-white placeholder-[#A3A3A3] text-sm"
                        placeholder="Search"
                        style={{
                          fontFamily: 'Inter, sans-serif',
                          fontWeight: 500,
                          fontSize: '14px',
                          lineHeight: '150%',
                          letterSpacing: '-2.3%',
                          background: '#18181A',
                        }}
                      />
                      <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A3A3A3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <circle cx="11" cy="11" r="8" strokeWidth="2" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" strokeWidth="2" />
                      </svg>
                    </div>
                    </div>
<div className='flex gap-2'>
                    <button
                      className="flex items-center justify-center rounded-[5px] border border-[#5A5A5A] bg-[#242424] gap-2"
                    >
                      <span
                        className="flex items-center justify-center"
                        style={{
                          width: '20px',
                          height: '20px',
                        }}
                      >
                                        <SparklesIcon className="size-[16px] text-[#D5D5D5]" />

                      </span>
                      <span
                        className="font-[Roobert_TRIAL] font-medium  rounded"
                      
                      >
                        Autofill
                      </span>
                    </button>
                    <button
                      className="flex items-center justify-center rounded-[5px] border border-[#5A5A5A] bg-[#70834000] gap-2"
                      style={{backgroundColor: '#23291E',color: '#C9FF3B'}}
                    >
                      <span
                        className="flex items-center justify-center"
                        style={{
                          width: '20px',
                          height: '20px',
                        }}
                      >
                        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
  <path
    d="M24 20C22.3431 22.3431 19.6569 24 16.5 24C11.2533 24 7 19.7467 7 14.5C7 9.25329 11.2533 5 16.5 5C20.1421 5 23.1957 7.23858 24.7082 10.5"
    stroke="#C9FF3B"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  />
  <path
    d="M24 10V14.5H19.5"
    stroke="#C9FF3B"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  />
</svg>
                    {/* <SparklesIcon className="size-[16px] text-[#D5D5D5]" /> */}
                      </span>
                      <span
                        className="font-[Roobert_TRIAL] font-medium  rounded"
                      
                      >
                        Rerun
                      </span>
                    </button>
                    </div>
                  </div>
                  {/* Variable Categories */}
                  <div className="flex flex-col gap-8 bg-[#232323] border border-[#525252] rounded-[5px] p-4 overflow-y-auto">
                    {/* Category 1 */}
                    <CategorySection
                      title="Variable category 1"
                      buttons={category1Buttons}
                      selected={selectedCat1}
                      onSelect={id => handleToggle(selectedCat1, setSelectedCat1, id)}
                      setHoveredPill={setHoveredPill}
                    />
                    {/* Category 2 */}
                    <CategorySection
                      title="Variable Category 2"
                      buttons={category2Buttons}
                      selected={selectedCat2}
                      onSelect={id => handleToggle(selectedCat2, setSelectedCat2, id)}
                      setHoveredPill={setHoveredPill}
                    />
                    {/* Category 3 */}
                    <CategorySection
                      title="Variable Category 3"
                      buttons={category3Buttons}
                      selected={selectedCat3}
                      onSelect={id => handleToggle(selectedCat3, setSelectedCat3, id)}
                      setHoveredPill={setHoveredPill}
                    />
                  {/* Variable Description Card */}
                  {hoveredPill && (
                    <div className="mt-2 w-full bg-[#232323] border border-[#525252] rounded-[5px] p-4 shadow-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-white font-semibold">
                          {(() => {
                            const allButtons = [...category1Buttons, ...category2Buttons, ...category3Buttons];
                            return allButtons.find(btn => btn.id === hoveredPill)?.label || '';
                          })()}
                        </span>
                        <svg className="w-4 h-4 text-[#BBBBBB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="10" strokeWidth="2" />
                          <text x="12" y="16" textAnchor="middle" fontSize="12" fill="#BBBBBB">i</text>
                        </svg>
                      </div>
                      <div className="text-xs text-[#BBBBBB]">
                        {/* Placeholder description, you can map by id if needed */}
                        But what truly sets Switch apart is its versatility. It can be used as a scooter, a bike, or even a skateboard, making it suitable for people of all ages. Whether you're a student, a professional, or a senior citizen, Switch adapts to your needs and lifestyle.
                      </div>
                    </div>
                  )}
                  </div>
                  {/* Accordions */}
                  <div className="mb-2 mt-3 flex flex-col gap-2">
                    <div className="flex items-center justify-between bg-[#232323] border border-[#525252] rounded-[5px] px-4 py-2 mb-2">
                      <span className="text-[#C9FF3B] font-medium text-[18px]">Primary Variables</span>
                      <div className="w-12 h-9 rounded-[20px] flex items-center justify-center bg-[#232323] border-2 border-[#C9FF3B]">
                        <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
                          <path d="M6 8l4 4 4-4" stroke="#C9FF3B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </div>
                    <div className="flex items-center justify-between bg-[#232323] border border-[#525252] rounded-[5px] px-4 py-2">
                      <span className="text-[#C9FF3B] font-medium text-[18px]">Secondary Variables</span>
                      <div className="w-12 h-9 rounded-[20px] flex items-center justify-center bg-[#232323] border-2 border-[#C9FF3B]">
                        <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
                          <path d="M6 8l4 4 4-4" stroke="#C9FF3B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                  {showNav && (
                    <div className="flex justify-between">
                      <button onClick={handlePrev}>Previous</button>
                      <button onClick={handleNext}>Next</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
      </section>

    

      {/* Data Point Details */}
      {hoveredDataPoint && (
        <DataPointDetails
          dataPoint={hoveredDataPoint}
          onClose={() => dispatch(setHoveredDataPoint(null))}
        />
      )}
    </div>
  );
} 