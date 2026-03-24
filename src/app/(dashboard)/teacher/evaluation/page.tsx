"use client";

import { useState } from "react";
import { useLanguage } from "@/src/contexts/LanguageContext";

// ─── Types ────────────────────────────────────────────────────
type EvalStatus   = "pending" | "submitted" | "draft";
type EvalType     = "trial" | "normal";
type SkillRating  = 1 | 2 | 3 | 4 | 5;

interface Strength  { id: string; en: string; ar: string; }
interface Weakness  { id: string; en: string; ar: string; }

interface EvaluationItem {
  id:          string;
  student:     string;
  avatar:      string;
  level:       string;
  newLevel:    string;
  classDate:   string;
  classTime:   string;
  type:        EvalType;
  status:      EvalStatus;
  subject:     string;
  subjectAr:   string;
  strengths:   Strength[];
  weaknesses:  Weakness[];
  notes:       string;
  skills: {
    speaking:   SkillRating;
    listening:  SkillRating;
    reading:    SkillRating;
    writing:    SkillRating;
    vocabulary: SkillRating;
  };
  submittedAt?: string;
}

// ─── Mock Data ────────────────────────────────────────────────
const INITIAL_EVALS: EvaluationItem[] = [
  {
    id: "E001", student: "Omar Khalid",       avatar: "OK", level: "A1", newLevel: "A1",
    classDate: "2025-03-24", classTime: "11:00 AM", type: "trial", status: "pending",
    subject: "Placement Test", subjectAr: "اختبار تحديد مستوى",
    strengths:  [{ id:"s1", en:"Good pronunciation",  ar:"نطق جيد" }, { id:"s2", en:"Motivated learner", ar:"متحمس للتعلم" }],
    weaknesses: [{ id:"w1", en:"Limited vocabulary",  ar:"مفردات محدودة" }, { id:"w2", en:"Grammar gaps", ar:"فجوات نحوية" }],
    notes: "Omar shows strong enthusiasm for learning. Recommend starting with A1 structured program.",
    skills: { speaking: 2, listening: 3, reading: 2, writing: 1, vocabulary: 2 },
  },
  {
    id: "E002", student: "Noor Al-Amin",      avatar: "NA", level: "A2", newLevel: "A2",
    classDate: "2025-03-24", classTime: "05:00 PM", type: "trial", status: "draft",
    subject: "Placement Test", subjectAr: "اختبار تحديد مستوى",
    strengths:  [{ id:"s1", en:"Good reading speed",  ar:"سرعة قراءة جيدة" }],
    weaknesses: [{ id:"w1", en:"Weak speaking",       ar:"ضعف في المحادثة" }, { id:"w2", en:"Spelling issues", ar:"أخطاء إملائية" }],
    notes: "Did not attend. Draft saved for when she reschedules.",
    skills: { speaking: 1, listening: 2, reading: 3, writing: 2, vocabulary: 2 },
  },
  {
    id: "E003", student: "Sara Al-Rashid",    avatar: "SA", level: "B2", newLevel: "B2",
    classDate: "2025-03-24", classTime: "09:00 AM", type: "normal", status: "submitted",
    subject: "English Speaking", subjectAr: "محادثة إنجليزية",
    strengths:  [{ id:"s1", en:"Excellent intonation",   ar:"تنغيم ممتاز" }, { id:"s2", en:"Wide vocabulary", ar:"مفردات واسعة" }, { id:"s3", en:"Confident speaker", ar:"متحدثة واثقة" }],
    weaknesses: [{ id:"w1", en:"Occasional filler words", ar:"كلمات حشو أحياناً" }],
    notes: "Sara is progressing excellently. Recommend advancing to C1 after 3 more sessions.",
    skills: { speaking: 5, listening: 4, reading: 4, writing: 4, vocabulary: 5 },
    submittedAt: "2025-03-24 10:15 AM",
  },
  {
    id: "E004", student: "Reem Al-Jabri",     avatar: "RJ", level: "A1", newLevel: "A1",
    classDate: "2025-03-25", classTime: "02:00 PM", type: "trial", status: "pending",
    subject: "Placement Test", subjectAr: "اختبار تحديد مستوى",
    strengths:  [{ id:"s1", en:"Attentive listener", ar:"مستمعة منتبهة" }],
    weaknesses: [{ id:"w1", en:"No prior English",    ar:"لا خبرة سابقة" }, { id:"w2", en:"Low confidence", ar:"ثقة منخفضة" }],
    notes: "",
    skills: { speaking: 1, listening: 2, reading: 1, writing: 1, vocabulary: 1 },
  },
  {
    id: "E005", student: "Layla Ahmad",       avatar: "LA", level: "B2", newLevel: "B2",
    classDate: "2025-03-23", classTime: "10:00 AM", type: "normal", status: "submitted",
    subject: "English Literature", subjectAr: "أدب إنجليزي",
    strengths:  [{ id:"s1", en:"Strong analytical skills", ar:"قدرة تحليلية قوية" }, { id:"s2", en:"Good written expression", ar:"تعبير كتابي جيد" }],
    weaknesses: [{ id:"w1", en:"Reading speed",            ar:"سرعة القراءة" }],
    notes: "Excellent engagement with literary texts. Progressing well.",
    skills: { speaking: 4, listening: 4, reading: 3, writing: 5, vocabulary: 4 },
    submittedAt: "2025-03-23 11:30 AM",
  },
  {
    id: "E006", student: "Hani Saeed",        avatar: "HS", level: "B1", newLevel: "B1",
    classDate: "2025-03-22", classTime: "09:00 AM", type: "normal", status: "submitted",
    subject: "Business English", subjectAr: "إنجليزية الأعمال",
    strengths:  [{ id:"s1", en:"Professional vocabulary", ar:"مفردات مهنية" }, { id:"s2", en:"Email writing", ar:"كتابة البريد الإلكتروني" }],
    weaknesses: [{ id:"w1", en:"Presentations",           ar:"العروض التقديمية" }, { id:"w2", en:"Phone English", ar:"الإنجليزية الهاتفية" }],
    notes: "Hani is consistent and professional. Needs practice on spoken presentations.",
    skills: { speaking: 3, listening: 4, reading: 4, writing: 4, vocabulary: 3 },
    submittedAt: "2025-03-22 10:05 AM",
  },
];

