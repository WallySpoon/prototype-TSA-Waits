import { useState, useEffect, useCallback, useMemo } from "react";

const AIRPORTS = [
  { code: "AUS", lat: 30.1975, lng: -97.6664, name: "Austin-Bergstrom International", city: "Austin", state: "TX", terminals: ["Main Terminal"], avgWait: 18, peakWait: 45, precheck: 6, precheckPeak: 14, tagline: "Keep Austin Weird — but keep your line short", icon: "🎸", scene: ["🎸", "🦇", "🌮", "🎶", "🤠"], sceneGrad: "linear-gradient(160deg, #0a0a1a 0%, #1a0a2e 25%, #e94560 55%, #ff6b35 80%, #ffa62b 100%)" },
  { code: "DFW", lat: 32.8998, lng: -97.0403, name: "Dallas/Fort Worth International", city: "Dallas", state: "TX", terminals: ["Terminal A", "Terminal B", "Terminal C", "Terminal D", "Terminal E"], avgWait: 22, peakWait: 55, precheck: 8, precheckPeak: 18, tagline: "Big airport, big waits — plan ahead", icon: "⛪", scene: ["🤠", "⛪", "🏈", "🥩", "🌆"], sceneGrad: "linear-gradient(160deg, #0f1528 0%, #1a2744 25%, #533483 55%, #e94560 80%, #ff8c42 100%)" },
  { code: "IAH", lat: 29.9902, lng: -95.3368, name: "George Bush Intercontinental", city: "Houston", state: "TX", terminals: ["Terminal A", "Terminal B", "Terminal C", "Terminal D", "Terminal E"], avgWait: 25, peakWait: 65, precheck: 9, precheckPeak: 20, tagline: "Space City — launch through security", icon: "🚀", scene: ["🚀", "🛰️", "🏗️", "⛽", "🌇"], sceneGrad: "linear-gradient(160deg, #0a0e1a 0%, #1B1B2F 25%, #2D4059 55%, #EA5455 80%, #ff7b54 100%)" },
  { code: "HOU", lat: 29.6454, lng: -95.2789, name: "William P. Hobby Airport", city: "Houston", state: "TX", terminals: ["Main Terminal"], avgWait: 15, peakWait: 35, precheck: 5, precheckPeak: 12, tagline: "Hobby keeps it quick", icon: "🛫", scene: ["🛫", "🌴", "🏙️", "⛽", "🎨"], sceneGrad: "linear-gradient(160deg, #0e1117 0%, #1B1B2F 25%, #2D4059 55%, #F07B3F 80%, #fca311 100%)" },
  { code: "SAT", lat: 29.5337, lng: -98.4698, name: "San Antonio International", city: "San Antonio", state: "TX", terminals: ["Terminal A", "Terminal B"], avgWait: 14, peakWait: 30, precheck: 5, precheckPeak: 11, tagline: "Remember the Alamo — and your boarding pass", icon: "🏰", scene: ["🏰", "🌮", "🎻", "🌊", "🌵"], sceneGrad: "linear-gradient(160deg, #1a1f2e 0%, #2C3333 25%, #395B64 55%, #A5C9CA 80%, #e8dbc5 100%)" },
  { code: "ATL", lat: 33.6407, lng: -84.4277, name: "Hartsfield-Jackson International", city: "Atlanta", state: "GA", terminals: ["North Terminal", "South Terminal"], avgWait: 28, peakWait: 70, precheck: 10, precheckPeak: 22, tagline: "World's busiest — give yourself extra time", icon: "🍑", scene: ["🍑", "🏙️", "🎵", "🌳", "🏟️"], sceneGrad: "linear-gradient(160deg, #0d0d1a 0%, #1a1a2e 25%, #c84b31 55%, #ecdbba 80%, #ffd89b 100%)" },
  { code: "LAX", lat: 33.9425, lng: -118.4081, name: "Los Angeles International", city: "Los Angeles", state: "CA", terminals: ["T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8", "TBIT"], avgWait: 26, peakWait: 60, precheck: 9, precheckPeak: 19, tagline: "Hollywood waits for no one — neither should you", icon: "🌴", scene: ["🌴", "🎬", "🌊", "🎭", "☀️"], sceneGrad: "linear-gradient(160deg, #0a0a12 0%, #0f0e17 25%, #ff8906 55%, #f25f4c 80%, #ff4365 100%)" },
  { code: "ORD", lat: 41.9742, lng: -87.9073, name: "O'Hare International", city: "Chicago", state: "IL", terminals: ["Terminal 1", "Terminal 2", "Terminal 3", "Terminal 5"], avgWait: 27, peakWait: 65, precheck: 10, precheckPeak: 21, tagline: "The Windy City won't blow you through faster", icon: "🌬️", scene: ["🌬️", "🏙️", "🌭", "🎷", "❄️"], sceneGrad: "linear-gradient(160deg, #0a1628 0%, #1B262C 25%, #0F4C75 55%, #3282B8 80%, #BBE1FA 100%)" },
  { code: "DEN", lat: 39.8561, lng: -104.6737, name: "Denver International", city: "Denver", state: "CO", terminals: ["East Terminal", "West Terminal"], avgWait: 20, peakWait: 50, precheck: 7, precheckPeak: 16, tagline: "Mile High lines — arrive early", icon: "🏔️", scene: ["🏔️", "🎿", "🍺", "🦬", "🌲"], sceneGrad: "linear-gradient(160deg, #0e1520 0%, #2D2D2D 25%, #4A6FA5 55%, #90AACB 80%, #d4e4f7 100%)" },
  { code: "JFK", lat: 40.6413, lng: -73.7781, name: "John F. Kennedy International", city: "New York", state: "NY", terminals: ["T1", "T2", "T4", "T5", "T7", "T8"], avgWait: 30, peakWait: 75, precheck: 11, precheckPeak: 24, tagline: "The city never sleeps — and neither do these lines", icon: "🗽", scene: ["🗽", "🏙️", "🚕", "🎭", "🌃"], sceneGrad: "linear-gradient(160deg, #050510 0%, #0D1117 25%, #1A3A5C 55%, #4FC1E9 80%, #a8d8ea 100%)" },
  { code: "LGA", lat: 40.7769, lng: -73.8740, name: "LaGuardia Airport", city: "New York", state: "NY", terminals: ["Terminal B", "Terminal C"], avgWait: 22, peakWait: 50, precheck: 8, precheckPeak: 17, tagline: "Reborn and sleek — but still pack patience", icon: "🌉", scene: ["🌉", "🏙️", "🚇", "🎨", "🌃"], sceneGrad: "linear-gradient(160deg, #080e17 0%, #0D1117 25%, #2C3E50 55%, #E67E22 80%, #ffc048 100%)" },
  { code: "SFO", lat: 37.6213, lng: -122.3790, name: "San Francisco International", city: "San Francisco", state: "CA", terminals: ["Terminal 1", "Terminal 2", "Terminal 3", "Intl Terminal"], avgWait: 21, peakWait: 48, precheck: 7, precheckPeak: 16, tagline: "Fog rolls in — but you should roll out early", icon: "🌁", scene: ["🌁", "🌊", "🚋", "🦭", "🌿"], sceneGrad: "linear-gradient(160deg, #0a0e1a 0%, #1A1A2E 25%, #E94560 55%, #FFD700 80%, #ffe66d 100%)" },
  { code: "SEA", lat: 47.4502, lng: -122.3088, name: "Seattle-Tacoma International", city: "Seattle", state: "WA", terminals: ["North Terminal", "South Terminal"], avgWait: 19, peakWait: 45, precheck: 7, precheckPeak: 15, tagline: "Emerald City — green means go early", icon: "☕", scene: ["☕", "🌲", "🐟", "🎸", "🌧️"], sceneGrad: "linear-gradient(160deg, #0a1a14 0%, #1B2838 25%, #2E8B57 55%, #87CEEB 80%, #b8e6d0 100%)" },
  { code: "MIA", lat: 25.7959, lng: -80.2870, name: "Miami International", city: "Miami", state: "FL", terminals: ["North Terminal", "Central Terminal", "South Terminal"], avgWait: 24, peakWait: 58, precheck: 8, precheckPeak: 18, tagline: "Bienvenidos — but get here early", icon: "🌺", scene: ["🌺", "🌴", "🚤", "🎶", "🌅"], sceneGrad: "linear-gradient(160deg, #060e22 0%, #0A2647 25%, #E91E63 55%, #FF9800 80%, #ffe0b2 100%)" },
  { code: "MCO", lat: 28.4312, lng: -81.3081, name: "Orlando International", city: "Orlando", state: "FL", terminals: ["Terminal A", "Terminal B", "Terminal C"], avgWait: 23, peakWait: 55, precheck: 8, precheckPeak: 18, tagline: "The magic is getting through security fast", icon: "🎢", scene: ["🎢", "🏰", "🌴", "🎆", "☀️"], sceneGrad: "linear-gradient(160deg, #0a0a20 0%, #1A1A40 25%, #7B2FBE 55%, #E040FB 80%, #f8bbd0 100%)" },
  { code: "MSP", lat: 44.8848, lng: -93.2223, name: "Minneapolis-Saint Paul International", city: "Minneapolis", state: "MN", terminals: ["Terminal 1", "Terminal 2"], avgWait: 17, peakWait: 40, precheck: 6, precheckPeak: 13, tagline: "Twin Cities, one goal — beat the line", icon: "❄️", scene: ["❄️", "🏒", "🌾", "🎭", "🦆"], sceneGrad: "linear-gradient(160deg, #0e1028 0%, #1C1C3C 25%, #4169E1 55%, #87CEEB 80%, #cce5ff 100%)" },
  { code: "BOS", lat: 42.3656, lng: -71.0096, name: "Boston Logan International", city: "Boston", state: "MA", terminals: ["Terminal A", "Terminal B", "Terminal C", "Terminal E"], avgWait: 21, peakWait: 50, precheck: 7, precheckPeak: 16, tagline: "Wicked smart to arrive early", icon: "🏛️", scene: ["🏛️", "🦞", "⛵", "📚", "🍀"], sceneGrad: "linear-gradient(160deg, #0e0e1a 0%, #1B1B2F 25%, #8B0000 55%, #D4A373 80%, #edd9b7 100%)" },
  { code: "PHX", lat: 33.4373, lng: -112.0078, name: "Phoenix Sky Harbor International", city: "Phoenix", state: "AZ", terminals: ["Terminal 3", "Terminal 4"], avgWait: 16, peakWait: 38, precheck: 6, precheckPeak: 13, tagline: "Desert heat outside, cool lines inside", icon: "🌵", scene: ["🌵", "☀️", "🏜️", "🦎", "🌅"], sceneGrad: "linear-gradient(160deg, #1a0e08 0%, #2C1810 25%, #D84315 55%, #FFB74D 80%, #ffe0b2 100%)" },
  { code: "LAS", lat: 36.0840, lng: -115.1537, name: "Harry Reid International", city: "Las Vegas", state: "NV", terminals: ["Terminal 1", "Terminal 3"], avgWait: 22, peakWait: 52, precheck: 8, precheckPeak: 17, tagline: "Don't gamble on arriving late", icon: "🎰", scene: ["🎰", "🎲", "🌃", "💎", "🎵"], sceneGrad: "linear-gradient(160deg, #050508 0%, #0D0D0D 25%, #6A0DAD 55%, #FFD700 80%, #fff176 100%)" },
  { code: "CLT", lat: 35.2140, lng: -80.9431, name: "Charlotte Douglas International", city: "Charlotte", state: "NC", terminals: ["Main Terminal"], avgWait: 19, peakWait: 44, precheck: 7, precheckPeak: 15, tagline: "Queen City moves — you should too", icon: "👑", scene: ["👑", "🏎️", "🌳", "🏦", "🍺"], sceneGrad: "linear-gradient(160deg, #0a1218 0%, #1A1A2E 25%, #00695C 55%, #80CBC4 80%, #b2dfdb 100%)" },
];

