from fastapi import FastAPI, HTTPException, Depends, Request, status, Body
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
import requests
from fastapi.responses import JSONResponse
from pydantic import BaseModel

# Create database tables
models.Base.metadata.create_all(bind=engine)

# Load environment variables
load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")
AUTH0_DOMAIN = os.getenv("AUTH0_DOMAIN")
AUTH0_API_AUDIENCE = os.getenv("AUTH0_API_AUDIENCE")
DEV_MODE = os.getenv("DEV_MODE", "false").lower() == "true"

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

# Auth0 token validation
async def get_current_user(credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)):
    """Validate Auth0 token and extract user ID"""
    # In dev mode, use a test user ID if no credentials provided
    if DEV_MODE and not credentials:
        return "test-user-id"
        
    token = credentials.credentials
    
    try:
        # Get Auth0 public key for token verification
        jwks_url = f'https://{AUTH0_DOMAIN}/.well-known/jwks.json'
        jwks_response = requests.get(jwks_url)
        jwks = jwks_response.json()
        
        # Verify the token
        unverified_header = jwt.get_unverified_header(token)
        rsa_key = {}
        for key in jwks["keys"]:
            if key["kid"] == unverified_header["kid"]:
                rsa_key = {
                    "kty": key["kty"],
                    "kid": key["kid"],
                    "use": key["use"],
                    "n": key["n"],
                    "e": key["e"]
                }
        
        if rsa_key:
            payload = jwt.decode(
                token,
                rsa_key,
                algorithms=["RS256"],
                audience=AUTH0_API_AUDIENCE,
                issuer=f'https://{AUTH0_DOMAIN}/'
            )
            # Return the Auth0 user_id (sub claim)
            return payload["sub"]
    except Exception as e:
        if DEV_MODE:
            return "test-user-id"
        raise HTTPException(
            status_code=401,
            detail=f"Invalid authentication credentials: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )

# Models
class QuizQuestion(BaseModel):
    id: str
    text: str
    options: List[str]
    category: str

class QuizAnswer(BaseModel):
    answers: Dict[str, str]

class QuizResult(BaseModel):
    scores: Dict[str, int]
    feedback: Dict[str, str]

# Sample quiz questions
QUIZ_QUESTIONS = [
    {
        "id": "d1",
        "text": "How does your free model feature align with your target users' needs?",
        "options": [
            "It directly addresses a critical pain point for users",
            "It offers a nice-to-have feature that some users might want",
            "It's primarily designed to lead users to our paid features",
            "We haven't specifically aligned it with user needs yet"
        ],
        "category": "desirable"
    },
    {
        "id": "d2",
        "text": "How do you measure user engagement with your free model feature?",
        "options": [
            "We track comprehensive metrics and regularly analyze usage patterns",
            "We look at basic engagement statistics occasionally",
            "We only track conversion to paid features",
            "We don't currently measure engagement"
        ],
        "category": "desirable"
    },
    {
        "id": "e1",
        "text": "How effectively does your free model solve the core problem it addresses?",
        "options": [
            "It completely solves a specific problem for users",
            "It partially solves a problem but with some limitations",
            "It provides basic functionality but requires paid upgrade for real solutions",
            "It's primarily a demonstration of capabilities rather than a solution"
        ],
        "category": "effective"
    },
    {
        "id": "e2",
        "text": "How do you evaluate the effectiveness of your free model?",
        "options": [
            "We conduct regular user testing and iterate based on feedback",
            "We occasionally gather feedback and make improvements",
            "We mainly rely on internal assessments of what should work",
            "We haven't formally evaluated effectiveness"
        ],
        "category": "effective"
    },
    {
        "id": "ef1",
        "text": "How quickly can users get value from your free model?",
        "options": [
            "Immediately, with minimal or no setup required",
            "Within minutes, after a brief onboarding process",
            "After some significant setup or learning curve",
            "It typically takes multiple sessions to see real value"
        ],
        "category": "efficient"
    },
    {
        "id": "ef2",
        "text": "How streamlined is the user experience with your free model?",
        "options": [
            "Highly optimized with no unnecessary steps or friction",
            "Generally smooth but with some minor friction points",
            "Somewhat cumbersome but functional",
            "Complex with significant friction points"
        ],
        "category": "efficient"
    },
    {
        "id": "p1",
        "text": "How would you rate the visual design and user interface of your free model?",
        "options": [
            "Professional, cohesive, and aligned with current design standards",
            "Clean and functional but not particularly distinctive",
            "Basic functionality without much attention to design",
            "Rough or unfinished in appearance"
        ],
        "category": "polished"
    },
    {
        "id": "p2",
        "text": "How complete is the implementation of your free model?",
        "options": [
            "Fully implemented with no obvious missing pieces or rough edges",
            "Mostly complete with minor limitations or rough edges",
            "Functional but with some notable missing elements",
            "Early stage or MVP with significant missing functionality"
        ],
        "category": "polished"
    }
]

# Routes
@app.get("/")
async def root():
    return {"message": "Welcome to the Intentional Free Model Quiz API"}

@app.get("/api/questions", response_model=List[QuizQuestion])
async def get_questions(user=Depends(get_current_user)):
    return QUIZ_QUESTIONS

@app.post("/api/submit", response_model=QuizResult)
async def submit_quiz(answers: QuizAnswer = Body(...), user=Depends(get_current_user)):
    # Calculate scores by category
    scores = {
        "desirable": 0,
        "effective": 0,
        "efficient": 0,
        "polished": 0
    }
    
    # Count questions by category
    category_counts = {
        "desirable": 0,
        "effective": 0,
        "efficient": 0,
        "polished": 0
    }
    
    for question in QUIZ_QUESTIONS:
        category = question["category"]
        category_counts[category] += 1
        
        # Calculate score based on selected answer
        question_id = question["id"]
        if question_id in answers.answers:
            selected_option = answers.answers[question_id]
            option_index = question["options"].index(selected_option)
            
            # Score is based on option index (first option is best)
            option_score = 100 - (option_index * 25)  # 100, 75, 50, 25
            scores[category] += option_score
    
    # Calculate average scores for each category
    for category in scores:
        if category_counts[category] > 0:
            scores[category] = scores[category] // category_counts[category]
    
    # Generate feedback based on scores
    feedback = {}
    
    if scores["desirable"] >= 80:
        feedback["desirable"] = "Excellent! Your free model offers something users truly want and value."
    elif scores["desirable"] >= 60:
        feedback["desirable"] = "Good job. Your free model is valuable to users, but could be better aligned with their needs."
    elif scores["desirable"] >= 40:
        feedback["desirable"] = "Consider researching more deeply what your users truly want from a free model."
    else:
        feedback["desirable"] = "Your free model may not be sufficiently aligned with user needs. Consider rethinking your approach."
    
    if scores["effective"] >= 80:
        feedback["effective"] = "Your free model effectively solves real problems for users."
    elif scores["effective"] >= 60:
        feedback["effective"] = "Your free model addresses user problems, but could be more thorough in its solutions."
    elif scores["effective"] >= 40:
        feedback["effective"] = "Your free model provides some value, but may not fully solve users' problems."
    else:
        feedback["effective"] = "Your free model may not be effectively solving user problems. Consider how to make it more useful."
    
    if scores["efficient"] >= 80:
        feedback["efficient"] = "Your free model delivers value quickly and with minimal friction."
    elif scores["efficient"] >= 60:
        feedback["efficient"] = "Your free model is reasonably efficient, but could be streamlined further."
    elif scores["efficient"] >= 40:
        feedback["efficient"] = "Users may encounter friction or delays before getting value from your free model."
    else:
        feedback["efficient"] = "Your free model may be too cumbersome or slow to deliver value effectively."
    
    if scores["polished"] >= 80:
        feedback["polished"] = "Your free model presents a professional, complete, and well-designed experience."
    elif scores["polished"] >= 60:
        feedback["polished"] = "Your free model is reasonably well-designed but could benefit from more polish."
    elif scores["polished"] >= 40:
        feedback["polished"] = "Your free model may appear unfinished or basic in its design and implementation."
    else:
        feedback["polished"] = "Your free model may need significant improvement in design and completeness."
    
    return {"scores": scores, "feedback": feedback}

@app.get("/api/health")
def health_check():
    return {"status": "healthy"}

@app.get("/api/quiz-questions")
def get_quiz_questions():
    try:
        with open("data/quiz_questions.json", "r") as f:
            quiz_data = json.load(f)
        return quiz_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/analyze", response_model=schemas.AnalysisResult)
async def analyze_model(
    submission: schemas.QuizSubmission, 
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user)
):
    try:
        # Process the quiz answers
        analysis_result = analyze_quiz_results(submission.answers)
        
        # Generate recommendations using OpenAI
        recommendations = generate_recommendations(analysis_result, submission.user_info)
        
        # Store results in database
        crud.process_quiz_submission(
            db=db,
            submission=submission,
            user_id=user_id,
            analysis_result=analysis_result,
            recommendations=recommendations
        )
        
        return {
            "analysis": analysis_result,
            "recommendations": recommendations
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/chat", response_model=schemas.ChatResponse)
async def chat_with_assistant(
    message_data: schemas.ChatMessage,
    user_id: str = Depends(get_current_user)
):
    try:
        # Generate a response using OpenAI
        response = generate_chat_response(message_data.message, message_data.context)
        
        return {
            "response": response
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/quiz-results", response_model=List[schemas.QuizResult])
async def get_user_results(
    skip: int = 0, 
    limit: int = 10, 
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user)
):
    results = crud.get_user_quiz_results(db, user_id, skip, limit)
    return results

@app.get("/api/quiz-results/{quiz_id}", response_model=schemas.QuizResult)
async def get_single_quiz_result(
    quiz_id: int,
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user)
):
    result = crud.get_quiz_result(db, quiz_id)
    if not result or result.user_id != user_id:
        raise HTTPException(status_code=404, detail="Quiz result not found")
    return result

