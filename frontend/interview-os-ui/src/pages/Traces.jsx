import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { orchestratorApi } from '../api/client';


const agentColor = {
  interviewer: 'bg-lamp/15 text-lamp',
  evaluator: 'bg-sage/15 text-sage',
  hint: 'bg-ink-text/10 text-ink-text/60',
  matcher: 'bg-clay/15 text-clay',
};

function formatTime(iso) {
  return new Date(iso).toLocaleString(undefined, {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit',
  });
}

export default function Traces() {
  const [traces, setTraces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    orchestratorApi.get('/traces', { params: { limit: 50 } })
      .then((res) => setTraces(res.data))
      .catch(() => setTraces([]))
      .finally(() => setLoading(false));
  }, []);

  const avgLatency = traces.length
    ? Math.round(traces.reduce((sum, t) => sum + t.latencyMs, 0) / traces.length)
    : 0;

  return (
    <div className="min-h-screen bg-ink px-6 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-baseline mb-2">
          <div>
            <p className="font-sans text-sm text-lamp tracking-wide mb-1">InterviewOS — Debug</p>
            <h1 className="font-serif text-2xl text-paper-text">Agent traces</h1>
          </div>
          <Link to="/dashboard" className="text-sm text-paper-text/40 hover:text-paper-text/70 transition-colors">
            Back to dashboard
          </Link>
        </div>
        <p className="text-paper-text/40 text-sm mb-8">
          {traces.length} calls logged · avg latency {avgLatency}ms
        </p>

        {loading ? (
          <p className="text-paper-text/40 text-sm">Loading…</p>
        ) : traces.length === 0 ? (
          <p className="text-paper-text/40 text-sm">No agent calls logged yet.</p>
        ) : (
          <div className="space-y-2">
            {traces.map((t) => (
              <div key={t.id} className="bg-paper rounded-sm overflow-hidden">
                <button
                  onClick={() => setExpanded(expanded === t.id ? null : t.id)}
                  className="w-full flex items-center justify-between px-4 py-3 text-left"
                >
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-2 py-1 rounded-sm font-medium ${agentColor[t.agentName] || 'bg-ink-text/10 text-ink-text/60'}`}>
                      {t.agentName}
                    </span>
                    <span className="text-ink-text/40 text-xs">{formatTime(t.createdAt)}</span>
                  </div>
                  <span className="text-ink-text/50 text-xs font-mono">{t.latencyMs}ms</span>
                </button>

                {expanded === t.id && (
                  <div className="border-t border-ink-text/10 px-4 py-3 space-y-3">
                    <div>
                      <p className="text-xs text-ink-text/50 mb-1">Input</p>
                      <pre className="text-xs text-ink-text/80 bg-ink-text/5 rounded-sm p-2 overflow-x-auto whitespace-pre-wrap">
                        {JSON.stringify(t.inputPayload, null, 2)}
                      </pre>
                    </div>
                    <div>
                      <p className="text-xs text-ink-text/50 mb-1">Output</p>
                      <pre className="text-xs text-ink-text/80 bg-ink-text/5 rounded-sm p-2 overflow-x-auto whitespace-pre-wrap">
                        {JSON.stringify(t.outputPayload, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
