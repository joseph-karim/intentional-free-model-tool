# Intentional Free Model Tool

A comprehensive tool to help you evaluate and improve your AI product's free model strategy using the DEEP framework (Desirable, Effective, Efficient, Polished).

## Project Structure

This project consists of two main components:
- **Backend**: A FastAPI application that provides the API endpoints
- **Frontend**: A React application that provides the user interface

## Features

- Interactive quiz with questions across the four DEEP dimensions
- Visual representation of scores using radar charts
- Personalized feedback and improvement recommendations
- Modern, responsive UI built with React and Tailwind CSS

## Getting Started

### Prerequisites

- Python 3.11+
- Node.js 16+
- npm or yarn

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn main:app --reload
```

The backend server will run at http://localhost:8000

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend server will run at http://localhost:3000

## API Endpoints

- `GET /api/questions`: Fetches the quiz questions
- `POST /api/submit`: Submits quiz answers and returns scores and feedback

## Technologies Used

### Backend
- FastAPI
- SQLAlchemy (with SQLite for development)
- Uvicorn
- Python 3.11

### Frontend
- React 19
- React Router
- Chart.js for visualizations
- Tailwind CSS for styling
- Vite for build tooling

## License

MIT 