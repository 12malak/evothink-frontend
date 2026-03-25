"use client";

import { useState } from "react";
import { useLanguage } from "@/src/contexts/LanguageContext";

// ─── Types ────────────────────────────────────────────────────
type TrialStatus = "scheduled" | "live" | "completed" | "cancelled" | "no_show";
type EvalStatus  = "pending" | "submitted" | "not_required";
type FilterTab   = "all" | TrialStatus;

interface Trial {
  id:           string;
  leadName:     string;
  leadNameAr:   string;
  leadPhone:    string;
  leadEmail:    string;
  teacher:      string;
  teacherAr:    string;
  teacherAvatar:string;
  date:         string;
  dateAr:       string;
  time:         string;
  duration:     string;
  subject:      string;
  subjectAr:    string;
  status:       TrialStatus;
  evalStatus:   EvalStatus;
  evalScore:    number | null;
  agent:        string;
  agentAr:      string;
  agentAvatar:  string;
  notes:        string;
  notesAr:      string;
  outcome:      string;
  outcomeAr:    string;
}

// ─── Mock data ────────────────────────────────────────────────
const TRIALS: Trial[] = [
  { id:"T001", leadName:"Ahmad Hassan",      leadNameAr:"أحمد حسن",       leadPhone:"+962 79 123 4567", leadEmail:"ahmad.h@email.com",  teacher:"Mr. Ahmad Nasser",  teacherAr:"أ. أحمد الناصر",  teacherAvatar:"AN", date:"Today",      dateAr:"اليوم",      time:"02:00 PM", duration:"45 min", subject:"English Speaking",  subjectAr:"محادثة إنجليزية",  status:"live",      evalStatus:"pending",       evalScore:null, agent:"Nour Al-Khalil",  agentAr:"نور الخليل",  agentAvatar:"NK", notes:"Interested in IELTS", notesAr:"مهتم بـ IELTS",   outcome:"",    outcomeAr:"" },
  { id:"T002", leadName:"Lina Al-Hajj",      leadNameAr:"لينا الحاج",      leadPhone:"+962 77 234 5678", leadEmail:"lina.h@email.com",   teacher:"Ms. Nora Khalil",   teacherAr:"أ. نورا خليل",    teacherAvatar:"NK", date:"Today",      dateAr:"اليوم",      time:"04:30 PM", duration:"45 min", subject:"Grammar & Writing",  subjectAr:"قواعد وكتابة",    status:"scheduled", evalStatus:"not_required",  evalScore:null, agent:"Fares Mansoor",   agentAr:"فارس منصور", agentAvatar:"FM", notes:"B1 level student",   notesAr:"مستوى B1",        outcome:"",    outcomeAr:"" },
  { id:"T003", leadName:"Khalid Nabulsi",    leadNameAr:"خالد النابلسي",   leadPhone:"+962 78 345 6789", leadEmail:"khalid.n@email.com",  teacher:"Dr. Samir Yousef",  teacherAr:"د. سمير يوسف",   teacherAvatar:"SY", date:"Tomorrow",   dateAr:"غداً",       time:"10:00 AM", duration:"45 min", subject:"IELTS Preparation",  subjectAr:"تحضير IELTS",     status:"scheduled", evalStatus:"not_required",  evalScore:null, agent:"Dana Rashid",     agentAr:"دانا راشد",   agentAvatar:"DR", notes:"Wants 7.5 band",    notesAr:"يريد 7.5",        outcome:"",    outcomeAr:"" },
  { id:"T004", leadName:"Reem Barakat",      leadNameAr:"ريم بركات",       leadPhone:"+962 79 456 7890", leadEmail:"reem.b@email.com",    teacher:"Mr. Ahmad Nasser",  teacherAr:"أ. أحمد الناصر",  teacherAvatar:"AN", date:"Mar 20, 2025",dateAr:"20 مارس",   time:"11:00 AM", duration:"45 min", subject:"English Speaking",  subjectAr:"محادثة إنجليزية",  status:"completed", evalStatus:"submitted",     evalScore:9,    agent:"Nour Al-Khalil",  agentAr:"نور الخليل",  agentAvatar:"NK", notes:"",               notesAr:"",                outcome:"Converted — Standard plan",outcomeAr:"تحوّلت — الباقة القياسية" },
  { id:"T005", leadName:"Omar Suleiman",     leadNameAr:"عمر سليمان",      leadPhone:"+962 77 567 8901", leadEmail:"omar.s@email.com",    teacher:"Ms. Nora Khalil",   teacherAr:"أ. نورا خليل",    teacherAvatar:"NK", date:"Mar 19, 2025",dateAr:"19 مارس",   time:"03:00 PM", duration:"45 min", subject:"Business English",  subjectAr:"إنجليزية الأعمال", status:"completed", evalStatus:"submitted",     evalScore:7,    agent:"Sami Al-Zoubi",   agentAr:"سامي الزعبي", agentAvatar:"SZ", notes:"",               notesAr:"",                outcome:"Follow-up needed",outcomeAr:"يحتاج متابعة" },
  { id:"T006", leadName:"Sara Al-Mansour",   leadNameAr:"سارة المنصور",    leadPhone:"+962 78 678 9012", leadEmail:"sara.m@email.com",    teacher:"Dr. Samir Yousef",  teacherAr:"د. سمير يوسف",   teacherAvatar:"SY", date:"Mar 14, 2025",dateAr:"14 مارس",   time:"10:00 AM", duration:"45 min", subject:"IELTS Preparation",  subjectAr:"تحضير IELTS",     status:"no_show",   evalStatus:"not_required",  evalScore:null, agent:"Fares Mansoor",   agentAr:"فارس منصور", agentAvatar:"FM", notes:"No show — reschedule",notesAr:"لم تحضر — أعد الجدولة",outcome:"No show",outcomeAr:"غياب" },
  { id:"T007", leadName:"Dina Yousef",       leadNameAr:"دينا يوسف",       leadPhone:"+962 79 789 0123", leadEmail:"dina.y@email.com",    teacher:"Mr. Ahmad Nasser",  teacherAr:"أ. أحمد الناصر",  teacherAvatar:"AN", date:"Mar 12, 2025",dateAr:"12 مارس",   time:"02:00 PM", duration:"45 min", subject:"English Speaking",  subjectAr:"محادثة إنجليزية",  status:"cancelled", evalStatus:"not_required",  evalScore:null, agent:"Dana Rashid",     agentAr:"دانا راشد",   agentAvatar:"DR", notes:"Cancelled — reschedule",notesAr:"ألغيت — أعد الجدولة",outcome:"Cancelled",outcomeAr:"ألغيت" },
];

