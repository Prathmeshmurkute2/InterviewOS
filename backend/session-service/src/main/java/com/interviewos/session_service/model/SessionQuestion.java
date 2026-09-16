package com.interviewos.session_service.model;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "session_questions")
public class SessionQuestion {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(nullable = false)
    private UUID sessionId;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String questionText;

    private Integer orderIndex;

    @Column(columnDefinition = "TEXT")
    private String userAnswer;

    private Integer evaluatorScore;

    @Column(columnDefinition = "TEXT")
    private String evaluatorFeedback;

    @Column(nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    public SessionQuestion() {}

    public UUID getId() { return id; }
    public UUID getSessionId() { return sessionId; }
    public void setSessionId(UUID sessionId) { this.sessionId = sessionId; }
    public String getQuestionText() { return questionText; }
    public void setQuestionText(String questionText) { this.questionText = questionText; }
    public Integer getOrderIndex() { return orderIndex; }
    public void setOrderIndex(Integer orderIndex) { this.orderIndex = orderIndex; }
    public String getUserAnswer() { return userAnswer; }
    public void setUserAnswer(String userAnswer) { this.userAnswer = userAnswer; }
    public Integer getEvaluatorScore() { return evaluatorScore; }
    public void setEvaluatorScore(Integer evaluatorScore) { this.evaluatorScore = evaluatorScore; }
    public String getEvaluatorFeedback() { return evaluatorFeedback; }
    public void setEvaluatorFeedback(String evaluatorFeedback) { this.evaluatorFeedback = evaluatorFeedback; }
    public Instant getCreatedAt() { return createdAt; }
}