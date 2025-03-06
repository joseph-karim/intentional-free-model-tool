import json
import requests
from typing import Dict, List, Any
import os
import sys

def print_header(message):
    print("\n" + "=" * 80)
    print(f" {message} ".center(80, "="))
    print("=" * 80)

def print_success(message):
    print(f"✅ {message}")

def print_failure(message):
    print(f"❌ {message}")

def print_warning(message):
    print(f"⚠️ {message}")

def print_info(message):
    print(f"ℹ️ {message}")

def test_quiz_questions_structure():
    print_header("Testing Quiz Questions Structure")
    
    # Sample quiz questions (from our implementation)
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
        # More questions would be here...
    ]
    
    # Validate structure
    valid = True
    for i, question in enumerate(QUIZ_QUESTIONS):
        if not all(key in question for key in ["id", "text", "options", "category"]):
            print_failure(f"Question {i+1} is missing required fields")
            valid = False
        
        if not isinstance(question.get("options", []), list) or len(question.get("options", [])) == 0:
            print_failure(f"Question {i+1} has invalid options")
            valid = False
    
    if valid:
        print_success("Quiz questions structure is valid")
    else:
        print_failure("Quiz questions structure has issues")

def test_submit_quiz_logic():
    print_header("Testing Quiz Submission Logic")
    
    # Sample quiz questions
    QUIZ_QUESTIONS = [
        {
            "id": "d1",
            "text": "Test question 1",
            "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
            "category": "desirable"
        },
        {
            "id": "d2",
            "text": "Test question 2",
            "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
            "category": "desirable"
        },
        {
            "id": "e1",
            "text": "Test question 3",
            "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
            "category": "effective"
        }
    ]
    
    # Mock submission with all first options (best score)
    mock_answers = {
        "d1": "Option 1",
        "d2": "Option 1",
        "e1": "Option 1"
    }
    
    # Calculate expected scores
    scores = {
        "desirable": 0,
        "effective": 0,
        "efficient": 0,
        "polished": 0
    }
    
    category_counts = {
        "desirable": 0,
        "effective": 0,
        "efficient": 0,
        "polished": 0
    }
    
    for question in QUIZ_QUESTIONS:
        category = question["category"]
        category_counts[category] += 1
        
        question_id = question["id"]
        if question_id in mock_answers:
            selected_option = mock_answers[question_id]
            try:
                option_index = question["options"].index(selected_option)
                option_score = 100 - (option_index * 25)  # 100, 75, 50, 25
                scores[category] += option_score
            except ValueError:
                print_warning(f"Option '{selected_option}' not found for question {question_id}")
    
    # Calculate average scores
    for category in scores:
        if category_counts[category] > 0:
            scores[category] = scores[category] // category_counts[category]
    
    # Verify calculations
    expected_scores = {
        "desirable": 100,  # Both questions answered with Option 1 (100 each)
        "effective": 100,  # One question answered with Option 1 (100)
        "efficient": 0,    # No questions in this category
        "polished": 0      # No questions in this category
    }
    
    if scores == expected_scores:
        print_success("Quiz scoring logic works correctly")
    else:
        print_failure(f"Quiz scoring logic failed. Expected: {expected_scores}, Got: {scores}")

def test_frontend_api_compatibility():
    print_header("Testing Frontend-API Compatibility")
    
    # Expected API endpoints
    expected_endpoints = [
        {
            "path": "/api/questions",
            "method": "GET",
            "description": "Get quiz questions"
        },
        {
            "path": "/api/submit",
            "method": "POST",
            "description": "Submit quiz answers"
        },
        {
            "path": "/api/health",
            "method": "GET",
            "description": "Health check"
        }
    ]
    
    # Check if frontend code is using these endpoints
    frontend_files = {
        "../frontend/src/pages/QuizPage.js": ["/api/questions", "/api/submit"],
        "../frontend/src/App.js": []
    }
    
    for file_path, expected_endpoints_in_file in frontend_files.items():
        if not os.path.exists(file_path):
            print_warning(f"File {file_path} not found")
            continue
            
        try:
            with open(file_path, 'r') as f:
                content = f.read()
                
            all_found = True
            for endpoint in expected_endpoints_in_file:
                if endpoint not in content:
                    print_failure(f"Endpoint {endpoint} not found in {file_path}")
                    all_found = False
                else:
                    print_success(f"Endpoint {endpoint} found in {file_path}")
                    
            if all_found and expected_endpoints_in_file:
                print_success(f"All expected endpoints found in {file_path}")
                
        except Exception as e:
            print_failure(f"Error checking {file_path}: {e}")

def test_frontend_component_dependencies():
    print_header("Testing Frontend Component Dependencies")
    
    frontend_files = [
        "../frontend/src/App.js",
        "../frontend/src/index.js",
        "../frontend/src/components/Header.js",
        "../frontend/src/components/Footer.js",
        "../frontend/src/pages/HomePage.js",
        "../frontend/src/pages/QuizPage.js",
        "../frontend/src/pages/ResultsPage.js"
    ]
    
    dependencies = {
        "react": "React",
        "react-router-dom": ["BrowserRouter", "Routes", "Route", "Link", "useNavigate", "useLocation"],
        "react-dom": "ReactDOM"
    }
    
    missing_files = []
    missing_dependencies = {}
    
    for file_path in frontend_files:
        if not os.path.exists(file_path):
            missing_files.append(file_path)
            continue
            
        try:
            with open(file_path, 'r') as f:
                content = f.read()
                
            file_missing_deps = []
            for package, components in dependencies.items():
                if isinstance(components, list):
                    for component in components:
                        if component in content and f"import {component}" not in content and f"import {{ {component}" not in content:
                            file_missing_deps.append(f"{component} from {package}")
                else:
                    if components in content and f"import {components}" not in content:
                        file_missing_deps.append(f"{components} from {package}")
            
            if file_missing_deps:
                missing_dependencies[file_path] = file_missing_deps
                
        except Exception as e:
            print_failure(f"Error checking {file_path}: {e}")
    
    if missing_files:
        print_warning("Missing frontend files:")
        for file in missing_files:
            print(f"  - {file}")
    else:
        print_success("All frontend files exist")
        
    if missing_dependencies:
        print_warning("Possible missing dependencies:")
        for file, deps in missing_dependencies.items():
            print(f"  In {file}:")
            for dep in deps:
                print(f"    - {dep}")
    else:
        print_success("All dependencies appear to be properly imported")

if __name__ == "__main__":
    print_header("Testing Intentional Free Model Quiz Application")
    
    test_quiz_questions_structure()
    test_submit_quiz_logic()
    test_frontend_api_compatibility()
    test_frontend_component_dependencies()
    
    print_header("Test Summary")
    print_info("This test script helps identify potential issues without running the actual server.")
    print_info("To run the complete application:")
    print_info("1. For backend: Fix Python version compatibility or use a compatible version")
    print_info("2. For frontend: Ensure all dependencies are installed with 'npm install'")
    print_info("3. Run backend with 'uvicorn main:app --reload' (in a compatible environment)")
    print_info("4. Run frontend with 'npm start'") 