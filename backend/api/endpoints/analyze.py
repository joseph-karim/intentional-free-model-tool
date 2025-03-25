from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from typing import Dict, Any, Optional
from sqlalchemy.orm import Session
import uuid

# Use absolute imports within the package
from database import get_db
from schemas import AnalyzeRequest, AnalysisResponse, SharedAnalysisResponse
from services.analysis_service import analyze_form_data
from services.recommendation_service import generate_recommendations
from models import SharedAnalysis
from crud import create_shared_analysis, get_shared_analysis_by_id

router = APIRouter()

@router.post("", response_model=AnalysisResponse)
async def analyze_model(
    request: AnalyzeRequest, 
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """
    Process form data and generate analysis based on the DEEP framework.
    
    This endpoint accepts user inputs about their free model design and returns:
    - DEEP framework scores
    - Recommendations for improvement
    - Implementation suggestions
    """
    try:
        # Process analysis in the background for long-running tasks
        analysis_result = analyze_form_data(request.form_data)
        
        # Generate recommendations based on analysis
        recommendations = generate_recommendations(analysis_result)
        
        # Extract the form data
        form_data = request.form_data.dict() if hasattr(request.form_data, 'dict') else request.form_data
        
        return {
            "analysis": analysis_result,
            "recommendations": recommendations,
            "form_data": form_data,
            "success": True
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error analyzing model data: {str(e)}"
        )

@router.post("/share", response_model=SharedAnalysisResponse)
async def create_shared_analysis_link(
    request: AnalyzeRequest,
    db: Session = Depends(get_db)
):
    """
    Create a shareable link for a free model analysis.
    
    This endpoint:
    1. Analyzes the form data
    2. Stores the analysis with a unique ID
    3. Returns a shareable link
    """
    try:
        # Process analysis
        analysis_result = analyze_form_data(request.form_data)
        
        # Generate recommendations
        recommendations = generate_recommendations(analysis_result)
        
        # Generate unique ID for sharing
        share_id = str(uuid.uuid4())
        
        # Ensure the pricing strategy is part of the form data
        form_data = request.form_data
        pricing_strategy = None
        if form_data and hasattr(form_data, 'modelType') and form_data.modelType:
            model_type = form_data.modelType
            if hasattr(model_type, 'pricingStrategy'):
                pricing_strategy = model_type.pricingStrategy
        
        # Store in database
        create_shared_analysis(
            db=db,
            share_id=share_id,
            form_data=request.form_data.dict() if hasattr(request.form_data, 'dict') else request.form_data,
            analysis=analysis_result,
            recommendations=recommendations
        )
        
        return {
            "share_id": share_id,
            "success": True
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error creating shared analysis: {str(e)}"
        )

@router.get("/{share_id}", response_model=AnalysisResponse)
async def get_shared_analysis(
    share_id: str,
    db: Session = Depends(get_db)
):
    """
    Get a shared analysis by its ID.
    
    This endpoint retrieves a previously shared analysis 
    to allow viewing results without re-running the analysis.
    """
    try:
        shared_analysis = get_shared_analysis_by_id(db, share_id)
        
        if not shared_analysis:
            raise HTTPException(
                status_code=404,
                detail="Shared analysis not found"
            )
        
        # Ensure pricing strategy is included in the form data
        form_data = shared_analysis.form_data
        if shared_analysis.pricing_strategy and form_data and isinstance(form_data, dict):
            model_type = form_data.get('modelType', {})
            if isinstance(model_type, dict) and not model_type.get('pricingStrategy'):
                model_type['pricingStrategy'] = shared_analysis.pricing_strategy
                form_data['modelType'] = model_type
        
        return {
            "analysis": shared_analysis.analysis,
            "recommendations": shared_analysis.recommendations,
            "form_data": form_data,
            "success": True
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error retrieving shared analysis: {str(e)}"
        ) 