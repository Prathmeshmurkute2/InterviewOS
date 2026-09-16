package com.interviewos.session_service.dto;

import jakarta.validation.constraints.NotBlank;

public class MatchRequest {
    @NotBlank
    private String resumeText;
    @NotBlank
    private String jdText;

    public String getResumeText() { return resumeText; }
    public void setResumeText(String resumeText) { this.resumeText = resumeText; }
    public String getJdText() { return jdText; }
    public void setJdText(String jdText) { this.jdText = jdText; }
}