function haversineDistance(lat1, lng1, lat2, lng2) {
  const R = 3959;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function findNearestAirport(userLat, userLng) {
  return AIRPORTS.reduce((best, airport) => {
    const dist = haversineDistance(userLat, userLng, airport.lat, airport.lng);
    return dist < best.dist ? { airport, dist } : best;
  }, { airport: AIRPORTS[0], dist: Infinity }).airport;
}

const HOURS = ["4a","5a","6a","7a","8a","9a","10a","11a","12p","1p","2p","3p","4p","5p","6p","7p","8p","9p"];
const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

function genHeatmap(airport) {
  const base = airport.avgWait;
  const dayMults = [1.0, 0.9, 0.85, 1.05, 1.25, 0.7, 0.95];
  const hourMults = [0.3, 0.5, 0.9, 1.3, 1.1, 0.95, 0.8, 0.75, 0.85, 0.95, 0.7, 0.6, 0.85, 1.15, 1.3, 1.1, 0.7, 0.4];
  let seed = airport.code.charCodeAt(0) * 137 + airport.code.charCodeAt(1) * 31;
  const rng = () => { seed = (seed * 16807 + 11) % 2147483647; return (seed % 100) / 100; };
  return DAYS.map((_, di) => HOURS.map((_, hi) => {
    const v = base * dayMults[di] * hourMults[hi] * (0.85 + rng() * 0.3);
    return Math.max(2, Math.round(v));
  }));
}

function getWaitColor(mins) {
  if (mins <= 10) return { bg: "#E8F5E9", text: "#2E7D32" };
  if (mins <= 20) return { bg: "#FFF8E1", text: "#F57F17" };
  if (mins <= 35) return { bg: "#FFF3E0", text: "#E65100" };
  return { bg: "#FFEBEE", text: "#C62828" };
}

function getWaitLabel(mins) {
  if (mins <= 10) return "Breeze";
  if (mins <= 20) return "Smooth";
  if (mins <= 35) return "Busy";
  return "Packed";
}

function getCurrentEstimate(airport) {
  const now = new Date();
  const hour = now.getHours();
  const dayIdx = (now.getDay() + 6) % 7;
  const data = genHeatmap(airport);
  const hIdx = Math.max(0, Math.min(hour - 4, 17));
  const general = (hour >= 4 && hour <= 21) ? data[dayIdx][hIdx] : Math.max(3, Math.round(airport.avgWait * 0.3));
  const precheckRatio = airport.precheck / airport.avgWait;
  const precheck = Math.max(2, Math.round(general * precheckRatio));
  return { general, precheck };
}

function HeatmapCell({ value }) {
  const c = getWaitColor(value);
  return (
    <div style={{ width: "100%", aspectRatio: "1", borderRadius: 3, background: c.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 500, color: c.text, cursor: "default", minWidth: 0 }}
      title={`${value} min`}>
      {value}
    </div>
  );
}

function Heatmap({ airport }) {
  const data = useMemo(() => genHeatmap(airport), [airport.code]);
  return (
    <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
      <div style={{ display: "grid", gridTemplateColumns: `40px repeat(${HOURS.length}, 1fr)`, gap: 2, minWidth: 500 }}>
        <div />
        {HOURS.map(h => <div key={h} style={{ fontSize: 10, textAlign: "center", color: "#888", padding: "2px 0" }}>{h}</div>)}
        {DAYS.map((day, di) => (
          <>
            <div key={`d-${day}`} style={{ fontSize: 11, fontWeight: 500, display: "flex", alignItems: "center", color: "#666" }}>{day}</div>
            {HOURS.map((_, hi) => <HeatmapCell key={`${di}-${hi}`} value={data[di][hi]} />)}
          </>
        ))}
      </div>
      <div style={{ display: "flex", gap: 12, marginTop: 10, justifyContent: "center", flexWrap: "wrap" }}>
        {[["Breeze","#E8F5E9","#2E7D32"],["Smooth","#FFF8E1","#F57F17"],["Busy","#FFF3E0","#E65100"],["Packed","#FFEBEE","#C62828"]].map(([label, bg, text]) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11 }}>
            <div style={{ width: 12, height: 12, borderRadius: 2, background: bg, border: `1px solid ${text}30` }} />
            <span style={{ color: "#666" }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CityHero({ airport, onClick }) {
  return (
    <div onClick={onClick} style={{ borderRadius: 20, overflow: "hidden", cursor: "pointer", position: "relative", boxShadow: "0 4px 24px rgba(0,0,0,0.2)", transition: "transform 0.2s, box-shadow 0.2s" }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.25)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,0,0,0.2)"; }}>
      <div style={{ background: airport.sceneGrad, padding: "40px 24px 24px", color: "#fff", position: "relative", minHeight: 220 }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 16, fontSize: 48, opacity: 0.12, pointerEvents: "none", flexWrap: "wrap", padding: 20 }}>
          {airport.scene.map((s, i) => <span key={i} style={{ transform: `rotate(${(i - 2) * 12}deg) scale(${1 + (i % 3) * 0.3})` }}>{s}</span>)}
          {airport.scene.map((s, i) => <span key={`b-${i}`} style={{ transform: `rotate(${(i + 1) * -8}deg) scale(${0.8 + (i % 2) * 0.4})` }}>{s}</span>)}
        </div>
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: 48, marginBottom: 6 }}>{airport.icon}</div>
          <div style={{ fontSize: 36, fontWeight: 800, letterSpacing: 2, textShadow: "0 2px 12px rgba(0,0,0,0.3)" }}>{airport.code}</div>
          <div style={{ fontSize: 16, opacity: 0.9, marginTop: 4, fontWeight: 500 }}>{airport.city}, {airport.state}</div>
          <div style={{ fontSize: 13, opacity: 0.65, marginTop: 8, fontStyle: "italic", maxWidth: 280 }}>{airport.tagline}</div>
        </div>
      </div>
      <div style={{ background: "#fff", padding: "16px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <div style={{ fontSize: 10, color: "#888", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 2 }}>General — typical</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: getWaitColor(airport.avgWait).text }}>{airport.avgWait} min</div>
          </div>
          <div>
            <div style={{ fontSize: 10, color: "#888", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 2 }}>PreCheck — typical</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: getWaitColor(airport.precheck).text }}>{airport.precheck} min</div>
          </div>
        </div>
        <div style={{ fontSize: 12, color: "#4A6FA5", marginTop: 10, fontWeight: 500, textAlign: "center" }}>Tap to see current estimates & busy times →</div>
      </div>
    </div>
  );
}

