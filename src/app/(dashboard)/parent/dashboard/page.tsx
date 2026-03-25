"use client";

import { useState } from "react";
import { useLanguage } from "@/src/contexts/LanguageContext";

// ─── Types ────────────────────────────────────────────────────
type AttendStatus = "present" | "absent" | "late" | "upcoming";
type NoteType     = "positive" | "improvement" | "info";

interface Child {
  id:       string;
  name:     string;
  nameAr:   string;
  level:    string;
  avatar:   string;
  teacher:  string;
  teacherAr:string;
  xp:       number;
  streak:   number;
  sessionsTotal: number;
  sessionsDone:  number;
}

interface UpcomingClass {
  id:        string;
  subject:   string;
  subjectAr: string;
  teacher:   string;
  teacherAr: string;
  avatar:    string;
  date:      string;
  dateAr:    string;
  time:      string;
  duration:  string;
  status:    "confirmed" | "pending" | "live";
}

interface AttendRecord {
  date:     string;
  dateAr:   string;
  subject:  string;
  subjectAr:string;
  teacher:  string;
  status:   AttendStatus;
  duration: string;
  notes:    string;
  notesAr:  string;
}

interface TeacherNote {
  id:       string;
  teacher:  string;
  teacherAr:string;
  avatar:   string;
  date:     string;
  dateAr:   string;
  subject:  string;
  subjectAr:string;
  message:  string;
  messageAr:string;
  type:     NoteType;
}

interface SkillProgress {
  labelEn: string;
  labelAr: string;
  val:     number;
  color:   string;
}

// ─── Mock data ────────────────────────────────────────────────
const CHILD: Child = {
  id:"STU-001", name:"Sara Al-Rashid", nameAr:"سارة الراشد",
  level:"B2", avatar:"SA", teacher:"Mr. Ahmad Nasser", teacherAr:"أ. أحمد الناصر",
  xp:2480, streak:12, sessionsTotal:20, sessionsDone:14,
};

const UPCOMING: UpcomingClass[] = [
  { id:"c1", subject:"English Speaking",  subjectAr:"محادثة إنجليزية",  teacher:"Mr. Ahmad Nasser", teacherAr:"أ. أحمد الناصر", avatar:"AN", date:"Today",     dateAr:"اليوم",    time:"03:00 PM", duration:"60 min", status:"live"      },
  { id:"c2", subject:"Grammar & Writing",  subjectAr:"قواعد وكتابة",    teacher:"Ms. Nora Khalil",  teacherAr:"أ. نورا خليل",   avatar:"NK", date:"Tomorrow",  dateAr:"غداً",     time:"10:00 AM", duration:"60 min", status:"confirmed" },
  { id:"c3", subject:"IELTS Preparation",  subjectAr:"تحضير IELTS",     teacher:"Dr. Samir Yousef", teacherAr:"د. سمير يوسف",  avatar:"SY", date:"Wednesday", dateAr:"الأربعاء", time:"02:00 PM", duration:"90 min", status:"confirmed" },
  { id:"c4", subject:"Vocabulary Boost",   subjectAr:"تعزيز المفردات",  teacher:"Mr. Ahmad Nasser", teacherAr:"أ. أحمد الناصر", avatar:"AN", date:"Thursday",  dateAr:"الخميس",   time:"03:00 PM", duration:"60 min", status:"pending"   },
];

const ATTENDANCE: AttendRecord[] = [
  { date:"Mar 22, 2025", dateAr:"22 مارس",  subject:"English Speaking",  subjectAr:"محادثة إنجليزية", teacher:"Mr. Ahmad", status:"present",  duration:"60 min", notes:"Excellent participation",      notesAr:"مشاركة ممتازة" },
  { date:"Mar 20, 2025", dateAr:"20 مارس",  subject:"Grammar & Writing",  subjectAr:"قواعد وكتابة",   teacher:"Ms. Nora",  status:"present",  duration:"60 min", notes:"Good effort on exercises",      notesAr:"جهد جيد في التمارين" },
  { date:"Mar 18, 2025", dateAr:"18 مارس",  subject:"IELTS Preparation",  subjectAr:"تحضير IELTS",    teacher:"Dr. Samir", status:"absent",   duration:"—",      notes:"Missed class — rescheduled",    notesAr:"غياب — أُعيد جدولتها" },
  { date:"Mar 15, 2025", dateAr:"15 مارس",  subject:"English Speaking",  subjectAr:"محادثة إنجليزية", teacher:"Mr. Ahmad", status:"present",  duration:"60 min", notes:"Strong speaking progress",      notesAr:"تقدم قوي في المحادثة" },
  { date:"Mar 13, 2025", dateAr:"13 مارس",  subject:"Grammar & Writing",  subjectAr:"قواعد وكتابة",   teacher:"Ms. Nora",  status:"late",     duration:"45 min", notes:"Arrived 15 min late",           notesAr:"تأخر 15 دقيقة" },
  { date:"Mar 10, 2025", dateAr:"10 مارس",  subject:"Vocabulary Boost",   subjectAr:"تعزيز المفردات", teacher:"Mr. Ahmad", status:"present",  duration:"60 min", notes:"Mastered 6 new vocabulary words",notesAr:"أتقنت 6 كلمات مفردات جديدة" },
];

const TEACHER_NOTES: TeacherNote[] = [
  { id:"n1", teacher:"Mr. Ahmad Nasser", teacherAr:"أ. أحمد الناصر", avatar:"AN", date:"Mar 22, 2025", dateAr:"22 مارس 2025", subject:"English Speaking", subjectAr:"محادثة إنجليزية", type:"positive",     message:"Sara showed excellent improvement in natural speech flow this week. She's consistently using discourse markers and her confidence is growing remarkably.", messageAr:"أظهرت سارة تحسناً ممتازاً في تدفق الكلام الطبيعي هذا الأسبوع. إنها تستخدم علامات الخطاب باستمرار وثقتها تنمو بشكل ملحوظ." },
  { id:"n2", teacher:"Ms. Nora Khalil",  teacherAr:"أ. نورا خليل",   avatar:"NK", date:"Mar 20, 2025", dateAr:"20 مارس 2025", subject:"Grammar & Writing",  subjectAr:"قواعد وكتابة",   type:"improvement",  message:"Sara needs more practice with conditional sentences and complex grammar structures. I recommend she reviews Unit 4 exercises before our next session.", messageAr:"تحتاج سارة إلى مزيد من التدريب على جمل الشرط والتراكيب النحوية المعقدة. أوصي بمراجعة تمارين الوحدة 4 قبل جلستنا التالية." },
  { id:"n3", teacher:"Dr. Samir Yousef", teacherAr:"د. سمير يوسف",  avatar:"SY", date:"Mar 15, 2025", dateAr:"15 مارس 2025", subject:"IELTS Preparation",  subjectAr:"تحضير IELTS",    type:"info",         message:"Sara's reading section score has improved from 6.0 to 6.5 in our mock tests. We are on track for her target score of 7.0 by June.", messageAr:"تحسّن درجة قسم القراءة لدى سارة من 6.0 إلى 6.5 في اختباراتنا التجريبية. نحن على المسار الصحيح لتحقيق درجتها المستهدفة 7.0 في يونيو." },
];

