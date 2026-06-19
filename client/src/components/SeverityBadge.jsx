const SEVERITY_STYLES = {
  CRITICAL:      { bg: 'bg-red-500/20',    border: 'border-red-500/40',    text: 'text-red-400',    dot: 'bg-red-500' },
  HIGH:          { bg: 'bg-orange-500/20', border: 'border-orange-500/40', text: 'text-orange-400', dot: 'bg-orange-500' },
  MEDIUM:        { bg: 'bg-yellow-500/20', border: 'border-yellow-500/40', text: 'text-yellow-400', dot: 'bg-yellow-500' },
  LOW:           { bg: 'bg-green-500/20',  border: 'border-green-500/40',  text: 'text-green-400',  dot: 'bg-green-500' },
  INFORMATIONAL: { bg: 'bg-gray-500/20',   border: 'border-gray-500/40',   text: 'text-gray-400',   dot: 'bg-gray-500' },
};

export default function SeverityBadge({ severity, size = 'md' }) {
  const styles = SEVERITY_STYLES[severity] || SEVERITY_STYLES.INFORMATIONAL;
  const textSize = size === 'sm' ? 'text-xs' : 'text-sm';
  const padding = size === 'sm' ? 'px-2 py-0.5' : 'px-3 py-1';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border font-semibold tracking-wide ${textSize} ${padding} ${styles.bg} ${styles.border} ${styles.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${styles.dot}`}></span>
      {severity}
    </span>
  );
}
