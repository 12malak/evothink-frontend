"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/src/contexts/LanguageContext";

// ─── Types ────────────────────────────────────────────────────
type ClassStatus = "upcoming" | "completed" | "missed" | "in-progress";
type ClassType   = "trial" | "normal";

interface TodayClass {
  id: string; time: string; student: string; studentAr: string;
  avatar: string; level: string; status: ClassStatus; type: ClassType;
}
interface UpcomingSession {
  id: string; student: string; studentAr: string; avatar: string;
  time: string; date: string; dateAr: string; type: ClassType;
}
interface ActivityItem {
  id: string; actor: string; actorAr: string; avatar: string;
  actionEn: string; actionAr: string; time: string; timeAr: string; color: string;
}

// ─── Mock data ────────────────────────────────────────────────
const TODAY_CLASSES: TodayClass[] = [
  { id:"c1", time:"09:00 AM", student:"Sara Al-Rashid",    studentAr:"سارة الراشد",    avatar:"SA", level:"B2 Upper-Intermediate", status:"completed",    type:"normal" },
  { id:"c2", time:"11:00 AM", student:"Omar Khalid",       studentAr:"عمر خالد",       avatar:"OK", level:"A1 Beginner",           status:"in-progress",  type:"trial"  },
  { id:"c3", time:"01:00 PM", student:"Lina Hassan",       studentAr:"لينا حسن",       avatar:"LH", level:"B1 Intermediate",       status:"upcoming",     type:"normal" },
  { id:"c4", time:"03:00 PM", student:"Faisal Al-Mutairi", studentAr:"فيصل المطيري",   avatar:"FA", level:"C1 Advanced",           status:"upcoming",     type:"normal" },
  { id:"c5", time:"05:00 PM", student:"Noor Al-Amin",      studentAr:"نور الأمين",     avatar:"NA", level:"A2 Elementary",         status:"missed",       type:"trial"  },
];
const UPCOMING: UpcomingSession[] = [
  { id:"s1", student:"Khalid Mansoor",   studentAr:"خالد منصور",   avatar:"KM", time:"10:00 AM", date:"Tomorrow",  dateAr:"غداً",     type:"normal" },
  { id:"s2", student:"Reem Al-Jabri",    studentAr:"ريم الجابري",  avatar:"RJ", time:"02:00 PM", date:"Tomorrow",  dateAr:"غداً",     type:"trial"  },
  { id:"s3", student:"Ahmed Al-Zahrani", studentAr:"أحمد الزهراني",avatar:"AZ", time:"09:00 AM", date:"Wednesday", dateAr:"الأربعاء", type:"normal" },
  { id:"s4", student:"Dina Yousef",      studentAr:"دينا يوسف",    avatar:"DY", time:"04:00 PM", date:"Thursday",  dateAr:"الخميس",   type:"trial"  },
];
const ACTIVITIES: ActivityItem[] = [
  { id:"a1", actor:"Sara Al-Rashid",    actorAr:"سارة الراشد",    avatar:"SA", actionEn:"Completed her B2 lesson session",      actionAr:"أكملت جلسة درس B2 الخاصة بها",   time:"2h ago",    timeAr:"منذ ساعتين",  color:"#059669" },
  { id:"a2", actor:"You",               actorAr:"أنت",             avatar:"ME", actionEn:"Submitted evaluation for Omar Khalid", actionAr:"أرسلت تقييم عمر خالد",            time:"3h ago",    timeAr:"منذ 3 ساعات", color:"#107789" },
  { id:"a3", actor:"Noor Al-Amin",      actorAr:"نور الأمين",     avatar:"NA", actionEn:"Missed scheduled trial class",         actionAr:"غابت عن الحصة التجريبية",         time:"5h ago",    timeAr:"منذ 5 ساعات", color:"#ef4444" },
  { id:"a4", actor:"Faisal Al-Mutairi", actorAr:"فيصل المطيري",   avatar:"FA", actionEn:"Booked a new class for next week",     actionAr:"حجز حصة جديدة للأسبوع القادم",   time:"Yesterday", timeAr:"أمس",         color:"#7c3aed" },
  { id:"a5", actor:"Lina Hassan",       actorAr:"لينا حسن",       avatar:"LH", actionEn:"Reached B1 level milestone",           actionAr:"وصلت إلى مرحلة مستوى B1",        time:"Yesterday", timeAr:"أمس",         color:"#d97706" },
];
const METRICS = [
  { labelEn:"Attendance Rate",   labelAr:"معدل الحضور",  value:88, color:"#107789" },
  { labelEn:"Completion Rate",   labelAr:"معدل الإكمال", value:92, color:"#059669" },
  { labelEn:"Performance Score", labelAr:"مؤشر الأداء",  value:76, color:"#7c3aed" },
];

