
export default function TrustBadge({ tier }: { tier: 'gold' | 'silver' | 'bronze' }) {
  const colors = { gold: 'bg-amber-400 text-black', silver: 'bg-zinc-300 text-black', bronze: 'bg-orange-700 text-white' };
  const labels = { gold: 'GOLD VENDOR', silver: 'SILVER VENDOR', bronze: 'BRONZE VENDOR' };
  return <span className={`px-2 py-1 text-xs font-bold rounded ${colors[tier]}`}>{labels[tier]}</span>;
}
  