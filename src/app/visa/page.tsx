import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';

export default function VisaPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Header />

      <main className="max-w-5xl mx-auto px-4 lg:px-8 pt-32 pb-16">
        <div className="bg-white border border-blue-100 rounded-3xl p-8 md:p-12 shadow-sm">
          <p className="inline-flex items-center rounded-full bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 mb-4">
            Visa Services
          </p>

          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">Visas Page Coming Soon</h1>
          <p className="text-gray-600 max-w-2xl">
            We are preparing a better visa flow for destination search, document checklist, and processing timelines.
            This section will be live soon.
          </p>

          <div className="mt-8 grid sm:grid-cols-3 gap-3">
            <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4">
              <p className="text-sm font-semibold text-slate-900">Country Selection</p>
              <p className="text-xs text-gray-500 mt-1">Smart destination matching</p>
            </div>
            <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4">
              <p className="text-sm font-semibold text-slate-900">Document Guide</p>
              <p className="text-xs text-gray-500 mt-1">Step-by-step checklist</p>
            </div>
            <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4">
              <p className="text-sm font-semibold text-slate-900">Status Tracking</p>
              <p className="text-xs text-gray-500 mt-1">Realtime updates</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