// ─── Status / Type configs ─────────────────────────────────────
const SC: Record<ClassStatus,{bg:string;text:string;border:string;dot:string;en:string;ar:string}> = {
  upcoming:      {bg:"#EBF5F7",text:"#107789",border:"#b2dce4",dot:"#107789",en:"Upcoming",    ar:"قادمة"},
  completed:     {bg:"#d1fae5",text:"#059669",border:"#6ee7b7",dot:"#059669",en:"Completed",   ar:"مكتملة"},
  missed:        {bg:"#fee2e2",text:"#ef4444",border:"#fca5a5",dot:"#ef4444",en:"Missed",      ar:"فائتة"},
  "in-progress": {bg:"#ede9fe",text:"#7c3aed",border:"#c4b5fd",dot:"#7c3aed",en:"In Progress", ar:"جارية الآن"},
};
const TC: Record<ClassType,{bg:string;text:string;en:string;ar:string}> = {
  trial:  {bg:"#fef3c7",text:"#d97706",en:"Trial",  ar:"تجريبية"},
  normal: {bg:"#e0f2fe",text:"#0369a1",en:"Normal", ar:"عادية"},
};

// ─── Avatar ───────────────────────────────────────────────────
const AVT=[{bg:"#EBF5F7",text:"#107789"},{bg:"#ede9fe",text:"#7c3aed"},{bg:"#d1fae5",text:"#059669"},{bg:"#fef3c7",text:"#d97706"},{bg:"#fee2e2",text:"#ef4444"},{bg:"#e0f2fe",text:"#0369a1"}];
const avt=(s:string)=>AVT[(s.charCodeAt(0)+(s.charCodeAt(1)||0))%AVT.length];
function Av({i,size="md"}:{i:string;size?:"sm"|"md"|"lg"}){
  const c=avt(i); const d={sm:"w-7 h-7 text-[10px]",md:"w-9 h-9 text-xs",lg:"w-12 h-12 text-sm"}[size];
  return <div className={`${d} rounded-full flex items-center justify-center font-bold flex-shrink-0 select-none`} style={{backgroundColor:c.bg,color:c.text}}>{i}</div>;
}

// ─── Shared pills ─────────────────────────────────────────────
function SPill({s,lang}:{s:ClassStatus;lang:string}){
  const c=SC[s];
  return(
    <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold whitespace-nowrap"
      style={{backgroundColor:c.bg,color:c.text,border:`1px solid ${c.border}`}}>
      {s==="in-progress"
        ?<span className="relative flex h-1.5 w-1.5 flex-shrink-0"><span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{backgroundColor:c.dot}}/><span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{backgroundColor:c.dot}}/></span>
        :<span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{backgroundColor:c.dot}}/>}
      {lang==="ar"?c.ar:c.en}
    </span>
  );
}
function TPill({t:type,lang}:{t:ClassType;lang:string}){
  const c=TC[type];
  return <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold whitespace-nowrap" style={{backgroundColor:c.bg,color:c.text}}>{lang==="ar"?c.ar:c.en}</span>;
}

// ─── Progress bar ─────────────────────────────────────────────
function PBar({val,color,delay=0}:{val:number;color:string;delay?:number}){
  return(
    <div className="h-2 bg-[#F1F5F9] rounded-full overflow-hidden">
      <div className="h-full rounded-full" style={{width:`${val}%`,backgroundColor:color,transition:`width .7s ${delay}s ease`}}/>
    </div>
  );
}

// ─── Icons ────────────────────────────────────────────────────
const IC={
  cal:    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  clock:  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  check:  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="9 12 11 14 15 10"/></svg>,
  wallet: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/><circle cx="16" cy="13" r="1.5" fill="currentColor"/></svg>,
  bell:   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  play:   <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>,
  eye:    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  close:  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  ok:     <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>,
  res:    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>,
  miss:   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>,
  cal20:  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  arrow:  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  spinner:<svg className="animate-spin" width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="white" strokeWidth="2" strokeOpacity="0.3"/><path d="M7 1.5a5.5 5.5 0 015.5 5.5" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>,
  info:   <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
};

