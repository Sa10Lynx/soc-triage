export default function MitreTag({ technique }) {
  return (
    <a
      href={technique.url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex flex-col gap-0.5 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-2 hover:bg-cyan-500/20 hover:border-cyan-500/60 transition-colors cursor-pointer group"
      title={`MITRE ATT&CK: ${technique.name} (${technique.tactic})`}
    >
      <span className="text-xs font-mono font-bold text-accent group-hover:underline">{technique.id}</span>
      <span className="text-xs text-white font-medium leading-tight">{technique.name}</span>
      <span className="text-xs text-gray-500">{technique.tactic}</span>
    </a>
  );
}