// ─── Status configs ───────────────────────────────────────────
const TS: Record<TrialStatus,{bg:string;text:string;border:string;dot:string;en:string;ar:string}> = {
  scheduled:  {bg:"#EBF5F7",text:"#107789",border:"#b2dce4",dot:"#107789",en:"Scheduled",  ar:"مجدولة"},
  live:       {bg:"#fee2e2",text:"#ef4444",border:"#fca5a5",dot:"#ef4444",en:"Live Now",    ar:"مباشر الآن"},
  completed:  {bg:"#d1fae5",text:"#059669",border:"#6ee7b7",dot:"#059669",en:"Completed",   ar:"مكتملة"},
  cancelled:  {bg:"#f1f5f9",text:"#64748b",border:"#e2e8f0",dot:"#94a3b8",en:"Cancelled",   ar:"ملغاة"},
  no_show:    {bg:"#fef3c7",text:"#d97706",border:"#fde68a",dot:"#d97706",en:"No Show",     ar:"غياب"},
};

const ES: Record<EvalStatus,{bg:string;text:string;en:string;ar:string}> = {
  pending:      {bg:"#fef3c7",text:"#d97706",en:"Pending",      ar:"معلقة"},
  submitted:    {bg:"#d1fae5",text:"#059669",en:"Submitted",    ar:"مُرسلة"},
  not_required: {bg:"#f1f5f9",text:"#94a3b8",en:"N/A",          ar:"لا ينطبق"},
};

