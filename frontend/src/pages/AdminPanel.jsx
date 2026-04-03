import { useEffect, useState } from "react";
import AlertBanner from "../components/AlertBanner.jsx";
import ClaimCard   from "../components/ClaimCard.jsx";
import { connectAsAdmin }  from "../services/websocket.js";
import { listClaims, triggerPayout, reportTraffic, reportWeather } from "../services/api.js";

export default function AdminPanel() {
  const [alerts,        setAlerts]        = useState([]);
  const [claims,        setClaims]        = useState([]);
  const [payingId,      setPayingId]      = useState(null);
  const [payMsg,        setPayMsg]        = useState(null);
  const [reportType,    setReportType]    = useState("traffic");
  const [reportCity,    setReportCity]    = useState("Bhubaneswar");
  const [congestionPct, setCongestionPct] = useState(65);
  const [rainfallMm,    setRainfallMm]    = useState(120);
  const [reporting,     setReporting]     = useState(false);
  const [reportMsg,     setReportMsg]     = useState(null);

  useEffect(() => {
    const socket = connectAsAdmin();
    socket.on("disruption_alert", ({ disruptions }) =>
      setAlerts(prev => [...(disruptions || []), ...prev].slice(0, 5)));
    socket.on("payout_confirmed", ({ claimPrefix }) =>
      setPayMsg(`Payout confirmed for claim ${claimPrefix}`));

    loadClaims();
    return () => socket.disconnect();
  }, []);

  async function loadClaims() {
    try {
      const [pending, approved] = await Promise.all([
        listClaims("pending"), listClaims("approved"),
      ]);
      setClaims([...pending, ...approved]);
    } catch {}
  }

  async function handleTriggerPayout(claimId) {
    setPayingId(claimId); setPayMsg(null);
    try {
      const r = await triggerPayout(claimId);
      setPayMsg(r.status === 'paid'
        ? `Paid ₹${r.amount} via UPI (${r.razorpay_id})`
        : `Queued: ${r.message}`);
      loadClaims();
    } catch {
      setPayMsg("Payout trigger failed.");
    } finally {
      setPayingId(null);
    }
  }

  async function handleReport(e) {
    e.preventDefault();
    setReporting(true); setReportMsg(null);
    try {
      const result = reportType === "traffic"
        ? await reportTraffic({ city: reportCity, zone: "Zone B",
            congestion_pct: parseFloat(congestionPct), route_frozen: true })
        : await reportWeather({ city: reportCity, rainfall_mm: parseFloat(rainfallMm),
            alert_level: rainfallMm >= 150 ? "warning" : "advisory" });

      setReportMsg(result.confirmed
        ? `Confirmed (${result.severity}) — Event ${result.event_id?.slice(0,8)}`
        : `Not confirmed: ${result.detail}`);
      setAlerts(prev => [
        { type: reportType, city: reportCity, severity: result.severity,
          detail: result.detail, confirmed: result.confirmed }, ...prev
      ].slice(0, 5));
    } catch {
      setReportMsg("Could not report — is FastAPI running?");
    } finally {
      setReporting(false);
    }
  }

  return (
    <div className="px-3 pt-2 pb-4 space-y-3">

      {/* Header */}
      <div className="flex items-center justify-between py-2">
        <div>
          <h1 className="text-xl font-bold text-white">Admin Panel</h1>
          <p className="text-xs mt-0.5" style={{ color: '#64748b' }}>Ops · InsureO</p>
        </div>
        <div className="rounded-xl px-3 py-1 text-xs font-bold"
          style={{ background: 'rgba(0,255,180,0.1)', color: '#00ffb4',
                   border: '1px solid rgba(0,255,180,0.3)' }}>
          LIVE
        </div>
      </div>

      {/* Live Disruptions */}
      <div className="rounded-2xl p-4 card-hover" style={{ background: '#111827' }}>
        <p className="text-xs font-bold tracking-wider mb-3" style={{ color: '#64748b' }}>
          LIVE DISRUPTION FEED
        </p>
        <AlertBanner alerts={alerts} />
        {alerts.length === 0 && (
          <p className="text-xs text-center py-4" style={{ color: '#64748b' }}>
            No active disruptions
          </p>
        )}
      </div>

      {/* Report Disruption */}
      <div className="rounded-2xl p-4 card-hover" style={{ background: '#111827' }}>
        <p className="text-xs font-bold tracking-wider mb-3" style={{ color: '#64748b' }}>
          REPORT DISRUPTION
        </p>
        <form onSubmit={handleReport} className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <select value={reportType} onChange={e => setReportType(e.target.value)}
              className="rounded-xl px-3 py-2.5 text-sm"
              style={{ background: 'rgba(6,12,24,0.8)', color: '#e2e8f0',
                       border: '1px solid rgba(255,255,255,0.08)', outline: 'none' }}>
              <option value="traffic">🚗 Traffic</option>
              <option value="weather">🌧 Weather</option>
            </select>
            <input value={reportCity} onChange={e => setReportCity(e.target.value)}
              placeholder="City"
              className="rounded-xl px-3 py-2.5 text-sm"
              style={{ background: 'rgba(6,12,24,0.8)', color: '#e2e8f0',
                       border: '1px solid rgba(255,255,255,0.08)', outline: 'none' }} />
          </div>

          {reportType === "traffic" ? (
            <input type="number" value={congestionPct}
              onChange={e => setCongestionPct(e.target.value)}
              placeholder="Congestion %"
              className="w-full rounded-xl px-3 py-2.5 text-sm"
              style={{ background: 'rgba(6,12,24,0.8)', color: '#e2e8f0',
                       border: '1px solid rgba(255,255,255,0.08)', outline: 'none' }} />
          ) : (
            <input type="number" value={rainfallMm}
              onChange={e => setRainfallMm(e.target.value)}
              placeholder="Rainfall mm"
              className="w-full rounded-xl px-3 py-2.5 text-sm"
              style={{ background: 'rgba(6,12,24,0.8)', color: '#e2e8f0',
                       border: '1px solid rgba(255,255,255,0.08)', outline: 'none' }} />
          )}

          <button type="submit" disabled={reporting}
            className="w-full rounded-xl py-2.5 text-sm font-bold tracking-wider disabled:opacity-50"
            style={{ background: 'rgba(0,212,255,0.15)', color: '#00d4ff',
                     border: '1px solid rgba(0,212,255,0.4)' }}>
            {reporting ? 'REPORTING…' : '📡 REPORT DISRUPTION'}
          </button>
        </form>
        {reportMsg && (
          <p className="mt-2 text-xs text-center font-medium"
            style={{ color: reportMsg.includes('Confirmed') ? '#00ffb4' : '#f5c842' }}>
            {reportMsg}
          </p>
        )}
      </div>

      {/* Approved Claims */}
      <div className="rounded-2xl p-4 card-hover" style={{ background: '#111827' }}>
        <p className="text-xs font-bold tracking-wider mb-3" style={{ color: '#64748b' }}>
          APPROVED CLAIMS — PAYOUT QUEUE
        </p>
        {payMsg && (
          <p className="mb-3 text-xs font-medium" style={{ color: '#00ffb4' }}>{payMsg}</p>
        )}
        {claims.length === 0 ? (
          <p className="text-xs text-center py-4" style={{ color: '#64748b' }}>
            No claims in queue
          </p>
        ) : (
          <div className="space-y-3">
            {claims.map(c => (
              <div key={c.id}>
                <ClaimCard claim={c} />
                {c.status === 'approved' && (
                  <button onClick={() => handleTriggerPayout(c.id)}
                    disabled={payingId === c.id}
                    className="mt-2 w-full rounded-xl py-2.5 text-sm font-bold tracking-wider disabled:opacity-50"
                    style={{ background: 'linear-gradient(135deg, #00ffb4, #00d4ff)',
                             color: '#0a0e1a', boxShadow: '0 0 16px rgba(0,255,180,0.3)' }}>
                    {payingId === c.id ? 'PROCESSING…' : '💸 TRIGGER PAYOUT'}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
