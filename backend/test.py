from fastapi import FastAPI, Body
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict
from pydantic import BaseModel
import uvicorn

app = FastAPI(title="Intentional Free Model Quiz API - Test")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For testing allow all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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

@app.get("/api/questions")
async def get_questions():
    return QUIZ_QUESTIONS

@app.post("/api/submit")
async def submit_quiz(answers: QuizAnswer = Body(...)):
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
            try:
                option_index = question["options"].index(selected_option)
                
                # Score is based on option index (first option is best)
                option_score = 100 - (option_index * 25)  # 100, 75, 50, 25
                scores[category] += option_score
            except ValueError:
                # Handle case where the selected option isn't in the options list
                print(f"Warning: Option '{selected_option}' not found for question {question_id}")
    
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
    return {"status": "ok"}

if __name__ == "__main__":
    uvicorn.run("test:app", host="0.0.0.0", port=8000, reload=True) 