// ─── Avatar ───────────────────────────────────────────────────
const AVT=[{bg:"#EBF5F7",text:"#107789"},{bg:"#ede9fe",text:"#7c3aed"},{bg:"#d1fae5",text:"#059669"},{bg:"#fef3c7",text:"#d97706"},{bg:"#fee2e2",text:"#ef4444"},{bg:"#e0f2fe",text:"#0369a1"}];
const avt=(s:string)=>AVT[(s.charCodeAt(0)+(s.charCodeAt(1)||0))%AVT.length];
function Av({i,size="md"}:{i:string;size?:"sm"|"md"|"lg"}){
  const c=avt(i); const d={sm:"w-7 h-7 text-[10px]",md:"w-9 h-9 text-xs",lg:"w-12 h-12 text-sm"}[size];
  return <div className={`${d} rounded-full flex items-center justify-center font-bold flex-shrink-0 select-none`} style={{backgroundColor:c.bg,color:c.text}}>{i}</div>;
}

// ─── Icons ────────────────────────────────────────────────────
const IC={
  close:   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  ok:      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>,
  search:  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  clock:   <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  phone:   <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.11 9a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3 .27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
  mail:    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  star:    (f:boolean)=><svg width="16" height="16" viewBox="0 0 24 24" fill={f?"#d97706":"none"} stroke="#d97706" strokeWidth="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  note:    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
  pay:     <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
  spinner: <svg className="animate-spin" width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="white" strokeWidth="2" strokeOpacity="0.3"/><path d="M7 1.5a5.5 5.5 0 015.5 5.5" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>,
};

