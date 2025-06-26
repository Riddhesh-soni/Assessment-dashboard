import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store/store';
import { openSlideOver, setHoveredDataPoint, closeSlideOver } from '../store/slices/uiSlice';
// import VariablesPanel from '../components/VariablesPanel';
// import DataVisualization from '../components/DataVisualization';
import SlideOverCard from '../components/SlideOverCard';
import DataPointDetails from '../components/DataPointDetails';
import { Battery100Icon, BoltIcon, SparklesIcon, ArrowPathRoundedSquareIcon, ArrowUpTrayIcon, ChevronUpIcon } from '@heroicons/react/24/solid';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from 'recharts';
import { QuestionMarkCircleIcon, ArrowUpIcon } from '@heroicons/react/24/outline';
import {
  Bars3Icon,
  HomeIcon,
  BellIcon,
  CameraIcon,
  Cog6ToothIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';
import type { TooltipProps } from 'recharts';
import type { CSSProperties } from 'react';
import clipboardTime from '../assets/clipboard-text-clock.png';
import bell from '../assets/bell.png';
import cloudUpload from '../assets/cloud-upload.png';
import cog from '../assets/cog.png';
import home from '../assets/home.png';
import profile from '../assets/Vector.png';
import recent from '../assets/recent.png';
import upload from '../assets/Frame 3770.png';
import lightning from '../assets/Lightning.png';

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

export default function Dashboard() {
  const dispatch = useDispatch();
  const { isSlideOverOpen, hoveredDataPoint } = useSelector((state: RootState) => state.ui);
  const { variables } = useSelector((state: RootState) => state.variables);
  const [activeTab, setActiveTab] = useState('Charging Stations');

  return (
    <div className="w-screen h-screen flex">
      {/* Sidebar */}
      <aside className="w-[80px] h-screen bg-[#000000] flex flex-col items-center justify-between py-4">
        {/* Top section */}
        <div className="flex flex-col items-center gap-10 w-full pt-4">
          <Bars3Icon className="w-7 h-7 text-white mb-2" />
          <img src={home} alt="home" className="w-6 h-6" />
          <img src={bell} alt="bell" className="w-6 h-6" />
          <img src={clipboardTime} alt="clipboard time" className="w-6 h-6" />
          <img src={cloudUpload} alt="cloud upload" className="w-6 h-6" />
          <img src={cog} alt="cog" className="w-6 h-6" />
        </div>
        {/* Bottom section */}
        <div className="flex flex-col items-center w-full">
          <img src={profile} alt="Profile" className="w-6 h-6" />
        </div>
      </aside>
      {/* Main content */}
      <section className="bg-[#161618] flex-1 flex flex-col">
        {/* Header */}
        <header
          className="w-full bg-[#000000] w-[calc(100vw-80px)] h-[87px] top-[5px] flex justify-between items-center pt-5 pb-5 pl-6 pr-6"
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
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-[19.37px] h-[19.37px] z-10 pointer-events-none">
                {/* Search icon */}
                <svg width="19.37" height="19.37" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="#EDEDED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <input
                className="w-[237px] h-[37px] rounded-[5px] border border-[#5A5A5A] pt-2 pr-3 pb-2 pl-12 bg-[#2C2E334D] backdrop-blur-[24px] text-[#EDEDED] font-inter font-medium text-[14px] leading-[150%] tracking-[-2.3%] placeholder-[#EDEDED] relative z-0"
                placeholder="Search"
                style={{
                  fontFamily: 'Inter',
                  letterSpacing: '-2.3%'
                }}
              />
            </div>
          </div>
        </header>
        {/* Data/chart section */}
        <div
          className="flex-1 border border-[#525252] rounded bg-[#161618] overflow-y-auto"
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
            <div className="flex items-center justify-between mb-6" style={{
              fontFamily: 'Roobert TRIAL, sans-serif',
              fontWeight: 700,
              lineHeight: '150%',
              color: '#FFFFFFFF'
            }}>
              <div className="flex items-center h-12 top-10">
                <img src={lightning} alt="charging station" className="h-8 mr-4" />
                <span className="text-[32px] font-bold m-0 p-0">Charging Station</span>
              </div>
              <div className="flex items-center gap-3 h-[41px]">
                <span className="w-[39px] h-[41px] bg-[#242424] rounded-[4px] pt-[1px] pr-[1px] border border-[#5A5A5A] flex items-center justify-center">
                  <img src={recent} alt="recent" />
                </span>
                <button
                  onClick={() => dispatch(openSlideOver())}
                  className="h-[41px]rounded-[3px] px-6 flex items-center justify-center text-[#FFFFFF]"
                  style={{
                    border: '1px solid rgba(90, 90, 90, 0.63)',
                    backgroundColor: 'rgba(36, 36, 36, 1)',
                  }}>
                  Edit Variables
                </button>
                <span className="w-[39px] h-[41px] bg-[#242424] rounded-[4px] border border-[#5A5A5A] flex items-center justify-center">
                  <img src={upload} alt="upload" className="object-contain" />
                </span>
              </div>
            </div>
            <div className="bg-[#161618] rounded mb-2 flex flex-col gap-[24px]">
              {/* Header */}
              <div className="flex justify-between items-center pl-0 pr-4 py-2">
                <div className="flex items-center gap-2.5">
                  <SparklesIcon className="size-[18px] text-[#DCFF7FFD]" />
                  <span
                    className="font-[Roobert_TRIAL] font-semibold text-[24px] text-[#DCFF7FFD] rounded"
                  >
                    Best Scenario Results
                  </span>
                </div>
                <span className="w-[44px] h-[34px] bg-[#18181A] border border-[#C8E972] rounded-[56px] flex items-center justify-center">
                  <ChevronUpIcon className="w-5 h-5 text-lime-300" />
                </span>
              </div>
              {/* Content rows */}
              <div className="font-[Inter] font-semibold text-[16px] text-[#C9FF3B] flex items-center justify-between border-[0.5px] border-[#C8E972] rounded-[6px] pt-[15px] pr-[24px] pb-[15px] pl-[24px] bg-[##CCFF0005]">
                The best found configuration based on profit is characterized by 11 zones (max) with charging stations and 48 total number of poles.
                <span className="w-6 h-6 text-[#C8E972]">•••</span>
              </div>
              <div className="font-[Inter] font-semibold text-[16px] text-[#C9FF3B] flex items-center justify-between border-[0.5px] border-[#C8E972] rounded-[6px] pt-[15px] pr-[24px] pb-[15px] pl-[24px] bg-[##CCFF0005]">
                The best found configuration based on satisfied demand is characterized by 11 zones (max) with charging stations and 48 total number of poles.
                <span className="w-6 h-6 text-[#C8E972]">•••</span>
              </div>
            </div>

            {/* Graphs and KPIs */}
            <div className={`flex flex-col lg:flex-row mt-8 ${isSlideOverOpen ? 'opacity-50' : ''} gap-0 lg:gap-[19px]`}>
              <div className="w-full lg:w-3/5">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-white">Graphs</span>

                </div>
                <div className="border border-[#525252] rounded-[5px] bg-[#222324] shadow-[0_4px_4px_0_#00000040] flex flex-col w-full"
                  style={{
                    height: 462,
                    minHeight: 462,
                    maxHeight: 462,
                    padding: 0,
                    paddingRight: 50,
                    margin: 0,
                  }}
                >
                  <div className="flex items-center justify-between px-3 pt-6 pb-2">
                    <span className="text-2xl font-bold text-white"></span>
                    <button
                      className="h-[32px] bg-[#18181A80] border border-[] rounded-[5px] px-3 flex items-center"
                       style={{
                    border: '1px solid rgba(90, 90, 90, 0.63)',
                    backgroundColor: 'rgba(36, 36, 36, 1)',
                  }}
                    >
                      <span className="font-inter font-medium text-[14px] leading-[150%] tracking-[-0.04em] pr-2 text-[#FCFCFC]">
                        Unsatisfied Demand %
                      </span>
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M19 9l-7 7-7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>
                  <div className="flex-1 flex items-center justify-center pb-6 px-6">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={chartData}
                        margin={{ top: 20, right: 30, left: 0, bottom: 30 }}
                      >
                        <CartesianGrid stroke="#333" strokeDasharray="3 3" />
                        <XAxis
                          dataKey="month"
                          padding={{ left: 30, right: 10 }}
                          tick={({ x, y, payload }) => (
                            <g transform={`translate(${x},${y})`}>
                              <text fill="#fff" fontSize={15} textAnchor="middle" dy={20}>{payload.value}</text>
                              {payload.value === 'May' && (
                                <text fill="#888" fontSize={11} textAnchor="middle" dy={36}>Now</text>
                              )}
                            </g>
                          )}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis
                          type="number"
                          domain={[0, 100000]}
                          ticks={[20000, 40000, 60000, 80000, 100000]}
                          allowDataOverflow={true}
                          tickFormatter={v => `$${v / 1000}K`}
                          tick={{ fill: '#fff', fontSize: 15 }}
                          axisLine={false}
                          tickLine={false}
                          width={60}
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
                <div className="w-full lg:w-2/5 flex flex-col items-center gap-1">
                  <div className="flex items-center mb-1 w-full max-w-[530px] justify-around">
                    <span className="text-2xl font-bold text-white">Key Performance Indicators</span>
                    <button
                      className="bg-[#232323] text-white flex rounded text-sm items-center gap-2 px-1 mb-1"
                      style={{
                        border: '1px solid rgba(90, 90, 90, 0.63)',
                        paddingTop: 0,
                        paddingBottom: 0,
                      }}
                    >
                      Variables <span className="text-2xl flex items-center pl-1 pb-1">+</span>
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-x-[20px] gap-y-[20px] w-[502px]">
                    {kpis.map((kpi, i) => (
                      <div
                        key={kpi.title}
                        className="w-[241px] h-[221px] rounded-lg p-6 border border-[#525252] text-white flex flex-col gap-2"
                        style={{
                          background: '#222324',
                          boxShadow: '0px 4px 4px 0px #00000040'
                        }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-inter font-medium text-[18px] leading-[100%] tracking-[-0.04em] text-[#FFFFFF]">
                            {kpi.title}
                          </div>
                          <QuestionMarkCircleIcon className="size-[14px] text-[#888888]" />
                        </div>
                        <div className="font-inter font-light text-[12px] leading-[150%] tracking-normal text-[#BBBBBB] mb-2">
                          {kpi.desc}
                        </div>
                        <div className="font-[Roobert_TRIAL] font-bold text-[32px] leading-[88%] tracking-[-0.02em] text-right text-[#FFFFFF] mt-auto">
                          {kpi.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              }
              {isSlideOverOpen && <div className="fixed inset-0 z-50 flex items-center justify-end bg-black bg-opacity-60 backdrop-blur-sm">
                <div className="h-full flex items-center justify-end w-full">
                  <div className="bg-[#18181A] border border-[#525252] rounded-[10px] shadow-2xl p-6 w-[50vw] max-w-none h-full flex flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-lg font-bold text-white">Edit Variables</span>
                      <button
                        className="text-white text-2xl"
                        onClick={() => dispatch(closeSlideOver())}
                      >
                        &times;
                      </button>
                    </div>
                    {/* Search, Autofill, Rerun */}
                    <div className="flex items-center gap-2 mb-4">
                      <div className="relative flex-1">
                        <input
                          className="w-full h-9 rounded-[5px] border border-[#525252] bg-[#232323] pl-10 pr-3 text-white placeholder-[#A3A3A3] text-sm"
                          placeholder="Search"
                        />
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A3A3A3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <circle cx="11" cy="11" r="8" strokeWidth="2" />
                          <line x1="21" y1="21" x2="16.65" y2="16.65" strokeWidth="2" />
                        </svg>
                      </div>
                      <button className="bg-[#232323] border border-[#525252] text-white px-4 py-2 rounded text-sm">Autofill</button>
                      <button className="bg-[#232323] border border-[#B6FF6C] text-[#B6FF6C] px-4 py-2 rounded text-sm flex items-center gap-2">
                        <span>Rerun</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 4v5h.582M20 20v-5h-.581M5.5 19A9 9 0 1 1 19 5.5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </button>
                    </div>
                    {/* Variable Categories */}
                    <div className="bg-[#232323] border border-[#525252] rounded-[5px] p-4 mb-4 flex-1 overflow-y-auto">
                      {/* Category 1 */}
                      <div className="mb-3">
                        <div className="text-xs text-[#A3A3A3] mb-2">Variable category 1</div>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-3 py-1 rounded-full bg-[#232323] border border-[#525252] text-white text-xs flex items-center gap-1">Carbon 1 <span className="text-[#FF4747] text-base">•</span></span>
                          <span className="px-3 py-1 rounded-full bg-[#232323] border border-[#B6FF6C] text-[#B6FF6C] text-xs flex items-center gap-1">Co2 Distribution <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 20 20"><path d="M7 7l3-3 3 3M7 13l3 3 3-3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
                          <span className="px-3 py-1 rounded-full bg-[#232323] border border-[#B6FF6C] text-[#B6FF6C] text-xs flex items-center gap-1">Fleet sizing <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 20 20"><path d="M7 7l3-3 3 3M7 13l3 3 3-3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
                        </div>
                      </div>
                      {/* Category 2 */}
                      <div className="mb-3">
                        <div className="text-xs text-[#A3A3A3] mb-2">Variable Category 2</div>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-3 py-1 rounded-full bg-[#232323] border border-[#525252] text-white text-xs">Parking Rate</span>
                          <span className="px-3 py-1 rounded-full bg-[#232323] border border-[#B6FF6C] text-[#B6FF6C] text-xs">Border Rate</span>
                          <span className="px-3 py-1 rounded-full bg-[#232323] border border-[#B6FF6C] text-[#B6FF6C] text-xs">Request rate</span>
                          <span className="px-3 py-1 rounded-full bg-[#232323] border border-[#525252] text-white text-xs">Variable 1</span>
                          <span className="px-3 py-1 rounded-full bg-[#232323] border border-[#525252] text-white text-xs">Variable 1</span>
                          <span className="px-3 py-1 rounded-full bg-[#232323] border border-[#B6FF6C] text-[#B6FF6C] text-xs">Variable 1</span>
                        </div>
                      </div>
                      {/* Category 3 */}
                      <div className="mb-3">
                        <div className="text-xs text-[#A3A3A3] mb-2">Variable Category 3</div>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-3 py-1 rounded-full bg-[#232323] border border-[#525252] text-white text-xs">Variable 1</span>
                          <span className="px-3 py-1 rounded-full bg-[#232323] border border-[#B6FF6C] text-[#B6FF6C] text-xs">Variable 1</span>
                          <span className="px-3 py-1 rounded-full bg-[#232323] border border-[#B6FF6C] text-[#B6FF6C] text-xs">Variable 1</span>
                        </div>
                      </div>
                    </div>
                    {/* Variable Description Card */}
                    <div className="bg-[#232323] border border-[#525252] rounded-[5px] p-4 mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-white font-semibold">Co2 Distribution</span>
                        <svg className="w-4 h-4 text-[#BBBBBB]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" strokeWidth="2" /><text x="12" y="16" textAnchor="middle" fontSize="12" fill="#BBBBBB">i</text></svg>
                      </div>
                      <div className="text-xs text-[#BBBBBB]">
                        But what truly sets Switch apart is its versatility. It can be used as a scooter, a bike, or even a skateboard, making it suitable for people of all ages. Whether you're a student, a professional, or a senior citizen, Switch adapts to your needs and lifestyle.
                      </div>
                    </div>
                    {/* Accordions */}
                    <div className="mb-2">
                      <button className="w-full flex items-center justify-between bg-[#232323] border border-[#525252] rounded-[5px] px-4 py-3 text-left text-[#B6FF6C] font-semibold text-base mb-2">
                        Primary Variables
                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </button>
                      <button className="w-full flex items-center justify-between bg-[#232323] border border-[#525252] rounded-[5px] px-4 py-3 text-left text-[#B6FF6C] font-semibold text-base">
                        Secondary Variables
                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>}


            </div>
          </div>
        </div>
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