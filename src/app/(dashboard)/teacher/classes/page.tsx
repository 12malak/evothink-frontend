"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/src/contexts/LanguageContext";

// ─── Types ────────────────────────────────────────────────────
type ClassStatus = "upcoming" | "completed" | "missed" | "in-progress" | "cancelled";
type ClassType   = "trial" | "normal";
type ViewMode    = "cards" | "calendar";
type FilterTab   = "all" | "upcoming" | "completed" | "missed" | "trial";

interface ClassItem {
  id:string; date:string; dayLabel:string; dayLabelAr:string;
  time:string; endTime:string; student:string; studentAr?:string;
  avatar:string; level:string; status:ClassStatus; type:ClassType;
  duration:string; notes:string; phone:string;
  subject:string; subjectAr:string;
  sessionNo:number; totalSessions:number; progress:number;
}

// ─── Data ─────────────────────────────────────────────────────
const ALL_CLASSES: ClassItem[] = [
  { id:"C001", date:"2025-03-24", dayLabel:"Mon", dayLabelAr:"إث", time:"09:00 AM", endTime:"10:00 AM", student:"Sara Al-Rashid",    studentAr:"سارة الراشد",    avatar:"SA", level:"B2", status:"completed",   type:"normal", duration:"60 min", notes:"Excellent session — improved intonation significantly.",   phone:"+966 50 111 2222", subject:"English Speaking",   subjectAr:"محادثة إنجليزية",    sessionNo:14, totalSessions:20, progress:70 },
  { id:"C002", date:"2025-03-24", dayLabel:"Mon", dayLabelAr:"إث", time:"11:00 AM", endTime:"11:45 AM", student:"Omar Khalid",       studentAr:"عمر خالد",       avatar:"OK", level:"A1", status:"in-progress", type:"trial",  duration:"45 min", notes:"First trial — assess vocabulary & reading.",               phone:"+966 50 333 4444", subject:"Placement Test",     subjectAr:"اختبار تحديد مستوى",sessionNo:1,  totalSessions:1,  progress:100},
  { id:"C003", date:"2025-03-24", dayLabel:"Mon", dayLabelAr:"إث", time:"01:00 PM", endTime:"02:00 PM", student:"Lina Hassan",       studentAr:"لينا حسن",       avatar:"LH", level:"B1", status:"upcoming",    type:"normal", duration:"60 min", notes:"Focus on academic writing and grammar drills.",             phone:"+966 55 555 6666", subject:"Academic Writing",   subjectAr:"الكتابة الأكاديمية", sessionNo:8,  totalSessions:24, progress:33 },
  { id:"C004", date:"2025-03-24", dayLabel:"Mon", dayLabelAr:"إث", time:"03:00 PM", endTime:"04:00 PM", student:"Faisal Al-Mutairi", studentAr:"فيصل المطيري",   avatar:"FA", level:"C1", status:"upcoming",    type:"normal", duration:"60 min", notes:"Advanced essay structure and critical analysis.",           phone:"+966 55 777 8888", subject:"IELTS Preparation",  subjectAr:"تحضير IELTS",        sessionNo:19, totalSessions:30, progress:63 },
  { id:"C005", date:"2025-03-24", dayLabel:"Mon", dayLabelAr:"إث", time:"05:00 PM", endTime:"05:45 PM", student:"Noor Al-Amin",      studentAr:"نور الأمين",     avatar:"NA", level:"A2", status:"missed",      type:"trial",  duration:"45 min", notes:"No-show. Send reminder for rescheduling.",                 phone:"+966 56 999 0000", subject:"Placement Test",     subjectAr:"اختبار تحديد مستوى",sessionNo:1,  totalSessions:1,  progress:0  },
  { id:"C006", date:"2025-03-25", dayLabel:"Tue", dayLabelAr:"ثلث",time:"10:00 AM", endTime:"11:00 AM", student:"Khalid Mansoor",    studentAr:"خالد منصور",     avatar:"KM", level:"B1", status:"upcoming",    type:"normal", duration:"60 min", notes:"Listening comprehension exercises and note-taking.",        phone:"+966 50 121 3434", subject:"English Listening",  subjectAr:"الاستماع الإنجليزي", sessionNo:5,  totalSessions:16, progress:31 },
  { id:"C007", date:"2025-03-25", dayLabel:"Tue", dayLabelAr:"ثلث",time:"02:00 PM", endTime:"02:45 PM", student:"Reem Al-Jabri",    studentAr:"ريم الجابري",    avatar:"RJ", level:"A1", status:"upcoming",    type:"trial",  duration:"45 min", notes:"Trial class — evaluate pronunciation and fluency.",         phone:"+966 50 234 5678", subject:"Placement Test",     subjectAr:"اختبار تحديد مستوى",sessionNo:1,  totalSessions:1,  progress:0  },
  { id:"C008", date:"2025-03-26", dayLabel:"Wed", dayLabelAr:"أرب",time:"09:00 AM", endTime:"10:00 AM", student:"Ahmed Al-Zahrani",  studentAr:"أحمد الزهراني", avatar:"AZ", level:"C1", status:"upcoming",    type:"normal", duration:"60 min", notes:"Debate techniques and argumentative speech.",               phone:"+966 55 876 5432", subject:"Advanced Speaking",  subjectAr:"محادثة متقدمة",      sessionNo:22, totalSessions:30, progress:73 },
  { id:"C009", date:"2025-03-27", dayLabel:"Thu", dayLabelAr:"خم", time:"11:00 AM", endTime:"12:00 PM", student:"Sara Al-Rashid",    studentAr:"سارة الراشد",    avatar:"SA", level:"B2", status:"upcoming",    type:"normal", duration:"60 min", notes:"Practice conversation using podcast-based materials.",      phone:"+966 50 111 2222", subject:"English Speaking",   subjectAr:"محادثة إنجليزية",    sessionNo:15, totalSessions:20, progress:75 },
  { id:"C010", date:"2025-03-23", dayLabel:"Sun", dayLabelAr:"أح", time:"10:00 AM", endTime:"11:00 AM", student:"Layla Ahmad",       studentAr:"ليلى أحمد",      avatar:"LA", level:"B2", status:"completed",   type:"normal", duration:"60 min", notes:"Great progress on fluency. Assigned new reading.",           phone:"+966 55 432 1098", subject:"English Literature", subjectAr:"أدب إنجليزي",        sessionNo:9,  totalSessions:20, progress:45 },
];

