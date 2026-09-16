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

  const submitAnswer = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await sessionApi.post(`/sessions/answer/${current.id}`, { answer });
      setFeedback(res.data);
    } catch (err) {
      setError(err.response?.data || 'Could not submit answer');
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
    } catch (err) {
      setError(err.response?.data || 'Could not get next question');
    } finally {
      setLoading(false);
    }
  };

  const completeSession = async () => {
    setLoading(true);
    try {
      const res = await sessionApi.post(`/sessions/${sessionId}/complete`);
      navigate('/dashboard', { state: { completedScore: res.data.overallScore } });
    } catch (err) {
      setError(err.response?.data || 'Could not complete session');
    } finally {
      setLoading(false);
    }
  };

  if (!current) return <div className="p-8">No question loaded. Go back to dashboard.</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <p className="text-xs text-slate-400 mb-2">Question {current.orderIndex}</p>
          <p className="text-slate-800 font-medium">{current.questionText}</p>
        </div>

        {!feedback ? (
          <div className="bg-white p-6 rounded-xl shadow-sm space-y-3">
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              rows={6}
              placeholder="Type your answer..."
              className="w-full border rounded-lg px-3 py-2 text-sm"
            />
            {error && <p className="text-red-500 text-sm">{String(error)}</p>}
            <button
              onClick={submitAnswer} disabled={loading || !answer.trim()}
              className="bg-slate-900 text-white rounded-lg px-4 py-2 text-sm font-medium disabled:opacity-50"
            >
              {loading ? 'Evaluating...' : 'Submit Answer'}
            </button>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-xl shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-slate-900">{feedback.evaluatorScore}/10</span>
            </div>
            <p className="text-slate-600 text-sm">{feedback.evaluatorFeedback}</p>

            {error && <p className="text-red-500 text-sm">{String(error)}</p>}

            <div className="flex gap-3 pt-2">
              <button
                onClick={nextQuestion} disabled={loading}
                className="bg-slate-900 text-white rounded-lg px-4 py-2 text-sm font-medium disabled:opacity-50"
              >
                Next Question
              </button>
              <button
                onClick={completeSession} disabled={loading}
                className="border border-slate-300 text-slate-700 rounded-lg px-4 py-2 text-sm font-medium disabled:opacity-50"
              >
                Finish Session
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}