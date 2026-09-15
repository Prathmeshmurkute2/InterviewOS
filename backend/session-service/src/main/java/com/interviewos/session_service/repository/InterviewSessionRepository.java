package com.interviewos.session_service.repository;

import com.interviewos.session_service.model.InterviewSession;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface InterviewSessionRepository extends JpaRepository<InterviewSession, UUID> {
    List<InterviewSession> findByUserId(UUID userId);
}
