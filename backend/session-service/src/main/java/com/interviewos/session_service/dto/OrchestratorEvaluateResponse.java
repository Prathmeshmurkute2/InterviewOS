package com.interviewos.session_service.dto;

import java.util.List;

public class OrchestratorEvaluateResponse {
    private int score;
    private String feedback;
    private List<String> strengths;
    private List<String> improvements;

    public int getScore() { return score; }
    public void setScore(int score) { this.score = score; }
    public String getFeedback() { return feedback; }
    public void setFeedback(String feedback) { this.feedback = feedback; }
    public List<String> getStrengths() { return strengths; }
    public void setStrengths(List<String> strengths) { this.strengths = strengths; }
    public List<String> getImprovements() { return improvements; }
    public void setImprovements(List<String> improvements) { this.improvements = improvements; }
}
