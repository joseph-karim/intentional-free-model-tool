def calculate_desirable_score(answers):
    """Calculate how desirable the free model is based on quiz answers."""
    score = 5  # Start with a neutral score
    
    # Get relevant answers
    current_model = next((a['answer'] for a in answers if a['question_id'] == 'current_free_model'), None)
    free_features = next((a['answer'] for a in answers if a['question_id'] == 'free_features'), '')
    time_to_value = next((a['answer'] for a in answers if a['question_id'] == 'time_to_value'), None)
    
    # If there's no free model at all, score is very low
    if current_model == "None (No free offering)":
        score -= 3
    
    # Higher score for faster time to value
    time_to_value_scores = {
        "Immediately (under 5 minutes)": 2,
        "Quick (5-30 minutes)": 1.5,
        "Moderate (30 minutes - 2 hours)": 0,
        "Slow (several hours)": -1,
        "Very slow (days or weeks)": -2
    }
    if time_to_value in time_to_value_scores:
        score += time_to_value_scores[time_to_value]
    
    # Check for feature richness in the free model
    if free_features:
        # Count commas as a proxy for number of features
        feature_count = len(free_features.split(','))
        if feature_count > 5:
            score += 1
        if feature_count > 10:
            score += 0.5
    
    # Cap the score between 1 and 10
    return max(1, min(10, score))

def calculate_effective_score(answers):
    """Calculate how effective the free model is at solving user problems."""
    score = 5  # Start with a neutral score
    
    # Get relevant answers
    beginner_challenges = next((a['answer'] for a in answers if a['question_id'] == 'beginner_challenges'), '')
    free_features = next((a['answer'] for a in answers if a['question_id'] == 'free_features'), '')
    free_limitations = next((a['answer'] for a in answers if a['question_id'] == 'free_limitations'), '')
    conversion_rate = next((a['answer'] for a in answers if a['question_id'] == 'conversion_rate'), None)
    
    # Higher conversion rates suggest the free model is effective at demonstrating value
    conversion_rate_scores = {
        "Less than 1%": -1,
        "1-3%": 0,
        "3-5%": 1,
        "5-10%": 2,
        "More than 10%": 3,
        "I don't know/Not applicable": 0
    }
    if conversion_rate in conversion_rate_scores:
        score += conversion_rate_scores[conversion_rate]
    
    # Check if the free features address the beginner challenges
    if beginner_challenges and free_features:
        # This is a simplistic check - in a real implementation, you'd want
        # to use NLP to determine alignment between challenges and features
        challenge_words = set(beginner_challenges.lower().split())
        feature_words = set(free_features.lower().split())
        overlap = challenge_words.intersection(feature_words)
        
        if len(overlap) > 3:
            score += 1.5
        elif len(overlap) > 0:
            score += 0.5
    
    # Excessive limitations can reduce effectiveness
    if free_limitations:
        limitation_count = len(free_limitations.split(','))
        if limitation_count > 5:
            score -= 1
    
    # Cap the score between 1 and 10
    return max(1, min(10, score))

def calculate_efficient_score(answers):
    """Calculate how efficient the free model is at delivering value."""
    score = 5  # Start with a neutral score
    
    # Get relevant answers
    time_to_value = next((a['answer'] for a in answers if a['question_id'] == 'time_to_value'), None)
    current_model = next((a['answer'] for a in answers if a['question_id'] == 'current_free_model'), None)
    
    # Time to value directly impacts efficiency
    time_to_value_scores = {
        "Immediately (under 5 minutes)": 3,
        "Quick (5-30 minutes)": 2,
        "Moderate (30 minutes - 2 hours)": 0,
        "Slow (several hours)": -1,
        "Very slow (days or weeks)": -2.5
    }
    if time_to_value in time_to_value_scores:
        score += time_to_value_scores[time_to_value]
    
    # Different models have different efficiency characteristics
    model_scores = {
        "Opt-In Free Trial": 0.5,  # Good for showing full product value quickly
        "Opt-Out Free Trial": -0.5,  # Added friction reduces efficiency
        "Usage-Based Free Trial": 1,  # Efficiently manages value delivery
        "Freemium": 1.5,  # Can be very efficient if well designed
        "None (No free offering)": -3  # No free model is inefficient for PLG
    }
    if current_model in model_scores:
        score += model_scores[current_model]
    
    # Cap the score between 1 and 10
    return max(1, min(10, score))

