package com.interviewos.session_service.dto;

public class HintSubmitRequest {
    private String partialAnswer;
    private int hintsGivenSoFar = 0;

    public String getPartialAnswer() { return partialAnswer; }
    public void setPartialAnswer(String partialAnswer) { this.partialAnswer = partialAnswer; }
    public int getHintsGivenSoFar() { return hintsGivenSoFar; }
    public void setHintsGivenSoFar(int hintsGivenSoFar) { this.hintsGivenSoFar = hintsGivenSoFar; }
}