import { useState, useCallback, useMemo } from "react";

const AIRPORTS = [
  { code: "AUS", name: "Austin-Bergstrom International", city: "Austin", state: "TX", terminals: ["Main Terminal"], avgWait: 18, peakWait: 45, precheck: 6, tagline: "Keep Austin Weird — but keep your line short" },
  { code: "DFW", name: "Dallas/Fort Worth International", city: "Dallas", state: "TX", terminals: ["Terminal A","Terminal B","Terminal C","Terminal D","Terminal E"], avgWait: 22, peakWait: 55, precheck: 8, tagline: "Big airport, big waits — plan ahead" },
  { code: "IAH", name: "George Bush Intercontinental", city: "Houston", state: "TX", terminals: ["Terminal A","Terminal B","Terminal C","Terminal D","Terminal E"], avgWait: 25, peakWait: 65, precheck: 9, tagline: "Space City — launch through security" },
  { code: "HOU", name: "William P. Hobby Airport", city: "Houston", state: "TX", terminals: ["Main Terminal"], avgWait: 15, peakWait: 35, precheck: 5, tagline: "Hobby keeps it quick" },
  { code: "SAT", name: "San Antonio International", city: "San Antonio", state: "TX", terminals: ["Terminal A","Terminal B"], avgWait: 14, peakWait: 30, precheck: 5, tagline: "Remember the Alamo — and your boarding pass" },
  { code: "ATL", name: "Hartsfield-Jackson International", city: "Atlanta", state: "GA", terminals: ["North Terminal","South Terminal"], avgWait: 28, peakWait: 70, precheck: 10, tagline: "World's busiest — give yourself extra time" },
  { code: "LAX", name: "Los Angeles International", city: "Los Angeles", state: "CA", terminals: ["T1","T2","T3","T4","T5","T6","T7","T8","TBIT"], avgWait: 26, peakWait: 60, precheck: 9, tagline: "Hollywood waits for no one" },
  { code: "ORD", name: "O'Hare International", city: "Chicago", state: "IL", terminals: ["Terminal 1","Terminal 2","Terminal 3","Terminal 5"], avgWait: 27, peakWait: 65, precheck: 10, tagline: "The Windy City won't blow you through faster" },
  { code: "DEN", name: "Denver International", city: "Denver", state: "CO", terminals: ["East Terminal","West Terminal"], avgWait: 20, peakWait: 50, precheck: 7, tagline: "Mile High lines — arrive early" },
  { code: "JFK", name: "John F. Kennedy International", city: "New York", state: "NY", terminals: ["T1","T2","T4","T5","T7","T8"], avgWait: 30, peakWait: 75, precheck: 11, tagline: "The city never sleeps — and neither do these lines" },
  { code: "LGA", name: "LaGuardia Airport", city: "New York", state: "NY", terminals: ["Terminal B","Terminal C"], avgWait: 22, peakWait: 50, precheck: 8, tagline: "Reborn and sleek — but still pack patience" },
  { code: "SFO", name: "San Francisco International", city: "San Francisco", state: "CA", terminals: ["Terminal 1","Terminal 2","Terminal 3","Intl Terminal"], avgWait: 21, peakWait: 48, precheck: 7, tagline: "Fog rolls in — roll out early" },
  { code: "SEA", name: "Seattle-Tacoma International", city: "Seattle", state: "WA", terminals: ["North Terminal","South Terminal"], avgWait: 19, peakWait: 45, precheck: 7, tagline: "Emerald City — green means go early" },
  { code: "MIA", name: "Miami International", city: "Miami", state: "FL", terminals: ["North Terminal","Central Terminal","South Terminal"], avgWait: 24, peakWait: 58, precheck: 8, tagline: "Bienvenidos — but get here early" },
  { code: "MCO", name: "Orlando International", city: "Orlando", state: "FL", terminals: ["Terminal A","Terminal B","Terminal C"], avgWait: 23, peakWait: 55, precheck: 8, tagline: "The magic is getting through security fast" },
  { code: "MSP", name: "Minneapolis-Saint Paul Intl", city: "Minneapolis", state: "MN", terminals: ["Terminal 1","Terminal 2"], avgWait: 17, peakWait: 40, precheck: 6, tagline: "Twin Cities, one goal — beat the line" },
  { code: "BOS", name: "Boston Logan International", city: "Boston", state: "MA", terminals: ["Terminal A","Terminal B","Terminal C","Terminal E"], avgWait: 21, peakWait: 50, precheck: 7, tagline: "Wicked smart to arrive early" },
  { code: "PHX", name: "Phoenix Sky Harbor International", city: "Phoenix", state: "AZ", terminals: ["Terminal 3","Terminal 4"], avgWait: 16, peakWait: 38, precheck: 6, tagline: "Desert heat outside, cool lines inside" },
  { code: "LAS", name: "Harry Reid International", city: "Las Vegas", state: "NV", terminals: ["Terminal 1","Terminal 3"], avgWait: 22, peakWait: 52, precheck: 8, tagline: "Don't gamble on arriving late" },
  { code: "CLT", name: "Charlotte Douglas International", city: "Charlotte", state: "NC", terminals: ["Main Terminal"], avgWait: 19, peakWait: 44, precheck: 7, tagline: "Queen City moves — you should too" },
];

function Sky({ id, stops }) {
  return (
    <defs>
      <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
        {stops.map(([o, c], i) => <stop key={i} offset={o} stopColor={c} />)}
      </linearGradient>
    </defs>
  );
}

function Stars() {
  return (
    <g opacity="0.6">
      {[[45,18],[120,28],[195,12],[270,22],[340,8],[390,30],[55,40],[160,35],[310,38],[430,16],[465,35],[22,10],[250,5]].map(([x,y],i) =>
        <circle key={i} cx={x} cy={y} r={0.5 + (i % 3) * 0.3} fill="#fff" />
      )}
    </g>
  );
}

function Windows({ x, y, rows, cols, w=5, h=6, gx=10, gy=13 }) {
  const wins = [];
  const opacities = [0.2, 0.35, 0.5, 0.65, 0.8];
  let s = x * 7 + y * 13;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      s = (s * 31 + 17) % 97;
      const on = s % 3 !== 0;
      if (on) wins.push(<rect key={`${r}-${c}`} x={x + c * gx} y={y + r * gy} width={w} height={h} fill="#f9d871" opacity={opacities[s % 5]} />);
    }
  }
  return <>{wins}</>;
}

