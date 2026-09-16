package com.interviewos.session_service.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Data
@Entity
@Table(name = "interview_sessions")
@NoArgsConstructor
@AllArgsConstructor
public class InterviewSession {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(nullable =false)
    private UUID userId;

    @Column(nullable = false)
    private UUID jdId;

    @Column(nullable = false)
    private String status ="CREATED";

    private Double overallScore;
    private Integer totalQuestions = 5;
    private Integer questionCount = 0;

    @Column(nullable = false, updatable = false)
    private Instant startedAt = Instant.now();

    private Instant endedAt;
}
