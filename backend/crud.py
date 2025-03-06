from sqlalchemy.orm import Session
import models
import schemas
from typing import List, Dict, Optional, Any
import datetime

# User operations
def get_user_by_id(db: Session, user_id: str):
    """Get a user by their ID (Auth0 ID)"""
    return db.query(models.User).filter(models.User.id == user_id).first()

def create_user(db: Session, user: schemas.UserCreate):
    """Create a new user"""
    db_user = models.User(
        id=user.id,
        email=user.email,
        name=user.name
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# Project operations
def create_project(db: Session, project: schemas.ProjectCreate, user_id: str):
    """Create a new project and associate it with a user"""
    # Get the user
    user = get_user_by_id(db, user_id)
    if not user:
        return None
    
    # Create the project
    db_project = models.Project(
        name=project.name,
        description=project.description
    )
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    
    # Associate the project with the user
    user.projects.append(db_project)
    db.commit()
    
    return db_project

def get_project(db: Session, project_id: int):
    """Get a project by ID"""
    return db.query(models.Project).filter(models.Project.id == project_id).first()

def get_user_projects(db: Session, user_id: str, skip: int = 0, limit: int = 100):
    """Get all projects for a user"""
    user = get_user_by_id(db, user_id)
    if not user:
        return []
    return user.projects[skip:skip+limit]

# Quiz result operations
def create_quiz_result(db: Session, quiz_result: schemas.QuizResultCreate, user_id: str, project_id: Optional[int] = None):
    """Create a new quiz result"""
    db_quiz_result = models.QuizResult(
        user_id=user_id,
        project_id=project_id,
        
        # Context information
        product_description=quiz_result.product_description,
        target_audience=quiz_result.target_audience,
        business_goals=quiz_result.business_goals,
        
        # User journey information
        user_endgame=quiz_result.user_endgame,
        beginner_stage=quiz_result.beginner_stage,
        intermediate_stage=quiz_result.intermediate_stage,
        advanced_stage=quiz_result.advanced_stage,
        key_challenges=quiz_result.key_challenges,
        
        # Current model assessment
        current_model=quiz_result.current_model,
        current_metrics=quiz_result.current_metrics,
        
        # DEEP framework inputs
        quiz_answers=quiz_result.quiz_answers,
        desirable_inputs=quiz_result.desirable_inputs,
        effective_inputs=quiz_result.effective_inputs,
        efficient_inputs=quiz_result.efficient_inputs,
        polished_inputs=quiz_result.polished_inputs,
        
        # Analysis results
        analysis_result=quiz_result.analysis_result,
        recommendations=quiz_result.recommendations,
        implementation_plan=quiz_result.implementation_plan,
        
        # Scores
        overall_score=quiz_result.overall_score,
        desirable_score=quiz_result.desirable_score,
        effective_score=quiz_result.effective_score,
        efficient_score=quiz_result.efficient_score,
        polished_score=quiz_result.polished_score,
        
        # Recommendations
        recommended_model=quiz_result.recommended_model
    )
    db.add(db_quiz_result)
    db.commit()
    db.refresh(db_quiz_result)
    return db_quiz_result

def create_quiz_result_with_task_id(db: Session, quiz_result: schemas.QuizResultCreate, user_id: str, task_id: str, project_id: Optional[int] = None):
    """Create a new quiz result with a task ID for background processing tracking"""
    # Create the quiz result
    db_quiz_result = create_quiz_result(db, quiz_result, user_id, project_id)
    
    # Store the task ID in a separate table (this would be implemented in a real system)
    # For demo purposes, we'll use a simple Redis-based approach
    
    # In a real implementation, you would associate the task ID with the result
    # Task tracking would typically be done with a separate table or Redis
    
    return db_quiz_result

def get_quiz_result(db: Session, quiz_result_id: int):
    """Get a quiz result by ID"""
    return db.query(models.QuizResult).filter(models.QuizResult.id == quiz_result_id).first()

def get_quiz_result_by_task_id(db: Session, task_id: str):
    """Get a quiz result by task ID (for background processing)"""
    # In a real implementation, you would look up the task ID in your tracking system
    # For demo purposes, we'll assume a successful completion
    
    # This is a mock implementation - in a real system, you would query a task tracking table
    # or Redis for the associated quiz result ID
    
    # Return the most recent result for now (this is just for demo purposes)
    return db.query(models.QuizResult).order_by(models.QuizResult.created_at.desc()).first()

def get_user_quiz_results(db: Session, user_id: str, skip: int = 0, limit: int = 100):
    """Get all quiz results for a user"""
    return db.query(models.QuizResult).filter(
        models.QuizResult.user_id == user_id
    ).order_by(models.QuizResult.created_at.desc()).offset(skip).limit(limit).all()

def get_project_quiz_results(db: Session, project_id: int, skip: int = 0, limit: int = 100):
    """Get all quiz results for a project"""
    return db.query(models.QuizResult).filter(
        models.QuizResult.project_id == project_id
    ).order_by(models.QuizResult.created_at.desc()).offset(skip).limit(limit).all()

# Chat operations
def create_chat_session(db: Session, user_id: str, quiz_result_id: Optional[int] = None):
    """Create a new chat session"""
    db_session = models.ChatSession(
        user_id=user_id,
        quiz_result_id=quiz_result_id
    )
    db.add(db_session)
    db.commit()
    db.refresh(db_session)
    return db_session

def get_chat_session(db: Session, session_id: int):
    """Get a chat session by ID"""
    return db.query(models.ChatSession).filter(models.ChatSession.id == session_id).first()

def get_user_chat_sessions(db: Session, user_id: str, skip: int = 0, limit: int = 100):
    """Get all chat sessions for a user"""
    return db.query(models.ChatSession).filter(
        models.ChatSession.user_id == user_id
    ).order_by(models.ChatSession.updated_at.desc()).offset(skip).limit(limit).all()

def create_chat_message(db: Session, session_id: int, user_message: str, assistant_message: str, context: Optional[Dict[str, Any]] = None):
    """Create a new chat message in a session"""
    db_message = models.ChatMessage(
        session_id=session_id,
        user_message=user_message,
        assistant_message=assistant_message,
        context=context
    )
    db.add(db_message)
    
    # Update the session's updated_at timestamp
    session = get_chat_session(db, session_id)
    session.updated_at = datetime.datetime.utcnow()
    
    db.commit()
    db.refresh(db_message)
    return db_message

def get_chat_messages(db: Session, session_id: int, skip: int = 0, limit: int = 100):
    """Get all messages in a chat session"""
    return db.query(models.ChatMessage).filter(
        models.ChatMessage.session_id == session_id
    ).order_by(models.ChatMessage.created_at.asc()).offset(skip).limit(limit).all() 