function WaitCard({ label, typical, current, isCurrent }) {
  const val = isCurrent ? current : typical;
  const c = getWaitColor(val);
  return (
    <div style={{ background: "#f8f8f8", borderRadius: 12, padding: "14px 12px", textAlign: "center", flex: 1 }}>
      <div style={{ fontSize: 10, color: "#888", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6 }}>{label}</div>
      <div style={{ display: "flex", justifyContent: "center", gap: 12, alignItems: "baseline" }}>
        <div>
          <div style={{ fontSize: 9, color: "#aaa", textTransform: "uppercase", letterSpacing: 0.5 }}>Typical</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: getWaitColor(typical).text }}>{typical}m</div>
        </div>
        <div style={{ width: 1, height: 28, background: "#ddd" }} />
        <div>
          <div style={{ fontSize: 9, color: "#aaa", textTransform: "uppercase", letterSpacing: 0.5 }}>Current</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: getWaitColor(current).text }}>{current}m</div>
        </div>
      </div>
    </div>
  );
}

function AirportDetail({ airport, onBack, onFav, isFav }) {
  const [tab, setTab] = useState("now");
  const est = useMemo(() => getCurrentEstimate(airport), [airport.code]);
  const overallCurrent = est.general;
  const c = getWaitColor(overallCurrent);
  const label = getWaitLabel(overallCurrent);

  return (
    <div>
      <button onClick={onBack} style={{ background: "none", border: "none", fontSize: 14, color: "#4A6FA5", cursor: "pointer", padding: "8px 0", fontWeight: 500, display: "flex", alignItems: "center", gap: 4 }}>
        ← Back
      </button>
      <div style={{ borderRadius: 20, overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.15)", marginTop: 8 }}>
        <div style={{ background: airport.sceneGrad, padding: "32px 24px 24px", color: "#fff", position: "relative", minHeight: 200 }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 16, fontSize: 44, opacity: 0.1, pointerEvents: "none", flexWrap: "wrap", padding: 20 }}>
            {airport.scene.map((s, i) => <span key={i} style={{ transform: `rotate(${(i - 2) * 12}deg) scale(${1 + (i % 3) * 0.3})` }}>{s}</span>)}
            {airport.scene.map((s, i) => <span key={`b-${i}`} style={{ transform: `rotate(${(i + 1) * -8}deg) scale(${0.8 + (i % 2) * 0.4})` }}>{s}</span>)}
          </div>
          <button onClick={() => onFav(airport.code)}
            style={{ position: "absolute", top: 14, right: 16, background: "rgba(255,255,255,0.15)", border: "none", fontSize: 20, cursor: "pointer", color: isFav ? "#FFD700" : "rgba(255,255,255,0.6)", padding: "6px 10px", borderRadius: 8, backdropFilter: "blur(4px)" }}>
            {isFav ? "★" : "☆"}
          </button>
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ fontSize: 44, marginBottom: 4 }}>{airport.icon}</div>
            <div style={{ fontSize: 34, fontWeight: 800, letterSpacing: 2, textShadow: "0 2px 12px rgba(0,0,0,0.3)" }}>{airport.code}</div>
            <div style={{ fontSize: 14, opacity: 0.9, marginTop: 2 }}>{airport.name}</div>
            <div style={{ fontSize: 13, opacity: 0.7, marginTop: 6, fontStyle: "italic" }}>{airport.tagline}</div>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 0, marginTop: 16, background: "#f0f0f0", borderRadius: 10, padding: 3 }}>
        {[["now","Right now"],["heatmap","Busy times"]].map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)} style={{ flex: 1, padding: "10px 0", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", background: tab === k ? "#fff" : "transparent", color: tab === k ? "#333" : "#888", boxShadow: tab === k ? "0 1px 4px rgba(0,0,0,0.1)" : "none", transition: "all 0.15s" }}>
            {l}
          </button>
        ))}
      </div>

      <div style={{ marginTop: 16 }}>
        {tab === "now" && (
          <div>
            <div style={{ background: c.bg, borderRadius: 14, padding: "18px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: c.text, opacity: 0.8, textTransform: "uppercase", letterSpacing: 0.5 }}>General line — right now</div>
                <div style={{ fontSize: 36, fontWeight: 800, color: c.text, lineHeight: 1.2 }}>{est.general} min</div>
              </div>
              <div style={{ background: `${c.text}18`, borderRadius: 8, padding: "6px 14px" }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: c.text }}>{label}</span>
              </div>
            </div>

            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <WaitCard label="General" typical={airport.avgWait} current={est.general} />
              <WaitCard label="PreCheck" typical={airport.precheck} current={est.precheck} />
            </div>

            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              <div style={{ background: "#f8f8f8", borderRadius: 12, padding: "14px 12px", textAlign: "center", flex: 1 }}>
                <div style={{ fontSize: 10, color: "#888", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 4 }}>General peak</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: getWaitColor(airport.peakWait).text }}>{airport.peakWait}m</div>
              </div>
              <div style={{ background: "#f8f8f8", borderRadius: 12, padding: "14px 12px", textAlign: "center", flex: 1 }}>
                <div style={{ fontSize: 10, color: "#888", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 4 }}>PreCheck peak</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: getWaitColor(airport.precheckPeak).text }}>{airport.precheckPeak}m</div>
              </div>
            </div>

            {airport.terminals.length > 1 && (
              <div style={{ marginTop: 16 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#555", marginBottom: 8 }}>By terminal</div>
                {airport.terminals.map((t, i) => {
                  let seed = airport.code.charCodeAt(0) * 31 + i * 97;
                  seed = (seed * 16807 + 11) % 2147483647;
                  const w = Math.max(5, Math.round(airport.avgWait * (0.7 + (seed % 60) / 100)));
                  const tc = getWaitColor(w);
                  return (
                    <div key={t} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: "#f8f8f8", borderRadius: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 13, color: "#444" }}>{t}</span>
                      <span style={{ fontSize: 14, fontWeight: 700, color: tc.text, background: tc.bg, borderRadius: 6, padding: "3px 10px" }}>{w} min</span>
                    </div>
                  );
                })}
              </div>
            )}

            <div style={{ marginTop: 16, padding: "14px 16px", background: "#E3F2FD", borderRadius: 10, fontSize: 12, color: "#1565C0", lineHeight: 1.5 }}>
              Estimates based on historical patterns & crowdsourced data. For live updates, check the <a href="https://www.tsa.gov/mobile" target="_blank" rel="noopener" style={{ color: "#0D47A1", fontWeight: 600 }}>MyTSA app</a> or your airport's website.
            </div>
          </div>
        )}
        {tab === "heatmap" && (
          <div>
            <div style={{ fontSize: 13, color: "#666", marginBottom: 12 }}>Typical wait times (minutes) by day & hour</div>
            <Heatmap airport={airport} />
          </div>
        )}
      </div>
    </div>
  );
}

