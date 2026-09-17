package com.interviewos.session_service.dto;

import java.time.Instant;
import java.util.UUID;

public class SessionSummaryResponse {
    private UUID id;
    private String jdTitle;
    private String company;
    private String status;
    private Double overallScore;
    private Integer questionCount;
    private Integer totalQuestions;
    private Instant startedAt;
    private Instant endedAt;

    public SessionSummaryResponse(UUID id, String jdTitle, String company, String status,
                                  Double overallScore, Integer questionCount, Integer totalQuestions,
                                  Instant startedAt, Instant endedAt) {
        this.id = id;
        this.jdTitle = jdTitle;
        this.company = company;
        this.status = status;
        this.overallScore = overallScore;
        this.questionCount = questionCount;
        this.totalQuestions = totalQuestions;
        this.startedAt = startedAt;
        this.endedAt = endedAt;
    }

    public UUID getId() { return id; }
    public String getJdTitle() { return jdTitle; }
    public String getCompany() { return company; }
    public String getStatus() { return status; }
    public Double getOverallScore() { return overallScore; }
    public Integer getQuestionCount() { return questionCount; }
    public Integer getTotalQuestions() { return totalQuestions; }
    public Instant getStartedAt() { return startedAt; }
    public Instant getEndedAt() { return endedAt; }
}