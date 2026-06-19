import { useState } from 'react';
import SeverityBadge from './SeverityBadge.jsx';
import MitreTag from './MitreTag.jsx';

const ACTION_STYLES = {
  BLOCK:          'bg-red-500/20 text-red-400 border-red-500/40',
  INVESTIGATE:    'bg-orange-500/20 text-orange-400 border-orange-500/40',
  ESCALATE:       'bg-purple-500/20 text-purple-400 border-purple-500/40',
  MONITOR:        'bg-blue-500/20 text-blue-400 border-blue-500/40',
  FALSE_POSITIVE: 'bg-green-500/20 text-green-400 border-green-500/40',
};

const FP_STYLES = {
  HIGH:   'text-green-400',
  MEDIUM: 'text-yellow-400',
  LOW:    'text-red-400',
};

function CopyButton({ value, label = '' }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button
      onClick={copy}
      className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-accent transition-colors ml-1 shrink-0"
      title={`Copy ${label}`}
    >
      {copied ? (
        <svg className="w-3.5 h-3.5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      )}
    </button>
  );
}

function Section({ title, icon, children }) {
  return (
    <div className="bg-card rounded-xl border border-gray-800 overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-800">
        <span className="text-accent">{icon}</span>
        <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">{title}</h3>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

const IOC_TABS = ['ips', 'domains', 'hashes', 'usernames', 'processes'];

function IocSection({ iocs }) {
  const [activeTab, setActiveTab] = useState('ips');
  const items = iocs[activeTab] || [];
  const hasAny = IOC_TABS.some((t) => (iocs[t] || []).length > 0);

  return (
    <Section
      title="Indicators of Compromise"
      icon={
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      }
    >
      <div className="flex gap-1 mb-3 flex-wrap">
        {IOC_TABS.map((tab) => {
          const count = (iocs[tab] || []).length;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 text-xs rounded-md font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-accent/20 text-accent border border-accent/40'
                  : 'text-gray-500 hover:text-gray-300 border border-transparent'
              }`}
            >
              {tab.toUpperCase()} {count > 0 && <span className="ml-1 opacity-70">({count})</span>}
            </button>
          );
        })}
      </div>
      {items.length === 0 ? (
        <p className="text-sm text-gray-600 italic">{hasAny ? `No ${activeTab} found.` : 'No IOCs extracted.'}</p>
      ) : (
        <ul className="space-y-1.5">
          {items.map((item, i) => (
            <li key={i} className="flex items-center gap-2 group">
              <span className="flex-1 text-xs font-mono text-gray-300 bg-black/30 px-3 py-1.5 rounded break-all">{item}</span>
              <CopyButton value={item} label={activeTab} />
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
}

function ChecklistSection({ items }) {
  const [checked, setChecked] = useState({});
  const toggle = (i) => setChecked((prev) => ({ ...prev, [i]: !prev[i] }));
  const done = Object.values(checked).filter(Boolean).length;

  return (
    <Section
      title={`Investigation Checklist (${done}/${items.length})`}
      icon={
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      }
    >
      <ul className="space-y-2.5">
        {items.map((step, i) => (
          <li
            key={i}
            className="flex items-start gap-3 cursor-pointer group"
            onClick={() => toggle(i)}
          >
            <div className={`mt-0.5 w-4 h-4 shrink-0 rounded border flex items-center justify-center transition-colors ${
              checked[i]
                ? 'bg-accent border-accent'
                : 'border-gray-600 group-hover:border-accent/60'
            }`}>
              {checked[i] && (
                <svg className="w-2.5 h-2.5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <span className={`text-sm leading-relaxed transition-colors ${checked[i] ? 'line-through text-gray-600' : 'text-gray-300'}`}>
              {step}
            </span>
          </li>
        ))}
      </ul>
    </Section>
  );
}

function exportJSON(report) {
  const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `triage-${report.title?.replace(/\s+/g, '-').toLowerCase() || 'report'}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function copyMarkdown(report) {
  const md = `# SOC Triage Report: ${report.title}

**Severity:** ${report.severity} | **Confidence:** ${report.confidence}% | **Action:** ${report.recommended_action}

## Summary
${report.summary}

**Attack Category:** ${report.attack_category}
**False Positive Likelihood:** ${report.false_positive_likelihood}

## MITRE ATT&CK Techniques
${(report.mitre_techniques || []).map((t) => `- [${t.id} — ${t.name}](${t.url}) (${t.tactic})`).join('\n')}

## Indicators of Compromise
${Object.entries(report.iocs || {}).filter(([, v]) => v.length).map(([k, v]) => `### ${k.toUpperCase()}\n${v.map((i) => `- \`${i}\``).join('\n')}`).join('\n\n')}

## Investigation Checklist
${(report.investigation_checklist || []).map((s, i) => `- [ ] ${s}`).join('\n')}

## Analyst Notes
${report.analyst_notes}
`;
  navigator.clipboard.writeText(md);
}

export default function TriageReport({ report }) {
  const [mdCopied, setMdCopied] = useState(false);

  const handleCopyMd = () => {
    copyMarkdown(report);
    setMdCopied(true);
    setTimeout(() => setMdCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Header banner */}
      <div className="bg-card rounded-xl border border-gray-800 p-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="space-y-2 flex-1 min-w-0">
            <h2 className="text-xl font-bold text-white leading-tight">{report.title}</h2>
            <div className="flex items-center gap-2 flex-wrap">
              <SeverityBadge severity={report.severity} />
              <span className={`inline-flex items-center text-xs font-semibold px-3 py-1 rounded-full border ${ACTION_STYLES[report.recommended_action] || 'bg-gray-500/20 text-gray-400 border-gray-500/40'}`}>
                {report.recommended_action}
              </span>
              <span className="text-xs text-gray-500 font-medium">{report.attack_category}</span>
            </div>
          </div>

          {/* Confidence */}
          <div className="shrink-0 text-right">
            <p className="text-xs text-gray-500 mb-1">Confidence</p>
            <p className="text-2xl font-bold text-accent tabular-nums">{report.confidence}%</p>
            <div className="w-24 h-1.5 bg-gray-800 rounded-full mt-1">
              <div
                className="h-1.5 rounded-full bg-accent transition-all"
                style={{ width: `${report.confidence}%` }}
              />
            </div>
          </div>
        </div>

        {/* Summary */}
        <p className="mt-4 text-sm text-gray-300 leading-relaxed border-t border-gray-800 pt-4">
          {report.summary}
        </p>

        {/* FP likelihood + export */}
        <div className="mt-4 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-500">False Positive Likelihood:</span>
            <span className={`font-semibold ${FP_STYLES[report.false_positive_likelihood] || 'text-gray-400'}`}>
              {report.false_positive_likelihood}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyMd}
              className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-accent px-3 py-1.5 rounded-md border border-gray-700 hover:border-accent/50 transition-colors"
            >
              {mdCopied ? '✓ Copied' : 'Copy as Markdown'}
            </button>
            <button
              onClick={() => exportJSON(report)}
              className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-accent px-3 py-1.5 rounded-md border border-gray-700 hover:border-accent/50 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export JSON
            </button>
          </div>
        </div>
      </div>

      {/* MITRE ATT&CK */}
      {(report.mitre_techniques || []).length > 0 && (
        <Section
          title="MITRE ATT&CK"
          icon={
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
            </svg>
          }
        >
          <div className="flex flex-wrap gap-3">
            {report.mitre_techniques.map((t) => (
              <MitreTag key={t.id} technique={t} />
            ))}
          </div>
        </Section>
      )}

      {/* IOCs */}
      <IocSection iocs={report.iocs || {}} />

      {/* Checklist */}
      {(report.investigation_checklist || []).length > 0 && (
        <ChecklistSection items={report.investigation_checklist} />
      )}

      {/* Analyst Notes */}
      {report.analyst_notes && (
        <div className="bg-blue-900/10 border border-blue-700/30 rounded-xl p-4 flex gap-3">
          <svg className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-xs font-semibold text-blue-400 uppercase tracking-wide mb-1">Analyst Notes</p>
            <p className="text-sm text-gray-300 leading-relaxed">{report.analyst_notes}</p>
          </div>
        </div>
      )}
    </div>
  );
}
