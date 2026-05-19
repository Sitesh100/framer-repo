import Header from '@/components/shared/Header';

export default function WalletPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 via-white to-blue-50">
      <Header />
      <main className="max-w-5xl mx-auto px-4 pt-28 pb-12">
        <div className="bg-white border border-cyan-100 rounded-2xl shadow-sm p-6 md:p-8">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Onlyy Wallet</h1>
          <p className="text-gray-600 mt-2">Track your wallet balance, credits, and refund history.</p>

          <div className="mt-6 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 p-5 text-white">
            <p className="text-sm text-blue-100">Available Balance</p>
            <p className="text-3xl font-bold mt-1">₹0</p>
          </div>

          <div className="mt-4 rounded-xl border border-gray-200 p-4">
            <p className="text-sm font-semibold text-slate-900">No transactions yet</p>
            <p className="text-xs text-gray-500 mt-1">Credits, debits, and refunds will appear here.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
