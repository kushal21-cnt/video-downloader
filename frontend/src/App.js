
import React, { useState, useEffect } from "react";
 
const styles = {
  root: {
    minHeight: "100vh",
    background: "#0b1628",
    color: "#e2e8f0",
    fontFamily: "'DM Sans', system-ui, sans-serif",
    position: "relative",
    overflowX: "hidden",
  },
  // Brighter layered glows
  glow1: {
    position: "fixed", top: "-10%", left: "-8%",
    width: "65%", height: "65%",
    background: "radial-gradient(circle, rgba(37,99,235,0.22) 0%, transparent 65%)",
    pointerEvents: "none", zIndex: 0,
  },
  glow2: {
    position: "fixed", bottom: "-10%", right: "-8%",
    width: "60%", height: "60%",
    background: "radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 65%)",
    pointerEvents: "none", zIndex: 0,
  },
  glow3: {
    position: "fixed", top: "40%", left: "50%",
    transform: "translateX(-50%)",
    width: "50%", height: "40%",
    background: "radial-gradient(ellipse, rgba(59,130,246,0.07) 0%, transparent 70%)",
    pointerEvents: "none", zIndex: 0,
  },
  // Dot-grid overlay
  gridOverlay: {
    position: "fixed", inset: 0,
    backgroundImage: "radial-gradient(circle, rgba(148,163,184,0.12) 1px, transparent 1px)",
    backgroundSize: "32px 32px",
    pointerEvents: "none", zIndex: 0,
  },
  // Grain overlay via SVG filter
  grainOverlay: {
    position: "fixed", inset: 0,
    opacity: 0.025,
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
    backgroundRepeat: "repeat",
    backgroundSize: "128px 128px",
    pointerEvents: "none", zIndex: 0,
  },
  inner: {
    position: "relative", zIndex: 1,
    maxWidth: 860, margin: "0 auto",
    padding: "28px 24px 64px",
  },
  nav: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    marginBottom: 52,
  },
  logoWrap: { display: "flex", alignItems: "center", gap: 10 },
  logoIcon: {
    width: 40, height: 40,
    background: "linear-gradient(135deg, #2563eb, #6366f1)",
    borderRadius: 12,
    display: "flex", alignItems: "center", justifyContent: "center",
    boxShadow: "0 0 20px rgba(99,102,241,0.35)",
  },
  logoText: {
    fontWeight: 800, fontSize: 18, letterSpacing: "-0.5px", color: "#fff",
  },
  logoAccent: { color: "#3b82f6" },
  navLinks: {
    display: "flex", alignItems: "center", gap: 24,
    fontSize: 13, fontWeight: 500,
  },
  navLink: { color: "#64748b", textDecoration: "none", cursor: "pointer" },
  navPill: {
    padding: "6px 18px",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 999,
    background: "rgba(255,255,255,0.05)",
    cursor: "pointer", color: "#94a3b8", fontSize: 13,
  },
  hero: { textAlign: "center", marginBottom: 40 },
  badge: {
    display: "inline-flex", alignItems: "center", gap: 6,
    padding: "5px 14px",
    border: "1px solid rgba(59,130,246,0.3)",
    borderRadius: 999,
    background: "rgba(59,130,246,0.08)",
    color: "#60a5fa",
    fontSize: 10, fontWeight: 700,
    letterSpacing: "0.2em", textTransform: "uppercase",
    marginBottom: 20,
    boxShadow: "0 0 14px rgba(59,130,246,0.15)",
  },
  h1: {
    fontWeight: 800, fontSize: "clamp(36px, 7vw, 64px)",
    lineHeight: 1.0, letterSpacing: "-2px",
    color: "#fff", marginBottom: 16,
  },
  h1Sub: { color: "#2d4a6b" },
  sub: {
    color: "#4e6380", fontSize: 16, fontWeight: 300,
    maxWidth: 460, margin: "0 auto", lineHeight: 1.7,
  },
  inputWrap: {
    maxWidth: 700, margin: "0 auto 32px",
    background: "rgba(15,30,55,0.8)",
    border: "1px solid rgba(255,255,255,0.10)",
    borderRadius: 22,
    display: "flex", alignItems: "center",
    padding: "6px 6px 6px 20px",
    gap: 12,
    backdropFilter: "blur(8px)",
    transition: "border-color 0.2s, box-shadow 0.2s",
    boxShadow: "0 4px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.05)",
  },
  input: {
    flex: 1, background: "transparent", border: "none", outline: "none",
    color: "#e2e8f0", fontSize: 15,
    padding: "12px 0",
  },
  extractBtn: {
    background: "#fff", color: "#0f172a",
    border: "none", borderRadius: 16,
    padding: "14px 28px",
    fontWeight: 700, fontSize: 15,
    cursor: "pointer",
    display: "flex", alignItems: "center", gap: 8,
    whiteSpace: "nowrap",
    transition: "background 0.2s, transform 0.1s",
  },
  extractBtnDisabled: {
    background: "#fff", color: "#0f172a",
    border: "none", borderRadius: 16,
    padding: "14px 28px",
    fontWeight: 700, fontSize: 15,
    cursor: "not-allowed", opacity: 0.25,
    display: "flex", alignItems: "center", gap: 8,
  },
  errorBox: {
    maxWidth: 700, margin: "0 auto 24px",
    background: "rgba(239,68,68,0.06)",
    border: "1px solid rgba(239,68,68,0.2)",
    borderRadius: 14, padding: "14px 18px",
    color: "#f87171", fontSize: 14, fontWeight: 500,
    display: "flex", alignItems: "center", gap: 10,
  },
  tags: {
    display: "flex", justifyContent: "center", gap: 28,
    opacity: 0.25, fontSize: 13, color: "#94a3b8",
    marginBottom: 48,
  },
  tag: { display: "flex", alignItems: "center", gap: 6 },
  card: {
    maxWidth: 700, margin: "0 auto 56px",
    background: "rgba(10,20,42,0.9)",
    border: "1px solid rgba(255,255,255,0.09)",
    borderRadius: 28, overflow: "hidden",
    boxShadow: "0 8px 48px rgba(0,0,0,0.5), 0 0 0 1px rgba(59,130,246,0.06)",
    backdropFilter: "blur(12px)",
  },
  cardGrid: {
    display: "grid", gridTemplateColumns: "200px 1fr",
  },
  thumbWrap: {
    position: "relative", minHeight: 220,
    background: "#0f1f3a", overflow: "hidden",
  },
  thumbImg: { width: "100%", height: "100%", objectFit: "cover", display: "block" },
  thumbOverlay: {
    position: "absolute", inset: 0,
    background: "linear-gradient(to right, transparent 50%, rgba(10,20,42,0.95))",
  },
  duration: {
    position: "absolute", bottom: 12, left: 12,
    background: "rgba(0,0,0,0.8)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 999, padding: "3px 10px",
    fontSize: 11, fontWeight: 700, letterSpacing: "0.05em", color: "#e2e8f0",
  },
  cardBody: { padding: 28, display: "flex", flexDirection: "column", justifyContent: "center" },
  cardTitle: {
    fontWeight: 700, fontSize: 22, color: "#fff",
    lineHeight: 1.2, letterSpacing: "-0.5px",
    marginBottom: 20,
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },
  meta: { display: "flex", alignItems: "center", gap: 12, marginBottom: 24 },
  metaIcon: {
    width: 36, height: 36, borderRadius: "50%",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.09)",
    display: "flex", alignItems: "center", justifyContent: "center",
    color: "#3b82f6",
  },
  metaLabel: {
    fontSize: 9, color: "#475569", fontWeight: 700,
    textTransform: "uppercase", letterSpacing: "0.15em",
  },
  metaVal: { fontSize: 13, color: "#cbd5e1", fontWeight: 500 },
  dlBtn: {
    width: "100%",
    background: "#2563eb", color: "#fff",
    border: "none", borderRadius: 16, padding: 18,
    fontSize: 16, fontWeight: 700,
    cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
    marginBottom: 12,
    boxShadow: "0 4px 20px rgba(37,99,235,0.35)",
    transition: "background 0.2s, transform 0.1s, box-shadow 0.2s",
  },
  dlBtnDisabled: {
    width: "100%",
    background: "#1e293b", color: "#475569",
    border: "none", borderRadius: 16, padding: 18,
    fontSize: 16, fontWeight: 700,
    cursor: "not-allowed",
    display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
    marginBottom: 12,
  },
  safeRow: {
    display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
    fontSize: 11, color: "#334155", fontWeight: 600,
    textTransform: "uppercase", letterSpacing: "0.1em",
  },
  safeDot: { width: 6, height: 6, borderRadius: "50%", background: "#10b981" },
  features: {
    maxWidth: 700, margin: "0 auto 48px",
    display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16,
  },
  feat: {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 18, padding: 20, textAlign: "center",
    backdropFilter: "blur(6px)",
  },
  featTitle: {
    fontSize: 11, fontWeight: 700, color: "#94a3b8",
    textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 6,
  },
  featDesc: { fontSize: 12, color: "#3d5066", lineHeight: 1.6 },
  footer: {
    textAlign: "center",
    paddingTop: 24,
    borderTop: "1px solid rgba(255,255,255,0.06)",
  },
};
 
