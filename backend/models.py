from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Float, JSON, DateTime
from sqlalchemy.orm import relationship
from database import Base
import datetime

class QuizResult(Base):
    __tablename__ = "quiz_results"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, index=True)  # Auth0 user ID
    quiz_answers = Column(JSON)  # Store raw quiz answers
    analysis_result = Column(JSON)  # Store analysis results
    recommendations = Column(String)  # Store recommendations
    overall_score = Column(Float)  # Overall score
    desirable_score = Column(Float)  # Desirable dimension score
    effective_score = Column(Float)  # Effective dimension score
    efficient_score = Column(Float)  # Efficient dimension score
    polished_score = Column(Float)  # Polished dimension score
    recommended_model = Column(String)  # Recommended model type
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationship to user
    user = relationship("User", back_populates="quiz_results") 