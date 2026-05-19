import Header from '@/components/shared/Header';

export default function PersonalInformationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-cyan-50">
      <Header />
      <main className="max-w-5xl mx-auto px-4 pt-28 pb-12">
        <div className="bg-white border border-blue-100 rounded-2xl shadow-sm p-6 md:p-8">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Personal Information</h1>
          <p className="text-gray-600 mt-2">Manage your profile details for faster bookings.</p>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-gray-200 p-4">
              <p className="text-xs text-gray-500">Full Name</p>
              <p className="text-sm font-semibold text-slate-900 mt-1">Not set</p>
            </div>
            <div className="rounded-xl border border-gray-200 p-4">
              <p className="text-xs text-gray-500">Email</p>
              <p className="text-sm font-semibold text-slate-900 mt-1">Not set</p>
            </div>
            <div className="rounded-xl border border-gray-200 p-4">
              <p className="text-xs text-gray-500">Phone</p>
              <p className="text-sm font-semibold text-slate-900 mt-1">Not set</p>
            </div>
            <div className="rounded-xl border border-gray-200 p-4">
              <p className="text-xs text-gray-500">Date of Birth</p>
              <p className="text-sm font-semibold text-slate-900 mt-1">Not set</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
