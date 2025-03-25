from sqlalchemy.orm import Session
from typing import Dict, Any, List, Optional

from models import QuizQuestion, QuizResult, User, Project, SharedAnalysis
from schemas import QuizSubmission
import datetime

# User operations
def get_user_by_id(db: Session, user_id: str):
    """Get a user by their ID (Auth0 ID)"""
    return db.query(User).filter(User.id == user_id).first()

def create_user(db: Session, user: schemas.UserCreate):
    """Create a new user"""
    db_user = User(
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
    db_project = Project(
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
    return db.query(Project).filter(Project.id == project_id).first()

def get_user_projects(db: Session, user_id: str, skip: int = 0, limit: int = 100):
    """Get all projects for a user"""
    user = get_user_by_id(db, user_id)
    if not user:
        return []
    return user.projects[skip:skip+limit]

# Quiz result operations
def create_quiz_result(db: Session, submission: QuizSubmission, scores: Dict[str, float], feedback: Dict[str, str]) -> int:
    """
    Create a new quiz result in the database.
    
    Args:
        db: Database session
        submission: Quiz submission data
        scores: Scores for each dimension
        feedback: Feedback for each dimension
        
    Returns:
        ID of the created quiz result
    """
    # Create a new quiz result
    db_result = QuizResult(
        quiz_answers=submission.dict(),
        overall_score=scores.get('overall', 0),
        desirable_score=scores.get('desirable', 0),
        effective_score=scores.get('effective', 0),
        efficient_score=scores.get('efficient', 0),
        polished_score=scores.get('polished', 0),
        recommendations=str(feedback)
    )
    
    # Add to database
    db.add(db_result)
    db.commit()
    db.refresh(db_result)
    
    return db_result.id

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
    return db.query(QuizResult).filter(QuizResult.id == quiz_result_id).first()

def get_quiz_result_by_task_id(db: Session, task_id: str):
    """Get a quiz result by task ID (for background processing)"""
    # In a real implementation, you would look up the task ID in your tracking system
    # For demo purposes, we'll assume a successful completion
    
    # This is a mock implementation - in a real system, you would query a task tracking table
    # or Redis for the associated quiz result ID
    
    # Return the most recent result for now (this is just for demo purposes)
    return db.query(QuizResult).order_by(QuizResult.created_at.desc()).first()

def get_user_quiz_results(db: Session, user_id: str, skip: int = 0, limit: int = 100):
    """Get all quiz results for a user"""
    return db.query(QuizResult).filter(
        QuizResult.user_id == user_id
    ).order_by(QuizResult.created_at.desc()).offset(skip).limit(limit).all()

def get_project_quiz_results(db: Session, project_id: int, skip: int = 0, limit: int = 100):
    """Get all quiz results for a project"""
    return db.query(QuizResult).filter(
        QuizResult.project_id == project_id
    ).order_by(QuizResult.created_at.desc()).offset(skip).limit(limit).all()

# Chat operations
def create_chat_session(db: Session, user_id: str, quiz_result_id: Optional[int] = None):
    """Create a new chat session"""
    db_session = ChatSession(
        user_id=user_id,
        quiz_result_id=quiz_result_id
    )
    db.add(db_session)
    db.commit()
    db.refresh(db_session)
    return db_session

def get_chat_session(db: Session, session_id: int):
    """Get a chat session by ID"""
    return db.query(ChatSession).filter(ChatSession.id == session_id).first()

def get_user_chat_sessions(db: Session, user_id: str, skip: int = 0, limit: int = 100):
    """Get all chat sessions for a user"""
    return db.query(ChatSession).filter(
        ChatSession.user_id == user_id
    ).order_by(ChatSession.updated_at.desc()).offset(skip).limit(limit).all()

def create_chat_message(db: Session, session_id: int, user_message: str, assistant_message: str, context: Optional[Dict[str, Any]] = None):
    """Create a new chat message in a session"""
    db_message = ChatMessage(
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
    return db.query(ChatMessage).filter(
        ChatMessage.session_id == session_id
    ).order_by(ChatMessage.created_at.asc()).offset(skip).limit(limit).all()

def get_quiz_questions(db: Session, skip: int = 0, limit: int = 100) -> List[QuizQuestion]:
    """
    Get all quiz questions from the database.
    
    Args:
        db: Database session
        skip: Number of records to skip
        limit: Maximum number of records to return
        
    Returns:
        List of quiz questions
    """
    return db.query(QuizQuestion).offset(skip).limit(limit).all()

def get_quiz_question(db: Session, question_id: int) -> Optional[QuizQuestion]:
    """
    Get a quiz question by ID.
    
    Args:
        db: Database session
        question_id: ID of the question to get
        
    Returns:
        Quiz question or None if not found
    """
    return db.query(QuizQuestion).filter(QuizQuestion.id == question_id).first()

def create_quiz_question(db: Session, question: Dict[str, Any]) -> QuizQuestion:
    """
    Create a new quiz question in the database.
    
    Args:
        db: Database session
        question: Question data
        
    Returns:
        Created quiz question
    """
    db_question = QuizQuestion(**question)
    db.add(db_question)
    db.commit()
    db.refresh(db_question)
    return db_question

def create_shared_analysis(
    db: Session, 
    share_id: str, 
    form_data: Dict[str, Any], 
    analysis: Dict[str, Any], 
    recommendations: List[Dict[str, Any]]
) -> SharedAnalysis:
    """
    Create a new shared analysis in the database.
    
    Args:
        db: Database session
        share_id: Unique ID for sharing
        form_data: Form data submitted by the user
        analysis: Analysis results
        recommendations: Recommendations based on analysis
        
    Returns:
        Created shared analysis
    """
    # Extract pricing strategy from form data
    pricing_strategy = None
    if form_data and isinstance(form_data, dict):
        model_type = form_data.get('modelType', {})
        if isinstance(model_type, dict):
            pricing_strategy = model_type.get('pricingStrategy')
    
    db_shared_analysis = SharedAnalysis(
        share_id=share_id,
        form_data=form_data,
        analysis=analysis,
        recommendations=recommendations,
        pricing_strategy=pricing_strategy
    )
    
    db.add(db_shared_analysis)
    db.commit()
    db.refresh(db_shared_analysis)
    return db_shared_analysis

def get_shared_analysis_by_id(db: Session, share_id: str) -> Optional[SharedAnalysis]:
    """
    Get a shared analysis by its share ID.
    
    Args:
        db: Database session
        share_id: Unique ID for the shared analysis
        
    Returns:
        Shared analysis or None if not found
    """
    shared_analysis = db.query(SharedAnalysis).filter(SharedAnalysis.share_id == share_id).first()
    
    if shared_analysis:
        # Increment view count
        shared_analysis.views += 1
        db.commit()
        
    return shared_analysis 