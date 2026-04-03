/**
 * Circular efficiency ring — matches InsureO dark theme
 */
export default function EfficiencyMeter({ efficiency, threshold = 0.5 }) {
  const pct = Math.round(efficiency * 100);
  const r   = 44;
  const circumference = 2 * Math.PI * r;
  const dash = (efficiency * circumference).toFixed(1);

  const color =
    efficiency >= threshold       ? '#00ffb4'
    : efficiency >= threshold * 0.7 ? '#f5c842'
    : '#ff4466';

  const label =
    efficiency >= threshold       ? 'Good'
    : efficiency >= threshold * 0.7 ? 'At Risk'
    : 'Critical';

  return (
    <div className="flex flex-col items-center">
      <svg width="120" height="120" viewBox="0 0 110 110">
        {/* Track */}
        <circle cx="55" cy="55" r={r} fill="none"
          stroke="rgba(255,255,255,0.07)" strokeWidth="10" />
        {/* Progress */}
        <circle cx="55" cy="55" r={r} fill="none"
          stroke={color} strokeWidth="10"
          strokeDasharray={`${dash} ${circumference}`}
          strokeLinecap="round"
          transform="rotate(-90 55 55)"
          style={{ filter: `drop-shadow(0 0 8px ${color})` }}
        />
        {/* Center text */}
        <text x="55" y="51" textAnchor="middle" fill="white"
          style={{ fontSize: 20, fontWeight: 'bold', fontFamily: 'Segoe UI' }}>
          {pct}%
        </text>
        <text x="55" y="67" textAnchor="middle"
          style={{ fontSize: 11, fill: color, fontFamily: 'Segoe UI' }}>
          {label}
        </text>
      </svg>
      <p className="text-xs mt-1" style={{ color: '#64748b' }}>
        Threshold: {Math.round(threshold * 100)}%
      </p>
    </div>
  );
}
