from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any, Union
import datetime

# Basic schemas for the DEEP framework
class QuizQuestionResponse(BaseModel):
    """Quiz question for the DEEP framework assessment"""
    id: int
    text: str
    category: str
    options: List[str] = []
    order: int = 0
    required: bool = True

class UserEndgame(BaseModel):
    """User endgame and goals"""
    endgame: str
    primaryGoal: str
    secondaryGoal: Optional[str] = None

class Challenge(BaseModel):
    """User challenge with magnitude rating"""
    description: str
    userLevel: str
    magnitude: int

class Solution(BaseModel):
    """Solution to user challenges"""
    text: str

class ModelType(BaseModel):
    """Free model type selection"""
    selectedModel: str
    alignmentReason: Optional[str] = None

class Feature(BaseModel):
    """Feature for free or paid tier"""
    name: str
    description: Optional[str] = None
    tier: str  # "free" or "paid"

class QuizAnswers(BaseModel):
    """Legacy quiz answers format"""
    user_goal: Optional[str] = None
    primary_goal: Optional[str] = None
    secondary_goal: Optional[str] = None
    challenges: List[str] = []
    solutions: List[str] = []
    model_type: Optional[str] = None
    free_features: List[str] = []
    paid_features: List[str] = []

class FormData(BaseModel):
    """New form data format for the DEEP framework"""
    endgame: Optional[UserEndgame] = None
    challenges: List[Challenge] = []
    solutions: List[str] = []
    impactCost: Optional[Dict[str, List[str]]] = None
    modelType: Optional[ModelType] = None
    features: Optional[Dict[str, List[str]]] = None

class Score(BaseModel):
    """Score for a DEEP framework dimension"""
    value: float
    explanation: str

class Scores(BaseModel):
    """Scores for all DEEP framework dimensions"""
    desirable: Score
    effective: Score
    efficient: Score
    polished: Score
    overall: float

class Recommendation(BaseModel):
    """Recommendation for improving the free model strategy"""
    text: str
    priority: int  # 1 (highest) to 3 (lowest)
    rationale: str
    dimension: str  # "desirable", "effective", "efficient", "polished"

class ImplementationStep(BaseModel):
    """Implementation step for the free model strategy"""
    phase: str  # "immediate", "short-term", "long-term"
    action: str
    expected_outcome: str

class Analysis(BaseModel):
    """Analysis of the free model strategy"""
    scores: Scores
    strengths: List[str]
    weaknesses: List[str]
    implementation_plan: List[ImplementationStep]

class ChatRequest(BaseModel):
    """Chat request with message and optional context"""
    message: str
    context: Optional[Dict[str, Any]] = None

class ChatResponse(BaseModel):
    """Chat response with message"""
    message: str
    success: bool

class QuizSubmission(BaseModel):
    """Quiz submission with answers"""
    answers: QuizAnswers

class QuizResultResponse(BaseModel):
    """Response for quiz submission"""
    result_id: Optional[int] = None
    scores: Scores
    feedback: Dict[str, str]
    success: bool

class AnalyzeRequest(BaseModel):
    """Request for analyzing form data"""
    form_data: FormData
    user_id: Optional[str] = None

class AnalysisResponse(BaseModel):
    """Response for analysis request"""
    analysis: Analysis
    recommendations: List[Recommendation]
    form_data: Optional[Dict[str, Any]] = None
    success: bool

# User schemas
class UserBase(BaseModel):
    email: str
    name: Optional[str] = None

class UserCreate(UserBase):
    id: str  # Auth0 user ID

class User(UserBase):
    id: str
    created_at: datetime.datetime

    class Config:
        from_attributes = True

# Project schemas
class ProjectBase(BaseModel):
    name: str
    description: Optional[str] = None

class ProjectCreate(ProjectBase):
    pass

class Project(ProjectBase):
    id: int
    created_at: datetime.datetime
    updated_at: datetime.datetime

    class Config:
        from_attributes = True

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
    created_at: datetime.datetime
    updated_at: datetime.datetime
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
    created_at: datetime.datetime

class ChatSessionCreate(BaseModel):
    quiz_result_id: Optional[int] = None

class ChatSession(BaseModel):
    id: int
    user_id: str
    quiz_result_id: Optional[int] = None
    created_at: datetime.datetime
    updated_at: datetime.datetime
    messages: List[ChatMessageResponse] = []

    class Config:
        orm_mode = True

# API request/response models
class QuizSubmission(BaseModel):
    """Quiz submission with answers"""
    answers: QuizAnswers

class QuizResultResponse(BaseModel):
    """Response for quiz submission"""
    result_id: Optional[int] = None
    scores: Scores
    feedback: Dict[str, str]
    success: bool

class AnalyzeRequest(BaseModel):
    """Request for analyzing form data"""
    form_data: FormData
    user_id: Optional[str] = None

class AnalysisResponse(BaseModel):
    """Response for analysis request"""
    analysis: Analysis
    recommendations: List[Recommendation]
    form_data: Optional[Dict[str, Any]] = None
    success: bool

# Database models
class UserBase(BaseModel):
    """Base user schema"""
    email: str
    name: Optional[str] = None

class UserCreate(UserBase):
    """User creation schema"""
    id: str  # Auth0 ID

class UserResponse(UserBase):
    """User response schema"""
    id: str
    created_at: datetime.datetime

    class Config:
        orm_mode = True
        
class QuizResultCreate(BaseModel):
    """Quiz result creation schema"""
    user_id: str
    project_id: Optional[int] = None
    quiz_answers: Dict[str, Any]
    scores: Dict[str, Any]
    feedback: Dict[str, str]
    
class QuizResultWithAnalysis(BaseModel):
    """Quiz result with full analysis"""
    id: int
    user_id: str
    project_id: Optional[int]
    quiz_answers: Dict[str, Any]
    scores: Dict[str, Any]
    feedback: Dict[str, str]
    analysis_result: Optional[Dict[str, Any]]
    recommendations: Optional[str]
    implementation_plan: Optional[Dict[str, Any]]
    created_at: datetime.datetime
    
    class Config:
        orm_mode = True

# Add the new schema at an appropriate location in the file
class SharedAnalysisResponse(BaseModel):
    """Response for shared analysis creation"""
    share_id: str
    success: bool

class SharedAnalysisView(BaseModel):
    """Shared analysis view data"""
    share_id: str
    form_data: Dict[str, Any]
    analysis: Any
    recommendations: List[Any]
    pricing_strategy: Optional[Dict[str, Any]] = None
    created_at: datetime.datetime
    views: int
    
    class Config:
        orm_mode = True 