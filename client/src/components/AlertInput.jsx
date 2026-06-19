import { useState, useRef } from 'react';
import { SAMPLE_ALERTS } from './sampleAlerts.js';

export default function AlertInput({ onAnalyze, loading }) {
  const [text, setText] = useState('');
  const [validationError, setValidationError] = useState('');
  const [showSamples, setShowSamples] = useState(false);
  const fileRef = useRef(null);

  const handleAnalyze = () => {
    if (!text.trim()) {
      setValidationError('Please paste an alert or select a sample before analyzing.');
      return;
    }
    setValidationError('');
    onAnalyze(text);
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setText(ev.target.result);
    reader.readAsText(file);
    e.target.value = '';
  };

  const loadSample = (sample) => {
    setText(sample.text);
    setShowSamples(false);
    setValidationError('');
  };

  return (
    <div className="bg-card rounded-xl border border-gray-800 overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
        <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Alert Input</h2>
        <div className="flex items-center gap-2">
          {/* Sample alerts dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowSamples((v) => !v)}
              className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-accent px-3 py-1.5 rounded-md border border-gray-700 hover:border-accent/50 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
              </svg>
              Sample Alerts
            </button>
            {showSamples && (
              <div className="absolute right-0 top-full mt-1 w-72 bg-[#1e2130] border border-gray-700 rounded-lg shadow-xl z-50 py-1 max-h-80 overflow-y-auto">
                {SAMPLE_ALERTS.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => loadSample(s)}
                    className="w-full text-left px-4 py-2.5 text-xs text-gray-300 hover:bg-accent/10 hover:text-accent transition-colors"
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* File upload */}
          <button
            onClick={() => fileRef.current?.click()}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-accent px-3 py-1.5 rounded-md border border-gray-700 hover:border-accent/50 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Upload
          </button>
          <input ref={fileRef} type="file" accept=".log,.txt,.json,.xml" className="hidden" onChange={handleFile} />

          {/* Clear */}
          {text && (
            <button
              onClick={() => { setText(''); setValidationError(''); }}
              className="text-xs text-gray-500 hover:text-gray-300 px-2 py-1.5 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Textarea */}
      <div className="relative">
        <textarea
          value={text}
          onChange={(e) => { setText(e.target.value); setValidationError(''); }}
          placeholder={`Paste your raw alert here — any format supported:
• Syslog / CEF / LEEF
• Windows Event Log XML
• JSON (EDR/SIEM export)
• Plain text alert description
• Or select a Sample Alert above`}
          className="w-full h-56 bg-transparent text-sm text-gray-200 placeholder-gray-600 p-4 resize-none outline-none font-mono leading-relaxed"
          spellCheck={false}
        />
        {text && (
          <span className="absolute bottom-2 right-3 text-xs text-gray-600 pointer-events-none">
            {text.length.toLocaleString()} chars
          </span>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-gray-800 bg-black/20">
        <div>
          {validationError && (
            <p className="text-xs text-red-400">{validationError}</p>
          )}
        </div>
        <button
          onClick={handleAnalyze}
          disabled={loading}
          className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
            loading
              ? 'bg-accent/30 text-accent/60 cursor-not-allowed'
              : 'bg-accent text-black hover:bg-cyan-300 active:scale-95'
          }`}
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-accent/40 border-t-accent rounded-full animate-spin"></span>
              Analyzing…
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Analyze Alert
            </>
          )}
        </button>
      </div>
    </div>
  );
}
