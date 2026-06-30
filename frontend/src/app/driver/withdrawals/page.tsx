import { CreditCard } from "lucide-react";

export default function Page() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-black text-gray-900 tracking-tight">Withdrawal Requests</h2>
      </div>
      <div className="bg-white border border-gray-100 p-16 text-center rounded-3xl shadow-sm space-y-4">
        <CreditCard className="w-16 h-16 text-orange-200 mx-auto" />
        <div className="space-y-2">
          <h3 className="text-lg font-extrabold text-gray-900">Module Under Construction</h3>
          <p className="text-xs font-semibold text-gray-400 max-w-sm mx-auto">
            This module is being finalized. The data and interfaces for this section will be available in the upcoming release.
          </p>
        </div>
      </div>
    </div>
  );
}