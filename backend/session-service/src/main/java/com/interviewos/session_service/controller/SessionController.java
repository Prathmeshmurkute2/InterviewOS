package com.interviewos.session_service.controller;

import com.interviewos.session_service.dto.*;
import com.interviewos.session_service.model.InterviewSession;
import com.interviewos.session_service.model.JobDescription;
import com.interviewos.session_service.model.SessionQuestion;
import com.interviewos.session_service.service.SessionService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@AllArgsConstructor
@RequestMapping("/api/sessions")
public class SessionController {

    private final SessionService sessionService;

    @PostMapping("/jd")
    public ResponseEntity<JobDescription> uploadJd(@Valid @RequestBody JdUploadRequest req){
        return ResponseEntity.ok(sessionService.uploadJd(req));
    }
    @PostMapping("/start/{jdId}")
    public ResponseEntity<SessionQuestion> startSession(@PathVariable String jdId, @RequestParam String userId) {
        return ResponseEntity.ok(sessionService.startSession(jdId, userId));
    }

    @PostMapping("/answer/{questionId}")
    public ResponseEntity<SessionQuestion> submitAnswer(@PathVariable String questionId,
                                                        @Valid @RequestBody AnswerSubmitRequest req) {
        return ResponseEntity.ok(sessionService.submitAnswer(questionId, req.getAnswer()));
    }

    @PostMapping("/{sessionId}/next")
    public ResponseEntity<SessionQuestion> nextQuestion(@PathVariable String sessionId) {
        return ResponseEntity.ok(sessionService.nextQuestion(sessionId));
    }

    @PostMapping("/{sessionId}/complete")
    public ResponseEntity<InterviewSession> completeSession(@PathVariable String sessionId) {
        return ResponseEntity.ok(sessionService.completeSession(sessionId));
    }

    @PostMapping("/hint/{questionId}")
    public ResponseEntity<Map<String, String>> getHint(@PathVariable String questionId,
                                                       @RequestBody HintSubmitRequest req) {
        String hint = sessionService.getHint(questionId, req.getPartialAnswer(), req.getHintsGivenSoFar());
        return ResponseEntity.ok(Map.of("hint", hint));
    }

    @PostMapping("/match")
    public ResponseEntity<OrchestratorMatchResponse> matchResumeToJd(@Valid @RequestBody MatchRequest req) {
        return ResponseEntity.ok(sessionService.matchResumeToJd(req.getResumeText(), req.getJdText()));
    }

    @GetMapping
    public ResponseEntity<List<SessionSummaryResponse>> listSessions(@RequestParam String userId) {
        return ResponseEntity.ok(sessionService.listSessions(userId));
    }

    @GetMapping("/{sessionId}/detail")
    public ResponseEntity<SessionDetailResponse> getSessionDetail(@PathVariable String sessionId) {
        return ResponseEntity.ok(sessionService.getSessionDetail(sessionId));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleNotFound(IllegalArgumentException ex){
        return ResponseEntity.badRequest().body(ex.getMessage());
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<String> handleConflict(IllegalStateException ex) {
        return ResponseEntity.status(409).body(ex.getMessage());
    }
}