def calculate_polished_score(answers):
    """Calculate how polished and intentional the free model is."""
    score = 5  # Start with a neutral score
    
    # Get relevant answers
    intentional_rating = next((a['answer'] for a in answers if a['question_id'] == 'intentional_rating'), 5)
    key_metrics = next((a['answer'] for a in answers if a['question_id'] == 'key_metrics'), '')
    main_goals = next((a['answer'] for a in answers if a['question_id'] == 'main_goals'), [])
    
    # Self-assessment is a factor, but scaled down
    if isinstance(intentional_rating, (int, float)):
        score += (intentional_rating - 5) / 2  # Scale the impact
    
    # Tracking metrics suggests intentionality
    if key_metrics:
        metric_count = len(key_metrics.split(','))
        if metric_count > 3:
            score += 1.5
        elif metric_count > 0:
            score += 0.5
    
    # Having clear goals suggests a polished approach
    if isinstance(main_goals, list):
        if len(main_goals) >= 2:
            score += 1
    
    # Cap the score between 1 and 10
    return max(1, min(10, score))

def recommend_model(answers, scores):
    """Recommend the best free model based on analysis."""
    product_description = next((a['answer'] for a in answers if a['question_id'] == 'product_description'), '')
    time_to_value = next((a['answer'] for a in answers if a['question_id'] == 'time_to_value'), None)
    current_model = next((a['answer'] for a in answers if a['question_id'] == 'current_free_model'), None)
    
    # Default recommendation
    recommendation = "Opt-In Free Trial"
    
    # If time to value is slow, a freemium or usage-based model might be better
    if time_to_value in ["Slow (several hours)", "Very slow (days or weeks)"]:
        recommendation = "Freemium"
    elif time_to_value in ["Moderate (30 minutes - 2 hours)"]:
        recommendation = "Usage-Based Free Trial"
    
    # If the product naturally has usage tiers, usage-based is often best
    if product_description and any(word in product_description.lower() for word in ["storage", "credits", "volume", "usage", "limit"]):
        recommendation = "Usage-Based Free Trial"
    
    # If the scores indicate a need for better efficiency or desirability
    if scores["efficient"] < 4 or scores["desirable"] < 4:
        recommendation = "Freemium"
    
    # Keep the current model if it's working well (high scores)
    average_score = sum(scores.values()) / len(scores)
    if current_model and average_score > 7:
        recommendation = current_model
    
    return recommendation

def generate_desirable_analysis(answers, score):
    """Generate textual analysis for the Desirable dimension."""
    if score >= 8:
        return "Your free model offers highly desirable value to users, effectively showcasing your product's strengths."
    elif score >= 6:
        return "Your free model provides good value, but could be enhanced to better highlight your product's unique capabilities."
    elif score >= 4:
        return "Your free model offers moderate value but may not fully demonstrate what makes your product special."
    else:
        return "Your free model may need significant improvement to offer compelling value to users."

def generate_effective_analysis(answers, score):
    """Generate textual analysis for the Effective dimension."""
    if score >= 8:
        return "Your free model effectively solves key user challenges, helping them achieve meaningful outcomes."
    elif score >= 6:
        return "Your free model addresses some important user challenges but may miss certain critical needs."
    elif score >= 4:
        return "Your free model partially solves user challenges but falls short of delivering complete solutions."
    else:
        return "Your free model may need to be redesigned to better address the core problems your users face."

def generate_efficient_analysis(answers, score):
    """Generate textual analysis for the Efficient dimension."""
    if score >= 8:
        return "Users can quickly and easily experience value from your free model with minimal friction."
    elif score >= 6:
        return "Your free model delivers value relatively efficiently, though there may be some friction points."
    elif score >= 4:
        return "Users face moderate friction when trying to extract value from your free model."
    else:
        return "Your free model may have significant friction points that prevent users from experiencing value quickly."

