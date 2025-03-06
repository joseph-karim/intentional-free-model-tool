# Intentional Free Model Quiz Frontend

A modern React application for assessing and evaluating free AI model features using the DEEP framework (Desirable, Effective, Efficient, Polished).

## Features

- Interactive quiz with questions across four key dimensions
- Beautiful, responsive UI using React and Tailwind CSS
- Radar chart visualization of results using Chart.js
- Detailed feedback and recommendations

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```
npm install
```

2. Start the development server:
```
npm run dev
```

3. The application will be available at http://localhost:3000

### Building for Production

To create a production build:
```
npm run build
```

## API Integration

The frontend connects to a FastAPI backend running at http://localhost:8000. Make sure the backend server is running before using the application.

## Architecture

- React for UI components
- React Router for navigation
- Chart.js for data visualization
- Axios for API requests
- Tailwind CSS for styling 