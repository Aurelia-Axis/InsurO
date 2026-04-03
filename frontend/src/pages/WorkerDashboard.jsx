import { useEffect, useState } from "react";
import { useNavigate }         from "react-router-dom";
import AlertBanner             from "../components/AlertBanner.jsx";
import EfficiencyMeter         from "../components/EfficiencyMeter.jsx";
import EarningChart            from "../components/EarningChart.jsx";
import { connectAsWorker }     from "../services/websocket.js";
import {
  getWorker, getWorkerClaims,
  submitClaim, getActiveDisruptions,
} from "../services/api.js";

const PIPELINE_STEPS = [
  { icon: '🔍', label: 'DETECT'     },
  { icon: '🧠', label: 'ANALYZE'    },
  { icon: '✅', label: 'VALIDATE'   },
  { icon: '🚀', label: 'COMPENSATE' },
];

export default function WorkerDashboard() {
  const navigate = useNavigate();
  const workerId = localStorage.getItem("insureo_worker_id");

  const [worker,         setWorker]         = useState(null);
  const [claims,         setClaims]         = useState([]);
  const [alerts,         setAlerts]         = useState([]);
  const [activeStep,     setActiveStep]     = useState(0);
  const [actualEarnings, setActualEarnings] = useState("");
  const [disruptionType, setDisruptionType] = useState("traffic");
  const [submitting,     setSubmitting]     = useState(false);
  const [submitMsg,      setSubmitMsg]      = useState(null);
  const [submitOk,       setSubmitOk]       = useState(false);
  const [loading,        setLoading]        = useState(true);

  // Animate pipeline
  useEffect(() => {
    const id = setInterval(() => setActiveStep(s => (s + 1) % 4), 2000);
    return () => clearInterval(id);
  }, []);

  // Load worker data
  useEffect(() => {
    if (!workerId) { navigate("/register"); return; }
    loadAll();

    const socket = connectAsWorker(workerId);
    socket.on("disruption_alert", ({ disruptions }) =>
      setAlerts(prev => [...(disruptions || []), ...prev].slice(0, 3)));
    socket.on("efficiency_update", ({ efficiency: e, actualEarnings: a, expectedEarnings: ex }) =>
      setWorker(prev => prev ? { ...prev, liveEfficiency: parseFloat(e),
        liveActual: a, liveExpected: ex } : prev));
    socket.on("claim_status", () => loadClaims());

    return () => socket.disconnect();
  }, [workerId]);

  async function loadAll() {
    setLoading(true);
    await Promise.all([loadWorker(), loadClaims(), loadDisruptions()]);
    setLoading(false);
  }

  async function loadWorker() {
    try {
      const data = await getWorker(workerId);
      setWorker(data);
    } catch { setWorker(null); }
  }

  async function loadClaims() {
    try {
      const data = await getWorkerClaims(workerId);
      setClaims(data);
    } catch { setClaims([]); }
  }

  async function loadDisruptions() {
    try {
      const data = await getActiveDisruptions(worker?.city || "Bhubaneswar");
      setAlerts(data.slice(0, 2));
    } catch {}
  }

  async function handleClaim(e) {
    e.preventDefault();
    if (!actualEarnings) return;
    setSubmitting(true); setSubmitMsg(null); setSubmitOk(false);
    try {
      const claim = await submitClaim({
        worker_id:       workerId,
        disruption_type: disruptionType,
        actual_earnings: parseFloat(actualEarnings),
      });
      const approved = claim.status === "approved";
      setSubmitOk(approved);
      setSubmitMsg(
        approved
          ? `Claim approved! Payout ₹${claim.payout_amount} sent to UPI.`
          : claim.status === "rejected"
          ? `Claim rejected — efficiency (${(claim.efficiency_score*100).toFixed(0)}%) above threshold or no disruption confirmed.`
          : `Claim ${claim.status}.`
      );
      setActualEarnings("");
      loadClaims();
    } catch (err) {
      setSubmitMsg(err?.response?.data?.detail || "Could not submit claim.");
      setSubmitOk(false);
    } finally {
      setSubmitting(false);
    }
  }

  // Build chart data from real claims
  const chartData = claims.length > 0
    ? claims.slice(0, 7).reverse().map((c, i) => ({
        day: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][i % 7],
        actual: c.actual_earnings,
      }))
    : [{ day: 'Today', actual: worker?.baseline_earnings || 680 }];

  const efficiency = worker?.liveEfficiency
    ?? (claims[0]
        ? Math.min(claims[0].actual_earnings / (worker?.baseline_earnings || 680), 1)
        : 0.82);

  const totalPaid = claims
    .filter(c => c.status === 'paid')
    .reduce((s, c) => s + (c.payout_amount || 0), 0);

  const kpis = [
    { label: 'TODAY',       val: claims[0] ? `₹${claims[0].actual_earnings}` : '—',   color: '#00ffb4' },
    { label: 'SMART SCORE', val: Math.round((worker?.performance_score || 0.9) * 100), color: '#00d4ff' },
    { label: 'PAID OUT',    val: `₹${totalPaid.toFixed(0)}`,                           color: '#f5c842' },
  ];

  if (loading) return <Loader />;

  return (
    <div className="px-3 pt-2 pb-4 space-y-3">

      {/* Header */}
      <div className="flex items-center justify-between py-2">
        <div className="flex items-center gap-3">
          <div className="rounded-xl flex items-center justify-center"
            style={{ width: 40, height: 40, background: 'rgba(0,212,255,0.12)' }}>
            <span style={{ fontSize: 20 }}>🛡</span>
          </div>
          <div>
            <div className="flex items-center">
              <span className="text-lg font-bold text-white">Insure</span>
              <span className="text-lg font-bold" style={{ color: '#00ffb4' }}>O</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="rounded-xl flex items-center justify-center"
            style={{ width: 36, height: 36, background: 'rgba(0,212,255,0.08)' }}>
            <span style={{ fontSize: 16 }}>🔔</span>
          </div>
          <button onClick={() => { localStorage.clear(); window.location.reload(); }}
            className="rounded-xl flex items-center justify-center"
            style={{ width: 36, height: 36, background: 'rgba(255,68,102,0.08)' }}>
            <span style={{ fontSize: 14 }}>↩</span>
          </button>
        </div>
      </div>

      {/* Alerts */}
      <AlertBanner alerts={alerts} />

      {/* Hero Card */}
      <div className="rounded-2xl p-4 card-hover"
        style={{ background: '#111827', border: '1px solid rgba(0,212,255,0.12)' }}>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">
              Hey, {worker?.name?.split(' ')[0] || 'there'} 👋
            </h1>
            <p className="text-xs mt-0.5" style={{ color: '#64748b' }}>
              {worker?.city || 'India'} · {worker?.platform}
            </p>
          </div>
          <div className="rounded-full px-3 py-1 text-xs font-bold capitalize"
            style={{ background: 'rgba(124,58,237,0.2)',
                     border: '1px solid rgba(124,58,237,0.5)', color: '#7c3aed' }}>
            {worker?.risk_zone} zone
          </div>
        </div>

        <div className="flex items-center gap-2 mt-2">
          <div className="w-2 h-2 rounded-full pulse-dot"
            style={{ background: '#00ffb4', boxShadow: '0 0 8px #00ffb4' }} />
          <span className="text-xs font-bold" style={{ color: '#00ffb4' }}>
            Live tracking active · AI monitoring on
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-3">
          {kpis.map(k => (
            <div key={k.label} className="rounded-xl p-2 text-center"
              style={{ background: 'rgba(6,12,24,0.8)' }}>
              <p className="font-bold text-base" style={{ color: k.color,
                textShadow: `0 0 10px ${k.color}66` }}>{k.val}</p>
              <p style={{ color: '#64748b', fontSize: 10 }}>{k.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Efficiency + Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl p-4 flex flex-col items-center justify-center card-hover"
          style={{ background: '#111827' }}>
          <EfficiencyMeter
            efficiency={efficiency}
            threshold={worker?.weeks_active <= 2 ? 0.4 : worker?.weeks_active <= 4 ? 0.45 : 0.5}
          />
        </div>

        <div className="space-y-3">
          {[
            { label: 'WEEKLY PREMIUM', val: `₹${worker?.premium_weekly || 25}`, sub: 'Auto UPI debit', color: '#7c3aed' },
            { label: 'BASELINE',       val: `₹${worker?.baseline_earnings || 680}`, sub: 'Expected daily', color: '#00d4ff' },
          ].map(item => (
            <div key={item.label} className="rounded-2xl p-3 card-hover"
              style={{ background: '#111827' }}>
              <p className="text-xs font-bold tracking-wider" style={{ color: '#64748b' }}>{item.label}</p>
              <p className="text-xl font-bold mt-1" style={{ color: item.color }}>{item.val}</p>
              <p className="text-xs" style={{ color: '#64748b' }}>{item.sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Chart */}
      <EarningChart data={chartData} expectedEarnings={worker?.baseline_earnings || 680} />

      {/* AI Pipeline */}
      <div className="rounded-2xl p-4 card-hover" style={{ background: '#111827' }}>
        <p className="text-xs font-bold tracking-wider mb-3" style={{ color: '#00d4ff' }}>
          REAL-TIME AI PROCESSING PIPELINE
        </p>
        <div className="grid grid-cols-4 gap-2">
          {PIPELINE_STEPS.map((step, i) => {
            const active = i === activeStep;
            return (
              <div key={step.label} className="rounded-xl p-2 flex flex-col items-center gap-1"
                style={{
                  background: active ? 'rgba(0,212,255,0.15)' : 'rgba(6,12,24,0.8)',
                  border: `1px solid ${active ? 'rgba(0,212,255,0.5)' : 'rgba(255,255,255,0.05)'}`,
                  boxShadow: active ? '0 0 12px rgba(0,212,255,0.25)' : 'none',
                  transition: 'all 0.3s',
                }}>
                <span style={{ fontSize: 16 }}>{step.icon}</span>
                <span style={{ color: active ? '#00d4ff' : '#64748b', fontSize: 9, fontWeight: 'bold' }}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* File Claim */}
      <div className="rounded-2xl p-4 card-hover" style={{ background: '#111827' }}>
        <p className="text-xs font-bold tracking-wider mb-3" style={{ color: '#64748b' }}>
          FILE A CLAIM
        </p>
        <form onSubmit={handleClaim} className="space-y-3">
          <select value={disruptionType} onChange={e => setDisruptionType(e.target.value)}
            className="w-full rounded-xl px-3 py-2.5 text-sm font-medium"
            style={{ background: 'rgba(6,12,24,0.8)', color: '#e2e8f0',
                     border: '1px solid rgba(255,255,255,0.08)', outline: 'none' }}>
            <option value="traffic">🚗 Traffic Congestion</option>
            <option value="weather">🌧 Weather (Rainfall)</option>
            <option value="algorithm">📡 Platform Algorithm Change</option>
            <option value="restaurant">🍽 Restaurant Delay</option>
          </select>

          <input type="number" min="0" value={actualEarnings}
            onChange={e => setActualEarnings(e.target.value)}
            placeholder="Today's actual earnings (₹)"
            className="w-full rounded-xl px-3 py-2.5 text-sm"
            style={{ background: 'rgba(6,12,24,0.8)', color: '#e2e8f0',
                     border: '1px solid rgba(255,255,255,0.08)', outline: 'none' }} />

          <button type="submit" disabled={submitting || !actualEarnings}
            className="w-full rounded-xl py-3 text-sm font-bold tracking-wider disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, #00ffb4, #00d4ff)',
                     color: '#0a0e1a', boxShadow: '0 0 20px rgba(0,255,180,0.3)' }}>
            {submitting ? 'FILING CLAIM…' : '⚡ FILE CLAIM INSTANTLY'}
          </button>
        </form>

        {submitMsg && (
          <p className="mt-3 text-xs text-center font-medium"
            style={{ color: submitOk ? '#00ffb4' : '#f5c842' }}>
            {submitMsg}
          </p>
        )}
      </div>

    </div>
  );
}

function Loader() {
  return (
    <div className="flex flex-col items-center justify-center" style={{ height: 600 }}>
      <div className="w-12 h-12 rounded-full border-2 border-t-transparent animate-spin"
        style={{ borderColor: '#00ffb4', borderTopColor: 'transparent' }} />
      <p className="mt-4 text-sm" style={{ color: '#64748b' }}>Loading your dashboard…</p>
    </div>
  );
}
