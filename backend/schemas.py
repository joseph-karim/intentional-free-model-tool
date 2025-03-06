from pydantic import BaseModel
from typing import List, Dict, Optional, Any
from datetime import datetime

# Quiz schemas
class QuizAnswer(BaseModel):
    question_id: str
    answer: Any

class QuizSubmission(BaseModel):
    answers: List[QuizAnswer]
    user_info: Optional[Dict[str, str]] = None

class AnalysisScore(BaseModel):
    score: float
    analysis: str

class Analysis(BaseModel):
    score: float
    desirable: AnalysisScore
    effective: AnalysisScore
    efficient: AnalysisScore
    polished: AnalysisScore
    recommended_model: str
    key_findings: List[str]

class AnalysisResult(BaseModel):
    analysis: Analysis
    recommendations: str

class QuizResultCreate(BaseModel):
    quiz_answers: List[Dict[str, Any]]
    analysis_result: Dict[str, Any]
    recommendations: str
    overall_score: float
    desirable_score: float
    effective_score: float
    efficient_score: float
    polished_score: float
    recommended_model: str

class QuizResult(QuizResultCreate):
    id: int
    user_id: str
    created_at: datetime

    class Config:
        orm_mode = True

# Chat schemas
class ChatMessage(BaseModel):
    message: str
    context: Optional[Dict[str, Any]] = None

class ChatResponse(BaseModel):
    response: str 