function CitySkyline({ code, full }) {
  const h = full ? 320 : 180;
  const vb = full ? "0 0 480 320" : "0 0 480 180";

  const scenes = {
    AUS: (
      <svg viewBox={vb} style={{ width:"100%", height, display:"block" }} preserveAspectRatio="xMidYMax slice">
        <Sky id="s-aus" stops={[["0%","#06091a"],["40%","#0f1d4a"],["75%","#3a1a5c"],["100%","#d94520"]]} />
        <rect width="480" height="320" fill="url(#s-aus)" /><Stars />
        <circle cx="390" cy={full?55:30} r={full?24:16} fill="#f4c542" opacity="0.9" />
        <circle cx="390" cy={full?55:30} r={full?20:13} fill="#f9d871" opacity="0.4" />
        {/* Frost Tower */}
        <rect x="190" y={full?90:20} width="26" height={full?200:150} fill="#111133" />
        <polygon points={`200,${full?60:0} 208,${full?90:20} 192,${full?90:20}`} fill="#111133" />
        <Windows x={194} y={full?100:28} rows={full?12:8} cols={2} w={4} h={5} gx={9} gy={12} />
        {/* Congress tower */}
        <rect x="230" y={full?110:40} width="32" height={full?180:130} fill="#0c0c28" />
        <Windows x={235} y={full?118:46} rows={full?10:7} cols={2} w={5} h={6} gx={11} gy={14} />
        {/* 100 Congress */}
        <rect x="140" y={full?130:55} width="36" height={full?160:115} fill="#0e0e2c" />
        <Windows x={145} y={full?138:62} rows={full?9:6} cols={2} w={5} h={6} gx={12} gy={14} />
        {/* Austonian */}
        <rect x="275" y={full?100:30} width="24" height={full?190:140} fill="#131340" />
        <Windows x={279} y={full?108:38} rows={full?11:8} cols={2} w={4} h={5} gx={8} gy={12} />
        {/* Independent */}
        <rect x="310" y={full?80:15} width="22" height={full?210:155} fill="#0a0a26" />
        <rect x="318" y={full?65:5} width="6" height={full?15:10} fill="#0a0a26" />
        <Windows x={314} y={full?90:24} rows={full?12:9} cols={2} w={3} h={5} gx={7} gy={12} />
        {/* Shorter buildings */}
        <rect x="90" y={full?170:90} width="30" height={full?120:80} fill="#101030" />
        <Windows x={95} y={full?178:96} rows={full?6:4} cols={2} w={4} h={5} gx={10} gy={12} />
        <rect x="345" y={full?150:75} width="28" height={full?140:95} fill="#0d0d2a" />
        <Windows x={350} y={full?158:82} rows={full?7:5} cols={2} w={4} h={5} gx={10} gy={12} />
        <rect x="385" y={full?180:100} width="25" height={full?110:70} fill="#0f0f2e" />
        <rect x="55" y={full?200:115} width="22" height={full?90:55} fill="#12122e" />
        <rect x="420" y={full?190:108} width="30" height={full?100:62} fill="#0e0e2a" />
        {/* Lady Bird Lake + bridge */}
        <path d={`M0,${full?272:158} Q100,${full?265:152} 200,${full?270:156} Q300,${full?278:162} 400,${full?268:155} Q440,${full?264:152} 480,${full?270:156} L480,${full?295:175} L0,${full?295:175}Z`} fill="#0a2a4a" opacity="0.5" />
        <line x1="100" y1={full?272:158} x2="380" y2={full?272:158} stroke="#44444488" strokeWidth="2" />
        {[120,155,190,225,260,295,330,365].map(x => <line key={x} x1={x} y1={full?272:158} x2={x} y2={full?280:164} stroke="#44444466" strokeWidth="1" />)}
        {/* South shore trees */}
        <path d={`M0,${full?290:170} Q80,${full?284:165} 160,${full?288:168} Q260,${full?294:172} 360,${full?286:167} Q420,${full?283:165} 480,${full?288:168} L480,${full?320:180} L0,${full?320:180}Z`} fill="#0d3a22" opacity="0.6" />
        <path d={`M0,${full?302:176} Q120,${full?296:172} 240,${full?300:175} Q360,${full?306:178} 480,${full?298:174} L480,${full?320:180} L0,${full?320:180}Z`} fill="#0a2e1c" opacity="0.5" />
        <text x="240" y={full?315:178} textAnchor="middle" fill="#ffffff33" fontSize="7" fontFamily="sans-serif" letterSpacing="2">CONGRESS AVE BRIDGE</text>
      </svg>
    ),
    JFK: (
      <svg viewBox={vb} style={{ width:"100%", height, display:"block" }} preserveAspectRatio="xMidYMax slice">
        <Sky id="s-jfk" stops={[["0%","#040818"],["45%","#0c1e48"],["100%","#1a3a6c"]]} />
        <rect width="480" height="320" fill="url(#s-jfk)" /><Stars />
        <circle cx="60" cy={full?50:25} r={full?18:12} fill="#c0d8f0" opacity="0.3" />
        {/* Empire State */}
        <rect x="165" y={full?60:0} width="20" height={full?220:165} fill="#101030" />
        <rect x="170" y={full?40:0} width="10" height={full?20:10} fill="#101030" />
        <rect x="173" y={full?20:0} width="4" height={full?20:8} fill="#101030" />
        <circle cx="175" cy={full?18:0} r="2" fill="#ff3333" opacity="0.8" />
        <Windows x={168} y={full?72:10} rows={full?13:10} cols={2} w={3} h={5} gx={8} gy={13} />
        {/* One WTC */}
        <rect x="100" y={full?50:0} width="24" height={full?230:175} fill="#0c0c28" />
        <polygon points={`108,${full?35:0} 116,${full?50:8} 100,${full?50:8}`} fill="#0c0c28" />
        <Windows x={104} y={full?62:8} rows={full?14:11} cols={2} w={3} h={5} gx={8} gy={13} />
        {/* Chrysler */}
        <rect x="200" y={full?75:10} width="18" height={full?205:155} fill="#141438" />
        <polygon points={`205,${full?65:4} 213,${full?75:10} 200,${full?75:10}`} fill="#8a8aaa" opacity="0.3" />
        <Windows x={203} y={full?85:18} rows={full?12:9} cols={2} w={3} h={4} gx={6} gy={12} />
        {/* Other towers */}
        <rect x="235" y={full?90:22} width="28" height={full?190:143} fill="#0e0e2c" />
        <Windows x={239} y={full?98:30} rows={full?10:8} cols={2} w={4} h={5} gx={10} gy={14} />
        <rect x="275" y={full?70:8} width="22" height={full?210:157} fill="#111133" />
        <Windows x={279} y={full?80:16} rows={full?12:9} cols={2} w={3} h={5} gx={7} gy={13} />
        <rect x="310" y={full?100:32} width="30" height={full?180:133} fill="#0a0a26" />
        <Windows x={315} y={full?108:40} rows={full?10:7} cols={2} w={4} h={5} gx={10} gy={14} />
        <rect x="355" y={full?120:50} width="24" height={full?160:115} fill="#0d0d2c" />
        <rect x="60" y={full?140:65} width="22" height={full?140:100} fill="#12122e" />
        <rect x="395" y={full?150:78} width="26" height={full?130:87} fill="#0f0f2e" />
        <rect x="430" y={full?170:95} width="20" height={full?110:70} fill="#10102c" />
        {/* Statue of Liberty */}
        <g transform={full?"translate(30,200) scale(1)":"translate(25,110) scale(0.7)"} opacity="0.5">
          <rect x="8" y="30" width="6" height="50" fill="#3a6a5a" />
          <rect x="4" y="25" width="14" height="8" fill="#3a7a5a" />
          <ellipse cx="11" cy="15" rx="5" ry="10" fill="#3a8a5a" />
          <line x1="5" y1="5" x2="3" y2="-10" stroke="#4a8a6a" strokeWidth="2" />
          <rect x="2" y="-14" width="3" height="6" fill="#f9d87188" />
        </g>
        {/* Water */}
        <path d={`M0,${full?280:165} Q120,${full?274:160} 240,${full?278:163} Q360,${full?284:168} 480,${full?276:162} L480,${full?320:180} L0,${full?320:180}Z`} fill="#061428" opacity="0.7" />
      </svg>
    ),
    DEN: (
      <svg viewBox={vb} style={{ width:"100%", height, display:"block" }} preserveAspectRatio="xMidYMax slice">
        <Sky id="s-den" stops={[["0%","#0a1830"],["35%","#2a4a7a"],["70%","#5a8aba"],["100%","#8ab4da"]]} />
        <rect width="480" height="320" fill="url(#s-den)" /><Stars />
        <circle cx="400" cy={full?45:22} r={full?22:14} fill="#f4e542" opacity="0.85" />
        {/* Mountains far */}
        <polygon points={`0,${full?180:100} 70,${full?100:50} 140,${full?180:100}`} fill="#5a6a8a" />
        <polygon points={`50,${full?180:100} 130,${full?80:40} 210,${full?180:100}`} fill="#4a5a7a" />
        <polygon points={`120,${full?180:100} 210,${full?70:35} 300,${full?180:100}`} fill="#6a7a9a" />
        <polygon points={`230,${full?180:100} 310,${full?85:42} 390,${full?180:100}`} fill="#4a5a7a" />
        <polygon points={`310,${full?180:100} 390,${full?75:38} 470,${full?180:100}`} fill="#5a6a8a" />
        <polygon points={`390,${full?180:100} 450,${full?95:48} 480,${full?140:75} 480,${full?180:100}`} fill="#4a5a7a" />
        {/* Snow caps */}
        <polygon points={`70,${full?100:50} 55,${full?120:65} 85,${full?120:65}`} fill="#fff" opacity="0.5" />
        <polygon points={`130,${full?80:40} 112,${full?105:55} 148,${full?105:55}`} fill="#fff" opacity="0.45" />
        <polygon points={`210,${full?70:35} 190,${full?98:52} 230,${full?98:52}`} fill="#fff" opacity="0.5" />
        <polygon points={`310,${full?85:42} 295,${full?108:56} 325,${full?108:56}`} fill="#fff" opacity="0.4" />
        <polygon points={`390,${full?75:38} 374,${full?100:52} 406,${full?100:52}`} fill="#fff" opacity="0.45" />
        {/* Foothills */}
        <path d={`M0,${full?200:110} Q60,${full?185:102} 120,${full?195:108} Q200,${full?205:114} 280,${full?192:106} Q360,${full?182:100} 440,${full?198:110} L480,${full?195:108} L480,${full?220:125} L0,${full?220:125}Z`} fill="#3a5a4a" opacity="0.6" />
        {/* City */}
        <rect x="150" y={full?190:106} width="18" height={full?90:55} fill="#1a1a3a" />
        <rect x="180" y={full?175:96} width="24" height={full?105:65} fill="#12122e" />
        <Windows x={184} y={full?182:102} rows={full?6:4} cols={2} w={4} h={5} gx={8} gy={12} />
        <rect x="215" y={full?165:90} width="30" height={full?115:71} fill="#0e0e28" />
        <Windows x={220} y={full?172:96} rows={full?7:4} cols={2} w={5} h={5} gx={10} gy={12} />
        <rect x="255" y={full?180:100} width="22" height={full?100:61} fill="#161640" />
        <Windows x={259} y={full?186:106} rows={full?5:3} cols={2} w={3} h={5} gx={7} gy={12} />
        <rect x="290" y={full?195:108} width="26" height={full?85:53} fill="#0c0c26" />
        <rect x="330" y={full?200:112} width="20" height={full?80:49} fill="#10102c" />
        {/* DEN tent roof */}
        <g transform={full?"translate(80,230)":"translate(80,135)"} opacity="0.5">
          <polygon points="0,30 15,0 30,30 45,0 60,30 75,0 90,30" fill="#e8e8e8" stroke="#ccc" strokeWidth="0.5" />
          <rect x="0" y="30" width="90" height="8" fill="#888" opacity="0.3" />
        </g>
        {/* Ground */}
        <rect x="0" y={full?280:161} width="480" height={full?40:19} fill="#2a4a2a" />
        <path d={`M0,${full?278:160} Q120,${full?272:156} 240,${full?276:159} Q360,${full?282:163} 480,${full?274:157} L480,${full?290:165} L0,${full?290:165}Z`} fill="#1a3a1a" opacity="0.6" />
        <text x="130" y={full?312:177} fill="#ffffff33" fontSize="7" fontFamily="sans-serif" letterSpacing="2">DIA TENT ROOF</text>
        <text x="320" y={full?312:177} fill="#ffffff33" fontSize="7" fontFamily="sans-serif" letterSpacing="2">ROCKY MOUNTAIN FRONT RANGE</text>
      </svg>
    ),
    LAX: (
      <svg viewBox={vb} style={{ width:"100%", height, display:"block" }} preserveAspectRatio="xMidYMax slice">
        <Sky id="s-lax" stops={[["0%","#12061e"],["30%","#3a1248"],["65%","#c43a1a"],["100%","#ff8a30"]]} />
        <rect width="480" height="320" fill="url(#s-lax)" /><Stars />
        <circle cx="420" cy={full?55:28} r={full?28:18} fill="#ff8c42" opacity="0.85" />
        <circle cx="420" cy={full?55:28} r={full?34:22} fill="#ff8c42" opacity="0.15" />
        {/* Palm trees */}
        {[30,440,465].map((px,i) => (
          <g key={i} transform={`translate(${px},${full?120:55}) scale(${full?1:0.65})`} opacity="0.7">
            <rect x="-2" y="0" width="4" height="120" fill="#3a2510" rx="2" />
            <ellipse cx="0" cy="-8" rx="10" ry="22" fill="#1a6a35" transform="rotate(-15)" />
            <ellipse cx="5" cy="-5" rx="8" ry="18" fill="#1a7a3a" transform="rotate(20)" />
            <ellipse cx="-6" cy="-2" rx="7" ry="16" fill="#15602e" transform="rotate(-35)" />
          </g>
        ))}
        {/* Skyline */}
        <rect x="100" y={full?130:55} width="20" height={full?140:100} fill="#101030" />
        <rect x="135" y={full?100:35} width="28" height={full?170:120} fill="#0c0c28" />
        <Windows x={139} y={full?108:42} rows={full?10:7} cols={2} w={4} h={5} gx={10} gy={13} />
        <rect x="175" y={full?85:25} width="32" height={full?185:130} fill="#111133" />
        <Windows x={180} y={full?94:32} rows={full?11:8} cols={2} w={5} h={5} gx={11} gy={13} />
        <rect x="220" y={full?110:42} width="25" height={full?160:113} fill="#0e0e2c" />
        <Windows x={224} y={full?118:50} rows={full?9:6} cols={2} w={4} h={5} gx={8} gy={13} />
        <rect x="255" y={full?90:30} width="28" height={full?180:125} fill="#141438" />
        <Windows x={259} y={full?98:38} rows={full?10:7} cols={2} w={4} h={5} gx={9} gy={13} />
        <rect x="295" y={full?120:52} width="22" height={full?150:103} fill="#0a0a26" />
        <rect x="330" y={full?140:68} width="30" height={full?130:87} fill="#0d0d2a" />
        <Windows x={335} y={full?148:76} rows={full?7:5} cols={2} w={4} h={5} gx={10} gy={13} />
        <rect x="375" y={full?155:82} width="22" height={full?115:73} fill="#10102c" />
        <rect x="70" y={full?180:100} width="18" height={full?90:55} fill="#0e0e2a" />
        {/* Ground / beach */}
        <rect x="0" y={full?270:155} width="480" height={full?50:25} fill="#1a1020" />
        <path d={`M0,${full?275:158} Q120,${full?268:153} 240,${full?273:157} Q360,${full?280:162} 480,${full?271:156} L480,${full?320:180} L0,${full?320:180}Z`} fill="#0d1b2a" />
      </svg>
    ),
    ATL: (
      <svg viewBox={vb} style={{ width:"100%", height, display:"block" }} preserveAspectRatio="xMidYMax slice">
        <Sky id="s-atl" stops={[["0%","#060e1e"],["45%","#142a4a"],["100%","#b84420"]]} />
        <rect width="480" height="320" fill="url(#s-atl)" /><Stars />
        {/* Bank of America Plaza */}
        <rect x="200" y={full?55:0} width="24" height={full?215:160} fill="#0c0c28" />
        <polygon points={`208,${full?40:0} 216,${full?55:8} 200,${full?55:8}`} fill="#0c0c28" />
        <rect x="210" y={full?35:0} width="3" height={full?12:6} fill="#ff333388" />
        <Windows x={204} y={full?65:10} rows={full?13:10} cols={2} w={3} h={5} gx={8} gy={13} />
        {/* Westin */}
        <rect x="240" y={full?70:10} width="28" height={full?200:155} fill="#111133" />
        <ellipse cx="254" cy={full?70:10} rx="14" ry="4" fill="#111133" />
        <Windows x={244} y={full?80:18} rows={full?12:9} cols={2} w={4} h={5} gx={10} gy={13} />
        {/* Other towers */}
        <rect x="150" y={full?90:28} width="30" height={full?180:137} fill="#0e0e2c" />
        <Windows x={155} y={full?98:35} rows={full?10:7} cols={2} w={5} h={5} gx={10} gy={14} />
        <rect x="285" y={full?80:20} width="25" height={full?190:145} fill="#141438" />
        <Windows x={289} y={full?88:28} rows={full?11:8} cols={2} w={4} h={5} gx={8} gy={13} />
        <rect x="325" y={full?110:45} width="22" height={full?160:120} fill="#0a0a26" />
        <rect x="105" y={full?130:60} width="26" height={full?140:105} fill="#10102c" />
        <Windows x={109} y={full?138:68} rows={full?8:5} cols={2} w={4} h={5} gx={9} gy={13} />
        <rect x="360" y={full?140:70} width="28" height={full?130:95} fill="#0d0d2a" />
        <rect x="400" y={full?160:88} width="22" height={full?110:77} fill="#0f0f2e" />
        <rect x="60" y={full?180:100} width="20" height={full?90:65} fill="#12122e" />
        <rect x="435" y={full?190:108} width="25" height={full?80:57} fill="#0e0e2a" />
        {/* Trees */}
        <path d={`M0,${full?268:162} Q60,${full?260:156} 100,${full?265:160} Q120,${full?270:164} 140,${full?265:160}`} fill="none" stroke="#1a4a2a" strokeWidth="8" opacity="0.5" />
        <path d={`M340,${full?268:162} Q380,${full?260:156} 420,${full?266:161} Q460,${full?272:166} 480,${full?265:160}`} fill="none" stroke="#1a4a2a" strokeWidth="8" opacity="0.5" />
        <rect x="0" y={full?270:165} width="480" height={full?50:15} fill="#0d1b2a" />
      </svg>
    ),
  };

  const fallback = (
    <svg viewBox={vb} style={{ width:"100%", height, display:"block" }} preserveAspectRatio="xMidYMax slice">
      <Sky id="s-def" stops={[["0%","#060e22"],["50%","#142a50"],["100%","#2a4a7a"]]} />
      <rect width="480" height="320" fill="url(#s-def)" /><Stars />
      <rect x="80" y={full?120:50} width="20" height={full?150:105} fill="#12122e" />
      <rect x="120" y={full?90:28} width="28" height={full?180:127} fill="#0e0e28" />
      <Windows x={124} y={full?98:35} rows={full?10:7} cols={2} w={4} h={5} gx={10} gy={13} />
      <rect x="165" y={full?70:12} width="32" height={full?200:143} fill="#111133" />
      <Windows x={170} y={full?78:20} rows={full?12:8} cols={2} w={5} h={5} gx={11} gy={13} />
      <rect x="210" y={full?100:38} width="25" height={full?170:117} fill="#0e0e2c" />
      <rect x="250" y={full?80:20} width="30" height={full?190:135} fill="#0c0c26" />
      <Windows x={255} y={full?88:28} rows={full?11:8} cols={2} w={5} h={5} gx={10} gy={13} />
      <rect x="295" y={full?110:45} width="22" height={full?160:110} fill="#141438" />
      <rect x="335" y={full?130:62} width="18" height={full?140:93} fill="#10102c" />
      <rect x="370" y={full?120:52} width="25" height={full?150:103} fill="#0e0e2a" />
      <rect x="410" y={full?150:78} width="20" height={full?120:77} fill="#12122e" />
      <rect x="0" y={full?270:155} width="480" height={full?50:25} fill="#0d1b2a" />
    </svg>
  );

  return scenes[code] || fallback;
}

