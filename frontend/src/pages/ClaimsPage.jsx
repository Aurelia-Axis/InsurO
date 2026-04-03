import { useEffect, useState } from "react";
import ClaimCard              from "../components/ClaimCard.jsx";
import { getWorkerClaims }   from "../services/api.js";

const FILTERS = ['all', 'approved', 'paid', 'pending', 'rejected'];

export default function ClaimsPage() {
  const workerId = localStorage.getItem("insureo_worker_id");
  const [claims,   setClaims]   = useState([]);
  const [filter,   setFilter]   = useState('all');
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    if (!workerId) return;
    getWorkerClaims(workerId)
      .then(data => setClaims(data))
      .catch(() => setClaims([]))
      .finally(() => setLoading(false));
  }, [workerId]);

  const filtered = filter === 'all' ? claims : claims.filter(c => c.status === filter);

  const totalPaid = claims
    .filter(c => c.status === 'paid')
    .reduce((s, c) => s + (c.payout_amount || 0), 0);

  return (
    <div className="px-3 pt-2 pb-4 space-y-3">

      <div className="py-2">
        <h1 className="text-xl font-bold text-white">My Claims</h1>
        <p className="text-xs mt-0.5" style={{ color: '#64748b' }}>
          Auto-filed by AI · No manual paperwork
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: 'TOTAL',    val: claims.length,                                      color: '#00d4ff' },
          { label: 'PAID OUT', val: `₹${totalPaid.toFixed(0)}`,                        color: '#00ffb4' },
          { label: 'PENDING',  val: claims.filter(c => c.status === 'pending').length,  color: '#f5c842' },
        ].map(item => (
          <div key={item.label} className="rounded-2xl p-3 text-center card-hover"
            style={{ background: '#111827' }}>
            <p className="text-xl font-bold" style={{ color: item.color }}>{item.val}</p>
            <p style={{ color: '#64748b', fontSize: 10 }}>{item.label}</p>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        {FILTERS.map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className="rounded-full px-3 py-1.5 text-xs font-bold whitespace-nowrap flex-shrink-0"
            style={{
              background: filter === f ? 'rgba(0,255,180,0.15)' : 'rgba(255,255,255,0.05)',
              border: `1px solid ${filter === f ? 'rgba(0,255,180,0.5)' : 'rgba(255,255,255,0.07)'}`,
              color: filter === f ? '#00ffb4' : '#64748b',
            }}>
            {f.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Claims */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 rounded-full border-2 animate-spin"
            style={{ borderColor: '#00ffb4', borderTopColor: 'transparent' }} />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12" style={{ color: '#64748b' }}>
          <p style={{ fontSize: 40 }}>📋</p>
          <p className="text-sm mt-2">No claims yet</p>
          <p className="text-xs mt-1">File your first claim from the Home tab</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(c => <ClaimCard key={c.id} claim={c} />)}
        </div>
      )}

    </div>
  );
}
