import { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { sessionApi } from '../api/client';

export default function Interview() {
  const { sessionId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [current, setCurrent] = useState(location.state?.firstQuestion || null);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [hints, setHints] = useState([]);
  const [hintLoading, setHintLoading] = useState(false);

  const requestHint = async () => {
    setHintLoading(true);
    setError('');
    try {
      const res = await sessionApi.post(`/sessions/hint/${current.id}`, {
        partialAnswer: answer,
        hintsGivenSoFar: hints.length,
      });
      setHints((prev) => [...prev, res.data.hint]);
    } catch (err) {
      setError(err.response?.data || 'Could not get a hint.');
    } finally {
      setHintLoading(false);
    }
  };

  const submitAnswer = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await sessionApi.post(`/sessions/answer/${current.id}`, { answer });
      setFeedback(res.data);
    } catch (err) {
      setError(err.response?.data || 'Could not submit your answer.');
    } finally {
      setLoading(false);
    }
  };

  const nextQuestion = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await sessionApi.post(`/sessions/${sessionId}/next`);
      setCurrent(res.data);
      setAnswer('');
      setFeedback(null);
      setHints([]);
    } catch (err) {
      setError(err.response?.data || 'Could not load the next question.');
    } finally {
      setLoading(false);
    }
  };

  const completeSession = async () => {
    setLoading(true);
    try {
      const res = await sessionApi.post(`/sessions/${sessionId}/complete`);
      navigate(`/session/${sessionId}/summary`);
    } catch (err) {
      setError(err.response?.data || 'Could not complete the session.');
    } finally {
      setLoading(false);
    }
  };

  if (!current) return <div className="min-h-screen bg-ink text-paper-text p-8">No question loaded.</div>;

  const scoreColor = feedback
    ? feedback.evaluatorScore >= 7 ? 'text-sage' : feedback.evaluatorScore >= 4 ? 'text-lamp' : 'text-clay'
    : '';

  return (
    <div className="min-h-screen bg-ink px-6 py-12">
      <div className="max-w-xl mx-auto">
        <p className="font-sans text-xs text-lamp tracking-wide mb-6">
          Question {current.orderIndex}
        </p>

        <div className="bg-paper rounded-sm p-8 shadow-[0_1px_0_rgba(0,0,0,0.15)]">
          <h2 className="font-serif text-xl text-ink-text leading-snug mb-6">
            {current.questionText}
          </h2>

          {hints.length > 0 && !feedback && (
            <div className="mb-4 space-y-2">
              {hints.map((h, i) => (
                <p key={i} className="text-sm text-ink-text/70 bg-lamp/10 border-l-2 border-lamp rounded-sm px-3 py-2">
                  {h}
                </p>
              ))}
            </div>
          )}

          {!feedback ? (
            <>
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                rows={7}
                placeholder="Write your answer here…"
                className="w-full bg-transparent border border-ink-text/15 rounded-sm p-3 text-sm text-ink-text focus:outline-none focus:border-lamp resize-none"
              />
              {error && <p className="text-clay text-sm mt-3">{String(error)}</p>}
              <div className="flex gap-3 mt-4">
                <button
                  onClick={submitAnswer} disabled={loading || !answer.trim()}
                  className="bg-ink text-paper-text rounded-sm px-5 py-2.5 text-sm font-medium hover:bg-lamp hover:text-ink transition-colors disabled:opacity-40"
                >
                  {loading ? 'Evaluating…' : 'Submit answer'}
                </button>
                <button
                  onClick={requestHint} disabled={hintLoading}
                  className="border border-ink-text/25 text-ink-text rounded-sm px-5 py-2.5 text-sm font-medium hover:border-ink-text/50 transition-colors disabled:opacity-40"
                >
                  {hintLoading ? 'Thinking…' : hints.length === 0 ? 'Get a hint' : 'Another hint'}
                </button>
              </div>
            </>
          ) : (
            <div className="border-t border-ink-text/10 pt-5">
              <div className="flex items-baseline gap-2 mb-3">
                <span className={`font-serif text-4xl ${scoreColor}`}>{feedback.evaluatorScore}</span>
                <span className="text-ink-text/40 text-sm">/ 10</span>
              </div>
              <p className="text-ink-text/80 text-sm leading-relaxed">{feedback.evaluatorFeedback}</p>

              {error && <p className="text-clay text-sm mt-3">{String(error)}</p>}

              <div className="flex gap-3 mt-6">
                <button
                  onClick={nextQuestion} disabled={loading}
                  className="bg-ink text-paper-text rounded-sm px-5 py-2.5 text-sm font-medium hover:bg-lamp hover:text-ink transition-colors disabled:opacity-40"
                >
                  Next question
                </button>
                <button
                  onClick={completeSession} disabled={loading}
                  className="border border-ink-text/25 text-ink-text rounded-sm px-5 py-2.5 text-sm font-medium hover:border-ink-text/50 transition-colors disabled:opacity-40"
                >
                  Finish session
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
