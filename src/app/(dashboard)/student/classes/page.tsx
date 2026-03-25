"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/src/contexts/LanguageContext";

// ─── Types ────────────────────────────────────────────────────
type ClassStatus = "live" | "upcoming" | "completed" | "missed" | "cancelled";
type FilterTab   = "all" | "upcoming" | "completed" | "missed";

interface ClassItem {
  id:         string;
  teacher:    string;
  teacherAr:  string;
  avatar:     string;
  subject:    string;
  subjectAr:  string;
  date:       string;
  dateLabel:  string;
  dateLabelAr:string;
  time:       string;
  duration:   string;
  status:     ClassStatus;
  type:       "regular" | "trial";
  sessionNo:  number;
  totalSessions: number;
  zoomLink:   string;
  notes:      string;
  notesAr:    string;
  rating?:    number;
}

// ─── Mock Data ────────────────────────────────────────────────
const ALL_CLASSES: ClassItem[] = [
  { id:"c1",  teacher:"Mr. Ahmad Nasser",  teacherAr:"أ. أحمد الناصر",  avatar:"AN", subject:"English Speaking",  subjectAr:"محادثة إنجليزية",  date:"2025-03-24", dateLabel:"Today",      dateLabelAr:"اليوم",      time:"03:00 PM", duration:"60 min", status:"live",      type:"regular", sessionNo:14, totalSessions:20, zoomLink:"https://zoom.us/j/123", notes:"Focus on natural flow",       notesAr:"التركيز على التدفق الطبيعي" },
  { id:"c2",  teacher:"Ms. Nora Khalil",   teacherAr:"أ. نورا خليل",    avatar:"NK", subject:"Grammar & Writing",  subjectAr:"قواعد وكتابة",     date:"2025-03-25", dateLabel:"Tomorrow",   dateLabelAr:"غداً",       time:"10:00 AM", duration:"60 min", status:"upcoming",  type:"regular", sessionNo:8,  totalSessions:16, zoomLink:"https://zoom.us/j/456", notes:"Unit 4 review",               notesAr:"مراجعة الوحدة 4" },
  { id:"c3",  teacher:"Dr. Samir Yousef",  teacherAr:"د. سمير يوسف",   avatar:"SY", subject:"IELTS Preparation",  subjectAr:"تحضير IELTS",      date:"2025-03-26", dateLabel:"Wednesday",  dateLabelAr:"الأربعاء",   time:"02:00 PM", duration:"90 min", status:"upcoming",  type:"regular", sessionNo:5,  totalSessions:12, zoomLink:"https://zoom.us/j/789", notes:"Reading section practice",    notesAr:"تدريب قسم القراءة" },
  { id:"c4",  teacher:"Mr. Ahmad Nasser",  teacherAr:"أ. أحمد الناصر",  avatar:"AN", subject:"English Speaking",  subjectAr:"محادثة إنجليزية",  date:"2025-03-22", dateLabel:"Sat, Mar 22",dateLabelAr:"السبت 22",   time:"03:00 PM", duration:"60 min", status:"completed", type:"regular", sessionNo:13, totalSessions:20, zoomLink:"",                           notes:"Great session on idioms",     notesAr:"جلسة رائعة عن التعابير", rating:5 },
  { id:"c5",  teacher:"Ms. Nora Khalil",   teacherAr:"أ. نورا خليل",    avatar:"NK", subject:"Grammar & Writing",  subjectAr:"قواعد وكتابة",     date:"2025-03-20", dateLabel:"Thu, Mar 20",dateLabelAr:"الخميس 20",  time:"10:00 AM", duration:"60 min", status:"completed", type:"regular", sessionNo:7,  totalSessions:16, zoomLink:"",                           notes:"Conditional sentences done",  notesAr:"أسلوب الشرط مكتمل",       rating:4 },
  { id:"c6",  teacher:"Dr. Samir Yousef",  teacherAr:"د. سمير يوسف",   avatar:"SY", subject:"IELTS Preparation",  subjectAr:"تحضير IELTS",      date:"2025-03-18", dateLabel:"Tue, Mar 18",dateLabelAr:"الثلاثاء 18",time:"02:00 PM", duration:"90 min", status:"missed",    type:"regular", sessionNo:4,  totalSessions:12, zoomLink:"",                           notes:"",                            notesAr:"" },
  { id:"c7",  teacher:"Ms. Rima Hassan",   teacherAr:"أ. ريما حسن",     avatar:"RH", subject:"Trial Class",        subjectAr:"حصة تجريبية",      date:"2025-03-10", dateLabel:"Mon, Mar 10",dateLabelAr:"الاثنين 10", time:"11:00 AM", duration:"45 min", status:"completed", type:"trial",   sessionNo:1,  totalSessions:1,  zoomLink:"",                           notes:"Assessment completed",        notesAr:"اكتمل التقييم",           rating:5 },
];

