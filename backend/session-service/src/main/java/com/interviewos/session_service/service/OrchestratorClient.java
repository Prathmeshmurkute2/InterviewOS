package com.interviewos.session_service.service;

import com.interviewos.session_service.dto.OrchestratorEvaluateResponse;
import com.interviewos.session_service.dto.OrchestratorQuestionResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.client.JdkClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.net.http.HttpClient;
import java.util.HashMap;
import java.util.Map;

@Service
public class OrchestratorClient {

    private final RestClient restClient;

    public OrchestratorClient(@Value("${orchestrator.base-url}") String baseUrl) {
        HttpClient httpClient = HttpClient.newBuilder()
                .version(HttpClient.Version.HTTP_1_1)
                .build();

        this.restClient = RestClient.builder()
                .baseUrl(baseUrl)
                .requestFactory(new JdkClientHttpRequestFactory(httpClient))
                .build();
    }

    public OrchestratorQuestionResponse generateQuestion(String jdText) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("jd_text", jdText);
        payload.put("difficulty", "medium");

        return restClient.post()
                .uri("/agents/interview/generate-question")
                .contentType(MediaType.APPLICATION_JSON)
                .body(payload)
                .retrieve()
                .body(OrchestratorQuestionResponse.class);
    }

    public OrchestratorEvaluateResponse evaluateAnswer(String question, String answer) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("question", question);
        payload.put("answer", answer);

        return restClient.post()
                .uri("/agents/interview/evaluate")
                .contentType(MediaType.APPLICATION_JSON)
                .body(payload)
                .retrieve()
                .body(OrchestratorEvaluateResponse.class);
    }
}