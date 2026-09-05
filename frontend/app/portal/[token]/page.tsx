"use client";

export default function Portal({ params }: { params: { token: string } }) {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans">
      <header className="bg-white border-b border-zinc-200 px-8 py-4 flex justify-between items-center shadow-sm">
        <h1 className="text-2xl font-bold text-blue-600 tracking-tight">DEV FLOW</h1>
        <p className="text-sm font-medium text-zinc-500">Quotation from Acme Corp</p>
      </header>

      <main className="max-w-4xl mx-auto py-12 px-4">
        <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-8">
          <h2 className="text-3xl font-bold mb-8 text-zinc-900">Your Quotation</h2>
          
          <table className="w-full mb-8">
            <thead>
              <tr className="border-b border-zinc-200 text-left text-sm text-zinc-500">
                <th className="pb-4 font-medium">Product</th>
                <th className="pb-4 font-medium text-center">Qty</th>
                <th className="pb-4 font-medium text-right">Price</th>
                <th className="pb-4 font-medium text-right">Counter Discount</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-zinc-100">
                <td className="py-4 font-medium">MacBook Pro M3</td>
                <td className="py-4 text-center">2</td>
                <td className="py-4 text-right">$3,998</td>
                <td className="py-4 text-right">
                  <input type="number" placeholder="%" className="w-20 border border-zinc-300 rounded px-2 py-1 text-right" />
                </td>
              </tr>
            </tbody>
          </table>

          <div className="flex justify-end gap-4 mt-8 pt-8 border-t border-zinc-200">
            <button className="px-6 py-3 border border-zinc-300 text-zinc-700 font-semibold rounded-lg hover:bg-zinc-50 transition-colors">
              Submit Request
            </button>
            <button className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
              Confirm Quotation
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}