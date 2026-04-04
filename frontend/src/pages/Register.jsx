/**
 * Register — new worker onboarding screen
 * Saves worker ID to localStorage after registration
 */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerWorker } from "../services/api.js";

const PLATFORMS = ["swiggy", "zomato", "dunzo", "blinkit"];
const RISK_ZONES = [
  { value: "low",    label: "Low Risk Zone",    premium: "₹20/week" },
  { value: "medium", label: "Medium Risk Zone", premium: "₹25/week" },
  { value: "high",   label: "High Risk Zone",   premium: "₹30/week" },
];

export default function Register() {
  const navigate = useNavigate();
  const [step,        setStep]        = useState(1);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState(null);
  const [form, setForm] = useState({
    name:      "",
    phone:     "",
    upi_id:    "",
    platform:  "swiggy",
    city:      "Bhubaneswar",
    risk_zone: "medium",
  });

  function update(field, value) {
    setForm(f => ({ ...f, [field]: value }));
  }

  async function handleSubmit() {
    setLoading(true);
    setError(null);
    try {
      const worker = await registerWorker(form);
      localStorage.setItem("insureo_worker_id",       worker.id);
      localStorage.setItem("insureo_worker_name",     worker.name);
      localStorage.setItem("insureo_worker_platform", worker.platform);
      navigate("/");
    } catch (e) {
      const msg = e?.response?.data?.detail;
      if (e?.code === "ECONNABORTED" || !e?.response) {
        setError("Server is waking up — please wait 30 seconds and try again.");
      } else {
        setError(msg || "Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="px-4 pt-4 pb-6 space-y-4">

      {/* Header */}
      <div className="flex items-center gap-3 py-2">
        <div className="rounded-xl flex items-center justify-center"
          style={{ width: 44, height: 44, background: 'rgba(0,212,255,0.12)' }}>
          <span style={{ fontSize: 24 }}>🛡</span>
        </div>
        <div>
          <div className="flex items-center gap-1">
            <span className="text-xl font-bold text-white">Insure</span>
            <span className="text-xl font-bold" style={{ color: '#00ffb4' }}>O</span>
          </div>
          <p className="text-xs" style={{ color: '#64748b' }}>Create your account</p>
        </div>
      </div>

      {/* Step indicator */}
      <div className="flex gap-2">
        {[1, 2, 3].map(s => (
          <div key={s} className="flex-1 h-1 rounded-full"
            style={{ background: step >= s ? '#00ffb4' : 'rgba(255,255,255,0.1)' }} />
        ))}
      </div>

      {/* Step 1 — Personal Info */}
      {step === 1 && (
        <div className="space-y-3 slide-up">
          <p className="text-lg font-bold text-white">Personal Details</p>

          {[
            { label: "Full Name",   field: "name",   type: "text",   placeholder: "e.g. Ravi Kumar"    },
            { label: "Phone Number", field: "phone",  type: "tel",    placeholder: "e.g. 9876543210"    },
            { label: "UPI ID",      field: "upi_id", type: "text",   placeholder: "e.g. ravi@okaxis"   },
          ].map(item => (
            <div key={item.field}>
              <label className="text-xs font-bold tracking-wider block mb-1"
                style={{ color: '#64748b' }}>{item.label.toUpperCase()}</label>
              <input
                type={item.type}
                value={form[item.field]}
                onChange={e => update(item.field, e.target.value)}
                placeholder={item.placeholder}
                className="w-full rounded-xl px-4 py-3 text-sm"
                style={{ background: '#111827', color: '#e2e8f0',
                         border: '1px solid rgba(255,255,255,0.08)', outline: 'none' }}
              />
            </div>
          ))}

          <button
            onClick={() => {
              if (!form.name || !form.phone || !form.upi_id) {
                setError("Please fill all fields"); return;
              }
              setError(null); setStep(2);
            }}
            className="w-full rounded-xl py-3 font-bold text-sm tracking-wider"
            style={{ background: 'linear-gradient(135deg, #00ffb4, #00d4ff)', color: '#0a0e1a' }}>
            NEXT →
          </button>
        </div>
      )}

      {/* Step 2 — Platform */}
      {step === 2 && (
        <div className="space-y-3 slide-up">
          <p className="text-lg font-bold text-white">Your Platform</p>

          <div className="grid grid-cols-2 gap-3">
            {PLATFORMS.map(p => (
              <button key={p} onClick={() => update("platform", p)}
                className="rounded-xl py-4 font-bold text-sm capitalize"
                style={{
                  background: form.platform === p ? 'rgba(0,255,180,0.15)' : '#111827',
                  border: `1px solid ${form.platform === p ? '#00ffb4' : 'rgba(255,255,255,0.07)'}`,
                  color: form.platform === p ? '#00ffb4' : '#94a3b8',
                  boxShadow: form.platform === p ? '0 0 16px rgba(0,255,180,0.2)' : 'none',
                }}>
                {p === 'swiggy'  ? '🟠 Swiggy'  :
                 p === 'zomato'  ? '🔴 Zomato'  :
                 p === 'dunzo'   ? '🟣 Dunzo'   : '🔵 Blinkit'}
              </button>
            ))}
          </div>

          <div>
            <label className="text-xs font-bold tracking-wider block mb-1"
              style={{ color: '#64748b' }}>CITY</label>
            <input
              value={form.city}
              onChange={e => update("city", e.target.value)}
              placeholder="Your city"
              className="w-full rounded-xl px-4 py-3 text-sm"
              style={{ background: '#111827', color: '#e2e8f0',
                       border: '1px solid rgba(255,255,255,0.08)', outline: 'none' }}
            />
          </div>

          <div className="flex gap-3">
            <button onClick={() => setStep(1)}
              className="flex-1 rounded-xl py-3 font-bold text-sm"
              style={{ background: '#111827', color: '#64748b',
                       border: '1px solid rgba(255,255,255,0.07)' }}>
              ← BACK
            </button>
            <button onClick={() => { setError(null); setStep(3); }}
              className="flex-1 rounded-xl py-3 font-bold text-sm"
              style={{ background: 'linear-gradient(135deg, #00ffb4, #00d4ff)', color: '#0a0e1a' }}>
              NEXT →
            </button>
          </div>
        </div>
      )}

      {/* Step 3 — Plan */}
      {step === 3 && (
        <div className="space-y-3 slide-up">
          <p className="text-lg font-bold text-white">Choose Your Plan</p>

          <div className="space-y-3">
            {RISK_ZONES.map(z => (
              <button key={z.value} onClick={() => update("risk_zone", z.value)}
                className="w-full rounded-xl p-4 text-left"
                style={{
                  background: form.risk_zone === z.value ? 'rgba(0,255,180,0.1)' : '#111827',
                  border: `1px solid ${form.risk_zone === z.value ? '#00ffb4' : 'rgba(255,255,255,0.07)'}`,
                  boxShadow: form.risk_zone === z.value ? '0 0 16px rgba(0,255,180,0.15)' : 'none',
                }}>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-white">{z.label}</span>
                  <span className="font-bold text-sm" style={{ color: '#00ffb4' }}>{z.premium}</span>
                </div>
                <p className="text-xs mt-1" style={{ color: '#64748b' }}>
                  {z.value === 'low'    ? 'Suburban areas, low traffic density'    :
                   z.value === 'medium' ? 'City centre, moderate disruption risk'  :
                                          'High traffic zones, peak disruption risk'}
                </p>
              </button>
            ))}
          </div>

          {error && (
            <p className="text-xs text-center" style={{ color: '#ff4466' }}>{error}</p>
          )}

          <div className="flex gap-3">
            <button onClick={() => setStep(2)}
              className="flex-1 rounded-xl py-3 font-bold text-sm"
              style={{ background: '#111827', color: '#64748b',
                       border: '1px solid rgba(255,255,255,0.07)' }}>
              ← BACK
            </button>
            <button onClick={handleSubmit} disabled={loading}
              className="flex-1 rounded-xl py-3 font-bold text-sm disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #00ffb4, #00d4ff)', color: '#0a0e1a',
                       boxShadow: '0 0 20px rgba(0,255,180,0.3)' }}>
              {loading ? 'CREATING…' : '⚡ GET INSURED'}
            </button>
          </div>
        </div>
      )}

      {error && step !== 3 && (
        <p className="text-xs text-center" style={{ color: '#ff4466' }}>{error}</p>
      )}

    </div>
  );
}
