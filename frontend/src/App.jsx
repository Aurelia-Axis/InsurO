import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import WorkerDashboard from "./pages/WorkerDashboard.jsx";
import AdminPanel      from "./pages/AdminPanel.jsx";
import ClaimsPage      from "./pages/ClaimsPage.jsx";
import Register        from "./pages/Register.jsx";

const NAV = [
  { path: "/",       icon: "⚡", label: "Home"   },
  { path: "/claims", icon: "📋", label: "Claims" },
  { path: "/admin",  icon: "🛡", label: "Admin"  },
];

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [workerId, setWorkerId] = useState(null);
  const [checked,  setChecked]  = useState(false);

  useEffect(() => {
    const id = localStorage.getItem("insureo_worker_id");
    setWorkerId(id);
    setChecked(true);
  }, [location.pathname]);

  if (!checked) return null;

  // Show register page if no worker ID
  if (!workerId && location.pathname !== "/admin") {
    return (
      <div className="flex flex-col" style={{ minHeight: 844 }}>
        <StatusBar />
        <div className="flex-1 scroll-area grid-bg">
          <Register />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col" style={{ minHeight: 844 }}>
      <StatusBar />

      <div className="flex-1 scroll-area grid-bg" style={{ paddingBottom: 70 }}>
        <Routes>
          <Route path="/"       element={<WorkerDashboard />} />
          <Route path="/claims" element={<ClaimsPage />} />
          <Route path="/admin"  element={<AdminPanel />} />
        </Routes>
      </div>

      {/* Bottom Navigation */}
      <div className="absolute bottom-0 left-0 right-0 flex"
        style={{ height: 70, background: 'rgba(10,14,26,0.97)',
                 borderTop: '1px solid rgba(255,255,255,0.07)', backdropFilter: 'blur(20px)' }}>
        {NAV.map(item => {
          const active = location.pathname === item.path;
          return (
            <button key={item.path} onClick={() => navigate(item.path)}
              className="flex-1 flex flex-col items-center justify-center gap-1 relative">
              <span style={{ fontSize: 20 }}>{item.icon}</span>
              <span className="text-xs font-medium"
                style={{ color: active ? '#00ffb4' : '#64748b' }}>
                {item.label}
              </span>
              {active && (
                <div className="absolute bottom-1 rounded-full"
                  style={{ width: 4, height: 4, background: '#00ffb4',
                           boxShadow: '0 0 8px #00ffb4' }} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StatusBar() {
  return (
    <div className="flex items-center justify-between px-5 pt-3 pb-1"
      style={{ background: 'rgba(10,14,26,0.98)', height: 44 }}>
      <span className="font-mono text-sm font-bold text-white">9:41</span>
      <div className="flex items-center gap-1">
        {[1,1,1,0].map((on, i) => (
          <div key={i} className="rounded-sm"
            style={{ width: 5, height: 8 - i*1.5,
                     background: on ? '#00ffb4' : 'rgba(0,255,180,0.25)' }} />
        ))}
        <span className="text-xs ml-2" style={{ color: '#00ffb4' }}>100%</span>
      </div>
    </div>
  );
}
