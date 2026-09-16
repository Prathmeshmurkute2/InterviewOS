package com.interviewos.session_service.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public class OrchestratorMatchResponse {
    @JsonProperty("match_score")
    private int matchScore;
    @JsonProperty("matching_skills")
    private List<String> matchingSkills;
    @JsonProperty("missing_skills")
    private List<String> missingSkills;
    private String summary;

    public int getMatchScore() { return matchScore; }
    public void setMatchScore(int matchScore) { this.matchScore = matchScore; }
    public List<String> getMatchingSkills() { return matchingSkills; }
    public void setMatchingSkills(List<String> matchingSkills) { this.matchingSkills = matchingSkills; }
    public List<String> getMissingSkills() { return missingSkills; }
    public void setMissingSkills(List<String> missingSkills) { this.missingSkills = missingSkills; }
    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }
}