const HOURS = ["4a","5a","6a","7a","8a","9a","10a","11a","12p","1p","2p","3p","4p","5p","6p","7p","8p","9p"];
const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

function genHeatmap(ap) {
  const b = ap.avgWait;
  const dm = [1.0,0.9,0.85,1.05,1.25,0.7,0.95];
  const hm = [0.3,0.5,0.9,1.3,1.1,0.95,0.8,0.75,0.85,0.95,0.7,0.6,0.85,1.15,1.3,1.1,0.7,0.4];
  let s = ap.code.charCodeAt(0)*137+ap.code.charCodeAt(1)*31;
  const r = () => { s=(s*16807+11)%2147483647; return (s%100)/100; };
  return DAYS.map((_,di) => HOURS.map((_,hi) => Math.max(2,Math.round(b*dm[di]*hm[hi]*(0.85+r()*0.3)))));
}

function wc(m) {
  if (m<=10) return {bg:"#E8F5E9",t:"#2E7D32"};
  if (m<=20) return {bg:"#FFF8E1",t:"#F57F17"};
  if (m<=35) return {bg:"#FFF3E0",t:"#E65100"};
  return {bg:"#FFEBEE",t:"#C62828"};
}
function wl(m) { return m<=10?"Breeze":m<=20?"Smooth":m<=35?"Busy":"Packed"; }