// ─── Status / Type configs ────────────────────────────────────
const SC: Record<ClassStatus,{bg:string;text:string;border:string;dot:string;en:string;ar:string}> = {
  upcoming:     {bg:"#EBF5F7",text:"#107789",border:"#b2dce4",dot:"#107789",en:"Upcoming",    ar:"قادمة"},
  completed:    {bg:"#d1fae5",text:"#059669",border:"#6ee7b7",dot:"#059669",en:"Completed",   ar:"مكتملة"},
  missed:       {bg:"#fee2e2",text:"#ef4444",border:"#fca5a5",dot:"#ef4444",en:"Missed",      ar:"فائتة"},
  "in-progress":{bg:"#ede9fe",text:"#7c3aed",border:"#c4b5fd",dot:"#7c3aed",en:"In Progress", ar:"جارية الآن"},
  cancelled:    {bg:"#f1f5f9",text:"#64748b",border:"#e2e8f0",dot:"#94a3b8",en:"Cancelled",   ar:"ملغاة"},
};
const TC: Record<ClassType,{bg:string;text:string;en:string;ar:string}> = {
  trial:  {bg:"#fef3c7",text:"#d97706",en:"Trial",  ar:"تجريبية"},
  normal: {bg:"#e0f2fe",text:"#0369a1",en:"Normal", ar:"عادية"},
};
const LC: Record<string,{bg:string;text:string}> = {
  A1:{bg:"#f0fdf4",text:"#15803d"}, A2:{bg:"#dcfce7",text:"#15803d"},
  B1:{bg:"#eff6ff",text:"#1d4ed8"}, B2:{bg:"#dbeafe",text:"#1d4ed8"},
  C1:{bg:"#fdf4ff",text:"#7e22ce"}, C2:{bg:"#f5f3ff",text:"#7e22ce"},
};
const AVT=[{bg:"#EBF5F7",text:"#107789"},{bg:"#ede9fe",text:"#7c3aed"},{bg:"#d1fae5",text:"#059669"},{bg:"#fef3c7",text:"#d97706"},{bg:"#fee2e2",text:"#ef4444"},{bg:"#e0f2fe",text:"#0369a1"}];
const avt=(s:string)=>AVT[(s.charCodeAt(0)+(s.charCodeAt(1)||0))%AVT.length];

const MONTHS_EN=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const DAYS_EN=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const DAYS_AR=["أح","إث","ثلث","أرب","خم","جم","سبت"];
const TIME_OPTS=["08:00 AM","09:00 AM","10:00 AM","11:00 AM","12:00 PM","01:00 PM","02:00 PM","03:00 PM","04:00 PM","05:00 PM","06:00 PM","07:00 PM"];

// ─── Small atoms ─────────────────────────────────────────────
function Av({i,size="md"}:{i:string;size?:"sm"|"md"|"lg"|"xl"}){
  const c=avt(i); const d={sm:"w-7 h-7 text-[10px]",md:"w-9 h-9 text-xs",lg:"w-12 h-12 text-sm",xl:"w-16 h-16 text-lg"}[size];
  return <div className={`${d} rounded-full flex items-center justify-center font-bold flex-shrink-0 select-none`} style={{backgroundColor:c.bg,color:c.text}}>{i}</div>;
}
function SPill({s,lang}:{s:ClassStatus;lang:string}){
  const c=SC[s];
  return <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold whitespace-nowrap" style={{backgroundColor:c.bg,color:c.text,border:`1px solid ${c.border}`}}><span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{backgroundColor:c.dot}}/>{lang==="ar"?c.ar:c.en}</span>;
}
function TPill({type,lang}:{type:ClassType;lang:string}){
  const c=TC[type];
  return <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold whitespace-nowrap" style={{backgroundColor:c.bg,color:c.text}}>{lang==="ar"?c.ar:c.en}</span>;
}
function LBadge({level}:{level:string}){
  const c=LC[level]||{bg:"#f1f5f9",text:"#64748b"};
  return <span className="inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-black tracking-wider" style={{backgroundColor:c.bg,color:c.text}}>{level}</span>;
}
function PBar({val,color,delay=0}:{val:number;color:string;delay?:number}){
  return <div className="h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden"><div className="h-full rounded-full" style={{width:`${val}%`,backgroundColor:color,transition:`width .7s ${delay}s ease`}}/></div>;
}

