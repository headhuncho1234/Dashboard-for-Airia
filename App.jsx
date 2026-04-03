import { useState, useEffect, useRef } from "react";

const AGENTS = [
  {
    id: 1,
    name: "Data Ingestion",
    shortName: "INGEST",
    description: "Guest record intake & validation",
    status: "active",
    metrics: { processed: 14875, errors: 12, latency: "42ms" },
    output: "guest_records",
  },
  {
    id: 2,
    name: "Signal Discovery",
    shortName: "SIGNAL",
    description: "Behavioral scanning & stratified sampling",
    status: "active",
    metrics: { signals: 5, segments: 3, confidence: "87%" },
    output: "ranked_signals",
  },
  {
    id: 3,
    name: "Pattern Clustering",
    shortName: "CLUSTER",
    description: "K-means behavioral grouping",
    status: "active",
    metrics: { clusters: 8, variance: "0.12", iterations: 47 },
    output: "cluster_map",
  },
  {
    id: 4,
    name: "Persona Classification",
    shortName: "PERSONA",
    description: "AI-driven guest archetype assignment",
    status: "active",
    metrics: { personas: 8, accuracy: "94%", temperature: "0.3" },
    output: "persona_tags",
  },
  {
    id: 5,
    name: "Campaign Routing",
    shortName: "ROUTE",
    description: "Deterministic channel & segment routing",
    status: "active",
    metrics: { routed: 14875, channels: 2, rules: 12 },
    output: "campaign_queue",
  },
  {
    id: 6,
    name: "Copy Generation",
    shortName: "COPY",
    description: "Persona-targeted marketing copy",
    status: "active",
    metrics: { variants: 16, temperature: "0.65", tokens: "2.4k" },
    output: "campaign_copy",
  },
  {
    id: 7,
    name: "Post-Campaign Feedback",
    shortName: "MEASURE",
    description: "Statistical performance analysis",
    status: "active",
    metrics: { lift: "19%", roi: "972.5%", confidence: "95%" },
    output: "feedback_loop",
  },
];

const PERSONAS = [
  { name: "Loyal Enthusiasts", pct: 32, channel: "EMAIL", ctr: "5.4%", color: "#00ffc8" },
  { name: "New Explorers", pct: 28, channel: "EMAIL", ctr: "2.1%", color: "#00b4ff" },
  { name: "Luxury Seekers", pct: 18, channel: "EMAIL", ctr: "8.0%", color: "#ff6b35" },
  { name: "Business Travelers", pct: 12, channel: "SLACK", ctr: "7.0%", color: "#ffd700" },
  { name: "Leisure Seekers", pct: 10, channel: "EMAIL", ctr: "4.0%", color: "#c084fc" },
];

const CAMPAIGN_STATS = {
  campaign_id: "KOA-SPRING-REAWAKENING-2026",
  pre_bookings: 12500,
  post_bookings: 14875,
  lift_pct: 19.0,
  roi_pct: 972.5,
  campaign_cost: 45000,
  attributed_revenue: 482625,
  sentiment: { positive: 482, neutral: 156, negative: 42 },
  email: { sent: 250000, delivered: 248500, opened: 62125, clicked: 8450 },
  sms: { sent: 45000, delivered: 44100, read: 38500, engaged: 5200 },
};

function useAnimatedValue(target, duration = 1200) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(ease * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target]);
  return value;
}

function Ticker({ value, suffix = "" }) {
  const animated = useAnimatedValue(value);
  return <span>{animated.toLocaleString()}{suffix}</span>;
}

function PipelineNode({ agent, index, isActive, onClick }) {
  const [pulse, setPulse] = useState(false);
  useEffect(() => {
    const interval = setInterval(() => setPulse((p) => !p), 1800 + index * 300);
    return () => clearInterval(interval);
  }, [index]);

  return (
    <div
      className={`agent-node ${isActive ? "selected" : ""}`}
      onClick={() => onClick(agent)}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="node-header">
        <span className="node-id">AG-{String(agent.id).padStart(2, "0")}</span>
        <span className={`node-status ${pulse ? "pulse" : ""}`}>●</span>
      </div>
      <div className="node-name">{agent.shortName}</div>
      <div className="node-desc">{agent.description}</div>
      <div className="node-output">→ {agent.output}</div>
      {index < AGENTS.length - 1 && <div className="flow-arrow">▼</div>}
    </div>
  );
}