def generate_polished_analysis(answers, score):
    """Generate textual analysis for the Polished dimension."""
    if score >= 8:
        return "Your free model appears highly intentional with clear goals, metrics, and a well-crafted user experience."
    elif score >= 6:
        return "Your free model shows good intentionality but could benefit from more strategic alignment and refinement."
    elif score >= 4:
        return "Your free model shows some intentionality but lacks a cohesive strategy and clear success metrics."
    else:
        return "Your free model appears to lack intentionality and may benefit from a more strategic, goal-oriented approach."

def generate_key_findings(answers, scores):
    """Generate key findings from the analysis."""
    findings = []
    
    # Get relevant answers
    current_model = next((a['answer'] for a in answers if a['question_id'] == 'current_free_model'), None)
    free_features = next((a['answer'] for a in answers if a['question_id'] == 'free_features'), '')
    time_to_value = next((a['answer'] for a in answers if a['question_id'] == 'time_to_value'), None)
    conversion_rate = next((a['answer'] for a in answers if a['question_id'] == 'conversion_rate'), None)
    
    # Low desirability finding
    if scores["desirable"] < 5:
        findings.append("Your free model may not offer enough value to attract and engage users effectively.")
    
    # Slow time to value finding
    if time_to_value in ["Slow (several hours)", "Very slow (days or weeks)"]:
        findings.append("Users take too long to experience value from your free model, risking abandonment.")
    
    # Low conversion rate finding
    if conversion_rate in ["Less than 1%", "1-3%"]:
        findings.append("Your free-to-paid conversion rate suggests the free model isn't effectively demonstrating premium value.")
    
    # Check model alignment
    if current_model == "Opt-Out Free Trial" and scores["efficient"] < 6:
        findings.append("Your opt-out free trial creates friction that may be deterring potential users from experiencing your product.")
    
    # Check for feature balance
    if free_features and len(free_features.split(',')) > 10 and scores["effective"] < 7:
        findings.append("Your free model may include too many features without focusing on solving core user challenges.")
    
    # Overall intentionality
    if scores["polished"] < 5:
        findings.append("Your free model lacks intentionality and could benefit from a more strategic approach.")
    
    # High performers
    if all(score >= 7 for score in scores.values()):
        findings.append("Your free model performs well across all dimensions, showing high intentionality and effectiveness.")
    
    # Ensure we have at least three findings
    if len(findings) < 3:
        if scores["efficient"] > scores["effective"] + 2:
            findings.append("Your free model delivers value efficiently but may not be solving the most important user challenges.")
        if scores["desirable"] > scores["polished"] + 2:
            findings.append("Your free model offers attractive value but lacks strategic cohesion and clear success metrics.")
    
    return findings[:5]  # Return top 5 findings

def analyze_quiz_results(answers):
    """Analyze quiz answers and generate a comprehensive report."""
    # Calculate scores for each dimension
    desirable_score = calculate_desirable_score(answers)
    effective_score = calculate_effective_score(answers)
    efficient_score = calculate_efficient_score(answers)
    polished_score = calculate_polished_score(answers)
    
    # Store scores in a dict for easy access
    scores = {
        "desirable": desirable_score,
        "effective": effective_score,
        "efficient": efficient_score,
        "polished": polished_score
    }
    
    # Generate analyses for each dimension
    desirable_analysis = generate_desirable_analysis(answers, desirable_score)
    effective_analysis = generate_effective_analysis(answers, effective_score)
    efficient_analysis = generate_efficient_analysis(answers, efficient_score)
    polished_analysis = generate_polished_analysis(answers, polished_score)
    
    # Generate key findings
    key_findings = generate_key_findings(answers, scores)
    
    # Recommend the best model
    recommended_model = recommend_model(answers, scores)
    
    # Compile the full analysis
    analysis = {
        "score": sum(scores.values()) / len(scores),
        "desirable": {
            "score": desirable_score,
            "analysis": desirable_analysis,
        },
        "effective": {
            "score": effective_score,
            "analysis": effective_analysis,
        },
        "efficient": {
            "score": efficient_score,
            "analysis": efficient_analysis,
        },
        "polished": {
            "score": polished_score,
            "analysis": polished_analysis,
        },
        "recommended_model": recommended_model,
        "key_findings": key_findings
    }
    
    return analysis 