// ─── Backdrop ─────────────────────────────────────────────────
function Backdrop({onClose,children}:{onClose:()=>void;children:React.ReactNode}){
  return(
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6"
      style={{backgroundColor:"rgba(11,44,51,.48)",backdropFilter:"blur(4px)"}}
      onClick={onClose}>
      <div className="w-full sm:w-auto sm:min-w-[660px]" onClick={e=>e.stopPropagation()}
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
// TRIAL DETAIL MODAL — wide 2-column
// ═══════════════════════════════════════════════════
function TrialDetailModal({trial,lang,isRTL,t,onClose,onSubmitEval,onSendPayment}:{
  trial:Trial; lang:string; isRTL:boolean;
  t:(a:string,b:string)=>string;
  onClose:()=>void;
  onSubmitEval:(score:number,notes:string)=>void;
  onSendPayment:()=>void;
}){
  const [evalMode,  setEvalMode]  = useState(false);
  const [evalScore, setEvalScore] = useState(trial.evalScore||8);
  const [evalNotes, setEvalNotes] = useState("");
  const [loading,   setLoading]   = useState(false);
  const tc=TS[trial.status]; const ec=ES[trial.evalStatus];
  const inp="w-full px-3 py-2.5 text-sm border border-[#E2E8F0] rounded-xl bg-white text-[#1e293b] placeholder:text-[#C4CAD4] focus:outline-none focus:border-[#107789] focus:ring-1 focus:ring-[#107789]/20 transition-all";

  const handleEval=async()=>{
    setLoading(true); await new Promise(r=>setTimeout(r,1200));
    setLoading(false); onSubmitEval(evalScore,evalNotes);
  };

  return(
    <Backdrop onClose={onClose}>
      <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-4xl overflow-hidden"
        dir={isRTL?"rtl":"ltr"} style={{maxHeight:"91vh",overflowY:"auto"}}>
        <div className="h-1.5" style={{background:`linear-gradient(90deg,${tc.dot},#E8763A,transparent)`}}/>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#F1F5F9]">
          <div className="flex items-center gap-3">
            <Av i={trial.teacherAvatar} size="md"/>
            <div>
              <h2 className="text-base font-black text-[#1e293b]">{t("Trial Session","الجلسة التجريبية")} — {trial.id}</h2>
              <p className="text-xs text-[#94a3b8] mt-0.5">{lang==="ar"?trial.leadNameAr:trial.leadName} · {lang==="ar"?trial.subjectAr:trial.subject}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#F5F7F9] text-[#94a3b8] hover:text-[#1e293b] hover:bg-[#E2E8F0] transition-all">{IC.close}</button>
        </div>

        {/* 2-column body */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x divide-[#F1F5F9]">

          {/* LEFT: Session info */}
          <div className="p-6 space-y-5">
            <p className="text-xs font-black text-[#94a3b8] uppercase tracking-widest">{t("Session Details","تفاصيل الجلسة")}</p>

            {/* Status + eval badges */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold"
                style={{backgroundColor:tc.bg,color:tc.text,border:`1px solid ${tc.border}`}}>
                <span className={`w-2 h-2 rounded-full ${trial.status==="live"?"animate-pulse":""}`} style={{backgroundColor:tc.dot}}/>
                {lang==="ar"?tc.ar:tc.en}
              </span>
              <span className="inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold"
                style={{backgroundColor:ec.bg,color:ec.text}}>
                {t("Eval:","التقييم:")} {lang==="ar"?ec.ar:ec.en}
              </span>
            </div>

            {/* Info tiles 2x2 */}
            <div className="grid grid-cols-2 gap-3">
              {[
                {lbl:t("Date","التاريخ"),     val:lang==="ar"?trial.dateAr:trial.date, icon:"📅"},
                {lbl:t("Time","الوقت"),       val:trial.time,                          icon:"🕐"},
                {lbl:t("Duration","المدة"),   val:trial.duration,                      icon:"⏱"},
                {lbl:t("Subject","المادة"),   val:lang==="ar"?trial.subjectAr:trial.subject, icon:"📚"},
              ].map(r=>(
                <div key={r.lbl} className="rounded-xl bg-[#F8FAFC] border border-[#F1F5F9] p-3">
                  <p className="text-lg mb-1">{r.icon}</p>
                  <p className="text-[10px] text-[#94a3b8] font-semibold uppercase tracking-wide">{r.lbl}</p>
                  <p className="text-xs font-bold text-[#1e293b] mt-0.5">{r.val}</p>
                </div>
              ))}
            </div>

            {/* Lead contact */}
            <div className="rounded-2xl border border-[#F1F5F9] overflow-hidden">
              <div className="px-4 py-2.5 bg-[#F8FAFC] border-b border-[#F1F5F9]">
                <p className="text-[10px] font-black text-[#94a3b8] uppercase tracking-wide">{t("Lead Contact","بيانات العميل")}</p>
              </div>
              {[
                {icon:IC.phone, label:t("Phone","الهاتف"), val:trial.leadPhone},
                {icon:IC.mail,  label:t("Email","البريد"), val:trial.leadEmail},
              ].map((r,i,arr)=>(
                <div key={r.label} className={`flex items-center gap-3 px-4 py-3 ${i<arr.length-1?"border-b border-[#F1F5F9]":""}`}>
                  <span className="text-[#94a3b8]">{r.icon}</span>
                  <div><p className="text-[10px] text-[#94a3b8]">{r.label}</p><p className="text-xs font-semibold text-[#1e293b]">{r.val}</p></div>
                </div>
              ))}
            </div>

            {/* Teacher + Agent */}
            <div className="grid grid-cols-2 gap-3">
              {[
                {lbl:t("Teacher","المعلم"), name:lang==="ar"?trial.teacherAr:trial.teacher, av:trial.teacherAvatar},
                {lbl:t("Agent","الوكيل"),   name:lang==="ar"?trial.agentAr:trial.agent,     av:trial.agentAvatar},
              ].map(r=>(
                <div key={r.lbl} className="rounded-xl bg-[#F8FAFC] border border-[#F1F5F9] p-3">
                  <p className="text-[10px] text-[#94a3b8] font-semibold mb-2">{r.lbl}</p>
                  <div className="flex items-center gap-2"><Av i={r.av} size="sm"/><span className="text-xs font-bold text-[#1e293b] truncate">{r.name}</span></div>
                </div>
              ))}
            </div>

            {/* Outcome */}
            {trial.outcome&&(
              <div className="rounded-xl bg-[#d1fae5] border border-[#6ee7b7] p-3">
                <p className="text-[10px] font-black text-[#059669] mb-1">✅ {t("Outcome","النتيجة")}</p>
                <p className="text-xs text-[#059669] font-semibold">{lang==="ar"?trial.outcomeAr:trial.outcome}</p>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex flex-wrap gap-2 pt-2">
              {trial.status==="completed"&&trial.evalStatus!=="submitted"&&(
                <button onClick={()=>setEvalMode(true)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white hover:opacity-90 active:scale-95 transition-all" style={{backgroundColor:"#107789"}}>
                  {IC.note}{t("Submit Evaluation","تسليم التقييم")}
                </button>
              )}
              <button onClick={onSendPayment}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white hover:opacity-90 active:scale-95 transition-all" style={{backgroundColor:"#7c3aed"}}>
                {IC.pay}{t("Send Payment Link","إرسال رابط دفع")}
              </button>
            </div>
          </div>

          {/* RIGHT: Evaluation + Notes */}
          <div className="p-6 space-y-5">
            <p className="text-xs font-black text-[#94a3b8] uppercase tracking-widest">{t("Evaluation","التقييم")}</p>

            {/* Score display / edit */}
            {trial.evalStatus==="submitted"&&!evalMode?(
              <div className="rounded-2xl bg-[#d1fae5] border border-[#6ee7b7] p-5 text-center space-y-3">
                <p className="text-4xl font-black text-[#059669]">{trial.evalScore}/10</p>
                <div className="flex justify-center">
                  {[1,2,3,4,5].map(n=>(<span key={n}>{IC.star(n*2<=trial.evalScore!)}</span>))}
                </div>
                <p className="text-xs text-[#059669] font-semibold">{t("Evaluation submitted","تم تسليم التقييم")} ✅</p>
              </div>
            ) : evalMode ? (
              <div className="space-y-4" style={{animation:"slideUp .2s ease both"}}>
                <div>
                  <label className="block text-xs font-semibold text-[#64748b] mb-3">{t("Score (1-10)","الدرجة (1-10)")}</label>
                  <div className="flex justify-center gap-2">
                    {[1,2,3,4,5,6,7,8,9,10].map(n=>(
                      <button key={n} onClick={()=>setEvalScore(n)}
                        className="w-9 h-9 rounded-xl text-sm font-black border transition-all active:scale-95"
                        style={evalScore===n?{backgroundColor:"#107789",color:"white",borderColor:"#107789"}:{borderColor:"#E2E8F0",color:"#64748b",backgroundColor:"#F8FAFC"}}>
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#64748b] mb-1.5">{t("Evaluation Notes","ملاحظات التقييم")}</label>
                  <textarea rows={4} value={evalNotes} onChange={e=>setEvalNotes(e.target.value)}
                    placeholder={t("Describe the student's performance, strengths, and areas for improvement…","صف أداء الطالب ونقاط قوته ومجالات التحسين…")}
                    className={`${inp} resize-none`}/>
                </div>
                <button onClick={handleEval} disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90 active:scale-[.98] transition-all"
                  style={{backgroundColor:loading?"#5FA8B3":"#107789"}}>
                  {loading?<>{IC.spinner}{t("Submitting…","جارٍ الإرسال…")}</>:<>{IC.ok}{t("Submit Evaluation","تسليم التقييم")}</>}
                </button>
                <button onClick={()=>setEvalMode(false)} className="w-full text-xs text-[#94a3b8] hover:text-[#64748b] transition-colors">{t("Cancel","إلغاء")}</button>
              </div>
            ) : (
              <div className="rounded-2xl bg-[#F8FAFC] border border-[#F1F5F9] p-5 text-center space-y-2">
                <p className="text-3xl">📋</p>
                <p className="text-sm font-bold text-[#1e293b]">{t("No evaluation yet","لا يوجد تقييم بعد")}</p>
                <p className="text-xs text-[#94a3b8]">{t("Available after session completes","متاح بعد انتهاء الجلسة")}</p>
              </div>
            )}

            {/* Session notes */}
            {(trial.notes||trial.notesAr)&&(
              <div>
                <p className="text-xs font-semibold text-[#64748b] mb-2">{t("Session Notes","ملاحظات الجلسة")}</p>
                <div className="rounded-xl bg-[#FFFBEB] border border-[#FDE68A] p-3">
                  <p className="text-xs text-[#64748b] leading-relaxed">{lang==="ar"?trial.notesAr:trial.notes}</p>
                </div>
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
// TRIAL CARD
// ═══════════════════════════════════════════════════
function TrialCard({trial,idx,lang,t,onView,onSendPayment}:{trial:Trial;idx:number;lang:string;t:(a:string,b:string)=>string;onView:()=>void;onSendPayment:()=>void;}){
  const tc=TS[trial.status]; const ec=ES[trial.evalStatus];
  const isLive=trial.status==="live";
  return(
    <div className="group relative bg-white rounded-2xl border border-[#F1F5F9] overflow-hidden hover:shadow-lg hover:border-[#b2dce4] transition-all duration-300"
      style={{animation:`cardIn .4s ${idx*.07}s cubic-bezier(.34,1.2,.64,1) both`}}>
      <div className="h-1 group-hover:h-1.5 transition-all duration-300" style={{backgroundColor:tc.dot}}/>
      {isLive&&(
        <div className="absolute top-3 end-3 flex items-center gap-1.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-[#ef4444]"/>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#ef4444]"/>
          </span>
          <span className="text-[10px] font-black text-[#ef4444] uppercase">{t("LIVE","مباشر")}</span>
        </div>
      )}

      <div className="p-5 space-y-4">
        {/* Lead + Status */}
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-black text-white flex-shrink-0`}
            style={{backgroundColor:avt(trial.leadName.slice(0,2)).bg,color:avt(trial.leadName.slice(0,2)).text}}>
            {trial.leadName.slice(0,2).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-black text-[#1e293b] truncate">{lang==="ar"?trial.leadNameAr:trial.leadName}</p>
            <p className="text-xs text-[#94a3b8] truncate">{lang==="ar"?trial.subjectAr:trial.subject}</p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold whitespace-nowrap flex-shrink-0"
            style={{backgroundColor:tc.bg,color:tc.text,border:`1px solid ${tc.border}`}}>
            <span className="w-1.5 h-1.5 rounded-full" style={{backgroundColor:tc.dot}}/>
            {lang==="ar"?tc.ar:tc.en}
          </span>
        </div>

        {/* Date/time/teacher */}
        <div className="grid grid-cols-2 gap-2 text-xs text-[#64748b]">
          <div className="flex items-center gap-1.5">{IC.clock}<span className="truncate">{lang==="ar"?trial.dateAr:trial.date} · {trial.time}</span></div>
          <div className="flex items-center gap-1.5"><Av i={trial.teacherAvatar} size="sm"/><span className="truncate text-[11px]">{lang==="ar"?trial.teacherAr:trial.teacher}</span></div>
        </div>

        {/* Eval badge + score */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full" style={{backgroundColor:ec.bg,color:ec.text}}>
            {t("Eval","التقييم")}: {lang==="ar"?ec.ar:ec.en}
          </span>
          {trial.evalScore&&(
            <span className="flex items-center gap-1 text-[10px] font-black text-[#d97706]">
              {[1,2,3,4,5].map(n=>(<span key={n} style={{opacity:n*2<=trial.evalScore!?1:0.3}}>⭐</span>))}
              {trial.evalScore}/10
            </span>
          )}
          {trial.outcome&&(
            <span className="text-[10px] text-[#059669] font-semibold truncate">{lang==="ar"?trial.outcomeAr:trial.outcome}</span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-2 border-t border-[#F8FAFC]">
          <button onClick={onView}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold border border-[#E2E8F0] text-[#107789] hover:bg-[#EBF5F7] active:scale-95 transition-all">
            {IC.note}{t("View Details","عرض التفاصيل")}
          </button>
          {(trial.status==="completed"||trial.status==="scheduled")&&(
            <button onClick={onSendPayment}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold text-white hover:opacity-90 active:scale-95 transition-all"
              style={{backgroundColor:"#7c3aed"}}>
              {IC.pay}{t("Send Payment","إرسال رابط")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// PAGE
// ═══════════════════════════════════════════════════
export default function TrialsPage(){
  const {lang,isRTL,t}=useLanguage();

  const [trials,    setTrials]    = useState<Trial[]>(TRIALS);
  const [filter,    setFilter]    = useState<FilterTab>("all");
  const [search,    setSearch]    = useState("");
  const [viewTrial, setViewTrial] = useState<Trial|null>(null);
  const [toast,     setToast]     = useState<string|null>(null);

  const fire=(msg:string)=>{setToast(msg);setTimeout(()=>setToast(null),3500);};

  const filtered=trials.filter(tr=>{
    const q=search.toLowerCase();
    const matchS=!q||tr.leadName.toLowerCase().includes(q)||tr.leadNameAr.includes(q)||tr.teacher.toLowerCase().includes(q);
    const matchF=filter==="all"||tr.status===filter;
    return matchS&&matchF;
  });

  const TABS: [FilterTab,string,string][]=[
    ["all",t("All","الكل"),t("All","الكل")],
    ["live",t("Live","مباشر"),t("Live","مباشر")],
    ["scheduled",t("Scheduled","مجدولة"),t("Scheduled","مجدولة")],
    ["completed",t("Completed","مكتملة"),t("Completed","مكتملة")],
    ["no_show",t("No Show","غياب"),t("No Show","غياب")],
    ["cancelled",t("Cancelled","ملغاة"),t("Cancelled","ملغاة")],
  ];

  const counts=TABS.reduce((acc,[key])=>{
    acc[key]=key==="all"?trials.length:trials.filter(tr=>tr.status===key).length; return acc;
  },{} as Record<string,number>);

  const stats=[
    {icon:"📅", val:trials.filter(t=>t.status==="scheduled"||t.status==="live").length, label:t("Upcoming","القادمة"),   color:"#107789",bg:"#EBF5F7"},
    {icon:"🎯", val:trials.filter(t=>t.status==="completed").length,                    label:t("Completed","مكتملة"),   color:"#059669",bg:"#d1fae5"},
    {icon:"📋", val:trials.filter(t=>t.evalStatus==="pending").length,                  label:t("Evals Pending","تقييم معلق"),color:"#d97706",bg:"#fef3c7"},
    {icon:"✅", val:trials.filter(t=>t.evalStatus==="submitted").length,                label:t("Evals Done","تقييم مكتمل"),color:"#059669",bg:"#d1fae5"},
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
            <h1 className="text-xl sm:text-2xl font-black text-[#1e293b] tracking-tight">{t("Trial Management","إدارة الحصص التجريبية")}</h1>
            <p className="mt-1 text-xs sm:text-sm text-[#94a3b8]">{t("Schedule, track, and evaluate trial sessions","جدول وتتبع وقيّم الجلسات التجريبية")}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {stats.map((s,i)=>(
            <div key={s.label} className="rounded-2xl bg-white border border-[#F1F5F9] shadow-sm p-4 sm:p-5 flex items-start gap-3 hover:shadow-md hover:border-[#b2dce4] transition-all duration-300"
              style={{animation:`cardIn .45s ${i*.07}s cubic-bezier(.34,1.2,.64,1) both`}}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{backgroundColor:s.bg}}>{s.icon}</div>
              <div className="min-w-0">
                <p className="text-2xl font-black text-[#1e293b] leading-none" style={{color:s.color}}>{s.val}</p>
                <p className="text-xs text-[#94a3b8] mt-1 font-medium">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filters + Search */}
        <div className="flex flex-wrap items-center gap-3" style={{animation:"cardIn .4s .22s both"}}>
          <div className="flex items-center flex-wrap gap-1.5">
            {TABS.map(([key,en])=>(
              <button key={key} onClick={()=>setFilter(key)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all active:scale-95"
                style={filter===key?{backgroundColor:"#107789",color:"white",boxShadow:"0 2px 8px #10778940"}:{backgroundColor:"white",color:"#64748b",border:"1px solid #F1F5F9"}}>
                {en}
                <span className="text-[10px] rounded-full px-1.5 py-0.5 font-black"
                  style={filter===key?{backgroundColor:"rgba(255,255,255,.25)"}:{backgroundColor:"#F1F5F9",color:"#94a3b8"}}>
                  {counts[key]}
                </span>
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-[#F1F5F9] shadow-sm ms-auto" style={{minWidth:200}}>
            {IC.search}
            <input type="text" value={search} onChange={e=>setSearch(e.target.value)}
              placeholder={t("Search trials…","ابحث عن تجربة…")}
              className="flex-1 bg-transparent text-sm text-[#1e293b] placeholder:text-[#C4CAD4] focus:outline-none"/>
            {search&&<button onClick={()=>setSearch("")} className="text-[#94a3b8] hover:text-[#1e293b] text-xs">✕</button>}
          </div>
        </div>

        {/* Empty state */}
        {filtered.length===0&&(
          <div className="bg-white rounded-2xl border border-[#F1F5F9] p-16 text-center" style={{animation:"fadeIn .4s both"}}>
            <p className="text-2xl mb-2">🎯</p>
            <p className="text-base font-bold text-[#1e293b]">{t("No trials found","لا توجد تجارب")}</p>
            <p className="text-sm text-[#94a3b8] mt-1">{t("Try adjusting your filters","جرب تعديل الفلاتر")}</p>
          </div>
        )}

        {/* Trial cards grid */}
        {filtered.length>0&&(
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((tr,i)=>(
              <TrialCard key={tr.id} trial={tr} idx={i} lang={lang} t={t}
                onView={()=>setViewTrial(tr)}
                onSendPayment={()=>fire(t(`Payment link sent to ${tr.leadName}!`,`تم إرسال رابط الدفع لـ ${tr.leadNameAr}!`))}/>
            ))}
          </div>
        )}

      </main>

      {viewTrial&&(
        <TrialDetailModal trial={viewTrial} lang={lang} isRTL={isRTL} t={t}
          onClose={()=>setViewTrial(null)}
          onSubmitEval={(score,notes)=>{
            setTrials(p=>p.map(tr=>tr.id===viewTrial.id?{...tr,evalStatus:"submitted",evalScore:score}:tr));
            setViewTrial(null);
            fire(t("Evaluation submitted!","تم تسليم التقييم!"));
          }}
          onSendPayment={()=>{setViewTrial(null);fire(t(`Payment link sent to ${viewTrial.leadName}!`,`تم إرسال رابط الدفع لـ ${viewTrial.leadNameAr}!`));}}/>
      )}
      {toast&&<Toast msg={toast} onClose={()=>setToast(null)}/>}
    </>
  );
}