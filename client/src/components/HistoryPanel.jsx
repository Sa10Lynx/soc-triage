import SeverityBadge from './SeverityBadge.jsx';

function formatTime(iso) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function HistoryPanel({ history, onLoad, onClear }) {
  return (
    <aside className="w-64 shrink-0 border-r border-gray-800 flex flex-col overflow-hidden hidden lg:flex">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">History</h2>
        {history.length > 0 && (
          <button
            onClick={onClear}
            className="text-xs text-gray-600 hover:text-red-400 transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        {history.length === 0 ? (
          <div className="p-4 text-center">
            <p className="text-xs text-gray-600 leading-relaxed">No analyses yet. Paste an alert and click Analyze.</p>
          </div>
        ) : (
          <ul className="py-1">
            {history.map((entry) => (
              <li key={entry.id}>
                <button
                  onClick={() => onLoad(entry)}
                  className="w-full text-left px-4 py-3 hover:bg-white/5 transition-colors border-b border-gray-800/50 group"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <SeverityBadge severity={entry.severity} size="sm" />
                  </div>
                  <p className="text-xs text-gray-300 group-hover:text-white font-medium leading-snug line-clamp-2 transition-colors">
                    {entry.title}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">{formatTime(entry.timestamp)}</p>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
}
