"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/src/contexts/LanguageContext";

// ─── Types ────────────────────────────────────────────────────
type ClassStatus = "upcoming" | "completed" | "missed" | "in-progress" | "cancelled";
type ClassType   = "trial" | "normal";
type ViewMode    = "cards" | "calendar";
type FilterTab   = "all" | "upcoming" | "completed" | "missed" | "trial";

interface ClassItem {
  id:         string;
  date:       string;       // "2025-03-24"
  dayLabel:   string;       // "Mon"
  dayLabelAr: string;
  time:       string;
  endTime:    string;
  student:    string;
  avatar:     string;
  level:      string;
  status:     ClassStatus;
  type:       ClassType;
  duration:   string;
  notes:      string;
  phone:      string;
  subject:    string;
  subjectAr:  string;
  sessionNo:  number;
  totalSessions: number;
  progress:   number;
}

// ─── Mock Data ────────────────────────────────────────────────
const ALL_CLASSES: ClassItem[] = [
  { id:"C001", date:"2025-03-24", dayLabel:"Mon", dayLabelAr:"إث", time:"09:00 AM", endTime:"10:00 AM", student:"Sara Al-Rashid",    avatar:"SA", level:"B2", status:"completed",   type:"normal", duration:"60 min", notes:"Excellent session — improved intonation significantly.",   phone:"+966 50 111 2222", subject:"English Speaking",   subjectAr:"محادثة إنجليزية",   sessionNo:14, totalSessions:20, progress:70 },
  { id:"C002", date:"2025-03-24", dayLabel:"Mon", dayLabelAr:"إث", time:"11:00 AM", endTime:"11:45 AM", student:"Omar Khalid",       avatar:"OK", level:"A1", status:"in-progress", type:"trial",  duration:"45 min", notes:"First trial — assess vocabulary & reading.",                phone:"+966 50 333 4444", subject:"Placement Test",     subjectAr:"اختبار تحديد مستوى",sessionNo:1,  totalSessions:1,  progress:100},
  { id:"C003", date:"2025-03-24", dayLabel:"Mon", dayLabelAr:"إث", time:"01:00 PM", endTime:"02:00 PM", student:"Lina Hassan",       avatar:"LH", level:"B1", status:"upcoming",    type:"normal", duration:"60 min", notes:"Focus on academic writing and grammar drills.",            phone:"+966 55 555 6666", subject:"Academic Writing",   subjectAr:"الكتابة الأكاديمية",sessionNo:8,  totalSessions:24, progress:33 },
  { id:"C004", date:"2025-03-24", dayLabel:"Mon", dayLabelAr:"إث", time:"03:00 PM", endTime:"04:00 PM", student:"Faisal Al-Mutairi", avatar:"FA", level:"C1", status:"upcoming",    type:"normal", duration:"60 min", notes:"Advanced essay structure and critical analysis.",          phone:"+966 55 777 8888", subject:"IELTS Preparation",  subjectAr:"تحضير IELTS",       sessionNo:19, totalSessions:30, progress:63 },
  { id:"C005", date:"2025-03-24", dayLabel:"Mon", dayLabelAr:"إث", time:"05:00 PM", endTime:"05:45 PM", student:"Noor Al-Amin",      avatar:"NA", level:"A2", status:"missed",      type:"trial",  duration:"45 min", notes:"No-show. Send reminder for rescheduling.",                 phone:"+966 56 999 0000", subject:"Placement Test",     subjectAr:"اختبار تحديد مستوى",sessionNo:1,  totalSessions:1,  progress:0  },
  { id:"C006", date:"2025-03-25", dayLabel:"Tue", dayLabelAr:"ثلث", time:"10:00 AM", endTime:"11:00 AM", student:"Khalid Mansoor",  avatar:"KM", level:"B1", status:"upcoming",    type:"normal", duration:"60 min", notes:"Listening comprehension exercises and note-taking.",       phone:"+966 50 121 3434", subject:"English Listening",  subjectAr:"الاستماع الإنجليزي",sessionNo:5,  totalSessions:16, progress:31 },
  { id:"C007", date:"2025-03-25", dayLabel:"Tue", dayLabelAr:"ثلث", time:"02:00 PM", endTime:"02:45 PM", student:"Reem Al-Jabri",   avatar:"RJ", level:"A1", status:"upcoming",    type:"trial",  duration:"45 min", notes:"Trial class — evaluate pronunciation and fluency.",        phone:"+966 50 234 5678", subject:"Placement Test",     subjectAr:"اختبار تحديد مستوى",sessionNo:1,  totalSessions:1,  progress:0  },
  { id:"C008", date:"2025-03-26", dayLabel:"Wed", dayLabelAr:"أرب", time:"09:00 AM", endTime:"10:00 AM", student:"Ahmed Al-Zahrani",avatar:"AZ", level:"C1", status:"upcoming",    type:"normal", duration:"60 min", notes:"Debate techniques and argumentative speech.",              phone:"+966 55 876 5432", subject:"Advanced Speaking",  subjectAr:"محادثة متقدمة",     sessionNo:22, totalSessions:30, progress:73 },
  { id:"C009", date:"2025-03-26", dayLabel:"Wed", dayLabelAr:"أرب", time:"04:00 PM", endTime:"04:45 PM", student:"Dina Yousef",     avatar:"DY", level:"A2", status:"upcoming",    type:"trial",  duration:"45 min", notes:"Second trial — assess writing and reading comprehension.",  phone:"+966 56 543 2109", subject:"Placement Test",     subjectAr:"اختبار تحديد مستوى",sessionNo:1,  totalSessions:1,  progress:0  },
  { id:"C010", date:"2025-03-27", dayLabel:"Thu", dayLabelAr:"خم", time:"11:00 AM", endTime:"12:00 PM", student:"Sara Al-Rashid",   avatar:"SA", level:"B2", status:"upcoming",    type:"normal", duration:"60 min", notes:"Practice conversation using podcast-based materials.",     phone:"+966 50 111 2222", subject:"English Speaking",   subjectAr:"محادثة إنجليزية",   sessionNo:15, totalSessions:20, progress:75 },
  { id:"C011", date:"2025-03-23", dayLabel:"Sun", dayLabelAr:"أح", time:"10:00 AM", endTime:"11:00 AM", student:"Layla Ahmad",     avatar:"LA", level:"B2", status:"completed",   type:"normal", duration:"60 min", notes:"Great progress on fluency. Assigned new reading.",          phone:"+966 55 432 1098", subject:"English Literature", subjectAr:"أدب إنجليزي",       sessionNo:9,  totalSessions:20, progress:45 },
  { id:"C012", date:"2025-03-22", dayLabel:"Sat", dayLabelAr:"سبت", time:"09:00 AM", endTime:"10:00 AM", student:"Hani Saeed",     avatar:"HS", level:"B1", status:"completed",   type:"normal", duration:"60 min", notes:"Completed Unit 4 vocabulary exercises with 92% accuracy.", phone:"+966 50 987 6543", subject:"Business English",   subjectAr:"إنجليزية الأعمال",  sessionNo:12, totalSessions:18, progress:67 },
];

