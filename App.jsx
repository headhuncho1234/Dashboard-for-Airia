import { useState, useEffect, useRef } from "react";

const THEME = {
  dark: {
    bg: "linear-gradient(135deg, #0a0e1a 0%, #0d1321 40%, #111827 100%)",
    bgOrb1: "radial-gradient(ellipse at 20% 10%, rgba(245,158,11,0.08) 0%, transparent 50%)",
    bgOrb2: "radial-gradient(ellipse at 80% 80%, rgba(59,130,246,0.06) 0%, transparent 50%)",
    bgOrb3: "radial-gradient(ellipse at 60% 20%, rgba(16,185,129,0.04) 0%, transparent 40%)",
    glass: "rgba(255,255,255,0.04)",
    glassBorder: "rgba(255,255,255,0.08)",
    glassHover: "rgba(255,255,255,0.07)",
    glassStrong: "rgba(255,255,255,0.06)",
    text: "#f1f5f9",
    textSub: "#94a3b8",
    textMuted: "#475569",
    accent: "#f59e0b",
    accentGlow: "rgba(245,158,11,0.15)",
    accentSub: "#d97706",
    blue: "#3b82f6",
    green: "#10b981",
    red: "#ef4444",
    purple: "#8b5cf6",
    navBg: "rgba(10,14,26,0.85)",
    cardBg: "rgba(255,255,255,0.04)",
    headerBorder: "rgba(255,255,255,0.07)",
  },
  light: {
    bg: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 40%, #e2e8f0 100%)",
    bgOrb1: "radial-gradient(ellipse at 20% 10%, rgba(245,158,11,0.12) 0%, transparent 50%)",
    bgOrb2: "radial-gradient(ellipse at 80% 80%, rgba(59,130,246,0.08) 0%, transparent 50%)",
    bgOrb3: "radial-gradient(ellipse at 60% 20%, rgba(16,185,129,0.06) 0%, transparent 40%)",
    glass: "rgba(255,255,255,0.65)",
    glassBorder: "rgba(255,255,255,0.9)",
    glassHover: "rgba(255,255,255,0.8)",
    glassStrong: "rgba(255,255,255,0.75)",
    text: "#0f172a",
    textSub: "#475569",
    textMuted: "#94a3b8",
    accent: "#d97706",
    accentGlow: "rgba(217,119,6,0.12)",
    accentSub: "#b45309",
    blue: "#2563eb",
    green: "#059669",
    red: "#dc2626",
    purple: "#7c3aed",
    navBg: "rgba(248,250,252,0.9)",
    cardBg: "rgba(255,255,255,0.65)",
    headerBorder: "rgba(0,0,0,0.07)",
  }
};

const SIGNALS = [
  { rank: 1, name: "Cancellation & churn acceleration", volume: "307,670 cancels in 2025", yoy: "-31.9%", revenue: "$3.9M recoverable", actionability: "Immediate", trend: -32, color: "#ef4444" },
  { rank: 2, name: "KampStore upsell velocity decline", volume: "11.2M transactions", yoy: "-14.2%", revenue: "$7.3M erosion", actionability: "Immediate", trend: -14, color: "#f59e0b" },
  { rank: 3, name: "Loyalty depth imbalance", volume: "54.1% one-time guests", yoy: "-22.3% guest base", revenue: "$73.6M opportunity", actionability: "Short-term", trend: -22, color: "#8b5cf6" },
  { rank: 4, name: "Cabin RevPAR premium", volume: "271K cabin reservations", yoy: "+4.3% ADR", revenue: "$96.5M potential", actionability: "Short-term", trend: 4, color: "#10b981" },
  { rank: 5, name: "Guest base erosion", volume: "1.08M unique guests 2025", yoy: "-22.3% since 2022", revenue: "$140M LTV at risk", actionability: "Immediate", trend: -22, color: "#ef4444" },
];

const AGENTS = [
  { id: 1, name: "Data processing", short: "RFM", desc: "Guest segmentation & RFM analysis", status: "complete", color: "#10b981", metrics: { guests: "500+", segments: 10, source: "KampSightDB + VDW" } },
  { id: 2, name: "Signal discovery", short: "SIGNAL", desc: "Behavioral signal ranking", status: "complete", color: "#10b981", metrics: { signals: 5, reservations: "10.9M", campgrounds: 518 } },
  { id: 3, name: "Pattern clustering", short: "CLUSTER", desc: "K-means behavioral grouping", status: "complete", color: "#10b981", metrics: { clusters: 6, method: "K-means + DBSCAN", silhouette: "1.0" } },
  { id: 4, name: "Persona synthesis", short: "PERSONA", desc: "AI-driven guest archetype assignment", status: "complete", color: "#10b981", metrics: { personas: 8, confidence: "High × 4", ready: "8 / 8" } },
  { id: 5, name: "Master orchestrator", short: "ORCH", desc: "Campaign coordination & routing", status: "pending", color: "#f59e0b", metrics: { personas: 8, priority_high: 3, next: "Agent 6" } },
  { id: 6, name: "Campaign execution", short: "EXEC", desc: "Channel dispatch & copy generation", status: "pending", color: "#475569", metrics: { channels: 2, variants: "TBD", launch: "Pending" } },
  { id: 7, name: "Feedback loop", short: "MEASURE", desc: "Statistical performance analysis", status: "historical", color: "#3b82f6", metrics: { lift: "19%", roi: "972.5%", confidence: "95%" } },
];

