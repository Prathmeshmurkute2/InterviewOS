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

  const [resumeText, setResumeText] = useState('');
  const [matchResult, setMatchResult] = useState(null);
  const [matchLoading, setMatchLoading] = useState(false);
  const [matchError, setMatchError] = useState('');

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
      setError(err.response?.data || 'Could not start the session.');
    } finally {
      setLoading(false);
    }
  };

  const checkFit = async () => {
    setMatchError('');
    setMatchLoading(true);
    setMatchResult(null);
    try {
      const res = await sessionApi.post('/sessions/match', { resumeText, jdText: rawText });
      setMatchResult(res.data);
    } catch (err) {
      setMatchError(err.response?.data || 'Could not check fit.');
    } finally {
      setMatchLoading(false);
    }
  };

  const fitColor = matchResult
    ? matchResult.matchScore >= 70 ? 'text-sage' : matchResult.matchScore >= 40 ? 'text-lamp' : 'text-clay'
    : '';

  return (
    <div className="min-h-screen bg-ink px-6 py-12">
      <div className="max-w-xl mx-auto">
        <div className="flex justify-between items-baseline mb-10">
          <div>
            <p className="font-sans text-sm text-lamp tracking-wide mb-1">InterviewOS</p>
            <h1 className="font-serif text-2xl text-paper-text">Welcome back, {name}</h1>
          </div>
          <button onClick={logout} className="text-sm text-paper-text/40 hover:text-paper-text/70 transition-colors">
            Log out
          </button>
        </div>

        <div className="bg-paper rounded-sm p-8 shadow-[0_1px_0_rgba(0,0,0,0.15)] mb-6">
          <h2 className="font-serif text-lg text-ink-text mb-1">New rehearsal</h2>
          <p className="text-ink-text/50 text-sm mb-6">
            Paste a job description and we'll build questions around it.
          </p>

          <form onSubmit={handleStart} className="space-y-4">
            <div>
              <label className="block text-xs text-ink-text/60 mb-1">Role</label>
              <input
                type="text" placeholder="Backend Engineer" value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-transparent border-b border-ink-text/20 pb-2 text-ink-text text-sm focus:outline-none focus:border-lamp"
                required
              />
            </div>
            <div>
              <label className="block text-xs text-ink-text/60 mb-1">Company (optional)</label>
              <input
                type="text" value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full bg-transparent border-b border-ink-text/20 pb-2 text-ink-text text-sm focus:outline-none focus:border-lamp"
              />
            </div>
            <div>
              <label className="block text-xs text-ink-text/60 mb-1">Job description</label>
              <textarea
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                rows={8}
                placeholder="Paste the full listing here…"
                className="w-full bg-transparent border border-ink-text/15 rounded-sm p-3 text-sm text-ink-text focus:outline-none focus:border-lamp resize-none"
                required
              />
            </div>

            {error && <p className="text-clay text-sm">{String(error)}</p>}

            <button
              type="submit" disabled={loading}
              className="bg-ink text-paper-text rounded-sm px-5 py-2.5 text-sm font-medium hover:bg-lamp hover:text-ink transition-colors disabled:opacity-40"
            >
              {loading ? 'Preparing questions…' : 'Start rehearsal'}
            </button>
          </form>
        </div>

        <div className="bg-paper rounded-sm p-8 shadow-[0_1px_0_rgba(0,0,0,0.15)]">
          <h2 className="font-serif text-lg text-ink-text mb-1">Check your fit</h2>
          <p className="text-ink-text/50 text-sm mb-6">
            Paste your resume to see how it holds up against the job description above.
          </p>

          <textarea
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            rows={5}
            placeholder="Paste your resume text here…"
            className="w-full bg-transparent border border-ink-text/15 rounded-sm p-3 text-sm text-ink-text focus:outline-none focus:border-lamp resize-none"
          />

          {matchError && <p className="text-clay text-sm mt-3">{String(matchError)}</p>}

          <button
            onClick={checkFit}
            disabled={matchLoading || !resumeText.trim() || !rawText.trim()}
            className="mt-4 border border-ink-text/25 text-ink-text rounded-sm px-5 py-2.5 text-sm font-medium hover:border-ink-text/50 transition-colors disabled:opacity-40"
          >
            {matchLoading ? 'Comparing…' : 'Check fit'}
          </button>
          {!rawText.trim() && (
            <p className="text-xs text-ink-text/40 mt-2">Paste a job description above first.</p>
          )}

          {matchResult && (
            <div className="border-t border-ink-text/10 mt-6 pt-5">
              <div className="flex items-baseline gap-2 mb-3">
                <span className={`font-serif text-4xl ${fitColor}`}>{matchResult.matchScore}</span>
                <span className="text-ink-text/40 text-sm">/ 100 match</span>
              </div>
              <p className="text-ink-text/80 text-sm leading-relaxed mb-4">{matchResult.summary}</p>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-sage mb-1">You have</p>
                  <ul className="text-sm text-ink-text/70 space-y-1">
                    {matchResult.matchingSkills?.map((s, i) => <li key={i}>{s}</li>)}
                  </ul>
                </div>
                <div>
                  <p className="text-xs text-clay mb-1">Missing</p>
                  <ul className="text-sm text-ink-text/70 space-y-1">
                    {matchResult.missingSkills?.map((s, i) => <li key={i}>{s}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