// ─── Configs ──────────────────────────────────────────────────
const STATUS_CFG: Record<ClassStatus, { bg:string; text:string; border:string; dot:string; en:string; ar:string }> = {
  upcoming:     { bg:"#EBF5F7", text:"#107789", border:"#b2dce4", dot:"#107789", en:"Upcoming",     ar:"قادمة"      },
  completed:    { bg:"#d1fae5", text:"#059669", border:"#6ee7b7", dot:"#059669", en:"Completed",    ar:"مكتملة"     },
  missed:       { bg:"#fee2e2", text:"#ef4444", border:"#fca5a5", dot:"#ef4444", en:"Missed",       ar:"فائتة"      },
  "in-progress":{ bg:"#ede9fe", text:"#7c3aed", border:"#c4b5fd", dot:"#7c3aed", en:"In Progress",  ar:"جارية الآن" },
  cancelled:    { bg:"#f1f5f9", text:"#64748b", border:"#cbd5e1", dot:"#94a3b8", en:"Cancelled",    ar:"ملغاة"      },
};
const TYPE_CFG: Record<ClassType, { bg:string; text:string; en:string; ar:string }> = {
  trial:  { bg:"#fef3c7", text:"#d97706", en:"Trial",  ar:"تجريبية" },
  normal: { bg:"#e0f2fe", text:"#0369a1", en:"Normal", ar:"عادية"   },
};
const LEVEL_COLORS: Record<string,{ bg:string; text:string }> = {
  "A1":{ bg:"#f0fdf4", text:"#15803d" }, "A2":{ bg:"#dcfce7", text:"#15803d" },
  "B1":{ bg:"#eff6ff", text:"#1d4ed8" }, "B2":{ bg:"#dbeafe", text:"#1d4ed8" },
  "C1":{ bg:"#fdf4ff", text:"#7e22ce" }, "C2":{ bg:"#f5f3ff", text:"#7e22ce" },
};

const AVT_PALETTES = [
  { bg:"#EBF5F7", text:"#107789" },{ bg:"#ede9fe", text:"#7c3aed" },
  { bg:"#d1fae5", text:"#059669" },{ bg:"#fef3c7", text:"#d97706" },
  { bg:"#fee2e2", text:"#ef4444" },{ bg:"#e0f2fe", text:"#0369a1" },
];
function avtColor(s:string){ return AVT_PALETTES[(s.charCodeAt(0)+(s.charCodeAt(1)||0))%AVT_PALETTES.length]; }

const DAYS_EN = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const DAYS_AR = ["أح","إث","ثلث","أرب","خم","جم","سبت"];
const MONTHS_EN = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

// ─── useAnimateIn hook (stagger fade+slide) ───────────────────
function useAnimateIn(deps: unknown[]) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setVisible(false); const t = setTimeout(() => setVisible(true), 30); return () => clearTimeout(t); }, deps);
  return visible;
}

// ─── Small Components ─────────────────────────────────────────
function Avatar({ initials, size="md" }:{ initials:string; size?:"sm"|"md"|"lg"|"xl" }) {
  const c = avtColor(initials);
  const dim = { sm:"w-7 h-7 text-[10px]", md:"w-9 h-9 text-xs", lg:"w-12 h-12 text-sm", xl:"w-16 h-16 text-lg" }[size];
  return (
    <div className={`${dim} rounded-full flex items-center justify-center font-bold flex-shrink-0 select-none`}
      style={{ backgroundColor:c.bg, color:c.text }}>
      {initials}
    </div>
  );
}

function StatusPill({ status, lang }:{ status:ClassStatus; lang:string }) {
  const c = STATUS_CFG[status];
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
      style={{ backgroundColor:c.bg, color:c.text, border:`1px solid ${c.border}` }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor:c.dot }}/>
      {lang==="ar" ? c.ar : c.en}
    </span>
  );
}

function TypePill({ type, lang }:{ type:ClassType; lang:string }) {
  const c = TYPE_CFG[type];
  return (
    <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold"
      style={{ backgroundColor:c.bg, color:c.text }}>
      {lang==="ar" ? c.ar : c.en}
    </span>
  );
}