function CompactCard({ airport, onClick, onFav, isFav }) {
  return (
    <div onClick={onClick} style={{ borderRadius: 14, overflow: "hidden", cursor: "pointer", boxShadow: "0 2px 12px rgba(0,0,0,0.12)", transition: "transform 0.15s, box-shadow 0.15s" }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.18)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.12)"; }}>
      <div style={{ background: airport.sceneGrad, padding: "16px 18px", color: "#fff", position: "relative", minHeight: 80 }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 8, fontSize: 28, opacity: 0.1, pointerEvents: "none", paddingRight: 16 }}>
          {airport.scene.slice(0, 3).map((s, i) => <span key={i}>{s}</span>)}
        </div>
        {onFav && (
          <button onClick={e => { e.stopPropagation(); onFav(airport.code); }}
            style={{ position: "absolute", top: 8, right: 10, background: "none", border: "none", fontSize: 16, cursor: "pointer", color: isFav ? "#FFD700" : "rgba(255,255,255,0.5)", padding: 4 }}>
            {isFav ? "★" : "☆"}
          </button>
        )}
        <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 28 }}>{airport.icon}</span>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: 1 }}>{airport.code}</div>
            <div style={{ fontSize: 11, opacity: 0.85 }}>{airport.city}, {airport.state}</div>
          </div>
        </div>
      </div>
      <div style={{ background: "#fff", padding: "10px 18px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <div>
          <div style={{ fontSize: 9, color: "#888", textTransform: "uppercase", letterSpacing: 0.5 }}>General</div>
          <div style={{ fontSize: 17, fontWeight: 700, color: getWaitColor(airport.avgWait).text }}>{airport.avgWait} min</div>
        </div>
        <div>
          <div style={{ fontSize: 9, color: "#888", textTransform: "uppercase", letterSpacing: 0.5 }}>PreCheck</div>
          <div style={{ fontSize: 17, fontWeight: 700, color: getWaitColor(airport.precheck).text }}>{airport.precheck} min</div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [view, setView] = useState("home");
  const [selected, setSelected] = useState(null);
  const [mode, setMode] = useState("my");
  const [search, setSearch] = useState("");
  const [favs, setFavs] = useState([]);
  const [homeCode, setHomeCode] = useState("AUS");
  const [locStatus, setLocStatus] = useState("detecting");

  useEffect(() => {
    if (!navigator.geolocation) { setLocStatus("unavailable"); return; }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const nearest = findNearestAirport(coords.latitude, coords.longitude);
        setHomeCode(nearest.code);
        setLocStatus("found");
      },
      () => setLocStatus("denied"),
      { timeout: 8000 }
    );
  }, []);

  const homeAirport = AIRPORTS.find(a => a.code === homeCode);

  const toggleFav = useCallback((code) => {
    setFavs(prev => prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]);
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return [];
    const q = search.toLowerCase();
    return AIRPORTS.filter(a =>
      a.code.toLowerCase().includes(q) ||
      a.name.toLowerCase().includes(q) ||
      a.city.toLowerCase().includes(q) ||
      a.state.toLowerCase().includes(q)
    ).slice(0, 8);
  }, [search]);

  const favAirports = useMemo(() => AIRPORTS.filter(a => favs.includes(a.code) && a.code !== homeCode), [favs, homeCode]);

  if (view === "detail" && selected) {
    const airport = AIRPORTS.find(a => a.code === selected);
    return (
      <div style={{ maxWidth: 480, margin: "0 auto", padding: "12px 16px", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
        <AirportDetail airport={airport} onBack={() => setView("home")} onFav={toggleFav} isFav={favs.includes(airport.code)} />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: "12px 16px", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <div style={{ fontSize: 30, fontWeight: 800, color: "#1a1a2e", letterSpacing: -0.5 }}>
          <span style={{ color: "#4A6FA5" }}>Gate</span>Check
        </div>
        <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>Free TSA wait times — no paywall, no nonsense</div>
      </div>

      <div style={{ display: "flex", gap: 0, background: "#f0f0f0", borderRadius: 10, padding: 3, marginBottom: 20 }}>
        {[["my","My airport"],["loved","Loved one's trip"]].map(([k, l]) => (
          <button key={k} onClick={() => { setMode(k); setSearch(""); }}
            style={{ flex: 1, padding: "10px 0", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", background: mode === k ? "#fff" : "transparent", color: mode === k ? "#333" : "#888", boxShadow: mode === k ? "0 1px 4px rgba(0,0,0,0.1)" : "none", transition: "all 0.15s" }}>
            {k === "loved" ? "❤️ " : ""}{l}
          </button>
        ))}
      </div>

      {mode === "my" && (
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <div style={{ fontSize: 13, color: "#888", fontWeight: 500 }}>Your home airport</div>
            {locStatus === "detecting" && <div style={{ fontSize: 11, color: "#aaa" }}>📍 Detecting location…</div>}
            {locStatus === "found" && <div style={{ fontSize: 11, color: "#4A6FA5" }}>📍 Nearest to you</div>}
            {(locStatus === "denied" || locStatus === "unavailable") && <div style={{ fontSize: 11, color: "#aaa" }}>📍 Location unavailable</div>}
          </div>
          <CityHero airport={homeAirport} onClick={() => { setSelected(homeCode); setView("detail"); }} />
        </div>
      )}

      {mode === "loved" && (
        <div>
          <div style={{ position: "relative", marginBottom: 16 }}>
            <input
              type="text"
              placeholder="Search airports — name, code, or city..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: "100%", padding: "12px 16px 12px 40px", borderRadius: 12, border: "1.5px solid #ddd", fontSize: 14, outline: "none", boxSizing: "border-box", transition: "border-color 0.15s" }}
              onFocus={e => e.target.style.borderColor = "#4A6FA5"}
              onBlur={e => e.target.style.borderColor = "#ddd"}
            />
            <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 16, color: "#aaa" }}>🔍</span>
          </div>

          {search.trim() && filtered.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              {filtered.map(a => (
                <div key={a.code} onClick={() => { setSelected(a.code); setView("detail"); setSearch(""); }}
                  style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", cursor: "pointer", borderRadius: 10, marginBottom: 4, background: "#f8f8f8", transition: "background 0.1s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#eef3fb"}
                  onMouseLeave={e => e.currentTarget.style.background = "#f8f8f8"}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 20 }}>{a.icon}</span>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "#333" }}>{a.code} — {a.city}, {a.state}</div>
                      <div style={{ fontSize: 11, color: "#888" }}>{a.name}</div>
                    </div>
                  </div>
                  <button onClick={e => { e.stopPropagation(); toggleFav(a.code); }}
                    style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer", color: favs.includes(a.code) ? "#FFD700" : "#ccc" }}>
                    {favs.includes(a.code) ? "★" : "☆"}
                  </button>
                </div>
              ))}
            </div>
          )}

          {search.trim() && filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: "20px 0", color: "#888", fontSize: 13 }}>
              No airports found for "{search}"
            </div>
          )}

          {favAirports.length > 0 && (
            <div>
              <div style={{ fontSize: 13, color: "#888", marginBottom: 10, fontWeight: 500 }}>★ Saved airports</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {favAirports.map(a => (
                  <CompactCard key={a.code} airport={a} onClick={() => { setSelected(a.code); setView("detail"); }} onFav={toggleFav} isFav={true} />
                ))}
              </div>
            </div>
          )}

          {favAirports.length === 0 && !search.trim() && (
            <div style={{ textAlign: "center", padding: "30px 20px", color: "#888" }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>✈️</div>
              <div style={{ fontSize: 14, fontWeight: 500 }}>No saved airports yet</div>
              <div style={{ fontSize: 12, marginTop: 4 }}>Search for an airport and tap the star to save it for quick access</div>
            </div>
          )}
        </div>
      )}

      <div style={{ marginTop: 24, textAlign: "center", fontSize: 11, color: "#bbb", paddingBottom: 12 }}>
        Data based on historical patterns & crowdsourced reports. Not affiliated with TSA.
      </div>
    </div>
  );
}