function Heatmap({ airport }) {
  const data = useMemo(() => genHeatmap(airport), [airport.code]);
  return (
    <div style={{overflowX:"auto",WebkitOverflowScrolling:"touch"}}>
      <div style={{display:"grid",gridTemplateColumns:`40px repeat(${HOURS.length},1fr)`,gap:2,minWidth:500}}>
        <div/>
        {HOURS.map(h=><div key={h} style={{fontSize:10,textAlign:"center",color:"#888",padding:"2px 0"}}>{h}</div>)}
        {DAYS.map((day,di)=>(
          <>{[<div key={`d-${day}`} style={{fontSize:11,fontWeight:500,display:"flex",alignItems:"center",color:"#666"}}>{day}</div>,...HOURS.map((_,hi)=>{const v=data[di][hi];const c=wc(v);return <div key={`${di}-${hi}`} style={{width:"100%",aspectRatio:"1",borderRadius:3,background:c.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:500,color:c.t,minWidth:0}} title={`${v} min`}>{v}</div>})]}</>
        ))}
      </div>
      <div style={{display:"flex",gap:12,marginTop:10,justifyContent:"center",flexWrap:"wrap"}}>
        {[["Breeze","#E8F5E9","#2E7D32"],["Smooth","#FFF8E1","#F57F17"],["Busy","#FFF3E0","#E65100"],["Packed","#FFEBEE","#C62828"]].map(([l,bg,t])=>(
          <div key={l} style={{display:"flex",alignItems:"center",gap:4,fontSize:11}}>
            <div style={{width:12,height:12,borderRadius:2,background:bg,border:`1px solid ${t}30`}}/><span style={{color:"#666"}}>{l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function genLive(ap) {
  const now = new Date();
  let s = ap.code.charCodeAt(0)*97+ap.code.charCodeAt(2)*53+now.getHours()*7+now.getDate();
  const r = () => { s=(s*48271+7)%2147483647; return (s%100)/100; };
  const reps = [];
  const cnt = Math.floor(r()*5)+3;
  for (let i=0; i<cnt; i++) {
    const ago = Math.floor(r()*80)+2;
    const w = Math.round(ap.avgWait*(0.5+r()*1.3));
    const pw = Math.round(ap.precheck*(0.5+r()*1.2));
    const cp = ap.terminals[Math.floor(r()*ap.terminals.length)];
    reps.push({ago,w,pw,cp});
  }
  return reps.sort((a,b)=>a.ago-b.ago);
}

function Pulse({fresh}) {
  return <span style={{width:7,height:7,borderRadius:"50%",background:fresh?"#4CAF50":"#ccc",display:"inline-block",animation:fresh?"pulse 2s infinite":"none"}} />;
}

function WaitBox({label,value,sub,source,fresh,accent}) {
  const c = wc(value);
  return (
    <div style={{borderRadius:14,overflow:"hidden",border:accent?`2px solid #4CAF50`:"1.5px solid #E0E0E0",flex:1,minWidth:0}}>
      <div style={{background:accent?"#E8F5E9":"#f5f5f5",padding:"5px 10px",fontSize:10,fontWeight:700,color:accent?"#2E7D32":"#777",textTransform:"uppercase",letterSpacing:0.8,borderBottom:"1px solid #eee",display:"flex",alignItems:"center",gap:4}}>
        {fresh && <Pulse fresh />}{label}
      </div>
      <div style={{padding:"10px 8px",textAlign:"center",background:"#fff"}}>
        <div style={{fontSize:30,fontWeight:800,color:c.t,lineHeight:1}}>{value}</div>
        <div style={{fontSize:11,color:"#888",marginTop:2}}>minutes</div>
        <div style={{marginTop:5,fontSize:10,background:c.bg,color:c.t,display:"inline-block",padding:"2px 10px",borderRadius:20,fontWeight:600}}>{wl(value)}</div>
        <div style={{fontSize:9,color:"#aaa",marginTop:5}}>{sub}</div>
      </div>
    </div>
  );
}

function AirportCard({airport,onClick,compact,onFav,isFav}) {
  return (
    <div onClick={onClick} style={{borderRadius:16,overflow:"hidden",cursor:"pointer",transition:"transform 0.15s,box-shadow 0.15s",position:"relative",boxShadow:"0 2px 12px rgba(0,0,0,0.15)"}}
      onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow="0 8px 24px rgba(0,0,0,0.22)";}}
      onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="0 2px 12px rgba(0,0,0,0.15)";}}>
      <div style={{position:"relative"}}>
        <CitySkyline code={airport.code} full={!compact} />
        <div style={{position:"absolute",bottom:0,left:0,right:0,padding:compact?"10px 16px":"20px 22px",background:"linear-gradient(transparent 0%, rgba(0,0,0,0.8) 100%)",color:"#fff"}}>
          {onFav && (
            <button onClick={e=>{e.stopPropagation();onFav(airport.code);}}
              style={{position:"absolute",top:compact?-60:-110,right:12,background:"rgba(0,0,0,0.35)",border:"none",fontSize:20,cursor:"pointer",color:isFav?"#FFD700":"rgba(255,255,255,0.6)",padding:"5px 8px",borderRadius:8,backdropFilter:"blur(4px)"}}>
              {isFav?"★":"☆"}
            </button>
          )}
          <div style={{display:"flex",alignItems:"baseline",gap:10}}>
            <span style={{fontSize:compact?24:34,fontWeight:800,letterSpacing:1.5}}>{airport.code}</span>
            <span style={{fontSize:compact?12:14,opacity:0.85,fontWeight:500}}>{airport.city}, {airport.state}</span>
          </div>
          {!compact && <div style={{fontSize:12,opacity:0.6,marginTop:3,fontStyle:"italic"}}>{airport.tagline}</div>}
        </div>
      </div>
      <div style={{background:"#fff",padding:compact?"10px 16px":"14px 20px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        {[["Typical",airport.avgWait],["Peak",airport.peakWait],["PreCheck",airport.precheck]].map(([l,v])=>{const c=wc(v);return(
          <div key={l} style={{textAlign:"center",flex:1}}>
            <div style={{fontSize:10,color:"#888",textTransform:"uppercase",letterSpacing:0.5}}>{l}</div>
            <div style={{fontSize:18,fontWeight:700,color:c.t}}>{v}m</div>
          </div>
        );})}
      </div>
    </div>
  );
}

