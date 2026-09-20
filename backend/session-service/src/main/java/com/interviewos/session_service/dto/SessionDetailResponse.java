package com.interviewos.session_service.dto;

import com.interviewos.session_service.model.SessionQuestion;
import java.util.List;
import java.util.UUID;

public class SessionDetailResponse {
    private UUID id;
    private String jdTitle;
    private String company;
    private String status;
    private Double overallScore;
    private List<SessionQuestion> questions;

    public SessionDetailResponse(UUID id, String jdTitle, String company, String status,
                                 Double overallScore, List<SessionQuestion> questions) {
        this.id = id;
        this.jdTitle = jdTitle;
        this.company = company;
        this.status = status;
        this.overallScore = overallScore;
        this.questions = questions;
    }

    public UUID getId() { return id; }
    public String getJdTitle() { return jdTitle; }
    public String getCompany() { return company; }
    public String getStatus() { return status; }
    public Double getOverallScore() { return overallScore; }
    public List<SessionQuestion> getQuestions() { return questions; }
}