const PERSONAS = [
  { id: "P1", name: "Loyal enthusiasts", tagline: "The heart of the yellow sign", channel: "Mobile App", confidence: "High", color: "#f59e0b", icon: "★", strategy: "Early access booking windows + KampStore credits" },
  { id: "P2", name: "New explorers", tagline: "Discovering the great outdoors", channel: "Instagram/FB", confidence: "High", color: "#3b82f6", icon: "◎", strategy: "First-stay discount + New Camper welcome kit" },
  { id: "P3", name: "Luxury seekers", tagline: "Comfort without compromise", channel: "Email (visual)", confidence: "High", color: "#8b5cf6", icon: "◆", strategy: "Resort-tier invitations + cabin upsell" },
  { id: "P4", name: "Business travelers", tagline: "The mobile office", channel: "LinkedIn/SEM", confidence: "High", color: "#10b981", icon: "▣", strategy: "Mid-week corporate rates + WiFi bundle" },
  { id: "P5", name: "Leisure seekers", tagline: "Relaxation is the priority", channel: "Direct mail", confidence: "Medium", color: "#06b6d4", icon: "◉", strategy: "3-night packages + seasonal event alerts" },
  { id: "P6", name: "Family campers", tagline: "Making memories together", channel: "YouTube/Pinterest", confidence: "Medium", color: "#ec4899", icon: "♦", strategy: "Activity bundles + kids birthday rewards" },
  { id: "P7", name: "Adventure seekers", tagline: "Basecamp for discovery", channel: "AllTrails/Apps", confidence: "Medium", color: "#84cc16", icon: "▲", strategy: "Minimalist basecamp rates + National Park promo" },
  { id: "P8", name: "Budget campers", tagline: "Value-driven travel", channel: "Search/Price comp", confidence: "Medium", color: "#f97316", icon: "●", strategy: "Fill-a-Site discounts + VKR Stay 10 Get 1" },
];

const LOYALTY = [
  { tier: "Champion (11+ stays)", count: "142,609", pct: 4.7, nights: "8.76M nights", nightPct: 22.3, color: "#f59e0b" },
  { tier: "Loyal (6–10 stays)", count: "211,660", pct: 7.0, nights: "7.2M nights", nightPct: 18.3, color: "#10b981" },
  { tier: "Repeat (3–5 stays)", count: "501,769", pct: 16.6, nights: "11.5M nights", nightPct: 29.3, color: "#3b82f6" },
  { tier: "Returning (2 stays)", count: "533,012", pct: 17.6, nights: "4.8M nights", nightPct: 12.2, color: "#8b5cf6" },
  { tier: "First-timer (1 stay)", count: "1,636,131", pct: 54.1, nights: "4.9M nights", nightPct: 12.5, color: "#ef4444" },
];

function useAnimatedCounter(target, duration = 1500, delay = 0) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    const timeout = setTimeout(() => {
      let start = null;
      const step = (ts) => {
        if (!start) start = ts;
        const prog = Math.min((ts - start) / duration, 1);
        const ease = 1 - Math.pow(1 - prog, 4);
        setVal(Math.floor(ease * target));
        if (prog < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, delay);
    return () => clearTimeout(timeout);
  }, [target, duration, delay]);
  return val;
}

function GlassCard({ children, style = {}, className = "", onClick, hover = true }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className={`glass-card ${className}`}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "var(--glass)",
        border: "1px solid var(--glass-border)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderRadius: 16,
        transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
        transform: hover && hovered ? "translateY(-1px)" : "none",
        boxShadow: hovered ? "0 8px 32px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.1)" : "0 4px 16px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.06)",
        cursor: onClick ? "pointer" : "default",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function StatPill({ label, value, delta, color }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <span style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 500 }}>{label}</span>
      <span style={{ fontSize: 22, fontWeight: 700, color: color || "var(--text)", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{value}</span>
      {delta && <span style={{ fontSize: 11, color: delta.startsWith("+") || delta.includes("972") ? "var(--green)" : "var(--red)", fontWeight: 600 }}>{delta}</span>}
    </div>
  );
}