// ─── Configs ──────────────────────────────────────────────────
const STATUS_CFG: Record<EvalStatus, { bg: string; text: string; border: string; dot: string; en: string; ar: string }> = {
  pending:   { bg: "#FEF3C7", text: "#D97706", border: "#FDE68A", dot: "#D97706", en: "Pending",   ar: "معلق"      },
  submitted: { bg: "#D1FAE5", text: "#059669", border: "#6EE7B7", dot: "#059669", en: "Submitted", ar: "مُرسَل"    },
  draft:     { bg: "#F1F5F9", text: "#64748B", border: "#CBD5E1", dot: "#94A3B8", en: "Draft",     ar: "مسودة"     },
};
const TYPE_CFG: Record<EvalType, { bg: string; text: string; en: string; ar: string }> = {
  trial:  { bg: "#FEF3C7", text: "#D97706", en: "Trial",  ar: "تجريبية" },
  normal: { bg: "#E0F2FE", text: "#0369A1", en: "Normal", ar: "عادية"   },
};
const LEVELS = ["A1","A2","B1","B2","C1","C2"];
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
function avtColor(s: string){ return AVT_PALETTES[(s.charCodeAt(0)+(s.charCodeAt(1)||0))%AVT_PALETTES.length]; }

const SKILL_LABELS: Record<string,{ en:string; ar:string }> = {
  speaking:   { en:"Speaking",   ar:"المحادثة"   },
  listening:  { en:"Listening",  ar:"الاستماع"   },
  reading:    { en:"Reading",    ar:"القراءة"    },
  writing:    { en:"Writing",    ar:"الكتابة"    },
  vocabulary: { en:"Vocabulary", ar:"المفردات"   },
};

const STRENGTH_SUGGESTIONS: Strength[] = [
  { id:"ss1", en:"Good pronunciation",     ar:"نطق جيد"              },
  { id:"ss2", en:"Wide vocabulary",        ar:"مفردات واسعة"          },
  { id:"ss3", en:"Motivated learner",      ar:"متحمس للتعلم"          },
  { id:"ss4", en:"Strong reading skills",  ar:"مهارات قراءة قوية"     },
  { id:"ss5", en:"Good listening",         ar:"استماع جيد"            },
  { id:"ss6", en:"Creative writing",       ar:"كتابة إبداعية"         },
  { id:"ss7", en:"Fast learner",           ar:"سريع التعلم"           },
  { id:"ss8", en:"Confident speaker",      ar:"متحدث واثق"            },
];
const WEAKNESS_SUGGESTIONS: Weakness[] = [
  { id:"ws1", en:"Limited vocabulary",     ar:"مفردات محدودة"         },
  { id:"ws2", en:"Grammar gaps",           ar:"فجوات نحوية"           },
  { id:"ws3", en:"Weak speaking",          ar:"ضعف في المحادثة"       },
  { id:"ws4", en:"Reading speed",          ar:"سرعة القراءة"          },
  { id:"ws5", en:"Spelling issues",        ar:"أخطاء إملائية"         },
  { id:"ws6", en:"Low confidence",         ar:"ثقة منخفضة"            },
  { id:"ws7", en:"Pronunciation errors",   ar:"أخطاء في النطق"        },
  { id:"ws8", en:"Listening comprehension",ar:"فهم الاستماع"          },
];

type FilterTab = "all" | "pending" | "submitted" | "draft";

// ─── Helpers ──────────────────────────────────────────────────
function genId(){ return `id-${Math.random().toString(36).slice(2,8)}`; }

// ─── Avatar ───────────────────────────────────────────────────
function Avatar({ initials, size="md" }:{ initials:string; size?:"sm"|"md"|"lg"|"xl" }){
  const c = avtColor(initials);
  const dim = { sm:"w-7 h-7 text-[10px]", md:"w-9 h-9 text-xs", lg:"w-12 h-12 text-sm", xl:"w-16 h-16 text-lg" }[size];
  return <div className={`${dim} rounded-full flex items-center justify-center font-bold flex-shrink-0 select-none`} style={{backgroundColor:c.bg,color:c.text}}>{initials}</div>;
}

// ─── Stat Card ────────────────────────────────────────────────
function StatCard({ icon, value, label, bg, color, delay=0 }:{ icon:React.ReactNode; value:string|number; label:string; bg:string; color:string; delay?:number }){
  return (
    <div className="rounded-2xl bg-white border border-[#F1F5F9] shadow-sm p-5 flex items-start gap-4 hover:shadow-md hover:border-[#b2dce4] transition-all duration-300"
      style={{animation:`cardIn .45s ${delay}s cubic-bezier(.34,1.2,.64,1) both`}}>
      <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{backgroundColor:bg}}>
        <span style={{color}}>{icon}</span>
      </div>
      <div>
        <p className="text-2xl font-bold text-[#1e293b] leading-none">{value}</p>
        <p className="text-xs text-[#94a3b8] mt-1 font-medium">{label}</p>
      </div>
    </div>
  );
}

// ─── Status Badge ─────────────────────────────────────────────
function StatusPill({ status, lang }:{ status:EvalStatus; lang:string }){
  const c = STATUS_CFG[status];
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
      style={{backgroundColor:c.bg,color:c.text,border:`1px solid ${c.border}`}}>
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{backgroundColor:c.dot}}/>
      {lang==="ar"?c.ar:c.en}
    </span>
  );
}

// ─── Type Badge ───────────────────────────────────────────────
function TypePill({ type, lang }:{ type:EvalType; lang:string }){
  const c = TYPE_CFG[type];
  return <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold" style={{backgroundColor:c.bg,color:c.text}}>{lang==="ar"?c.ar:c.en}</span>;
}

