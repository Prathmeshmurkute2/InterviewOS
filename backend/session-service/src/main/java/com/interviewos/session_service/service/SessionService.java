package com.interviewos.session_service.service;

import com.interviewos.session_service.dto.JdUploadRequest;
import com.interviewos.session_service.model.InterviewSession;
import com.interviewos.session_service.model.JobDescription;
import com.interviewos.session_service.repository.InterviewSessionRepository;
import com.interviewos.session_service.repository.JobDescriptionRepository;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Data
@AllArgsConstructor
@Service
public class SessionService {

    private final JobDescriptionRepository jdRepository;
    private final InterviewSessionRepository sessionRepository;

    public JobDescription uploadJd(JdUploadRequest req){
        JobDescription jd = new JobDescription();
        jd.setUserId(req.getUserIdAsUUID());
        jd.setTitle(req.getTitle());
        jd.setCompany(req.getCompany());
        jd.setRawText(req.getRawText());
        return jdRepository.save(jd);
    }

    public InterviewSession startSession(String jdId,String userId){
        JobDescription jd = jdRepository.findById(UUID.fromString(jdId))
                .orElseThrow(()->new IllegalArgumentException("Job description not found: " + jdId));

        InterviewSession session = new InterviewSession();
        session.setUserId(UUID.fromString(userId));
        session.setJdId(jd.getId());
        session.setStatus("CREATED");

        return sessionRepository.save(session);
    }
}
