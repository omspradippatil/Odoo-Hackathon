export default function DealDashboard() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 p-8">
      <h1 className="text-3xl font-bold mb-8">Deal Health</h1>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-lg">
          <p className="text-zinc-400 mb-2">Total Active</p>
          <p className="text-3xl font-bold">124</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-lg">
          <p className="text-zinc-400 mb-2">Pending Approval</p>
          <p className="text-3xl font-bold text-yellow-500">12</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-lg">
          <p className="text-zinc-400 mb-2">Stalled</p>
          <p className="text-3xl font-bold text-red-500">8</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-lg">
          <p className="text-zinc-400 mb-2">Pipeline Revenue</p>
          <p className="text-3xl font-bold text-emerald-500">$2.4M</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-bold mb-4 text-red-500 flex items-center gap-2">
            <span className="bg-red-500/20 p-1 rounded">⚠️</span> Anomaly Alerts
          </h2>
          <div className="bg-red-950/30 border border-red-900/50 p-4 rounded-lg mb-4 cursor-pointer hover:bg-red-950/50 transition">
            <h3 className="font-bold text-red-400">High Risk Margin Drop</h3>
            <p className="text-zinc-400 text-sm mt-1">Deal #4822 margin dropped below 15% after recent line item edit.</p>
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-bold mb-4 text-yellow-500 flex items-center gap-2">
            <span className="bg-yellow-500/20 p-1 rounded">⏱️</span> Stalled Deals
          </h2>
          <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-lg mb-4 cursor-pointer hover:bg-zinc-800 transition">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold">TechCorp Server Refresh</h3>
              <span className="text-xs bg-zinc-800 px-2 py-1 rounded text-zinc-400">14 days inactive</span>
            </div>
            <p className="text-zinc-500 text-sm">Last action: Sent to customer</p>
          </div>
        </div>
      </div>
    </div>
  );
}