// Helper: one leaf at a given point, rotated to angle (degrees)
const Leaf = ({ x, y, angle = 0, rx = 11, ry = 6 }) => (
  <ellipse
    cx={x} cy={y} rx={rx} ry={ry}
    transform={`rotate(${angle},${x},${y})`}
    fill="none"
  />
);
 
// One hanging vine with leaves — pass an array of leaf descriptors
const Vine = ({ d, leaves }) => (
  <g>
    <path d={d} fill="none" />
    {leaves.map((l, i) => <Leaf key={i} {...l} />)}
  </g>
);
 
// Full-screen background matching the reference photo
const CatVineBackground = () => (
  <svg
    style={{
      position: "fixed", inset: 0, width: "100%", height: "100%",
      pointerEvents: "none", zIndex: 0,
    }}
    viewBox="0 0 1320 860"
    preserveAspectRatio="xMidYMid slice"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    stroke="rgba(180,200,230,0.45)"
    strokeWidth="1.3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* ── VINE 1 — far left ── */}
    <Vine
      d="M42,0 Q18,80 52,180 Q82,270 38,380 Q4,470 48,580 Q80,660 44,780 Q30,820 20,860"
      leaves={[
        { x:22, y:70,  angle:-40, rx:13, ry:6 },
        { x:58, y:130, angle:30,  rx:11, ry:5 },
        { x:30, y:210, angle:-50, rx:12, ry:6 },
        { x:68, y:290, angle:25,  rx:10, ry:5 },
        { x:22, y:370, angle:-45, rx:13, ry:6 },
        { x:58, y:450, angle:35,  rx:11, ry:5 },
        { x:30, y:540, angle:-40, rx:12, ry:6 },
        { x:62, y:630, angle:30,  rx:10, ry:5 },
        { x:28, y:720, angle:-50, rx:11, ry:5 },
      ]}
    />
 
    {/* ── VINE 2 — left-center-left ── */}
    <Vine
      d="M195,0 Q175,90 205,200 Q230,300 195,410 Q168,500 200,600 Q222,680 195,780 Q182,830 175,860"
      leaves={[
        { x:178, y:55,  angle:-35, rx:12, ry:6 },
        { x:212, y:130, angle:40,  rx:13, ry:6 },
        { x:180, y:230, angle:-45, rx:11, ry:5 },
        { x:218, y:320, angle:30,  rx:12, ry:6 },
        { x:175, y:420, angle:-40, rx:13, ry:6 },
        { x:210, y:510, angle:35,  rx:11, ry:5 },
        { x:180, y:600, angle:-35, rx:12, ry:6 },
        { x:212, y:690, angle:28,  rx:10, ry:5 },
        { x:178, y:770, angle:-45, rx:11, ry:5 },
      ]}
    />
 
    {/* ── VINE 3 — left-of-center ── */}
    <Vine
      d="M340,0 Q318,100 348,195 Q372,280 338,390 Q310,480 342,575 Q362,650 338,760 Q325,810 318,860"
      leaves={[
        { x:322, y:65,  angle:-40, rx:12, ry:6 },
        { x:358, y:150, angle:38,  rx:11, ry:5 },
        { x:325, y:250, angle:-42, rx:13, ry:6 },
        { x:358, y:340, angle:32,  rx:11, ry:5 },
        { x:320, y:440, angle:-38, rx:12, ry:6 },
        { x:355, y:530, angle:35,  rx:11, ry:5 },
        { x:325, y:620, angle:-40, rx:12, ry:6 },
        { x:352, y:715, angle:28,  rx:10, ry:5 },
      ]}
    />
 
    {/* ── CAT — centered, back view, sitting ── */}
    <g transform="translate(660,430)">
      {/* Tail — curling around to the right then front */}
      <path d="M-30,180 Q-70,200 -60,240 Q-50,270 0,275 Q40,278 50,265 Q60,252 30,248" strokeWidth="1.5" />
      {/* Body outline */}
      <path d="M-65,60 Q-80,120 -72,175 Q-65,210 -30,230 Q0,245 30,230 Q65,210 72,175 Q80,120 65,60" strokeWidth="1.5"/>
      {/* Left shoulder curve */}
      <path d="M-65,60 Q-72,40 -58,20" strokeWidth="1.4"/>
      {/* Right shoulder curve */}
      <path d="M65,60 Q72,40 58,20" strokeWidth="1.4"/>
      {/* Neck */}
      <path d="M-58,20 Q-30,10 0,10 Q30,10 58,20" strokeWidth="1.4"/>
      {/* Head */}
      <path d="M-58,20 Q-70,-10 -52,-50 Q-38,-80 0,-85 Q38,-80 52,-50 Q70,-10 58,20" strokeWidth="1.5"/>
      {/* Left ear */}
      <path d="M-52,-50 Q-62,-80 -38,-72" strokeWidth="1.4"/>
      {/* Right ear */}
      <path d="M52,-50 Q62,-80 38,-72" strokeWidth="1.4"/>
      {/* Subtle spine line */}
      <path d="M0,-82 Q4,0 2,170" strokeWidth="0.7" stroke="rgba(180,200,230,0.2)"/>
    </g>
 
    {/* ── VINE 4 — right-of-center ── */}
    <Vine
      d="M978,0 Q958,95 990,190 Q1015,275 980,385 Q952,470 984,568 Q1005,645 978,755 Q965,808 958,860"
      leaves={[
        { x:962, y:62,  angle:-38, rx:12, ry:6 },
        { x:998, y:148, angle:40,  rx:11, ry:5 },
        { x:964, y:248, angle:-42, rx:13, ry:6 },
        { x:996, y:338, angle:32,  rx:11, ry:5 },
        { x:960, y:438, angle:-38, rx:12, ry:6 },
        { x:994, y:528, angle:35,  rx:11, ry:5 },
        { x:962, y:618, angle:-40, rx:12, ry:6 },
        { x:992, y:712, angle:28,  rx:10, ry:5 },
      ]}
    />
 
    {/* ── VINE 5 — right-center-right ── */}
    <Vine
      d="M1122,0 Q1100,88 1132,195 Q1158,295 1122,408 Q1095,496 1128,598 Q1150,675 1122,778 Q1110,830 1102,860"
      leaves={[
        { x:1106, y:55,  angle:-36, rx:12, ry:6 },
        { x:1142, y:138, angle:40,  rx:13, ry:6 },
        { x:1108, y:238, angle:-44, rx:11, ry:5 },
        { x:1142, y:328, angle:30,  rx:12, ry:6 },
        { x:1105, y:428, angle:-40, rx:13, ry:6 },
        { x:1140, y:518, angle:35,  rx:11, ry:5 },
        { x:1108, y:608, angle:-35, rx:12, ry:6 },
        { x:1140, y:698, angle:28,  rx:10, ry:5 },
        { x:1105, y:775, angle:-45, rx:11, ry:5 },
      ]}
    />
 
    {/* ── VINE 6 — far right ── */}
    <Vine
      d="M1278,0 Q1255,82 1288,178 Q1315,268 1278,380 Q1248,466 1282,576 Q1305,658 1278,775 Q1265,822 1255,860"
      leaves={[
        { x:1262, y:62,  angle:-38, rx:13, ry:6 },
        { x:1296, y:140, angle:36,  rx:11, ry:5 },
        { x:1264, y:235, angle:-44, rx:12, ry:6 },
        { x:1298, y:318, angle:32,  rx:11, ry:5 },
        { x:1260, y:415, angle:-40, rx:13, ry:6 },
        { x:1295, y:508, angle:34,  rx:11, ry:5 },
        { x:1262, y:598, angle:-38, rx:12, ry:6 },
        { x:1295, y:688, angle:30,  rx:10, ry:5 },
        { x:1260, y:775, angle:-44, rx:12, ry:6 },
      ]}
    />
  </svg>
);
 