const SKILLS: SkillProgress[] = [
  { labelEn:"Speaking",   labelAr:"المحادثة",  val:78, color:"#107789" },
  { labelEn:"Listening",  labelAr:"الاستماع",  val:85, color:"#7c3aed" },
  { labelEn:"Reading",    labelAr:"القراءة",   val:70, color:"#059669" },
  { labelEn:"Writing",    labelAr:"الكتابة",   val:58, color:"#d97706" },
  { labelEn:"Vocabulary", labelAr:"المفردات",  val:82, color:"#0369a1" },
];

const TIME_SLOTS = ["08:00 AM","09:00 AM","10:00 AM","11:00 AM","02:00 PM","03:00 PM","04:00 PM","05:00 PM","06:00 PM"];
const TEACHERS   = [
  { id:"AN", nameEn:"Mr. Ahmad Nasser",  nameAr:"أ. أحمد الناصر",  subjects:["English Speaking","Vocabulary"] },
  { id:"NK", nameEn:"Ms. Nora Khalil",   nameAr:"أ. نورا خليل",    subjects:["Grammar & Writing"] },
  { id:"SY", nameEn:"Dr. Samir Yousef",  nameAr:"د. سمير يوسف",   subjects:["IELTS Preparation"] },
];

// ─── Status configs ───────────────────────────────────────────
const ATTEND_CFG: Record<AttendStatus,{bg:string;text:string;border:string;dot:string;en:string;ar:string}> = {
  present:  {bg:"#d1fae5",text:"#059669",border:"#6ee7b7",dot:"#059669",en:"Present",  ar:"حضر"},
  absent:   {bg:"#fee2e2",text:"#ef4444",border:"#fca5a5",dot:"#ef4444",en:"Absent",   ar:"غاب"},
  late:     {bg:"#fef3c7",text:"#d97706",border:"#fde68a",dot:"#d97706",en:"Late",     ar:"تأخر"},
  upcoming: {bg:"#EBF5F7",text:"#107789",border:"#b2dce4",dot:"#107789",en:"Upcoming", ar:"قادمة"},
};
const NOTE_CFG: Record<NoteType,{bg:string;text:string;border:string;icon:string}> = {
  positive:    {bg:"#d1fae5",text:"#059669",border:"#6ee7b7",icon:"✅"},
  improvement: {bg:"#fef3c7",text:"#d97706",border:"#fde68a",icon:"📌"},
  info:        {bg:"#EBF5F7",text:"#107789",border:"#b2dce4",icon:"ℹ️"},
};
const UPCOMING_CFG: Record<string,{bg:string;text:string;dot:string;en:string;ar:string}> = {
  live:      {bg:"#fee2e2",text:"#ef4444",dot:"#ef4444",en:"Live Now",  ar:"مباشر"},
  confirmed: {bg:"#d1fae5",text:"#059669",dot:"#059669",en:"Confirmed", ar:"مؤكدة"},
  pending:   {bg:"#fef3c7",text:"#d97706",dot:"#d97706",en:"Pending",   ar:"معلقة"},
};

// ─── Avatar ───────────────────────────────────────────────────
const AVT=[{bg:"#EBF5F7",text:"#107789"},{bg:"#ede9fe",text:"#7c3aed"},{bg:"#d1fae5",text:"#059669"},{bg:"#fef3c7",text:"#d97706"},{bg:"#fee2e2",text:"#ef4444"},{bg:"#e0f2fe",text:"#0369a1"}];
const avt=(s:string)=>AVT[(s.charCodeAt(0)+(s.charCodeAt(1)||0))%AVT.length];
function Av({i,size="md"}:{i:string;size?:"sm"|"md"|"lg"}){
  const c=avt(i); const d={sm:"w-7 h-7 text-[10px]",md:"w-10 h-10 text-xs",lg:"w-14 h-14 text-sm"}[size];
  return <div className={`${d} rounded-full flex items-center justify-center font-bold flex-shrink-0 select-none`} style={{backgroundColor:c.bg,color:c.text}}>{i}</div>;
}

// ─── Icons ────────────────────────────────────────────────────
const IC={
  close:    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  ok:       <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>,
  book:     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
  chart:    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  calendar: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  check:    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="9 12 11 14 15 10"/></svg>,
  note:     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  clock:    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  join:     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>,
  arrow:    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  star:     <svg width="14" height="14" viewBox="0 0 24 24" fill="#d97706" stroke="#d97706" strokeWidth="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  user:     <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  zap:      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  info:     <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  spinner:  <svg className="animate-spin" width="15" height="15" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="white" strokeWidth="2" strokeOpacity="0.3"/><path d="M7 1.5a5.5 5.5 0 015.5 5.5" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>,
};

// ─── Shared small components ──────────────────────────────────
function StatusPill({s,lang,cfg}:{s:string;lang:string;cfg:Record<string,{bg:string;text:string;border:string;dot:string;en:string;ar:string}>}){
  const c=cfg[s];
  return(
    <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold whitespace-nowrap"
      style={{backgroundColor:c.bg,color:c.text,border:`1px solid ${c.border}`}}>
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{backgroundColor:c.dot}}/>
      {lang==="ar"?c.ar:c.en}
    </span>
  );
}

