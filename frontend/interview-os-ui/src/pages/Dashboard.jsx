import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sessionApi } from '../api/client';
import { useAuthStore } from '../store/authStore';

export default function Dashboard() {
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [rawText, setRawText] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { userId, name, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleStart = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const jdRes = await sessionApi.post('/sessions/jd', { userId, title, company, rawText });
      const jdId = jdRes.data.id;

      const startRes = await sessionApi.post(`/sessions/start/${jdId}`, null, { params: { userId } });
      navigate(`/interview/${startRes.data.sessionId}`, { state: { firstQuestion: startRes.data } });
    } catch (err) {
      setError(err.response?.data || 'Could not start session');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-xl font-bold text-slate-800">Welcome, {name}</h1>
          <button onClick={logout} className="text-sm text-slate-500 underline">Log out</button>
        </div>

        <form onSubmit={handleStart} className="bg-white p-6 rounded-xl shadow-sm space-y-4">
          <h2 className="font-semibold text-slate-700">Start a new mock interview</h2>

          <input
            type="text" placeholder="Job title (e.g. Backend Engineer)" value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm"
            required
          />
          <input
            type="text" placeholder="Company (optional)" value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm"
          />
          <textarea
            placeholder="Paste the job description here..." value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            rows={8}
            className="w-full border rounded-lg px-3 py-2 text-sm"
            required
          />

          {error && <p className="text-red-500 text-sm">{String(error)}</p>}

          <button
            type="submit" disabled={loading}
            className="bg-slate-900 text-white rounded-lg px-4 py-2 text-sm font-medium disabled:opacity-50"
          >
            {loading ? 'Starting...' : 'Start Interview'}
          </button>
        </form>
      </div>
    </div>
  );
}