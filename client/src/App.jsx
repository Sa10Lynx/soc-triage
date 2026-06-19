import { useState, useEffect } from 'react';
import AlertInput from './components/AlertInput.jsx';
import TriageReport from './components/TriageReport.jsx';
import HistoryPanel from './components/HistoryPanel.jsx';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const HISTORY_KEY = 'soc_triage_history';
const MAX_HISTORY = 10;

export default function App() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [rawError, setRawError] = useState(null);
  const [history, setHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }, [history]);

  const analyze = async (alertText) => {
    setLoading(true);
    setError(null);
    setRawError(null);
    setReport(null);

    try {
      const res = await fetch(`${API_URL}/api/triage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alertText }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 429) {
          setError('Rate limit reached. Please wait a moment before analyzing another alert.');
        } else if (res.status === 422) {
          setError('AI returned malformed JSON. Raw output shown below.');
          setRawError(data.raw || 'No raw output available.');
        } else {
          setError(data.error || 'An unexpected error occurred.');
        }
        return;
      }

      const newEntry = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        title: data.report.title,
        severity: data.report.severity,
        report: data.report,
      };

      setReport(data.report);
      setHistory((prev) => [newEntry, ...prev].slice(0, MAX_HISTORY));
    } catch (err) {
      setError('Network error — could not reach the server. Check that the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const loadFromHistory = (entry) => {
    setReport(entry.report);
    setError(null);
    setRawError(null);
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-accent/20 flex items-center justify-center">
            <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-semibold text-white tracking-tight">SOC Triage</h1>
            <p className="text-xs text-gray-500">AI-Powered Alert Analysis</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span>
          Powered by Claude
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* History Sidebar */}
        <HistoryPanel history={history} onLoad={loadFromHistory} onClear={clearHistory} />

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          <AlertInput onAnalyze={analyze} loading={loading} />

          {/* Error state */}
          {error && (
            <div className="bg-red-900/20 border border-red-700/40 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-red-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="flex-1">
                  <p className="text-red-300 font-medium text-sm">{error}</p>
                  {rawError && (
                    <pre className="mt-3 text-xs text-gray-400 bg-black/40 rounded p-3 overflow-x-auto whitespace-pre-wrap break-all">
                      {rawError}
                    </pre>
                  )}
                  <button
                    className="mt-3 text-xs text-accent hover:underline"
                    onClick={() => { setError(null); setRawError(null); }}
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Triage report */}
          {report && !loading && <TriageReport report={report} />}
        </main>
      </div>
    </div>
  );
}
