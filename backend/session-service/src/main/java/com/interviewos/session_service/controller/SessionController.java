package com.interviewos.session_service.controller;

import com.interviewos.session_service.dto.JdUploadRequest;
import com.interviewos.session_service.model.InterviewSession;
import com.interviewos.session_service.model.JobDescription;
import com.interviewos.session_service.service.SessionService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<InterviewSession> startSession(@PathVariable String jdId,
                                                        @RequestParam String userId ){
        return ResponseEntity.ok(sessionService.startSession(jdId, userId));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleNotFound(IllegalArgumentException ex){
        return ResponseEntity.badRequest().body(ex.getMessage());
    }
}
