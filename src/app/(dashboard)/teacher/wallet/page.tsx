"use client";

import { useState } from "react";
import { useLanguage } from "@/src/contexts/LanguageContext";

// ─── Types ────────────────────────────────────────────────────
type PayoutStatus   = "paid" | "pending" | "processing";
type SessionType    = "trial" | "normal";
type WithdrawMethod = "bank" | "paypal" | "wise";

interface PayoutRecord  { id:string; amount:number; currency:string; date:string; method:WithdrawMethod; status:PayoutStatus; reference:string; }
interface SessionRecord { id:string; student:string; avatar:string; date:string; duration:string; type:SessionType; rate:number; earned:number; currency:string; }
interface MonthlyData   { month:string; monthAr:string; earned:number; sessions:number; }

// ─── Mock Data ────────────────────────────────────────────────
const PAYOUT_HISTORY: PayoutRecord[] = [
  { id:"P001", amount:920,  currency:"$", date:"2025-03-01", method:"bank",   status:"paid",    reference:"TXN-83921"   },
  { id:"P002", amount:750,  currency:"$", date:"2025-02-01", method:"paypal", status:"paid",    reference:"TXN-71840"   },
  { id:"P003", amount:580,  currency:"$", date:"2025-01-01", method:"bank",   status:"paid",    reference:"TXN-60318"   },
  { id:"P004", amount:320,  currency:"$", date:"2025-03-20", method:"wise",   status:"pending", reference:"TXN-PENDING" },
  { id:"P005", amount:640,  currency:"$", date:"2024-12-01", method:"bank",   status:"paid",    reference:"TXN-54210"   },
  { id:"P006", amount:480,  currency:"$", date:"2024-11-01", method:"paypal", status:"paid",    reference:"TXN-48811"   },
];

const SESSIONS: SessionRecord[] = [
  { id:"S01", student:"Sara Al-Rashid",    avatar:"SA", date:"2025-03-24", duration:"60 min", type:"normal", rate:40, earned:40, currency:"$" },
  { id:"S02", student:"Omar Khalid",       avatar:"OK", date:"2025-03-24", duration:"45 min", type:"trial",  rate:20, earned:20, currency:"$" },
  { id:"S03", student:"Lina Hassan",       avatar:"LH", date:"2025-03-23", duration:"60 min", type:"normal", rate:40, earned:40, currency:"$" },
  { id:"S04", student:"Faisal Al-Mutairi", avatar:"FA", date:"2025-03-23", duration:"60 min", type:"normal", rate:40, earned:40, currency:"$" },
  { id:"S05", student:"Layla Ahmad",       avatar:"LA", date:"2025-03-22", duration:"60 min", type:"normal", rate:40, earned:40, currency:"$" },
  { id:"S06", student:"Hani Saeed",        avatar:"HS", date:"2025-03-22", duration:"60 min", type:"normal", rate:40, earned:40, currency:"$" },
  { id:"S07", student:"Khalid Mansoor",    avatar:"KM", date:"2025-03-21", duration:"60 min", type:"normal", rate:40, earned:40, currency:"$" },
  { id:"S08", student:"Ahmed Al-Zahrani",  avatar:"AZ", date:"2025-03-20", duration:"60 min", type:"normal", rate:40, earned:40, currency:"$" },
  { id:"S09", student:"Reem Al-Jabri",     avatar:"RJ", date:"2025-03-19", duration:"45 min", type:"trial",  rate:20, earned:20, currency:"$" },
  { id:"S10", student:"Dina Yousef",       avatar:"DY", date:"2025-03-18", duration:"60 min", type:"normal", rate:40, earned:40, currency:"$" },
];

const MONTHLY_DATA: MonthlyData[] = [
  { month:"Oct", monthAr:"أكت", earned:480,  sessions:12 },
  { month:"Nov", monthAr:"نوف", earned:600,  sessions:15 },
  { month:"Dec", monthAr:"ديس", earned:640,  sessions:16 },
  { month:"Jan", monthAr:"ينا", earned:520,  sessions:13 },
  { month:"Feb", monthAr:"فبر", earned:750,  sessions:18 },
  { month:"Mar", monthAr:"مار", earned:1240, sessions:31 },
];

