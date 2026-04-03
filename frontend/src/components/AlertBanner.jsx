export default function AlertBanner({ alerts }) {
  if (!alerts || alerts.length === 0) return null;

  const config = {
    high:   { border: '#ff4466', bg: 'rgba(255,68,102,0.1)',  color: '#ff4466',  icon: '🚨' },
    medium: { border: '#f5c842', bg: 'rgba(245,200,66,0.1)', color: '#f5c842',  icon: '⚠️' },
    low:    { border: '#00d4ff', bg: 'rgba(0,212,255,0.08)',  color: '#00d4ff',  icon: 'ℹ️' },
  };

  return (
    <div className="space-y-2 mb-3">
      {alerts.slice(0, 3).map((alert, idx) => {
        const s = config[alert.severity] || config.low;
        return (
          <div key={idx} className="rounded-xl px-4 py-3 slide-up"
            style={{ background: s.bg, border: `1px solid ${s.border}` }}>
            <div className="flex items-center gap-2">
              <span>{s.icon}</span>
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: s.color }}>
                {alert.disruptionType || alert.type}
              </span>
              {alert.city && (
                <span className="text-xs ml-auto" style={{ color: '#64748b' }}>{alert.city}</span>
              )}
            </div>
            <p className="text-xs mt-1" style={{ color: '#94a3b8' }}>
              {alert.message || alert.detail}
            </p>
          </div>
        );
      })}
    </div>
  );
}
