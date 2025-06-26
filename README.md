# Data Visualization Platform

A modern React TypeScript application for real-time data visualization and monitoring. This platform provides an interactive dashboard with customizable variables, data visualization charts, and detailed data point analysis.

## Features

### 🎯 Core Screens
- **Dashboard Screen**: Main data visualization with interactive charts
- **Variables Panel**: Adjustable parameters for data visualization
- **Slide-Over Card**: Variable editing interface with smooth transitions
- **Details Screen**: Detailed information about specific data points

### 🔄 Interactive Features
1. **Slide-Over Variable Editing**: Click "Edit Variables" to open a slide-over card for adjusting parameters
2. **Data Point Hover Interaction**: Hover over chart data points to see detailed information
3. **Variable Selection**: Select and toggle variables with contextual hover information

### 🛠 Technical Stack
- **React 18+** with TypeScript
- **Redux Toolkit** for state management
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Recharts** for data visualization
- **Heroicons** for icons

## Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd data-viz-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to view the application

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── DataPointDetails.tsx
│   ├── DataVisualization.tsx
│   ├── SlideOverCard.tsx
│   └── VariablesPanel.tsx
├── pages/              # Page components
│   └── Dashboard.tsx
├── store/              # Redux store configuration
│   ├── slices/
│   │   ├── uiSlice.ts
│   │   └── variablesSlice.ts
│   └── store.ts
├── App.tsx             # Main application component
└── main.tsx           # Application entry point
```

## Key Features Implementation

### 1. Dashboard Screen
- Responsive layout with variables panel and data visualization
- Real-time data generation based on active variables
- Interactive line chart with multiple data series

### 2. Variables Panel
- Toggle variables on/off for visualization
- Hover tooltips with variable descriptions
- Visual indicators for active/inactive states

### 3. Slide-Over Card
- Smooth slide-in animation from the right
- Range sliders for variable adjustment
- Real-time value updates

### 4. Data Point Details
- Fade-in animation on hover
- Comprehensive data point information
- Export functionality (UI ready)

## State Management

The application uses Redux Toolkit for state management with two main slices:

- **variablesSlice**: Manages variable data and selection state
- **uiSlice**: Handles UI state like slide-over visibility and hover states

## Styling

The application uses Tailwind CSS for styling with:
- Responsive design (mobile-first approach)
- Custom slider components
- Smooth transitions and animations
- Modern UI components

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
