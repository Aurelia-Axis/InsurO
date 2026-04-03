import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, ReferenceLine,
} from "recharts";

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg px-3 py-2 text-xs"
      style={{ background: '#111827', border: '1px solid rgba(0,255,180,0.3)' }}>
      <p style={{ color: '#00ffb4' }}>₹{payload[0].value}</p>
    </div>
  );
};

export default function EarningChart({ data, expectedEarnings }) {
  return (
    <div className="rounded-2xl p-4 card-hover"
      style={{ background: '#111827' }}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold tracking-wider" style={{ color: '#64748b' }}>
          WEEKLY EARNINGS
        </span>
        <span className="text-xs font-bold" style={{ color: '#00ffb4' }}>
          ₹{expectedEarnings} avg
        </span>
      </div>
      <ResponsiveContainer width="100%" height={100}>
        <AreaChart data={data} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
          <defs>
            <linearGradient id="earnGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#00ffb4" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#00ffb4" stopOpacity={0}   />
            </linearGradient>
          </defs>
          <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={expectedEarnings} stroke="rgba(245,200,66,0.4)"
            strokeDasharray="4 4" />
          <Area type="monotone" dataKey="actual"
            stroke="#00ffb4" strokeWidth={2}
            fill="url(#earnGrad)"
            dot={{ fill: '#00ffb4', r: 3, strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
