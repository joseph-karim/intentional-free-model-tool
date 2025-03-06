from fastapi import FastAPI, HTTPException, Depends, Request, status, Body, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from typing import List, Dict, Optional, Any
import os
import json
import openai
from dotenv import load_dotenv
import crud
import models
import schemas
from database import engine, get_db
from jose import jwt
from analysis import analyze_quiz_results
import ai_analysis
import requests
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from fastapi_cache import FastAPICache
from fastapi_cache.backends.redis import RedisBackend
from redis import Redis
import uuid
from datetime import datetime, timedelta

# Create database tables
models.Base.metadata.create_all(bind=engine)

# Load environment variables
load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")
AUTH0_DOMAIN = os.getenv("AUTH0_DOMAIN")
AUTH0_API_AUDIENCE = os.getenv("AUTH0_API_AUDIENCE")
DEV_MODE = os.getenv("DEV_MODE", "false").lower() == "true"
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")

# Import Auth0 utilities only if not in dev mode
if not DEV_MODE:
    from .auth import VerifyToken

app = FastAPI(title="Intentional Model Analyzer API")

# Security scheme for Auth0
security = HTTPBearer(auto_error=not DEV_MODE)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("FRONTEND_URL", "http://localhost:3000")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize cache
@app.on_event("startup")
async def startup():
    redis = Redis.from_url(REDIS_URL)
    FastAPICache.init(RedisBackend(redis), prefix="fastapi-cache")

# Auth0 token validation
async def get_current_user(credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)):
    """Validate Auth0 token and extract user ID"""
    # In development mode, use a fake user ID for testing
    if DEV_MODE:
        return {"id": "dev-user-123", "name": "Dev User", "email": "dev@example.com"}
    
    # In production, validate the JWT token
    token = credentials.credentials
    result = VerifyToken(token).verify()
    
    if result.get("status"):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=result.get("message", "Invalid authentication credentials"),
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return result

# User management routes
@app.post("/api/users/", response_model=schemas.User)
async def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    """Create a new user if they don't exist yet"""
    db_user = crud.get_user_by_id(db, user_id=user.id)
    if db_user:
        return db_user
    return crud.create_user(db=db, user=user)