function LevelBadge({ level }:{ level:string }) {
  const c = LEVEL_COLORS[level] || { bg:"#f1f5f9", text:"#64748b" };
  return (
    <span className="inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-black tracking-wider"
      style={{ backgroundColor:c.bg, color:c.text }}>
      {level}
    </span>
  );
}

function ProgressRing({ val, size=40, stroke=3, color="#107789" }:{ val:number; size?:number; stroke?:number; color?:string }) {
  const r = (size - stroke*2) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (val / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform:"rotate(-90deg)" }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#F1F5F9" strokeWidth={stroke}/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        style={{ transition:"stroke-dasharray .8s cubic-bezier(.4,0,.2,1)" }}/>
    </svg>
  );
}

function PBar({ val, color }:{ val:number; color:string }) {
  return (
    <div className="h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden">
      <div className="h-full rounded-full" style={{ width:`${val}%`, backgroundColor:color, transition:"width .7s ease" }}/>
    </div>
  );
}

// ─── Backdrop ─────────────────────────────────────────────────
function Backdrop({ onClose, children }:{ onClose:()=>void; children:React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor:"rgba(11,44,51,.45)", backdropFilter:"blur(4px)" }}
      onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{ animation:"modalIn .22s cubic-bezier(.34,1.56,.64,1) both" }}>
        {children}
      </div>
    </div>
  );
}

// ─── Icons ────────────────────────────────────────────────────
const IC = {
  play:    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>,
  eye:     <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  res:     <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>,
  trash:   <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>,
  close:   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  cal:     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  clk:     <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  user:    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  phone:   <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
  book:    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
  note:    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  cards:   <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  list:    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>,
  chevL:   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>,
  chevR:   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>,
  ok:      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  warn:    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  search:  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  filter:  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
  msg:     <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
};

