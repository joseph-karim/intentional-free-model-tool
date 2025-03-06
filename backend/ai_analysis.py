import os
import json
import openai
from typing import Dict, List, Any, Optional
from tenacity import retry, stop_after_attempt, wait_random_exponential
from dotenv import load_dotenv
import tiktoken
from fastapi_cache.decorator import cache
from pydantic import BaseModel

# Load environment variables
load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")
MODEL = os.getenv("OPENAI_MODEL", "gpt-4-turbo")
MAX_TOKENS = 4000  # Default max tokens for response

# Token counting
def count_tokens(text: str) -> int:
    """Count the number of tokens in a text string."""
    encoding = tiktoken.encoding_for_model(MODEL)
    return len(encoding.encode(text))

# Retry decorator for OpenAI API calls
@retry(wait=wait_random_exponential(min=1, max=60), stop=stop_after_attempt(6))
def call_openai_api(messages, max_tokens=MAX_TOKENS, temperature=0.7):
    """Call OpenAI API with retry logic."""
    response = openai.chat.completions.create(
        model=MODEL,
        messages=messages,
        max_tokens=max_tokens,
        temperature=temperature,
    )
    return response.choices[0].message.content

# System prompts
SYSTEM_PROMPTS = {
    "analysis": """You are an expert product strategist specializing in product-led growth and free model strategies. 
    Your task is to analyze the provided information about a product and its free model strategy using the DEEP framework:
    
    - Desirable: How compelling is the free offering to users?
    - Effective: How well does it solve real user problems?
    - Efficient: How sustainable is it for the business?
    - Polished: How refined is the user experience?
    
    Provide a comprehensive analysis with specific, actionable recommendations.""",
    
    "desirable_analysis": """You are analyzing the 'Desirable' dimension of a free model strategy. 
    Focus on how compelling the free offering is to users, evaluating the value proposition, 
    alignment with user needs, and competitive differentiation. 
    Identify strengths, weaknesses, and opportunities for improvement.""",
    
    "effective_analysis": """You are analyzing the 'Effective' dimension of a free model strategy. 
    Focus on how well the free offering solves real user problems, evaluating problem-solution fit, 
    success metrics, and friction points in the user experience. 
    Identify strengths, weaknesses, and opportunities for improvement.""",
    
    "efficient_analysis": """You are analyzing the 'Efficient' dimension of a free model strategy. 
    Focus on how sustainable the free offering is for the business, evaluating acquisition costs, 
    conversion strategy, and resource allocation. 
    Identify strengths, weaknesses, and opportunities for improvement.""",
    
    "polished_analysis": """You are analyzing the 'Polished' dimension of a free model strategy. 
    Focus on how refined the user experience is, evaluating the overall UX, 
    onboarding process, and feedback mechanisms. 
    Identify strengths, weaknesses, and opportunities for improvement.""",
    
    "implementation_plan": """You are creating an implementation plan for improving a free model strategy. 
    Based on the analysis provided, create a phased approach with specific, actionable steps. 
    For each step, include title, description, priority, estimated effort, expected impact, and success metrics.""",
    
    "chat_response": """You are an AI assistant specializing in product-led growth and free model strategies. 
    You have access to the analysis and context of a product's free model strategy. 
    Provide helpful, specific, and actionable advice based on the user's question and the available context."""
}

# Analysis functions
@cache(expire=3600)  # Cache for 1 hour
async def analyze_desirable_dimension(inputs: Dict[str, Any]) -> Dict[str, Any]:
    """Analyze the Desirable dimension of the free model strategy."""
    messages = [
        {"role": "system", "content": SYSTEM_PROMPTS["desirable_analysis"]},
        {"role": "user", "content": f"""
            Please analyze the 'Desirable' dimension of this free model strategy:
            
            Value Proposition: {inputs.get('value_proposition', 'N/A')}
            User Needs: {inputs.get('user_needs', 'N/A')}
            Competitive Differentiation: {inputs.get('competitive_differentiation', 'N/A')}
            Additional Notes: {inputs.get('additional_notes', 'N/A')}
            
            Provide a comprehensive analysis with a score from 1-10, detailed analysis text,
            and lists of specific strengths, weaknesses, and opportunities.
            
            Format your response as JSON with the following structure:
            {{
                "score": float,
                "analysis": "detailed analysis text",
                "strengths": ["strength1", "strength2", ...],
                "weaknesses": ["weakness1", "weakness2", ...],
                "opportunities": ["opportunity1", "opportunity2", ...]
            }}
        """}
    ]
    
    response = call_openai_api(messages)
    return json.loads(response)

