from sqlalchemy.orm import Session
import models
import schemas
import json
from typing import List, Dict, Any

# Quiz result operations
def create_quiz_result(db: Session, quiz_result: schemas.QuizResultCreate, user_id: str):
    """Create a new quiz result entry in the database"""
    db_quiz_result = models.QuizResult(
        user_id=user_id,
        quiz_answers=quiz_result.quiz_answers,
        analysis_result=quiz_result.analysis_result,
        recommendations=quiz_result.recommendations,
        overall_score=quiz_result.overall_score,
        desirable_score=quiz_result.desirable_score,
        effective_score=quiz_result.effective_score,
        efficient_score=quiz_result.efficient_score,
        polished_score=quiz_result.polished_score,
        recommended_model=quiz_result.recommended_model
    )
    db.add(db_quiz_result)
    db.commit()
    db.refresh(db_quiz_result)
    return db_quiz_result

def get_quiz_result(db: Session, quiz_result_id: int):
    """Get a specific quiz result by ID"""
    return db.query(models.QuizResult).filter(models.QuizResult.id == quiz_result_id).first()

def get_user_quiz_results(db: Session, user_id: str, skip: int = 0, limit: int = 100):
    """Get all quiz results for a specific user"""
    return db.query(models.QuizResult).filter(
        models.QuizResult.user_id == user_id
    ).order_by(models.QuizResult.created_at.desc()).offset(skip).limit(limit).all()

def delete_quiz_result(db: Session, quiz_result_id: int, user_id: str):
    """Delete a specific quiz result"""
    db_quiz_result = db.query(models.QuizResult).filter(
        models.QuizResult.id == quiz_result_id,
        models.QuizResult.user_id == user_id
    ).first()
    
    if db_quiz_result:
        db.delete(db_quiz_result)
        db.commit()
        return True
    return False

# Process quiz submission
def process_quiz_submission(
    db: Session, 
    submission: schemas.QuizSubmission, 
    user_id: str,
    analysis_result: Dict[str, Any],
    recommendations: str
):
    """Process a quiz submission and store the results"""
    formatted_answers = []
    for answer in submission.answers:
        formatted_answers.append({
            "question_id": answer.question_id,
            "answer": answer.answer
        })
    
    # Extract scores from analysis
    quiz_result = schemas.QuizResultCreate(
        quiz_answers=formatted_answers,
        analysis_result=analysis_result,
        recommendations=recommendations,
        overall_score=analysis_result["score"],
        desirable_score=analysis_result["desirable"]["score"],
        effective_score=analysis_result["effective"]["score"],
        efficient_score=analysis_result["efficient"]["score"],
        polished_score=analysis_result["polished"]["score"],
        recommended_model=analysis_result["recommended_model"]
    )
    
    # Create the result in the database
    return create_quiz_result(db, quiz_result, user_id) 