// ─── Icons ────────────────────────────────────────────────────
const IC={
  play:   <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>,
  eye:    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  res:    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>,
  trash:  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>,
  close:  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  cal:    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  clk:    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  phone:  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
  msg:    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  note:   <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  ok:     <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>,
  search: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  chevL:  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>,
  chevR:  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>,
  warn:   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  spinner:<svg className="animate-spin" width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="white" strokeWidth="2" strokeOpacity="0.3"/><path d="M7 1.5a5.5 5.5 0 015.5 5.5" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>,
};

// ─── Backdrop — bottom sheet on mobile, centered on desktop ───
function Backdrop({onClose,children,wide=false}:{onClose:()=>void;children:React.ReactNode;wide?:boolean}){
  return(
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6"
      style={{backgroundColor:"rgba(11,44,51,.48)",backdropFilter:"blur(4px)"}}
      onClick={onClose}>
      <div className={`w-full sm:w-auto ${wide?"sm:min-w-[700px] sm:max-w-4xl":"sm:min-w-[380px] sm:max-w-lg"}`}
        onClick={e=>e.stopPropagation()}
        style={{animation:"modalIn .22s cubic-bezier(.34,1.56,.64,1) both"}}>
        {children}
      </div>
    </div>
  );
}

function Toast({msg,type,onClose}:{msg:string;type:"success"|"info"|"error";onClose:()=>void}){
  const C={success:{bg:"#f0fdf4",br:"#bbf7d0",tx:"#15803d"},info:{bg:"#eff6ff",br:"#bfdbfe",tx:"#1d4ed8"},error:{bg:"#fef2f2",br:"#fecaca",tx:"#dc2626"}};
  const c=C[type];
  return(
    <div className="fixed bottom-5 end-5 z-[60] flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl text-sm font-semibold max-w-[calc(100vw-2.5rem)]"
      style={{backgroundColor:c.bg,border:`1px solid ${c.br}`,color:c.tx,animation:"slideUp .3s cubic-bezier(.34,1.56,.64,1) both"}}>
      {IC.ok}<span className="flex-1 min-w-0 truncate">{msg}</span>
      <button onClick={onClose} className="opacity-50 hover:opacity-100">{IC.close}</button>
    </div>
  );
}

// ─── Progress ring ────────────────────────────────────────────
function PRing({val,size=52,stroke=4,color="#107789"}:{val:number;size?:number;stroke?:number;color?:string}){
  const r=(size-stroke*2)/2; const circ=2*Math.PI*r; const dash=(val/100)*circ;
  return(
    <svg width={size} height={size} style={{transform:"rotate(-90deg)"}}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#F1F5F9" strokeWidth={stroke}/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        style={{transition:"stroke-dasharray .8s cubic-bezier(.4,0,.2,1)"}}/>
    </svg>
  );
}

