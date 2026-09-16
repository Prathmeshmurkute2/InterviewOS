package com.interviewos.session_service.dto;

public class OrchestratorQuestionResponse {
    private String question;
    private String topic;
    private String difficulty;

    public String getQuestion() { return question; }
    public void setQuestion(String question) { this.question = question; }
    public String getTopic() { return topic; }
    public void setTopic(String topic) { this.topic = topic; }
    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }
}