function SentimentBar({ positive, neutral, negative }) {
  const total = positive + neutral + negative;
  return (
    <div className="sentiment-bar-wrap">
      <div className="sentiment-bar">
        <div style={{ width: `${(positive / total) * 100}%`, background: "#00ffc8" }} title={`Positive: ${positive}`} />
        <div style={{ width: `${(neutral / total) * 100}%`, background: "#4a5568" }} title={`Neutral: ${neutral}`} />
        <div style={{ width: `${(negative / total) * 100}%`, background: "#ff4757" }} title={`Negative: ${negative}`} />
      </div>
      <div className="sentiment-labels">
        <span style={{ color: "#00ffc8" }}>POS {Math.round((positive / total) * 100)}%</span>
        <span style={{ color: "#9ca3af" }}>NEU {Math.round((neutral / total) * 100)}%</span>
        <span style={{ color: "#ff4757" }}>NEG {Math.round((negative / total) * 100)}%</span>
      </div>
    </div>
  );
}

export default function App() {
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [tick, setTick] = useState(0);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => { setTick((x) => x + 1); setTime(new Date()); }, 1000);
    return () => clearInterval(t);
  }, []);

  const liftVal = useAnimatedValue(19);
  const roiVal = useAnimatedValue(972);
  const bookingsVal = useAnimatedValue(14875);
  const revenueVal = useAnimatedValue(482625);

  return (
    <div className="app">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Barlow+Condensed:wght@300;400;600;700&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background: #060a0f;
          color: #c9d1d9;
          font-family: 'Barlow Condensed', sans-serif;
          min-height: 100vh;
          overflow-x: hidden;
        }

        .app {
          min-height: 100vh;
          background: 
            radial-gradient(ellipse at 20% 0%, rgba(0,255,200,0.04) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 100%, rgba(0,180,255,0.04) 0%, transparent 50%),
            #060a0f;
        }

        /* HEADER */
        .header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 32px;
          border-bottom: 1px solid rgba(0,255,200,0.12);
          background: rgba(6,10,15,0.95);
          position: sticky;
          top: 0;
          z-index: 100;
          backdrop-filter: blur(8px);
        }

        .header-left { display: flex; align-items: center; gap: 16px; }

        .logo-mark {
          width: 36px; height: 36px;
          border: 1.5px solid #00ffc8;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Share Tech Mono', monospace;
          font-size: 13px;
          color: #00ffc8;
          position: relative;
        }
        .logo-mark::before {
          content: '';
          position: absolute;
          inset: -4px;
          border: 1px solid rgba(0,255,200,0.2);
        }

        .header-title {
          font-size: 22px;
          font-weight: 700;
          letter-spacing: 4px;
          text-transform: uppercase;
          color: #e6edf3;
        }
        .header-sub {
          font-size: 11px;
          letter-spacing: 3px;
          color: #00ffc8;
          text-transform: uppercase;
          font-family: 'Share Tech Mono', monospace;
        }

        .header-right {
          display: flex; align-items: center; gap: 24px;
          font-family: 'Share Tech Mono', monospace;
          font-size: 12px;
          color: #6e7681;
        }

        .live-dot {
          display: inline-flex; align-items: center; gap: 6px;
          color: #00ffc8;
        }
        .live-dot::before {
          content: '';
          width: 7px; height: 7px;
          background: #00ffc8;
          border-radius: 50%;
          display: inline-block;
          animation: livePulse 1.5s infinite;
        }
        @keyframes livePulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.7); }
        }

        /* MAIN GRID */
        .main-grid {
          display: grid;
          grid-template-columns: 220px 1fr 320px;
          gap: 0;
          min-height: calc(100vh - 65px);
        }

        /* PIPELINE SIDEBAR */
        .pipeline-sidebar {
          border-right: 1px solid rgba(0,255,200,0.08);
          padding: 24px 16px;
          display: flex;
          flex-direction: column;
          gap: 0;
          overflow-y: auto;
        }

        .sidebar-label {
          font-size: 10px;
          letter-spacing: 3px;
          color: #4a5568;
          text-transform: uppercase;
          font-family: 'Share Tech Mono', monospace;
          margin-bottom: 16px;
          padding-left: 4px;
        }

        .agent-node {
          position: relative;
          padding: 12px 14px;
          border: 1px solid rgba(0,255,200,0.08);
          background: rgba(255,255,255,0.02);
          cursor: pointer;
          transition: all 0.2s;
          animation: fadeSlideIn 0.4s both;
        }

        .agent-node:hover {
          border-color: rgba(0,255,200,0.3);
          background: rgba(0,255,200,0.04);
        }

        .agent-node.selected {
          border-color: #00ffc8;
          background: rgba(0,255,200,0.06);
        }

        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateX(-12px); }
          to { opacity: 1; transform: translateX(0); }
        }

        .node-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 4px;
        }

        .node-id {
          font-family: 'Share Tech Mono', monospace;
          font-size: 10px;
          color: #4a5568;
          letter-spacing: 1px;
        }

        .node-status {
          color: #00ffc8;
          font-size: 8px;
          transition: opacity 0.3s;
        }
        .node-status.pulse { opacity: 0.3; }

        .node-name {
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 2px;
          color: #e6edf3;
          text-transform: uppercase;
          margin-bottom: 3px;
        }

        .node-desc {
          font-size: 10px;
          color: #6e7681;
          margin-bottom: 4px;
          line-height: 1.3;
        }

        .node-output {
          font-family: 'Share Tech Mono', monospace;
          font-size: 9px;
          color: #00b4ff;
          letter-spacing: 0.5px;
        }

        .flow-arrow {
          text-align: center;
          color: rgba(0,255,200,0.2);
          font-size: 10px;
          padding: 2px 0;
          line-height: 1;
        }

        /* CENTER PANEL */
        .center-panel {
          padding: 28px 32px;
          overflow-y: auto;
        }

        .panel-title {
          font-size: 11px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #4a5568;
          font-family: 'Share Tech Mono', monospace;
          margin-bottom: 20px;
        }

        /* KPI ROW */
        .kpi-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          margin-bottom: 28px;
        }

        .kpi-card {
          border: 1px solid rgba(0,255,200,0.1);
          background: rgba(255,255,255,0.02);
          padding: 16px 18px;
          position: relative;
          overflow: hidden;
        }

        .kpi-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: var(--accent, #00ffc8);
        }

        .kpi-label {
          font-size: 9px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #6e7681;
          font-family: 'Share Tech Mono', monospace;
          margin-bottom: 8px;
        }

        .kpi-value {
          font-size: 28px;
          font-weight: 700;
          color: var(--accent, #00ffc8);
          line-height: 1;
          margin-bottom: 4px;
        }

        .kpi-sub {
          font-size: 10px;
          color: #4a5568;
          font-family: 'Share Tech Mono', monospace;
        }

        /* BOOKING LIFT */
        .lift-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 28px;
        }

        .section-card {
          border: 1px solid rgba(255,255,255,0.06);
          background: rgba(255,255,255,0.015);
          padding: 20px;
        }

        .section-card-title {
          font-size: 10px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #4a5568;
          font-family: 'Share Tech Mono', monospace;
          margin-bottom: 16px;
        }

        .booking-compare {
          display: flex;
          align-items: flex-end;
          gap: 12px;
        }

        .booking-bar-wrap { flex: 1; }

        .booking-label {
          font-size: 9px;
          color: #6e7681;
          margin-bottom: 6px;
          font-family: 'Share Tech Mono', monospace;
          letter-spacing: 1px;
        }

        .booking-bar {
          height: 8px;
          background: rgba(255,255,255,0.05);
          position: relative;
        }

        .booking-bar-fill {
          height: 100%;
          transition: width 1.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .booking-val {
          font-size: 18px;
          font-weight: 700;
          color: #e6edf3;
          margin-top: 4px;
          font-family: 'Share Tech Mono', monospace;
        }

        /* PERSONA TABLE */
        .persona-table { width: 100%; border-collapse: collapse; }

        .persona-table th {
          font-size: 9px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #4a5568;
          font-family: 'Share Tech Mono', monospace;
          text-align: left;
          padding: 0 0 10px 0;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }

        .persona-table td {
          padding: 10px 0;
          font-size: 13px;
          border-bottom: 1px solid rgba(255,255,255,0.03);
          vertical-align: middle;
        }

        .persona-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          display: inline-block;
          margin-right: 8px;
        }

        .pct-bar {
          width: 80px;
          height: 4px;
          background: rgba(255,255,255,0.05);
          display: inline-block;
          vertical-align: middle;
          margin-right: 8px;
        }

        .pct-fill {
          height: 100%;
          background: var(--color);
        }

        .channel-badge {
          font-size: 9px;
          letter-spacing: 1px;
          padding: 2px 6px;
          border: 1px solid rgba(0,180,255,0.3);
          color: #00b4ff;
          font-family: 'Share Tech Mono', monospace;
        }

        /* RIGHT PANEL */
        .right-panel {
          border-left: 1px solid rgba(0,255,200,0.08);
          padding: 24px 20px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .rp-section-title {
          font-size: 10px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #4a5568;
          font-family: 'Share Tech Mono', monospace;
          margin-bottom: 12px;
        }

        .channel-stat {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          font-size: 12px;
        }

        .channel-stat-label { color: #6e7681; font-family: 'Share Tech Mono', monospace; font-size: 10px; letter-spacing: 1px; }
        .channel-stat-val { color: #e6edf3; font-weight: 600; }

        .sentiment-bar-wrap { margin-top: 4px; }

        .sentiment-bar {
          height: 6px;
          display: flex;
          overflow: hidden;
          background: rgba(255,255,255,0.05);
          margin-bottom: 6px;
        }

        .sentiment-bar div { height: 100%; }

        .sentiment-labels {
          display: flex;
          justify-content: space-between;
          font-size: 9px;
          font-family: 'Share Tech Mono', monospace;
          letter-spacing: 1px;
        }

        /* AGENT DETAIL */
        .agent-detail {
          border: 1px solid rgba(0,255,200,0.15);
          background: rgba(0,255,200,0.03);
          padding: 16px;
        }

        .agent-detail-name {
          font-size: 16px;
          font-weight: 700;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #00ffc8;
          margin-bottom: 4px;
        }

        .agent-detail-desc {
          font-size: 11px;
          color: #6e7681;
          margin-bottom: 14px;
        }

        .metric-row {
          display: flex;
          justify-content: space-between;
          padding: 6px 0;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          font-size: 11px;
        }
        .metric-row:last-child { border-bottom: none; }
        .metric-key { color: #6e7681; font-family: 'Share Tech Mono', monospace; font-size: 10px; }
        .metric-val { color: #00ffc8; font-family: 'Share Tech Mono', monospace; font-weight: 600; }

        .close-btn {
          margin-top: 12px;
          font-size: 9px;
          letter-spacing: 2px;
          color: #4a5568;
          cursor: pointer;
          font-family: 'Share Tech Mono', monospace;
          text-transform: uppercase;
          background: none;
          border: none;
          padding: 0;
        }
        .close-btn:hover { color: #00ffc8; }

        /* FOOTER STATUS */
        .status-bar {
          position: fixed;
          bottom: 0; left: 0; right: 0;
          height: 28px;
          background: rgba(6,10,15,0.98);
          border-top: 1px solid rgba(0,255,200,0.08);
          display: flex;
          align-items: center;
          padding: 0 32px;
          gap: 32px;
          font-family: 'Share Tech Mono', monospace;
          font-size: 10px;
          color: #4a5568;
          letter-spacing: 1px;
          z-index: 200;
        }

        .status-item { display: flex; align-items: center; gap: 6px; }
        .status-ok { color: #00ffc8; }
        .status-warn { color: #ffd700; }

        @media (max-width: 900px) {
          .main-grid { grid-template-columns: 1fr; }
          .pipeline-sidebar { display: none; }
          .right-panel { border-left: none; border-top: 1px solid rgba(0,255,200,0.08); }
          .kpi-row { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>

      {/* HEADER */}
      <header className="header">
        <div className="header-left">
          <div className="logo-mark">AI</div>
          <div>
            <div className="header-title">AIRIA</div>
            <div className="header-sub">Guest Segmentation Pipeline · KOA Campgrounds</div>
          </div>
        </div>
        <div className="header-right">
          <span className="live-dot">LIVE</span>
          <span>{time.toUTCString().replace("GMT", "UTC")}</span>
          <span>7 AGENTS · ALL NOMINAL</span>
        </div>
      </header>

      {/* MAIN */}
      <div className="main-grid">

        {/* PIPELINE SIDEBAR */}
        <aside className="pipeline-sidebar">
          <div className="sidebar-label">Pipeline · AG-01 → AG-07</div>
          {AGENTS.map((agent, i) => (
            <PipelineNode
              key={agent.id}
              agent={agent}
              index={i}
              isActive={selectedAgent?.id === agent.id}
              onClick={setSelectedAgent}
            />
          ))}
        </aside>

        {/* CENTER */}
        <main className="center-panel">
          <div className="panel-title">// Campaign Performance · KOA-SPRING-REAWAKENING-2026</div>

          {/* KPIs */}
          <div className="kpi-row">
            <div className="kpi-card" style={{ "--accent": "#00ffc8" }}>
              <div className="kpi-label">Booking Lift</div>
              <div className="kpi-value"><Ticker value={liftVal} suffix="%" /></div>
              <div className="kpi-sub">19.0% · p=0.000 · 95% CI</div>
            </div>
            <div className="kpi-card" style={{ "--accent": "#ff6b35" }}>
              <div className="kpi-label">ROI</div>
              <div className="kpi-value"><Ticker value={roiVal} suffix="%" /></div>
              <div className="kpi-sub">$45k cost · $482k revenue</div>
            </div>
            <div className="kpi-card" style={{ "--accent": "#00b4ff" }}>
              <div className="kpi-label">Post Bookings</div>
              <div className="kpi-value"><Ticker value={bookingsVal} /></div>
              <div className="kpi-sub">vs 12,500 pre-campaign</div>
            </div>
            <div className="kpi-card" style={{ "--accent": "#ffd700" }}>
              <div className="kpi-label">Attributed Rev</div>
              <div className="kpi-value">$<Ticker value={revenueVal} /></div>
              <div className="kpi-sub">factor 0.70 applied</div>
            </div>
          </div>

          {/* LIFT + SENTIMENT */}
          <div className="lift-section">
            <div className="section-card">
              <div className="section-card-title">// Booking Window Comparison</div>
              <div className="booking-compare">
                <div className="booking-bar-wrap">
                  <div className="booking-label">PRE-CAMPAIGN</div>
                  <div className="booking-bar">
                    <div className="booking-bar-fill" style={{ width: `${(12500 / 14875) * 100}%`, background: "rgba(0,255,200,0.3)" }} />
                  </div>
                  <div className="booking-val">12,500</div>
                </div>
                <div className="booking-bar-wrap">
                  <div className="booking-label">POST-CAMPAIGN</div>
                  <div className="booking-bar">
                    <div className="booking-bar-fill" style={{ width: "100%", background: "#00ffc8" }} />
                  </div>
                  <div className="booking-val" style={{ color: "#00ffc8" }}>14,875</div>
                </div>
              </div>
            </div>

            <div className="section-card">
              <div className="section-card-title">// Guest Sentiment · Post-Campaign</div>
              <SentimentBar
                positive={CAMPAIGN_STATS.sentiment.positive}
                neutral={CAMPAIGN_STATS.sentiment.neutral}
                negative={CAMPAIGN_STATS.sentiment.negative}
              />
              <div style={{ marginTop: 14, display: "flex", gap: 16 }}>
                <div>
                  <div className="kpi-label">POSITIVE</div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: "#00ffc8" }}>482</div>
                </div>
                <div>
                  <div className="kpi-label">NEUTRAL</div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: "#9ca3af" }}>156</div>
                </div>
                <div>
                  <div className="kpi-label">NEGATIVE</div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: "#ff4757" }}>42</div>
                </div>
              </div>
            </div>
          </div>

          {/* PERSONA TABLE */}
          <div className="section-card">
            <div className="section-card-title">// Guest Persona Performance</div>
            <table className="persona-table">
              <thead>
                <tr>
                  <th>Persona</th>
                  <th>Share</th>
                  <th>Channel</th>
                  <th>CTR</th>
                  <th>Open Rate</th>
                </tr>
              </thead>
              <tbody>
                {PERSONAS.map((p) => (
                  <tr key={p.name}>
                    <td>
                      <span className="persona-dot" style={{ background: p.color }} />
                      {p.name}
                    </td>
                    <td>
                      <div className="pct-bar" style={{ "--color": p.color }}>
                        <div className="pct-fill" style={{ width: `${p.pct * 2}%` }} />
                      </div>
                      <span style={{ fontSize: 11, color: "#9ca3af", fontFamily: "Share Tech Mono, monospace" }}>{p.pct}%</span>
                    </td>
                    <td><span className="channel-badge">{p.channel}</span></td>
                    <td style={{ fontFamily: "Share Tech Mono, monospace", color: p.color, fontSize: 12 }}>{p.ctr}</td>
                    <td style={{ fontFamily: "Share Tech Mono, monospace", color: "#9ca3af", fontSize: 12 }}>
                      {p.name === "Loyal Enthusiasts" ? "32%" : p.name === "New Explorers" ? "18%" : p.name === "Luxury Seekers" ? "32%" : p.name === "Business Travelers" ? "28%" : "18%"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>

        {/* RIGHT PANEL */}
        <aside className="right-panel">

          {/* AGENT DETAIL */}
          {selectedAgent ? (
            <div className="agent-detail">
              <div className="agent-detail-name">AG-{String(selectedAgent.id).padStart(2, "0")} · {selectedAgent.name}</div>
              <div className="agent-detail-desc">{selectedAgent.description}</div>
              {Object.entries(selectedAgent.metrics).map(([k, v]) => (
                <div className="metric-row" key={k}>
                  <span className="metric-key">{k.toUpperCase()}</span>
                  <span className="metric-val">{v}</span>
                </div>
              ))}
              <div className="metric-row">
                <span className="metric-key">OUTPUT</span>
                <span className="metric-val" style={{ color: "#00b4ff" }}>{selectedAgent.output}</span>
              </div>
              <button className="close-btn" onClick={() => setSelectedAgent(null)}>[ close ]</button>
            </div>
          ) : (
            <div style={{ fontSize: 10, color: "#4a5568", fontFamily: "Share Tech Mono, monospace", letterSpacing: 1 }}>
              ← SELECT AGENT TO INSPECT
            </div>
          )}

          {/* EMAIL CHANNEL */}
          <div>
            <div className="rp-section-title">// Email Channel</div>
            {[
              ["SENT", CAMPAIGN_STATS.email.sent.toLocaleString()],
              ["DELIVERED", CAMPAIGN_STATS.email.delivered.toLocaleString()],
              ["OPENED", CAMPAIGN_STATS.email.opened.toLocaleString()],
              ["CLICKED", CAMPAIGN_STATS.email.clicked.toLocaleString()],
              ["OPEN RATE", "25.0%"],
              ["CTR", "3.4%"],
            ].map(([label, val]) => (
              <div className="channel-stat" key={label}>
                <span className="channel-stat-label">{label}</span>
                <span className="channel-stat-val">{val}</span>
              </div>
            ))}
          </div>

          {/* SMS CHANNEL */}
          <div>
            <div className="rp-section-title">// SMS Channel</div>
            {[
              ["SENT", CAMPAIGN_STATS.sms.sent.toLocaleString()],
              ["DELIVERED", CAMPAIGN_STATS.sms.delivered.toLocaleString()],
              ["READ", CAMPAIGN_STATS.sms.read.toLocaleString()],
              ["ENGAGED", CAMPAIGN_STATS.sms.engaged.toLocaleString()],
              ["READ RATE", "87.3%"],
              ["ENGAGE RATE", "11.6%"],
            ].map(([label, val]) => (
              <div className="channel-stat" key={label}>
                <span className="channel-stat-label">{label}</span>
                <span className="channel-stat-val">{val}</span>
              </div>
            ))}
          </div>

          {/* STATISTICAL VALIDITY */}
          <div>
            <div className="rp-section-title">// Statistical Validity</div>
            {[
              ["TEST", "TWO-SAMPLE T-TEST"],
              ["P-VALUE", "0.000"],
              ["CONFIDENCE", "95%"],
              ["CI LOWER", "16.17%"],
              ["CI UPPER", "21.83%"],
              ["NPS CORR", "r = 1.000"],
            ].map(([label, val]) => (
              <div className="channel-stat" key={label}>
                <span className="channel-stat-label">{label}</span>
                <span className="channel-stat-val" style={{ color: "#00ffc8", fontSize: 11 }}>{val}</span>
              </div>
            ))}
          </div>

        </aside>
      </div>

      {/* STATUS BAR */}
      <div className="status-bar">
        <span className="status-item"><span className="status-ok">●</span> ALL AGENTS NOMINAL</span>
        <span className="status-item"><span className="status-ok">●</span> MEMORY STORE ACTIVE</span>
        <span className="status-item"><span className="status-warn">●</span> KOA TOOLS PENDING LANDON</span>
        <span className="status-item">EXEC ID: b4f8540e-0ef8-477b-903f</span>
        <span style={{ marginLeft: "auto" }}>AIRIA GUEST SEGMENTATION PIPELINE v1.0 · GSU CIS-8010</span>
      </div>
    </div>
  );
}
