package com.interviewos.session_service.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name ="job_description")
public class JobDescription {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(nullable = false)
    private UUID userId;

    private String title;
    private String company;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String rawText;

    @Column(nullable = false, updatable = false)
    private Instant createdAt= Instant.now();


}
