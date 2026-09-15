package com.interviewos.session_service.repository;

import com.interviewos.session_service.model.JobDescription;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface JobDescriptionRepository extends JpaRepository<JobDescription, UUID> {
}