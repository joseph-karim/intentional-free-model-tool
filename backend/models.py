from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Float, JSON, DateTime, Text, Table
from sqlalchemy.orm import relationship
from database import Base
import datetime

# Association table for many-to-many relationship between users and projects
user_projects = Table(
    "user_projects",
    Base.metadata,
    Column("user_id", String, ForeignKey("users.id")),
    Column("project_id", Integer, ForeignKey("projects.id"))
)

class User(Base):
    __tablename__ = "users"
    
    id = Column(String, primary_key=True)  # Auth0 user ID
    email = Column(String, unique=True, index=True)
    name = Column(String)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    # Relationships
    quiz_results = relationship("QuizResult", back_populates="user")
    projects = relationship("Project", secondary=user_projects, back_populates="users")
    chat_sessions = relationship("ChatSession", back_populates="user")

class Project(Base):
    __tablename__ = "projects"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(Text)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
    
    # Relationships
    users = relationship("User", secondary=user_projects, back_populates="projects")
    quiz_results = relationship("QuizResult", back_populates="project")

class QuizResult(Base):
    __tablename__ = "quiz_results"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), index=True)
    
    # Context information
    product_description = Column(Text)  # Detailed product description
    target_audience = Column(Text)  # Target user personas
    business_goals = Column(Text)  # Business objectives
    
    # User journey information
    user_endgame = Column(Text)  # Ultimate success state for users
    beginner_stage = Column(Text)  # Description of beginner users
    intermediate_stage = Column(Text)  # Description of intermediate users
    advanced_stage = Column(Text)  # Description of advanced users
    key_challenges = Column(JSON)  # Challenges at each stage
    
    # Current model assessment
    current_model = Column(Text)  # Description of current free model if any
    current_metrics = Column(JSON)  # Performance metrics
    
    # DEEP framework inputs - extended for free-form text
    quiz_answers = Column(JSON)  # Store raw quiz answers (structured)
    desirable_inputs = Column(JSON)  # Detailed inputs for Desirable dimension
    effective_inputs = Column(JSON)  # Detailed inputs for Effective dimension
    efficient_inputs = Column(JSON)  # Detailed inputs for Efficient dimension
    polished_inputs = Column(JSON)  # Detailed inputs for Polished dimension
    
    # Analysis results - extended for more detailed AI analysis
    analysis_result = Column(JSON)  # Store comprehensive analysis results
    recommendations = Column(Text)  # Detailed recommendations
    implementation_plan = Column(JSON)  # Phased implementation plan
    
    # Scores
    overall_score = Column(Float)  # Overall score
    desirable_score = Column(Float)  # Desirable dimension score
    effective_score = Column(Float)  # Effective dimension score
    efficient_score = Column(Float)  # Efficient dimension score
    polished_score = Column(Float)  # Polished dimension score
    
    # Recommendations
    recommended_model = Column(String)  # Recommended model type
    
    # Metadata
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
    version = Column(Integer, default=1)  # For tracking versions of analysis

    # Relationships
    user = relationship("User", back_populates="quiz_results")
    project = relationship("Project", back_populates="quiz_results")
    
class ChatSession(Base):
    __tablename__ = "chat_sessions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), index=True)
    quiz_result_id = Column(Integer, ForeignKey("quiz_results.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="chat_sessions")
    messages = relationship("ChatMessage", back_populates="session", cascade="all, delete-orphan")

class ChatMessage(Base):
    __tablename__ = "chat_messages"
    
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("chat_sessions.id"), index=True)
    user_message = Column(Text)  # Message from the user
    assistant_message = Column(Text)  # Response from the assistant
    context = Column(JSON, nullable=True)  # Additional context for the message
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    # Relationships
    session = relationship("ChatSession", back_populates="messages") 