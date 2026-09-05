
export default function RiskScoreBadge({ score }: { score: number }) {
  let color = 'bg-emerald-500';
  let text = 'Auto-approved';
  if (score > 0 && score <= 0.08) {
    color = 'bg-yellow-500';
    text = 'L1 Approval';
  } else if (score > 0.08) {
    color = 'bg-red-500';
    text = 'L1+L2 Approval';
  }
  return <div className={`px-3 py-1 rounded text-white ${color}`}>{text} ({ (score * 100).toFixed(1) }%)</div>;
}
  