// ─── Configs ──────────────────────────────────────────────────
const PS: Record<PayoutStatus,{ bg:string; text:string; border:string; dot:string; en:string; ar:string }> = {
  paid:       { bg:"#d1fae5", text:"#059669", border:"#6ee7b7", dot:"#059669", en:"Paid",       ar:"مدفوع" },
  pending:    { bg:"#fef3c7", text:"#d97706", border:"#fde68a", dot:"#d97706", en:"Pending",    ar:"معلق"  },
  processing: { bg:"#ede9fe", text:"#7c3aed", border:"#c4b5fd", dot:"#7c3aed", en:"Processing", ar:"جارٍ"  },
};
const TP: Record<SessionType,{ bg:string; text:string; en:string; ar:string }> = {
  trial:  { bg:"#fef3c7", text:"#d97706", en:"Trial",  ar:"تجريبية" },
  normal: { bg:"#e0f2fe", text:"#0369a1", en:"Normal", ar:"عادية"   },
};
const MC: Record<WithdrawMethod,{ label:string; labelAr:string; icon:React.ReactNode; color:string }> = {
  bank:   { label:"Bank Transfer", labelAr:"تحويل بنكي", color:"#107789",
    icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/></svg> },
  paypal: { label:"PayPal",        labelAr:"باي بال",   color:"#003087",
    icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M7 11C7 6.5 10.5 3 15 3c2.5 0 4.5 1 5.5 2.5 1 1.5 1 3.5 0 5-1 1.5-3 2.5-5.5 2.5H9L7 21H4L7 11z"/></svg> },
  wise:   { label:"Wise",          labelAr:"وايز",      color:"#9fe870",
    icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg> },
};

const AVT = [
  { bg:"#EBF5F7", text:"#107789" },{ bg:"#ede9fe", text:"#7c3aed" },
  { bg:"#d1fae5", text:"#059669" },{ bg:"#fef3c7", text:"#d97706" },
  { bg:"#fee2e2", text:"#ef4444" },{ bg:"#e0f2fe", text:"#0369a1" },
];
const avt = (s:string) => AVT[(s.charCodeAt(0)+(s.charCodeAt(1)||0))%AVT.length];

// ─── Icons ────────────────────────────────────────────────────
const I = {
  close:    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  ok:       <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  wallet:   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/><path d="M16 3H8l-2 4h12l-2-4z"/><circle cx="16" cy="13" r="1.5" fill="currentColor"/></svg>,
  sessions: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="9 12 11 14 15 10"/></svg>,
  history:  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>,
  rate:     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  copy:     <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>,
  cal:      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  arrow:    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  info:     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  withdraw2:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="17 11 12 6 7 11"/><line x1="12" y1="6" x2="12" y2="18"/><path d="M4 18h16"/></svg>,
};

// ─── Small components ─────────────────────────────────────────
function Av({ initials, size="md" }:{ initials:string; size?:"sm"|"md"|"lg" }){
  const c = avt(initials);
  const d = {sm:"w-7 h-7 text-[10px]",md:"w-9 h-9 text-xs",lg:"w-11 h-11 text-sm"}[size];
  return <div className={`${d} rounded-full flex items-center justify-center font-bold flex-shrink-0 select-none`} style={{backgroundColor:c.bg,color:c.text}}>{initials}</div>;
}

function PBadge({ status,lang }:{ status:PayoutStatus; lang:string }){
  const c = PS[status];
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold whitespace-nowrap"
      style={{backgroundColor:c.bg,color:c.text,border:`1px solid ${c.border}`}}>
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{backgroundColor:c.dot}}/>
      {lang==="ar"?c.ar:c.en}
    </span>
  );
}
function TBadge({ type,lang }:{ type:SessionType; lang:string }){
  const c = TP[type];
  return <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold whitespace-nowrap" style={{backgroundColor:c.bg,color:c.text}}>{lang==="ar"?c.ar:c.en}</span>;
}

