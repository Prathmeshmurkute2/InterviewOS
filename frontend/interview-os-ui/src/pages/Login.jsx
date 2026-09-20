import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../api/client';
import { useAuthStore } from '../store/authStore';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await authApi.post('/api/auth/login', { email, password });
      login(res.data.token, res.data.id, res.data.name);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data || 'Could not log in. Check your email and password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <p className="font-sans text-sm text-lamp tracking-wide mb-2">InterviewOS</p>
        <h1 className="font-serif text-3xl text-paper-text mb-8">
          Ready to rehearse?
        </h1>

        <form onSubmit={handleSubmit} className="bg-paper rounded-sm p-7 space-y-4 shadow-[0_1px_0_rgba(0,0,0,0.15)]">
          <div>
            <label className="block text-xs text-ink-text/60 mb-1">Email</label>
            <input
              type="email" value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent border-b border-ink-text/20 pb-2 text-ink-text text-sm focus:outline-none focus:border-lamp"
              required
            />
          </div>
          <div>
            <label className="block text-xs text-ink-text/60 mb-1">Password</label>
            <input
              type="password" value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent border-b border-ink-text/20 pb-2 text-ink-text text-sm focus:outline-none focus:border-lamp"
              required
            />
          </div>

          {error && <p className="text-clay text-sm">{String(error)}</p>}

          <button
            type="submit" disabled={loading}
            className="w-full bg-ink text-paper-text rounded-sm py-2.5 text-sm font-medium mt-2 hover:bg-lamp hover:text-ink transition-colors disabled:opacity-50"
          >
            {loading ? 'Logging in…' : 'Log in'}
          </button>
        </form>

        <p className="text-sm text-paper-text/50 mt-5">
          New here? <Link to="/signup" className="text-lamp hover:underline">Create an account</Link>
        </p>
      </div>
    </div>
  );
}