@cache(expire=3600)  # Cache for 1 hour
async def analyze_effective_dimension(inputs: Dict[str, Any]) -> Dict[str, Any]:
    """Analyze the Effective dimension of the free model strategy."""
    messages = [
        {"role": "system", "content": SYSTEM_PROMPTS["effective_analysis"]},
        {"role": "user", "content": f"""
            Please analyze the 'Effective' dimension of this free model strategy:
            
            Core Problems Solved: {inputs.get('core_problems', 'N/A')}
            Success Metrics: {inputs.get('success_metrics', 'N/A')}
            Friction Points: {inputs.get('friction_points', 'N/A')}
            Additional Notes: {inputs.get('additional_notes', 'N/A')}
            
            Provide a comprehensive analysis with a score from 1-10, detailed analysis text,
            and lists of specific strengths, weaknesses, and opportunities.
            
            Format your response as JSON with the following structure:
            {{
                "score": float,
                "analysis": "detailed analysis text",
                "strengths": ["strength1", "strength2", ...],
                "weaknesses": ["weakness1", "weakness2", ...],
                "opportunities": ["opportunity1", "opportunity2", ...]
            }}
        """}
    ]
    
    response = call_openai_api(messages)
    return json.loads(response)

@cache(expire=3600)  # Cache for 1 hour
async def analyze_efficient_dimension(inputs: Dict[str, Any]) -> Dict[str, Any]:
    """Analyze the Efficient dimension of the free model strategy."""
    messages = [
        {"role": "system", "content": SYSTEM_PROMPTS["efficient_analysis"]},
        {"role": "user", "content": f"""
            Please analyze the 'Efficient' dimension of this free model strategy:
            
            Acquisition Cost: {inputs.get('acquisition_cost', 'N/A')}
            Conversion Strategy: {inputs.get('conversion_strategy', 'N/A')}
            Resource Allocation: {inputs.get('resource_allocation', 'N/A')}
            Additional Notes: {inputs.get('additional_notes', 'N/A')}
            
            Provide a comprehensive analysis with a score from 1-10, detailed analysis text,
            and lists of specific strengths, weaknesses, and opportunities.
            
            Format your response as JSON with the following structure:
            {{
                "score": float,
                "analysis": "detailed analysis text",
                "strengths": ["strength1", "strength2", ...],
                "weaknesses": ["weakness1", "weakness2", ...],
                "opportunities": ["opportunity1", "opportunity2", ...]
            }}
        """}
    ]
    
    response = call_openai_api(messages)
    return json.loads(response)

@cache(expire=3600)  # Cache for 1 hour
async def analyze_polished_dimension(inputs: Dict[str, Any]) -> Dict[str, Any]:
    """Analyze the Polished dimension of the free model strategy."""
    messages = [
        {"role": "system", "content": SYSTEM_PROMPTS["polished_analysis"]},
        {"role": "user", "content": f"""
            Please analyze the 'Polished' dimension of this free model strategy:
            
            User Experience: {inputs.get('user_experience', 'N/A')}
            Onboarding Process: {inputs.get('onboarding_process', 'N/A')}
            Feedback Mechanisms: {inputs.get('feedback_mechanisms', 'N/A')}
            Additional Notes: {inputs.get('additional_notes', 'N/A')}
            
            Provide a comprehensive analysis with a score from 1-10, detailed analysis text,
            and lists of specific strengths, weaknesses, and opportunities.
            
            Format your response as JSON with the following structure:
            {{
                "score": float,
                "analysis": "detailed analysis text",
                "strengths": ["strength1", "strength2", ...],
                "weaknesses": ["weakness1", "weakness2", ...],
                "opportunities": ["opportunity1", "opportunity2", ...]
            }}
        """}
    ]
    
    response = call_openai_api(messages)
    return json.loads(response)