function ProgressBar({val,color}:{val:number;color:string}){
  return(
    <div className="h-2 bg-[#F1F5F9] rounded-full overflow-hidden">
      <div className="h-full rounded-full" style={{width:`${val}%`,backgroundColor:color,transition:"width .8s ease"}}/>
    </div>
  );
}

// ─── Backdrop — always centered, wide ────────────────────────
function Backdrop({onClose,children}:{onClose:()=>void;children:React.ReactNode}){
  return(
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6"
      style={{backgroundColor:"rgba(11,44,51,.48)",backdropFilter:"blur(4px)"}}
      onClick={onClose}>
      <div className="w-full sm:w-auto sm:min-w-[640px]" onClick={e=>e.stopPropagation()}
        style={{animation:"modalIn .22s cubic-bezier(.34,1.56,.64,1) both"}}>
        {children}
      </div>
    </div>
  );
}

function Toast({msg,onClose}:{msg:string;onClose:()=>void}){
  return(
    <div className="fixed bottom-5 end-5 z-[60] flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl text-sm font-semibold max-w-[calc(100vw-2.5rem)]"
      style={{backgroundColor:"#f0fdf4",border:"1px solid #bbf7d0",color:"#15803d",animation:"slideUp .3s cubic-bezier(.34,1.56,.64,1) both"}}>
      {IC.ok}<span className="flex-1 min-w-0 truncate">{msg}</span>
      <button onClick={onClose} className="opacity-50 hover:opacity-100">{IC.close}</button>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// VIEW PROGRESS MODAL — wide 2-column
// ═══════════════════════════════════════════════════
function ProgressModal({child,lang,isRTL,t,onClose}:{child:Child;lang:string;isRTL:boolean;t:(a:string,b:string)=>string;onClose:()=>void}){
  const pct=Math.round((child.sessionsDone/child.sessionsTotal)*100);
  const attendPct=Math.round((ATTENDANCE.filter(a=>a.status==="present").length/ATTENDANCE.length)*100);

  return(
    <Backdrop onClose={onClose}>
      <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-4xl overflow-hidden"
        dir={isRTL?"rtl":"ltr"} style={{maxHeight:"90vh",overflowY:"auto"}}>
        <div className="h-1.5" style={{background:"linear-gradient(90deg,#107789,#7c3aed,#E8763A)"}}/>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#F1F5F9]">
          <div className="flex items-center gap-3">
            <Av i={child.avatar} size="md"/>
            <div>
              <h2 className="text-base font-black text-[#1e293b]">{t("Progress Report","تقرير التقدم")} — {lang==="ar"?child.nameAr:child.name}</h2>
              <p className="text-xs text-[#94a3b8] mt-0.5">{t("Level","المستوى")} {child.level} · {lang==="ar"?child.teacherAr:child.teacher}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#F5F7F9] text-[#94a3b8] hover:text-[#1e293b] hover:bg-[#E2E8F0] transition-all">{IC.close}</button>
        </div>

        {/* 2-column body */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x divide-[#F1F5F9]">

          {/* LEFT col */}
          <div className="p-6 space-y-5">
            <p className="text-xs font-black text-[#94a3b8] uppercase tracking-widest">{t("Overview","نظرة عامة")}</p>

            {/* Summary tiles */}
            <div className="grid grid-cols-2 gap-3">
              {[
                {lbl:t("Level","المستوى"),     val:child.level,          icon:"🎓", bg:"#EBF5F7",  color:"#107789"},
                {lbl:t("Total XP","إجمالي XP"),val:`${child.xp} XP`,     icon:"⚡", bg:"#fef3c7",  color:"#d97706"},
                {lbl:t("Streak","سلسلة"),      val:`${child.streak}🔥`,  icon:"🔥", bg:"#fee2e2",  color:"#ef4444"},
                {lbl:t("Attendance","الحضور"), val:`${attendPct}%`,       icon:"📋", bg:"#d1fae5",  color:"#059669"},
              ].map(r=>(
                <div key={r.lbl} className="rounded-2xl border border-[#F1F5F9] p-4" style={{backgroundColor:r.bg}}>
                  <p className="text-xl mb-1">{r.icon}</p>
                  <p className="text-lg font-black" style={{color:r.color}}>{r.val}</p>
                  <p className="text-[10px] text-[#94a3b8] mt-0.5">{r.lbl}</p>
                </div>
              ))}
            </div>

            {/* Course progress */}
            <div className="rounded-2xl bg-[#F8FAFC] border border-[#F1F5F9] p-4 space-y-3">
              <div className="flex justify-between items-center">
                <p className="text-xs font-bold text-[#1e293b]">{t("Course Progress","تقدم المقرر")}</p>
                <span className="text-sm font-black text-[#107789]">{pct}%</span>
              </div>
              <div className="h-3 bg-[#E2E8F0] rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{width:`${pct}%`,background:"linear-gradient(90deg,#107789,#E8763A)",transition:"width .9s ease"}}/>
              </div>
              <p className="text-xs text-[#94a3b8]">
                {child.sessionsDone} {t("of","من")} {child.sessionsTotal} {t("sessions completed","جلسة مكتملة")}
              </p>
            </div>

            {/* Recent attendance */}
            <div>
              <p className="text-xs font-bold text-[#1e293b] mb-3">{t("Recent Sessions","الجلسات الأخيرة")}</p>
              <div className="space-y-2">
                {ATTENDANCE.slice(0,4).map((a,i)=>{
                  const sc=ATTEND_CFG[a.status];
                  return(
                    <div key={i} className="flex items-center gap-3 rounded-xl bg-[#F8FAFC] border border-[#F1F5F9] px-3 py-2.5">
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{backgroundColor:sc.dot}}/>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-[#1e293b] truncate">{lang==="ar"?a.subjectAr:a.subject}</p>
                        <p className="text-[10px] text-[#94a3b8]">{lang==="ar"?a.dateAr:a.date}</p>
                      </div>
                      <span className="text-[10px] font-bold flex-shrink-0" style={{color:sc.text}}>{lang==="ar"?sc.ar:sc.en}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT col */}
          <div className="p-6 space-y-5">
            <p className="text-xs font-black text-[#94a3b8] uppercase tracking-widest">{t("Skill Breakdown","تفصيل المهارات")}</p>

            <div className="space-y-4">
              {SKILLS.map(s=>(
                <div key={s.labelEn}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs font-semibold text-[#64748b]">{lang==="ar"?s.labelAr:s.labelEn}</span>
                    <span className="text-xs font-black" style={{color:s.color}}>{s.val}%</span>
                  </div>
                  <ProgressBar val={s.val} color={s.color}/>
                </div>
              ))}
            </div>

            {/* Teacher notes summary */}
            <div>
              <p className="text-xs font-bold text-[#1e293b] mb-3">{t("Latest Teacher Note","آخر ملاحظة من المعلم")}</p>
              {TEACHER_NOTES.slice(0,1).map(n=>{
                const nc=NOTE_CFG[n.type];
                return(
                  <div key={n.id} className="rounded-2xl border p-4" style={{backgroundColor:nc.bg,borderColor:nc.border}}>
                    <div className="flex items-center gap-2 mb-2">
                      <Av i={n.avatar} size="sm"/>
                      <div className="min-w-0">
                        <p className="text-xs font-bold" style={{color:nc.text}}>{lang==="ar"?n.teacherAr:n.teacher}</p>
                        <p className="text-[10px] opacity-70" style={{color:nc.text}}>{lang==="ar"?n.dateAr:n.date}</p>
                      </div>
                      <span className="ms-auto text-base">{nc.icon}</span>
                    </div>
                    <p className="text-xs leading-relaxed" style={{color:nc.text}}>{lang==="ar"?n.messageAr:n.message}</p>
                  </div>
                );
              })}
            </div>

            {/* Overall rating */}
            <div className="rounded-2xl bg-[#F8FAFC] border border-[#F1F5F9] p-4">
              <p className="text-xs font-bold text-[#1e293b] mb-2">{t("Overall Performance","الأداء العام")}</p>
              <div className="flex items-center gap-2">
                {[1,2,3,4,5].map(n=>(<span key={n}>{IC.star}</span>))}
                <span className="text-sm font-black text-[#d97706] ms-1">4.8/5</span>
              </div>
              <p className="text-[11px] text-[#94a3b8] mt-1.5">{t("Based on teacher evaluations","بناءً على تقييمات المعلمين")}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#F1F5F9] bg-[#FAFBFC]">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm font-semibold border border-[#E2E8F0] text-[#64748b] hover:bg-[#F5F7F9] active:scale-95 transition-all">{t("Close","إغلاق")}</button>
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90 active:scale-95 transition-all" style={{backgroundColor:"#107789"}}>
            {IC.arrow}{t("Download Report","تنزيل التقرير")}
          </button>
        </div>
      </div>
    </Backdrop>
  );
}

// ═══════════════════════════════════════════════════
// BOOK CLASS MODAL — wide 2-column
// ═══════════════════════════════════════════════════
function BookClassModal({lang,isRTL,t,onClose,onConfirm}:{lang:string;isRTL:boolean;t:(a:string,b:string)=>string;onClose:()=>void;onConfirm:()=>void}){
  const [step,    setStep]   = useState<1|2|3>(1);
  const [teacher, setTeacher]= useState("");
  const [subject, setSubject]= useState("");
  const [date,    setDate]   = useState("");
  const [time,    setTime]   = useState("");
  const [notes,   setNotes]  = useState("");
  const [loading, setLoading]= useState(false);
  const [errors,  setErrors] = useState<Record<string,string>>({});

  const sel = TEACHERS.find(tc=>tc.id===teacher);
  const inp = "w-full px-3 py-2.5 text-sm border border-[#E2E8F0] rounded-xl bg-white text-[#1e293b] placeholder:text-[#C4CAD4] focus:outline-none focus:border-[#107789] focus:ring-1 focus:ring-[#107789]/20 transition-all";

  const validateStep1=()=>{
    const e:Record<string,string>={};
    if(!teacher) e.teacher=t("Select a teacher.","اختر معلماً.");
    if(!subject) e.subject=t("Select a subject.","اختر مادة.");
    setErrors(e); return Object.keys(e).length===0;
  };
  const validateStep2=()=>{
    const e:Record<string,string>={};
    if(!date) e.date=t("Select a date.","اختر تاريخاً.");
    if(!time) e.time=t("Select a time.","اختر وقتاً.");
    setErrors(e); return Object.keys(e).length===0;
  };

  const handleNext=()=>{
    if(step===1&&validateStep1()) setStep(2);
    else if(step===2&&validateStep2()) setStep(3);
  };
  const handleBook=async()=>{
    setLoading(true);
    await new Promise(r=>setTimeout(r,1500));
    setLoading(false);
    onConfirm();
  };

  const STEP_LABELS=[t("Teacher & Subject","المعلم والمادة"),t("Date & Time","التاريخ والوقت"),t("Confirm","التأكيد")];

  return(
    <Backdrop onClose={onClose}>
      <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-3xl overflow-hidden"
        dir={isRTL?"rtl":"ltr"} style={{maxHeight:"90vh",overflowY:"auto"}}>
        <div className="h-1.5" style={{background:"linear-gradient(90deg,#107789,#E8763A)"}}/>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#F1F5F9]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EBF5F7] flex items-center justify-center text-[#107789]">{IC.calendar}</div>
            <div>
              <h2 className="text-base font-black text-[#1e293b]">{t("Book a Class","حجز حصة")}</h2>
              <p className="text-xs text-[#94a3b8]">{t("For","لـ")} {lang==="ar"?CHILD.nameAr:CHILD.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#F5F7F9] text-[#94a3b8] hover:text-[#1e293b] hover:bg-[#E2E8F0] transition-all">{IC.close}</button>
        </div>

        {/* Step indicator */}
        <div className="px-6 py-4 border-b border-[#F1F5F9] bg-[#FAFBFC]">
          <div className="flex items-center gap-0">
            {STEP_LABELS.map((lbl,i)=>(
              <div key={i} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all"
                    style={i+1===step?{backgroundColor:"#107789",color:"white"}:i+1<step?{backgroundColor:"#d1fae5",color:"#059669"}:{backgroundColor:"#F1F5F9",color:"#94a3b8"}}>
                    {i+1<step?<span>{IC.ok}</span>:i+1}
                  </div>
                  <p className="text-[10px] font-semibold mt-1 whitespace-nowrap" style={{color:i+1===step?"#107789":i+1<step?"#059669":"#94a3b8"}}>{lbl}</p>
                </div>
                {i<STEP_LABELS.length-1&&(
                  <div className="h-0.5 flex-1 mx-1 mb-4 rounded-full transition-all" style={{backgroundColor:i+1<step?"#107789":"#E2E8F0"}}/>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Body — 2 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x divide-[#F1F5F9]">

          {/* LEFT: Form area */}
          <div className="p-6 space-y-4">
            {/* STEP 1 */}
            {step===1&&(
              <div className="space-y-4" style={{animation:"slideUp .25s ease both"}}>
                <p className="text-xs font-black text-[#94a3b8] uppercase tracking-widest">{t("Select Teacher","اختر المعلم")}</p>
                <div className="space-y-2">
                  {TEACHERS.map(tc=>(
                    <button key={tc.id} onClick={()=>{setTeacher(tc.id);setSubject("");setErrors({});}}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-start transition-all active:scale-[.98]
                                  ${teacher===tc.id?"border-[#107789]/60 bg-[#EBF5F7]":"border-[#E2E8F0] hover:border-[#107789]/30 hover:bg-[#F8FAFC]"}`}>
                      <Av i={tc.id} size="sm"/>
                      <div className="min-w-0 flex-1">
                        <p className={`text-sm font-bold truncate ${teacher===tc.id?"text-[#107789]":"text-[#1e293b]"}`}>{lang==="ar"?tc.nameAr:tc.nameEn}</p>
                        <p className="text-[10px] text-[#94a3b8] truncate">{tc.subjects.join(" · ")}</p>
                      </div>
                      {teacher===tc.id&&<span className="w-5 h-5 rounded-full bg-[#107789] flex items-center justify-center text-white flex-shrink-0">{IC.ok}</span>}
                    </button>
                  ))}
                </div>
                {errors.teacher&&<p className="text-[11px] text-[#ef4444]">{errors.teacher}</p>}

                {sel&&(
                  <div style={{animation:"slideUp .2s ease both"}}>
                    <p className="text-xs font-bold text-[#1e293b] mb-2">{t("Select Subject","اختر المادة")}</p>
                    <div className="flex flex-wrap gap-2">
                      {sel.subjects.map(s=>(
                        <button key={s} onClick={()=>{setSubject(s);setErrors({});}}
                          className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all active:scale-95
                                      ${subject===s?"border-[#107789] bg-[#EBF5F7] text-[#107789]":"border-[#E2E8F0] text-[#64748b] hover:border-[#107789]/30"}`}>
                          {s}
                        </button>
                      ))}
                    </div>
                    {errors.subject&&<p className="text-[11px] text-[#ef4444] mt-1">{errors.subject}</p>}
                  </div>
                )}
              </div>
            )}

            {/* STEP 2 */}
            {step===2&&(
              <div className="space-y-4" style={{animation:"slideUp .25s ease both"}}>
                <p className="text-xs font-black text-[#94a3b8] uppercase tracking-widest">{t("Select Date & Time","اختر التاريخ والوقت")}</p>
                <div>
                  <label className="block text-xs font-semibold text-[#64748b] mb-1.5">{t("Preferred Date","التاريخ المفضل")}</label>
                  <input type="date" value={date} onChange={e=>{setDate(e.target.value);setErrors({});}} className={inp}/>
                  {errors.date&&<p className="text-[11px] text-[#ef4444] mt-1">{errors.date}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#64748b] mb-1.5">{t("Preferred Time","الوقت المفضل")}</label>
                  <div className="grid grid-cols-3 gap-2">
                    {TIME_SLOTS.map(ts=>(
                      <button key={ts} onClick={()=>{setTime(ts);setErrors({});}}
                        className={`py-2.5 rounded-xl text-xs font-semibold border transition-all active:scale-95
                                    ${time===ts?"border-[#107789] bg-[#EBF5F7] text-[#107789]":"border-[#E2E8F0] text-[#64748b] hover:border-[#107789]/30 hover:bg-[#F8FAFC]"}`}>
                        {ts}
                      </button>
                    ))}
                  </div>
                  {errors.time&&<p className="text-[11px] text-[#ef4444] mt-1">{errors.time}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#64748b] mb-1.5">{t("Notes (optional)","ملاحظات (اختياري)")}</label>
                  <textarea rows={3} value={notes} onChange={e=>setNotes(e.target.value)}
                    placeholder={t("Any specific topics or goals for this class?","أي مواضيع أو أهداف محددة لهذه الحصة؟")}
                    className={`${inp} resize-none`} dir={isRTL?"rtl":"ltr"}/>
                </div>
              </div>
            )}

            {/* STEP 3 */}
            {step===3&&(
              <div className="space-y-4" style={{animation:"slideUp .25s ease both"}}>
                <p className="text-xs font-black text-[#94a3b8] uppercase tracking-widest">{t("Confirm Booking","تأكيد الحجز")}</p>
                <div className="rounded-2xl border border-[#F1F5F9] overflow-hidden">
                  {[
                    {lbl:t("Student","الطالب"),  val:lang==="ar"?CHILD.nameAr:CHILD.name},
                    {lbl:t("Teacher","المعلم"),  val:lang==="ar"?TEACHERS.find(tc=>tc.id===teacher)?.nameAr||"":TEACHERS.find(tc=>tc.id===teacher)?.nameEn||""},
                    {lbl:t("Subject","المادة"),  val:subject},
                    {lbl:t("Date","التاريخ"),    val:date},
                    {lbl:t("Time","الوقت"),      val:time},
                  ].map((r,i,arr)=>(
                    <div key={r.lbl} className={`flex items-center justify-between px-4 py-3 ${i<arr.length-1?"border-b border-[#F1F5F9]":""}`}>
                      <span className="text-xs text-[#94a3b8] font-medium">{r.lbl}</span>
                      <span className="text-xs font-bold text-[#1e293b]">{r.val}</span>
                    </div>
                  ))}
                </div>
                {notes&&(
                  <div className="rounded-xl bg-[#FFFBEB] border border-[#FDE68A] p-3">
                    <p className="text-[10px] font-bold text-[#d97706] mb-1">{t("Notes","ملاحظات")}</p>
                    <p className="text-xs text-[#64748b]">{notes}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* RIGHT: context/summary panel */}
          <div className="p-6 space-y-4 bg-[#FAFBFC]">
            <p className="text-xs font-black text-[#94a3b8] uppercase tracking-widest">{t("Booking Summary","ملخص الحجز")}</p>

            {/* Child card */}
            <div className="rounded-2xl bg-white border border-[#F1F5F9] p-4 flex items-center gap-3">
              <Av i={CHILD.avatar} size="md"/>
              <div className="min-w-0">
                <p className="text-sm font-bold text-[#1e293b]">{lang==="ar"?CHILD.nameAr:CHILD.name}</p>
                <p className="text-xs text-[#94a3b8]">{t("Level","المستوى")} {CHILD.level} · {CHILD.xp} XP</p>
              </div>
            </div>

            {/* Selected so far */}
            <div className="space-y-2">
              {[
                {lbl:t("Teacher","المعلم"),  val:sel?(lang==="ar"?sel.nameAr:sel.nameEn):t("Not selected","لم يُختر")},
                {lbl:t("Subject","المادة"),  val:subject||t("Not selected","لم تُختر")},
                {lbl:t("Date","التاريخ"),    val:date||t("Not selected","لم يُختر")},
                {lbl:t("Time","الوقت"),      val:time||t("Not selected","لم يُختر")},
              ].map(r=>(
                <div key={r.lbl} className="flex items-center justify-between rounded-xl bg-white border border-[#F1F5F9] px-3 py-2.5">
                  <span className="text-[11px] text-[#94a3b8]">{r.lbl}</span>
                  <span className={`text-[11px] font-bold ${r.val.includes("Not")||r.val.includes("لم")?"text-[#94a3b8]":"text-[#107789]"}`}>{r.val}</span>
                </div>
              ))}
            </div>

            {/* Info note */}
            <div className="flex items-start gap-2 rounded-xl bg-white border border-[#b2dce4] p-3 text-xs text-[#107789]">
              {IC.info}<span className="leading-relaxed">{t("Booking is subject to teacher availability. You'll receive a confirmation email once approved.","الحجز خاضع لتوافر المعلم. ستتلقى بريداً تأكيدياً عند الموافقة.")}</span>
            </div>
          </div>
        </div>

        {/* Footer nav */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#F1F5F9] bg-white">
          <button onClick={()=>step>1?setStep(s=>(s-1) as 1|2|3):onClose()}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold border border-[#E2E8F0] text-[#64748b] hover:bg-[#F5F7F9] active:scale-95 transition-all">
            {step===1?t("Cancel","إلغاء"):t("Back","رجوع")}
          </button>
          {step<3?(
            <button onClick={handleNext}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90 active:scale-95 transition-all" style={{backgroundColor:"#107789"}}>
              {t("Next","التالي")}{IC.arrow}
            </button>
          ):(
            <button onClick={handleBook} disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90 active:scale-95 transition-all" style={{backgroundColor:loading?"#5FA8B3":"#107789"}}>
              {loading?<>{IC.spinner}{t("Booking…","جارٍ الحجز…")}</>:<>{t("Confirm Booking","تأكيد الحجز")}{IC.arrow}</>}
            </button>
          )}
        </div>
      </div>
    </Backdrop>
  );
}

// ═══════════════════════════════════════════════════
// PAGE
// ═══════════════════════════════════════════════════
export default function ParentDashboard(){
  const {lang,isRTL,t}=useLanguage();

  const [showProgress, setShowProgress]=useState(false);
  const [showBook,     setShowBook]    =useState(false);
  const [toast,        setToast]       =useState<string|null>(null);

  const fire=(msg:string)=>{ setToast(msg); setTimeout(()=>setToast(null),3500); };

  const pct       = Math.round((CHILD.sessionsDone/CHILD.sessionsTotal)*100);
  const presentN  = ATTENDANCE.filter(a=>a.status==="present").length;
  const absentN   = ATTENDANCE.filter(a=>a.status==="absent").length;
  const attendPct = Math.round((presentN/ATTENDANCE.length)*100);

  const stats=[
    {icon:IC.chart,    value:`${pct}%`,      label:t("Course Progress","تقدم المقرر"),    sub:t(`${CHILD.sessionsDone}/${CHILD.sessionsTotal} sessions`,`${CHILD.sessionsDone}/${CHILD.sessionsTotal} جلسة`), color:"#107789",bg:"#EBF5F7",delay:0    },
    {icon:IC.check,    value:`${attendPct}%`,label:t("Attendance Rate","نسبة الحضور"),    sub:`${presentN} ${t("present","حضور")} · ${absentN} ${t("absent","غياب")}`,                                          color:"#059669",bg:"#d1fae5",delay:0.07 },
    {icon:IC.calendar, value:`${UPCOMING.filter(c=>c.status!=="live").length}`,label:t("Upcoming Classes","الحصص القادمة"), sub:t("This week","هذا الأسبوع"),                                                  color:"#7c3aed",bg:"#ede9fe",delay:0.14 },
    {icon:IC.note,     value:String(TEACHER_NOTES.length),label:t("Teacher Notes","ملاحظات المعلمين"),    sub:t("Latest feedback","آخر التغذية الراجعة"),                                                    color:"#d97706",bg:"#fef3c7",delay:0.21 },
  ];

  return(
    <>
      <style>{`
        @keyframes cardIn  { from{opacity:0;transform:translateY(14px) scale(.97)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes slideUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes modalIn { from{opacity:0;transform:scale(.93) translateY(10px)} to{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
        @keyframes blink   { 0%,100%{opacity:1} 50%{opacity:.4} }
      `}</style>

      <main className="flex-1 min-h-screen overflow-auto p-4 sm:p-6 space-y-5 sm:space-y-6"
        style={{backgroundColor:"#F5F7F9"}} dir={isRTL?"rtl":"ltr"}>

        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-3" style={{animation:"fadeIn .4s ease both"}}>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[#1e293b] tracking-tight">
              {t("Parent Dashboard","لوحة تحكم ولي الأمر")}
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-[#94a3b8]">{t("Monitor your child's learning journey","تابع رحلة طفلك التعليمية")}</p>
          </div>
          <button onClick={()=>setShowBook(true)}
            className="flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90 active:scale-95 transition-all shadow-sm"
            style={{backgroundColor:"#107789",animation:"cardIn .4s .05s both"}}>
            {IC.calendar}{t("Book a Class","احجز حصة")}
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {stats.map(s=>(
            <div key={s.label} className="rounded-2xl bg-white border border-[#F1F5F9] shadow-sm p-4 sm:p-5 flex items-start gap-3 sm:gap-4 hover:shadow-md hover:border-[#b2dce4] transition-all duration-300"
              style={{animation:`cardIn .45s ${s.delay}s cubic-bezier(.34,1.2,.64,1) both`}}>
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{backgroundColor:s.bg}}>
                <span style={{color:s.color}}>{s.icon}</span>
              </div>
              <div className="min-w-0">
                <p className="text-xl sm:text-2xl font-black text-[#1e293b] leading-none">{s.value}</p>
                <p className="text-xs text-[#94a3b8] mt-1 font-medium leading-tight">{s.label}</p>
                {s.sub&&<p className="text-[10px] text-[#94a3b8] mt-0.5 truncate">{s.sub}</p>}
              </div>
            </div>
          ))}
        </div>

        {/* Child Progress Hero */}
        <div className="rounded-2xl overflow-hidden shadow-sm"
          style={{background:"linear-gradient(135deg,#0B2C33 0%,#107789 60%,#0d8a9e 100%)",animation:"cardIn .45s .22s both"}}>
          <div className="relative p-5 sm:p-6">
            <div className="absolute -top-8 -end-8 w-48 h-48 rounded-full opacity-10 bg-white pointer-events-none"/>
            <div className="absolute -bottom-10 -start-10 w-56 h-56 rounded-full opacity-5 bg-white pointer-events-none"/>

            <div className="relative flex flex-wrap items-start justify-between gap-5">
              {/* Child info */}
              <div className="flex items-start gap-4 flex-1 min-w-0">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black text-white flex-shrink-0 ring-4 ring-white/20"
                  style={{backgroundColor:"#0d6275"}}>
                  {CHILD.avatar}
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/50">{t("Student","الطالب")}</p>
                  <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">{lang==="ar"?CHILD.nameAr:CHILD.name}</h2>
                  <div className="flex items-center gap-2 flex-wrap mt-1">
                    <span className="text-[10px] font-black px-2.5 py-1 rounded-full text-white" style={{backgroundColor:"rgba(255,255,255,0.15)"}}>
                      {t("Level","المستوى")} {CHILD.level}
                    </span>
                    <span className="text-xs text-white/60">{lang==="ar"?CHILD.teacherAr:CHILD.teacher}</span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col gap-2 flex-shrink-0">
                <button onClick={()=>setShowProgress(true)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-white text-[#107789] hover:bg-white/90 active:scale-[.98] transition-all">
                  {IC.chart}{t("View Progress","عرض التقدم")}
                </button>
                <button onClick={()=>setShowBook(true)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white border border-white/20 hover:bg-white/10 active:scale-[.98] transition-all">
                  {IC.calendar}{t("Book Class","احجز حصة")}
                </button>
              </div>
            </div>

            {/* Progress bar */}
            <div className="relative mt-5 space-y-2">
              <div className="flex justify-between text-xs text-white/60">
                <span>{t("Course Progress","تقدم المقرر")}</span>
                <span><strong className="text-white">{CHILD.sessionsDone}</strong>/{CHILD.sessionsTotal} {t("sessions","جلسات")} · {pct}%</span>
              </div>
              <div className="h-2.5 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full rounded-full" style={{width:`${pct}%`,background:"linear-gradient(90deg,#E8763A,#f59e0b)",transition:"width .9s ease"}}/>
              </div>
            </div>

            {/* XP + Streak chips */}
            <div className="relative flex flex-wrap gap-3 mt-4">
              {[
                {icon:"⚡", label:`${CHILD.xp} XP`},
                {icon:"🔥", label:`${CHILD.streak} ${t("day streak","يوم متتالي")}`},
                {icon:"📊", label:`${attendPct}% ${t("attendance","حضور")}`},
              ].map((c,i)=>(
                <div key={i} className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-white" style={{backgroundColor:"rgba(255,255,255,0.12)"}}>
                  <span>{c.icon}</span>{c.label}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Skills + Upcoming — 2 columns */}
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">

          {/* Skill Progress */}
          <div className="xl:col-span-1 rounded-2xl bg-white border border-[#F1F5F9] shadow-sm p-5 hover:shadow-md hover:border-[#b2dce4] transition-all duration-300"
            style={{animation:"cardIn .45s .3s both"}}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-[#1e293b]">{t("Skill Progress","تقدم المهارات")}</h3>
              <button onClick={()=>setShowProgress(true)} className="text-xs font-semibold text-[#107789] hover:underline">{t("Details","تفاصيل")}</button>
            </div>
            <div className="space-y-4">
              {SKILLS.map((s,i)=>(
                <div key={s.labelEn} style={{animation:`slideUp .3s ${0.32+i*0.07}s ease both`}}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs font-semibold text-[#64748b]">{lang==="ar"?s.labelAr:s.labelEn}</span>
                    <span className="text-xs font-black" style={{color:s.color}}>{s.val}%</span>
                  </div>
                  <ProgressBar val={s.val} color={s.color}/>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Classes */}
          <div className="xl:col-span-2 rounded-2xl bg-white border border-[#F1F5F9] shadow-sm overflow-hidden hover:shadow-md transition-all duration-300"
            style={{animation:"cardIn .45s .36s both"}}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#F1F5F9]">
              <div>
                <h3 className="text-sm font-bold text-[#1e293b]">{t("Upcoming Classes","الحصص القادمة")}</h3>
                <p className="text-xs text-[#94a3b8] mt-0.5">{t("Scheduled sessions for your child","الجلسات المجدولة لطفلك")}</p>
              </div>
              <button onClick={()=>setShowBook(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white hover:opacity-90 active:scale-95 transition-all"
                style={{backgroundColor:"#107789"}}>
                {IC.calendar}{t("Book","احجز")}
              </button>
            </div>
            <div className="divide-y divide-[#F8FAFC]">
              {UPCOMING.map((cls,i)=>{
                const sc=UPCOMING_CFG[cls.status];
                const isLive=cls.status==="live";
                return(
                  <div key={cls.id} className={`flex items-center gap-4 px-5 py-4 transition-colors ${isLive?"bg-[#FFF5F5]":"hover:bg-[#F8FAFC]"}`}
                    style={{animation:`slideUp .3s ${0.4+i*0.07}s ease both`}}>
                    <div className="relative">
                      <Av i={cls.avatar} size="sm"/>
                      {isLive&&<span className="absolute -top-0.5 -end-0.5 w-3 h-3 rounded-full bg-[#ef4444] border-2 border-white" style={{animation:"blink 1.2s infinite"}}/>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-[#1e293b] truncate">{lang==="ar"?cls.subjectAr:cls.subject}</p>
                      <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                        <span className="text-xs text-[#94a3b8] truncate">{lang==="ar"?cls.teacherAr:cls.teacher}</span>
                        <span className="text-[#E2E8F0]">·</span>
                        <div className="flex items-center gap-1 text-[#94a3b8]">{IC.clock}<span className="text-xs">{lang==="ar"?cls.dateAr:cls.date} · {cls.time}</span></div>
                        <span className="text-[10px] text-[#94a3b8]">· {cls.duration}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold"
                        style={{backgroundColor:sc.bg,color:sc.text}}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{backgroundColor:sc.dot}}/>
                        {lang==="ar"?sc.ar:sc.en}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Attendance Record */}
        <div className="rounded-2xl bg-white border border-[#F1F5F9] shadow-sm overflow-hidden hover:shadow-md transition-all duration-300"
          style={{animation:"cardIn .45s .44s both"}}>
          <div className="px-5 py-4 border-b border-[#F1F5F9]">
            <h3 className="text-sm font-bold text-[#1e293b]">{t("Attendance Record","سجل الحضور")}</h3>
            <p className="text-xs text-[#94a3b8] mt-0.5">{t("Last 6 sessions","آخر 6 جلسات")}</p>
          </div>

          {/* Mobile cards */}
          <div className="sm:hidden divide-y divide-[#F8FAFC]">
            {ATTENDANCE.map((a,i)=>{
              const sc=ATTEND_CFG[a.status];
              return(
                <div key={i} className="flex items-center gap-3 px-4 py-3.5"
                  style={{animation:`slideUp .3s ${0.48+i*0.05}s ease both`}}>
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{backgroundColor:sc.dot}}/>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-[#1e293b] truncate">{lang==="ar"?a.subjectAr:a.subject}</p>
                    <p className="text-[10px] text-[#94a3b8]">{lang==="ar"?a.dateAr:a.date} · {a.teacher}</p>
                  </div>
                  <span className="text-[10px] font-bold flex-shrink-0" style={{color:sc.text}}>{lang==="ar"?sc.ar:sc.en}</span>
                </div>
              );
            })}
          </div>

          {/* Desktop table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-sm" style={{borderCollapse:"collapse"}}>
              <thead>
                <tr style={{backgroundColor:"#F8FAFC"}}>
                  {[t("Date","التاريخ"),t("Subject","المادة"),t("Teacher","المعلم"),t("Duration","المدة"),t("Status","الحالة"),t("Notes","الملاحظات")].map(h=>(
                    <th key={h} className="px-4 py-3 text-start text-xs font-semibold uppercase tracking-wide text-[#94a3b8] whitespace-nowrap border-b border-[#F1F5F9]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ATTENDANCE.map((a,i)=>{
                  const sc=ATTEND_CFG[a.status];
                  return(
                    <tr key={i} className="hover:bg-[#F8FAFC] transition-colors border-b border-[#F1F5F9] last:border-0"
                      style={{animation:`slideUp .3s ${0.5+i*0.05}s ease both`}}>
                      <td className="px-4 py-3 text-xs text-[#94a3b8] whitespace-nowrap">{lang==="ar"?a.dateAr:a.date}</td>
                      <td className="px-4 py-3 font-semibold text-[#1e293b]">{lang==="ar"?a.subjectAr:a.subject}</td>
                      <td className="px-4 py-3 text-xs text-[#64748b] whitespace-nowrap">{a.teacher}</td>
                      <td className="px-4 py-3 text-xs text-[#64748b]">{a.duration}</td>
                      <td className="px-4 py-3"><StatusPill s={a.status} lang={lang} cfg={ATTEND_CFG}/></td>
                      <td className="px-4 py-3 text-xs text-[#64748b]">{lang==="ar"?a.notesAr:a.notes}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Teacher Notes */}
        <div className="space-y-4" style={{animation:"cardIn .45s .52s both"}}>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#1e293b]">{t("Teacher Notes","ملاحظات المعلمين")}</h3>
            <span className="text-xs text-[#94a3b8]">{TEACHER_NOTES.length} {t("notes","ملاحظة")}</span>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {TEACHER_NOTES.map((n,i)=>{
              const nc=NOTE_CFG[n.type];
              return(
                <div key={n.id} className="rounded-2xl border overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
                  style={{borderColor:nc.border,animation:`cardIn .4s ${i*0.09}s both`}}>
                  <div className="px-4 py-2.5 flex items-center gap-2" style={{backgroundColor:nc.bg}}>
                    <span className="text-base">{nc.icon}</span>
                    <span className="text-xs font-black" style={{color:nc.text}}>{lang==="ar"?n.subjectAr:n.subject}</span>
                    <span className="ms-auto text-[10px] font-medium opacity-70" style={{color:nc.text}}>{lang==="ar"?n.dateAr:n.date}</span>
                  </div>
                  <div className="p-4 bg-white space-y-3">
                    <div className="flex items-center gap-2">
                      <Av i={n.avatar} size="sm"/>
                      <p className="text-xs font-bold text-[#1e293b]">{lang==="ar"?n.teacherAr:n.teacher}</p>
                    </div>
                    <p className="text-xs text-[#64748b] leading-relaxed line-clamp-3">{lang==="ar"?n.messageAr:n.message}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </main>

      {showProgress&&<ProgressModal child={CHILD} lang={lang} isRTL={isRTL} t={t} onClose={()=>setShowProgress(false)}/>}
      {showBook&&<BookClassModal lang={lang} isRTL={isRTL} t={t} onClose={()=>setShowBook(false)} onConfirm={()=>{setShowBook(false);fire(t("Class booked successfully! Awaiting confirmation.","تم حجز الحصة بنجاح! بانتظار التأكيد."));}}/>}
      {toast&&<Toast msg={toast} onClose={()=>setToast(null)}/>}
    </>
  );
}