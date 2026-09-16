package com.interviewos.session_service.repository;

import com.interviewos.session_service.model.SessionQuestion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface SessionQuestionRepository extends JpaRepository<SessionQuestion, UUID> {
    List<SessionQuestion> findBySessionIdOrderByOrderIndex(UUID sessionId);
}
