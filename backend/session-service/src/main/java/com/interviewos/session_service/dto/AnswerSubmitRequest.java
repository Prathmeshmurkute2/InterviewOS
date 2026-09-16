package com.interviewos.session_service.dto;

import jakarta.validation.constraints.NotBlank;

public class AnswerSubmitRequest {
    @NotBlank
    private String answer;

    public String getAnswer() { return answer; }
    public void setAnswer(String answer) { this.answer = answer; }
}