function AgentDot({ status }) {
  const colors = { complete: "#10b981", pending: "#f59e0b", historical: "#3b82f6" };
  return (
    <span style={{
      display: "inline-block", width: 8, height: 8, borderRadius: "50%",
      background: colors[status] || "#475569",
      boxShadow: `0 0 6px ${colors[status] || "#475569"}`,
      animation: status === "pending" ? "pulse 2s infinite" : "none",
    }} />
  );
}

export default function App() {
  const [dark, setDark] = useState(true);
  const [activeSection, setActiveSection] = useState("overview");
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [time, setTime] = useState(new Date());
  const t = dark ? THEME.dark : THEME.light;

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const reservations = useAnimatedCounter(10893242, 2000, 200);
  const roi = useAnimatedCounter(972, 1800, 400);
  const revenue = useAnimatedCounter(482625, 2200, 600);
  const lift = useAnimatedCounter(19, 1500, 300);
  const vkr = useAnimatedCounter(655022, 2000, 500);
  const campgrounds = useAnimatedCounter(518, 1200, 100);

  const nav = [
    { id: "overview", label: "Overview" },
    { id: "signals", label: "Signals" },
    { id: "pipeline", label: "Pipeline" },
    { id: "personas", label: "Personas" },
    { id: "campaign", label: "Campaign" },
    { id: "loyalty", label: "Loyalty" },
  ];

  return (
    <div style={{
      minHeight: "100vh",
      background: t.bg,
      color: t.text,
      fontFamily: "'DM Sans', 'Inter', system-ui, sans-serif",
      "--glass": t.glass,
      "--glass-border": t.glassBorder,
      "--glass-hover": t.glassHover,
      "--glass-strong": t.glassStrong,
      "--text": t.text,
      "--text-sub": t.textSub,
      "--text-muted": t.textMuted,
      "--accent": t.accent,
      "--accent-glow": t.accentGlow,
      "--blue": t.blue,
      "--green": t.green,
      "--red": t.red,
      "--purple": t.purple,
      position: "relative",
      overflow: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { overflow-x: hidden; }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.8)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideIn { from{opacity:0;transform:translateX(-12px)} to{opacity:1;transform:translateX(0)} }
        @keyframes glow { 0%,100%{opacity:0.6} 50%{opacity:1} }
        .fade-up { animation: fadeUp 0.5s cubic-bezier(0.4,0,0.2,1) both; }
        .glass-card:hover { background: var(--glass-hover) !important; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 2px; }
        .nav-item { transition: all 0.2s; }
        .nav-item:hover { color: var(--accent) !important; }
        .nav-item.active { color: var(--accent) !important; }
        .signal-bar { transition: width 1.2s cubic-bezier(0.4,0,0.2,1); }
        .toggle-btn { transition: all 0.2s; }
        .toggle-btn:hover { transform: scale(1.05); }
        .persona-card { transition: all 0.25s cubic-bezier(0.4,0,0.2,1); }
        .persona-card:hover { transform: translateY(-3px) !important; }
        .section-fade { animation: fadeUp 0.4s cubic-bezier(0.4,0,0.2,1) both; }
      `}</style>

      {/* Background orbs */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div style={{ position: "absolute", inset: 0, background: t.bgOrb1 }} />
        <div style={{ position: "absolute", inset: 0, background: t.bgOrb2 }} />
        <div style={{ position: "absolute", inset: 0, background: t.bgOrb3 }} />
      </div>

      {/* HEADER */}
      <header style={{
        position: "sticky", top: 0, zIndex: 100,
        background: t.navBg,
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderBottom: `1px solid ${t.headerBorder}`,
        padding: "0 32px",
        height: 60,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10,
            background: `linear-gradient(135deg, ${t.accent}, ${t.accentSub})`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 14, fontWeight: 700, color: "#fff",
            boxShadow: `0 4px 12px ${t.accentGlow}`,
          }}>K</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: "0.02em", color: t.text }}>KOA Analytics</div>
            <div style={{ fontSize: 10, color: t.textMuted, letterSpacing: "0.06em" }}>GUEST SEGMENTATION · GSU CIS-8010</div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ display: "flex", gap: 4 }}>
          {nav.map(n => (
            <button key={n.id}
              className={`nav-item ${activeSection === n.id ? "active" : ""}`}
              onClick={() => setActiveSection(n.id)}
              style={{
                background: activeSection === n.id ? t.accentGlow : "transparent",
                border: activeSection === n.id ? `1px solid ${t.accent}30` : "1px solid transparent",
                borderRadius: 8,
                padding: "6px 14px",
                fontSize: 13,
                fontWeight: activeSection === n.id ? 600 : 400,
                color: activeSection === n.id ? t.accent : t.textSub,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >{n.label}</button>
          ))}
        </nav>

        {/* Right controls */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: t.textMuted, fontFamily: "'DM Mono', monospace" }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: t.green, display: "inline-block", animation: "pulse 2s infinite", boxShadow: `0 0 6px ${t.green}` }} />
            {time.toLocaleTimeString("en-US", { hour12: false })} UTC
          </div>
          <button className="toggle-btn" onClick={() => setDark(!dark)} style={{
            width: 36, height: 36, borderRadius: 10,
            background: t.glass, border: `1px solid ${t.glassBorder}`,
            cursor: "pointer", fontSize: 16,
            display: "flex", alignItems: "center", justifyContent: "center",
            backdropFilter: "blur(12px)",
          }}>{dark ? "☀️" : "🌙"}</button>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main style={{ position: "relative", zIndex: 1, padding: "28px 32px 60px", maxWidth: 1400, margin: "0 auto" }}>

        {/* ── OVERVIEW ── */}
        {activeSection === "overview" && (
          <div className="section-fade">
            <div style={{ marginBottom: 8 }}>
              <h1 style={{ fontSize: 26, fontWeight: 700, color: t.text, letterSpacing: "-0.02em" }}>KOA Guest Intelligence Dashboard</h1>
              <p style={{ fontSize: 13, color: t.textSub, marginTop: 4 }}>7-agent Airia pipeline · 10.9M reservations · 518 campgrounds · 2022–2026 YTD</p>
            </div>

            {/* Hero KPI strip */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 12, margin: "24px 0" }}>
              {[
                { label: "Reservations analyzed", val: reservations.toLocaleString(), delta: "2022–2026 YTD", color: t.accent },
                { label: "Campaign ROI", val: `${roi}%`, delta: "+972.5% vs $45K cost", color: t.green },
                { label: "Attributed revenue", val: `$${(revenue / 1000).toFixed(0)}K`, delta: "KOA-SPRING-2026", color: t.accent },
                { label: "Booking lift", val: `${lift}%`, delta: "p=0.000 · 95% CI", color: t.blue },
                { label: "VKR members", val: vkr.toLocaleString(), delta: "BASE · BONUS · VIP", color: t.purple },
                { label: "Campgrounds", val: campgrounds.toLocaleString(), delta: "Active network", color: t.green },
              ].map((kpi, i) => (
                <GlassCard key={kpi.label} style={{ padding: "18px 16px", animationDelay: `${i * 0.07}s` }} className="fade-up">
                  <div style={{ fontSize: 10, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10, fontWeight: 500 }}>{kpi.label}</div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: kpi.color, letterSpacing: "-0.02em", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{kpi.val}</div>
                  <div style={{ fontSize: 11, color: t.textMuted, marginTop: 6 }}>{kpi.delta}</div>
                </GlassCard>
              ))}
            </div>

            {/* Pipeline status strip */}
            <GlassCard style={{ padding: "20px 24px", marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <h2 style={{ fontSize: 14, fontWeight: 600, color: t.text }}>Pipeline status</h2>
                <span style={{ fontSize: 11, color: t.green, fontWeight: 600 }}>4 / 7 complete · 2 pending · 1 historical</span>
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                {AGENTS.map((a, i) => (
                  <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
                    <div
                      onClick={() => setSelectedAgent(selectedAgent?.id === a.id ? null : a)}
                      style={{
                        flex: 1, padding: "10px 12px", borderRadius: 10,
                        background: selectedAgent?.id === a.id ? t.accentGlow : t.glass,
                        border: `1px solid ${selectedAgent?.id === a.id ? t.accent + "50" : t.glassBorder}`,
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                        <AgentDot status={a.status} />
                        <span style={{ fontSize: 10, fontWeight: 700, color: t.accent, fontFamily: "'DM Mono', monospace", letterSpacing: "0.06em" }}>{a.short}</span>
                      </div>
                      <div style={{ fontSize: 11, color: t.textSub, lineHeight: 1.3 }}>{a.name}</div>
                    </div>
                    {i < AGENTS.length - 1 && (
                      <div style={{ color: t.textMuted, fontSize: 12, flexShrink: 0 }}>→</div>
                    )}
                  </div>
                ))}
              </div>
              {selectedAgent && (
                <div style={{ marginTop: 16, padding: "14px 16px", borderRadius: 10, background: t.accentGlow, border: `1px solid ${t.accent}30` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: t.accent, marginBottom: 2 }}>Agent {selectedAgent.id}: {selectedAgent.name}</div>
                      <div style={{ fontSize: 11, color: t.textSub }}>{selectedAgent.desc}</div>
                    </div>
                    <button onClick={() => setSelectedAgent(null)} style={{ background: "none", border: "none", color: t.textMuted, cursor: "pointer", fontSize: 16 }}>×</button>
                  </div>
                  <div style={{ display: "flex", gap: 20, marginTop: 10 }}>
                    {Object.entries(selectedAgent.metrics).map(([k, v]) => (
                      <div key={k}>
                        <div style={{ fontSize: 10, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.06em" }}>{k}</div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: t.text, fontFamily: "'DM Mono', monospace" }}>{v}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </GlassCard>

            {/* Bottom row: top signals + persona preview */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <GlassCard style={{ padding: "20px 24px" }}>
                <h2 style={{ fontSize: 14, fontWeight: 600, color: t.text, marginBottom: 16 }}>Top signals · Agent 2</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {SIGNALS.slice(0, 3).map(s => (
                    <div key={s.rank} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 20, height: 20, borderRadius: 6, background: s.color + "20", border: `1px solid ${s.color}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: s.color, flexShrink: 0 }}>{s.rank}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 12, fontWeight: 500, color: t.text, marginBottom: 3 }}>{s.name}</div>
                        <div style={{ height: 4, background: t.glassBorder, borderRadius: 2, overflow: "hidden" }}>
                          <div className="signal-bar" style={{ height: "100%", width: `${Math.abs(s.trend) * 3}%`, background: s.color, borderRadius: 2 }} />
                        </div>
                      </div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: s.color, fontFamily: "'DM Mono', monospace", flexShrink: 0 }}>{s.yoy}</div>
                    </div>
                  ))}
                </div>
                <button onClick={() => setActiveSection("signals")} style={{ marginTop: 14, fontSize: 12, color: t.accent, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", padding: 0 }}>View all 5 signals →</button>
              </GlassCard>

              <GlassCard style={{ padding: "20px 24px" }}>
                <h2 style={{ fontSize: 14, fontWeight: 600, color: t.text, marginBottom: 16 }}>Campaign performance · KOA-SPRING-2026</h2>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  {[
                    { label: "Pre bookings", val: "12,500", color: t.textSub },
                    { label: "Post bookings", val: "14,875", color: t.green },
                    { label: "Email sent", val: "250,000", color: t.blue },
                    { label: "SMS read rate", val: "87.3%", color: t.accent },
                  ].map(m => (
                    <div key={m.label} style={{ padding: "10px 12px", borderRadius: 10, background: t.glass, border: `1px solid ${t.glassBorder}` }}>
                      <div style={{ fontSize: 10, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>{m.label}</div>
                      <div style={{ fontSize: 18, fontWeight: 700, color: m.color, fontVariantNumeric: "tabular-nums" }}>{m.val}</div>
                    </div>
                  ))}
                </div>
                <button onClick={() => setActiveSection("campaign")} style={{ marginTop: 14, fontSize: 12, color: t.accent, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", padding: 0 }}>Full campaign breakdown →</button>
              </GlassCard>
            </div>
          </div>
        )}

        {/* ── SIGNALS ── */}
        {activeSection === "signals" && (
          <div className="section-fade">
            <div style={{ marginBottom: 24 }}>
              <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em" }}>Signal intelligence · Agent 2</h1>
              <p style={{ fontSize: 13, color: t.textSub, marginTop: 4 }}>10.9M reservations · 1.2M cancellations · 11.2M KampStore transactions · 655K VKR members</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {SIGNALS.map((s, i) => (
                <GlassCard key={s.rank} style={{ padding: "22px 26px", animationDelay: `${i * 0.08}s` }} className="fade-up">
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 12, background: s.color + "15", border: `1px solid ${s.color}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 800, color: s.color, flexShrink: 0 }}>{s.rank}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                        <h3 style={{ fontSize: 15, fontWeight: 600, color: t.text }}>{s.name}</h3>
                        <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 20, background: s.actionability === "Immediate" ? "#ef444420" : "#f59e0b20", color: s.actionability === "Immediate" ? "#ef4444" : "#f59e0b", fontWeight: 600, border: `1px solid ${s.actionability === "Immediate" ? "#ef444430" : "#f59e0b30"}` }}>{s.actionability}</span>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 12 }}>
                        <div>
                          <div style={{ fontSize: 10, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 2 }}>Volume</div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: t.text }}>{s.volume}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: 10, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 2 }}>YoY trend</div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: s.color, fontFamily: "'DM Mono', monospace" }}>{s.yoy}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: 10, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 2 }}>Revenue impact</div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: t.green }}>{s.revenue}</div>
                        </div>
                      </div>
                      <div style={{ height: 6, background: t.glassBorder, borderRadius: 3, overflow: "hidden" }}>
                        <div className="signal-bar" style={{ height: "100%", width: `${Math.min(Math.abs(s.trend) * 4, 90)}%`, background: `linear-gradient(90deg, ${s.color}, ${s.color}80)`, borderRadius: 3 }} />
                      </div>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>

            {/* Data gaps */}
            <GlassCard style={{ padding: "20px 24px", marginTop: 16, border: `1px solid #f59e0b30`, background: "#f59e0b08" }}>
              <h3 style={{ fontSize: 13, fontWeight: 600, color: t.accent, marginBottom: 12 }}>Data gaps — retry before next pipeline run</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {["NPS/K2Rating timed out — 1.66M survey responses unquantified", "CancellationDate NULL on all 1.2M cancellations — lead-time blocked", "ZingleStaging SMS empty — check-in friction unquantified", "VKR enrollment dates appear legacy — new member trend unreliable"].map(g => (
                  <div key={g} style={{ display: "flex", gap: 8, fontSize: 12, color: t.textSub }}>
                    <span style={{ color: t.accent, flexShrink: 0 }}>·</span> {g}
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        )}

        {/* ── PIPELINE ── */}
        {activeSection === "pipeline" && (
          <div className="section-fade">
            <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 6 }}>Pipeline · 7-agent Airia workflow</h1>
            <p style={{ fontSize: 13, color: t.textSub, marginBottom: 24 }}>KampSightDB · VDW · Airia Memory · Vercel deployment</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {AGENTS.map((a, i) => (
                <GlassCard key={a.id} className="fade-up" style={{ padding: "20px 24px", animationDelay: `${i * 0.07}s` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: a.color + "15", border: `1px solid ${a.color}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: a.color, flexShrink: 0, fontFamily: "'DM Mono', monospace" }}>AG-0{a.id}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                        <h3 style={{ fontSize: 14, fontWeight: 600, color: t.text }}>{a.name}</h3>
                        <AgentDot status={a.status} />
                        <span style={{ fontSize: 11, color: a.color, fontWeight: 600, textTransform: "capitalize" }}>{a.status}</span>
                      </div>
                      <p style={{ fontSize: 12, color: t.textSub }}>{a.desc}</p>
                    </div>
                    <div style={{ display: "flex", gap: 16 }}>
                      {Object.entries(a.metrics).map(([k, v]) => (
                        <div key={k} style={{ textAlign: "right" }}>
                          <div style={{ fontSize: 10, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.06em" }}>{k}</div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: t.text, fontFamily: "'DM Mono', monospace" }}>{v}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
            <GlassCard style={{ padding: "16px 24px", marginTop: 16 }}>
              <div style={{ display: "flex", gap: 32, fontSize: 12, color: t.textSub }}>
                <div><span style={{ color: t.green, marginRight: 6 }}>●</span>Complete — real KOA data loaded</div>
                <div><span style={{ color: t.accent, marginRight: 6 }}>●</span>Pending — awaiting pipeline run</div>
                <div><span style={{ color: t.blue, marginRight: 6 }}>●</span>Historical — benchmark data</div>
                <div style={{ marginLeft: "auto", fontFamily: "'DM Mono', monospace" }}>Memory keys: Agent 1–4 wired · Store → {'{output}'}</div>
              </div>
            </GlassCard>
          </div>
        )}

        {/* ── PERSONAS ── */}
        {activeSection === "personas" && (
          <div className="section-fade">
            <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 6 }}>Guest personas · Agent 4</h1>
            <p style={{ fontSize: 13, color: t.textSub, marginBottom: 24 }}>8 personas · all campaign ready · human approval recommended</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
              {PERSONAS.map((p, i) => (
                <GlassCard key={p.id} className="persona-card fade-up" style={{ padding: "20px", animationDelay: `${i * 0.06}s`, cursor: "default" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: p.color + "20", border: `1px solid ${p.color}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, color: p.color }}>{p.icon}</div>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: t.accent, fontFamily: "'DM Mono', monospace", letterSpacing: "0.04em" }}>{p.id}</div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: t.text }}>{p.name}</div>
                    </div>
                  </div>
                  <p style={{ fontSize: 11, color: t.textSub, fontStyle: "italic", marginBottom: 10 }}>{p.tagline}</p>
                  <div style={{ fontSize: 11, color: t.textSub, marginBottom: 8 }}>
                    <span style={{ color: t.textMuted }}>Channel: </span>
                    <span style={{ color: t.text, fontWeight: 500 }}>{p.channel}</span>
                  </div>
                  <div style={{ fontSize: 11, color: t.textSub, marginBottom: 12, lineHeight: 1.5 }}>{p.strategy}</div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 20, background: p.confidence === "High" ? "#10b98120" : "#f59e0b20", color: p.confidence === "High" ? t.green : t.accent, fontWeight: 600, border: `1px solid ${p.confidence === "High" ? "#10b98130" : "#f59e0b30"}` }}>{p.confidence}</span>
                    <span style={{ fontSize: 10, color: t.green, fontWeight: 600 }}>● Ready</span>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        )}

        {/* ── CAMPAIGN ── */}
        {activeSection === "campaign" && (
          <div className="section-fade">
            <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 6 }}>Campaign performance</h1>
            <p style={{ fontSize: 13, color: t.textSub, marginBottom: 24 }}>KOA-SPRING-REAWAKENING-2026 · Two-sample t-test · p=0.000 · 95% CI [16.17%, 21.83%]</p>

            {/* Big KPI row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 20 }}>
              {[
                { label: "Booking lift", val: "19.0%", sub: "2,375 incremental bookings", color: t.green },
                { label: "ROI", val: "972.5%", sub: "$45K cost → $482.6K revenue", color: t.accent },
                { label: "Pre-campaign", val: "12,500", sub: "Baseline bookings", color: t.textSub },
                { label: "Post-campaign", val: "14,875", sub: "Achieved bookings", color: t.blue },
              ].map(m => (
                <GlassCard key={m.label} style={{ padding: "22px 20px" }}>
                  <div style={{ fontSize: 10, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>{m.label}</div>
                  <div style={{ fontSize: 30, fontWeight: 700, color: m.color, letterSpacing: "-0.02em", fontVariantNumeric: "tabular-nums" }}>{m.val}</div>
                  <div style={{ fontSize: 11, color: t.textMuted, marginTop: 6 }}>{m.sub}</div>
                </GlassCard>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
              {/* Email */}
              <GlassCard style={{ padding: "22px 20px" }}>
                <h3 style={{ fontSize: 13, fontWeight: 600, color: t.text, marginBottom: 14 }}>Email channel</h3>
                {[["Sent", "250,000"], ["Delivered", "248,500"], ["Opened", "62,125"], ["Clicked", "8,450"], ["Open rate", "25.0%"], ["CTR", "3.4%"]].map(([k, v]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: `1px solid ${t.glassBorder}`, fontSize: 12 }}>
                    <span style={{ color: t.textSub }}>{k}</span>
                    <span style={{ fontWeight: 600, color: t.text, fontFamily: "'DM Mono', monospace" }}>{v}</span>
                  </div>
                ))}
              </GlassCard>

              {/* SMS */}
              <GlassCard style={{ padding: "22px 20px" }}>
                <h3 style={{ fontSize: 13, fontWeight: 600, color: t.text, marginBottom: 14 }}>SMS channel</h3>
                {[["Sent", "45,000"], ["Delivered", "44,100"], ["Read", "38,500"], ["Engaged", "5,200"], ["Read rate", "87.3%"], ["Engage rate", "11.6%"]].map(([k, v]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: `1px solid ${t.glassBorder}`, fontSize: 12 }}>
                    <span style={{ color: t.textSub }}>{k}</span>
                    <span style={{ fontWeight: 600, color: t.text, fontFamily: "'DM Mono', monospace" }}>{v}</span>
                  </div>
                ))}
              </GlassCard>

              {/* Sentiment + stat validity */}
              <GlassCard style={{ padding: "22px 20px" }}>
                <h3 style={{ fontSize: 13, fontWeight: 600, color: t.text, marginBottom: 14 }}>Sentiment & validity</h3>
                <div style={{ marginBottom: 16 }}>
                  {[{ label: "Positive", val: 482, pct: 71, color: t.green }, { label: "Neutral", val: 156, pct: 23, color: t.textSub }, { label: "Negative", val: 42, pct: 6, color: t.red }].map(s => (
                    <div key={s.label} style={{ marginBottom: 8 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 4 }}>
                        <span style={{ color: s.color, fontWeight: 500 }}>{s.label}</span>
                        <span style={{ color: t.textSub, fontFamily: "'DM Mono', monospace" }}>{s.val} ({s.pct}%)</span>
                      </div>
                      <div style={{ height: 4, background: t.glassBorder, borderRadius: 2 }}>
                        <div style={{ height: "100%", width: `${s.pct}%`, background: s.color, borderRadius: 2, transition: "width 1s ease" }} />
                      </div>
                    </div>
                  ))}
                </div>
                {[["Test", "Two-sample t-test"], ["p-value", "0.000"], ["CI lower", "16.17%"], ["CI upper", "21.83%"]].map(([k, v]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", fontSize: 11 }}>
                    <span style={{ color: t.textMuted }}>{k}</span>
                    <span style={{ color: t.green, fontWeight: 600, fontFamily: "'DM Mono', monospace" }}>{v}</span>
                  </div>
                ))}
              </GlassCard>
            </div>
          </div>
        )}

        {/* ── LOYALTY ── */}
        {activeSection === "loyalty" && (
          <div className="section-fade">
            <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 6 }}>Loyalty intelligence · VKR program</h1>
            <p style={{ fontSize: 13, color: t.textSub, marginBottom: 24 }}>3.025M unique guests · 655K VKR members · 2022–2025 · -22.3% guest base decline</p>

            {/* VKR tiers */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 20 }}>
              {[
                { tier: "VIP", count: "47,695", points: "30,836 avg", color: t.accent },
                { tier: "BONUS", count: "101,649", points: "Mid-tier", color: t.blue },
                { tier: "BASE", count: "231,993", points: "6,512 avg", color: t.green },
                { tier: "Untiered (active)", count: "276,080", points: "Enrolled, no tier", color: t.textSub },
              ].map(v => (
                <GlassCard key={v.tier} style={{ padding: "20px" }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: v.color, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>{v.tier}</div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: t.text, fontVariantNumeric: "tabular-nums" }}>{v.count}</div>
                  <div style={{ fontSize: 11, color: t.textMuted, marginTop: 4 }}>{v.points}</div>
                </GlassCard>
              ))}
            </div>

            {/* Stay loyalty breakdown */}
            <GlassCard style={{ padding: "24px 26px", marginBottom: 16 }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: t.text, marginBottom: 16 }}>Guest loyalty depth by stay count</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {LOYALTY.map(l => (
                  <div key={l.tier} style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <div style={{ width: 180, fontSize: 12, color: t.textSub, flexShrink: 0 }}>{l.tier}</div>
                    <div style={{ flex: 1, position: "relative" }}>
                      <div style={{ height: 8, background: t.glassBorder, borderRadius: 4, overflow: "hidden" }}>
                        <div className="signal-bar" style={{ height: "100%", width: `${l.pct * 1.5}%`, background: `linear-gradient(90deg, ${l.color}, ${l.color}80)`, borderRadius: 4 }} />
                      </div>
                    </div>
                    <div style={{ width: 70, textAlign: "right", fontSize: 12, fontWeight: 700, color: l.color, fontFamily: "'DM Mono', monospace", flexShrink: 0 }}>{l.count}</div>
                    <div style={{ width: 40, textAlign: "right", fontSize: 11, color: t.textMuted, fontFamily: "'DM Mono', monospace", flexShrink: 0 }}>{l.pct}%</div>
                    <div style={{ width: 100, textAlign: "right", fontSize: 11, color: t.textSub, flexShrink: 0 }}>{l.nights}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 16, padding: "12px 16px", borderRadius: 10, background: t.accentGlow, border: `1px solid ${t.accent}30`, fontSize: 12, color: t.textSub }}>
                <strong style={{ color: t.accent }}>Champion insight:</strong> 4.7% of guests (142,609) generate 22.3% of all camper nights (8.76M). Losing this segment is an existential threat — average 61 nights per guest career.
              </div>
            </GlassCard>

            {/* Guest erosion */}
            <GlassCard style={{ padding: "24px 26px" }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: t.text, marginBottom: 16 }}>Unique guest erosion · 2022–2025</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
                {[{ year: "2022", guests: "1,385,840", color: t.green }, { year: "2023", guests: "1,249,244", color: t.blue }, { year: "2024", guests: "1,159,492", color: t.accent }, { year: "2025", guests: "1,076,186", color: t.red }].map(y => (
                  <div key={y.year} style={{ padding: "16px", borderRadius: 12, background: y.color + "10", border: `1px solid ${y.color}25` }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: y.color, marginBottom: 6 }}>{y.year}</div>
                    <div style={{ fontSize: 20, fontWeight: 700, color: t.text, fontVariantNumeric: "tabular-nums" }}>{y.guests}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 14, display: "flex", gap: 8, alignItems: "center", fontSize: 12, color: t.red }}>
                <span style={{ fontWeight: 700, fontFamily: "'DM Mono', monospace" }}>-22.3%</span>
                <span style={{ color: t.textSub }}>decline from 2022 to 2025 · at current -8%/yr rate → sub-1M unique guests by 2027 without intervention</span>
              </div>
            </GlassCard>
          </div>
        )}
      </main>

      {/* Footer status bar */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0, height: 32,
        background: t.navBg, backdropFilter: "blur(24px)",
        borderTop: `1px solid ${t.headerBorder}`,
        display: "flex", alignItems: "center",
        padding: "0 32px", gap: 28,
        fontSize: 10, color: t.textMuted, fontFamily: "'DM Mono', monospace",
        letterSpacing: "0.04em", zIndex: 100,
      }}>
        <span style={{ color: t.green }}>● ALL AGENTS NOMINAL</span>
        <span>EXEC: KOA-SPRING-REAWAKENING-2026</span>
        <span>MEMORY: Agent 1–4 wired</span>
        <span>10.9M reservations · 518 campgrounds · 655K VKR</span>
        <span style={{ marginLeft: "auto" }}>AIRIA GUEST SEGMENTATION PIPELINE v2.0 · GSU CIS-8010</span>
      </div>
    </div>
  );
}
