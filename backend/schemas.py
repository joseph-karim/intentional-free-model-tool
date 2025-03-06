from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any, Union
from datetime import datetime

# User schemas
class UserBase(BaseModel):
    email: str
    name: Optional[str] = None

class UserCreate(UserBase):
    id: str  # Auth0 user ID

class User(UserBase):
    id: str
    created_at: datetime

    class Config:
        orm_mode = True

# Project schemas
class ProjectBase(BaseModel):
    name: str
    description: Optional[str] = None

class ProjectCreate(ProjectBase):
    pass

class Project(ProjectBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

# Context schemas
class ProductContext(BaseModel):
    product_description: str = Field(..., description="Detailed description of your product and its core value proposition")
    target_audience: str = Field(..., description="Description of your target user personas and their needs")
    business_goals: str = Field(..., description="Your business objectives and growth targets")

# User journey schemas
class UserJourney(BaseModel):
    user_endgame: str = Field(..., description="The ultimate success state for your users")
    beginner_stage: str = Field(..., description="Description of beginner users and their needs")
    intermediate_stage: str = Field(..., description="Description of intermediate users and their needs")
    advanced_stage: str = Field(..., description="Description of advanced users and their needs")
    key_challenges: Dict[str, List[str]] = Field(..., description="Key challenges at each user stage")

# Current model assessment schemas
class CurrentModelAssessment(BaseModel):
    current_model: Optional[str] = Field(None, description="Description of your current free model approach if any")
    current_metrics: Optional[Dict[str, Any]] = Field(None, description="Performance metrics of your current model")

# DEEP framework input schemas
class DesirableInputs(BaseModel):
    value_proposition: str = Field(..., description="What specific value does your free model provide to users?")
    user_needs: str = Field(..., description="Which specific user needs does your free model address?")
    competitive_differentiation: str = Field(..., description="How does your free model stand out from competitors?")
    additional_notes: Optional[str] = None

class EffectiveInputs(BaseModel):
    core_problems: str = Field(..., description="What core user problems does your free model solve?")
    success_metrics: str = Field(..., description="How do you measure the effectiveness of your free model?")
    friction_points: str = Field(..., description="What friction points exist in your current user experience?")
    additional_notes: Optional[str] = None

class EfficientInputs(BaseModel):
    acquisition_cost: str = Field(..., description="What is your customer acquisition cost for free users?")
    conversion_strategy: str = Field(..., description="How do you convert free users to paying customers?")
    resource_allocation: str = Field(..., description="How do you allocate resources between free and paid features?")
    additional_notes: Optional[str] = None

class PolishedInputs(BaseModel):
    user_experience: str = Field(..., description="How refined is the user experience of your free model?")
    onboarding_process: str = Field(..., description="Describe your user onboarding process")
    feedback_mechanisms: str = Field(..., description="How do you collect and act on user feedback?")
    additional_notes: Optional[str] = None

# Quiz schemas
class QuizAnswer(BaseModel):
    question_id: str
    answer: Any

class DEEPInputs(BaseModel):
    desirable: DesirableInputs
    effective: EffectiveInputs
    efficient: EfficientInputs
    polished: PolishedInputs

class QuizSubmission(BaseModel):
    context: ProductContext
    user_journey: UserJourney
    current_model: Optional[CurrentModelAssessment] = None
    structured_answers: Optional[List[QuizAnswer]] = None
    deep_inputs: DEEPInputs

# Analysis schemas
class AnalysisScore(BaseModel):
    score: float
    analysis: str
    strengths: List[str]
    weaknesses: List[str]
    opportunities: List[str]

class ImplementationStep(BaseModel):
    title: str
    description: str
    priority: str  # "High", "Medium", "Low"
    estimated_effort: str  # "Low", "Medium", "High"
    expected_impact: str  # "Low", "Medium", "High"
    metrics: List[str]

class ImplementationPlan(BaseModel):
    phases: Dict[str, List[ImplementationStep]]  # e.g. "Phase 1": [steps]
    timeline: str
    success_metrics: List[str]

class Analysis(BaseModel):
    score: float
    desirable: AnalysisScore
    effective: AnalysisScore
    efficient: AnalysisScore
    polished: AnalysisScore
    recommended_model: str
    key_findings: List[str]
    implementation_plan: ImplementationPlan

class AnalysisResult(BaseModel):
    analysis: Analysis
    recommendations: str

class QuizResultCreate(BaseModel):
    # Context information
    product_description: str
    target_audience: str
    business_goals: str
    
    # User journey information
    user_endgame: str
    beginner_stage: str
    intermediate_stage: str
    advanced_stage: str
    key_challenges: Dict[str, List[str]]
    
    # Current model assessment (optional)
    current_model: Optional[str] = None
    current_metrics: Optional[Dict[str, Any]] = None
    
    # DEEP framework inputs
    quiz_answers: Optional[List[Dict[str, Any]]] = None
    desirable_inputs: Dict[str, str]
    effective_inputs: Dict[str, str]
    efficient_inputs: Dict[str, str]
    polished_inputs: Dict[str, str]
    
    # Analysis results
    analysis_result: Dict[str, Any]
    recommendations: str
    implementation_plan: Dict[str, Any]
    
    # Scores
    overall_score: float
    desirable_score: float
    effective_score: float
    efficient_score: float
    polished_score: float
    
    # Recommendations
    recommended_model: str

class QuizResult(QuizResultCreate):
    id: int
    user_id: str
    project_id: Optional[int] = None
    created_at: datetime
    updated_at: datetime
    version: int

    class Config:
        orm_mode = True

# Chat schemas
class ChatMessageCreate(BaseModel):
    user_message: str
    context: Optional[Dict[str, Any]] = None

class ChatMessageResponse(BaseModel):
    user_message: str
    assistant_message: str
    created_at: datetime

class ChatSessionCreate(BaseModel):
    quiz_result_id: Optional[int] = None

class ChatSession(BaseModel):
    id: int
    user_id: str
    quiz_result_id: Optional[int] = None
    created_at: datetime
    updated_at: datetime
    messages: List[ChatMessageResponse] = []

    class Config:
        orm_mode = True 