const STATUS = {
  pending:  { color: '#f5c842', bg: 'rgba(245,200,66,0.12)',  label: 'PENDING'  },
  approved: { color: '#00ffb4', bg: 'rgba(0,255,180,0.12)',   label: 'APPROVED' },
  rejected: { color: '#ff4466', bg: 'rgba(255,68,102,0.12)',  label: 'REJECTED' },
  paid:     { color: '#00d4ff', bg: 'rgba(0,212,255,0.12)',   label: 'PAID'     },
  queued:   { color: '#64748b', bg: 'rgba(100,116,139,0.12)', label: 'QUEUED'   },
};

const TYPE_ICON = {
  traffic:    '🚗',
  weather:    '🌧',
  algorithm:  '📡',
  restaurant: '🍽',
};

export default function ClaimCard({ claim }) {
  const s    = STATUS[claim.status]  || STATUS.pending;
  const icon = TYPE_ICON[claim.disruption_type] || '📋';
  const date = new Date(claim.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

  return (
    <div className="rounded-2xl p-4 card-hover"
      style={{ background: '#111827', border: `1px solid ${s.color}22` }}>

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span style={{ fontSize: 20 }}>{icon}</span>
          <div>
            <p className="text-xs font-bold capitalize" style={{ color: '#e2e8f0' }}>
              {claim.disruption_type?.replace('_', ' ')}
            </p>
            <p className="text-xs" style={{ color: '#64748b' }}>{date}</p>
          </div>
        </div>
        <span className="text-xs font-bold px-2 py-1 rounded-full"
          style={{ background: s.bg, color: s.color }}>
          {s.label}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {[
          { label: 'EFFICIENCY', val: `${(claim.efficiency_score * 100).toFixed(0)}%`,
            color: claim.efficiency_score < 0.5 ? '#ff4466' : '#00ffb4' },
          { label: 'EXPECTED',   val: `₹${claim.expected_earnings?.toFixed(0)}`, color: '#64748b' },
          { label: 'ACTUAL',     val: `₹${claim.actual_earnings?.toFixed(0)}`,   color: '#e2e8f0' },
        ].map(item => (
          <div key={item.label} className="rounded-xl p-2 text-center"
            style={{ background: 'rgba(6,12,24,0.6)' }}>
            <p className="text-xs font-bold" style={{ color: item.color }}>{item.val}</p>
            <p className="text-xs mt-0.5" style={{ color: '#64748b', fontSize: 9 }}>{item.label}</p>
          </div>
        ))}
      </div>

      {claim.payout_amount > 0 && (
        <div className="flex items-center justify-between mt-3 pt-3"
          style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <span className="text-xs" style={{ color: '#64748b' }}>Payout</span>
          <span className="font-bold" style={{ color: '#00ffb4',
            textShadow: '0 0 10px rgba(0,255,180,0.5)' }}>
            ₹{claim.payout_amount?.toFixed(2)}
          </span>
        </div>
      )}
    </div>
  );
}