const DAYS_EN = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const DAYS_AR = ["أح","إث","ثل","أر","خم","جم","سب"];
const MONTHS_EN = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

// ─── Status config ────────────────────────────────────────────
const ST: Record<ClassStatus,{bg:string;text:string;border:string;dot:string;en:string;ar:string}> = {
  live:      {bg:"#fee2e2",text:"#ef4444",border:"#fca5a5",dot:"#ef4444",en:"Live Now",   ar:"مباشر الآن"},
  upcoming:  {bg:"#EBF5F7",text:"#107789",border:"#b2dce4",dot:"#107789",en:"Upcoming",   ar:"قادمة"},
  completed: {bg:"#d1fae5",text:"#059669",border:"#6ee7b7",dot:"#059669",en:"Completed",  ar:"مكتملة"},
  missed:    {bg:"#fef3c7",text:"#d97706",border:"#fde68a",dot:"#d97706",en:"Missed",     ar:"فائتة"},
  cancelled: {bg:"#f1f5f9",text:"#64748b",border:"#cbd5e1",dot:"#94a3b8",en:"Cancelled",  ar:"ملغاة"},
};

// ─── Avatar colors ────────────────────────────────────────────
const AVT=[{bg:"#EBF5F7",text:"#107789"},{bg:"#ede9fe",text:"#7c3aed"},{bg:"#d1fae5",text:"#059669"},{bg:"#fef3c7",text:"#d97706"},{bg:"#fee2e2",text:"#ef4444"},{bg:"#e0f2fe",text:"#0369a1"}];
const avt=(s:string)=>AVT[(s.charCodeAt(0)+(s.charCodeAt(1)||0))%AVT.length];

function Av({initials,size="md"}:{initials:string;size?:"sm"|"md"|"lg"}){
  const c=avt(initials);
  const d={sm:"w-7 h-7 text-[10px]",md:"w-10 h-10 text-xs",lg:"w-14 h-14 text-sm"}[size];
  return <div className={`${d} rounded-full flex items-center justify-center font-bold flex-shrink-0 select-none`} style={{backgroundColor:c.bg,color:c.text}}>{initials}</div>;
}

// ─── Icons ────────────────────────────────────────────────────
const I={
  join:   <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>,
  cal:    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  clock:  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  close:  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  res:    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>,
  note:   <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  user:   <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  check:  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>,
  star:   (filled:boolean)=><svg width="14" height="14" viewBox="0 0 24 24" fill={filled?"#d97706":"none"} stroke="#d97706" strokeWidth="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  search: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  chevL:  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>,
  chevR:  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>,
  info:   <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
};

// ─── Toast ────────────────────────────────────────────────────
function Toast({msg,type="success",onClose}:{msg:string;type?:"success"|"info";onClose:()=>void}){
  const C={success:{bg:"#f0fdf4",br:"#bbf7d0",tx:"#15803d"},info:{bg:"#eff6ff",br:"#bfdbfe",tx:"#1d4ed8"}};
  const c=C[type];
  return(
    <div className="fixed bottom-5 end-5 z-[60] flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl text-sm font-semibold max-w-[calc(100vw-2.5rem)]"
      style={{backgroundColor:c.bg,border:`1px solid ${c.br}`,color:c.tx,animation:"slideUp .3s cubic-bezier(.34,1.56,.64,1) both"}}>
      <span className="flex-shrink-0">{I.check}</span>
      <span className="flex-1 min-w-0 truncate">{msg}</span>
      <button onClick={onClose} className="opacity-50 hover:opacity-100">{I.close}</button>
    </div>
  );
}

// ─── Backdrop ────────────────────────────────────────────────
function Backdrop({onClose,children}:{onClose:()=>void;children:React.ReactNode}){
  return(
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      style={{backgroundColor:"rgba(11,44,51,.45)",backdropFilter:"blur(4px)"}}
      onClick={onClose}>
      <div className="w-full sm:w-auto" onClick={e=>e.stopPropagation()}
        style={{animation:"modalIn .22s cubic-bezier(.34,1.56,.64,1) both"}}>
        {children}
      </div>
    </div>
  );
}

