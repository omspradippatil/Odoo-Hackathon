import Link from 'next/link';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-zinc-950 p-8 flex flex-col items-center justify-center text-zinc-50">
      <h1 className="text-4xl font-bold mb-12">Select Mode</h1>
      <div className="grid md:grid-cols-2 gap-8 w-full max-w-6xl">
        <Link href="/local">
          <div className="bg-blue-900/20 hover:bg-blue-900/40 border border-blue-500/50 p-12 rounded-2xl cursor-pointer transition-colors h-full">
            <h2 className="text-3xl font-bold text-blue-400 mb-4">LOCAL MODE</h2>
            <p className="text-xl text-blue-200/70">Buy & sell locally with trust escrow</p>
          </div>
        </Link>
        <Link href="/workspace">
          <div className="bg-purple-900/20 hover:bg-purple-900/40 border border-purple-500/50 p-12 rounded-2xl cursor-pointer transition-colors h-full">
            <h2 className="text-3xl font-bold text-purple-400 mb-4">PROFESSIONAL MODE</h2>
            <p className="text-xl text-purple-200/70">B2B procurement with anonymous bidding</p>
          </div>
        </Link>
      </div>
    </div>
  );
}