// ─── Bar Chart — FIXED viewBox + label visibility ─────────────
function BarChart({ data, lang }:{ data:MonthlyData[]; lang:string }){
  const max    = Math.max(...data.map(d=>d.earned));
  const cH     = 90;   // chart area height
  const bW     = 30;   // bar width
  const gap    = 12;   // gap between bars
  const topPad = 26;   // ← INCREASED: enough room for the value label above tallest bar
  const botPad = 38;   // room for month + sessions labels below
  const totalW = data.length*(bW+gap)-gap;

  // viewBox: left=-4 (small gutter), top=-topPad, width=totalW+8, height=cH+topPad+botPad
  const vb = `-4 -${topPad} ${totalW+8} ${cH+topPad+botPad}`;

  return (
    <div className="w-full">
      <svg
        viewBox={vb}
        preserveAspectRatio="xMidYMid meet"
        style={{width:"100%", height:"auto", display:"block"}}
      >
        {data.map((d,i)=>{
          const bH   = Math.max(4, (d.earned/max)*cH); // min 4px so 0-value still shows
          const x    = i*(bW+gap);
          const y    = cH-bH;
          const isTop = i===data.length-1;           // highlight the last (current) bar
          const barColor = isTop ? "#107789" : "#b2dce4";
          const labelY   = y - 8;                    // ← label sits 8px above bar top
          const labelText = `$${d.earned}`;

          // Measure approx label width to size the pill background
          const approxW = labelText.length * 6.5 + 8;

          return (
            <g key={i}>
              {/* Bar background track */}
              <rect x={x} y={0} width={bW} height={cH} rx={6} fill="#F1F5F9"/>

              {/* Bar fill */}
              <rect
                x={x} y={y} width={bW} height={bH} rx={6}
                fill={barColor}
                style={{transition:`height .8s ${i*0.1}s ease, y .8s ${i*0.1}s ease`}}
              />

              {/* Value label — only on the tallest/highlighted bar */}
              {isTop && (
                <g>
                  {/* White pill background so label never gets clipped by bar color */}
                  <rect
                    x={x + bW/2 - approxW/2}
                    y={labelY - 11}
                    width={approxW}
                    height={14}
                    rx={7}
                    fill="#107789"
                  />
                  <text
                    x={x + bW/2}
                    y={labelY}
                    textAnchor="middle"
                    fontSize="10"
                    fontWeight="800"
                    fill="white"
                    fontFamily="system-ui, sans-serif"
                  >
                    {labelText}
                  </text>
                </g>
              )}

              {/* Show value above every bar (small, muted) — not just the last */}
              {!isTop && (
                <text
                  x={x + bW/2}
                  y={y - 5}
                  textAnchor="middle"
                  fontSize="8"
                  fontWeight="600"
                  fill="#94a3b8"
                  fontFamily="system-ui, sans-serif"
                >
                  ${d.earned}
                </text>
              )}

              {/* Month label */}
              <text
                x={x + bW/2} y={cH + 15}
                textAnchor="middle" fontSize="11" fill="#64748b"
                fontFamily="system-ui, sans-serif"
              >
                {lang==="ar" ? d.monthAr : d.month}
              </text>

              {/* Sessions count */}
              <text
                x={x + bW/2} y={cH + 28}
                textAnchor="middle" fontSize="9" fill="#cbd5e1"
                fontFamily="system-ui, sans-serif"
              >
                {d.sessions}s
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ─── Backdrop ─────────────────────────────────────────────────
function Backdrop({ onClose,children }:{ onClose:()=>void; children:React.ReactNode }){
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      style={{backgroundColor:"rgba(11,44,51,.45)",backdropFilter:"blur(4px)",padding:"0 0 env(safe-area-inset-bottom)"}}
      onClick={onClose}>
      <div className="w-full sm:w-auto" onClick={e=>e.stopPropagation()} style={{animation:"modalIn .22s cubic-bezier(.34,1.56,.64,1) both"}}>
        {children}
      </div>
    </div>
  );
}

// ─── Toast ────────────────────────────────────────────────────
function Toast({ msg,type,onClose }:{ msg:string; type:"success"|"info"|"error"; onClose:()=>void }){
  const C = { success:{bg:"#f0fdf4",br:"#bbf7d0",tx:"#15803d"}, info:{bg:"#eff6ff",br:"#bfdbfe",tx:"#1d4ed8"}, error:{bg:"#fef2f2",br:"#fecaca",tx:"#dc2626"} };
  const c = C[type];
  return (
    <div className="fixed bottom-5 end-5 z-[60] flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl text-sm font-semibold max-w-[calc(100vw-2.5rem)]"
      style={{backgroundColor:c.bg,border:`1px solid ${c.br}`,color:c.tx,animation:"slideUp .3s cubic-bezier(.34,1.56,.64,1) both"}}>
      <span className="flex-shrink-0">{I.ok}</span>
      <span className="flex-1 min-w-0 truncate">{msg}</span>
      <button onClick={onClose} className="opacity-50 hover:opacity-100 transition-opacity flex-shrink-0">{I.close}</button>
    </div>
  );
}

// ─── Payout Detail Modal ──────────────────────────────────────
function PayoutDetailModal({ p,onClose,lang,t }:{ p:PayoutRecord; onClose:()=>void; lang:string; t:(a:string,b:string)=>string }){
  const [copied,setCopied] = useState(false);
  const mc = MC[p.method];
  const copy = () => { navigator.clipboard?.writeText(p.reference).then(()=>{ setCopied(true); setTimeout(()=>setCopied(false),2000); }).catch(()=>{}); };
  return (
    <Backdrop onClose={onClose}>
      <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-sm overflow-hidden" dir={lang==="ar"?"rtl":"ltr"}>
        <div className="h-1" style={{background:`linear-gradient(90deg,${PS[p.status].dot},transparent)`}}/>
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#F1F5F9]">
          <div className="min-w-0">
            <h2 className="text-base font-bold text-[#1e293b]">{t("Payout Details","تفاصيل الدفعة")}</h2>
            <p className="text-xs text-[#94a3b8] mt-0.5 truncate">{p.reference}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex-shrink-0 ms-3 flex items-center justify-center rounded-xl bg-[#F5F7F9] text-[#94a3b8] hover:text-[#1e293b] hover:bg-[#E2E8F0] transition-all">{I.close}</button>
        </div>
        <div className="p-5 space-y-4">
          <div className="rounded-2xl p-5 text-center" style={{backgroundColor:PS[p.status].bg}}>
            <p className="text-4xl font-black" style={{color:PS[p.status].text}}>{p.currency}{p.amount}</p>
            <p className="text-xs mt-1 font-medium" style={{color:PS[p.status].text}}>{p.date}</p>
          </div>
          {[
            { lbl:t("Method","الطريقة"), val:lang==="ar"?mc.labelAr:mc.label },
            { lbl:t("Status","الحالة"),  val:lang==="ar"?PS[p.status].ar:PS[p.status].en },
            { lbl:t("Date","التاريخ"),   val:p.date },
          ].map(r=>(
            <div key={r.lbl} className="flex items-center justify-between py-2 border-b border-[#F1F5F9] last:border-0 gap-3">
              <span className="text-xs text-[#94a3b8] font-medium flex-shrink-0">{r.lbl}</span>
              <span className="text-xs font-bold text-[#1e293b] truncate text-end">{r.val}</span>
            </div>
          ))}
          <div className="flex items-center gap-3 rounded-xl bg-[#F8FAFC] border border-[#F1F5F9] px-3 py-2.5">
            <div className="min-w-0 flex-1">
              <p className="text-[10px] text-[#94a3b8] font-semibold uppercase tracking-wide">{t("Reference","المرجع")}</p>
              <p className="text-xs font-bold text-[#1e293b] mt-0.5 truncate">{p.reference}</p>
            </div>
            <button onClick={copy}
              className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-[#E2E8F0] transition-all active:scale-95"
              style={copied?{backgroundColor:"#d1fae5",color:"#059669",borderColor:"#6ee7b7"}:{color:"#64748b"}}>
              {copied?I.ok:I.copy}
              {copied?t("Copied!","تم!"):t("Copy","نسخ")}
            </button>
          </div>
        </div>
        <div className="px-5 pb-5" style={{paddingBottom:"max(1.25rem,env(safe-area-inset-bottom))"}}>
          <button onClick={onClose} className="w-full py-2.5 rounded-xl text-sm font-semibold border border-[#F1F5F9] text-[#64748b] hover:bg-[#F5F7F9] active:scale-95 transition-all">{t("Close","إغلاق")}</button>
        </div>
      </div>
    </Backdrop>
  );
}

// ─── Withdraw Modal ───────────────────────────────────────────
function WithdrawModal({ available,onSubmit,onClose,lang,t }:{ available:number; onSubmit:(a:number,m:WithdrawMethod)=>void; onClose:()=>void; lang:string; t:(a:string,b:string)=>string }){
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<WithdrawMethod>("bank");
  const [errors, setErrors] = useState<string[]>([]);

  const validate = () => {
    const e:string[] = [];
    const n = parseFloat(amount);
    if(!amount||isNaN(n))  e.push(t("Enter a valid amount.","أدخل مبلغًا صحيحًا."));
    else if(n<10)           e.push(t("Minimum withdrawal is $10.","الحد الأدنى $10."));
    else if(n>available)    e.push(t(`Maximum is $${available}.`,`الحد الأقصى $${available}.`));
    setErrors(e); return e.length===0;
  };

  const quickAmounts = [...new Set([50,100,available].filter(v=>v>0))];
  const inp = "w-full px-3 py-2.5 text-sm border border-[#E2E8F0] rounded-xl bg-white text-[#1e293b] focus:outline-none focus:border-[#107789] focus:ring-1 focus:ring-[#107789]/20 transition-all";

  return (
    <Backdrop onClose={onClose}>
      <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-sm overflow-hidden"
        dir={lang==="ar"?"rtl":"ltr"} style={{maxHeight:"92vh",overflowY:"auto"}}>
        <div className="h-1" style={{background:"linear-gradient(90deg,#107789,#0d6275)"}}/>
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#F1F5F9]">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 flex-shrink-0 rounded-xl bg-[#EBF5F7] flex items-center justify-center text-[#107789]">{I.withdraw2}</div>
            <div className="min-w-0">
              <h2 className="text-sm font-bold text-[#1e293b]">{t("Withdraw Funds","سحب الأرباح")}</h2>
              <p className="text-xs text-[#94a3b8] mt-0.5">{t("Available","المتاح")}: <strong className="text-[#107789]">${available}</strong></p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex-shrink-0 ms-3 flex items-center justify-center rounded-xl bg-[#F5F7F9] text-[#94a3b8] hover:text-[#1e293b] hover:bg-[#E2E8F0] transition-all">{I.close}</button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#64748b] mb-1.5">{t("Amount ($)","المبلغ ($)")}</label>
            <div className="relative">
              <span className="absolute start-3 top-1/2 -translate-y-1/2 text-[#94a3b8] font-bold text-sm pointer-events-none">$</span>
              <input type="number" min="10" max={available} value={amount} onChange={e=>setAmount(e.target.value)}
                className={`${inp} ps-7`} placeholder="0.00"/>
            </div>
            <div className="flex gap-2 mt-2">
              {quickAmounts.map(v=>(
                <button key={v} onClick={()=>setAmount(String(v))}
                  className="flex-1 py-1.5 rounded-lg text-xs font-bold border border-[#E2E8F0] text-[#64748b] hover:bg-[#EBF5F7] hover:text-[#107789] hover:border-[#107789]/30 active:scale-95 transition-all">
                  ${v}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#64748b] mb-1.5">{t("Method","الطريقة")}</label>
            <div className="space-y-2">
              {(Object.entries(MC) as [WithdrawMethod,typeof MC[WithdrawMethod]][]).map(([key,mc])=>(
                <button key={key} onClick={()=>setMethod(key)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium transition-all active:scale-[.98] ${method===key?"border-[#107789]/40 bg-[#EBF5F7]":"border-[#E2E8F0] hover:border-[#107789]/20 hover:bg-[#F8FAFC]"}`}>
                  <span style={{color:method===key?"#107789":"#64748b"}}>{mc.icon}</span>
                  <span className={`truncate ${method===key?"text-[#107789] font-semibold":"text-[#64748b]"}`}>{lang==="ar"?mc.labelAr:mc.label}</span>
                  {method===key&&<span className="ms-auto w-4 h-4 flex-shrink-0 rounded-full bg-[#107789] flex items-center justify-center text-white">{I.ok}</span>}
                </button>
              ))}
            </div>
          </div>
          {errors.length>0&&(
            <div className="rounded-xl bg-[#fef2f2] border border-[#fecaca] p-3 space-y-1">
              {errors.map((e,i)=><p key={i} className="text-xs text-[#ef4444] font-medium">{e}</p>)}
            </div>
          )}
          <div className="flex items-start gap-2 text-xs text-[#94a3b8] bg-[#F8FAFC] rounded-xl p-3">
            <span className="flex-shrink-0 mt-0.5">{I.info}</span>
            <span>{t("Payouts are processed within 2-3 business days.","تُعالج طلبات السحب خلال 2-3 أيام عمل.")}</span>
          </div>
        </div>
        <div className="flex gap-3 px-5 pb-5" style={{paddingBottom:"max(1.25rem,env(safe-area-inset-bottom))"}}>
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-semibold border border-[#F1F5F9] text-[#64748b] hover:bg-[#F5F7F9] active:scale-95 transition-all">{t("Cancel","إلغاء")}</button>
          <button onClick={()=>{ if(validate()) onSubmit(parseFloat(amount),method); }}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white hover:opacity-90 active:scale-95 transition-all"
            style={{backgroundColor:"#107789"}}>
            {I.withdraw2}{t("Withdraw","سحب")}
          </button>
        </div>
      </div>
    </Backdrop>
  );
}

// ─── Stat Card ────────────────────────────────────────────────
function StatCard({ icon,value,label,sub,bg,color,delay=0 }:{ icon:React.ReactNode; value:string; label:string; sub?:string; bg:string; color:string; delay?:number }){
  return (
    <div className="rounded-2xl bg-white border border-[#F1F5F9] shadow-sm p-4 sm:p-5 flex items-start gap-3 sm:gap-4 hover:shadow-md hover:border-[#b2dce4] transition-all duration-300"
      style={{animation:`cardIn .45s ${delay}s cubic-bezier(.34,1.2,.64,1) both`}}>
      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{backgroundColor:bg}}>
        <span style={{color}}>{icon}</span>
      </div>
      <div className="min-w-0">
        <p className="text-xl sm:text-2xl font-black text-[#1e293b] leading-none truncate">{value}</p>
        <p className="text-xs text-[#94a3b8] mt-1 font-medium leading-tight">{label}</p>
        {sub&&<p className="text-[10px] text-[#94a3b8] mt-0.5 truncate">{sub}</p>}
      </div>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────
export default function TeacherWallet(){
  const { lang, isRTL, t } = useLanguage();

  const [payouts,      setPayouts]      = useState<PayoutRecord[]>(PAYOUT_HISTORY);
  const [viewPayout,   setViewPayout]   = useState<PayoutRecord|null>(null);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [toast,        setToast]        = useState<{msg:string;type:"success"|"info"|"error"}|null>(null);
  const [activeTab,    setActiveTab]    = useState<"sessions"|"payouts">("sessions");

  const fire = (msg:string, type:"success"|"info"|"error"="success") => {
    setToast({msg,type}); setTimeout(()=>setToast(null),3500);
  };

  const totalEarned   = SESSIONS.reduce((a,s)=>a+s.earned,0);
  const totalPaid     = payouts.filter(p=>p.status==="paid").reduce((a,p)=>a+p.amount,0);
  const pendingPayout = payouts.filter(p=>p.status==="pending").reduce((a,p)=>a+p.amount,0);
  const available     = Math.max(0, totalEarned - totalPaid - pendingPayout);
  const avgPerSession = Math.round(totalEarned / SESSIONS.length);

  const handleWithdraw = (amount:number, method:WithdrawMethod) => {
    const np:PayoutRecord = {
      id:`P${Date.now()}`, amount, currency:"$",
      date:new Date().toISOString().slice(0,10),
      method, status:"pending",
      reference:`TXN-${Math.floor(Math.random()*90000)+10000}`,
    };
    setPayouts(p=>[np,...p]);
    setShowWithdraw(false);
    fire(t(`Withdrawal of $${amount} submitted!`,`تم تقديم طلب سحب $${amount}!`));
  };

  const statCards = [
    { icon:I.wallet,   value:`$${totalEarned}`,   label:t("Total Earned","إجمالي الأرباح"),   sub:t(`${SESSIONS.length} sessions`,`${SESSIONS.length} جلسة`),    bg:"#EBF5F7", color:"#107789", delay:0    },
    { icon:I.sessions, value:String(SESSIONS.filter(s=>s.type==="normal").length), label:t("Completed","مكتملة"), sub:t("Normal classes","حصص عادية"),             bg:"#d1fae5", color:"#059669", delay:0.06 },
    { icon:I.history,  value:`$${pendingPayout}`,  label:t("Pending Payout","دفعة معلقة"),    sub:t("Processing soon","قريبًا"),                                   bg:"#fef3c7", color:"#d97706", delay:0.12 },
    { icon:I.rate,     value:`$${avgPerSession}`,  label:t("Per Session","متوسط الجلسة"),     sub:t("Average rate","المعدل المتوسط"),                              bg:"#ede9fe", color:"#7c3aed", delay:0.18 },
  ];

  return (
    <>
      <style>{`
        @keyframes cardIn  { from{opacity:0;transform:translateY(14px) scale(.97)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes slideUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes modalIn { from{opacity:0;transform:scale(.93) translateY(10px)} to{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
      `}</style>

      <main className="flex-1 min-h-screen overflow-auto p-4 sm:p-6 space-y-5 sm:space-y-6"
        style={{backgroundColor:"#F5F7F9"}} dir={isRTL?"rtl":"ltr"}>

        {/* ── Header ── */}
        <div className="flex flex-wrap items-start justify-between gap-3" style={{animation:"fadeIn .4s ease both"}}>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[#1e293b] tracking-tight">{t("My Wallet","محفظتي")}</h1>
            <p className="mt-1 text-xs sm:text-sm text-[#94a3b8]">{t("Track your earnings, sessions, and payouts","تتبع أرباحك وجلساتك ومدفوعاتك")}</p>
          </div>
          <button onClick={()=>setShowWithdraw(true)}
            className="flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-sm font-semibold text-white hover:opacity-90 active:scale-95 transition-all shadow-sm"
            style={{backgroundColor:"#107789",animation:"cardIn .4s .1s both"}}>
            {I.withdraw2}
            <span>{t("Withdraw Funds","سحب الأرباح")}</span>
          </button>
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {statCards.map(s=><StatCard key={s.label} {...s}/>)}
        </div>

        {/* ── Hero + Chart ── */}
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-3" style={{animation:"cardIn .45s .2s both"}}>

          {/* Balance Hero */}
          <div className="xl:col-span-1 rounded-2xl overflow-hidden shadow-sm relative"
            style={{background:"linear-gradient(135deg,#0B2C33 0%,#107789 60%,#0d8a9e 100%)"}}>
            <div className="absolute -top-10 -end-10 w-48 h-48 rounded-full opacity-10 bg-white pointer-events-none"/>
            <div className="absolute -bottom-12 -start-12 w-56 h-56 rounded-full opacity-5 bg-white pointer-events-none"/>
            <div className="relative p-5 sm:p-6 flex flex-col justify-between min-h-[200px] sm:min-h-[220px]">
              <div>
                <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-white/60">{t("Available Balance","الرصيد المتاح")}</p>
                <p className="text-4xl sm:text-5xl font-black text-white mt-2 leading-none">${available}</p>
                <p className="text-xs sm:text-sm text-white/60 mt-2">{t("Ready to withdraw","جاهز للسحب")}</p>
              </div>
              <div className="space-y-2 mt-5">
                {[
                  {lbl:t("Total Earned","إجمالي الأرباح"), val:`$${totalEarned}`},
                  {lbl:t("Total Paid Out","إجمالي المدفوع"),val:`$${totalPaid}`},
                  {lbl:t("Pending","معلق"),                 val:`$${pendingPayout}`},
                ].map(r=>(
                  <div key={r.lbl} className="flex items-center justify-between text-xs sm:text-sm gap-2">
                    <span className="text-white/60 truncate">{r.lbl}</span>
                    <span className="font-bold text-white flex-shrink-0">{r.val}</span>
                  </div>
                ))}
              </div>
              <button onClick={()=>setShowWithdraw(true)}
                className="mt-4 w-full py-2.5 rounded-xl text-sm font-bold text-[#107789] bg-white hover:bg-white/90 active:scale-[.98] transition-all flex items-center justify-center gap-2">
                {I.withdraw2}{t("Withdraw Now","اسحب الآن")}
              </button>
            </div>
          </div>

          {/* Chart card */}
          <div className="xl:col-span-2 rounded-2xl bg-white border border-[#F1F5F9] shadow-sm p-4 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3 sm:mb-4">
              <div>
                <p className="text-sm font-bold text-[#1e293b]">{t("Monthly Earnings","الأرباح الشهرية")}</p>
                <p className="text-xs text-[#94a3b8] mt-0.5">{t("Last 6 months","آخر 6 أشهر")}</p>
              </div>
              <span className="text-xs text-[#059669] font-bold bg-[#d1fae5] px-2.5 py-1 rounded-full whitespace-nowrap">
                ↑ 65% {t("vs last month","مقارنة بالشهر")}
              </span>
            </div>
            <BarChart data={MONTHLY_DATA} lang={lang}/>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="flex items-center gap-2 flex-wrap" style={{animation:"cardIn .4s .28s both"}}>
          {([["sessions", t("Sessions","الجلسات")],["payouts",t("Payouts","الدفعات")]] as const).map(([key,lbl])=>(
            <button key={key} onClick={()=>setActiveTab(key)}
              className="px-4 py-2 rounded-xl text-sm font-semibold transition-all active:scale-95"
              style={activeTab===key?{backgroundColor:"#107789",color:"white",boxShadow:"0 2px 8px #10778940"}:{backgroundColor:"white",color:"#64748b",border:"1px solid #F1F5F9"}}>
              {lbl}
            </button>
          ))}
        </div>

        {/* ── Sessions ── */}
        {activeTab==="sessions"&&(
          <div className="rounded-2xl bg-white border border-[#F1F5F9] shadow-sm overflow-hidden"
            style={{animation:"cardIn .4s .32s cubic-bezier(.34,1.2,.64,1) both"}}>
            <div className="px-4 sm:px-5 py-4 border-b border-[#F1F5F9]">
              <h2 className="text-sm font-bold text-[#1e293b]">{t("Completed Sessions","الجلسات المكتملة")}</h2>
              <p className="text-xs text-[#94a3b8] mt-0.5">{SESSIONS.length} {t("sessions","جلسة")}</p>
            </div>
            {/* Mobile card list */}
            <div className="sm:hidden divide-y divide-[#F1F5F9]">
              {SESSIONS.map((s,i)=>(
                <div key={s.id} className="flex items-center gap-3 px-4 py-3.5"
                  style={{animation:`slideUp .3s ${0.35+i*0.04}s ease both`}}>
                  <Av initials={s.avatar} size="sm"/>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-[#1e293b] truncate">{s.student}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[10px] text-[#94a3b8]">{s.date}</span>
                      <span className="text-[#E2E8F0]">·</span>
                      <TBadge type={s.type} lang={lang}/>
                    </div>
                  </div>
                  <span className="text-sm font-black text-[#059669] flex-shrink-0">${s.earned}</span>
                </div>
              ))}
              <div className="flex items-center justify-between px-4 py-3 bg-[#F8FAFC]">
                <span className="text-xs font-bold text-[#64748b] uppercase tracking-wide">{t("Total","الإجمالي")}</span>
                <span className="text-base font-black text-[#107789]">${totalEarned}</span>
              </div>
            </div>
            {/* Desktop table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#F8FAFC]">
                    {[{en:"Student",ar:"الطالب"},{en:"Date",ar:"التاريخ"},{en:"Duration",ar:"المدة"},{en:"Type",ar:"النوع"},{en:"Rate",ar:"السعر"},{en:"Earned",ar:"الأرباح"}].map(col=>(
                      <th key={col.en} className="px-4 py-3 text-start text-xs font-semibold uppercase tracking-wide text-[#94a3b8] whitespace-nowrap">{lang==="ar"?col.ar:col.en}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9]">
                  {SESSIONS.map((s,i)=>(
                    <tr key={s.id} className="hover:bg-[#F8FAFC] transition-colors" style={{animation:`slideUp .3s ${0.35+i*0.04}s ease both`}}>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Av initials={s.avatar}/>
                          <span className="text-xs font-semibold text-[#1e293b] truncate max-w-[120px]">{s.student}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-[#94a3b8]">{I.cal}<span className="text-xs">{s.date}</span></div>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap text-xs text-[#64748b]">{s.duration}</td>
                      <td className="px-4 py-3.5"><TBadge type={s.type} lang={lang}/></td>
                      <td className="px-4 py-3.5 whitespace-nowrap text-xs text-[#64748b]">{s.currency}{s.rate}/hr</td>
                      <td className="px-4 py-3.5 whitespace-nowrap"><span className="text-sm font-bold text-[#059669]">{s.currency}{s.earned}</span></td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-[#F8FAFC] border-t-2 border-[#EBF5F7]">
                    <td colSpan={5} className="px-4 py-3 text-xs font-bold text-[#64748b] uppercase tracking-wide">{t("Total","الإجمالي")}</td>
                    <td className="px-4 py-3"><span className="text-base font-black text-[#107789]">${totalEarned}</span></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}

        {/* ── Payouts ── */}
        {activeTab==="payouts"&&(
          <div style={{animation:"cardIn .4s .32s both"}}>
            {payouts.length===0&&(
              <div className="bg-white rounded-2xl border border-[#F1F5F9] p-12 text-center" style={{animation:"fadeIn .4s both"}}>
                <p className="text-sm text-[#94a3b8]">{t("No payout history yet.","لا يوجد سجل دفعات بعد.")}</p>
              </div>
            )}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {payouts.map((p,i)=>{
                const sc=PS[p.status], mc=MC[p.method];
                return (
                  <div key={p.id}
                    className="group bg-white rounded-2xl border border-[#F1F5F9] overflow-hidden hover:shadow-lg hover:border-[#b2dce4] transition-all duration-300 cursor-pointer"
                    style={{animation:`cardIn .4s ${i*0.06}s cubic-bezier(.34,1.2,.64,1) both`}}
                    onClick={()=>setViewPayout(p)}>
                    <div className="h-0.5 group-hover:h-1 transition-all duration-300" style={{backgroundColor:sc.dot}}/>
                    <div className="p-4 sm:p-5 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-xl sm:text-2xl font-black text-[#1e293b]">{p.currency}{p.amount}</p>
                          <p className="text-xs text-[#94a3b8] mt-0.5">{p.date}</p>
                        </div>
                        <PBadge status={p.status} lang={lang}/>
                      </div>
                      <div className="flex items-center gap-2 pt-2 border-t border-[#F8FAFC]">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{backgroundColor:`${mc.color}18`,color:mc.color}}>{mc.icon}</div>
                        <span className="text-xs font-semibold text-[#64748b] truncate">{lang==="ar"?mc.labelAr:mc.label}</span>
                        <span className="ms-auto flex items-center gap-1 text-[10px] font-mono text-[#94a3b8] flex-shrink-0">···{p.reference.slice(-5)}{I.arrow}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </main>

      {viewPayout&&<PayoutDetailModal p={viewPayout} onClose={()=>setViewPayout(null)} lang={lang} t={t}/>}
      {showWithdraw&&<WithdrawModal available={available} onSubmit={handleWithdraw} onClose={()=>setShowWithdraw(false)} lang={lang} t={t}/>}
      {toast&&<Toast msg={toast.msg} type={toast.type} onClose={()=>setToast(null)}/>}
    </>
  );
}