// --- Floating orb decoration ---
const FloatingOrbs = () => (
  <svg
    style={{ position: "fixed", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0 }}
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <radialGradient id="orb-a" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.18" />
        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="orb-b" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#6366f1" stopOpacity="0.14" />
        <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="orb-c" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.10" />
        <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0" />
      </radialGradient>
    </defs>
    <ellipse cx="8%" cy="15%" rx="280" ry="220" fill="url(#orb-a)" />
    <ellipse cx="92%" cy="80%" rx="260" ry="200" fill="url(#orb-b)" />
    <ellipse cx="55%" cy="50%" rx="200" ry="160" fill="url(#orb-c)" />
    <circle cx="90%" cy="12%" r="72" fill="none" stroke="rgba(99,102,241,0.10)" strokeWidth="1" />
    <circle cx="90%" cy="12%" r="48" fill="none" stroke="rgba(99,102,241,0.08)" strokeWidth="0.8" />
    <circle cx="7%" cy="85%" r="55" fill="none" stroke="rgba(59,130,246,0.09)" strokeWidth="1" />
    <circle cx="7%" cy="85%" r="35" fill="none" stroke="rgba(59,130,246,0.07)" strokeWidth="0.8" />
  </svg>
);
 
// --- Horizontal rule with shimmer center dot ---
const ShimmerDivider = () => (
  <div style={{ display: "flex", alignItems: "center", gap: 12, maxWidth: 700, margin: "0 auto 48px" }}>
    <div style={{ flex: 1, height: "1px", background: "linear-gradient(to right, transparent, rgba(255,255,255,0.07))" }} />
    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(99,102,241,0.5)", boxShadow: "0 0 8px rgba(99,102,241,0.6)" }} />
    <div style={{ flex: 1, height: "1px", background: "linear-gradient(to left, transparent, rgba(255,255,255,0.07))" }} />
  </div>
);
 