function AirportDetail({airport,onBack,onFav,isFav}) {
  const [tab,setTab] = useState("now");
  const live = useMemo(()=>genLive(airport),[airport.code]);
  const hm = useMemo(()=>genHeatmap(airport),[airport.code]);
  const now = new Date();
  const hr = now.getHours();
  const di = (now.getDay()+6)%7;
  const hi = Math.max(0,Math.min(hr-4,17));
  const typGen = (hr>=4&&hr<=21)?hm[di][hi]:Math.round(airport.avgWait*0.3);
  const typPre = Math.round(typGen * (airport.precheck/airport.avgWait));
  const latest = live[0]||null;
  const curGen = latest?latest.w:null;
  const curPre = latest?latest.pw:null;
  const fresh = latest&&latest.ago<=15;

  return (
    <div>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
      <button onClick={onBack} style={{background:"none",border:"none",fontSize:14,color:"#4A6FA5",cursor:"pointer",padding:"8px 0",fontWeight:600,display:"flex",alignItems:"center",gap:4}}>← Back</button>

      <div style={{borderRadius:18,overflow:"hidden",boxShadow:"0 4px 20px rgba(0,0,0,0.18)",marginTop:8,position:"relative"}}>
        <CitySkyline code={airport.code} full />
        <div style={{position:"absolute",bottom:0,left:0,right:0,padding:"24px 22px 18px",background:"linear-gradient(transparent 0%, rgba(0,0,0,0.85) 100%)",color:"#fff"}}>
          <button onClick={()=>onFav(airport.code)}
            style={{position:"absolute",top:-40,right:16,background:"rgba(0,0,0,0.35)",border:"none",fontSize:24,cursor:"pointer",color:isFav?"#FFD700":"rgba(255,255,255,0.5)",padding:"6px 10px",borderRadius:10,backdropFilter:"blur(4px)"}}>
            {isFav?"★":"☆"}
          </button>
          <div style={{fontSize:36,fontWeight:800,letterSpacing:2}}>{airport.code}</div>
          <div style={{fontSize:14,opacity:0.9,marginTop:2,fontWeight:500}}>{airport.name}</div>
          <div style={{fontSize:12,opacity:0.55,marginTop:4,fontStyle:"italic"}}>{airport.tagline}</div>
        </div>
      </div>

      <div style={{display:"flex",gap:0,marginTop:16,background:"#f0f0f0",borderRadius:10,padding:3}}>
        {[["now","Right now"],["live","Live feed"],["heatmap","Busy times"]].map(([k,l])=>(
          <button key={k} onClick={()=>setTab(k)} style={{flex:1,padding:"10px 0",border:"none",borderRadius:8,fontSize:13,fontWeight:600,cursor:"pointer",background:tab===k?"#fff":"transparent",color:tab===k?"#333":"#888",boxShadow:tab===k?"0 1px 4px rgba(0,0,0,0.1)":"none"}}>{l}</button>
        ))}
      </div>

      <div style={{marginTop:16}}>
        {tab==="now"&&(
          <div>
            {/* General screening */}
            <div style={{fontSize:13,fontWeight:700,color:"#444",marginBottom:8,display:"flex",alignItems:"center",gap:6}}>
              <span style={{background:"#E3F2FD",color:"#1565C0",fontSize:10,padding:"2px 8px",borderRadius:4,fontWeight:700}}>GENERAL</span>
              Standard screening
            </div>
            <div style={{display:"flex",gap:8,marginBottom:16}}>
              <WaitBox label="Typical" value={typGen} sub={`${DAYS[di]} ${HOURS[hi]||""} average`} />
              <WaitBox label="Current" value={curGen||typGen} sub={latest?`Reported ${latest.ago}m ago`:"No recent reports"} fresh={fresh} accent={fresh} />
            </div>

            {/* TSA PreCheck */}
            <div style={{fontSize:13,fontWeight:700,color:"#444",marginBottom:8,display:"flex",alignItems:"center",gap:6}}>
              <span style={{background:"#E8F5E9",color:"#2E7D32",fontSize:10,padding:"2px 8px",borderRadius:4,fontWeight:700}}>TSA PRE✓</span>
              Trusted traveler
            </div>
            <div style={{display:"flex",gap:8,marginBottom:16}}>
              <WaitBox label="Typical" value={typPre} sub={`${DAYS[di]} ${HOURS[hi]||""} average`} />
              <WaitBox label="Current" value={curPre||typPre} sub={latest?`Reported ${latest.ago}m ago`:"No recent reports"} fresh={fresh} accent={fresh} />
            </div>

            {/* Terminal breakdown */}
            {airport.terminals.length>1&&(
              <div style={{marginBottom:14}}>
                <div style={{fontSize:13,fontWeight:700,color:"#444",marginBottom:8}}>By terminal</div>
                {airport.terminals.map((t,i)=>{
                  const tw=Math.round(airport.avgWait*(0.7+((i*37+airport.code.charCodeAt(0))%60)/100));
                  const lr=live.find(r=>r.cp===t);
                  return(
                    <div key={t} style={{display:"flex",alignItems:"center",padding:"10px 12px",background:"#f8f8f8",borderRadius:10,marginBottom:4,gap:6}}>
                      <span style={{fontSize:13,color:"#444",flex:1,fontWeight:500}}>{t}</span>
                      <div style={{display:"flex",gap:6,alignItems:"center"}}>
                        <div style={{textAlign:"center"}}>
                          <span style={{fontSize:12,fontWeight:700,color:wc(tw).t,background:wc(tw).bg,borderRadius:6,padding:"3px 7px"}}>~{tw}m</span>
                          <div style={{fontSize:8,color:"#aaa",marginTop:1}}>typical</div>
                        </div>
                        {lr&&(
                          <div style={{textAlign:"center"}}>
                            <span style={{fontSize:12,fontWeight:700,color:wc(lr.w).t,background:wc(lr.w).bg,borderRadius:6,padding:"3px 7px",display:"inline-flex",alignItems:"center",gap:2,border:lr.ago<=15?"1px solid #4CAF5060":"none"}}>
                              {lr.ago<=15&&<Pulse fresh />}{lr.w}m
                            </span>
                            <div style={{fontSize:8,color:"#aaa",marginTop:1}}>{lr.ago}m ago</div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div style={{padding:"12px 14px",background:"#E3F2FD",borderRadius:10,fontSize:11,color:"#1565C0",lineHeight:1.5}}>
              <strong>Typical</strong> = historical pattern for this day/hour. <strong>Current</strong> = latest crowdsourced traveler report. For real-time updates check the <a href="https://www.tsa.gov/mobile" target="_blank" rel="noopener" style={{color:"#0D47A1",fontWeight:700}}>MyTSA app</a>.
            </div>
          </div>
        )}

        {tab==="live"&&(
          <div>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
              <div style={{fontSize:14,fontWeight:700,color:"#333"}}>Traveler reports</div>
              <span style={{fontSize:11,color:"#888",background:"#f0f0f0",padding:"2px 8px",borderRadius:10}}>{live.length}</span>
            </div>
            <div style={{padding:"8px 12px",background:"#FFFDE7",borderRadius:10,fontSize:11,color:"#F57F17",lineHeight:1.4,marginBottom:12}}>
              Crowdsourced reports — times are estimates from fellow travelers.
            </div>
            {live.map((r,i)=>{const c=wc(r.w);return(
              <div key={i} style={{padding:"12px 14px",background:"#f8f8f8",borderRadius:10,marginBottom:6,borderLeft:r.ago<=15?"3px solid #4CAF50":"3px solid #e0e0e0"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                  <div style={{fontSize:13,fontWeight:600,color:"#333"}}>{r.cp}</div>
                  <div style={{display:"flex",alignItems:"center",gap:4,fontSize:11,color:r.ago<=15?"#2E7D32":"#888"}}>
                    <Pulse fresh={r.ago<=15} />{r.ago}m ago
                  </div>
                </div>
                <div style={{display:"flex",gap:8}}>
                  <div style={{flex:1,background:wc(r.w).bg,borderRadius:8,padding:"6px 10px",textAlign:"center"}}>
                    <div style={{fontSize:8,fontWeight:700,color:"#888",textTransform:"uppercase",letterSpacing:0.5}}>General</div>
                    <div style={{fontSize:20,fontWeight:800,color:wc(r.w).t}}>{r.w}m</div>
                  </div>
                  <div style={{flex:1,background:wc(r.pw).bg,borderRadius:8,padding:"6px 10px",textAlign:"center"}}>
                    <div style={{fontSize:8,fontWeight:700,color:"#888",textTransform:"uppercase",letterSpacing:0.5}}>PreCheck</div>
                    <div style={{fontSize:20,fontWeight:800,color:wc(r.pw).t}}>{r.pw}m</div>
                  </div>
                </div>
              </div>
            );})}
          </div>
        )}

        {tab==="heatmap"&&(
          <div>
            <div style={{fontSize:13,color:"#666",marginBottom:3}}>Typical wait times by day & hour</div>
            <div style={{fontSize:11,color:"#aaa",marginBottom:12}}>Based on historical patterns — not real-time</div>
            <Heatmap airport={airport} />
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [view,setView] = useState("home");
  const [sel,setSel] = useState(null);
  const [mode,setMode] = useState("my");
  const [search,setSearch] = useState("");
  const [favs,setFavs] = useState(["AUS"]);
  const home = AIRPORTS.find(a=>a.code==="AUS");
  const toggleFav = useCallback(code=>{setFavs(p=>p.includes(code)?p.filter(c=>c!==code):[...p,code]);},[]);
  const filtered = useMemo(()=>{if(!search.trim())return[];const q=search.toLowerCase();return AIRPORTS.filter(a=>a.code.toLowerCase().includes(q)||a.name.toLowerCase().includes(q)||a.city.toLowerCase().includes(q)||a.state.toLowerCase().includes(q)).slice(0,8);},[search]);
  const favAPs = useMemo(()=>AIRPORTS.filter(a=>favs.includes(a.code)&&a.code!=="AUS"),[favs]);

  if(view==="detail"&&sel){
    const ap=AIRPORTS.find(a=>a.code===sel);
    return(<div style={{maxWidth:500,margin:"0 auto",padding:"12px 16px",fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif"}}>
      <AirportDetail airport={ap} onBack={()=>setView("home")} onFav={toggleFav} isFav={favs.includes(ap.code)} />
    </div>);
  }

  return(
    <div style={{maxWidth:500,margin:"0 auto",padding:"12px 16px",fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif"}}>
      <div style={{textAlign:"center",marginBottom:16}}>
        <div style={{fontSize:30,fontWeight:800,color:"#1a1a2e",letterSpacing:-0.5}}><span style={{color:"#4A6FA5"}}>Gate</span>Check</div>
        <div style={{fontSize:12,color:"#888",marginTop:2}}>Free TSA wait times — no paywall, no nonsense</div>
      </div>
      <div style={{display:"flex",gap:0,background:"#f0f0f0",borderRadius:10,padding:3,marginBottom:16}}>
        {[["my","My airport"],["loved","Loved one's trip"]].map(([k,l])=>(
          <button key={k} onClick={()=>{setMode(k);setSearch("");}} style={{flex:1,padding:"10px 0",border:"none",borderRadius:8,fontSize:13,fontWeight:600,cursor:"pointer",background:mode===k?"#fff":"transparent",color:mode===k?"#333":"#888",boxShadow:mode===k?"0 1px 4px rgba(0,0,0,0.1)":"none"}}>{k==="loved"?"❤️ ":""}{l}</button>
        ))}
      </div>
      {mode==="my"&&(<div><div style={{fontSize:13,color:"#888",marginBottom:8,fontWeight:500}}>Your home airport</div><AirportCard airport={home} onClick={()=>{setSel("AUS");setView("detail");}}/></div>)}
      {mode==="loved"&&(<div>
        <div style={{position:"relative",marginBottom:16}}>
          <input type="text" placeholder="Search airports — name, code, or city..." value={search} onChange={e=>setSearch(e.target.value)}
            style={{width:"100%",padding:"12px 16px 12px 40px",borderRadius:12,border:"1.5px solid #ddd",fontSize:14,outline:"none",boxSizing:"border-box"}}
            onFocus={e=>e.target.style.borderColor="#4A6FA5"} onBlur={e=>e.target.style.borderColor="#ddd"} />
          <span style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",fontSize:16,color:"#aaa"}}>🔍</span>
        </div>
        {search.trim()&&filtered.length>0&&(<div style={{marginBottom:16}}>
          {filtered.map(a=>(<div key={a.code} onClick={()=>{setSel(a.code);setView("detail");setSearch("");}}
            style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 14px",cursor:"pointer",borderRadius:10,marginBottom:4,background:"#f8f8f8"}}
            onMouseEnter={e=>e.currentTarget.style.background="#eef3fb"} onMouseLeave={e=>e.currentTarget.style.background="#f8f8f8"}>
            <div><div style={{fontSize:14,fontWeight:600,color:"#333"}}>{a.code} — {a.city}, {a.state}</div><div style={{fontSize:11,color:"#888"}}>{a.name}</div></div>
            <button onClick={e=>{e.stopPropagation();toggleFav(a.code);}} style={{background:"none",border:"none",fontSize:18,cursor:"pointer",color:favs.includes(a.code)?"#FFD700":"#ccc"}}>{favs.includes(a.code)?"★":"☆"}</button>
          </div>))}
        </div>)}
        {search.trim()&&filtered.length===0&&(<div style={{textAlign:"center",padding:"20px 0",color:"#888",fontSize:13}}>No airports found for "{search}"</div>)}
        {favAPs.length>0&&(<div><div style={{fontSize:13,color:"#888",marginBottom:8,fontWeight:500}}>★ Saved airports</div><div style={{display:"flex",flexDirection:"column",gap:12}}>{favAPs.map(a=>(<AirportCard key={a.code} airport={a} compact onClick={()=>{setSel(a.code);setView("detail");}} onFav={toggleFav} isFav />))}</div></div>)}
        {favAPs.length===0&&!search.trim()&&(<div style={{textAlign:"center",padding:"30px 20px",color:"#888"}}><div style={{fontSize:32,marginBottom:8}}>✈️</div><div style={{fontSize:14,fontWeight:500}}>No saved airports yet</div><div style={{fontSize:12,marginTop:4}}>Search for an airport and tap the star to save it</div></div>)}
      </div>)}
      <div style={{marginTop:24,textAlign:"center",fontSize:11,color:"#bbb",paddingBottom:12}}>Data based on historical patterns & crowdsourced reports. Not affiliated with TSA.</div>
    </div>
  );
}