@cache(expire=3600)  # Cache for 1 hour
async def generate_key_findings(dimensional_analyses: Dict[str, Any], context: Dict[str, Any]) -> List[str]:
    """Generate key findings based on the dimensional analyses and context."""
    messages = [
        {"role": "system", "content": SYSTEM_PROMPTS["analysis"]},
        {"role": "user", "content": f"""
            Based on the following analyses and context, generate a list of 5-7 key findings about the free model strategy:
            
            Context:
            Product Description: {context.get('product_description', 'N/A')}
            Target Audience: {context.get('target_audience', 'N/A')}
            Business Goals: {context.get('business_goals', 'N/A')}
            
            Dimensional Analyses:
            Desirable: {json.dumps(dimensional_analyses.get('desirable', {}))}
            Effective: {json.dumps(dimensional_analyses.get('effective', {}))}
            Efficient: {json.dumps(dimensional_analyses.get('efficient', {}))}
            Polished: {json.dumps(dimensional_analyses.get('polished', {}))}
            
            Format your response as a JSON array of strings.
        """}
    ]
    
    response = call_openai_api(messages)
    return json.loads(response)

@cache(expire=3600)  # Cache for 1 hour
async def recommend_free_model_type(analyses: Dict[str, Any], context: Dict[str, Any]) -> str:
    """Recommend a free model type based on the analyses and context."""
    messages = [
        {"role": "system", "content": SYSTEM_PROMPTS["analysis"]},
        {"role": "user", "content": f"""
            Based on the following analyses and context, recommend the most appropriate free model type:
            
            Context:
            Product Description: {context.get('product_description', 'N/A')}
            Target Audience: {context.get('target_audience', 'N/A')}
            Business Goals: {context.get('business_goals', 'N/A')}
            
            Dimensional Analyses:
            Desirable: {json.dumps(analyses.get('desirable', {}))}
            Effective: {json.dumps(analyses.get('effective', {}))}
            Efficient: {json.dumps(analyses.get('efficient', {}))}
            Polished: {json.dumps(analyses.get('polished', {}))}
            
            Choose from these options:
            - "Freemium": Feature-limited free version with premium upgrades
            - "Free Trial": Time-limited access to full product
            - "Usage-Based": Free up to certain usage limits
            - "Community Edition": Free version with limited support
            - "Open Core": Free basic version with paid extensions
            - "Ad-Supported": Free access with advertisements
            - "Other": (with explanation)
            
            Provide your answer as a JSON object with "model_type" and "explanation" fields.
        """}
    ]
    
    response = call_openai_api(messages)
    result = json.loads(response)
    return result

@cache(expire=3600)  # Cache for 1 hour
async def generate_implementation_plan(analyses: Dict[str, Any], context: Dict[str, Any]) -> Dict[str, Any]:
    """Generate an implementation plan based on the analyses and context."""
    messages = [
        {"role": "system", "content": SYSTEM_PROMPTS["implementation_plan"]},
        {"role": "user", "content": f"""
            Based on the following analyses and context, create a phased implementation plan:
            
            Context:
            Product Description: {context.get('product_description', 'N/A')}
            Target Audience: {context.get('target_audience', 'N/A')}
            Business Goals: {context.get('business_goals', 'N/A')}
            
            Dimensional Analyses:
            Desirable: {json.dumps(analyses.get('desirable', {}))}
            Effective: {json.dumps(analyses.get('effective', {}))}
            Efficient: {json.dumps(analyses.get('efficient', {}))}
            Polished: {json.dumps(analyses.get('polished', {}))}
            
            Create a structured implementation plan with 2-3 phases, each containing 3-5 specific steps.
            For each step, include:
            - title: Short, descriptive title
            - description: Detailed explanation
            - priority: "High", "Medium", or "Low"
            - estimated_effort: "Low", "Medium", or "High" 
            - expected_impact: "Low", "Medium", or "High"
            - metrics: List of success metrics for the step
            
            Also include an overall timeline and list of overall success metrics.
            
            Format your response as a JSON object with this structure:
            {
                "phases": {
                    "Phase 1": [
                        {
                            "title": "Step title",
                            "description": "Step description",
                            "priority": "High/Medium/Low",
                            "estimated_effort": "High/Medium/Low",
                            "expected_impact": "High/Medium/Low",
                            "metrics": ["metric1", "metric2"]
                        },
                        ...
                    ],
                    ...
                },
                "timeline": "Overall timeline description",
                "success_metrics": ["metric1", "metric2", ...]
            }
        """}
    ]
    
    response = call_openai_api(messages)
    return json.loads(response)