// ─── Backdrop ─────────────────────────────────────────────────
function Backdrop({onClose,children}:{onClose:()=>void;children:React.ReactNode}){
  return(
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6"
      style={{backgroundColor:"rgba(11,44,51,.48)",backdropFilter:"blur(4px)"}}
      onClick={onClose}>
      <div className="w-full sm:w-auto sm:min-w-[600px]" onClick={e=>e.stopPropagation()}
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
// CLASS DETAIL MODAL — wide 2-column
// ═══════════════════════════════════════════════════
function ClassDetailModal({cls,lang,isRTL,t,onClose,onStart,onReschedule,onMarkMiss}:{
  cls:TodayClass; lang:string; isRTL:boolean;
  t:(a:string,b:string)=>string;
  onClose:()=>void; onStart:()=>void;
  onReschedule:()=>void; onMarkMiss:()=>void;
}){
  const sc=SC[cls.status];
  return(
    <Backdrop onClose={onClose}>
      <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-3xl overflow-hidden"
        dir={isRTL?"rtl":"ltr"}>
        <div className="h-1.5" style={{background:`linear-gradient(90deg,${sc.dot},#E8763A,transparent)`}}/>
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#F1F5F9]">
          <div className="flex items-center gap-3">
            <Av i={cls.avatar} size="md"/>
            <div>
              <h2 className="text-base font-black text-[#1e293b]">{lang==="ar"?cls.studentAr:cls.student}</h2>
              <p className="text-xs text-[#94a3b8] mt-0.5">{cls.level} · {cls.time}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#F5F7F9] text-[#94a3b8] hover:text-[#1e293b] hover:bg-[#E2E8F0] transition-all">{IC.close}</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x divide-[#F1F5F9]">
          {/* LEFT */}
          <div className="p-6 space-y-4">
            <p className="text-xs font-black text-[#94a3b8] uppercase tracking-widest">{t("Class Info","معلومات الحصة")}</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                {lbl:t("Time","الوقت"),    val:cls.time,                              icon:"🕐"},
                {lbl:t("Status","الحالة"), val:<SPill s={cls.status} lang={lang}/>,    icon:"📊"},
                {lbl:t("Type","النوع"),    val:<TPill t={cls.type} lang={lang}/>,      icon:"📚"},
                {lbl:t("Level","المستوى"), val:cls.level,                             icon:"🎓"},
              ].map(r=>(
                <div key={r.lbl.toString()} className="rounded-xl bg-[#F8FAFC] border border-[#F1F5F9] p-3">
                  <p className="text-lg mb-1">{r.icon}</p>
                  <p className="text-[10px] text-[#94a3b8] font-semibold uppercase tracking-wide">{r.lbl}</p>
                  <div className="text-xs font-bold text-[#1e293b] mt-0.5">{r.val}</div>
                </div>
              ))}
            </div>
            {/* Action buttons */}
            <div className="flex flex-wrap gap-2 pt-2">
              {(cls.status==="upcoming"||cls.status==="in-progress")&&(
                <button onClick={()=>{onStart();onClose();}}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90 active:scale-95 transition-all"
                  style={{backgroundColor:cls.status==="in-progress"?"#7c3aed":"#107789"}}>
                  {IC.play}{t("Start Class","ابدأ الحصة")}
                </button>
              )}
              {cls.status!=="missed"&&cls.status!=="completed"&&(
                <button onClick={()=>{onReschedule();onClose();}}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold border border-[#E2E8F0] text-[#64748b] hover:bg-[#F5F7F9] active:scale-95 transition-all">
                  {IC.res}{t("Reschedule","إعادة جدولة")}
                </button>
              )}
              {cls.status==="upcoming"&&(
                <button onClick={()=>{onMarkMiss();onClose();}}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold border border-[#fca5a5] text-[#ef4444] hover:bg-[#fee2e2] active:scale-95 transition-all">
                  {IC.miss}{t("Mark Missed","فائتة")}
                </button>
              )}
            </div>
          </div>

          {/* RIGHT */}
          <div className="p-6 space-y-4">
            <p className="text-xs font-black text-[#94a3b8] uppercase tracking-widest">{t("Student Profile","ملف الطالب")}</p>
            <div className="flex items-center gap-4 rounded-2xl bg-[#F8FAFC] border border-[#F1F5F9] p-4">
              <Av i={cls.avatar} size="lg"/>
              <div>
                <p className="text-base font-black text-[#1e293b]">{lang==="ar"?cls.studentAr:cls.student}</p>
                <p className="text-xs text-[#94a3b8] mt-0.5">{cls.level}</p>
                <div className="flex items-center gap-1.5 mt-2">
                  <TPill t={cls.type} lang={lang}/>
                </div>
              </div>
            </div>
            {cls.status==="in-progress"&&(
              <div className="rounded-xl bg-[#ede9fe] border border-[#c4b5fd] p-3 flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5 flex-shrink-0"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#7c3aed] opacity-75"/><span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#7c3aed]"/></span>
                <p className="text-xs font-bold text-[#7c3aed]">{t("Class is currently in progress","الحصة جارية الآن")}</p>
              </div>
            )}
            {cls.status==="missed"&&(
              <div className="rounded-xl bg-[#fee2e2] border border-[#fca5a5] p-3">
                <p className="text-xs font-bold text-[#ef4444]">{t("This class was missed","تم تفويت هذه الحصة")}</p>
                <p className="text-[11px] text-[#ef4444]/80 mt-1">{t("Contact the student to reschedule.","تواصل مع الطالب لإعادة الجدولة.")}</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end px-6 py-4 border-t border-[#F1F5F9] bg-[#FAFBFC]">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm font-semibold border border-[#E2E8F0] text-[#64748b] hover:bg-[#F5F7F9] active:scale-95 transition-all">{t("Close","إغلاق")}</button>
        </div>
      </div>
    </Backdrop>
  );
}

// ═══════════════════════════════════════════════════
// RESCHEDULE MODAL — wide
// ═══════════════════════════════════════════════════
const TIME_SLOTS=["08:00 AM","09:00 AM","10:00 AM","11:00 AM","12:00 PM","01:00 PM","02:00 PM","03:00 PM","04:00 PM","05:00 PM","06:00 PM","07:00 PM"];
function RescheduleModal({cls,lang,isRTL,t,onClose,onConfirm}:{cls:TodayClass;lang:string;isRTL:boolean;t:(a:string,b:string)=>string;onClose:()=>void;onConfirm:()=>void}){
  const [date,setDate]=useState("");
  const [time,setTime]=useState("");
  const [loading,setLoading]=useState(false);
  const [errors,setErrors]=useState<Record<string,string>>({});
  const inp="w-full px-3 py-2.5 text-sm border border-[#E2E8F0] rounded-xl bg-white text-[#1e293b] focus:outline-none focus:border-[#107789] focus:ring-1 focus:ring-[#107789]/20 transition-all";
  const validate=()=>{const e:Record<string,string>={};if(!date)e.date=t("Select a date.","اختر تاريخاً.");if(!time)e.time=t("Select a time.","اختر وقتاً.");setErrors(e);return Object.keys(e).length===0;};
  const handleSave=async()=>{if(!validate())return;setLoading(true);await new Promise(r=>setTimeout(r,1000));setLoading(false);onConfirm();};

  return(
    <Backdrop onClose={onClose}>
      <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-3xl overflow-hidden"
        dir={isRTL?"rtl":"ltr"} style={{maxHeight:"90vh",overflowY:"auto"}}>
        <div className="h-1.5" style={{background:"linear-gradient(90deg,#107789,#E8763A)"}}/>
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#F1F5F9]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EBF5F7] flex items-center justify-center text-[#107789]">{IC.res}</div>
            <div>
              <h2 className="text-base font-black text-[#1e293b]">{t("Reschedule Class","إعادة جدولة الحصة")}</h2>
              <p className="text-xs text-[#94a3b8]">{lang==="ar"?cls.studentAr:cls.student} · {cls.time}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#F5F7F9] text-[#94a3b8] hover:text-[#1e293b] hover:bg-[#E2E8F0] transition-all">{IC.close}</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x divide-[#F1F5F9]">
          <div className="p-6 space-y-4">
            <p className="text-xs font-black text-[#94a3b8] uppercase tracking-widest">{t("New Date","التاريخ الجديد")}</p>
            <input type="date" value={date} onChange={e=>{setDate(e.target.value);setErrors(p=>({...p,date:""}));}} className={inp}/>
            {errors.date&&<p className="text-[11px] text-[#ef4444]">{errors.date}</p>}
            <div className="flex items-start gap-2 text-[11px] text-[#94a3b8] bg-[#F8FAFC] rounded-xl p-3">
              {IC.info}<span>{t("Requests are subject to student and system availability.","الطلبات تخضع لتوافر الطالب والنظام.")}</span>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <p className="text-xs font-black text-[#94a3b8] uppercase tracking-widest">{t("New Time","الوقت الجديد")}</p>
            <div className="grid grid-cols-3 gap-2">
              {TIME_SLOTS.map(ts=>(
                <button key={ts} onClick={()=>{setTime(ts);setErrors(p=>({...p,time:""}));}}
                  className={`py-2 rounded-xl text-xs font-semibold border transition-all active:scale-95 ${time===ts?"border-[#107789] bg-[#EBF5F7] text-[#107789]":"border-[#E2E8F0] text-[#64748b] hover:border-[#107789]/30 hover:bg-[#F8FAFC]"}`}>
                  {ts}
                </button>
              ))}
            </div>
            {errors.time&&<p className="text-[11px] text-[#ef4444]">{errors.time}</p>}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#F1F5F9] bg-white">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm font-semibold border border-[#E2E8F0] text-[#64748b] hover:bg-[#F5F7F9] active:scale-95 transition-all">{t("Cancel","إلغاء")}</button>
          <button onClick={handleSave} disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90 active:scale-[.98] transition-all"
            style={{backgroundColor:loading?"#5FA8B3":"#107789"}}>
            {loading?<>{IC.spinner}{t("Saving…","جارٍ الحفظ…")}</>:<>{IC.ok}{t("Confirm Reschedule","تأكيد إعادة الجدولة")}</>}
          </button>
        </div>
      </div>
    </Backdrop>
  );
}

// ═══════════════════════════════════════════════════
// PAGE
// ═══════════════════════════════════════════════════
export default function TeacherDashboard(){
  const {lang,isRTL,t}=useLanguage();
  const router=useRouter();

  const [detailCls,   setDetailCls]   = useState<TodayClass|null>(null);
  const [reschedCls,  setReschedCls]  = useState<TodayClass|null>(null);
  const [toast,       setToast]       = useState<string|null>(null);
  const [notifOpen,   setNotifOpen]   = useState(false);

  const fire=(msg:string)=>{setToast(msg);setTimeout(()=>setToast(null),3500);};

  const today=new Date().toLocaleDateString(lang==="ar"?"ar-SA":"en-US",{weekday:"long",year:"numeric",month:"long",day:"numeric"});

  const stats=[
    {icon:IC.cal20,  value:String(TODAY_CLASSES.length),                                        label:t("Today's Classes","حصص اليوم"),       bg:"#EBF5F7",color:"#107789",delay:0    },
    {icon:IC.clock,  value:String(UPCOMING.length),                                             label:t("Upcoming Sessions","الجلسات القادمة"),bg:"#ede9fe",color:"#7c3aed",delay:0.06 },
    {icon:IC.check,  value:String(TODAY_CLASSES.filter(c=>c.status==="completed").length),      label:t("Completed Today","مكتملة اليوم"),    bg:"#d1fae5",color:"#059669",delay:0.12 },
    {icon:IC.wallet, value:"$1,240",                                                            label:t("Total Earnings","إجمالي الأرباح"),   bg:"#fef3c7",color:"#d97706",delay:0.18 },
  ];

  const NOTIFS=[
    {id:"n1",en:"Omar Khalid joined the trial class",ar:"عمر خالد انضم للحصة التجريبية",time:"5m",read:false},
    {id:"n2",en:"Lina Hassan rescheduled her session",ar:"لينا حسن أعادت جدولة جلستها",time:"1h",read:false},
    {id:"n3",en:"You have a new evaluation to submit",ar:"لديك تقييم جديد للتسليم",time:"2h",read:true},
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

        {/* ── Header ── */}
        <div className="flex flex-wrap items-start justify-between gap-3" style={{animation:"fadeIn .4s ease both"}}>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[#1e293b] tracking-tight">{t("Teacher Dashboard","لوحة تحكم المعلم")}</h1>
            <p className="mt-1 text-xs sm:text-sm text-[#94a3b8]">{today}</p>
          </div>
          <div className="flex items-center gap-2">
            {/* Bell */}
            <div className="relative">
              <button onClick={()=>setNotifOpen(p=>!p)}
                className="relative w-10 h-10 rounded-xl bg-white border border-[#F1F5F9] shadow-sm flex items-center justify-center text-[#64748b] hover:text-[#107789] hover:border-[#b2dce4] hover:shadow-md active:scale-95 transition-all">
                {IC.bell}
                <span className="absolute top-1.5 end-1.5 w-2 h-2 rounded-full bg-[#ef4444] animate-pulse"/>
              </button>
              {notifOpen&&(
                <div className="absolute top-[calc(100%+8px)] end-0 z-50 w-72 sm:w-80 rounded-2xl bg-white border border-[#F1F5F9] shadow-[0_20px_48px_rgba(15,23,42,0.13)] overflow-hidden"
                  style={{animation:"cardIn .2s cubic-bezier(.34,1.56,.64,1) both"}}>
                  <div className="flex items-center justify-between px-4 py-3 border-b border-[#F1F5F9]">
                    <span className="text-sm font-bold text-[#1e293b]">{t("Notifications","الإشعارات")}</span>
                    <button onClick={()=>setNotifOpen(false)} className="text-[#94a3b8] hover:text-[#1e293b]">{IC.close}</button>
                  </div>
                  <div className="divide-y divide-[#F8FAFC]">
                    {NOTIFS.map(n=>(
                      <div key={n.id} className={`flex items-start gap-3 px-4 py-3 ${n.read?"":"bg-[#F8FDFF]"}`}>
                        <span className="mt-1.5 h-2 w-2 rounded-full flex-shrink-0" style={{backgroundColor:n.read?"#CBD5E1":"#107789"}}/>
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs ${n.read?"text-[#64748b]":"font-semibold text-[#1e293b]"}`}>{lang==="ar"?n.ar:n.en}</p>
                          <p className="text-[10px] text-[#94a3b8] mt-0.5">{n.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {/* Schedule button — wired */}
            <button onClick={()=>router.push("/teacher/classes")}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2.5 rounded-xl text-sm font-semibold text-white hover:opacity-90 active:scale-95 transition-all shadow-sm"
              style={{backgroundColor:"#107789",animation:"cardIn .4s .05s both"}}>
              {IC.cal}
              <span className="hidden xs:inline sm:inline">{t("View Schedule","عرض الجدول")}</span>
              <span className="xs:hidden">{t("Schedule","الجدول")}</span>
            </button>
          </div>
        </div>

        {/* ── Stats ── */}
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
              </div>
            </div>
          ))}
        </div>

        {/* ── Main grid ── */}
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">

          {/* Today's Classes */}
          <div className="xl:col-span-2 rounded-2xl bg-white border border-[#F1F5F9] shadow-sm overflow-hidden hover:shadow-md transition-all duration-300"
            style={{animation:"cardIn .45s .22s cubic-bezier(.34,1.2,.64,1) both"}}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#F1F5F9]">
              <div>
                <h2 className="text-sm font-bold text-[#1e293b]">{t("Today's Classes","حصص اليوم")}</h2>
                <p className="text-xs text-[#94a3b8] mt-0.5">{TODAY_CLASSES.length} {t("classes scheduled","حصة مجدولة")}</p>
              </div>
              <button onClick={()=>router.push("/teacher/classes")} className="text-xs font-semibold text-[#107789] hover:underline active:opacity-70">{t("See All","عرض الكل")}</button>
            </div>

            {/* Mobile card list */}
            <div className="sm:hidden divide-y divide-[#F8FAFC]">
              {TODAY_CLASSES.map((cls,i)=>(
                <div key={cls.id} className="flex items-center gap-3 px-4 py-3.5 hover:bg-[#F8FAFC] transition-colors"
                  style={{animation:`slideUp .3s ${0.28+i*.06}s ease both`}}>
                  <Av i={cls.avatar} size="sm"/>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-[#1e293b] truncate">{lang==="ar"?cls.studentAr:cls.student}</p>
                    <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                      <span className="text-[10px] text-[#94a3b8]">{cls.time}</span>
                      <SPill s={cls.status} lang={lang}/>
                    </div>
                  </div>
                  <div className="flex gap-1.5 flex-shrink-0">
                    {(cls.status==="upcoming"||cls.status==="in-progress")&&(
                      <button onClick={()=>router.push("/class/live")}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[10px] font-bold text-white active:scale-95 transition-all"
                        style={{backgroundColor:cls.status==="in-progress"?"#7c3aed":"#107789"}}>
                        {IC.play}{t("Start","ابدأ")}
                      </button>
                    )}
                    <button onClick={()=>setDetailCls(cls)}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[10px] font-semibold border border-[#E2E8F0] text-[#64748b] hover:bg-[#F1F5F9] active:scale-95 transition-all">
                      {IC.eye}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm" style={{borderCollapse:"collapse"}}>
                <thead>
                  <tr style={{backgroundColor:"#F8FAFC"}}>
                    {[{en:"Time",ar:"الوقت"},{en:"Student",ar:"الطالب"},{en:"Level",ar:"المستوى"},{en:"Type",ar:"النوع"},{en:"Status",ar:"الحالة"},{en:"Actions",ar:"الإجراءات"}].map(col=>(
                      <th key={col.en} className="px-4 py-3 text-start text-xs font-semibold uppercase tracking-wide text-[#94a3b8] whitespace-nowrap border-b border-[#F1F5F9]">
                        {lang==="ar"?col.ar:col.en}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {TODAY_CLASSES.map((cls,i)=>(
                    <tr key={cls.id} className="hover:bg-[#F8FAFC] transition-colors border-b border-[#F1F5F9] last:border-0"
                      style={{animation:`slideUp .3s ${0.28+i*.06}s ease both`}}>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className="text-xs font-bold text-[#1e293b]">{cls.time}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <Av i={cls.avatar} size="sm"/>
                          <span className="text-xs font-semibold text-[#1e293b] whitespace-nowrap">{lang==="ar"?cls.studentAr:cls.student}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-xs text-[#64748b] whitespace-nowrap">{cls.level}</td>
                      <td className="px-4 py-3.5"><TPill t={cls.type} lang={lang}/></td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <SPill s={cls.status} lang={lang}/>
                          {cls.status==="in-progress"&&<span className="text-[10px] font-black text-[#7c3aed] uppercase">{t("LIVE","مباشر")}</span>}
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5">
                          {(cls.status==="upcoming"||cls.status==="in-progress")&&(
                            <button onClick={()=>router.push("/class/live")}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-[11px] font-bold text-white hover:opacity-90 active:scale-95 transition-all whitespace-nowrap"
                              style={{backgroundColor:cls.status==="in-progress"?"#7c3aed":"#107789"}}>
                              {IC.play}{t("Start Class","ابدأ")}
                            </button>
                          )}
                          <button onClick={()=>setDetailCls(cls)}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-[11px] font-semibold border border-[#E2E8F0] text-[#64748b] hover:bg-[#F1F5F9] active:scale-95 transition-all whitespace-nowrap">
                            {IC.eye}{t("Details","التفاصيل")}
                          </button>
                          {cls.status==="upcoming"&&(
                            <button onClick={()=>setReschedCls(cls)}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-[11px] font-semibold border border-[#E2E8F0] text-[#64748b] hover:bg-[#F1F5F9] active:scale-95 transition-all whitespace-nowrap">
                              {IC.res}{t("Reschedule","إعادة جدولة")}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-5">
            {/* Quick Overview */}
            <div className="rounded-2xl bg-white border border-[#F1F5F9] shadow-sm p-5 space-y-4 hover:shadow-md hover:border-[#b2dce4] transition-all duration-300"
              style={{animation:"cardIn .45s .28s cubic-bezier(.34,1.2,.64,1) both"}}>
              <div>
                <h2 className="text-sm font-bold text-[#1e293b]">{t("Quick Overview","نظرة سريعة")}</h2>
                <p className="text-xs text-[#94a3b8] mt-0.5">{t("Your performance metrics","مؤشرات أدائك")}</p>
              </div>
              {METRICS.map((m,i)=>(
                <div key={m.labelEn} style={{animation:`slideUp .3s ${0.32+i*.08}s ease both`}}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs font-medium text-[#64748b]">{lang==="ar"?m.labelAr:m.labelEn}</span>
                    <span className="text-xs font-bold" style={{color:m.color}}>{m.value}%</span>
                  </div>
                  <PBar val={m.value} color={m.color} delay={0.4+i*.15}/>
                </div>
              ))}
              <div className="rounded-xl border border-[#fee2e2] bg-[#fff5f5] p-3 mt-1" style={{animation:"fadeIn .5s .6s both"}}>
                <p className="text-[11px] font-bold text-[#ef4444] mb-1">{t("Absences & Penalties","الغيابات والخصومات")}</p>
                {[{labelEn:"Total absences",labelAr:"إجمالي الغيابات",val:"2",color:"#ef4444"},{labelEn:"Sessions deducted",labelAr:"حصص مخصومة",val:"4",color:"#d97706"}].map(r=>(
                  <div key={r.labelEn} className="flex items-center justify-between text-xs text-[#64748b] mt-1">
                    <span>{lang==="ar"?r.labelAr:r.labelEn}</span>
                    <span className="font-bold" style={{color:r.color}}>{r.val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Earnings */}
            <div className="rounded-2xl bg-white border border-[#F1F5F9] shadow-sm p-5 space-y-3 hover:shadow-md hover:border-[#b2dce4] transition-all duration-300"
              style={{animation:"cardIn .45s .34s cubic-bezier(.34,1.2,.64,1) both"}}>
              <h2 className="text-sm font-bold text-[#1e293b]">{t("Earnings Summary","ملخص الأرباح")}</h2>
              {[
                {en:"This Month",    ar:"هذا الشهر",    val:"$1,240",color:"#107789"},
                {en:"Last Month",    ar:"الشهر الماضي", val:"$980",  color:"#64748b"},
                {en:"Pending Payout",ar:"دفعة معلقة",  val:"$320",  color:"#d97706"},
              ].map((r,i)=>(
                <div key={r.en} className="flex justify-between items-center py-1.5 border-b border-[#F1F5F9] last:border-0"
                  style={{animation:`slideUp .3s ${0.4+i*.08}s ease both`}}>
                  <span className="text-xs text-[#64748b]">{lang==="ar"?r.ar:r.en}</span>
                  <span className="text-sm font-bold" style={{color:r.color}}>{r.val}</span>
                </div>
              ))}
              {/* WIRED: wallet button */}
              <button onClick={()=>router.push("/teacher/wallet")}
                className="w-full py-2.5 rounded-xl text-xs font-semibold text-[#107789] border border-[#107789]/30 hover:bg-[#EBF5F7] hover:shadow-sm active:scale-95 transition-all"
                style={{animation:"fadeIn .4s .65s both"}}>
                {t("View Wallet","عرض المحفظة")} {IC.arrow}
              </button>
            </div>
          </div>
        </div>

        {/* ── Bottom row ── */}
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">

          {/* Upcoming Sessions */}
          <div className="rounded-2xl bg-white border border-[#F1F5F9] shadow-sm overflow-hidden hover:shadow-md hover:border-[#b2dce4] transition-all duration-300"
            style={{animation:"cardIn .45s .38s cubic-bezier(.34,1.2,.64,1) both"}}>
            <div className="px-5 py-4 border-b border-[#F1F5F9]">
              <h2 className="text-sm font-bold text-[#1e293b]">{t("Upcoming Sessions","الجلسات القادمة")}</h2>
              <p className="text-xs text-[#94a3b8] mt-0.5">{t("Next scheduled classes","الحصص المجدولة التالية")}</p>
            </div>
            <div className="divide-y divide-[#F1F5F9]">
              {UPCOMING.map((s,i)=>(
                <div key={s.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-[#F8FAFC] transition-colors"
                  style={{animation:`slideUp .3s ${0.44+i*.07}s ease both`}}>
                  <Av i={s.avatar} size="sm"/>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-[#1e293b] truncate">{lang==="ar"?s.studentAr:s.student}</p>
                    <p className="text-[10px] text-[#94a3b8] mt-0.5">{lang==="ar"?s.dateAr:s.date} · {s.time}</p>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <TPill t={s.type} lang={lang}/>
                    {/* WIRED: Start button */}
                    <button onClick={()=>router.push("/class/live")}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-[11px] font-bold text-white hover:opacity-90 active:scale-95 transition-all"
                      style={{backgroundColor:"#107789"}}>
                      {IC.play}{t("Start","ابدأ")}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="rounded-2xl bg-white border border-[#F1F5F9] shadow-sm overflow-hidden hover:shadow-md hover:border-[#b2dce4] transition-all duration-300"
            style={{animation:"cardIn .45s .44s cubic-bezier(.34,1.2,.64,1) both"}}>
            <div className="px-5 py-4 border-b border-[#F1F5F9]">
              <h2 className="text-sm font-bold text-[#1e293b]">{t("Recent Activity","النشاط الأخير")}</h2>
              <p className="text-xs text-[#94a3b8] mt-0.5">{t("Latest events and updates","أحدث الأحداث والتحديثات")}</p>
            </div>
            <div className="divide-y divide-[#F1F5F9]">
              {ACTIVITIES.map((a,i)=>(
                <div key={a.id} className="flex items-start gap-3 px-5 py-3.5 hover:bg-[#F8FAFC] transition-colors"
                  style={{animation:`slideUp .3s ${0.5+i*.06}s ease both`}}>
                  <span className="mt-2 w-2 h-2 rounded-full flex-shrink-0 self-start" style={{backgroundColor:a.color}}/>
                  <Av i={a.avatar} size="sm"/>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-[#1e293b]">
                      <span className="font-semibold">{lang==="ar"?a.actorAr:a.actor}</span>{" "}
                      <span className="text-[#64748b]">{lang==="ar"?a.actionAr:a.actionEn}</span>
                    </p>
                    <p className="text-[10px] text-[#94a3b8] mt-0.5">{lang==="ar"?a.timeAr:a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </main>

      {/* Modals */}
      {detailCls&&(
        <ClassDetailModal cls={detailCls} lang={lang} isRTL={isRTL} t={t}
          onClose={()=>setDetailCls(null)}
          onStart={()=>router.push("/class/live")}
          onReschedule={()=>{setDetailCls(null);setReschedCls(detailCls);}}
          onMarkMiss={()=>fire(t(`${detailCls.student} marked as missed.`,`${detailCls.studentAr} مُصنّفة كفائتة.`))}/>
      )}
      {reschedCls&&(
        <RescheduleModal cls={reschedCls} lang={lang} isRTL={isRTL} t={t}
          onClose={()=>setReschedCls(null)}
          onConfirm={()=>{setReschedCls(null);fire(t("Class rescheduled successfully!","تم إعادة جدولة الحصة بنجاح!"));}}/>
      )}
      {toast&&<Toast msg={toast} onClose={()=>setToast(null)}/>}
    </>
  );
}