// ─── DETAIL MODAL ─────────────────────────────────────────────
function DetailModal({ c, onClose, onStart, onReschedule, onDelete, lang, t }: {
  c: ClassItem; onClose:()=>void; onStart:(id:string)=>void;
  onReschedule:(c:ClassItem)=>void; onDelete:(c:ClassItem)=>void;
  lang:string; t:(a:string,b:string)=>string;
}) {
  const sc  = STATUS_CFG[c.status];
  const lc  = LEVEL_COLORS[c.level] || { bg:"#f1f5f9", text:"#64748b" };
  const canStart = c.status==="upcoming"||c.status==="in-progress";

  const infoRows = [
    { lbl:t("Date","التاريخ"),     val:`${c.dayLabel}, ${c.date}`,                  ic:IC.cal   },
    { lbl:t("Time","الوقت"),       val:`${c.time} – ${c.endTime}`,                  ic:IC.clk   },
    { lbl:t("Duration","المدة"),   val:c.duration,                                  ic:IC.clk   },
    { lbl:t("Phone","الهاتف"),     val:c.phone,                                     ic:IC.phone },
    { lbl:t("Subject","المادة"),   val:lang==="ar"?c.subjectAr:c.subject,            ic:IC.book  },
    { lbl:t("Session","الجلسة"),   val:`${c.sessionNo} / ${c.totalSessions}`,        ic:IC.user  },
  ];

  return (
    <Backdrop onClose={onClose}>
      {/*
        Wide / horizontal layout — max-w-3xl gives ~768px,
        two equal columns separated by a divider.
      */}
      <div
        className="bg-white rounded-2xl shadow-2xl w-full overflow-hidden"
        dir={lang==="ar"?"rtl":"ltr"}
        style={{ maxWidth:820, maxHeight:"90vh" }}
      >
        {/* Top accent bar (full width) */}
        <div className="h-1" style={{ background:`linear-gradient(90deg, ${sc.dot}, ${sc.dot}55, transparent)` }}/>

        {/* ── Two-column body ── */}
        <div className="flex" style={{ minHeight:0 }}>

          {/* ── LEFT COLUMN — student info + details ── */}
          <div className="flex-1 px-7 pt-6 pb-6 flex flex-col gap-5 overflow-y-auto" style={{ minWidth:0 }}>

            {/* Student header */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-4">
                <Avatar initials={c.avatar} size="lg"/>
                <div>
                  <p className="text-lg font-black text-[#1e293b] leading-tight">{c.student}</p>
                  <p className="text-xs text-[#94a3b8] mt-0.5">{lang==="ar"?c.subjectAr:c.subject}</p>
                  <div className="flex items-center flex-wrap gap-1.5 mt-2">
                    <StatusPill status={c.status} lang={lang}/>
                    <TypePill   type={c.type}   lang={lang}/>
                    <LevelBadge level={c.level}/>
                  </div>
                </div>
              </div>
              {/* Close on mobile falls here; on desktop it's in the right col */}
              <button onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-xl bg-[#F5F7F9] text-[#94a3b8] hover:text-[#1e293b] hover:bg-[#E2E8F0] transition-all flex-shrink-0 lg:hidden">
                {IC.close}
              </button>
            </div>

            {/* Info grid — 2 cols inside left panel */}
            <div className="grid grid-cols-2 gap-2.5">
              {infoRows.map(r=>(
                <div key={r.lbl} className="rounded-xl bg-[#F8FAFC] border border-[#F1F5F9] px-3 py-2.5">
                  <div className="flex items-center gap-1.5 text-[#94a3b8] mb-1">
                    <span className="flex-shrink-0">{r.ic}</span>
                    <span className="text-[10px] font-semibold uppercase tracking-wide">{r.lbl}</span>
                  </div>
                  <p className="text-xs font-bold text-[#1e293b] leading-snug">{r.val}</p>
                </div>
              ))}
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-1 mt-auto">
              {canStart && (
                <button onClick={()=>{onStart(c.id);onClose();}}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white hover:opacity-90 active:scale-95 transition-all"
                  style={{backgroundColor:c.status==="in-progress"?"#7c3aed":"#107789"}}>
                  {IC.play}{t("Start Class","ابدأ الحصة")}
                </button>
              )}
              {(c.status==="upcoming"||c.status==="missed") && (
                <button onClick={()=>{onReschedule(c);onClose();}}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border border-[#E2E8F0] text-[#64748b] hover:bg-[#F5F7F9] active:scale-95 transition-all">
                  {IC.res}{t("Reschedule","إعادة جدولة")}
                </button>
              )}
              <button
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border border-[#E2E8F0] text-[#107789] hover:bg-[#EBF5F7] active:scale-95 transition-all">
                {IC.msg}{t("Message","رسالة")}
              </button>
              <button onClick={()=>{onDelete(c);onClose();}}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold border border-[#fecaca] text-[#ef4444] hover:bg-[#fee2e2] active:scale-95 transition-all ms-auto">
                {IC.trash}
              </button>
            </div>
          </div>

          {/* Vertical divider */}
          <div className="w-px bg-[#F1F5F9] self-stretch flex-shrink-0"/>

          {/* ── RIGHT COLUMN — progress + notes + close ── */}
          <div className="flex flex-col gap-5 px-7 pt-6 pb-6 overflow-y-auto" style={{ width:300, flexShrink:0 }}>

            {/* Close button (desktop) */}
            <div className="flex justify-end -mt-1 -me-1">
              <button onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-xl bg-[#F5F7F9] text-[#94a3b8] hover:text-[#1e293b] hover:bg-[#E2E8F0] transition-all">
                {IC.close}
              </button>
            </div>

            {/* Progress card */}
            <div className="rounded-2xl bg-[#F8FAFC] border border-[#F1F5F9] p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-[#1e293b]">{t("Course Progress","تقدم المقرر")}</p>
                {/* Ring */}
                <div className="relative w-14 h-14 flex-shrink-0">
                  <ProgressRing val={c.progress} size={56} stroke={5} color={lc.text}/>
                  <span className="absolute inset-0 flex items-center justify-center text-[11px] font-black" style={{color:lc.text}}>
                    {c.progress}%
                  </span>
                </div>
              </div>
              <PBar val={c.progress} color={lc.text}/>
              <p className="text-[10px] text-[#94a3b8]">
                {c.sessionNo} {t("of","من")} {c.totalSessions} {t("sessions completed","جلسات مكتملة")}
              </p>

              {/* Mini session pills */}
              <div className="flex items-center gap-2 pt-1 flex-wrap">
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#d1fae5] text-[#059669]">
                  {c.sessionNo} {t("done","منجز")}
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#EBF5F7] text-[#107789]">
                  {c.totalSessions - c.sessionNo} {t("left","متبقي")}
                </span>
              </div>
            </div>

            {/* Teacher notes */}
            <div className="rounded-2xl bg-[#FFFBEB] border border-[#FDE68A] p-4 flex-1">
              <div className="flex items-center gap-1.5 mb-2">
                <span className="text-[#d97706]">{IC.note}</span>
                <p className="text-[10px] font-bold uppercase tracking-wide text-[#d97706]">
                  {t("Teacher Notes","ملاحظات المعلم")}
                </p>
              </div>
              <p className="text-sm text-[#64748b] leading-relaxed">
                {c.notes || t("No notes yet.","لا توجد ملاحظات.")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Backdrop>
  );
}

// ─── RESCHEDULE MODAL ─────────────────────────────────────────
const TIME_OPTS = ["08:00 AM","09:00 AM","10:00 AM","11:00 AM","12:00 PM","01:00 PM","02:00 PM","03:00 PM","04:00 PM","05:00 PM","06:00 PM","07:00 PM"];
function RescheduleModal({ c, onSave, onClose, lang, t }:{ c:ClassItem; onSave:(id:string,d:string,ti:string)=>void; onClose:()=>void; lang:string; t:(a:string,b:string)=>string }) {
  const [date,setDate]=useState(c.date);
  const [time,setTime]=useState(c.time);
  const [err,setErr]=useState("");
  const inp="w-full px-3 py-2.5 text-sm border border-[#E2E8F0] rounded-xl bg-white text-[#1e293b] focus:outline-none focus:border-[#107789] focus:ring-1 focus:ring-[#107789]/20 transition-all";
  return (
    <Backdrop onClose={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden" dir={lang==="ar"?"rtl":"ltr"}>
        <div className="h-1" style={{background:"linear-gradient(90deg,#107789,#0d6275)"}}/>
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#EBF5F7] flex items-center justify-center text-[#107789]">{IC.res}</div>
            <div>
              <h2 className="text-sm font-bold text-[#1e293b]">{t("Reschedule Class","إعادة جدولة الحصة")}</h2>
              <p className="text-xs text-[#94a3b8]">{c.student}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-xl bg-[#F5F7F9] text-[#94a3b8] hover:text-[#1e293b] transition-colors">{IC.close}</button>
        </div>
        <div className="px-6 pb-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#64748b] mb-1.5">{t("New Date","التاريخ الجديد")}</label>
            <input type="date" value={date} onChange={e=>{setDate(e.target.value);setErr("");}} className={inp}/>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#64748b] mb-1.5">{t("New Time","الوقت الجديد")}</label>
            <select value={time} onChange={e=>setTime(e.target.value)} className={inp}>
              {TIME_OPTS.map(o=><option key={o} value={o}>{o}</option>)}
            </select>
          </div>
          {err && <p className="text-xs text-[#ef4444] flex items-center gap-1.5 font-medium">{IC.warn}{err}</p>}
          <div className="flex gap-3 pt-1">
            <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-semibold border border-[#F1F5F9] text-[#64748b] hover:bg-[#F5F7F9] transition-all">{t("Cancel","إلغاء")}</button>
            <button onClick={()=>{ if(!date){setErr(t("Select a date.","اختر تاريخًا.")); return;} onSave(c.id,date,time); }}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-all active:scale-95" style={{backgroundColor:"#107789"}}>
              {t("Save","حفظ")}
            </button>
          </div>
        </div>
      </div>
    </Backdrop>
  );
}

// ─── DELETE CONFIRM ───────────────────────────────────────────
function DeleteConfirm({ c, onConfirm, onClose, lang, t }:{ c:ClassItem; onConfirm:(id:string)=>void; onClose:()=>void; lang:string; t:(a:string,b:string)=>string }) {
  return (
    <Backdrop onClose={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden" dir={lang==="ar"?"rtl":"ltr"}>
        <div className="p-6 space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#fee2e2] flex items-center justify-center text-[#ef4444] flex-shrink-0">{IC.trash}</div>
            <div>
              <h2 className="text-base font-bold text-[#1e293b]">{t("Delete Class","حذف الحصة")}</h2>
              <p className="text-sm text-[#64748b] mt-1">
                {t("Permanently delete the class with","سيتم حذف الحصة مع")} <strong>{c.student}</strong> {t("on","في")} {c.date} {t("at","الساعة")} {c.time}?
                <br/><span className="text-[#ef4444] text-xs font-medium">{t("This action cannot be undone.","لا يمكن التراجع عن هذا الإجراء.")}</span>
              </p>
            </div>
          </div>
        </div>
        <div className="flex gap-3 px-6 pb-5">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-semibold border border-[#F1F5F9] text-[#64748b] hover:bg-[#F5F7F9] transition-all">{t("No, keep it","لا، احتفظ به")}</button>
          <button onClick={()=>onConfirm(c.id)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white hover:opacity-90 active:scale-95 transition-all" style={{backgroundColor:"#ef4444"}}>{t("Yes, Delete","نعم، احذف")}</button>
        </div>
      </div>
    </Backdrop>
  );
}

// ─── TOAST ────────────────────────────────────────────────────
function Toast({ msg, type, onClose }:{ msg:string; type:"success"|"info"|"error"; onClose:()=>void }) {
  const C = { success:{bg:"#f0fdf4",br:"#bbf7d0",tx:"#15803d",ic:IC.ok}, info:{bg:"#eff6ff",br:"#bfdbfe",tx:"#1d4ed8",ic:IC.ok}, error:{bg:"#fef2f2",br:"#fecaca",tx:"#dc2626",ic:IC.close} };
  const c=C[type];
  return (
    <div className="fixed bottom-5 end-5 z-[60] flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl text-sm font-semibold"
      style={{backgroundColor:c.bg,border:`1px solid ${c.br}`,color:c.tx,minWidth:260,animation:"slideUp .3s cubic-bezier(.34,1.56,.64,1) both"}}>
      <span>{c.ic}</span><span className="flex-1">{msg}</span>
      <button onClick={onClose} className="opacity-50 hover:opacity-100 transition-opacity">{IC.close}</button>
    </div>
  );
}

// ─── CLASS CARD ───────────────────────────────────────────────
function ClassCard({ c, idx, lang, t, onView, onStart, onReschedule, onDelete }: {
  c:ClassItem; idx:number; lang:string; t:(a:string,b:string)=>string;
  onView:(c:ClassItem)=>void; onStart:(id:string)=>void;
  onReschedule:(c:ClassItem)=>void; onDelete:(c:ClassItem)=>void;
}) {
  const sc = STATUS_CFG[c.status];
  const lc = LEVEL_COLORS[c.level] || { bg:"#f1f5f9", text:"#64748b" };
  const canStart = c.status==="upcoming"||c.status==="in-progress";

  return (
    <div
      className="group relative bg-white rounded-2xl border border-[#F1F5F9] overflow-hidden hover:shadow-lg hover:border-[#b2dce4] transition-all duration-300"
      style={{ animation:`cardIn .4s ${idx*0.06}s cubic-bezier(.34,1.2,.64,1) both`, transformOrigin:"top center" }}
    >
      {/* Top accent bar */}
      <div className="h-0.5 transition-all duration-300 group-hover:h-1" style={{ backgroundColor: sc.dot }}/>

      {/* Live pulse for in-progress */}
      {c.status==="in-progress" && (
        <div className="absolute top-3 end-3 flex items-center gap-1.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{backgroundColor:"#7c3aed"}}/>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5" style={{backgroundColor:"#7c3aed"}}/>
          </span>
          <span className="text-[10px] font-bold text-[#7c3aed] uppercase tracking-wide">{t("LIVE","مباشر")}</span>
        </div>
      )}

      <div className="p-5">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3 min-w-0">
            <Avatar initials={c.avatar} size="md"/>
            <div className="min-w-0">
              <p className="text-sm font-bold text-[#1e293b] truncate">{c.student}</p>
              <p className="text-xs text-[#94a3b8] mt-0.5 truncate">{lang==="ar"?c.subjectAr:c.subject}</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
            <StatusPill status={c.status} lang={lang}/>
            <TypePill type={c.type} lang={lang}/>
          </div>
        </div>

        {/* Time & Date row */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center gap-1.5 text-[#64748b]">
            <span>{IC.clk}</span>
            <span className="text-xs font-semibold text-[#1e293b]">{c.time} – {c.endTime}</span>
          </div>
          <span className="text-[#E2E8F0]">·</span>
          <div className="flex items-center gap-1.5 text-[#94a3b8]">
            <span>{IC.cal}</span>
            <span className="text-xs">{c.dayLabel}, {c.date.slice(5)}</span>
          </div>
        </div>

        {/* Level + Session */}
        <div className="flex items-center gap-2 mb-4">
          <LevelBadge level={c.level}/>
          <span className="text-[10px] text-[#94a3b8] font-medium">
            {t("Session","جلسة")} {c.sessionNo}/{c.totalSessions}
          </span>
          <span className="text-[#E2E8F0] mx-1">·</span>
          <span className="text-[10px] text-[#94a3b8]">{c.duration}</span>
        </div>

        {/* Progress bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] text-[#94a3b8] font-medium">{t("Progress","التقدم")}</span>
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-bold" style={{color:lc.text}}>{c.progress}%</span>
            </div>
          </div>
          <PBar val={c.progress} color={lc.text}/>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-3 border-t border-[#F8FAFC]">
          {canStart && (
            <button onClick={()=>onStart(c.id)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-white hover:opacity-90 active:scale-95 transition-all flex-1"
              style={{backgroundColor:c.status==="in-progress"?"#7c3aed":"#107789"}}>
              {IC.play}
              {t("Start Class","ابدأ الحصة")}
            </button>
          )}
          <button onClick={()=>onView(c)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-[#E2E8F0] text-[#64748b] hover:bg-[#F1F5F9] active:scale-95 transition-all"
            style={{flex:canStart?"0 0 auto":1}}>
            {IC.eye}{!canStart && <span>{t("View Details","عرض التفاصيل")}</span>}
          </button>
          {(c.status==="upcoming"||c.status==="missed") && (
            <button onClick={()=>onReschedule(c)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-[#E2E8F0] text-[#64748b] hover:bg-[#F1F5F9] active:scale-95 transition-all">
              {IC.res}
            </button>
          )}
          <button onClick={()=>onDelete(c)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-[#fecaca] text-[#ef4444] hover:bg-[#fee2e2] active:scale-95 transition-all ms-auto">
            {IC.trash}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── CALENDAR VIEW ────────────────────────────────────────────
function CalendarView({ classes, weekStart, lang, t, onView, onStart }:{
  classes:ClassItem[]; weekStart:Date; lang:string; t:(a:string,b:string)=>string;
  onView:(c:ClassItem)=>void; onStart:(id:string)=>void;
}) {
  const days = Array.from({length:7},(_,i)=>{ const d=new Date(weekStart); d.setDate(d.getDate()+i); return d; });
  const toKey = (d:Date) => d.toISOString().slice(0,10);
  const byDay = days.map(d=>({ d, items:classes.filter(c=>c.date===toKey(d)) }));
  const today = toKey(new Date());

  return (
    <div className="rounded-2xl bg-white border border-[#F1F5F9] shadow-sm overflow-hidden" style={{animation:"cardIn .35s cubic-bezier(.34,1.2,.64,1) both"}}>
      {/* Day headers */}
      <div className="grid grid-cols-7 border-b border-[#F1F5F9]">
        {byDay.map(({d},i)=>{
          const isToday = toKey(d)===today;
          return (
            <div key={i} className="py-3 text-center border-e border-[#F1F5F9] last:border-0">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-[#94a3b8]">
                {lang==="ar"?DAYS_AR[d.getDay()]:DAYS_EN[d.getDay()]}
              </p>
              <div className={`mx-auto mt-1 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${isToday?"text-white":"text-[#1e293b]"}`}
                style={isToday?{backgroundColor:"#107789"}:{}}>
                {d.getDate()}
              </div>
            </div>
          );
        })}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 min-h-[420px]">
        {byDay.map(({d,items},i)=>{
          const isToday = toKey(d)===today;
          return (
            <div key={i} className="border-e border-[#F1F5F9] last:border-0 p-2 space-y-1.5"
              style={{backgroundColor:isToday?"#FAFFFE":"white"}}>
              {items.length===0 && (
                <div className="h-full flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <span className="text-[10px] text-[#E2E8F0]">—</span>
                </div>
              )}
              {items.map((c,j)=>{
                const sc=STATUS_CFG[c.status];
                return (
                  <button key={j} onClick={()=>onView(c)}
                    className="w-full text-start rounded-xl p-2 hover:shadow-md transition-all active:scale-95 cursor-pointer group/card"
                    style={{backgroundColor:sc.bg,border:`1px solid ${sc.border}`,animation:`cardIn .3s ${j*0.08}s both`}}>
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{backgroundColor:sc.dot}}/>
                      <span className="text-[10px] font-bold truncate" style={{color:sc.text}}>{c.time}</span>
                    </div>
                    <p className="text-[10px] font-semibold text-[#1e293b] truncate leading-tight">{c.student}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <LevelBadge level={c.level}/>
                      <TypePill type={c.type} lang={lang}/>
                    </div>
                    {(c.status==="upcoming"||c.status==="in-progress") && (
                      <button onClick={e=>{e.stopPropagation();onStart(c.id);}}
                        className="mt-1.5 w-full flex items-center justify-center gap-1 py-1 rounded-lg text-[10px] font-bold text-white transition-all opacity-0 group-hover/card:opacity-100"
                        style={{backgroundColor:c.status==="in-progress"?"#7c3aed":"#107789"}}>
                        {IC.play}{t("Start","ابدأ")}
                      </button>
                    )}
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── STAT CARD ────────────────────────────────────────────────
function MiniStat({ label, value, color, icon, delay=0 }:{ label:string; value:string|number; color:string; icon:React.ReactNode; delay?:number }) {
  return (
    <div className="bg-white rounded-2xl border border-[#F1F5F9] shadow-sm p-4 flex items-center gap-3"
      style={{animation:`cardIn .4s ${delay}s cubic-bezier(.34,1.2,.64,1) both`}}>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{backgroundColor:`${color}18`,color}}>
        {icon}
      </div>
      <div>
        <p className="text-xl font-black" style={{color}}>{value}</p>
        <p className="text-[11px] text-[#94a3b8] font-medium mt-0.5 leading-tight">{label}</p>
      </div>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────
export default function TeacherClasses() {
  const { lang, isRTL, t } = useLanguage();
  const router = useRouter();

  const [classes, setClasses]   = useState<ClassItem[]>(ALL_CLASSES);
  const [view,    setView]      = useState<ViewMode>("cards");
  const [filter,  setFilter]    = useState<FilterTab>("all");
  const [search,  setSearch]    = useState("");
  const [weekStart, setWeekStart] = useState<Date>(() => {
    const d = new Date(); d.setDate(d.getDate()-d.getDay()); d.setHours(0,0,0,0); return d;
  });

  // Modals
  const [viewCls,   setViewCls]   = useState<ClassItem|null>(null);
  const [resCls,    setResCls]    = useState<ClassItem|null>(null);
  const [delCls,    setDelCls]    = useState<ClassItem|null>(null);
  const [toast,     setToast]     = useState<{msg:string;type:"success"|"info"|"error"}|null>(null);

  const animKey = `${filter}-${search}`;
  const visible = useAnimateIn([animKey]);

  const fire = (msg:string, type:"success"|"info"|"error"="success") => {
    setToast({msg,type}); setTimeout(()=>setToast(null),3500);
  };

  // ── Derived ──
  const filtered = classes.filter(c => {
    const matchFilter =
      filter==="all"      ? true :
      filter==="trial"    ? c.type==="trial" :
      filter==="upcoming" ? c.status==="upcoming"||c.status==="in-progress" :
      c.status===filter;
    const q = search.toLowerCase();
    const matchSearch = !q || c.student.toLowerCase().includes(q) || c.subject.toLowerCase().includes(q) || c.level.toLowerCase().includes(q);
    return matchFilter && matchSearch;
  });

  // Stats
  const totalToday   = classes.filter(c=>c.date===new Date().toISOString().slice(0,10)).length;
  const totalUpcoming= classes.filter(c=>c.status==="upcoming"||c.status==="in-progress").length;
  const totalDone    = classes.filter(c=>c.status==="completed").length;
  const totalTrials  = classes.filter(c=>c.type==="trial").length;

  // ── Handlers ──
  const handleStart = (id:string) => { void id; router.push("/class/live"); };

  const handleReschedule = (id:string, date:string, time:string) => {
    setClasses(p=>p.map(c=>c.id===id?{...c,date,time,status:"upcoming"}:c));
    setResCls(null);
    fire(t(`Class rescheduled to ${date} at ${time}`,`تمت إعادة الجدولة إلى ${date} الساعة ${time}`));
  };

  const handleDelete = (id:string) => {
    setClasses(p=>p.filter(c=>c.id!==id));
    setDelCls(null);
    fire(t("Class deleted.","تم حذف الحصة."),"error");
  };

  // ── Week navigation ──
  const prevWeek = () => { const d=new Date(weekStart); d.setDate(d.getDate()-7); setWeekStart(d); };
  const nextWeek = () => { const d=new Date(weekStart); d.setDate(d.getDate()+7); setWeekStart(d); };
  const weekEnd  = new Date(weekStart); weekEnd.setDate(weekEnd.getDate()+6);
  const weekLabel = `${weekStart.getDate()} ${MONTHS_EN[weekStart.getMonth()]} – ${weekEnd.getDate()} ${MONTHS_EN[weekEnd.getMonth()]}`;

  const FILTERS: { key:FilterTab; en:string; ar:string; count:number }[] = [
    { key:"all",      en:"All",       ar:"الكل",      count:classes.length },
    { key:"upcoming", en:"Upcoming",  ar:"القادمة",   count:totalUpcoming  },
    { key:"completed",en:"Completed", ar:"المكتملة",  count:totalDone      },
    { key:"missed",   en:"Missed",    ar:"الفائتة",   count:classes.filter(c=>c.status==="missed").length },
    { key:"trial",    en:"Trials",    ar:"التجريبية", count:totalTrials    },
  ];

  return (
    <>
      {/* ── Global keyframe styles ── */}
      <style>{`
        @keyframes cardIn {
          from { opacity:0; transform:translateY(12px) scale(.97); }
          to   { opacity:1; transform:translateY(0)    scale(1);   }
        }
        @keyframes slideUp {
          from { opacity:0; transform:translateY(16px); }
          to   { opacity:1; transform:translateY(0);    }
        }
        @keyframes modalIn {
          from { opacity:0; transform:scale(.94) translateY(8px); }
          to   { opacity:1; transform:scale(1)   translateY(0);   }
        }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes pulse2 { 0%,100%{opacity:1} 50%{opacity:.5} }
      `}</style>

      <main className="flex-1 min-h-screen overflow-auto p-6 space-y-6" style={{backgroundColor:"#F5F7F9"}} dir={isRTL?"rtl":"ltr"}>

        {/* ── Page Header ── */}
        <div className="flex flex-wrap items-start justify-between gap-4" style={{animation:"cardIn .35s both"}}>
          <div>
            <h1 className="text-2xl font-black text-[#1e293b] tracking-tight">{t("My Classes","حصصي")}</h1>
            <p className="mt-1 text-sm text-[#94a3b8]">
              {t("Manage all your scheduled sessions","إدارة جميع حصصك المجدولة")}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* View toggle */}
            <div className="flex items-center bg-white border border-[#F1F5F9] rounded-xl p-1 gap-1 shadow-sm">
              {([["cards", IC.cards, t("Cards","بطاقات")],["calendar", IC.list, t("Calendar","تقويم")]] as const).map(([v,ic,lbl])=>(
                <button key={v} onClick={()=>setView(v as ViewMode)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                  style={view===v?{backgroundColor:"#107789",color:"white"}:{color:"#64748b"}}>
                  {ic}<span>{lbl}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Stats Row ── */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <MiniStat label={t("Today's Classes","حصص اليوم")} value={totalToday}   color="#107789" icon={IC.cal}  delay={0}    />
          <MiniStat label={t("Upcoming","القادمة")}           value={totalUpcoming} color="#7c3aed" icon={IC.clk} delay={0.05} />
          <MiniStat label={t("Completed","المكتملة")}         value={totalDone}    color="#059669" icon={IC.ok}  delay={0.1}  />
          <MiniStat label={t("Trial Classes","تجريبية")}      value={totalTrials}  color="#d97706" icon={IC.user}delay={0.15} />
        </div>

        {/* ── Filters + Search ── */}
        <div className="flex flex-wrap items-center justify-between gap-3" style={{animation:"cardIn .4s .15s both"}}>
          {/* Filter tabs */}
          <div className="flex items-center gap-2 flex-wrap">
            {FILTERS.map(f=>(
              <button key={f.key} onClick={()=>setFilter(f.key)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all"
                style={filter===f.key
                  ?{backgroundColor:"#107789",color:"white",boxShadow:"0 2px 8px #10778940"}
                  :{backgroundColor:"white",color:"#64748b",border:"1px solid #F1F5F9"}}>
                {lang==="ar"?f.ar:f.en}
                <span className="text-[10px] rounded-full px-1.5 py-0.5 font-black"
                  style={filter===f.key?{backgroundColor:"rgba(255,255,255,.25)"}:{backgroundColor:"#F1F5F9",color:"#94a3b8"}}>
                  {f.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-[#F1F5F9] shadow-sm" style={{minWidth:220}}>
            <span className="text-[#94a3b8]">{IC.search}</span>
            <input
              type="text" value={search} onChange={e=>setSearch(e.target.value)}
              placeholder={t("Search classes…","ابحث عن حصة…")}
              className="flex-1 bg-transparent text-sm text-[#1e293b] placeholder:text-[#C4CAD4] focus:outline-none"
            />
            {search && (
              <button onClick={()=>setSearch("")} className="text-[#94a3b8] hover:text-[#1e293b] transition-colors">{IC.close}</button>
            )}
          </div>
        </div>

        {/* ── Calendar week nav (only in calendar view) ── */}
        {view==="calendar" && (
          <div className="flex items-center justify-between bg-white border border-[#F1F5F9] shadow-sm rounded-2xl px-5 py-3"
            style={{animation:"cardIn .3s both"}}>
            <button onClick={prevWeek} className="w-8 h-8 flex items-center justify-center rounded-xl border border-[#F1F5F9] text-[#64748b] hover:bg-[#F5F7F9] transition-all">
              {isRTL?IC.chevR:IC.chevL}
            </button>
            <div className="text-center">
              <p className="text-sm font-bold text-[#1e293b]">{weekLabel}</p>
              <p className="text-[10px] text-[#94a3b8] mt-0.5">{t("Weekly View","العرض الأسبوعي")}</p>
            </div>
            <button onClick={nextWeek} className="w-8 h-8 flex items-center justify-center rounded-xl border border-[#F1F5F9] text-[#64748b] hover:bg-[#F5F7F9] transition-all">
              {isRTL?IC.chevL:IC.chevR}
            </button>
          </div>
        )}

        {/* ── Empty state ── */}
        {filtered.length===0 && (
          <div className="bg-white rounded-2xl border border-[#F1F5F9] shadow-sm p-16 flex flex-col items-center justify-center gap-3 text-center"
            style={{animation:"fadeIn .4s both"}}>
            <div className="w-14 h-14 rounded-2xl bg-[#EBF5F7] flex items-center justify-center text-[#107789] mb-1">
              {IC.cal}
            </div>
            <p className="text-base font-bold text-[#1e293b]">{t("No classes found","لا توجد حصص")}</p>
            <p className="text-sm text-[#94a3b8]">{t("Try adjusting your filters or search.","جرّب تعديل الفلاتر أو البحث.")}</p>
          </div>
        )}

        {/* ── Cards View ── */}
        {view==="cards" && filtered.length>0 && visible && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {filtered.map((c,i)=>(
              <ClassCard key={c.id} c={c} idx={i} lang={lang} t={t}
                onView={setViewCls} onStart={handleStart}
                onReschedule={setResCls} onDelete={setDelCls}/>
            ))}
          </div>
        )}

        {/* ── Calendar View ── */}
        {view==="calendar" && (
          <CalendarView classes={filtered} weekStart={weekStart} lang={lang} t={t}
            onView={setViewCls} onStart={handleStart}/>
        )}

      </main>

      {/* ── Modals ── */}
      {viewCls && (
        <DetailModal c={viewCls} onClose={()=>setViewCls(null)}
          onStart={handleStart} onReschedule={setResCls} onDelete={setDelCls}
          lang={lang} t={t}/>
      )}
      {resCls && (
        <RescheduleModal c={resCls} onSave={handleReschedule} onClose={()=>setResCls(null)} lang={lang} t={t}/>
      )}
      {delCls && (
        <DeleteConfirm c={delCls} onConfirm={handleDelete} onClose={()=>setDelCls(null)} lang={lang} t={t}/>
      )}

      {/* ── Toast ── */}
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={()=>setToast(null)}/>}
    </>
  );
}