@cache(expire=3600)  # Cache for 1 hour
async def generate_recommendations(analyses: Dict[str, Any], context: Dict[str, Any]) -> str:
    """Generate comprehensive recommendations based on the analyses and context."""
    messages = [
        {"role": "system", "content": SYSTEM_PROMPTS["analysis"]},
        {"role": "user", "content": f"""
            Based on the following analyses and context, generate comprehensive recommendations:
            
            Context:
            Product Description: {context.get('product_description', 'N/A')}
            Target Audience: {context.get('target_audience', 'N/A')}
            Business Goals: {context.get('business_goals', 'N/A')}
            
            Dimensional Analyses:
            Desirable: {json.dumps(analyses.get('desirable', {}))}
            Effective: {json.dumps(analyses.get('effective', {}))}
            Efficient: {json.dumps(analyses.get('efficient', {}))}
            Polished: {json.dumps(analyses.get('polished', {}))}
            
            Provide a comprehensive set of recommendations addressing:
            1. Strategic direction for the free model
            2. Specific improvements for each DEEP dimension
            3. Feature allocation guidance (what to include in free vs. paid)
            4. Conversion trigger recommendations
            5. Success metrics to track
            
            Format your response as detailed markdown text with clear headings and bullet points.
        """}
    ]
    
    response = call_openai_api(messages, max_tokens=2000)
    return response

async def analyze_chat_message(message: str, context: Dict[str, Any]) -> str:
    """Analyze a chat message and provide a helpful response."""
    # Prepare context for the chat
    context_summary = {}
    
    if "quiz_result" in context:
        quiz = context["quiz_result"]
        context_summary = {
            "product_description": quiz.get("product_description", "N/A"),
            "target_audience": quiz.get("target_audience", "N/A"),
            "business_goals": quiz.get("business_goals", "N/A"),
            "recommended_model": quiz.get("recommended_model", "N/A"),
            "overall_score": quiz.get("overall_score", "N/A"),
            "key_findings": quiz.get("analysis_result", {}).get("key_findings", []),
        }
    
    messages = [
        {"role": "system", "content": SYSTEM_PROMPTS["chat_response"]},
        {"role": "user", "content": f"""
            User's question: {message}
            
            Context about their product and free model strategy:
            {json.dumps(context_summary, indent=2)}
            
            Provide a helpful, specific, and actionable response that directly addresses their question.
            If you don't have enough context to give a specific answer, ask for the necessary information.
        """}
    ]
    
    response = call_openai_api(messages, max_tokens=1000)
    return response

# Main analysis function
async def analyze_quiz_submission(submission: Dict[str, Any]) -> Dict[str, Any]:
    """Analyze a complete quiz submission and return comprehensive results."""
    # Extract context information
    context = {
        "product_description": submission.get("context", {}).get("product_description", ""),
        "target_audience": submission.get("context", {}).get("target_audience", ""),
        "business_goals": submission.get("context", {}).get("business_goals", ""),
    }
    
    # Extract DEEP inputs
    deep_inputs = submission.get("deep_inputs", {})
    desirable_inputs = deep_inputs.get("desirable", {})
    effective_inputs = deep_inputs.get("effective", {})
    efficient_inputs = deep_inputs.get("efficient", {})
    polished_inputs = deep_inputs.get("polished", {})
    
    # Analyze each dimension
    analyses = {}
    analyses["desirable"] = await analyze_desirable_dimension(desirable_inputs)
    analyses["effective"] = await analyze_effective_dimension(effective_inputs)
    analyses["efficient"] = await analyze_efficient_dimension(efficient_inputs)
    analyses["polished"] = await analyze_polished_dimension(polished_inputs)
    
    # Calculate overall score (weighted average)
    weights = {"desirable": 0.3, "effective": 0.3, "efficient": 0.2, "polished": 0.2}
    overall_score = sum(analyses[dim]["score"] * weights[dim] for dim in weights)
    
    # Generate key findings
    key_findings = await generate_key_findings(analyses, context)
    
    # Recommend free model type
    model_recommendation = await recommend_free_model_type(analyses, context)
    
    # Generate implementation plan
    implementation_plan = await generate_implementation_plan(analyses, context)
    
    # Generate comprehensive recommendations
    recommendations = await generate_recommendations(analyses, context)
    
    # Compile final result
    result = {
        "score": overall_score,
        "desirable": analyses["desirable"],
        "effective": analyses["effective"],
        "efficient": analyses["efficient"],
        "polished": analyses["polished"],
        "recommended_model": model_recommendation.get("model_type", ""),
        "model_explanation": model_recommendation.get("explanation", ""),
        "key_findings": key_findings,
        "implementation_plan": implementation_plan,
        "recommendations": recommendations
    }
    
    return result 