// ═══════════════════════════════════════════════════
// DETAIL MODAL — wide 2-column, bottom sheet mobile
// ═══════════════════════════════════════════════════
function DetailModal({c,lang,isRTL,t,onClose,onStart,onReschedule,onDelete}:{
  c:ClassItem; lang:string; isRTL:boolean;
  t:(a:string,b:string)=>string;
  onClose:()=>void; onStart:(id:string)=>void;
  onReschedule:(c:ClassItem)=>void; onDelete:(c:ClassItem)=>void;
}){
  const sc=SC[c.status]; const lc=LC[c.level]||{bg:"#f1f5f9",text:"#64748b"};
  const canStart=c.status==="upcoming"||c.status==="in-progress";
  const studentName=lang==="ar"?(c.studentAr||c.student):c.student;
  const subject=lang==="ar"?c.subjectAr:c.subject;

  return(
    <Backdrop onClose={onClose} wide>
      <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full overflow-hidden"
        dir={isRTL?"rtl":"ltr"} style={{maxHeight:"91vh",overflowY:"auto"}}>
        <div className="h-1.5" style={{background:`linear-gradient(90deg,${sc.dot},#E8763A,transparent)`}}/>

        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-[#F1F5F9]">
          <div className="flex items-center gap-3">
            <Av i={c.avatar} size="md"/>
            <div>
              <h2 className="text-base font-black text-[#1e293b]">{studentName}</h2>
              <p className="text-xs text-[#94a3b8] mt-0.5">{subject} · {c.time}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#F5F7F9] text-[#94a3b8] hover:text-[#1e293b] hover:bg-[#E2E8F0] transition-all">{IC.close}</button>
        </div>

        {/* 2-column body */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x divide-[#F1F5F9]">

          {/* LEFT: Info + actions */}
          <div className="p-5 sm:p-6 space-y-5">
            <p className="text-xs font-black text-[#94a3b8] uppercase tracking-widest">{t("Class Details","تفاصيل الحصة")}</p>

            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              <SPill s={c.status} lang={lang}/>
              <TPill type={c.type} lang={lang}/>
              <LBadge level={c.level}/>
            </div>

            {/* Info tiles 2x2 */}
            <div className="grid grid-cols-2 gap-2.5">
              {[
                {lbl:t("Date","التاريخ"),    val:`${c.dayLabel}, ${c.date.slice(5)}`, ic:IC.cal},
                {lbl:t("Time","الوقت"),       val:`${c.time} – ${c.endTime}`,          ic:IC.clk},
                {lbl:t("Duration","المدة"),   val:c.duration,                          ic:IC.clk},
                {lbl:t("Phone","الهاتف"),    val:c.phone,                             ic:IC.phone},
                {lbl:t("Subject","المادة"),  val:subject,                             ic:null},
                {lbl:t("Session","الجلسة"),  val:`${c.sessionNo} / ${c.totalSessions}`,ic:null},
              ].map(r=>(
                <div key={r.lbl} className="rounded-xl bg-[#F8FAFC] border border-[#F1F5F9] px-3 py-2.5">
                  <div className="flex items-center gap-1.5 text-[#94a3b8] mb-1">
                    {r.ic&&<span className="flex-shrink-0">{r.ic}</span>}
                    <span className="text-[10px] font-semibold uppercase tracking-wide">{r.lbl}</span>
                  </div>
                  <p className="text-xs font-bold text-[#1e293b] leading-snug">{r.val}</p>
                </div>
              ))}
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {canStart&&(
                <button onClick={()=>{onStart(c.id);onClose();}}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90 active:scale-95 transition-all"
                  style={{backgroundColor:c.status==="in-progress"?"#7c3aed":"#107789"}}>
                  {IC.play}{t("Start Class","ابدأ الحصة")}
                </button>
              )}
              {(c.status==="upcoming"||c.status==="missed")&&(
                <button onClick={()=>{onReschedule(c);onClose();}}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold border border-[#E2E8F0] text-[#64748b] hover:bg-[#F5F7F9] active:scale-95 transition-all">
                  {IC.res}{t("Reschedule","إعادة جدولة")}
                </button>
              )}
              <button className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold border border-[#E2E8F0] text-[#107789] hover:bg-[#EBF5F7] active:scale-95 transition-all">
                {IC.msg}{t("Message","رسالة")}
              </button>
              <button onClick={()=>{onDelete(c);onClose();}}
                className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-[#fecaca] text-[#ef4444] hover:bg-[#fee2e2] active:scale-95 transition-all ms-auto">
                {IC.trash}
              </button>
            </div>
          </div>

          {/* RIGHT: Progress + notes */}
          <div className="p-5 sm:p-6 space-y-5">
            <p className="text-xs font-black text-[#94a3b8] uppercase tracking-widest">{t("Progress & Notes","التقدم والملاحظات")}</p>

            {/* Progress card */}
            <div className="rounded-2xl bg-[#F8FAFC] border border-[#F1F5F9] p-4 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-[#1e293b]">{t("Course Progress","تقدم المقرر")}</p>
                <div className="relative w-14 h-14 flex-shrink-0">
                  <PRing val={c.progress} size={56} stroke={5} color={lc.text}/>
                  <span className="absolute inset-0 flex items-center justify-center text-[11px] font-black" style={{color:lc.text}}>{c.progress}%</span>
                </div>
              </div>
              <PBar val={c.progress} color={lc.text}/>
              <p className="text-[10px] text-[#94a3b8]">{c.sessionNo} {t("of","من")} {c.totalSessions} {t("sessions completed","جلسات مكتملة")}</p>
              <div className="flex gap-2">
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#d1fae5] text-[#059669]">{c.sessionNo} {t("done","منجز")}</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#EBF5F7] text-[#107789]">{c.totalSessions-c.sessionNo} {t("left","متبقي")}</span>
              </div>
            </div>

            {/* Notes */}
            <div className="rounded-2xl bg-[#FFFBEB] border border-[#FDE68A] p-4 flex-1">
              <div className="flex items-center gap-1.5 mb-2">
                <span className="text-[#d97706]">{IC.note}</span>
                <p className="text-[10px] font-bold uppercase tracking-wide text-[#d97706]">{t("Teacher Notes","ملاحظات المعلم")}</p>
              </div>
              <p className="text-sm text-[#64748b] leading-relaxed">{c.notes||t("No notes yet.","لا توجد ملاحظات.")}</p>
            </div>
          </div>
        </div>
      </div>
    </Backdrop>
  );
}

// ═══════════════════════════════════════════════════
// RESCHEDULE MODAL — slim, bottom-sheet mobile
// ═══════════════════════════════════════════════════
function RescheduleModal({c,onSave,onClose,lang,isRTL,t}:{c:ClassItem;onSave:(id:string,d:string,ti:string)=>void;onClose:()=>void;lang:string;isRTL:boolean;t:(a:string,b:string)=>string}){
  const [date,setDate]=useState(c.date);
  const [time,setTime]=useState(c.time);
  const [loading,setLoading]=useState(false);
  const inp="w-full px-3 py-2.5 text-sm border border-[#E2E8F0] rounded-xl bg-white text-[#1e293b] focus:outline-none focus:border-[#107789] focus:ring-1 focus:ring-[#107789]/20 transition-all";

  return(
    <Backdrop onClose={onClose}>
      <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full overflow-hidden" dir={isRTL?"rtl":"ltr"}>
        <div className="h-1.5" style={{background:"linear-gradient(90deg,#107789,#0d6275)"}}/>
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#F1F5F9]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#EBF5F7] flex items-center justify-center text-[#107789]">{IC.res}</div>
            <div>
              <h2 className="text-sm font-black text-[#1e293b]">{t("Reschedule Class","إعادة جدولة الحصة")}</h2>
              <p className="text-xs text-[#94a3b8]">{lang==="ar"?(c.studentAr||c.student):c.student}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#F5F7F9] text-[#94a3b8] hover:bg-[#E2E8F0] transition-all">{IC.close}</button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#64748b] mb-1.5">{t("New Date","التاريخ الجديد")}</label>
            <input type="date" value={date} onChange={e=>setDate(e.target.value)} className={inp}/>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#64748b] mb-1.5">{t("New Time","الوقت الجديد")}</label>
            <div className="grid grid-cols-3 gap-2">
              {TIME_OPTS.map(o=>(
                <button key={o} type="button" onClick={()=>setTime(o)}
                  className={`py-2 rounded-xl text-xs font-semibold border transition-all active:scale-95 ${time===o?"border-[#107789] bg-[#EBF5F7] text-[#107789]":"border-[#E2E8F0] text-[#64748b] hover:border-[#107789]/30"}`}>
                  {o}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex gap-3 px-5 pb-5">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-semibold border border-[#E2E8F0] text-[#64748b] hover:bg-[#F5F7F9] active:scale-95 transition-all">{t("Cancel","إلغاء")}</button>
          <button onClick={async()=>{setLoading(true);await new Promise(r=>setTimeout(r,700));setLoading(false);onSave(c.id,date,time);}}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90 active:scale-95 transition-all"
            style={{backgroundColor:loading?"#5FA8B3":"#107789"}}>
            {loading?<>{IC.spinner}{t("Saving…","جارٍ الحفظ…")}</>:<>{IC.ok}{t("Confirm","تأكيد")}</>}
          </button>
        </div>
      </div>
    </Backdrop>
  );
}

// ─── Delete confirm ────────────────────────────────────────────
function DeleteConfirm({c,onConfirm,onClose,lang,isRTL,t}:{c:ClassItem;onConfirm:(id:string)=>void;onClose:()=>void;lang:string;isRTL:boolean;t:(a:string,b:string)=>string}){
  return(
    <Backdrop onClose={onClose}>
      <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full overflow-hidden" dir={isRTL?"rtl":"ltr"}>
        <div className="p-5 space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#fee2e2] flex items-center justify-center text-[#ef4444] flex-shrink-0">{IC.trash}</div>
            <div>
              <h2 className="text-base font-bold text-[#1e293b]">{t("Delete Class","حذف الحصة")}</h2>
              <p className="text-sm text-[#64748b] mt-1">
                {t("Delete class with","حذف حصة")} <strong>{lang==="ar"?(c.studentAr||c.student):c.student}</strong> {t("on","في")} {c.date} {t("at","الساعة")} {c.time}?{" "}
                <span className="text-[#ef4444] text-xs font-medium">{t("Cannot be undone.","لا يمكن التراجع.")}</span>
              </p>
            </div>
          </div>
        </div>
        <div className="flex gap-3 px-5 pb-5">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-semibold border border-[#E2E8F0] text-[#64748b] hover:bg-[#F5F7F9] active:scale-95 transition-all">{t("No, keep","لا، احتفظ")}</button>
          <button onClick={()=>onConfirm(c.id)} className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90 active:scale-95 transition-all" style={{backgroundColor:"#ef4444"}}>{t("Yes, Delete","نعم، احذف")}</button>
        </div>
      </div>
    </Backdrop>
  );
}

// ─── Class Card ───────────────────────────────────────────────
function ClassCard({c,idx,lang,t,onView,onStart,onReschedule,onDelete}:{
  c:ClassItem; idx:number; lang:string;
  t:(a:string,b:string)=>string;
  onView:(c:ClassItem)=>void; onStart:(id:string)=>void;
  onReschedule:(c:ClassItem)=>void; onDelete:(c:ClassItem)=>void;
}){
  const sc=SC[c.status]; const lc=LC[c.level]||{bg:"#f1f5f9",text:"#64748b"};
  const canStart=c.status==="upcoming"||c.status==="in-progress";
  const studentName=lang==="ar"?(c.studentAr||c.student):c.student;

  return(
    <div className="group relative bg-white rounded-2xl border border-[#F1F5F9] overflow-hidden hover:shadow-lg hover:border-[#b2dce4] transition-all duration-300"
      style={{animation:`cardIn .4s ${idx*.06}s cubic-bezier(.34,1.2,.64,1) both`}}>
      <div className="h-0.5 group-hover:h-1 transition-all duration-300" style={{backgroundColor:sc.dot}}/>
      {c.status==="in-progress"&&(
        <div className="absolute top-3 end-3 flex items-center gap-1.5">
          <span className="relative flex h-2.5 w-2.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{backgroundColor:"#7c3aed"}}/><span className="relative inline-flex rounded-full h-2.5 w-2.5" style={{backgroundColor:"#7c3aed"}}/></span>
          <span className="text-[10px] font-black text-[#7c3aed] uppercase">{t("LIVE","مباشر")}</span>
        </div>
      )}
      <div className="p-4 sm:p-5 space-y-3.5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Av i={c.avatar} size="md"/>
            <div className="min-w-0">
              <p className="text-sm font-bold text-[#1e293b] truncate">{studentName}</p>
              <p className="text-xs text-[#94a3b8] mt-0.5 truncate">{lang==="ar"?c.subjectAr:c.subject}</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
            <SPill s={c.status} lang={lang}/>
            <TPill type={c.type} lang={lang}/>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap text-xs text-[#64748b]">
          <div className="flex items-center gap-1">{IC.clk}<span className="font-semibold text-[#1e293b]">{c.time} – {c.endTime}</span></div>
          <span className="text-[#E2E8F0]">·</span>
          <div className="flex items-center gap-1">{IC.cal}<span>{c.dayLabel}, {c.date.slice(5)}</span></div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <LBadge level={c.level}/>
          <span className="text-[10px] text-[#94a3b8]">{t("Session","جلسة")} {c.sessionNo}/{c.totalSessions} · {c.duration}</span>
        </div>

        <div>
          <div className="flex justify-between mb-1.5">
            <span className="text-[10px] text-[#94a3b8]">{t("Progress","التقدم")}</span>
            <span className="text-[10px] font-bold" style={{color:lc.text}}>{c.progress}%</span>
          </div>
          <PBar val={c.progress} color={lc.text}/>
        </div>

        <div className="flex items-center gap-2 pt-2 border-t border-[#F8FAFC]">
          {canStart&&(
            <button onClick={()=>onStart(c.id)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-white hover:opacity-90 active:scale-95 transition-all flex-1 justify-center"
              style={{backgroundColor:c.status==="in-progress"?"#7c3aed":"#107789"}}>
              {IC.play}{t("Start","ابدأ")}
            </button>
          )}
          <button onClick={()=>onView(c)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-[#E2E8F0] text-[#64748b] hover:bg-[#F1F5F9] active:scale-95 transition-all"
            style={{flex:canStart?"0 0 auto":1}}>
            {IC.eye}{!canStart&&<span>{t("Details","التفاصيل")}</span>}
          </button>
          {(c.status==="upcoming"||c.status==="missed")&&(
            <button onClick={()=>onReschedule(c)} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-[#E2E8F0] text-[#64748b] hover:bg-[#F1F5F9] active:scale-95 transition-all">{IC.res}</button>
          )}
          <button onClick={()=>onDelete(c)} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-[#fecaca] text-[#ef4444] hover:bg-[#fee2e2] active:scale-95 transition-all ms-auto">{IC.trash}</button>
        </div>
      </div>
    </div>
  );
}

// ─── Calendar view ────────────────────────────────────────────
function CalendarView({classes,weekStart,lang,t,isRTL,onView,onStart}:{classes:ClassItem[];weekStart:Date;lang:string;t:(a:string,b:string)=>string;isRTL:boolean;onView:(c:ClassItem)=>void;onStart:(id:string)=>void}){
  const days=Array.from({length:7},(_,i)=>{const d=new Date(weekStart);d.setDate(d.getDate()+i);return d;});
  const toKey=(d:Date)=>d.toISOString().slice(0,10);
  const today=toKey(new Date());
  const byDay=days.map(d=>({d,items:classes.filter(c=>c.date===toKey(d))}));

  return(
    <div className="rounded-2xl bg-white border border-[#F1F5F9] shadow-sm overflow-hidden overflow-x-auto" style={{animation:"cardIn .35s cubic-bezier(.34,1.2,.64,1) both"}}>
      {/* Headers */}
      <div className="grid border-b border-[#F1F5F9]" style={{gridTemplateColumns:`repeat(7, minmax(80px, 1fr))`}}>
        {byDay.map(({d},i)=>{
          const isToday=toKey(d)===today;
          return(
            <div key={i} className="py-3 text-center border-e border-[#F1F5F9] last:border-0">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-[#94a3b8]">{lang==="ar"?DAYS_AR[d.getDay()]:DAYS_EN[d.getDay()]}</p>
              <div className={`mx-auto mt-1 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${isToday?"text-white":"text-[#1e293b]"}`}
                style={isToday?{backgroundColor:"#107789"}:{}}>
                {d.getDate()}
              </div>
            </div>
          );
        })}
      </div>
      {/* Grid */}
      <div className="grid min-h-64" style={{gridTemplateColumns:`repeat(7, minmax(80px, 1fr))`}}>
        {byDay.map(({d,items},i)=>{
          const isToday=toKey(d)===today;
          return(
            <div key={i} className="border-e border-[#F1F5F9] last:border-0 p-1.5 space-y-1.5" style={{backgroundColor:isToday?"#FAFFFE":"white"}}>
              {items.map((c,j)=>{
                const sc=SC[c.status];
                return(
                  <button key={j} onClick={()=>onView(c)}
                    className="w-full text-start rounded-xl p-2 hover:shadow-md transition-all active:scale-[.98] cursor-pointer group/card"
                    style={{backgroundColor:sc.bg,border:`1px solid ${sc.border}`,animation:`cardIn .3s ${j*.08}s both`}}>
                    <div className="flex items-center gap-1 mb-1">
                      <span className="w-1.5 h-1.5 rounded-full" style={{backgroundColor:sc.dot}}/>
                      <span className="text-[10px] font-bold" style={{color:sc.text}}>{c.time.replace(" AM","a").replace(" PM","p")}</span>
                    </div>
                    <p className="text-[10px] font-semibold text-[#1e293b] truncate">{lang==="ar"?(c.studentAr||c.student):c.student}</p>
                    <div className="flex items-center gap-1 mt-1 flex-wrap"><LBadge level={c.level}/><TPill type={c.type} lang={lang}/></div>
                    {(c.status==="upcoming"||c.status==="in-progress")&&(
                      <button onClick={e=>{e.stopPropagation();onStart(c.id);}}
                        className="mt-1.5 w-full flex items-center justify-center gap-1 py-1 rounded-lg text-[10px] font-bold text-white opacity-0 group-hover/card:opacity-100 transition-all"
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

// ═══════════════════════════════════════════════════
// PAGE
// ═══════════════════════════════════════════════════
export default function TeacherClasses(){
  const {lang,isRTL,t}=useLanguage();
  const router=useRouter();

  const [classes,setClasses]=useState<ClassItem[]>(ALL_CLASSES);
  const [view,setView]=useState<ViewMode>("cards");
  const [filter,setFilter]=useState<FilterTab>("all");
  const [search,setSearch]=useState("");
  const [weekStart,setWeekStart]=useState(()=>{
    const d=new Date(); d.setDate(d.getDate()-d.getDay()); d.setHours(0,0,0,0); return d;
  });
  const [viewCls,setViewCls]=useState<ClassItem|null>(null);
  const [resCls,setResCls]=useState<ClassItem|null>(null);
  const [delCls,setDelCls]=useState<ClassItem|null>(null);
  const [toast,setToast]=useState<{msg:string;type:"success"|"info"|"error"}|null>(null);

  const fire=(msg:string,type:"success"|"info"|"error"="success")=>{setToast({msg,type});setTimeout(()=>setToast(null),3500);};

  const filtered=classes.filter(c=>{
    const mf=filter==="all"?true:filter==="trial"?c.type==="trial":filter==="upcoming"?(c.status==="upcoming"||c.status==="in-progress"):c.status===filter;
    const q=search.toLowerCase();
    const ms=!q||c.student.toLowerCase().includes(q)||c.subject.toLowerCase().includes(q)||(c.studentAr&&c.studentAr.includes(q));
    return mf&&ms;
  });

  const handleStart=(id:string)=>{void id; router.push("/class/live");};
  const handleReschedule=(id:string,date:string,time:string)=>{
    setClasses(p=>p.map(c=>c.id===id?{...c,date,time,status:"upcoming"}:c));
    setResCls(null); fire(t(`Rescheduled to ${date} at ${time}`,`أُعيدت الجدولة إلى ${date} الساعة ${time}`));
  };
  const handleDelete=(id:string)=>{
    setClasses(p=>p.filter(c=>c.id!==id)); setDelCls(null); fire(t("Class deleted.","تم حذف الحصة."),"error");
  };

  const prevWeek=()=>{const d=new Date(weekStart);d.setDate(d.getDate()-7);setWeekStart(d);};
  const nextWeek=()=>{const d=new Date(weekStart);d.setDate(d.getDate()+7);setWeekStart(d);};
  const weekEnd=new Date(weekStart); weekEnd.setDate(weekEnd.getDate()+6);
  const weekLabel=`${weekStart.getDate()} ${MONTHS_EN[weekStart.getMonth()]} – ${weekEnd.getDate()} ${MONTHS_EN[weekEnd.getMonth()]}`;

  const FILTERS:[FilterTab,string,string,number][]=[
    ["all",t("All","الكل"),t("All","الكل"),classes.length],
    ["upcoming",t("Upcoming","القادمة"),t("Upcoming","القادمة"),classes.filter(c=>c.status==="upcoming"||c.status==="in-progress").length],
    ["completed",t("Completed","المكتملة"),t("Completed","المكتملة"),classes.filter(c=>c.status==="completed").length],
    ["missed",t("Missed","الفائتة"),t("Missed","الفائتة"),classes.filter(c=>c.status==="missed").length],
    ["trial",t("Trials","التجريبية"),t("Trials","التجريبية"),classes.filter(c=>c.type==="trial").length],
  ];

  const stats=[
    {label:t("Today","اليوم"),              val:classes.filter(c=>c.date===new Date().toISOString().slice(0,10)).length, color:"#107789",bg:"#EBF5F7",delay:0},
    {label:t("Upcoming","القادمة"),          val:classes.filter(c=>c.status==="upcoming"||c.status==="in-progress").length, color:"#7c3aed",bg:"#ede9fe",delay:.06},
    {label:t("Completed","المكتملة"),        val:classes.filter(c=>c.status==="completed").length, color:"#059669",bg:"#d1fae5",delay:.12},
    {label:t("Trials","التجريبية"),          val:classes.filter(c=>c.type==="trial").length, color:"#d97706",bg:"#fef3c7",delay:.18},
  ];

  return(
    <>
      <style>{`
        @keyframes cardIn  { from{opacity:0;transform:translateY(12px) scale(.97)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes slideUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes modalIn { from{opacity:0;transform:scale(.94) translateY(8px)} to{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
      `}</style>

      <main className="flex-1 min-h-screen overflow-auto p-4 sm:p-6 space-y-5 sm:space-y-6"
        style={{backgroundColor:"#F5F7F9"}} dir={isRTL?"rtl":"ltr"}>

        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-3" style={{animation:"fadeIn .4s ease both"}}>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[#1e293b] tracking-tight">{t("My Classes","حصصي")}</h1>
            <p className="mt-1 text-xs sm:text-sm text-[#94a3b8]">{t("Manage all your scheduled sessions","إدارة جميع حصصك المجدولة")}</p>
          </div>
          <div className="flex items-center bg-white border border-[#F1F5F9] rounded-xl p-1 gap-1 shadow-sm" style={{animation:"cardIn .4s .05s both"}}>
            {([["cards","🗃️",t("Cards","بطاقات")],["calendar","📅",t("Calendar","تقويم")]] as const).map(([v,em,lbl])=>(
              <button key={v} onClick={()=>setView(v as ViewMode)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                style={view===v?{backgroundColor:"#107789",color:"white"}:{color:"#64748b"}}>
                <span>{em}</span><span className="hidden sm:inline">{lbl}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {stats.map(s=>(
            <div key={s.label} className="bg-white rounded-2xl border border-[#F1F5F9] shadow-sm p-4 sm:p-5 flex items-center gap-3 hover:shadow-md hover:border-[#b2dce4] transition-all duration-300"
              style={{animation:`cardIn .45s ${s.delay}s cubic-bezier(.34,1.2,.64,1) both`}}>
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center flex-shrink-0 text-xl" style={{backgroundColor:s.bg}}>{["📚","⏳","✅","🎯"][stats.indexOf(s)]}</div>
              <div className="min-w-0">
                <p className="text-xl sm:text-2xl font-black leading-none" style={{color:s.color}}>{s.val}</p>
                <p className="text-xs text-[#94a3b8] mt-1 font-medium">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filters + Search */}
        <div className="flex flex-wrap items-center gap-3" style={{animation:"cardIn .4s .18s both"}}>
          <div className="flex items-center gap-1.5 flex-wrap">
            {FILTERS.map(([key,en,,cnt])=>(
              <button key={key} onClick={()=>setFilter(key)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all active:scale-95"
                style={filter===key?{backgroundColor:"#107789",color:"white",boxShadow:"0 2px 8px #10778940"}:{backgroundColor:"white",color:"#64748b",border:"1px solid #F1F5F9"}}>
                {lang==="ar"?FILTERS.find(f=>f[0]===key)![2]:en}
                <span className="text-[10px] rounded-full px-1.5 py-0.5 font-black"
                  style={filter===key?{backgroundColor:"rgba(255,255,255,.25)"}:{backgroundColor:"#F1F5F9",color:"#94a3b8"}}>{cnt}</span>
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-[#F1F5F9] shadow-sm ms-auto" style={{minWidth:180}}>
            <span className="text-[#94a3b8]">{IC.search}</span>
            <input type="text" value={search} onChange={e=>setSearch(e.target.value)}
              placeholder={t("Search…","ابحث…")}
              className="flex-1 bg-transparent text-sm text-[#1e293b] placeholder:text-[#C4CAD4] focus:outline-none"/>
            {search&&<button onClick={()=>setSearch("")} className="text-[#94a3b8] hover:text-[#1e293b] transition-colors text-xs">{IC.close}</button>}
          </div>
        </div>

        {/* Calendar week nav */}
        {view==="calendar"&&(
          <div className="flex items-center justify-between bg-white border border-[#F1F5F9] shadow-sm rounded-2xl px-5 py-3" style={{animation:"cardIn .3s both"}}>
            <button onClick={prevWeek} className="w-8 h-8 flex items-center justify-center rounded-xl border border-[#F1F5F9] text-[#64748b] hover:bg-[#F5F7F9] transition-all">{isRTL?IC.chevR:IC.chevL}</button>
            <div className="text-center">
              <p className="text-sm font-bold text-[#1e293b]">{weekLabel}</p>
              <p className="text-[10px] text-[#94a3b8] mt-0.5">{t("Weekly View","العرض الأسبوعي")}</p>
            </div>
            <button onClick={nextWeek} className="w-8 h-8 flex items-center justify-center rounded-xl border border-[#F1F5F9] text-[#64748b] hover:bg-[#F5F7F9] transition-all">{isRTL?IC.chevL:IC.chevR}</button>
          </div>
        )}

        {/* Empty */}
        {filtered.length===0&&(
          <div className="bg-white rounded-2xl border border-[#F1F5F9] shadow-sm p-16 flex flex-col items-center gap-3 text-center" style={{animation:"fadeIn .4s both"}}>
            <div className="w-14 h-14 rounded-2xl bg-[#EBF5F7] flex items-center justify-center text-[#107789] mb-1">{IC.cal}</div>
            <p className="text-base font-bold text-[#1e293b]">{t("No classes found","لا توجد حصص")}</p>
            <p className="text-sm text-[#94a3b8]">{t("Try adjusting your filters or search.","جرّب تعديل الفلاتر أو البحث.")}</p>
          </div>
        )}

        {/* Cards */}
        {view==="cards"&&filtered.length>0&&(
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {filtered.map((c,i)=>(
              <ClassCard key={c.id} c={c} idx={i} lang={lang} t={t}
                onView={setViewCls} onStart={handleStart}
                onReschedule={setResCls} onDelete={setDelCls}/>
            ))}
          </div>
        )}

        {/* Calendar */}
        {view==="calendar"&&<CalendarView classes={filtered} weekStart={weekStart} lang={lang} t={t} isRTL={isRTL} onView={setViewCls} onStart={handleStart}/>}

      </main>

      {viewCls&&<DetailModal c={viewCls} lang={lang} isRTL={isRTL} t={t} onClose={()=>setViewCls(null)} onStart={handleStart} onReschedule={setResCls} onDelete={setDelCls}/>}
      {resCls&&<RescheduleModal c={resCls} onSave={handleReschedule} onClose={()=>setResCls(null)} lang={lang} isRTL={isRTL} t={t}/>}
      {delCls&&<DeleteConfirm c={delCls} onConfirm={handleDelete} onClose={()=>setDelCls(null)} lang={lang} isRTL={isRTL} t={t}/>}
      {toast&&<Toast msg={toast.msg} type={toast.type} onClose={()=>setToast(null)}/>}
    </>
  );
}