const SpinnerIcon = () => (
  <svg style={{ animation: "spin 1s linear infinite" }} width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
    <path d="M21 12a9 9 0 11-6.219-8.56" />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </svg>
);
 
const DownloadIcon = ({ size = 20 }) => (
  <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M12 5v10M8 15l4 4 4-4M4 18h16" />
  </svg>
);
 
const LinkIcon = () => (
  <svg width="20" height="20" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" style={{ opacity: 0.5, flexShrink: 0 }}>
    <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
  </svg>
);
 
const AlertIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);
 
const UserIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
);
 
export default function App() {
  const [url, setUrl] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState("");
 
  const fetchInfo = async () => {
    if (!url) return;
    setLoading(true);
    setError("");
    setData(null);
    try {
      const res = await fetch(`http://localhost:5050/info?url=${encodeURIComponent(url)}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "The server is currently processing high traffic. Please check the URL.");
      setData(json);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
 
  const downloadVideo = () => {
    if (!url) return;
    setDownloading(true);
    const link = document.createElement("a");
    link.href = `http://localhost:5050/download?url=${encodeURIComponent(url)}`;
    link.setAttribute("download", "video.mp4");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => setDownloading(false), 4500);
  };
 
  const formatDuration = (seconds) => {
    if (!seconds) return "";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };
 
  return (
    <div style={styles.root}>
      {/* Background layers */}
      <div style={styles.glow1} />
      <div style={styles.glow2} />
      <div style={styles.glow3} />
      <div style={styles.gridOverlay} />
      <div style={styles.grainOverlay} />
      <FloatingOrbs />
      <CatVineBackground />
 
      <div style={styles.inner}>
        {/* Nav */}
        <nav style={styles.nav}>
          <div style={styles.logoWrap}>
            <div style={styles.logoIcon}>
              <DownloadIcon size={20} />
            </div>
            <span style={styles.logoText}>
              Video<span style={styles.logoAccent}>Downloader</span>
            </span>
          </div>
          <div style={styles.navLinks}>
            <a style={styles.navLink} href="#">API</a>
            <a style={styles.navLink} href="#">Enterprise</a>
            <span style={styles.navPill}>Log In</span>
          </div>
        </nav>
 
        {/* Hero */}
        <div style={styles.hero}>
          <div style={styles.badge}>
            ✦ Encrypted Extraction Protocol
          </div>
          <h1 style={styles.h1}>
            Universal Media<br />
            <span style={styles.h1Sub}>High-Speed Downloader</span>
          </h1>
          <p style={styles.sub}>
            The industry standard for high-fidelity media archival. Secure, lightning-fast, and compatible with all major platforms.
          </p>
        </div>
 
        {/* Input */}
        <div style={styles.inputWrap}>
          <LinkIcon />
          <input
            style={styles.input}
            type="text"
            placeholder="Enter URL from YouTube, Instagram, Twitter…"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchInfo()}
          />
          <button
            style={loading || !url ? styles.extractBtnDisabled : styles.extractBtn}
            onClick={fetchInfo}
            disabled={loading || !url}
          >
            {loading ? <SpinnerIcon /> : <>Extract →</>}
          </button>
        </div>
 
        {/* Error */}
        {error && (
          <div style={styles.errorBox}>
            <AlertIcon />
            {error}
          </div>
        )}
 
        {/* Faded platform tags */}
        <div style={styles.tags}>
          <span style={styles.tag}>📱 Mobile</span>
          <span style={styles.tag}>💻 Desktop</span>
          <span style={styles.tag}>⭐ 4K Content</span>
        </div>
 
        {/* Result card */}
        {data && !loading && (
          <div style={styles.card}>
            <div style={styles.cardGrid}>
              <div style={styles.thumbWrap}>
                {data.thumbnail ? (
                  <>
                    <img src={data.thumbnail} alt="Video preview" style={styles.thumbImg} />
                    <div style={styles.thumbOverlay} />
                  </>
                ) : (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#1e293b" }}>
                    <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <rect x="2" y="2" width="20" height="20" rx="2" /><polygon points="10 8 16 12 10 16 10 8" />
                    </svg>
                  </div>
                )}
                {data.duration && (
                  <span style={styles.duration}>{formatDuration(data.duration)}</span>
                )}
              </div>
 
              <div style={styles.cardBody}>
                <div style={styles.cardTitle}>{data.title}</div>
                <div style={styles.meta}>
                  <div style={styles.metaIcon}><UserIcon /></div>
                  <div>
                    <div style={styles.metaLabel}>Creator</div>
                    <div style={styles.metaVal}>{data.uploader || "Verified Partner"}</div>
                  </div>
                </div>
                <button
                  style={downloading ? styles.dlBtnDisabled : styles.dlBtn}
                  onClick={downloadVideo}
                  disabled={downloading}
                >
                  {downloading ? <><SpinnerIcon /> Rendering File…</> : <><DownloadIcon /> High-Res Download</>}
                </button>
                <div style={styles.safeRow}>
                  <div style={styles.safeDot} />
                  No Compression Artifacts Guaranteed
                </div>
              </div>
            </div>
          </div>
        )}
 
        <ShimmerDivider />
 
        {/* Features */}
        <div style={styles.features}>
          {[
            { color: "#3b82f6", bg: "rgba(59,130,246,0.10)", icon: "⚡", title: "Instant Extract", desc: "Multithreaded extraction bypassing global throttling." },
            { color: "#6366f1", bg: "rgba(99,102,241,0.10)", icon: "✓", title: "Pure Fidelity", desc: "Bit-for-bit archival with support for 8K streams." },
            { color: "#10b981", bg: "rgba(16,185,129,0.10)", icon: "◎", title: "Zero Tracking", desc: "Ephemeral requests. No user data ever logged." },
          ].map((f) => (
            <div key={f.title} style={styles.feat}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: f.bg, color: f.color, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", fontSize: 18, boxShadow: `0 0 16px ${f.bg}` }}>
                {f.icon}
              </div>
              <div style={styles.featTitle}>{f.title}</div>
              <div style={styles.featDesc}>{f.desc}</div>
            </div>
          ))}
        </div>
 
        {/* Footer */}
        <div style={styles.footer}>
          <p style={{ fontSize: 18, fontWeight: 700, color: "#e2e8f0", marginBottom: 12, letterSpacing: "-0.3px" }}>
            VideoDownloader
          </p>
          <p style={{ fontSize: 13, color: "#2d4055", maxWidth: 520, margin: "0 auto 20px", lineHeight: 1.8 }}>
            Built for creators, archivists, and researchers who demand the highest quality media preservation. Our platform supports hundreds of video sources with zero compromise on fidelity or privacy.
          </p>
          <p style={{ fontSize: 13, color: "#1e3045", maxWidth: 480, margin: "0 auto 20px", lineHeight: 1.8 }}>
            All transfers are encrypted end-to-end. We do not store, log, or analyze any URLs or media you process through our service. Your sessions are fully ephemeral and deleted immediately after use.
          </p>
          <p style={{ fontSize: 13, color: "#1e3045", maxWidth: 480, margin: "0 auto 32px", lineHeight: 1.8 }}>
            For enterprise licensing, bulk API access, or custom integrations, reach out to our team. We offer SLA-backed infrastructure for organizations processing at scale.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: 32, marginBottom: 28, fontSize: 12, color: "#2d4055" }}>
            <a href="#" style={{ color: "#2d4055", textDecoration: "none" }}>Privacy Policy</a>
            <a href="#" style={{ color: "#2d4055", textDecoration: "none" }}>Terms of Service</a>
            <a href="#" style={{ color: "#2d4055", textDecoration: "none" }}>API Docs</a>
            <a href="#" style={{ color: "#2d4055", textDecoration: "none" }}>Contact</a>
          </div>
          <p style={{ fontSize: 11, color: "#1e3045", fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase" }}>
            © 2026 VideoDownloader Enterprise Division
          </p>
        </div>
      </div>
    </div>
  );
}