// ─── Level Badge ──────────────────────────────────────────────
function LevelBadge({ level }:{ level:string }){
  const c = LEVEL_COLORS[level]||{bg:"#f1f5f9",text:"#64748b"};
  return <span className="inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-black tracking-wider" style={{backgroundColor:c.bg,color:c.text}}>{level}</span>;
}

// ─── Skill Stars ──────────────────────────────────────────────
function SkillStars({ value, onChange, readonly=false }:{ value:SkillRating; onChange?:(v:SkillRating)=>void; readonly?:boolean }){
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(n=>(
        <button key={n} type="button"
          onClick={()=>!readonly && onChange && onChange(n as SkillRating)}
          className={`transition-all duration-150 ${readonly?"cursor-default":"hover:scale-125 cursor-pointer active:scale-110"}`}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill={n<=value?"#d97706":"#E2E8F0"} stroke={n<=value?"#d97706":"#CBD5E1"} strokeWidth="1.5">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
        </button>
      ))}
    </div>
  );
}

// ─── Progress Bar ─────────────────────────────────────────────
function PBar({ val, color, delay=0 }:{ val:number; color:string; delay?:number }){
  return (
    <div className="h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden">
      <div className="h-full rounded-full" style={{width:`${val}%`,backgroundColor:color,transition:`width .7s ${delay}s ease`}}/>
    </div>
  );
}

// ─── Backdrop ─────────────────────────────────────────────────
function Backdrop({ onClose, children }:{ onClose:()=>void; children:React.ReactNode }){
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{backgroundColor:"rgba(11,44,51,.45)",backdropFilter:"blur(4px)"}}
      onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{animation:"modalIn .22s cubic-bezier(.34,1.56,.64,1) both"}}>
        {children}
      </div>
    </div>
  );
}

// ─── Icons ────────────────────────────────────────────────────
const I = {
  close:  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  edit:   <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  eye:    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  send:   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
  plus:   <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  trash:  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>,
  ok:     <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  clip:   <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
  star:   <svg width="16" height="16" viewBox="0 0 24 24" fill="#d97706" stroke="#d97706" strokeWidth="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  up:     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"/></svg>,
  dn:     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>,
  search: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  cal:    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  total:  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  pend:   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  done:   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="9 12 11 14 15 10"/></svg>,
  trial:  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
};

// ─── TOAST ────────────────────────────────────────────────────
function Toast({ msg, type, onClose }:{ msg:string; type:"success"|"info"|"error"; onClose:()=>void }){
  const C={success:{bg:"#f0fdf4",br:"#bbf7d0",tx:"#15803d"},info:{bg:"#eff6ff",br:"#bfdbfe",tx:"#1d4ed8"},error:{bg:"#fef2f2",br:"#fecaca",tx:"#dc2626"}};
  const c=C[type];
  return (
    <div className="fixed bottom-5 end-5 z-[60] flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl text-sm font-semibold"
      style={{backgroundColor:c.bg,border:`1px solid ${c.br}`,color:c.tx,minWidth:260,animation:"slideUp .3s cubic-bezier(.34,1.56,.64,1) both"}}>
      <span>{type==="success"?I.ok:I.close}</span>
      <span className="flex-1">{msg}</span>
      <button onClick={onClose} className="opacity-50 hover:opacity-100 transition-opacity">{I.close}</button>
    </div>
  );
}