@app.get("/api/users/me", response_model=schemas.User)
async def get_current_user_info(current_user = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get the current user's information"""
    db_user = crud.get_user_by_id(db, user_id=current_user["id"])
    if not db_user:
        # Auto-create the user if they don't exist yet
        user_data = schemas.UserCreate(
            id=current_user["id"],
            email=current_user.get("email", ""),
            name=current_user.get("name", "")
        )
        db_user = crud.create_user(db=db, user=user_data)
    return db_user

# Project management routes
@app.post("/api/projects/", response_model=schemas.Project)
async def create_project(
    project: schemas.ProjectCreate, 
    current_user = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    """Create a new project for the current user"""
    # Ensure user exists
    user_id = current_user["id"]
    db_user = crud.get_user_by_id(db, user_id=user_id)
    if not db_user:
        user_data = schemas.UserCreate(
            id=user_id,
            email=current_user.get("email", ""),
            name=current_user.get("name", "")
        )
        db_user = crud.create_user(db=db, user=user_data)
    
    # Create the project and associate it with the user
    return crud.create_project(db=db, project=project, user_id=user_id)

@app.get("/api/projects/", response_model=List[schemas.Project])
async def get_user_projects(
    current_user = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    """Get all projects for the current user"""
    return crud.get_user_projects(db, user_id=current_user["id"])

@app.get("/api/projects/{project_id}", response_model=schemas.Project)
async def get_project(
    project_id: int, 
    current_user = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    """Get a specific project by ID"""
    project = crud.get_project(db, project_id=project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Check if user has access to this project
    if current_user["id"] not in [user.id for user in project.users]:
        raise HTTPException(status_code=403, detail="Not authorized to access this project")
    
    return project

# Legacy quiz routes (maintained for backward compatibility)
@app.get("/api/questions")
async def get_quiz_questions():
    """Get the quiz questions for the DEEP framework assessment"""
    # TODO: Replace this with a structured guide for the enhanced free-form inputs
    # For now, return the legacy questions for backward compatibility
    return {
        "questions": [
            # ... (same legacy questions)
            {
                "id": "current_free_model",
                "text": "What type of free model do you currently offer?",
                "type": "select",
                "options": [
                    "None (No free offering)",
                    "Freemium (Feature-limited free version)",
                    "Free Trial (Time-limited access)",
                    "Usage-Based (Free up to certain limits)",
                    "Community Edition",
                    "Open Core",
                    "Other"
                ],
                "dimension": "desirable",
                "required": True
            },
            # More legacy questions...
        ]
    }

@app.post("/api/submit", response_model=schemas.AnalysisResult)
async def submit_quiz(
    quiz: schemas.QuizSubmission, 
    current_user = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    """Submit a legacy quiz and get analysis results"""
    # For backward compatibility, support the old quiz format
    analysis = analyze_quiz_results(quiz.answers)
    
    # Save the result if the user is authenticated
    user_id = current_user["id"]
    quiz_result = schemas.QuizResultCreate(
        quiz_answers=quiz.answers,
        analysis_result=analysis["analysis"].__dict__,
        recommendations=analysis["recommendations"],
        overall_score=analysis["analysis"].score,
        desirable_score=analysis["analysis"].desirable.score,
        effective_score=analysis["analysis"].effective.score,
        efficient_score=analysis["analysis"].efficient.score,
        polished_score=analysis["analysis"].polished.score,
        recommended_model=analysis["analysis"].recommended_model,
        product_description="",  # Default empty for legacy submissions
        target_audience="",
        business_goals="",
        user_endgame="",
        beginner_stage="",
        intermediate_stage="",
        advanced_stage="",
        key_challenges={},
        implementation_plan={}
    )
    
    crud.create_quiz_result(db=db, quiz_result=quiz_result, user_id=user_id)
    
    return analysis

# Enhanced analysis routes
@app.post("/api/v2/analyze", response_model=Dict[str, Any])
async def analyze_strategy(
    submission: schemas.QuizSubmission, 
    background_tasks: BackgroundTasks,
    current_user = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    """
    Submit a comprehensive free-model strategy for analysis using the DEEP framework.
    This endpoint processes detailed free-form text inputs and returns AI-powered analysis.
    """
    # Generate a task ID for the background analysis
    task_id = str(uuid.uuid4())
    
    # Start the analysis in the background
    background_tasks.add_task(
        process_analysis_task, 
        task_id=task_id, 
        submission=submission, 
        user_id=current_user["id"], 
        db=db
    )
    
    # Return the task ID for the client to poll
    return {
        "task_id": task_id,
        "status": "processing",
        "message": "Your analysis is being processed. Please poll the status endpoint to check for completion."
    }

@app.get("/api/v2/analyze/{task_id}/status", response_model=Dict[str, Any])
async def check_analysis_status(
    task_id: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Check the status of an analysis task"""
    # TODO: Implement checking of task status from a Redis or database store
    # For now, return a dummy "completed" status
    # In production, this would check a task queue or database
    
    # Check for the result in the database
    result = crud.get_quiz_result_by_task_id(db, task_id=task_id)
    if result:
        # If completed, return the result ID
        return {
            "task_id": task_id,
            "status": "completed",
            "message": "Analysis complete",
            "result_id": result.id
        }
    
    # Otherwise, assume it's still processing
    return {
        "task_id": task_id,
        "status": "processing",
        "message": "Your analysis is still being processed. Please check back in a few moments."
    }

@app.get("/api/v2/results/{result_id}", response_model=schemas.QuizResult)
async def get_analysis_result(
    result_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Get the detailed results of a completed analysis"""
    result = crud.get_quiz_result(db, quiz_result_id=result_id)
    if not result:
        raise HTTPException(status_code=404, detail="Analysis result not found")
    
    # Check if the user has permission to access this result
    if result.user_id != current_user["id"]:
        raise HTTPException(status_code=403, detail="Not authorized to access this result")
    
    return result

# Chat routes
@app.post("/api/chat/sessions", response_model=schemas.ChatSession)
async def create_chat_session(
    session_data: schemas.ChatSessionCreate, 
    current_user = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    """Create a new chat session, optionally linked to a quiz result"""
    # Create the chat session
    return crud.create_chat_session(
        db=db, 
        user_id=current_user["id"], 
        quiz_result_id=session_data.quiz_result_id
    )

@app.get("/api/chat/sessions", response_model=List[schemas.ChatSession])
async def list_chat_sessions(
    current_user = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    """List all chat sessions for the current user"""
    return crud.get_user_chat_sessions(db, user_id=current_user["id"])

@app.get("/api/chat/sessions/{session_id}", response_model=schemas.ChatSession)
async def get_chat_session(
    session_id: int,
    current_user = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    """Get a specific chat session with all messages"""
    session = crud.get_chat_session(db, session_id=session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Chat session not found")
    
    # Check if the user has permission to access this session
    if session.user_id != current_user["id"]:
        raise HTTPException(status_code=403, detail="Not authorized to access this chat session")
    
    return session

@app.post("/api/chat/sessions/{session_id}/messages", response_model=schemas.ChatMessageResponse)
async def send_message(
    session_id: int,
    message: schemas.ChatMessageCreate,
    current_user = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    """Send a message in a chat session and get a response"""
    # Check if the session exists and belongs to the user
    session = crud.get_chat_session(db, session_id=session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Chat session not found")
    
    if session.user_id != current_user["id"]:
        raise HTTPException(status_code=403, detail="Not authorized to access this chat session")
    
    # Build context for the AI assistant
    context = {}
    
    # If the session is linked to a quiz result, include that in the context
    if session.quiz_result_id:
        quiz_result = crud.get_quiz_result(db, quiz_result_id=session.quiz_result_id)
        if quiz_result:
            context["quiz_result"] = {
                "product_description": quiz_result.product_description,
                "target_audience": quiz_result.target_audience,
                "business_goals": quiz_result.business_goals,
                "recommended_model": quiz_result.recommended_model,
                "overall_score": quiz_result.overall_score,
                "analysis_result": quiz_result.analysis_result
            }
    
    # Add any additional context provided with the message
    if message.context:
        context.update(message.context)
    
    # Process the message with the AI assistant
    assistant_response = await ai_analysis.analyze_chat_message(
        message=message.user_message,
        context=context
    )
    
    # Save the message and response to the database
    db_message = crud.create_chat_message(
        db=db,
        session_id=session_id,
        user_message=message.user_message,
        assistant_message=assistant_response,
        context=message.context
    )
    
    return schemas.ChatMessageResponse(
        user_message=db_message.user_message,
        assistant_message=db_message.assistant_message,
        created_at=db_message.created_at
    )

# Background task for analysis
async def process_analysis_task(task_id: str, submission: schemas.QuizSubmission, user_id: str, db: Session):
    """Process the analysis in the background and save the result"""
    try:
        # Perform the analysis
        result = await ai_analysis.analyze_quiz_submission(submission.dict())
        
        # Create the quiz result
        quiz_result = schemas.QuizResultCreate(
            # Context information
            product_description=submission.context.product_description,
            target_audience=submission.context.target_audience,
            business_goals=submission.context.business_goals,
            
            # User journey information
            user_endgame=submission.user_journey.user_endgame,
            beginner_stage=submission.user_journey.beginner_stage,
            intermediate_stage=submission.user_journey.intermediate_stage,
            advanced_stage=submission.user_journey.advanced_stage,
            key_challenges=submission.user_journey.key_challenges,
            
            # Current model assessment
            current_model=submission.current_model.current_model if submission.current_model else None,
            current_metrics=submission.current_model.current_metrics if submission.current_model else None,
            
            # DEEP framework inputs
            quiz_answers=[a.dict() for a in submission.structured_answers] if submission.structured_answers else [],
            desirable_inputs=submission.deep_inputs.desirable.dict(),
            effective_inputs=submission.deep_inputs.effective.dict(),
            efficient_inputs=submission.deep_inputs.efficient.dict(),
            polished_inputs=submission.deep_inputs.polished.dict(),
            
            # Analysis results
            analysis_result=result,
            recommendations=result["recommendations"],
            implementation_plan=result["implementation_plan"],
            
            # Scores
            overall_score=result["score"],
            desirable_score=result["desirable"]["score"],
            effective_score=result["effective"]["score"],
            efficient_score=result["efficient"]["score"],
            polished_score=result["polished"]["score"],
            
            # Recommendations
            recommended_model=result["recommended_model"]
        )
        
        # Save the result with the task ID
        crud.create_quiz_result_with_task_id(db=db, quiz_result=quiz_result, user_id=user_id, task_id=task_id)
        
    except Exception as e:
        # In a production system, log the error and possibly notify the user
        print(f"Error processing analysis: {str(e)}")
        # Could also store the error in a database or queue for later retry

# The main application entry point
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 