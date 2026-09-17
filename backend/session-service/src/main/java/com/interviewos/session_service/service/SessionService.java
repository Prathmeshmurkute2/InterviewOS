package com.interviewos.session_service.service;

import com.interviewos.session_service.dto.*;
import com.interviewos.session_service.model.InterviewSession;
import com.interviewos.session_service.model.JobDescription;
import com.interviewos.session_service.model.SessionQuestion;
import com.interviewos.session_service.repository.InterviewSessionRepository;
import com.interviewos.session_service.repository.JobDescriptionRepository;
import com.interviewos.session_service.repository.SessionQuestionRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class SessionService {

    private final JobDescriptionRepository jdRepository;
    private final InterviewSessionRepository sessionRepository;
    private final SessionQuestionRepository questionRepository;
    private final OrchestratorClient orchestratorClient;

    public SessionService(JobDescriptionRepository jdRepository,
                          InterviewSessionRepository sessionRepository,
                          SessionQuestionRepository questionRepository,
                          OrchestratorClient orchestratorClient) {
        this.jdRepository = jdRepository;
        this.sessionRepository = sessionRepository;
        this.questionRepository = questionRepository;
        this.orchestratorClient = orchestratorClient;
    }

    public JobDescription uploadJd(JdUploadRequest req) {
        JobDescription jd = new JobDescription();
        jd.setUserId(req.getUserIdAsUUID());
        jd.setTitle(req.getTitle());
        jd.setCompany(req.getCompany());
        jd.setRawText(req.getRawText());
        return jdRepository.save(jd);
    }

    public SessionQuestion startSession(String jdId, String userId) {
        JobDescription jd = jdRepository.findById(UUID.fromString(jdId))
                .orElseThrow(() -> new IllegalArgumentException("Job description not found: " + jdId));

        InterviewSession session = new InterviewSession();
        session.setUserId(UUID.fromString(userId));
        session.setJdId(jd.getId());
        session.setStatus("IN_PROGRESS");
        session.setQuestionCount(1);
        session = sessionRepository.save(session);

        OrchestratorQuestionResponse generated = orchestratorClient.generateQuestion(jd.getRawText());

        SessionQuestion question = new SessionQuestion();
        question.setSessionId(session.getId());
        question.setQuestionText(generated.getQuestion());
        question.setOrderIndex(1);
        return questionRepository.save(question);
    }

    public SessionQuestion submitAnswer(String questionId, String answerText) {
        SessionQuestion question = questionRepository.findById(UUID.fromString(questionId))
                .orElseThrow(() -> new IllegalArgumentException("Question not found: " + questionId));

        OrchestratorEvaluateResponse evaluation = orchestratorClient.evaluateAnswer(
                question.getQuestionText(), answerText);

        question.setUserAnswer(answerText);
        question.setEvaluatorScore(evaluation.getScore());
        question.setEvaluatorFeedback(evaluation.getFeedback());

        return questionRepository.save(question);
    }

    public SessionQuestion nextQuestion(String sessionId) {
        InterviewSession session = sessionRepository.findById(UUID.fromString(sessionId))
                .orElseThrow(() -> new IllegalArgumentException("Session not found: " + sessionId));

        if ("COMPLETED".equals(session.getStatus())) {
            throw new IllegalStateException("Session is already completed. Cannot add more questions.");
        }

        int currentCount = session.getQuestionCount() != null ? session.getQuestionCount() : 0;
        int total = session.getTotalQuestions() != null ? session.getTotalQuestions() : 5;

        if (currentCount >= total) {
            throw new IllegalStateException("Session already has all " + total + " questions. Complete it instead.");
        }

        JobDescription jd = jdRepository.findById(session.getJdId())
                .orElseThrow(() -> new IllegalArgumentException("Job description not found: " + session.getJdId()));

        OrchestratorQuestionResponse generated = orchestratorClient.generateQuestion(jd.getRawText());

        int nextOrder = currentCount + 1;
        session.setQuestionCount(nextOrder);
        sessionRepository.save(session);

        SessionQuestion question = new SessionQuestion();
        question.setSessionId(session.getId());
        question.setQuestionText(generated.getQuestion());
        question.setOrderIndex(nextOrder);
        return questionRepository.save(question);
    }

    public InterviewSession completeSession(String sessionId) {
        InterviewSession session = sessionRepository.findById(UUID.fromString(sessionId))
                .orElseThrow(() -> new IllegalArgumentException("Session not found: " + sessionId));

        if ("COMPLETED".equals(session.getStatus())) {
            throw new IllegalStateException("Session is already completed.");
        }

        List<SessionQuestion> questions = questionRepository.findBySessionIdOrderByOrderIndex(session.getId());

        double average = questions.stream()
                .filter(q -> q.getEvaluatorScore() != null)
                .mapToInt(SessionQuestion::getEvaluatorScore)
                .average()
                .orElse(0.0);

        session.setOverallScore(average);
        session.setStatus("COMPLETED");
        session.setEndedAt(java.time.Instant.now());
        return sessionRepository.save(session);
    }

    public String getHint(String questionId, String partialAnswer, int hintsGivenSoFar) {
        SessionQuestion question = questionRepository.findById(UUID.fromString(questionId))
                .orElseThrow(() -> new IllegalArgumentException("Question not found: " + questionId));
        return orchestratorClient.getHint(question.getQuestionText(), partialAnswer, hintsGivenSoFar);
    }

    public OrchestratorMatchResponse matchResumeToJd(String resumeText, String jdText) {
        return orchestratorClient.matchResumeToJd(resumeText, jdText);
    }

    public List<SessionSummaryResponse> listSessions(String userId) {
        List<InterviewSession> sessions = sessionRepository.findByUserId(UUID.fromString(userId));

        return sessions.stream()
                .sorted((a, b) -> b.getStartedAt().compareTo(a.getStartedAt())) // newest first
                .map(session -> {
                    JobDescription jd = jdRepository.findById(session.getJdId()).orElse(null);
                    return new SessionSummaryResponse(
                            session.getId(),
                            jd != null ? jd.getTitle() : "Unknown role",
                            jd != null ? jd.getCompany() : null,
                            session.getStatus(),
                            session.getOverallScore(),
                            session.getQuestionCount(),
                            session.getTotalQuestions(),
                            session.getStartedAt(),
                            session.getEndedAt()
                    );
                })
                .collect(java.util.stream.Collectors.toList());
    }
}