// ─── EVALUATION CARD ──────────────────────────────────────────
function EvalCard({ ev, idx, lang, t, onView, onEdit, onSubmit }:{
  ev:EvaluationItem; idx:number; lang:string; t:(a:string,b:string)=>string;
  onView:(e:EvaluationItem)=>void;
  onEdit:(e:EvaluationItem)=>void;
  onSubmit:(id:string)=>void;
}){
  const sc = STATUS_CFG[ev.status];
  const avgSkill = Math.round(Object.values(ev.skills).reduce((a,b)=>a+b,0)/5);

  return (
    <div
      className="group relative bg-white rounded-2xl border border-[#F1F5F9] overflow-hidden hover:shadow-lg hover:border-[#b2dce4] transition-all duration-300"
      style={{animation:`cardIn .4s ${idx*0.07}s cubic-bezier(.34,1.2,.64,1) both`}}>
      {/* Top accent */}
      <div className="h-0.5 group-hover:h-1 transition-all duration-300" style={{backgroundColor:sc.dot}}/>

      <div className="p-5 space-y-4">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Avatar initials={ev.avatar} size="md"/>
            <div className="min-w-0">
              <p className="text-sm font-bold text-[#1e293b] truncate">{ev.student}</p>
              <p className="text-xs text-[#94a3b8] mt-0.5 truncate">{lang==="ar"?ev.subjectAr:ev.subject}</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
            <StatusPill status={ev.status} lang={lang}/>
            <TypePill type={ev.type} lang={lang}/>
          </div>
        </div>

        {/* Date + Level row */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 text-[#94a3b8]">
            <span>{I.cal}</span>
            <span className="text-xs">{ev.classDate} · {ev.classTime}</span>
          </div>
          <span className="text-[#E2E8F0]">·</span>
          <div className="flex items-center gap-1.5">
            <LevelBadge level={ev.level}/>
            {ev.newLevel !== ev.level && (
              <>
                <span className="text-[10px] text-[#94a3b8]">→</span>
                <LevelBadge level={ev.newLevel}/>
              </>
            )}
          </div>
        </div>

        {/* Skills mini row */}
        <div className="space-y-2">
          {Object.entries(ev.skills).slice(0,3).map(([key, val],i)=>(
            <div key={key} className="flex items-center gap-2">
              <span className="text-[10px] text-[#94a3b8] w-16 flex-shrink-0">
                {lang==="ar"?SKILL_LABELS[key].ar:SKILL_LABELS[key].en}
              </span>
              <PBar val={(val/5)*100} color={val>=4?"#059669":val>=3?"#107789":val>=2?"#d97706":"#ef4444"} delay={0.2+i*0.1}/>
              <span className="text-[10px] font-bold w-4 text-[#64748b]">{val}</span>
            </div>
          ))}
        </div>

        {/* Strengths & weaknesses counts */}
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#d1fae5] text-[#059669]">
            {I.up} {ev.strengths.length} {t("strengths","نقاط قوة")}
          </span>
          <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#fee2e2] text-[#ef4444]">
            {I.dn} {ev.weaknesses.length} {t("weaknesses","نقاط ضعف")}
          </span>
          <span className="ms-auto flex items-center gap-0.5">
            {I.star}
            <span className="text-[11px] font-black text-[#d97706]">{avgSkill}/5</span>
          </span>
        </div>

        {/* Notes snippet */}
        {ev.notes && (
          <p className="text-xs text-[#64748b] italic line-clamp-2 border-s-2 ps-2 border-[#E2E8F0]">
            "{ev.notes}"
          </p>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 pt-2 border-t border-[#F8FAFC]">
          <button onClick={()=>onView(ev)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-[#E2E8F0] text-[#64748b] hover:bg-[#F1F5F9] active:scale-95 transition-all flex-1 justify-center">
            {I.eye}{t("View","عرض")}
          </button>
          {ev.status !== "submitted" && (
            <button onClick={()=>onEdit(ev)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-[#E2E8F0] text-[#107789] hover:bg-[#EBF5F7] active:scale-95 transition-all flex-1 justify-center">
              {I.edit}{t("Edit","تعديل")}
            </button>
          )}
          {ev.status !== "submitted" && (
            <button onClick={()=>onSubmit(ev.id)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-white hover:opacity-90 active:scale-95 transition-all flex-1 justify-center"
              style={{backgroundColor:"#107789"}}>
              {I.send}{t("Submit","إرسال")}
            </button>
          )}
          {ev.status === "submitted" && (
            <div className="flex items-center gap-1 text-[10px] text-[#059669] font-semibold ms-auto">
              {I.ok}{t("Sent to Admin","أُرسل للإدارة")}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── VIEW MODAL ───────────────────────────────────────────────
function ViewModal({ ev, onClose, lang, t, onEdit }:{
  ev:EvaluationItem; onClose:()=>void; lang:string;
  t:(a:string,b:string)=>string; onEdit:(e:EvaluationItem)=>void;
}){
  const lc = LEVEL_COLORS[ev.newLevel]||{bg:"#f1f5f9",text:"#64748b"};
  return (
    <Backdrop onClose={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full overflow-hidden" dir={lang==="ar"?"rtl":"ltr"}
        style={{maxWidth:780,maxHeight:"90vh",overflowY:"auto"}}>
        <div className="h-1" style={{background:`linear-gradient(90deg, ${STATUS_CFG[ev.status].dot}, transparent)`}}/>

        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-[#F1F5F9]">
          <div className="flex items-center gap-4">
            <Avatar initials={ev.avatar} size="lg"/>
            <div>
              <p className="text-lg font-black text-[#1e293b]">{ev.student}</p>
              <p className="text-xs text-[#94a3b8] mt-0.5">{lang==="ar"?ev.subjectAr:ev.subject}</p>
              <div className="flex items-center flex-wrap gap-1.5 mt-2">
                <StatusPill status={ev.status} lang={lang}/>
                <TypePill type={ev.type} lang={lang}/>
                <LevelBadge level={ev.level}/>
                {ev.newLevel!==ev.level&&<><span className="text-[10px] text-[#94a3b8]">→</span><LevelBadge level={ev.newLevel}/></>}
              </div>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-xl bg-[#F5F7F9] text-[#94a3b8] hover:text-[#1e293b] hover:bg-[#E2E8F0] transition-all flex-shrink-0">{I.close}</button>
        </div>

        {/* Two-column body */}
        <div className="flex" style={{minHeight:0}}>
          {/* Left */}
          <div className="flex-1 px-6 py-5 space-y-5 overflow-y-auto" style={{minWidth:0}}>
            {/* Skills */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-[#94a3b8] mb-3">{t("Skills Assessment","تقييم المهارات")}</p>
              <div className="space-y-3">
                {Object.entries(ev.skills).map(([key,val])=>(
                  <div key={key} className="flex items-center gap-3">
                    <span className="text-xs text-[#64748b] w-20 flex-shrink-0">
                      {lang==="ar"?SKILL_LABELS[key].ar:SKILL_LABELS[key].en}
                    </span>
                    <div className="flex-1">
                      <PBar val={(val/5)*100} color={val>=4?"#059669":val>=3?"#107789":val>=2?"#d97706":"#ef4444"} delay={0}/>
                    </div>
                    <SkillStars value={val as SkillRating} readonly/>
                    <span className="text-xs font-bold text-[#1e293b] w-4">{val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Strengths */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-[#94a3b8] mb-2">{t("Strengths","نقاط القوة")}</p>
              <div className="space-y-1.5">
                {ev.strengths.map(s=>(
                  <div key={s.id} className="flex items-center gap-2 text-xs text-[#059669] bg-[#f0fdf4] rounded-xl px-3 py-2">
                    {I.up}<span className="font-medium">{lang==="ar"?s.ar:s.en}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Weaknesses */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-[#94a3b8] mb-2">{t("Weaknesses","نقاط الضعف")}</p>
              <div className="space-y-1.5">
                {ev.weaknesses.map(w=>(
                  <div key={w.id} className="flex items-center gap-2 text-xs text-[#ef4444] bg-[#fef2f2] rounded-xl px-3 py-2">
                    {I.dn}<span className="font-medium">{lang==="ar"?w.ar:w.en}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="w-px bg-[#F1F5F9] self-stretch flex-shrink-0"/>

          {/* Right */}
          <div className="px-6 py-5 space-y-5 overflow-y-auto" style={{width:280,flexShrink:0}}>
            {/* Meta */}
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-wide text-[#94a3b8]">{t("Details","التفاصيل")}</p>
              {[
                {lbl:t("Date","التاريخ"),  val:ev.classDate},
                {lbl:t("Time","الوقت"),   val:ev.classTime},
                {lbl:t("Level","المستوى"),val:ev.level},
                {lbl:t("Rec. Level","المستوى المقترح"),val:ev.newLevel},
              ].map(r=>(
                <div key={r.lbl} className="rounded-xl bg-[#F8FAFC] border border-[#F1F5F9] px-3 py-2">
                  <p className="text-[10px] text-[#94a3b8] font-semibold uppercase tracking-wide">{r.lbl}</p>
                  <p className="text-xs font-bold text-[#1e293b] mt-0.5">{r.val}</p>
                </div>
              ))}
              {ev.submittedAt&&(
                <div className="rounded-xl bg-[#f0fdf4] border border-[#bbf7d0] px-3 py-2">
                  <p className="text-[10px] text-[#059669] font-semibold uppercase tracking-wide">{t("Submitted At","أُرسل في")}</p>
                  <p className="text-xs font-bold text-[#059669] mt-0.5">{ev.submittedAt}</p>
                </div>
              )}
            </div>

            {/* Notes */}
            <div className="rounded-2xl bg-[#FFFBEB] border border-[#FDE68A] p-4 flex-1">
              <div className="flex items-center gap-1.5 mb-2">
                <span className="text-[#d97706]">{I.clip}</span>
                <p className="text-[10px] font-bold uppercase tracking-wide text-[#d97706]">{t("Notes","الملاحظات")}</p>
              </div>
              <p className="text-sm text-[#64748b] leading-relaxed">{ev.notes||t("No notes.","لا توجد ملاحظات.")}</p>
            </div>

            {/* Edit button */}
            {ev.status!=="submitted"&&(
              <button onClick={()=>{onEdit(ev);onClose();}}
                className="w-full py-2.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all"
                style={{backgroundColor:"#107789"}}>
                {I.edit}{t("Edit Evaluation","تعديل التقييم")}
              </button>
            )}
          </div>
        </div>
      </div>
    </Backdrop>
  );
}

// ─── EDIT / CREATE MODAL ──────────────────────────────────────
function EditModal({ ev, onSave, onClose, lang, t }:{
  ev:EvaluationItem|null; onSave:(updated:EvaluationItem)=>void;
  onClose:()=>void; lang:string; t:(a:string,b:string)=>string;
}){
  const isNew = !ev;
  const [form, setForm] = useState<EvaluationItem>(ev ?? {
    id:genId(), student:"", avatar:"", level:"A1", newLevel:"A1",
    classDate:new Date().toISOString().slice(0,10), classTime:"09:00 AM",
    type:"trial", status:"draft", subject:"Placement Test", subjectAr:"اختبار تحديد مستوى",
    strengths:[], weaknesses:[], notes:"",
    skills:{speaking:3,listening:3,reading:3,writing:3,vocabulary:3},
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [newStrength, setNewStrength] = useState("");
  const [newWeakness, setNewWeakness] = useState("");

  const setSkill = (key: string, val: SkillRating) =>
    setForm(p=>({...p, skills:{...p.skills,[key]:val}}));

  const addStrength = (en:string, ar:string) => {
    if(!en.trim()) return;
    setForm(p=>({...p, strengths:[...p.strengths,{id:genId(),en,ar:ar||en}]}));
    setNewStrength("");
  };
  const addWeakness = (en:string, ar:string) => {
    if(!en.trim()) return;
    setForm(p=>({...p, weaknesses:[...p.weaknesses,{id:genId(),en,ar:ar||en}]}));
    setNewWeakness("");
  };

  const validate = () => {
    const e:string[] = [];
    if(!form.student.trim()) e.push(t("Student name is required.","اسم الطالب مطلوب."));
    setErrors(e);
    return e.length===0;
  };

  const handleSave = (asSubmit=false) => {
    if(!validate()) return;
    onSave({...form, status: asSubmit?"submitted":"draft", submittedAt: asSubmit?new Date().toLocaleString():form.submittedAt});
  };

  const inp = "w-full px-3 py-2.5 text-sm border border-[#E2E8F0] rounded-xl bg-white text-[#1e293b] focus:outline-none focus:border-[#107789] focus:ring-1 focus:ring-[#107789]/20 transition-all";
  const lbl = "block text-xs font-semibold text-[#64748b] mb-1.5";

  return (
    <Backdrop onClose={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full overflow-hidden" dir={lang==="ar"?"rtl":"ltr"}
        style={{maxWidth:820,maxHeight:"92vh",overflowY:"auto"}}>
        <div className="h-1" style={{background:"linear-gradient(90deg,#107789,#0d6275)"}}/>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#F1F5F9]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#EBF5F7] flex items-center justify-center text-[#107789]">{I.edit}</div>
            <div>
              <h2 className="text-sm font-bold text-[#1e293b]">
                {isNew ? t("New Evaluation","تقييم جديد") : t("Edit Evaluation","تعديل التقييم")}
              </h2>
              <p className="text-xs text-[#94a3b8] mt-0.5">{form.student||t("Fill in the form below","أدخل التفاصيل أدناه")}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-xl bg-[#F5F7F9] text-[#94a3b8] hover:text-[#1e293b] hover:bg-[#E2E8F0] transition-all">{I.close}</button>
        </div>

        <div className="p-6 grid grid-cols-2 gap-6">
          {/* ── LEFT: Basic info + Skills ── */}
          <div className="space-y-4">
            {/* Student + Date row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={lbl}>{t("Student Name","اسم الطالب")} *</label>
                <input className={inp} value={form.student} onChange={e=>setForm(p=>({...p,student:e.target.value,avatar:e.target.value.slice(0,2).toUpperCase()}))} placeholder="e.g. Omar Khalid"/>
              </div>
              <div>
                <label className={lbl}>{t("Class Date","تاريخ الحصة")}</label>
                <input type="date" className={inp} value={form.classDate} onChange={e=>setForm(p=>({...p,classDate:e.target.value}))}/>
              </div>
            </div>

            {/* Level + NewLevel row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={lbl}>{t("Current Level","المستوى الحالي")}</label>
                <select className={inp} value={form.level} onChange={e=>setForm(p=>({...p,level:e.target.value}))}>
                  {LEVELS.map(l=><option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div>
                <label className={lbl}>{t("Recommended Level","المستوى المقترح")}</label>
                <select className={inp} value={form.newLevel} onChange={e=>setForm(p=>({...p,newLevel:e.target.value}))}>
                  {LEVELS.map(l=><option key={l} value={l}>{l}</option>)}
                </select>
              </div>
            </div>

            {/* Type */}
            <div>
              <label className={lbl}>{t("Class Type","نوع الحصة")}</label>
              <div className="flex gap-2">
                {(["trial","normal"] as EvalType[]).map(tp=>(
                  <button key={tp} type="button" onClick={()=>setForm(p=>({...p,type:tp}))}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${form.type===tp?"text-white":"border border-[#E2E8F0] text-[#64748b] hover:bg-[#F5F7F9]"}`}
                    style={form.type===tp?{backgroundColor:TYPE_CFG[tp].text}:{}}>
                    {lang==="ar"?TYPE_CFG[tp].ar:TYPE_CFG[tp].en}
                  </button>
                ))}
              </div>
            </div>

            {/* Skills */}
            <div>
              <p className={lbl}>{t("Skills Assessment","تقييم المهارات")}</p>
              <div className="space-y-2.5">
                {Object.entries(form.skills).map(([key,val])=>(
                  <div key={key} className="flex items-center gap-3 bg-[#F8FAFC] rounded-xl px-3 py-2">
                    <span className="text-xs text-[#64748b] w-20 flex-shrink-0">
                      {lang==="ar"?SKILL_LABELS[key].ar:SKILL_LABELS[key].en}
                    </span>
                    <SkillStars value={val as SkillRating} onChange={v=>setSkill(key,v)}/>
                    <span className="text-xs font-bold text-[#1e293b] ms-auto">{val}/5</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── RIGHT: Strengths, Weaknesses, Notes ── */}
          <div className="space-y-4">
            {/* Strengths */}
            <div>
              <p className={lbl}>{t("Strengths","نقاط القوة")}</p>
              {/* Current list */}
              <div className="space-y-1.5 mb-2 max-h-28 overflow-y-auto">
                {form.strengths.map(s=>(
                  <div key={s.id} className="flex items-center gap-2 bg-[#f0fdf4] rounded-lg px-3 py-1.5">
                    <span className="text-[#059669] flex-shrink-0">{I.up}</span>
                    <span className="text-xs font-medium text-[#059669] flex-1 truncate">{lang==="ar"?s.ar:s.en}</span>
                    <button onClick={()=>setForm(p=>({...p,strengths:p.strengths.filter(x=>x.id!==s.id)}))}
                      className="text-[#ef4444] opacity-50 hover:opacity-100 flex-shrink-0 transition-opacity">{I.trash}</button>
                  </div>
                ))}
                {form.strengths.length===0&&<p className="text-xs text-[#94a3b8] italic">{t("No strengths added.","لم تُضف نقاط قوة.")}</p>}
              </div>
              {/* Suggestions */}
              <div className="flex flex-wrap gap-1.5 mb-2">
                {STRENGTH_SUGGESTIONS.filter(s=>!form.strengths.find(x=>x.id===s.id||x.en===s.en)).slice(0,4).map(s=>(
                  <button key={s.id} onClick={()=>addStrength(s.en,s.ar)}
                    className="text-[10px] font-medium px-2 py-1 rounded-full bg-[#f0fdf4] text-[#059669] hover:bg-[#bbf7d0] active:scale-95 transition-all">
                    + {lang==="ar"?s.ar:s.en}
                  </button>
                ))}
              </div>
              {/* Custom input */}
              <div className="flex gap-2">
                <input className={`${inp} text-xs py-2`} value={newStrength} onChange={e=>setNewStrength(e.target.value)}
                  placeholder={t("Add custom strength…","أضف نقطة قوة…")}
                  onKeyDown={e=>{ if(e.key==="Enter"){ e.preventDefault(); addStrength(newStrength,newStrength); }}}/>
                <button onClick={()=>addStrength(newStrength,newStrength)}
                  className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#107789] text-white hover:bg-[#0d6275] active:scale-95 transition-all flex-shrink-0">
                  {I.plus}
                </button>
              </div>
            </div>

            {/* Weaknesses */}
            <div>
              <p className={lbl}>{t("Weaknesses","نقاط الضعف")}</p>
              <div className="space-y-1.5 mb-2 max-h-28 overflow-y-auto">
                {form.weaknesses.map(w=>(
                  <div key={w.id} className="flex items-center gap-2 bg-[#fef2f2] rounded-lg px-3 py-1.5">
                    <span className="text-[#ef4444] flex-shrink-0">{I.dn}</span>
                    <span className="text-xs font-medium text-[#ef4444] flex-1 truncate">{lang==="ar"?w.ar:w.en}</span>
                    <button onClick={()=>setForm(p=>({...p,weaknesses:p.weaknesses.filter(x=>x.id!==w.id)}))}
                      className="text-[#ef4444] opacity-50 hover:opacity-100 flex-shrink-0 transition-opacity">{I.trash}</button>
                  </div>
                ))}
                {form.weaknesses.length===0&&<p className="text-xs text-[#94a3b8] italic">{t("No weaknesses added.","لم تُضف نقاط ضعف.")}</p>}
              </div>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {WEAKNESS_SUGGESTIONS.filter(w=>!form.weaknesses.find(x=>x.id===w.id||x.en===w.en)).slice(0,4).map(w=>(
                  <button key={w.id} onClick={()=>addWeakness(w.en,w.ar)}
                    className="text-[10px] font-medium px-2 py-1 rounded-full bg-[#fef2f2] text-[#ef4444] hover:bg-[#fecaca] active:scale-95 transition-all">
                    + {lang==="ar"?w.ar:w.en}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <input className={`${inp} text-xs py-2`} value={newWeakness} onChange={e=>setNewWeakness(e.target.value)}
                  placeholder={t("Add custom weakness…","أضف نقطة ضعف…")}
                  onKeyDown={e=>{ if(e.key==="Enter"){ e.preventDefault(); addWeakness(newWeakness,newWeakness); }}}/>
                <button onClick={()=>addWeakness(newWeakness,newWeakness)}
                  className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#ef4444] text-white hover:bg-[#dc2626] active:scale-95 transition-all flex-shrink-0">
                  {I.plus}
                </button>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className={lbl}>{t("Teacher Notes","ملاحظات المعلم")}</label>
              <textarea rows={4} className={`${inp} resize-none`} value={form.notes}
                onChange={e=>setForm(p=>({...p,notes:e.target.value}))}
                placeholder={t("Write your notes about the student's performance…","اكتب ملاحظاتك حول أداء الطالب…")}/>
            </div>

            {/* Errors */}
            {errors.length>0 && (
              <div className="rounded-xl bg-[#fef2f2] border border-[#fecaca] p-3 space-y-1">
                {errors.map((e,i)=><p key={i} className="text-xs text-[#ef4444] font-medium">{e}</p>)}
              </div>
            )}
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-end gap-3 px-6 pb-6 border-t border-[#F1F5F9] pt-4">
          <button onClick={onClose} className="px-4 py-2.5 rounded-xl text-sm font-semibold border border-[#F1F5F9] text-[#64748b] hover:bg-[#F5F7F9] active:scale-95 transition-all">
            {t("Cancel","إلغاء")}
          </button>
          <button onClick={()=>handleSave(false)} className="px-4 py-2.5 rounded-xl text-sm font-semibold border border-[#107789]/30 text-[#107789] hover:bg-[#EBF5F7] active:scale-95 transition-all">
            {t("Save Draft","حفظ كمسودة")}
          </button>
          <button onClick={()=>handleSave(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white hover:opacity-90 active:scale-95 transition-all"
            style={{backgroundColor:"#107789"}}>
            {I.send}{t("Submit Evaluation","إرسال التقييم")}
          </button>
        </div>
      </div>
    </Backdrop>
  );
}

// ─── DELETE CONFIRM ───────────────────────────────────────────
function DeleteConfirm({ name, onConfirm, onClose, lang, t }:{
  name:string; onConfirm:()=>void; onClose:()=>void;
  lang:string; t:(a:string,b:string)=>string;
}){
  return (
    <Backdrop onClose={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden" dir={lang==="ar"?"rtl":"ltr"}>
        <div className="p-6 space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#fee2e2] flex items-center justify-center text-[#ef4444] flex-shrink-0">{I.trash}</div>
            <div>
              <h2 className="text-base font-bold text-[#1e293b]">{t("Delete Evaluation","حذف التقييم")}</h2>
              <p className="text-sm text-[#64748b] mt-1">
                {t("Delete evaluation for","حذف تقييم")} <strong>{name}</strong>?{" "}
                <span className="text-[#ef4444] text-xs font-medium">{t("Cannot be undone.","لا يمكن التراجع.")}</span>
              </p>
            </div>
          </div>
        </div>
        <div className="flex gap-3 px-6 pb-5">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-semibold border border-[#F1F5F9] text-[#64748b] hover:bg-[#F5F7F9] active:scale-95 transition-all">{t("No, keep","لا، احتفظ")}</button>
          <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white hover:opacity-90 active:scale-95 transition-all" style={{backgroundColor:"#ef4444"}}>{t("Yes, Delete","نعم، احذف")}</button>
        </div>
      </div>
    </Backdrop>
  );
}

// ─── PAGE ──────────────────────────────────────────────────────
export default function TeacherEvaluations(){
  const { lang, isRTL, t } = useLanguage();

  const [evals,   setEvals]   = useState<EvaluationItem[]>(INITIAL_EVALS);
  const [filter,  setFilter]  = useState<FilterTab>("all");
  const [search,  setSearch]  = useState("");
  const [viewEv,  setViewEv]  = useState<EvaluationItem|null>(null);
  const [editEv,  setEditEv]  = useState<EvaluationItem|null|"new">(null);
  const [delEv,   setDelEv]   = useState<EvaluationItem|null>(null);
  const [toast,   setToast]   = useState<{msg:string;type:"success"|"info"|"error"}|null>(null);

  const fire = (msg:string, type:"success"|"info"|"error"="success") => {
    setToast({msg,type}); setTimeout(()=>setToast(null),3500);
  };

  // ── Handlers ──
  const handleSave = (updated:EvaluationItem) => {
    setEvals(p=>{
      const idx = p.findIndex(e=>e.id===updated.id);
      return idx>=0 ? p.map(e=>e.id===updated.id?updated:e) : [updated,...p];
    });
    setEditEv(null);
    fire(updated.status==="submitted"
      ? t("Evaluation submitted to admin!","تم إرسال التقييم إلى الإدارة!")
      : t("Draft saved.","تم حفظ المسودة."),
      updated.status==="submitted"?"success":"info");
  };

  const handleSubmit = (id:string) => {
    setEvals(p=>p.map(e=>e.id===id?{...e,status:"submitted",submittedAt:new Date().toLocaleString()}:e));
    fire(t("Evaluation submitted!","تم إرسال التقييم!"),"success");
  };

  const handleDelete = () => {
    if(!delEv) return;
    setEvals(p=>p.filter(e=>e.id!==delEv.id));
    setDelEv(null);
    fire(t("Evaluation deleted.","تم حذف التقييم."),"error");
  };

  // ── Derived ──
  const filtered = evals.filter(e=>{
    const matchF = filter==="all"||e.status===filter;
    const q = search.toLowerCase();
    const matchS = !q||e.student.toLowerCase().includes(q)||e.subject.toLowerCase().includes(q);
    return matchF && matchS;
  });

  const stats = [
    { icon:I.total, value:evals.length,                              label:t("Total","الإجمالي"),   bg:"#EBF5F7", color:"#107789", delay:0    },
    { icon:I.pend,  value:evals.filter(e=>e.status==="pending").length, label:t("Pending","معلقة"),  bg:"#FEF3C7", color:"#D97706", delay:0.06 },
    { icon:I.done,  value:evals.filter(e=>e.status==="submitted").length,label:t("Submitted","مُرسَلة"),bg:"#D1FAE5", color:"#059669", delay:0.12 },
    { icon:I.trial, value:evals.filter(e=>e.type==="trial").length,  label:t("Trial Evals","تقييمات تجريبية"), bg:"#FEF3C7", color:"#D97706", delay:0.18 },
  ];

  const FILTERS: {key:FilterTab; en:string; ar:string; count:number}[] = [
    {key:"all",       en:"All",       ar:"الكل",      count:evals.length},
    {key:"pending",   en:"Pending",   ar:"معلقة",     count:evals.filter(e=>e.status==="pending").length},
    {key:"submitted", en:"Submitted", ar:"مُرسَلة",   count:evals.filter(e=>e.status==="submitted").length},
    {key:"draft",     en:"Draft",     ar:"مسودة",     count:evals.filter(e=>e.status==="draft").length},
  ];

  return (
    <>
      <style>{`
        @keyframes cardIn  { from{opacity:0;transform:translateY(14px) scale(.97)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes slideUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes modalIn { from{opacity:0;transform:scale(.93) translateY(10px)} to{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
      `}</style>

      <main className="flex-1 min-h-screen overflow-auto p-6 space-y-6" style={{backgroundColor:"#F5F7F9"}} dir={isRTL?"rtl":"ltr"}>

        {/* ── Header ── */}
        <div className="flex flex-wrap items-start justify-between gap-4" style={{animation:"fadeIn .4s ease both"}}>
          <div>
            <h1 className="text-2xl font-black text-[#1e293b] tracking-tight">{t("Evaluations","التقييمات")}</h1>
            <p className="mt-1 text-sm text-[#94a3b8]">{t("Manage student evaluations and trial assessments","إدارة تقييمات الطلاب والحصص التجريبية")}</p>
          </div>
          <button onClick={()=>setEditEv("new")}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white hover:opacity-90 active:scale-95 transition-all shadow-sm"
            style={{backgroundColor:"#107789",animation:"cardIn .4s .1s both"}}>
            {I.plus}{t("New Evaluation","تقييم جديد")}
          </button>
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map(s=><StatCard key={s.label} {...s}/>)}
        </div>

        {/* ── Filters + Search ── */}
        <div className="flex flex-wrap items-center justify-between gap-3" style={{animation:"cardIn .4s .18s both"}}>
          <div className="flex items-center gap-2 flex-wrap">
            {FILTERS.map(f=>(
              <button key={f.key} onClick={()=>setFilter(f.key)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all active:scale-95"
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
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-[#F1F5F9] shadow-sm" style={{minWidth:220}}>
            <span className="text-[#94a3b8]">{I.search}</span>
            <input type="text" value={search} onChange={e=>setSearch(e.target.value)}
              placeholder={t("Search evaluations…","ابحث عن تقييم…")}
              className="flex-1 bg-transparent text-sm text-[#1e293b] placeholder:text-[#C4CAD4] focus:outline-none"/>
            {search&&<button onClick={()=>setSearch("")} className="text-[#94a3b8] hover:text-[#1e293b] transition-colors">{I.close}</button>}
          </div>
        </div>

        {/* ── Empty state ── */}
        {filtered.length===0&&(
          <div className="bg-white rounded-2xl border border-[#F1F5F9] shadow-sm p-16 flex flex-col items-center gap-3 text-center"
            style={{animation:"fadeIn .4s both"}}>
            <div className="w-14 h-14 rounded-2xl bg-[#EBF5F7] flex items-center justify-center text-[#107789] mb-1">{I.clip}</div>
            <p className="text-base font-bold text-[#1e293b]">{t("No evaluations found","لا توجد تقييمات")}</p>
            <p className="text-sm text-[#94a3b8]">{t("Try adjusting your filters or create a new evaluation.","جرّب تعديل الفلاتر أو أنشئ تقييمًا جديدًا.")}</p>
            <button onClick={()=>setEditEv("new")}
              className="mt-2 flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white hover:opacity-90 active:scale-95 transition-all"
              style={{backgroundColor:"#107789"}}>
              {I.plus}{t("New Evaluation","تقييم جديد")}
            </button>
          </div>
        )}

        {/* ── Cards Grid ── */}
        {filtered.length>0&&(
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((ev,i)=>(
              <div key={ev.id} className="group relative">
                <EvalCard ev={ev} idx={i} lang={lang} t={t}
                  onView={setViewEv} onEdit={e=>setEditEv(e)} onSubmit={handleSubmit}/>
                {/* Delete button — appears on hover */}
                <button onClick={()=>setDelEv(ev)}
                  className="absolute top-3 end-3 w-7 h-7 flex items-center justify-center rounded-lg border border-[#fecaca] text-[#ef4444] bg-white
                             opacity-0 group-hover:opacity-100 hover:bg-[#fee2e2] active:scale-95 transition-all duration-200 z-10">
                  {I.trash}
                </button>
              </div>
            ))}
          </div>
        )}

      </main>

      {/* ── Modals ── */}
      {viewEv&&<ViewModal ev={viewEv} onClose={()=>setViewEv(null)} lang={lang} t={t} onEdit={e=>{setViewEv(null);setEditEv(e);}}/>}

      {editEv!==null&&(
        <EditModal
          ev={editEv==="new"?null:editEv}
          onSave={handleSave}
          onClose={()=>setEditEv(null)}
          lang={lang} t={t}/>
      )}

      {delEv&&<DeleteConfirm name={delEv.student} onConfirm={handleDelete} onClose={()=>setDelEv(null)} lang={lang} t={t}/>}

      {toast&&<Toast msg={toast.msg} type={toast.type} onClose={()=>setToast(null)}/>}
    </>
  );
}