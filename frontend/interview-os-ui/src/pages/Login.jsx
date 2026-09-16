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
      const res = await authApi.post('/auth/login', { email, password });
      login(res.data.token, res.data.id, res.data.name);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-sm w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold text-slate-800">InterviewOS</h1>
        <p className="text-slate-500 text-sm">Log in to continue</p>

        <input
          type="email" placeholder="Email" value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 text-sm"
          required
        />
        <input
          type="password" placeholder="Password" value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 text-sm"
          required
        />

        {error && <p className="text-red-500 text-sm">{String(error)}</p>}

        <button
          type="submit" disabled={loading}
          className="w-full bg-slate-900 text-white rounded-lg py-2 text-sm font-medium disabled:opacity-50"
        >
          {loading ? 'Logging in...' : 'Log In'}
        </button>

        <p className="text-sm text-slate-500 text-center">
          No account? <Link to="/signup" className="text-slate-900 underline">Sign up</Link>
        </p>
      </form>
    </div>
  );
}