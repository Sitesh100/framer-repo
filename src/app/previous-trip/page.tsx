import Header from '@/components/shared/Header';

export default function PreviousTripPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-blue-50">
      <Header />
      <main className="max-w-5xl mx-auto px-4 pt-28 pb-12">
        <div className="bg-white border border-emerald-100 rounded-2xl shadow-sm p-6 md:p-8">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Previous Trip</h1>
          <p className="text-gray-600 mt-2">See your completed and upcoming bookings in one place.</p>

          <div className="mt-6 space-y-3">
            <div className="rounded-xl border border-gray-200 p-4">
              <p className="text-sm font-semibold text-slate-900">No trips yet</p>
              <p className="text-xs text-gray-500 mt-1">Your trip history will appear here after booking.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