// ─── Class Card ───────────────────────────────────────────────
function ClassCard({cls,idx,lang,t,onJoin,onReschedule,onViewDetails}:{
  cls:ClassItem;idx:number;lang:string;
  t:(a:string,b:string)=>string;
  onJoin:(c:ClassItem)=>void;
  onReschedule:(c:ClassItem)=>void;
  onViewDetails:(c:ClassItem)=>void;
}){
  const sc=ST[cls.status];
  const isLive=cls.status==="live";
  const pct=Math.round((cls.sessionNo/cls.totalSessions)*100);
  const teacherDisplay=lang==="ar"?cls.teacherAr:cls.teacher;
  const subjectDisplay=lang==="ar"?cls.subjectAr:cls.subject;
  const dateDisplay=lang==="ar"?cls.dateLabelAr:cls.dateLabel;

  return(
    <div className="group relative bg-white rounded-2xl border border-[#F1F5F9] overflow-hidden hover:shadow-lg hover:border-[#b2dce4] transition-all duration-300"
      style={{animation:`cardIn .4s ${idx*0.07}s cubic-bezier(.34,1.2,.64,1) both`}}>
      {/* Top accent */}
      <div className="h-1 group-hover:h-1.5 transition-all duration-300" style={{backgroundColor:sc.dot}}/>

      {/* Live pulse */}
      {isLive&&(
        <div className="absolute top-4 end-4 flex items-center gap-1.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-[#ef4444]"/>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#ef4444]"/>
          </span>
          <span className="text-[10px] font-black text-[#ef4444] uppercase tracking-wider">{t("LIVE","مباشر")}</span>
        </div>
      )}

      <div className="p-5 space-y-4">
        {/* Header row */}
        <div className="flex items-start gap-3">
          <Av initials={cls.avatar} size="md"/>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-black text-[#1e293b] truncate">{subjectDisplay}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              {I.user}
              <p className="text-xs text-[#94a3b8] truncate">{teacherDisplay}</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold whitespace-nowrap flex-shrink-0"
            style={{backgroundColor:sc.bg,color:sc.text,border:`1px solid ${sc.border}`}}>
            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{backgroundColor:sc.dot}}/>
            {lang==="ar"?sc.ar:sc.en}
          </span>
        </div>

        {/* Date + time + duration */}
        <div className="grid grid-cols-3 gap-2">
          {[
            {icon:I.cal,   val:dateDisplay},
            {icon:I.clock, val:cls.time},
            {icon:I.clock, val:cls.duration},
          ].map((row,i)=>(
            <div key={i} className="flex items-center gap-1.5 text-[#64748b]">
              <span className="flex-shrink-0">{row.icon}</span>
              <span className="text-[11px] font-medium truncate">{row.val}</span>
            </div>
          ))}
        </div>

        {/* Session progress */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[10px] text-[#94a3b8]">
            <span>{t("Session","الجلسة")} {cls.sessionNo}/{cls.totalSessions}</span>
            <span style={{color:sc.text}}>{pct}%</span>
          </div>
          <div className="h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-700"
              style={{width:`${pct}%`,backgroundColor:sc.dot}}/>
          </div>
        </div>

        {/* Rating (completed) */}
        {cls.status==="completed"&&cls.rating&&(
          <div className="flex items-center gap-1">
            {[1,2,3,4,5].map(n=>(<span key={n}>{I.star(n<=cls.rating!)}</span>))}
            <span className="text-[10px] text-[#94a3b8] ms-1">{t("Your rating","تقييمك")}</span>
          </div>
        )}

        {/* Notes */}
        {cls.notes&&(
          <p className="text-[11px] text-[#64748b] italic border-s-2 border-[#E2E8F0] ps-2 line-clamp-1">
            {lang==="ar"?cls.notesAr:cls.notes}
          </p>
        )}

        {/* Type badge */}
        {cls.type==="trial"&&(
          <span className="inline-flex text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#fef3c7] text-[#d97706]">
            {t("Trial","تجريبية")}
          </span>
        )}

        {/* Action buttons */}
        <div className="flex items-center gap-2 pt-2 border-t border-[#F8FAFC]">
          <button onClick={()=>onViewDetails(cls)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border border-[#E2E8F0] text-[#64748b] hover:bg-[#F1F5F9] active:scale-95 transition-all flex-1 justify-center">
            {I.note}{t("Details","التفاصيل")}
          </button>
          {(cls.status==="live"||cls.status==="upcoming")&&(
            <button onClick={()=>cls.status==="live"?onJoin(cls):onReschedule(cls)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white hover:opacity-90 active:scale-95 transition-all flex-1 justify-center"
              style={{backgroundColor:cls.status==="live"?"#ef4444":"#107789"}}>
              {cls.status==="live"?I.join:I.res}
              {cls.status==="live"?t("Join Now","انضم الآن"):t("Reschedule","إعادة جدولة")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Detail Modal ─────────────────────────────────────────────
function DetailModal({cls,onClose,onJoin,lang,t}:{cls:ClassItem;onClose:()=>void;onJoin:(c:ClassItem)=>void;lang:string;t:(a:string,b:string)=>string}){
  const sc=ST[cls.status];
  const isLive=cls.status==="live";
  const pct=Math.round((cls.sessionNo/cls.totalSessions)*100);

  return(
    <Backdrop onClose={onClose}>
      {/* Wide modal: full-width sheet on mobile, 2-column wide card on desktop */}
      <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-3xl overflow-hidden"
        dir={lang==="ar"?"rtl":"ltr"} style={{maxHeight:"92vh",overflowY:"auto"}}>

        {/* Top gradient accent */}
        <div className="h-1.5" style={{background:`linear-gradient(90deg,${sc.dot},#E8763A,transparent)`}}/>

        {/* Header row */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#F1F5F9]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{backgroundColor:sc.bg}}>
              <span style={{color:sc.dot}}>{I.note}</span>
            </div>
            <div>
              <h2 className="text-base font-black text-[#1e293b]">{t("Class Details","تفاصيل الحصة")}</h2>
              <p className="text-xs text-[#94a3b8] mt-0.5">{lang==="ar"?cls.subjectAr:cls.subject}</p>
            </div>
          </div>
          <button onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#F5F7F9] text-[#94a3b8] hover:text-[#1e293b] hover:bg-[#E2E8F0] transition-all">
            {I.close}
          </button>
        </div>

        {/* 2-column body */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-0">

          {/* ── LEFT: Teacher + subject hero ── */}
          <div className="p-6 space-y-5 border-b sm:border-b-0 sm:border-e border-[#F1F5F9]">
            {/* Avatar + name */}
            <div className="flex items-center gap-4">
              <Av initials={cls.avatar} size="lg"/>
              <div className="min-w-0">
                <p className="text-xl font-black text-[#1e293b] truncate">{lang==="ar"?cls.subjectAr:cls.subject}</p>
                <p className="text-sm text-[#94a3b8] mt-0.5 truncate">{lang==="ar"?cls.teacherAr:cls.teacher}</p>
                <div className="mt-2 flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold"
                    style={{backgroundColor:sc.bg,color:sc.text,border:`1px solid ${sc.border}`}}>
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${isLive?"animate-ping":""}`} style={{backgroundColor:sc.dot}}/>
                    {lang==="ar"?sc.ar:sc.en}
                  </span>
                  {cls.type==="trial"&&(
                    <span className="inline-flex text-xs font-bold px-3 py-1 rounded-full bg-[#fef3c7] text-[#d97706]">
                      {t("Trial","تجريبية")}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Session progress ring + bar */}
            <div className="rounded-2xl bg-[#F8FAFC] border border-[#F1F5F9] p-4 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-[#64748b] uppercase tracking-wide">{t("Session Progress","تقدم الجلسات")}</p>
                <span className="text-sm font-black" style={{color:sc.dot}}>{pct}%</span>
              </div>
              <div className="h-3 bg-[#E2E8F0] rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-700"
                  style={{width:`${pct}%`,backgroundColor:sc.dot}}/>
              </div>
              <p className="text-xs text-[#94a3b8]">
                {t("Session","الجلسة")} <strong className="text-[#1e293b]">{cls.sessionNo}</strong> {t("of","من")} <strong className="text-[#1e293b]">{cls.totalSessions}</strong>
              </p>
            </div>

            {/* Star rating */}
            {cls.rating&&(
              <div className="rounded-2xl bg-[#FFFBEB] border border-[#FDE68A] p-4">
                <p className="text-[10px] font-bold text-[#d97706] uppercase tracking-wide mb-2">{t("Your Rating","تقييمك")}</p>
                <div className="flex items-center gap-1.5">
                  {[1,2,3,4,5].map(n=>(<span key={n} className="text-xl">{I.star(n<=cls.rating!)}</span>))}
                  <span className="text-sm font-black text-[#d97706] ms-2">{cls.rating}/5</span>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col gap-2 pt-2">
              {isLive&&(
                <button onClick={()=>{onJoin(cls);onClose();}}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white hover:opacity-90 active:scale-[.98] transition-all"
                  style={{backgroundColor:"#ef4444"}}>
                  {I.join}{t("Join Class Now","انضم للحصة الآن")}
                </button>
              )}
              <button onClick={onClose}
                className="w-full py-2.5 rounded-xl text-sm font-semibold border border-[#E2E8F0] text-[#64748b] hover:bg-[#F5F7F9] active:scale-[.98] transition-all">
                {t("Close","إغلاق")}
              </button>
            </div>
          </div>

          {/* ── RIGHT: Info tiles + notes ── */}
          <div className="p-6 space-y-4">
            <p className="text-xs font-bold text-[#94a3b8] uppercase tracking-widest">{t("Class Information","معلومات الحصة")}</p>

            {/* Info tiles 2×2 */}
            <div className="grid grid-cols-2 gap-3">
              {[
                {lbl:t("Date","التاريخ"),      val:lang==="ar"?cls.dateLabelAr:cls.dateLabel, icon:"📅"},
                {lbl:t("Time","الوقت"),         val:cls.time,                                  icon:"🕐"},
                {lbl:t("Duration","المدة"),     val:cls.duration,                              icon:"⏱"},
                {lbl:t("Type","النوع"),         val:lang==="ar"?(cls.type==="trial"?"تجريبية":"عادية"):(cls.type==="trial"?"Trial":"Regular"), icon:"📚"},
              ].map(r=>(
                <div key={r.lbl} className="rounded-xl bg-[#F8FAFC] border border-[#F1F5F9] p-4">
                  <p className="text-lg mb-1">{r.icon}</p>
                  <p className="text-[10px] text-[#94a3b8] font-semibold uppercase tracking-wide">{r.lbl}</p>
                  <p className="text-sm font-bold text-[#1e293b] mt-0.5">{r.val}</p>
                </div>
              ))}
            </div>

            {/* Zoom link */}
            {cls.zoomLink&&(
              <div className="rounded-xl bg-[#EBF5F7] border border-[#b2dce4] p-4">
                <p className="text-[10px] font-bold text-[#107789] uppercase tracking-wide mb-1.5">{t("Meeting Link","رابط الاجتماع")}</p>
                <a href={cls.zoomLink} target="_blank" rel="noreferrer"
                  className="text-sm font-semibold text-[#107789] hover:underline break-all">
                  {cls.zoomLink}
                </a>
              </div>
            )}

            {/* Teacher notes */}
            {(cls.notes||cls.notesAr)&&(
              <div className="rounded-xl bg-[#FFFBEB] border border-[#FDE68A] p-4">
                <p className="text-[10px] font-bold text-[#d97706] uppercase tracking-wide mb-2">{t("Teacher Notes","ملاحظات المعلم")} 📝</p>
                <p className="text-sm text-[#64748b] leading-relaxed">{lang==="ar"?cls.notesAr:cls.notes}</p>
              </div>
            )}

            {/* Missed class note */}
            {cls.status==="missed"&&(
              <div className="rounded-xl bg-[#fef3c7] border border-[#fde68a] p-4">
                <p className="text-[10px] font-bold text-[#d97706] uppercase tracking-wide mb-1">{t("Missed Class","حصة فائتة")} ⚠️</p>
                <p className="text-xs text-[#d97706]">{t("Contact your teacher to reschedule this session.","تواصل مع معلمك لإعادة جدولة هذه الجلسة.")}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Backdrop>
  );
}

// ─── Reschedule Modal ─────────────────────────────────────────
const TIME_OPTS=["08:00 AM","09:00 AM","10:00 AM","11:00 AM","12:00 PM","01:00 PM","02:00 PM","03:00 PM","04:00 PM","05:00 PM","06:00 PM","07:00 PM"];
function RescheduleModal({cls,onSave,onClose,lang,t}:{cls:ClassItem;onSave:()=>void;onClose:()=>void;lang:string;t:(a:string,b:string)=>string}){
  const [date,setDate]=useState("");
  const [time,setTime]=useState(cls.time);
  const [err,setErr]=useState("");
  const inp="w-full px-3 py-2.5 text-sm border border-[#E2E8F0] rounded-xl bg-white text-[#1e293b] focus:outline-none focus:border-[#107789] focus:ring-1 focus:ring-[#107789]/20 transition-all";
  return(
    <Backdrop onClose={onClose}>
      <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-sm overflow-hidden" dir={lang==="ar"?"rtl":"ltr"}>
        <div className="h-1" style={{background:"linear-gradient(90deg,#107789,#0d6275)"}}/>
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#F1F5F9]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#EBF5F7] flex items-center justify-center text-[#107789]">{I.res}</div>
            <div>
              <h2 className="text-sm font-bold text-[#1e293b]">{t("Reschedule Class","إعادة جدولة الحصة")}</h2>
              <p className="text-xs text-[#94a3b8]">{lang==="ar"?cls.subjectAr:cls.subject}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-xl bg-[#F5F7F9] text-[#94a3b8] hover:text-[#1e293b] transition-all">{I.close}</button>
        </div>
        <div className="p-5 space-y-4">
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
          {err&&<p className="text-xs text-[#ef4444] font-medium">{err}</p>}
          <div className="flex items-start gap-2 text-xs text-[#94a3b8] bg-[#F8FAFC] rounded-xl p-3">
            {I.info}<span>{t("Reschedule requests are subject to teacher availability.","طلبات إعادة الجدولة تخضع لتوافر المعلم.")}</span>
          </div>
        </div>
        <div className="flex gap-3 px-5 pb-5">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-semibold border border-[#F1F5F9] text-[#64748b] hover:bg-[#F5F7F9] active:scale-95 transition-all">{t("Cancel","إلغاء")}</button>
          <button onClick={()=>{if(!date){setErr(t("Select a date.","اختر تاريخاً."));return;}onSave();}}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90 active:scale-95 transition-all" style={{backgroundColor:"#107789"}}>
            {t("Request Reschedule","طلب إعادة الجدولة")}
          </button>
        </div>
      </div>
    </Backdrop>
  );
}

// ─── Weekly mini calendar ─────────────────────────────────────
function WeekCalendar({classes,lang,isRTL}:{classes:ClassItem[];lang:string;isRTL:boolean}){
  const [weekStart,setWeekStart]=useState(()=>{
    const d=new Date(); d.setDate(d.getDate()-d.getDay()); d.setHours(0,0,0,0); return d;
  });
  const days=Array.from({length:7},(_,i)=>{const d=new Date(weekStart);d.setDate(d.getDate()+i);return d;});
  const toKey=(d:Date)=>d.toISOString().slice(0,10);
  const today=toKey(new Date());
  const weekEnd=new Date(weekStart); weekEnd.setDate(weekEnd.getDate()+6);
  const weekLabel=`${weekStart.getDate()} ${MONTHS_EN[weekStart.getMonth()]} – ${weekEnd.getDate()} ${MONTHS_EN[weekEnd.getMonth()]}`;

  return(
    <div className="rounded-2xl bg-white border border-[#F1F5F9] shadow-sm overflow-hidden" style={{animation:"cardIn .4s .25s both"}}>
      {/* Nav */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#F1F5F9]">
        <button onClick={()=>{const d=new Date(weekStart);d.setDate(d.getDate()-7);setWeekStart(d);}}
          className="w-8 h-8 flex items-center justify-center rounded-xl border border-[#F1F5F9] text-[#64748b] hover:bg-[#F5F7F9] hover:text-[#107789] transition-all">
          {isRTL?I.chevR:I.chevL}
        </button>
        <div className="text-center">
          <p className="text-sm font-bold text-[#1e293b]">{weekLabel}</p>
          <p className="text-[10px] text-[#94a3b8]">{lang==="ar"?"العرض الأسبوعي":"Weekly View"}</p>
        </div>
        <button onClick={()=>{const d=new Date(weekStart);d.setDate(d.getDate()+7);setWeekStart(d);}}
          className="w-8 h-8 flex items-center justify-center rounded-xl border border-[#F1F5F9] text-[#64748b] hover:bg-[#F5F7F9] hover:text-[#107789] transition-all">
          {isRTL?I.chevL:I.chevR}
        </button>
      </div>
      {/* Day headers */}
      <div className="grid grid-cols-7 border-b border-[#F1F5F9]">
        {days.map((d,i)=>{
          const isToday=toKey(d)===today;
          return(
            <div key={i} className="py-3 text-center">
              <p className="text-[10px] font-semibold uppercase text-[#94a3b8]">{lang==="ar"?DAYS_AR[d.getDay()]:DAYS_EN[d.getDay()]}</p>
              <div className={`mx-auto mt-1 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${isToday?"text-white":"text-[#1e293b]"}`}
                style={isToday?{backgroundColor:"#107789"}:{}}>
                {d.getDate()}
              </div>
            </div>
          );
        })}
      </div>
      {/* Grid */}
      <div className="grid grid-cols-7 min-h-24">
        {days.map((d,i)=>{
          const dayClasses=classes.filter(c=>c.date===toKey(d));
          const isToday=toKey(d)===today;
          return(
            <div key={i} className="border-e border-[#F1F5F9] last:border-0 p-1.5 space-y-1" style={{backgroundColor:isToday?"#FAFFFE":"white"}}>
              {dayClasses.map((c,j)=>{
                const sc=ST[c.status];
                return(
                  <div key={j} className="rounded-lg p-1.5 text-center cursor-pointer hover:opacity-80 transition-opacity"
                    style={{backgroundColor:sc.bg}}>
                    <p className="text-[9px] font-bold" style={{color:sc.text}}>{c.time.replace(" PM","p").replace(" AM","a")}</p>
                    <p className="text-[8px] leading-tight" style={{color:sc.text}}>{lang==="ar"?c.subjectAr.split(" ")[0]:c.subject.split(" ")[0]}</p>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────
export default function ClassesPage(){
  const {lang,isRTL,t}=useLanguage();
  const router=useRouter();

  const [filter,setFilter]=useState<FilterTab>("all");
  const [search,setSearch]=useState("");
  const [detailCls,setDetailCls]=useState<ClassItem|null>(null);
  const [resCls,setResCls]=useState<ClassItem|null>(null);
  const [toast,setToast]=useState<{msg:string;type:"success"|"info"}|null>(null);

  const fire=(msg:string,type:"success"|"info"="success")=>{
    setToast({msg,type}); setTimeout(()=>setToast(null),3500);
  };

  const filtered=ALL_CLASSES.filter(c=>{
    const matchF=filter==="all"||c.status===filter||(filter==="upcoming"&&c.status==="live");
    const q=search.toLowerCase();
    const matchS=!q||c.subject.toLowerCase().includes(q)||c.teacher.toLowerCase().includes(q)||c.subjectAr.includes(q);
    return matchF&&matchS;
  });

  const FILTERS:[FilterTab,string,string,number][]=[
    ["all",      "All Classes",  "كل الحصص",   ALL_CLASSES.length],
    ["upcoming", "Upcoming",     "القادمة",     ALL_CLASSES.filter(c=>c.status==="upcoming"||c.status==="live").length],
    ["completed","Completed",    "المكتملة",    ALL_CLASSES.filter(c=>c.status==="completed").length],
    ["missed",   "Missed",       "الفائتة",     ALL_CLASSES.filter(c=>c.status==="missed").length],
  ];

  const stats=[
    {val:ALL_CLASSES.length,              labelEn:"Total Classes",   labelAr:"إجمالي الحصص",   color:"#107789",bg:"#EBF5F7"},
    {val:ALL_CLASSES.filter(c=>c.status==="completed").length, labelEn:"Completed", labelAr:"مكتملة", color:"#059669",bg:"#d1fae5"},
    {val:ALL_CLASSES.filter(c=>c.status==="upcoming"||c.status==="live").length, labelEn:"Upcoming", labelAr:"قادمة", color:"#107789",bg:"#EBF5F7"},
    {val:ALL_CLASSES.filter(c=>c.status==="missed").length, labelEn:"Missed", labelAr:"فائتة", color:"#d97706",bg:"#fef3c7"},
  ];

  return(
    <>
      <style>{`
        @keyframes cardIn  { from{opacity:0;transform:translateY(14px) scale(.97)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes slideUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes modalIn { from{opacity:0;transform:scale(.93) translateY(10px)} to{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
      `}</style>

      <main className="flex-1 min-h-screen overflow-auto p-4 sm:p-6 space-y-5 sm:space-y-6"
        style={{backgroundColor:"#F5F7F9"}} dir={isRTL?"rtl":"ltr"}>

        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-3" style={{animation:"fadeIn .4s ease both"}}>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[#1e293b] tracking-tight">{t("My Classes","حصصي")}</h1>
            <p className="mt-1 text-xs sm:text-sm text-[#94a3b8]">{t("Manage your scheduled sessions","إدارة جلساتك المجدولة")}</p>
          </div>
          <button onClick={()=>router.push("/student/dashboard")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white hover:opacity-90 active:scale-95 transition-all shadow-sm"
            style={{backgroundColor:"#107789",animation:"cardIn .4s .05s both"}}>
            {I.cal}{t("View Schedule","عرض الجدول")}
          </button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {stats.map((s,i)=>(
            <div key={s.labelEn} className="rounded-2xl bg-white border border-[#F1F5F9] shadow-sm p-4 sm:p-5 hover:shadow-md hover:border-[#b2dce4] transition-all duration-300"
              style={{animation:`cardIn .45s ${i*0.07}s cubic-bezier(.34,1.2,.64,1) both`}}>
              <p className="text-2xl sm:text-3xl font-black leading-none" style={{color:s.color}}>{s.val}</p>
              <p className="text-xs text-[#94a3b8] mt-1 font-medium">{lang==="ar"?s.labelAr:s.labelEn}</p>
            </div>
          ))}
        </div>

        {/* Weekly Calendar */}
        <WeekCalendar classes={ALL_CLASSES} lang={lang} isRTL={isRTL}/>

        {/* Filter + Search */}
        <div className="flex flex-wrap items-center gap-3" style={{animation:"cardIn .4s .3s both"}}>
          <div className="flex items-center flex-wrap gap-1.5">
            {FILTERS.map(([key,en,ar,cnt])=>(
              <button key={key} onClick={()=>setFilter(key)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all active:scale-95"
                style={filter===key
                  ?{backgroundColor:"#107789",color:"white",boxShadow:"0 2px 8px #10778940"}
                  :{backgroundColor:"white",color:"#64748b",border:"1px solid #F1F5F9"}}>
                {lang==="ar"?ar:en}
                <span className="text-[10px] rounded-full px-1.5 py-0.5 font-black"
                  style={filter===key?{backgroundColor:"rgba(255,255,255,.25)"}:{backgroundColor:"#F1F5F9",color:"#94a3b8"}}>
                  {cnt}
                </span>
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-[#F1F5F9] shadow-sm ms-auto" style={{minWidth:200}}>
            <span className="text-[#94a3b8]">{I.search}</span>
            <input type="text" value={search} onChange={e=>setSearch(e.target.value)}
              placeholder={t("Search classes…","ابحث عن حصة…")}
              className="flex-1 bg-transparent text-sm text-[#1e293b] placeholder:text-[#C4CAD4] focus:outline-none"/>
            {search&&<button onClick={()=>setSearch("")} className="text-[#94a3b8] hover:text-[#1e293b]">{I.close}</button>}
          </div>
        </div>

        {/* Empty state */}
        {filtered.length===0&&(
          <div className="bg-white rounded-2xl border border-[#F1F5F9] p-16 text-center" style={{animation:"fadeIn .4s both"}}>
            <div className="w-14 h-14 rounded-2xl bg-[#EBF5F7] flex items-center justify-center text-[#107789] mx-auto mb-3">{I.cal}</div>
            <p className="text-base font-bold text-[#1e293b]">{t("No classes found","لا توجد حصص")}</p>
            <p className="text-sm text-[#94a3b8] mt-1">{t("Try adjusting your filters.","جرب تعديل الفلاتر.")}</p>
          </div>
        )}

        {/* Cards grid */}
        {filtered.length>0&&(
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((cls,i)=>(
              <ClassCard key={cls.id} cls={cls} idx={i} lang={lang} t={t}
                onJoin={c=>{router.push("/class/live");}}
                onReschedule={c=>setResCls(c)}
                onViewDetails={c=>setDetailCls(c)}/>
            ))}
          </div>
        )}

      </main>

      {detailCls&&<DetailModal cls={detailCls} onClose={()=>setDetailCls(null)} onJoin={c=>router.push("/class/live")} lang={lang} t={t}/>}
      {resCls&&<RescheduleModal cls={resCls} onSave={()=>{setResCls(null);fire(t("Reschedule request sent!","تم إرسال طلب إعادة الجدولة!"));}} onClose={()=>setResCls(null)} lang={lang} t={t}/>}
      {toast&&<Toast msg={toast.msg} type={toast.type} onClose={()=>setToast(null)}/>}
    </>
  );
}