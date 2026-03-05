import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Register from './components/Register';

/* ═══════════════════════════════════════════════
   INJECT GLOBAL STYLES
═══════════════════════════════════════════════ */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #070b11; font-family: 'DM Sans', 'Segoe UI', sans-serif; color: #e2e8f0; }
  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: #0d1117; }
  ::-webkit-scrollbar-thumb { background: #1e2a38; border-radius: 3px; }
  @keyframes fadeUp   { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
  @keyframes slideIn  { from { opacity:0; transform:translateX(24px); } to { opacity:1; transform:translateX(0); } }
  @keyframes blink    { 0%,100% { opacity:1; } 50% { opacity:0.3; } }
  .fu { animation: fadeUp  0.4s ease both; }
  .si { animation: slideIn 0.3s ease both; }
  .nav-item:hover   { background: rgba(34,197,94,0.08) !important; color: #86efac !important; }
  .row-hover:hover  { background: rgba(34,197,94,0.04) !important; }
  .cat-btn:hover    { border-color: #22c55e !important; color: #22c55e !important; }
  .green-btn:hover  { background: #15803d !important; }
  .sim-opt:hover    { border-color: rgba(34,197,94,0.4) !important; }
`;

function InjectStyles() {
  useEffect(() => {
    const el = document.createElement('style');
    el.innerHTML = STYLES;
    document.head.appendChild(el);
    return () => document.head.removeChild(el);
  }, []);
  return null;
}

/* ═══════════════════════════════════════════════
   MOCK DATA
═══════════════════════════════════════════════ */
const INIT = {
  name: 'Alex Chen',
  totalSaved: 1247.83,
  roundUpsToday: 6.42,
  todayCount: 4,
  boostMultiplier: 2.4,
  currentSavings: 1248,
  savingsGoal: 2000,
  trustScore: 720,
  streak: 14,
  lessonsCompleted: 2,
  vaultBalance: 1247.83,
  vaultCapacity: 5000,
  vaultGrowth: 23,
  vaultAPY: 4.5,
  educationEligible: 980.50,
  savingsGrowth: [
    { month:'Sep', value:45  },{ month:'Oct', value:78  },
    { month:'Nov', value:92  },{ month:'Dec', value:156 },
    { month:'Jan', value:203 },{ month:'Feb', value:267 },
  ],
  recentTxns: [
    { id:1, name:'Starbucks',      cat:'Coffee',        icon:'☕', amount:4.75,  saved:0.25, mult:1, time:'9:42 AM'  },
    { id:2, name:'AMC Theaters',   cat:'Entertainment', icon:'🎬', amount:12.30, saved:2.70, mult:2, time:'8:15 AM'  },
    { id:3, name:'Target',         cat:'Shopping',      icon:'🛍️', amount:23.47, saved:0.53, mult:1, time:'6:30 PM'  },
    { id:4, name:'Chipotle',       cat:'Fast Food',     icon:'🌯', amount:9.85,  saved:2.15, mult:2, time:'1:20 PM'  },
    { id:5, name:'Barnes & Noble', cat:'Education',     icon:'📚', amount:18.99, saved:0.01, mult:1, time:'4:10 PM'  },
  ],
  allTxns: [
    { id:1, name:'Starbucks',      cat:'Coffee',        icon:'☕', amount:4.75,  rounded:5.00,  saved:0.25, mult:1, date:'Feb 28' },
    { id:2, name:'AMC Theaters',   cat:'Entertainment', icon:'🎬', amount:12.30, rounded:15.00, saved:2.70, mult:3, date:'Feb 28' },
    { id:3, name:'Target',         cat:'Shopping',      icon:'🛍️', amount:23.47, rounded:24.00, saved:0.53, mult:1, date:'Feb 27' },
    { id:4, name:'Chipotle',       cat:'Fast Food',     icon:'🌯', amount:9.85,  rounded:12.00, saved:2.15, mult:2, date:'Feb 27' },
    { id:5, name:'Barnes & Noble', cat:'Education',     icon:'📚', amount:18.99, rounded:19.00, saved:0.01, mult:1, date:'Feb 26' },
    { id:6, name:'Spotify',        cat:'Entertainment', icon:'🎵', amount:9.99,  rounded:12.00, saved:2.01, mult:2, date:'Feb 26' },
    { id:7, name:'Walmart',        cat:'Groceries',     icon:'🛒', amount:67.80, rounded:68.00, saved:0.20, mult:1, date:'Feb 25' },
    { id:8, name:'Uber Eats',      cat:'Fast Food',     icon:'🛵', amount:14.60, rounded:16.00, saved:2.80, mult:2, date:'Feb 25' },
  ],
  catBreakdown: [
    { cat:'Fast Food',     saved:45.80, txns:8,  color:'#f97316' },
    { cat:'Coffee',        saved:32.50, txns:12, color:'#f59e0b' },
    { cat:'Shopping',      saved:28.75, txns:6,  color:'#38bdf8' },
    { cat:'Entertainment', saved:24.30, txns:4,  color:'#a78bfa' },
    { cat:'Education',     saved:12.40, txns:2,  color:'#22c55e' },
    { cat:'Groceries',     saved:8.90,  txns:3,  color:'#34d399' },
  ],
  lessons: [
    { id:1, title:'Why Saving Early Matters',        dur:'5 min', pts:0,   emoji:'📚', done:true  },
    { id:2, title:'Understanding Compound Interest', dur:'5 min', pts:200, emoji:'📈', done:true  },
    { id:3, title:'Budgeting on a Student Income',   dur:'5 min', pts:400, emoji:'💡', done:false },
    { id:4, title:'Introduction to Index Funds',     dur:'5 min', pts:600, emoji:'🏦', done:false },
    { id:5, title:'Building Your Credit Score',      dur:'5 min', pts:800, emoji:'🎯', done:false },
  ],
};

const SIM_OPTS = [
  { name:"Starbucks",    icon:"☕", cat:"Coffee",        amount:4.50  },
  { name:"McDonald's",   icon:"🍔", cat:"Fast Food",     amount:8.75  },
  { name:"Netflix",      icon:"🎬", cat:"Entertainment", amount:15.99 },
  { name:"Amazon",       icon:"📦", cat:"Shopping",      amount:34.47 },
  { name:"Walmart",      icon:"🛒", cat:"Groceries",     amount:67.80 },
  { name:"Uber Eats",    icon:"🛵", cat:"Fast Food",     amount:14.60 },
  { name:"Spotify",      icon:"🎵", cat:"Entertainment", amount:9.99  },
  { name:"Barnes",       icon:"📚", cat:"Education",     amount:18.99 },
];

const MULT = { 'Fast Food':2, 'Entertainment':2, 'Shopping':1.5, 'Coffee':1, 'Groceries':1, 'Education':1 };
const CAT_COLOR = { 'Fast Food':'#f97316','Entertainment':'#a78bfa','Shopping':'#38bdf8','Coffee':'#f59e0b','Groceries':'#34d399','Education':'#22c55e' };

const fmt = n => Number(n).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});

/* ═══════════════════════════════════════════════
   REUSABLE PIECES
═══════════════════════════════════════════════ */

function Card({ label, value, sub, badge, icon, accent, delay=0 }) {
  return (
    <div className="fu" style={{ flex:1, background:'#0d1520', border:'1px solid #111b27', borderRadius:14, padding:'20px 22px', animationDelay:`${delay}s` }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
        <div>
          <div style={{ color:'#334155', fontSize:10.5, fontWeight:600, letterSpacing:1.2, textTransform:'uppercase', marginBottom:9 }}>{label}</div>
          <div style={{ color:accent||'#f1f5f9', fontSize:24, fontWeight:700, fontFamily:"'DM Mono',monospace", marginBottom:4 }}>{value}</div>
          {sub   && <div style={{ color:'#475569', fontSize:12 }}>{sub}</div>}
          {badge && <div style={{ color:'#22c55e', fontSize:12, marginTop:5 }}>{badge}</div>}
        </div>
        {icon && <div style={{ width:40, height:40, borderRadius:10, background:'rgba(34,197,94,0.07)', border:'1px solid rgba(34,197,94,0.12)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>{icon}</div>}
      </div>
    </div>
  );
}

function Box({ children, delay=0, style={} }) {
  return (
    <div className="fu" style={{ background:'#0d1520', border:'1px solid #111b27', borderRadius:14, padding:24, animationDelay:`${delay}s`, ...style }}>
      {children}
    </div>
  );
}

function BoxLabel({ children }) {
  return <div style={{ color:'#334155', fontSize:10.5, fontWeight:600, letterSpacing:1.2, textTransform:'uppercase', marginBottom:14 }}>{children}</div>;
}

function BarChart({ data }) {
  const max = Math.max(...data.map(d=>d.value));
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
      {data.map(d => (
        <div key={d.month} style={{ display:'flex', alignItems:'center', gap:12 }}>
          <span style={{ color:'#475569', fontSize:12, width:28 }}>{d.month}</span>
          <div style={{ flex:1, background:'#111b27', borderRadius:4, height:8 }}>
            <div style={{ width:`${(d.value/max)*100}%`, height:'100%', background:'linear-gradient(90deg,#15803d,#22c55e)', borderRadius:4, transition:'width 1.2s ease' }}/>
          </div>
          <span style={{ color:'#e2e8f0', fontSize:12, width:36, textAlign:'right', fontFamily:"'DM Mono',monospace" }}>${d.value}</span>
        </div>
      ))}
    </div>
  );
}

function TrustGauge({ score }) {
  const r=56, cx=72, cy=72;
  const circ=Math.PI*r;
  const pct=Math.min(score/1000,1);
  const col=score>=700?'#22c55e':score>=500?'#f59e0b':'#f87171';
  const lbl=score>=700?'Excellent':score>=500?'Good':'Building';
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
      <svg width="144" height="96" viewBox="0 0 144 96">
        <path d={`M ${cx-r} ${cy} A ${r} ${r} 0 0 1 ${cx+r} ${cy}`} fill="none" stroke="#1e2a38" strokeWidth="11" strokeLinecap="round"/>
        <path d={`M ${cx-r} ${cy} A ${r} ${r} 0 0 1 ${cx+r} ${cy}`} fill="none" stroke={col} strokeWidth="11" strokeLinecap="round"
          strokeDasharray={`${pct*circ} ${circ}`} style={{ transition:'stroke-dasharray 1.2s ease' }}/>
        <text x={cx} y={cy-6}  textAnchor="middle" fill="#f1f5f9" fontSize="26" fontWeight="700" fontFamily="DM Mono">{score}</text>
        <text x={cx} y={cy+13} textAnchor="middle" fill={col}    fontSize="11" fontWeight="600">{lbl}</text>
        <text x={cx-r+4}  y={cy+20} fill="#334155" fontSize="10">0</text>
        <text x={cx+r-4}  y={cy+20} textAnchor="end" fill="#334155" fontSize="10">1000</text>
      </svg>
      {score>=500 && (
        <div style={{ background:'rgba(34,197,94,0.08)', border:'1px solid rgba(34,197,94,0.2)', borderRadius:8, padding:'7px 12px', fontSize:12, color:'#22c55e', textAlign:'center', marginTop:6 }}>
          ✅ Eligible for loans up to $500
        </div>
      )}
    </div>
  );
}

function CatBadge({ cat }) {
  const col = CAT_COLOR[cat] || '#94a3b8';
  return (
    <span style={{ background:`${col}18`, color:col, fontSize:11, padding:'3px 9px', borderRadius:20, fontWeight:500, whiteSpace:'nowrap' }}>{cat}</span>
  );
}

function Toast({ msg, onClose }) {
  useEffect(() => { const t=setTimeout(onClose,3000); return ()=>clearTimeout(t); },[]);
  return (
    <div className="si" style={{ position:'fixed', top:22, right:22, zIndex:9999, background:'linear-gradient(135deg,#14532d,#166534)', border:'1px solid #22c55e', color:'#dcfce7', padding:'13px 18px', borderRadius:12, fontWeight:600, fontSize:14, boxShadow:'0 8px 32px rgba(34,197,94,0.3)', display:'flex', alignItems:'center', gap:10 }}>
      <span style={{fontSize:20}}>🎉</span> {msg}
      <button onClick={onClose} style={{ background:'none', border:'none', color:'#86efac', cursor:'pointer', fontSize:18, marginLeft:6 }}>×</button>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   SIDEBAR
═══════════════════════════════════════════════ */
const NAV = [
  { id:'dashboard',    label:'Dashboard',    icon:'⊞' },
  { id:'transactions', label:'Transactions', icon:'⇅' },
  { id:'trustscore',   label:'Trust Score',  icon:'◎' },
  { id:'vault',        label:'Smart Vault',  icon:'⬡' },
  { id:'learn',        label:'MicroLearn',   icon:'◈' },
  { id:'simulate',     label:'Simulate',     icon:'⚡' },
];

function Sidebar({ page, setPage, streak, userName, onLogout }) {
  return (
    <aside style={{ width:222, minHeight:'100vh', background:'#080c12', borderRight:'1px solid #0f1923', display:'flex', flexDirection:'column', position:'fixed', top:0, left:0, zIndex:200 }}>
      {/* Logo */}
      <div style={{ padding:'26px 20px 22px', borderBottom:'1px solid #0f1923' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:36, height:36, borderRadius:10, background:'linear-gradient(135deg,#22c55e,#16a34a)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, fontWeight:800, color:'#000' }}>C</div>
          <div>
            <div style={{ color:'#f1f5f9', fontWeight:700, fontSize:16, fontFamily:"'DM Mono',monospace", letterSpacing:'-0.3px' }}>CoinStash</div>
            <div style={{ color:'#334155', fontSize:11 }}>Student Edition</div>
          </div>
        </div>
      </div>
      {/* Nav */}
      <nav style={{ flex:1, padding:'10px 0' }}>
        {NAV.map(n => (
          <button key={n.id} className="nav-item" onClick={()=>setPage(n.id)} style={{
            width:'100%', display:'flex', alignItems:'center', gap:11, padding:'11px 20px',
            background: page===n.id ? 'rgba(34,197,94,0.1)' : 'transparent',
            border:'none', cursor:'pointer',
            color: page===n.id ? '#22c55e' : '#4b5563',
            fontSize:13.5, fontWeight: page===n.id ? 600 : 400,
            borderLeft: page===n.id ? '3px solid #22c55e' : '3px solid transparent',
            transition:'all 0.15s', textAlign:'left',
          }}>
            <span style={{ fontSize:15, width:18, textAlign:'center' }}>{n.icon}</span>
            <span style={{ flex:1 }}>{n.label}</span>
            {n.id==='learn'    && <span style={{ background:'#22c55e', color:'#000', fontSize:10, fontWeight:700, padding:'2px 6px', borderRadius:9 }}>🔥{streak}</span>}
            {n.id==='simulate' && <span style={{ background:'rgba(34,197,94,0.15)', color:'#22c55e', fontSize:10, padding:'2px 6px', borderRadius:9 }}>LIVE</span>}
          </button>
        ))}
      </nav>
      {/* User + Logout */}
      <div style={{ padding:'16px 20px', borderTop:'1px solid #0f1923' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
          <div style={{ width:34, height:34, borderRadius:'50%', background:'linear-gradient(135deg,#22c55e,#0ea5e9)', display:'flex', alignItems:'center', justifyContent:'center', color:'#000', fontWeight:700, fontSize:13 }}>
            {userName ? userName.charAt(0).toUpperCase() : 'A'}
          </div>
          <div>
            <div style={{ color:'#e2e8f0', fontSize:13, fontWeight:600 }}>{userName || 'Alex Chen'}</div>
            <div style={{ color:'#334155', fontSize:11 }}>Student</div>
          </div>
        </div>
        {/* Logout button */}
        <button
          onClick={onLogout}
          style={{
            width:'100%', background:'transparent', border:'1px solid #1e2a38',
            borderRadius:8, padding:'8px', color:'#4b5563', fontSize:12,
            cursor:'pointer', transition:'all 0.15s', fontFamily:"'DM Sans',sans-serif",
          }}
          onMouseEnter={e => { e.target.style.borderColor='#f87171'; e.target.style.color='#f87171'; }}
          onMouseLeave={e => { e.target.style.borderColor='#1e2a38'; e.target.style.color='#4b5563'; }}
        >
          ⎋ Sign Out
        </button>
      </div>
    </aside>
  );
}

/* ═══════════════════════════════════════════════
   PAGE: DASHBOARD
═══════════════════════════════════════════════ */
function Dashboard({ d, onSim }) {
  const h = new Date().getHours();
  const greet = h<12?'Good morning':h<17?'Good afternoon':'Good evening';
  const goalPct = Math.round((d.currentSavings/d.savingsGoal)*100);

  return (
    <div>
      <div className="fu" style={{ marginBottom:28 }}>
        <h1 style={{ color:'#f1f5f9', fontSize:26, fontWeight:700, letterSpacing:'-0.5px' }}>
          {greet}, <span style={{ color:'#22c55e' }}>{d.name}</span> 👋
        </h1>
        <p style={{ color:'#475569', fontSize:14, marginTop:6 }}>
          You've saved <strong style={{ color:'#22c55e' }}>${fmt(d.roundUpsToday)}</strong> today from {d.todayCount} transactions
        </p>
      </div>

      <div style={{ display:'flex', gap:14, marginBottom:20 }}>
        <Card delay={0.04} label="Total Saved"      value={`$${fmt(d.totalSaved)}`}       badge="↑ 23% vs last month" icon="🐷" />
        <Card delay={0.08} label="Round-Ups Today"  value={`$${fmt(d.roundUpsToday)}`}    sub={`${d.todayCount} transactions`} badge="↑ 12% vs last month" icon="⇅" />
        <Card delay={0.12} label="Boost Multiplier" value={`${d.boostMultiplier}×`}       sub="Avg. this week" icon="⚡" />
        <Card delay={0.16} label="Savings Goal"     value={`${goalPct}%`} accent="#22c55e"
          sub={`$${d.currentSavings.toLocaleString()} / $${d.savingsGoal.toLocaleString()}`} badge="↑ 8% vs last month" icon="🎯" />
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 290px', gap:14, marginBottom:20 }}>
        <Box delay={0.20}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
            <BoxLabel>Savings Growth</BoxLabel>
            <span style={{ color:'#22c55e', fontSize:13, fontWeight:600, fontFamily:"'DM Mono',monospace" }}>${fmt(d.totalSaved)} total</span>
          </div>
          <BarChart data={d.savingsGrowth}/>
        </Box>

        <Box delay={0.24} style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
          <BoxLabel>Trust Score</BoxLabel>
          <TrustGauge score={d.trustScore}/>
          {d.trustScore < 1000 && (
            <div style={{ marginTop:10, width:'100%', background:'rgba(251,191,36,0.06)', border:'1px solid rgba(251,191,36,0.16)', borderRadius:8, padding:'8px 12px', fontSize:12, color:'#fbbf24', textAlign:'center' }}>
              ⚡ {1000-d.trustScore} pts to Elite Status
            </div>
          )}
        </Box>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 290px', gap:14 }}>
        <Box delay={0.28}>
          <BoxLabel>Recent Round-Ups</BoxLabel>
          {d.recentTxns.map(tx => (
            <div key={tx.id} className="row-hover" style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'11px 8px', borderBottom:'1px solid #0d1520', borderRadius:8, transition:'background 0.14s' }}>
              <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                <div style={{ width:38, height:38, borderRadius:10, background:'#111b27', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>{tx.icon}</div>
                <div>
                  <div style={{ color:'#e2e8f0', fontSize:13.5, fontWeight:500 }}>{tx.name}</div>
                  <div style={{ display:'flex', gap:8, marginTop:3, alignItems:'center' }}>
                    <CatBadge cat={tx.cat}/>
                    <span style={{ color:'#334155', fontSize:11 }}>{tx.time}</span>
                  </div>
                </div>
              </div>
              <div style={{ textAlign:'right' }}>
                <div style={{ color:'#475569', fontSize:12, fontFamily:"'DM Mono',monospace" }}>${fmt(tx.amount)}</div>
                <div style={{ color:'#22c55e', fontSize:13, fontWeight:600, fontFamily:"'DM Mono',monospace" }}>+${fmt(tx.saved)}</div>
                {tx.mult>1 && <div style={{ color:'#60a5fa', fontSize:11 }}>×{tx.mult} boost</div>}
              </div>
            </div>
          ))}
        </Box>

        <Box delay={0.32}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:16 }}>
            <BoxLabel>Smart Vault</BoxLabel>
            <span style={{ background:'rgba(34,197,94,0.1)', color:'#22c55e', fontSize:11, padding:'3px 8px', borderRadius:20, border:'1px solid rgba(34,197,94,0.2)', height:'fit-content' }}>● Active</span>
          </div>
          <div style={{ color:'#475569', fontSize:12 }}>Total Vaulted</div>
          <div style={{ color:'#f1f5f9', fontSize:28, fontWeight:700, fontFamily:"'DM Mono',monospace", marginBottom:18 }}>${fmt(d.vaultBalance)}</div>
          {[
            { l:'Monthly Growth', v:`+${d.vaultGrowth}%`,   c:'#22c55e' },
            { l:'Interest Rate',  v:`${d.vaultAPY}%`,       c:'#f1f5f9' },
            { l:'Vault Capacity', v:`$${d.vaultCapacity.toLocaleString()}`, c:'#f1f5f9' },
          ].map(r=>(
            <div key={r.l} style={{ display:'flex', justifyContent:'space-between', marginBottom:10 }}>
              <span style={{ color:'#475569', fontSize:13 }}>{r.l}</span>
              <span style={{ color:r.c, fontWeight:600, fontSize:13, fontFamily:"'DM Mono',monospace" }}>{r.v}</span>
            </div>
          ))}
          <div style={{ marginTop:14 }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
              <span style={{ color:'#475569', fontSize:12 }}>Progress</span>
              <span style={{ color:'#94a3b8', fontSize:12, fontFamily:"'DM Mono',monospace" }}>${fmt(d.vaultBalance)} / ${d.vaultCapacity.toLocaleString()}</span>
            </div>
            <div style={{ background:'#111b27', borderRadius:6, height:8 }}>
              <div style={{ width:`${(d.vaultBalance/d.vaultCapacity)*100}%`, height:'100%', background:'linear-gradient(90deg,#15803d,#22c55e)', borderRadius:6 }}/>
            </div>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:6, marginTop:14 }}>
            <div style={{ width:7, height:7, borderRadius:'50%', background:'#22c55e', animation:'blink 2s infinite' }}/>
            <span style={{ color:'#334155', fontSize:12 }}>Live · blockchain testnet</span>
          </div>
          <button className="green-btn" onClick={onSim} style={{ marginTop:16, width:'100%', background:'#22c55e', color:'#000', border:'none', borderRadius:9, padding:'12px', fontWeight:700, fontSize:14, cursor:'pointer', transition:'background 0.15s' }}>
            ⚡ Simulate Purchase
          </button>
        </Box>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   PAGE: TRANSACTIONS
═══════════════════════════════════════════════ */
function Transactions({ d }) {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [boosted, setBoosted] = useState(false);

  const cats = ['All','Coffee','Entertainment','Shopping','Fast Food','Education','Groceries'];
  const rows = d.allTxns.filter(tx => {
    const cm = filter==='All' || tx.cat===filter;
    const sm = tx.name.toLowerCase().includes(search.toLowerCase());
    const bm = !boosted || tx.mult>1;
    return cm && sm && bm;
  });
  const totalSaved = d.allTxns.reduce((s,t)=>s+t.saved,0);
  const maxSaved   = Math.max(...d.catBreakdown.map(c=>c.saved));

  return (
    <div>
      <div className="fu" style={{ marginBottom:26 }}>
        <h1 style={{ color:'#f1f5f9', fontSize:24, fontWeight:700, letterSpacing:'-0.4px' }}>Transactions</h1>
        <p style={{ color:'#475569', fontSize:13.5, marginTop:5 }}>Track your round-ups and savings — category multipliers applied automatically</p>
      </div>

      <div style={{ display:'flex', gap:14, marginBottom:20 }}>
        <Card delay={0.04} label="Total Round-Ups" value={d.allTxns.length} icon="⇅"/>
        <Card delay={0.08} label="Total Saved"     value={`$${fmt(totalSaved)}`} accent="#22c55e" icon="💰"/>
        <Card delay={0.12} label="Avg. Per Txn"   value={`$${fmt(totalSaved/d.allTxns.length)}`} icon="≈"/>
        <Card delay={0.16} label="Top Category"   value={d.catBreakdown[0].cat} sub={`$${fmt(d.catBreakdown[0].saved)} saved`} icon="🏆"/>
      </div>

      <Box delay={0.20} style={{ marginBottom:14 }}>
        <BoxLabel>Savings by Category</BoxLabel>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10 }}>
          {d.catBreakdown.map(c=>(
            <div key={c.cat} style={{ background:'#080c12', borderRadius:10, padding:'14px 16px', border:'1px solid #111b27' }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
                <span style={{ color:'#e2e8f0', fontSize:13, fontWeight:500 }}>{c.cat}</span>
                <span style={{ color:c.color, fontSize:13, fontWeight:600, fontFamily:"'DM Mono',monospace" }}>${fmt(c.saved)}</span>
              </div>
              <div style={{ background:'#1e2a38', borderRadius:4, height:5 }}>
                <div style={{ width:`${(c.saved/maxSaved)*100}%`, height:'100%', background:c.color, borderRadius:4 }}/>
              </div>
              <div style={{ color:'#475569', fontSize:11, marginTop:5 }}>{c.txns} transactions</div>
            </div>
          ))}
        </div>
      </Box>

      <Box delay={0.24} style={{ marginBottom:14 }}>
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:13 }}>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍  Search merchants..."
            style={{ background:'#080c12', border:'1px solid #1e2a38', borderRadius:8, padding:'8px 13px', color:'#e2e8f0', fontSize:13, width:260, outline:'none', fontFamily:"'DM Sans',sans-serif" }}/>
          <button onClick={()=>setBoosted(!boosted)} style={{ background:boosted?'rgba(34,197,94,0.1)':'#111b27', border:boosted?'1px solid #22c55e':'1px solid #1e2a38', color:boosted?'#22c55e':'#4b5563', borderRadius:8, padding:'8px 14px', cursor:'pointer', fontSize:12, fontWeight:600 }}>
            ⚡ Boosted Only
          </button>
        </div>
        <div style={{ display:'flex', gap:7, flexWrap:'wrap' }}>
          {cats.map(c=>(
            <button key={c} onClick={()=>setFilter(c)} style={{ padding:'5px 13px', borderRadius:20, fontSize:12, cursor:'pointer', background:filter===c?'#22c55e':'#111b27', color:filter===c?'#000':'#4b5563', border:filter===c?'none':'1px solid #1e2a38', fontWeight:filter===c?600:400, transition:'all 0.14s' }}>{c}</button>
          ))}
        </div>
      </Box>

      <Box delay={0.28} style={{ padding:0, overflow:'hidden' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 105px 115px 110px 85px', padding:'12px 20px', borderBottom:'1px solid #111b27', background:'#080c12' }}>
          {['MERCHANT','ORIGINAL','ROUNDED TO','SAVED','STATUS'].map(h=>(
            <div key={h} style={{ color:'#334155', fontSize:10.5, fontWeight:600, letterSpacing:1 }}>{h}</div>
          ))}
        </div>
        {rows.length===0
          ? <div style={{ padding:'36px', textAlign:'center', color:'#334155' }}>No transactions match your filter.</div>
          : rows.map(tx=>(
            <div key={tx.id} className="row-hover" style={{ display:'grid', gridTemplateColumns:'1fr 105px 115px 110px 85px', padding:'14px 20px', borderBottom:'1px solid #0a0f18', alignItems:'center', transition:'background 0.14s' }}>
              <div style={{ display:'flex', alignItems:'center', gap:11 }}>
                <div style={{ width:38, height:38, borderRadius:10, background:'#111b27', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>{tx.icon}</div>
                <div>
                  <div style={{ color:'#e2e8f0', fontSize:13.5, fontWeight:500 }}>{tx.name}</div>
                  <div style={{ display:'flex', gap:6, marginTop:3, alignItems:'center' }}>
                    <CatBadge cat={tx.cat}/>
                    <span style={{ color:'#334155', fontSize:11 }}>{tx.date}</span>
                  </div>
                </div>
              </div>
              <div style={{ color:'#94a3b8', fontSize:13, fontFamily:"'DM Mono',monospace" }}>${fmt(tx.amount)}</div>
              <div style={{ color:'#e2e8f0', fontSize:13, fontWeight:500, fontFamily:"'DM Mono',monospace" }}>${fmt(tx.rounded)}</div>
              <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                <span style={{ color:'#22c55e', fontSize:13, fontWeight:600, fontFamily:"'DM Mono',monospace" }}>+${fmt(tx.saved)}</span>
                {tx.mult>1 && <span style={{ background:'rgba(96,165,250,0.1)', color:'#60a5fa', fontSize:11, padding:'2px 6px', borderRadius:4, fontWeight:600 }}>×{tx.mult}</span>}
              </div>
              <div>
                <span style={{ background:'rgba(34,197,94,0.08)', color:'#22c55e', fontSize:11, padding:'4px 10px', borderRadius:20, border:'1px solid rgba(34,197,94,0.18)', fontWeight:500 }}>✓ Done</span>
              </div>
            </div>
          ))
        }
      </Box>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   PAGE: TRUST SCORE
═══════════════════════════════════════════════ */
function TrustScore({ d }) {
  const factors = [
    { l:'Savings Frequency', pct:Math.min(Math.round((d.allTxns.length/20)*100),100), desc:'Consistent round-ups every week' },
    { l:'Savings Volume',    pct:Math.min(Math.round((d.totalSaved/2000)*100),100),    desc:'Total amount saved over time' },
    { l:'Lesson Completion', pct:Math.round((d.lessonsCompleted/d.lessons.length)*100),desc:'Complete lessons to boost score' },
    { l:'Streak Consistency',pct:Math.min(d.streak*5,100),                              desc:`${d.streak}-day savings streak active` },
  ];
  const milestones=[
    { score:200,  label:'First Savings',  icon:'🌱' },
    { score:500,  label:'Loan Eligible',  icon:'🏦' },
    { score:700,  label:'Grant Eligible', icon:'🎓' },
    { score:900,  label:'Premium',        icon:'⭐' },
    { score:1000, label:'Elite',          icon:'🏆' },
  ];
  return (
    <div>
      <div className="fu" style={{ marginBottom:26 }}>
        <h1 style={{ color:'#f1f5f9', fontSize:24, fontWeight:700, letterSpacing:'-0.4px' }}>Trust Score</h1>
        <p style={{ color:'#475569', fontSize:13.5, marginTop:5 }}>Your decentralized financial credibility — powers micro-loan and grant eligibility</p>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:14 }}>
        <Box delay={0.05} style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
          <BoxLabel>Your Score</BoxLabel>
          <TrustGauge score={d.trustScore}/>
          <div style={{ width:'100%', marginTop:14 }}>
            <div style={{ background:'#111b27', borderRadius:6, height:7 }}>
              <div style={{ width:`${(d.trustScore/1000)*100}%`, height:'100%', background:d.trustScore>=700?'#22c55e':d.trustScore>=500?'#f59e0b':'#f87171', borderRadius:6, transition:'width 1.2s ease' }}/>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', marginTop:5 }}>
              <span style={{ color:'#334155', fontSize:11 }}>0</span>
              <span style={{ color:'#f59e0b', fontSize:11 }}>500 — Loan Eligible</span>
              <span style={{ color:'#334155', fontSize:11 }}>1000</span>
            </div>
          </div>
        </Box>
        <Box delay={0.10}>
          <BoxLabel>Score Breakdown</BoxLabel>
          {factors.map((f,i)=>(
            <div key={f.l} style={{ marginBottom:16 }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                <span style={{ color:'#cbd5e1', fontSize:13.5 }}>{f.l}</span>
                <span style={{ color:'#22c55e', fontSize:13, fontWeight:600, fontFamily:"'DM Mono',monospace" }}>{f.pct}%</span>
              </div>
              <div style={{ background:'#111b27', borderRadius:5, height:6 }}>
                <div style={{ width:`${f.pct}%`, height:'100%', background:'#22c55e', borderRadius:5, transition:`width 1.2s ${i*0.1}s ease` }}/>
              </div>
              <div style={{ color:'#334155', fontSize:11.5, marginTop:4 }}>{f.desc}</div>
            </div>
          ))}
        </Box>
      </div>
      <Box delay={0.18}>
        <BoxLabel>Score Milestones</BoxLabel>
        <div style={{ display:'flex', gap:10 }}>
          {milestones.map(m=>(
            <div key={m.score} style={{ flex:1, background:d.trustScore>=m.score?'rgba(34,197,94,0.07)':'#080c12', border:d.trustScore>=m.score?'1px solid rgba(34,197,94,0.2)':'1px solid #111b27', borderRadius:11, padding:'14px 10px', textAlign:'center', transition:'all 0.3s' }}>
              <div style={{ fontSize:22, marginBottom:7 }}>{m.icon}</div>
              <div style={{ color:d.trustScore>=m.score?'#22c55e':'#334155', fontSize:11, fontWeight:700, fontFamily:"'DM Mono',monospace", marginBottom:3 }}>{m.score}</div>
              <div style={{ color:d.trustScore>=m.score?'#86efac':'#334155', fontSize:12 }}>{m.label}</div>
              {d.trustScore>=m.score && <div style={{ color:'#22c55e', fontSize:16, marginTop:5 }}>✓</div>}
            </div>
          ))}
        </div>
      </Box>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   PAGE: SMART VAULT
═══════════════════════════════════════════════ */
function SmartVault({ d }) {
  const gp = Math.min((d.educationEligible/d.savingsGoal)*100,100);
  return (
    <div>
      <div className="fu" style={{ marginBottom:26 }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <h1 style={{ color:'#f1f5f9', fontSize:24, fontWeight:700, letterSpacing:'-0.4px' }}>Smart Vault</h1>
          <span style={{ background:'rgba(34,197,94,0.1)', color:'#22c55e', fontSize:12, padding:'4px 10px', borderRadius:20, border:'1px solid rgba(34,197,94,0.2)' }}>● Active</span>
        </div>
        <p style={{ color:'#475569', fontSize:13.5, marginTop:5 }}>Decentralized escrow — funds unlocked penalty-free for verified educational expenses</p>
      </div>
      <div className="fu" style={{ background:'rgba(34,197,94,0.04)', border:'1px solid rgba(34,197,94,0.12)', borderRadius:11, padding:'11px 16px', marginBottom:18, display:'flex', alignItems:'center', gap:10 }}>
        <span>⛓️</span>
        <span style={{ color:'#334155', fontSize:13 }}>Smart Contract:</span>
        <span style={{ color:'#22c55e', fontSize:13, fontFamily:"'DM Mono',monospace" }}>0xabc123def456789</span>
        <span style={{ marginLeft:'auto', background:'rgba(34,197,94,0.1)', color:'#22c55e', fontSize:11, padding:'3px 9px', borderRadius:20, border:'1px solid rgba(34,197,94,0.2)' }}>● Live Testnet</span>
      </div>
      <div style={{ display:'flex', gap:14, marginBottom:18 }}>
        <Card delay={0.05} label="Total Vaulted"      value={`$${fmt(d.vaultBalance)}`}      icon="💼"/>
        <Card delay={0.09} label="Education Eligible" value={`$${fmt(d.educationEligible)}`} accent="#22c55e" icon="🎓"/>
        <Card delay={0.13} label="Vault APY"          value={`${d.vaultAPY}%`}               sub="$3.33/mo earned" icon="📈"/>
        <Card delay={0.17} label="Monthly Growth"     value={`+${d.vaultGrowth}%`}           accent="#22c55e" icon="🚀"/>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 280px', gap:14 }}>
        <div>
          <Box delay={0.22} style={{ marginBottom:14 }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:11 }}>
              <BoxLabel>Education Fund Goal</BoxLabel>
              <span style={{ color:'#22c55e', fontSize:14, fontWeight:700, fontFamily:"'DM Mono',monospace" }}>{Math.round(gp)}%</span>
            </div>
            <div style={{ background:'#111b27', borderRadius:7, height:11, marginBottom:9 }}>
              <div style={{ width:`${gp}%`, height:'100%', background:'linear-gradient(90deg,#15803d,#22c55e)', borderRadius:7, transition:'width 1.2s ease' }}/>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between' }}>
              <span style={{ color:'#94a3b8', fontSize:13 }}>${fmt(d.educationEligible)} saved</span>
              <span style={{ color:'#475569', fontSize:13 }}>${fmt(d.savingsGoal)} goal</span>
            </div>
          </Box>
          <Box delay={0.26}>
            <BoxLabel>Vault Rules</BoxLabel>
            <div style={{ marginBottom:14, display:'flex', gap:10 }}>
              <span style={{ color:'#22c55e', fontSize:18 }}>✓</span>
              <div>
                <div style={{ color:'#e2e8f0', fontSize:13.5, fontWeight:500, marginBottom:3 }}>Education Withdrawals</div>
                <div style={{ color:'#475569', fontSize:12 }}>No penalty for verified tuition, textbooks, and supplies</div>
              </div>
            </div>
            <div style={{ display:'flex', gap:10 }}>
              <span style={{ color:'#f59e0b', fontSize:18 }}>⚠</span>
              <div>
                <div style={{ color:'#e2e8f0', fontSize:13.5, fontWeight:500, marginBottom:3 }}>Early Withdrawal</div>
                <div style={{ color:'#475569', fontSize:12 }}>5% penalty on non-educational withdrawals</div>
              </div>
            </div>
          </Box>
        </div>
        <Box delay={0.30}>
          <BoxLabel>Quick Deposit</BoxLabel>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:11 }}>
            {['$5','$10','$25','$50'].map(v=>(
              <button key={v} className="cat-btn" style={{ background:'#111b27', border:'1px solid #1e2a38', color:'#94a3b8', borderRadius:8, padding:'10px', cursor:'pointer', fontSize:14, fontWeight:500, transition:'all 0.14s' }}>{v}</button>
            ))}
          </div>
          <input placeholder="Custom amount..." style={{ width:'100%', background:'#080c12', border:'1px solid #1e2a38', borderRadius:8, padding:'10px 12px', color:'#e2e8f0', fontSize:13, outline:'none', marginBottom:11, fontFamily:"'DM Sans',sans-serif" }}/>
          <button className="green-btn" style={{ width:'100%', background:'#22c55e', color:'#000', border:'none', borderRadius:9, padding:'12px', fontWeight:700, fontSize:14, cursor:'pointer', transition:'background 0.15s' }}>↓ Deposit to Vault</button>
        </Box>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   PAGE: MICROLEARN
═══════════════════════════════════════════════ */
function MicroLearn({ d }) {
  const [open, setOpen] = useState(null);
  const done = d.lessons.filter(l=>l.done).length;
  return (
    <div>
      <div className="fu" style={{ marginBottom:26 }}>
        <h1 style={{ color:'#f1f5f9', fontSize:24, fontWeight:700, letterSpacing:'-0.4px' }}>MicroLearn</h1>
        <p style={{ color:'#475569', fontSize:13.5, marginTop:5 }}>Financial literacy unlocked by savings streak — each lesson adds +20 Trust Score pts</p>
      </div>
      <div style={{ display:'flex', gap:14, marginBottom:20 }}>
        <Card delay={0.04} label="Current Streak"    value={`🔥 ${d.streak} days`} sub="Keep saving daily!"/>
        <Card delay={0.08} label="Lessons Completed" value={`${done} / ${d.lessons.length}`} accent="#22c55e" sub="Financial literacy progress"/>
        <Card delay={0.12} label="Trust Score Boost" value={`+${done*20} pts`} sub="Earned from lessons" icon="📈"/>
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:11 }}>
        {d.lessons.map((l,i)=>{
          const unlocked = d.trustScore >= l.pts;
          return (
            <div key={l.id} onClick={()=>unlocked&&setOpen(open===l.id?null:l.id)} className={`fu ${unlocked?'row-hover':''}`}
              style={{ background:'#0d1520', border:l.done?'1px solid rgba(34,197,94,0.22)':unlocked?'1px solid #111b27':'1px solid #0a0f18', borderRadius:13, padding:'18px 22px', opacity:unlocked?1:0.42, cursor:unlocked?'pointer':'not-allowed', transition:'all 0.2s', animationDelay:`${0.05*i}s` }}>
              <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                <div style={{ width:46, height:46, borderRadius:11, fontSize:22, background:l.done?'rgba(34,197,94,0.1)':unlocked?'#111b27':'#080c12', display:'flex', alignItems:'center', justifyContent:'center', border:l.done?'1px solid rgba(34,197,94,0.22)':'1px solid #1e2a38' }}>{l.emoji}</div>
                <div style={{ flex:1 }}>
                  <div style={{ color:'#f1f5f9', fontSize:14.5, fontWeight:600, marginBottom:3 }}>{l.title}</div>
                  <div style={{ display:'flex', gap:10, alignItems:'center' }}>
                    <span style={{ color:'#334155', fontSize:12 }}>⏱ {l.dur}</span>
                    <span style={{ color:'#334155', fontSize:12 }}>🎯 Unlocks at {l.pts} pts</span>
                    {l.done && <span style={{ color:'#22c55e', fontSize:12 }}>+20 Trust Score pts</span>}
                  </div>
                </div>
                {l.done
                  ? <span style={{ background:'rgba(34,197,94,0.09)', color:'#22c55e', border:'1px solid rgba(34,197,94,0.2)', borderRadius:20, padding:'6px 14px', fontSize:12, fontWeight:600, whiteSpace:'nowrap' }}>✓ Completed</span>
                  : unlocked
                    ? <button className="green-btn" style={{ background:'#22c55e', color:'#000', border:'none', borderRadius:8, padding:'8px 18px', fontWeight:700, fontSize:13, cursor:'pointer', transition:'background 0.15s', whiteSpace:'nowrap' }}>▶ Start</button>
                    : <span style={{ color:'#334155', fontSize:13, whiteSpace:'nowrap' }}>🔒 {l.pts} pts</span>
                }
              </div>
              {open===l.id && unlocked && !l.done && (
                <div style={{ marginTop:14, borderTop:'1px solid #111b27', paddingTop:14 }}>
                  <div style={{ background:'#080c12', borderRadius:9, padding:18 }}>
                    <div style={{ color:'#22c55e', fontSize:13, fontWeight:600, marginBottom:7 }}>📖 Lesson Preview</div>
                    <p style={{ color:'#94a3b8', fontSize:13.5, lineHeight:1.7 }}>
                      This 5-minute lesson covers key concepts to build financial confidence as a student.
                      Complete it to earn <strong style={{ color:'#22c55e' }}>+20 Trust Score points</strong>.
                    </p>
                    <button className="green-btn" style={{ marginTop:12, background:'#22c55e', color:'#000', border:'none', borderRadius:8, padding:'9px 22px', fontWeight:700, fontSize:13, cursor:'pointer' }}>Start Lesson →</button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   PAGE: SIMULATE
═══════════════════════════════════════════════ */
function Simulate({ d, onSim }) {
  const [sel,  setSel]  = useState(SIM_OPTS[0]);
  const [mode, setMode] = useState('standard');
  const [last, setLast] = useState(null);
  const modes = {
    standard:   { label:'Standard',   rt:1,   desc:'Round up to nearest $1'    },
    aggressive: { label:'Aggressive', rt:5,   desc:'Round up to nearest $5'    },
    guilt_free: { label:'Guilt-Free', rt:0.1, desc:'Round up to nearest $0.10' },
  };
  const m = modes[mode];
  const mult  = MULT[sel.cat] || 1;
  const base  = parseFloat((Math.ceil(sel.amount/m.rt)*m.rt - sel.amount).toFixed(2));
  const saved = parseFloat((base*mult).toFixed(2));
  const rounded = parseFloat((sel.amount+base).toFixed(2));

  const fire = () => {
    const r = { ...sel, rounded, saved, mult };
    setLast(r);
    onSim(r);
  };

  return (
    <div>
      <div className="fu" style={{ marginBottom:26 }}>
        <h1 style={{ color:'#f1f5f9', fontSize:24, fontWeight:700, letterSpacing:'-0.4px' }}>⚡ Simulate Purchase</h1>
        <p style={{ color:'#475569', fontSize:13.5, marginTop:5 }}>Live demo of the PRD round-up engine — Dynamic Behavioral Rounding with category multipliers</p>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <Box delay={0.04}>
            <BoxLabel>Select Merchant</BoxLabel>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
              {SIM_OPTS.map(o=>(
                <button key={o.name} className="sim-opt" onClick={()=>setSel(o)} style={{ display:'flex', alignItems:'center', gap:9, padding:'10px 11px', background:sel.name===o.name?'rgba(34,197,94,0.09)':'#111b27', border:sel.name===o.name?'1px solid rgba(34,197,94,0.3)':'1px solid #1e2a38', borderRadius:9, cursor:'pointer', transition:'all 0.14s' }}>
                  <span style={{ fontSize:17 }}>{o.icon}</span>
                  <div style={{ textAlign:'left' }}>
                    <div style={{ color:sel.name===o.name?'#22c55e':'#94a3b8', fontSize:12.5, fontWeight:500 }}>{o.name}</div>
                    <div style={{ color:'#334155', fontSize:11 }}>${fmt(o.amount)}</div>
                  </div>
                </button>
              ))}
            </div>
          </Box>
          <Box delay={0.08}>
            <BoxLabel>Round-Up Mode</BoxLabel>
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {Object.entries(modes).map(([k,c])=>(
                <button key={k} onClick={()=>setMode(k)} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'11px 13px', borderRadius:9, cursor:'pointer', transition:'all 0.14s', background:mode===k?'rgba(34,197,94,0.07)':'#111b27', border:mode===k?'1px solid rgba(34,197,94,0.22)':'1px solid #1e2a38' }}>
                  <div>
                    <div style={{ color:mode===k?'#22c55e':'#94a3b8', fontSize:13.5, fontWeight:600, textAlign:'left' }}>{c.label}</div>
                    <div style={{ color:'#334155', fontSize:12, textAlign:'left' }}>{c.desc}</div>
                  </div>
                  {mode===k && <span style={{ color:'#22c55e', fontSize:17 }}>✓</span>}
                </button>
              ))}
            </div>
          </Box>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <Box delay={0.12}>
            <BoxLabel>Round-Up Preview</BoxLabel>
            {[
              { l:'Purchase at',    v:`${sel.icon} ${sel.name}` },
              { l:'Original',       v:`$${fmt(sel.amount)}`, bold:true },
              { l:'Rounded To',     v:`$${fmt(rounded)}`,   bold:true },
              { l:'Base Round-Up',  v:`$${fmt(base)}` },
              { l:'Category',       v:<CatBadge cat={sel.cat}/> },
              { l:'Multiplier',     v:mult>1?<span style={{ color:'#60a5fa', fontWeight:700 }}>×{mult} BOOST</span>:<span style={{ color:'#475569' }}>×1 Standard</span> },
            ].map(r=>(
              <div key={r.l} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'9px 0', borderBottom:'1px solid #111b27' }}>
                <span style={{ color:'#475569', fontSize:13.5 }}>{r.l}</span>
                <span style={{ color:r.bold?'#f1f5f9':'#94a3b8', fontSize:13.5, fontFamily:r.bold?"'DM Mono',monospace":'inherit', fontWeight:r.bold?600:400 }}>{r.v}</span>
              </div>
            ))}
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'14px 0 0' }}>
              <span style={{ color:'#e2e8f0', fontSize:16, fontWeight:700 }}>Saved to Vault</span>
              <span style={{ color:'#22c55e', fontSize:26, fontWeight:700, fontFamily:"'DM Mono',monospace" }}>+${fmt(saved)}</span>
            </div>
            <button className="green-btn" onClick={fire} style={{ marginTop:18, width:'100%', background:'#22c55e', color:'#000', border:'none', borderRadius:9, padding:'13px', fontWeight:700, fontSize:15, cursor:'pointer', transition:'background 0.15s' }}>
              ⚡ Fire Transaction
            </button>
          </Box>
          {last && (
            <div className="si" style={{ background:'rgba(34,197,94,0.06)', border:'1px solid rgba(34,197,94,0.22)', borderRadius:13, padding:20 }}>
              <div style={{ color:'#22c55e', fontSize:14, fontWeight:700, marginBottom:9 }}>🎉 Transaction Processed!</div>
              <div style={{ color:'#86efac', fontSize:13, marginBottom:5 }}><strong>{last.icon} {last.name}</strong> · ${fmt(last.amount)} → ${fmt(last.rounded)}</div>
              <div style={{ color:'#22c55e', fontSize:22, fontWeight:700, fontFamily:"'DM Mono',monospace" }}>+${fmt(last.saved)} saved</div>
              <div style={{ color:'#334155', fontSize:12, marginTop:6 }}>→ Deposited to Smart Vault on blockchain</div>
              <div style={{ color:'#334155', fontSize:12, marginTop:2 }}>→ Trust Score +3 pts</div>
            </div>
          )}
          <Box delay={0.18}>
            <BoxLabel>Live Stats</BoxLabel>
            {[
              { l:'Total Saved',   v:`$${fmt(d.totalSaved)}`,   c:'#22c55e' },
              { l:'Trust Score',   v:`${d.trustScore} / 1000`,  c:'#f1f5f9' },
              { l:'Transactions',  v:`${d.allTxns.length}`,     c:'#f1f5f9' },
              { l:'Vault Balance', v:`$${fmt(d.vaultBalance)}`, c:'#a78bfa' },
            ].map(r=>(
              <div key={r.l} style={{ display:'flex', justifyContent:'space-between', marginBottom:9 }}>
                <span style={{ color:'#475569', fontSize:13 }}>{r.l}</span>
                <span style={{ color:r.c, fontWeight:600, fontFamily:"'DM Mono',monospace", fontSize:13 }}>{r.v}</span>
              </div>
            ))}
          </Box>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════ */
function getCatIcon(category) {
  const icons = {
    'fast_food':'🍔','food':'🍔','coffee':'☕',
    'entertainment':'🎬','shopping':'🛍️','groceries':'🛒',
    'education':'📚','transport':'🚗','other':'💳',
  };
  return icons[(category||'').toLowerCase()] || '💳';
}

/* ═══════════════════════════════════════════════
   ROOT APP
═══════════════════════════════════════════════ */
export default function App() {
  const [mounted, setMounted]   = useState(false);
  const [page, setPage]         = useState('dashboard');
  const [data, setData]         = useState(INIT);
  const [toast, setToast]       = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!loggedIn || !userId) return;
    const fetchRealData = async () => {
      try {
        const [userRes, txRes, tsRes] = await Promise.all([
          fetch(`http://localhost:5000/api/users/${userId}`),
          fetch(`http://localhost:5000/api/transactions/${userId}`),
          fetch(`http://localhost:5000/api/users/${userId}/trust-score`),
        ]);
        const userData = await userRes.json();
        const txData   = await txRes.json();
        const tsData   = await tsRes.json();

        if (userData.success) {
          setData(prev => ({
            ...prev,
            name:        userData.data.name       || prev.name,
            totalSaved:  parseFloat(userData.data.totalSaved) || prev.totalSaved,
            vaultBalance:parseFloat(userData.data.totalSaved) || prev.vaultBalance,
            trustScore:  userData.data.trustScore  || prev.trustScore,
            streak:      userData.data.currentStreak || prev.streak,
          }));
          setUserName(userData.data.name || '');
        }

        if (txData.success && txData.data.length > 0) {
          const txns = txData.data.map(t => ({
            id:      t.id,
            name:    t.merchantName,
            cat:     t.category,
            icon:    getCatIcon(t.category),
            amount:  parseFloat(t.originalAmount),
            rounded: parseFloat(t.roundedAmount),
            saved:   parseFloat(t.savedAmount),
            mult:    parseFloat(t.roundUpMultiplier),
            date:    new Date(t.createdAt).toLocaleDateString('en-US',{month:'short',day:'numeric'}),
            time:    new Date(t.createdAt).toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit'}),
          }));
          setData(prev => ({
            ...prev,
            recentTxns:    txns.slice(0,5),
            allTxns:       txns,
            roundUpsToday: txns.slice(0,4).reduce((s,t)=>s+t.saved,0),
            todayCount:    txns.slice(0,4).length,
          }));
        }

        if (tsData.success) {
          setData(prev => ({ ...prev, trustScore: tsData.data.trustScore || prev.trustScore }));
        }
      } catch (err) {
        console.error('Failed to fetch real data, using mock:', err);
      }
    };
    fetchRealData();
  }, [loggedIn]);

  if (!mounted) return null;

  // ── Show Login if not authenticated ──────────────
  if (!loggedIn) {
  if (showRegister) {
    return (
      <>
        <InjectStyles/>
        <Register
          onRegister={(user) => {
            setData(prev => ({ ...prev, name: user.name || prev.name }));
            setUserName(user.name || '');
            setLoggedIn(true);
          }}
          onGoLogin={() => setShowRegister(false)}
        />
      </>
    );
  }
  return (
    <>
      <InjectStyles/>
      <Login
        onLogin={(user) => {
          setData(prev => ({ ...prev, name: user.name || prev.name }));
          setUserName(user.name || '');
          setLoggedIn(true);
        }}
        onGoRegister={() => setShowRegister(true)}
      />
    </>
  );
  }

  // ── Logout handler ────────────────────────────────
  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    setLoggedIn(false);
    setUserName('');
    setPage('dashboard');
  };

  const handleSim = async (tx) => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      try {
        const res = await fetch('http://localhost:5000/api/transactions/simulate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId }),
        });
        const result = await res.json();
        if (result.success) {
          const t = result.data.transaction;
          const newTx = {
            id:      t.id,
            name:    t.merchantName,
            cat:     t.category,
            icon:    getCatIcon(t.category),
            amount:  parseFloat(t.originalAmount),
            rounded: parseFloat(t.roundedAmount),
            saved:   parseFloat(t.savedAmount),
            mult:    parseFloat(t.roundUpMultiplier),
            date:    'Just now',
            time:    'Just now',
          };
          setData(prev => ({
            ...prev,
            totalSaved:        parseFloat((prev.totalSaved + newTx.saved).toFixed(2)),
            vaultBalance:      parseFloat((prev.vaultBalance + newTx.saved).toFixed(2)),
            roundUpsToday:     parseFloat((prev.roundUpsToday + newTx.saved).toFixed(2)),
            todayCount:        prev.todayCount + 1,
            trustScore:        result.data.trustScore || prev.trustScore,
            educationEligible: parseFloat((prev.educationEligible + newTx.saved * 0.8).toFixed(2)),
            recentTxns: [newTx, ...prev.recentTxns.slice(0,4)],
            allTxns:    [newTx, ...prev.allTxns],
          }));
          setToast(`+$${newTx.saved.toFixed(2)} from ${newTx.icon} ${newTx.name} → Vault`);
          return;
        }
      } catch (err) {
        console.error('Backend simulate failed, using mock:', err);
      }
    }
    // Fallback to mock
    if (!tx) {
      const o = SIM_OPTS[Math.floor(Math.random()*SIM_OPTS.length)];
      const m = MULT[o.cat]||1;
      const b = parseFloat((Math.ceil(o.amount)-o.amount).toFixed(2));
      const s = parseFloat((b*m).toFixed(2));
      tx = { ...o, rounded:Math.ceil(o.amount), saved:s, mult:m };
    }
    setData(prev => ({
      ...prev,
      totalSaved:    parseFloat((prev.totalSaved+tx.saved).toFixed(2)),
      vaultBalance:  parseFloat((prev.vaultBalance+tx.saved).toFixed(2)),
      roundUpsToday: parseFloat((prev.roundUpsToday+tx.saved).toFixed(2)),
      todayCount:    prev.todayCount+1,
      trustScore:    Math.min(prev.trustScore+3,1000),
      educationEligible: parseFloat((prev.educationEligible+tx.saved*0.8).toFixed(2)),
      recentTxns: [{ id:Date.now(), name:tx.name, cat:tx.cat, icon:tx.icon, amount:tx.amount, saved:tx.saved, mult:tx.mult, time:'Just now' }, ...prev.recentTxns.slice(0,4)],
      allTxns:    [{ id:Date.now(), name:tx.name, cat:tx.cat, icon:tx.icon, amount:tx.amount, rounded:tx.rounded, saved:tx.saved, mult:tx.mult, date:'Just now' }, ...prev.allTxns],
    }));
    setToast(`+$${tx.saved.toFixed(2)} from ${tx.icon} ${tx.name} → Vault`);
  };

  const pages = {
    dashboard:    <Dashboard    d={data} onSim={()=>handleSim(null)}/>,
    transactions: <Transactions d={data}/>,
    trustscore:   <TrustScore   d={data}/>,
    vault:        <SmartVault   d={data}/>,
    learn:        <MicroLearn   d={data}/>,
    simulate:     <Simulate     d={data} onSim={handleSim}/>,
  };

  return (
    <>
      <InjectStyles/>
      <div style={{ display:'flex', minHeight:'100vh', background:'#070b11' }}>
        <Sidebar
          page={page}
          setPage={setPage}
          streak={data.streak}
          userName={userName}
          onLogout={handleLogout}
        />
        {toast && <Toast msg={toast} onClose={()=>setToast(null)}/>}
        <main style={{ marginLeft:222, flex:1, padding:'36px 42px', overflowY:'auto', minHeight:'100vh' }}>
          {pages[page]}
        </main>
      </div>
    </>
  );
}