@app.delete("/api/quiz-results/{quiz_id}")
async def delete_quiz_result(
    quiz_id: int,
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user)
):
    success = crud.delete_quiz_result(db, quiz_id, user_id)
    if not success:
        raise HTTPException(status_code=404, detail="Quiz result not found")
    return {"message": "Quiz result deleted successfully"}

# Helper functions
def generate_recommendations(analysis, user_info=None):
    # Use OpenAI to generate personalized recommendations
    prompt = f"""
    Based on the following analysis of a product-led free model:
    
    Desirable score: {analysis['desirable']['score']}/10
    Effective score: {analysis['effective']['score']}/10
    Efficient score: {analysis['efficient']['score']}/10
    Polished score: {analysis['polished']['score']}/10
    
    Overall assessment: {analysis['key_findings']}
    
    Provide specific, actionable recommendations for improving this free model.
    Focus on the DEEP framework (Desirable, Effective, Efficient, Polished).
    Include 3-5 concrete next steps the team should take.
    """
    
    response = openai.ChatCompletion.create(
        model="gpt-4",  # or whichever model is appropriate
        messages=[
            {"role": "system", "content": "You are an expert consultant on product-led growth and free model design. You provide specific, actionable advice to help companies improve their free model."},
            {"role": "user", "content": prompt}
        ]
    )
    
    return response.choices[0].message.content

def generate_chat_response(message, context=None):
    # Generate a chat response using OpenAI
    context_str = json.dumps(context) if context else "No additional context provided."
    
    prompt = f"""
    User message: {message}
    
    Context about their free model: {context_str}
    
    Respond as a product-led growth expert, providing helpful advice about free model design.
    """
    
    response = openai.ChatCompletion.create(
        model="gpt-4",  # or whichever model is appropriate
        messages=[
            {"role": "system", "content": "You are an expert consultant on product-led growth and free model design. You provide specific, actionable advice to help companies improve their free model."},
            {"role": "user", "content": prompt}
        ]
    )
    
    return response.choices[0].message.content

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 