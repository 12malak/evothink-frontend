"use client";

import { useState } from "react";
import { useLanguage } from "@/src/contexts/LanguageContext";

// ─── Types ────────────────────────────────────────────────────
type LeadStatus = "new" | "contacted" | "trial_booked" | "converted" | "lost";
type FilterTab  = "all" | LeadStatus;

interface Lead {
  id:          string;
  name:        string;
  nameAr:      string;
  phone:       string;
  email:       string;
  city:        string;
  cityAr:      string;
  source:      string;
  sourceAr:    string;
  status:      LeadStatus;
  agent:       string;
  agentAr:     string;
  agentAvatar: string;
  notes:       string;
  notesAr:     string;
  createdAt:   string;
  activity:    {en:string;ar:string;time:string;timeAr:string;icon:string}[];
  interest:    string;
  interestAr:  string;
}

// ─── Data ─────────────────────────────────────────────────────
const LEADS: Lead[] = [
  {
    id:"L001", name:"Ahmad Hassan",       nameAr:"أحمد حسن",        phone:"+962 79 123 4567", email:"ahmad.h@email.com",  city:"Amman",   cityAr:"عمّان",   source:"Instagram",  sourceAr:"إنستغرام", status:"trial_booked", agent:"Nour Al-Khalil",  agentAr:"نور الخليل",  agentAvatar:"NK", notes:"Interested in IELTS prep, target 7.0",  notesAr:"مهتم بتحضير IELTS، هدفه 7.0",        createdAt:"Mar 20, 2025",
    interest:"IELTS Preparation", interestAr:"تحضير IELTS",
    activity:[{en:"Trial class booked for Mar 24",ar:"حصة تجريبية محجوزة 24 مارس",time:"Today",timeAr:"اليوم",icon:"📅"},{en:"Phone call — very interested",ar:"مكالمة هاتفية — مهتم جداً",time:"Mar 21",timeAr:"21 مارس",icon:"📞"},{en:"Lead added from Instagram",ar:"أضيف من إنستغرام",time:"Mar 20",timeAr:"20 مارس",icon:"👤"}],
  },
  {
    id:"L002", name:"Lina Al-Hajj",       nameAr:"لينا الحاج",       phone:"+962 77 234 5678", email:"lina.h@email.com",   city:"Irbid",   cityAr:"إربد",    source:"Facebook",   sourceAr:"فيسبوك",   status:"contacted",    agent:"Fares Mansoor",   agentAr:"فارس منصور", agentAvatar:"FM", notes:"Looking for adult conversation classes",notesAr:"تبحث عن دروس محادثة للبالغين",        createdAt:"Mar 19, 2025",
    interest:"English Speaking", interestAr:"محادثة إنجليزية",
    activity:[{en:"WhatsApp message sent",ar:"تم إرسال رسالة واتساب",time:"Mar 21",timeAr:"21 مارس",icon:"💬"},{en:"Lead added from Facebook",ar:"أضيف من فيسبوك",time:"Mar 19",timeAr:"19 مارس",icon:"👤"}],
  },
  {
    id:"L003", name:"Khalid Nabulsi",     nameAr:"خالد النابلسي",   phone:"+962 78 345 6789", email:"khalid.n@email.com",  city:"Zarqa",   cityAr:"الزرقاء", source:"Referral",   sourceAr:"إحالة",    status:"new",          agent:"Dana Rashid",     agentAr:"دانا راشد",  agentAvatar:"DR", notes:"Referred by Sara Al-Rashid",            notesAr:"أحاله سارة الراشد",                   createdAt:"Mar 22, 2025",
    interest:"Grammar & Writing", interestAr:"قواعد وكتابة",
    activity:[{en:"Lead added via referral",ar:"أضيف عبر إحالة",time:"Mar 22",timeAr:"22 مارس",icon:"👤"}],
  },
  {
    id:"L004", name:"Reem Barakat",       nameAr:"ريم بركات",        phone:"+962 79 456 7890", email:"reem.b@email.com",    city:"Amman",   cityAr:"عمّان",   source:"Google Ads", sourceAr:"إعلانات قوقل",status:"converted",  agent:"Nour Al-Khalil",  agentAr:"نور الخليل",  agentAvatar:"NK", notes:"Converted to Standard plan",            notesAr:"تحوّلت للباقة القياسية",               createdAt:"Mar 10, 2025",
    interest:"English Speaking", interestAr:"محادثة إنجليزية",
    activity:[{en:"Payment link accepted — Standard plan",ar:"رابط الدفع قُبل — الباقة القياسية",time:"Mar 18",timeAr:"18 مارس",icon:"✅"},{en:"Trial completed — score 9/10",ar:"انتهت التجربة — تقييم 9/10",time:"Mar 15",timeAr:"15 مارس",icon:"🎯"},{en:"Trial booked",ar:"حصة تجريبية محجوزة",time:"Mar 12",timeAr:"12 مارس",icon:"📅"}],
  },
  {
    id:"L005", name:"Omar Suleiman",      nameAr:"عمر سليمان",       phone:"+962 77 567 8901", email:"omar.s@email.com",    city:"Aqaba",   cityAr:"العقبة",  source:"Instagram",  sourceAr:"إنستغرام", status:"new",          agent:"Sami Al-Zoubi",   agentAr:"سامي الزعبي",agentAvatar:"SZ", notes:"Interested in business English",        notesAr:"مهتم بإنجليزية الأعمال",              createdAt:"Mar 22, 2025",
    interest:"Business English", interestAr:"إنجليزية الأعمال",
    activity:[{en:"Lead added from Instagram",ar:"أضيف من إنستغرام",time:"Mar 22",timeAr:"22 مارس",icon:"👤"}],
  },
  {
    id:"L006", name:"Sara Al-Mansour",    nameAr:"سارة المنصور",     phone:"+962 78 678 9012", email:"sara.m@email.com",    city:"Amman",   cityAr:"عمّان",   source:"Website",    sourceAr:"الموقع",   status:"lost",         agent:"Fares Mansoor",   agentAr:"فارس منصور", agentAvatar:"FM", notes:"Not ready — budget constraints",        notesAr:"غير مستعدة — قيود الميزانية",         createdAt:"Mar 5, 2025",
    interest:"IELTS Preparation", interestAr:"تحضير IELTS",
    activity:[{en:"Lead marked as lost — budget issues",ar:"مُصنّف كخسارة — مشاكل الميزانية",time:"Mar 14",timeAr:"14 مارس",icon:"❌"},{en:"2 follow-up calls — no response",ar:"مكالمتان للمتابعة — لا استجابة",time:"Mar 10",timeAr:"10 مارس",icon:"📞"}],
  },
  {
    id:"L007", name:"Dina Yousef",        nameAr:"دينا يوسف",        phone:"+962 79 789 0123", email:"dina.y@email.com",    city:"Irbid",   cityAr:"إربد",    source:"Facebook",   sourceAr:"فيسبوك",   status:"contacted",    agent:"Dana Rashid",     agentAr:"دانا راشد",  agentAvatar:"DR", notes:"Has kids — looking for children package",notesAr:"لديها أطفال — تبحث عن باقة أطفال", createdAt:"Mar 18, 2025",
    interest:"Kids English", interestAr:"إنجليزية الأطفال",
    activity:[{en:"Email sent with package details",ar:"تم إرسال بريد بتفاصيل الباقة",time:"Mar 20",timeAr:"20 مارس",icon:"📧"},{en:"Lead added from Facebook",ar:"أضيف من فيسبوك",time:"Mar 18",timeAr:"18 مارس",icon:"👤"}],
  },
];

// ─── Status config ────────────────────────────────────────────
const ST: Record<LeadStatus,{bg:string;text:string;border:string;dot:string;en:string;ar:string}> = {
  new:          {bg:"#eff6ff",text:"#2563eb",border:"#bfdbfe",dot:"#3b82f6",en:"New",          ar:"جديد"},
  contacted:    {bg:"#fef3c7",text:"#d97706",border:"#fde68a",dot:"#d97706",en:"Contacted",    ar:"تم التواصل"},
  trial_booked: {bg:"#ede9fe",text:"#7c3aed",border:"#c4b5fd",dot:"#7c3aed",en:"Trial Booked", ar:"تجربة محجوزة"},
  converted:    {bg:"#d1fae5",text:"#059669",border:"#6ee7b7",dot:"#059669",en:"Converted",    ar:"تحوّل"},
  lost:         {bg:"#f1f5f9",text:"#64748b",border:"#e2e8f0",dot:"#94a3b8",en:"Lost",         ar:"خسارة"},
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
  close:  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  ok:     <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>,
  search: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  edit:   <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  phone:  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.11 9a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3 .27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
  mail:   <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  trial:  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  pay:    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
  arrow:  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  user:   <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  copy:   <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>,
  spinner:<svg className="animate-spin" width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="white" strokeWidth="2" strokeOpacity="0.3"/><path d="M7 1.5a5.5 5.5 0 015.5 5.5" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>,
  info:   <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
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

// ─── Status pill ──────────────────────────────────────────────
function SPill({s,lang}:{s:LeadStatus;lang:string}){
  const c=ST[s];
  return(
    <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold whitespace-nowrap"
      style={{backgroundColor:c.bg,color:c.text,border:`1px solid ${c.border}`}}>
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{backgroundColor:c.dot}}/>
      {lang==="ar"?c.ar:c.en}
    </span>
  );
}

// ═══════════════════════════════════════════════════
// VIEW/EDIT LEAD MODAL — wide 2-column
// ═══════════════════════════════════════════════════
function LeadModal({lead,lang,isRTL,t,onClose,onSave,onBookTrial,onSendPayment}:{
  lead:Lead; lang:string; isRTL:boolean;
  t:(a:string,b:string)=>string;
  onClose:()=>void;
  onSave:(updated:Lead)=>void;
  onBookTrial:(l:Lead)=>void;
  onSendPayment:(l:Lead)=>void;
}){
  const [editing,setEditing]=useState(false);
  const [form,setForm]=useState(lead);
  const sc=ST[form.status];
  const inp="w-full px-3 py-2 text-sm border border-[#E2E8F0] rounded-xl bg-white text-[#1e293b] placeholder:text-[#C4CAD4] focus:outline-none focus:border-[#107789] focus:ring-1 focus:ring-[#107789]/20 transition-all";

  return(
    <Backdrop onClose={onClose}>
      <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-4xl overflow-hidden"
        dir={isRTL?"rtl":"ltr"} style={{maxHeight:"91vh",overflowY:"auto"}}>
        <div className="h-1.5" style={{background:`linear-gradient(90deg,${sc.dot},#E8763A,transparent)`}}/>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#F1F5F9]">
          <div className="flex items-center gap-3">
            <Av i={lead.name.slice(0,2).toUpperCase()} size="md"/>
            <div>
              <h2 className="text-base font-black text-[#1e293b]">{lang==="ar"?lead.nameAr:lead.name}</h2>
              <p className="text-xs text-[#94a3b8] mt-0.5">{lead.id} · {lang==="ar"?lead.cityAr:lead.city}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={()=>setEditing(p=>!p)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all active:scale-95 ${editing?"bg-[#107789] text-white border-[#107789]":"border-[#E2E8F0] text-[#64748b] hover:border-[#107789]/40"}`}>
              {IC.edit}{editing?t("Editing…","يتم التعديل…"):t("Edit","تعديل")}
            </button>
            <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#F5F7F9] text-[#94a3b8] hover:text-[#1e293b] hover:bg-[#E2E8F0] transition-all">{IC.close}</button>
          </div>
        </div>

        {/* 2-column body */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x divide-[#F1F5F9]">

          {/* LEFT: Lead info */}
          <div className="p-6 space-y-5">
            <p className="text-xs font-black text-[#94a3b8] uppercase tracking-widest">{t("Lead Information","معلومات العميل")}</p>

            {/* Status + quick info */}
            <div className="grid grid-cols-2 gap-3">
              {[
                {lbl:t("Status","الحالة"),    val:<SPill s={form.status} lang={lang}/>},
                {lbl:t("Source","المصدر"),    val:<span className="text-xs font-bold text-[#1e293b]">{lang==="ar"?form.sourceAr:form.source}</span>},
                {lbl:t("Interest","الاهتمام"),val:<span className="text-xs font-bold text-[#1e293b]">{lang==="ar"?form.interestAr:form.interest}</span>},
                {lbl:t("Added","أُضيف"),      val:<span className="text-xs text-[#94a3b8]">{form.createdAt}</span>},
              ].map(r=>(
                <div key={r.lbl.toString()} className="rounded-xl bg-[#F8FAFC] border border-[#F1F5F9] p-3">
                  <p className="text-[10px] text-[#94a3b8] font-semibold uppercase tracking-wide mb-1">{r.lbl}</p>
                  {r.val}
                </div>
              ))}
            </div>

            {/* Contact */}
            <div className="rounded-2xl border border-[#F1F5F9] overflow-hidden">
              {[
                {icon:IC.phone, lbl:t("Phone","الهاتف"), val:form.phone},
                {icon:IC.mail,  lbl:t("Email","البريد"), val:form.email},
                {icon:IC.user,  lbl:t("Agent","الوكيل"), val:lang==="ar"?form.agentAr:form.agent},
              ].map((r,i,arr)=>(
                <div key={r.lbl} className={`flex items-center gap-3 px-4 py-3 ${i<arr.length-1?"border-b border-[#F1F5F9]":""}`}>
                  <span className="text-[#94a3b8] flex-shrink-0">{r.icon}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] text-[#94a3b8] font-semibold">{r.lbl}</p>
                    <p className="text-xs font-bold text-[#1e293b] truncate">{r.val}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Status update (editing) */}
            {editing&&(
              <div style={{animation:"slideUp .2s ease both"}}>
                <label className="block text-xs font-semibold text-[#64748b] mb-1.5">{t("Update Status","تحديث الحالة")}</label>
                <div className="flex flex-wrap gap-2">
                  {(Object.entries(ST) as [LeadStatus,typeof ST[LeadStatus]][]).map(([key,c])=>(
                    <button key={key} onClick={()=>setForm(p=>({...p,status:key}))}
                      className="px-3 py-1.5 rounded-xl text-[11px] font-bold border transition-all active:scale-95"
                      style={form.status===key?{backgroundColor:c.bg,color:c.text,borderColor:c.border}:{borderColor:"#E2E8F0",color:"#94a3b8"}}>
                      {lang==="ar"?c.ar:c.en}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            <div>
              <label className="block text-xs font-semibold text-[#64748b] mb-1.5">{t("Notes","الملاحظات")}</label>
              {editing?(
                <textarea rows={3} value={form.notes} onChange={e=>setForm(p=>({...p,notes:e.target.value}))}
                  className={`${inp} resize-none`}/>
              ):(
                <div className="rounded-xl bg-[#FFFBEB] border border-[#FDE68A] p-3">
                  <p className="text-xs text-[#64748b] leading-relaxed">{lang==="ar"?form.notesAr:form.notes}</p>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-2 pt-2">
              <button onClick={()=>{onBookTrial(form);onClose();}}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white hover:opacity-90 active:scale-95 transition-all"
                style={{backgroundColor:"#107789"}}>
                {IC.trial}{t("Book Trial","احجز تجربة")}
              </button>
              <button onClick={()=>{onSendPayment(form);onClose();}}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white hover:opacity-90 active:scale-95 transition-all"
                style={{backgroundColor:"#7c3aed"}}>
                {IC.pay}{t("Send Payment Link","إرسال رابط دفع")}
              </button>
            </div>
          </div>

          {/* RIGHT: Activity log */}
          <div className="p-6 space-y-4">
            <p className="text-xs font-black text-[#94a3b8] uppercase tracking-widest">{t("Activity Log","سجل الأنشطة")}</p>

            <div className="space-y-3 relative">
              {/* Timeline line */}
              <div className="absolute start-[19px] top-4 bottom-4 w-0.5 bg-[#F1F5F9]"/>
              {form.activity.map((a,i)=>(
                <div key={i} className="flex items-start gap-3 relative" style={{animation:`slideUp .25s ${i*.08}s ease both`}}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-base flex-shrink-0 bg-white border border-[#F1F5F9] z-10">
                    {a.icon}
                  </div>
                  <div className="flex-1 min-w-0 bg-[#F8FAFC] rounded-xl px-3 py-2.5">
                    <p className="text-xs font-semibold text-[#1e293b] leading-snug">{lang==="ar"?a.ar:a.en}</p>
                    <p className="text-[10px] text-[#94a3b8] mt-0.5">{lang==="ar"?a.timeAr:a.time}</p>
                  </div>
                </div>
              ))}

              {/* Add note (editing) */}
              {editing&&(
                <div className="flex items-center gap-2 relative" style={{animation:"slideUp .2s ease both"}}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-[#94a3b8] flex-shrink-0 bg-[#F8FAFC] border border-dashed border-[#E2E8F0] z-10">✏️</div>
                  <input placeholder={t("Add a note…","أضف ملاحظة…")} className="flex-1 px-3 py-2 text-xs border border-[#E2E8F0] rounded-xl bg-white text-[#1e293b] placeholder:text-[#C4CAD4] focus:outline-none focus:border-[#107789] transition-all"/>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#F1F5F9] bg-[#FAFBFC]">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm font-semibold border border-[#E2E8F0] text-[#64748b] hover:bg-[#F5F7F9] active:scale-95 transition-all">{t("Close","إغلاق")}</button>
          {editing&&(
            <button onClick={()=>{onSave(form);setEditing(false);}}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90 active:scale-95 transition-all" style={{backgroundColor:"#107789"}}>
              {IC.ok}{t("Save Changes","حفظ التغييرات")}
            </button>
          )}
        </div>
      </div>
    </Backdrop>
  );
}

// ═══════════════════════════════════════════════════
// BOOK TRIAL MODAL — wide
// ═══════════════════════════════════════════════════
const TEACHERS_OPT=[{id:"AN",en:"Mr. Ahmad Nasser",ar:"أ. أحمد الناصر"},{id:"NK",en:"Ms. Nora Khalil",ar:"أ. نورا خليل"},{id:"SY",en:"Dr. Samir Yousef",ar:"د. سمير يوسف"}];
const TIME_SLOTS=["08:00 AM","09:00 AM","10:00 AM","11:00 AM","01:00 PM","02:00 PM","03:00 PM","04:00 PM","05:00 PM"];
const SUBJECTS_OPT=[{en:"English Speaking",ar:"محادثة إنجليزية"},{en:"Grammar & Writing",ar:"قواعد وكتابة"},{en:"IELTS Preparation",ar:"تحضير IELTS"},{en:"Business English",ar:"إنجليزية الأعمال"}];

function BookTrialModal({lead,lang,isRTL,t,onClose,onConfirm}:{lead:Lead;lang:string;isRTL:boolean;t:(a:string,b:string)=>string;onClose:()=>void;onConfirm:()=>void}){
  const [teacher,setTeacher]=useState("");
  const [subject,setSubject]=useState(lead.interest);
  const [date,setDate]=useState("");
  const [time,setTime]=useState("");
  const [notes,setNotes]=useState("");
  const [loading,setLoading]=useState(false);
  const [errors,setErrors]=useState<Record<string,string>>({});
  const inp="w-full px-3 py-2.5 text-sm border border-[#E2E8F0] rounded-xl bg-white text-[#1e293b] placeholder:text-[#C4CAD4] focus:outline-none focus:border-[#107789] focus:ring-1 focus:ring-[#107789]/20 transition-all";

  const validate=()=>{
    const e:Record<string,string>={};
    if(!teacher) e.teacher=t("Select a teacher.","اختر معلماً.");
    if(!date)    e.date   =t("Select a date.","اختر تاريخاً.");
    if(!time)    e.time   =t("Select a time.","اختر وقتاً.");
    setErrors(e); return Object.keys(e).length===0;
  };
  const handleBook=async()=>{
    if(!validate()) return;
    setLoading(true); await new Promise(r=>setTimeout(r,1400)); setLoading(false); onConfirm();
  };

  return(
    <Backdrop onClose={onClose}>
      <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-3xl overflow-hidden"
        dir={isRTL?"rtl":"ltr"} style={{maxHeight:"90vh",overflowY:"auto"}}>
        <div className="h-1.5" style={{background:"linear-gradient(90deg,#107789,#E8763A)"}}/>
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#F1F5F9]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EBF5F7] text-[#107789] flex items-center justify-center">{IC.trial}</div>
            <div>
              <h2 className="text-base font-black text-[#1e293b]">{t("Book Trial Class","حجز حصة تجريبية")}</h2>
              <p className="text-xs text-[#94a3b8]">{t("For","لـ")} {lang==="ar"?lead.nameAr:lead.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#F5F7F9] text-[#94a3b8] hover:text-[#1e293b] hover:bg-[#E2E8F0] transition-all">{IC.close}</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x divide-[#F1F5F9]">

          {/* LEFT */}
          <div className="p-6 space-y-4">
            <p className="text-xs font-black text-[#94a3b8] uppercase tracking-widest">{t("Session Details","تفاصيل الجلسة")}</p>
            {/* Subject */}
            <div>
              <label className="block text-xs font-semibold text-[#64748b] mb-2">{t("Subject","المادة")}</label>
              <div className="flex flex-wrap gap-2">
                {SUBJECTS_OPT.map(s=>(
                  <button key={s.en} onClick={()=>setSubject(s.en)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all active:scale-95 ${subject===s.en?"border-[#107789] bg-[#EBF5F7] text-[#107789]":"border-[#E2E8F0] text-[#64748b] hover:border-[#107789]/30"}`}>
                    {lang==="ar"?s.ar:s.en}
                  </button>
                ))}
              </div>
            </div>
            {/* Teacher */}
            <div>
              <label className="block text-xs font-semibold text-[#64748b] mb-2">{t("Teacher","المعلم")}</label>
              <div className="space-y-2">
                {TEACHERS_OPT.map(tc=>(
                  <button key={tc.id} onClick={()=>{setTeacher(tc.id);setErrors(p=>({...p,teacher:""}));}}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl border text-start transition-all active:scale-[.98] ${teacher===tc.id?"border-[#107789]/60 bg-[#EBF5F7]":"border-[#E2E8F0] hover:border-[#107789]/30"}`}>
                    <Av i={tc.id} size="sm"/>
                    <span className={`text-sm font-semibold ${teacher===tc.id?"text-[#107789]":"text-[#1e293b]"}`}>{lang==="ar"?tc.ar:tc.en}</span>
                    {teacher===tc.id&&<span className="ms-auto w-5 h-5 rounded-full bg-[#107789] flex items-center justify-center text-white">{IC.ok}</span>}
                  </button>
                ))}
              </div>
              {errors.teacher&&<p className="text-[11px] text-[#ef4444] mt-1">{errors.teacher}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#64748b] mb-1.5">{t("Notes (optional)","ملاحظات (اختياري)")}</label>
              <textarea rows={2} value={notes} onChange={e=>setNotes(e.target.value)} placeholder={t("Any specific topics?","أي مواضيع محددة؟")} className={`${inp} resize-none`}/>
            </div>
          </div>

          {/* RIGHT */}
          <div className="p-6 space-y-4">
            <p className="text-xs font-black text-[#94a3b8] uppercase tracking-widest">{t("Date & Time","التاريخ والوقت")}</p>
            <div>
              <label className="block text-xs font-semibold text-[#64748b] mb-1.5">{t("Date","التاريخ")}</label>
              <input type="date" value={date} onChange={e=>{setDate(e.target.value);setErrors(p=>({...p,date:""}));}} className={inp}/>
              {errors.date&&<p className="text-[11px] text-[#ef4444] mt-1">{errors.date}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#64748b] mb-2">{t("Time","الوقت")}</label>
              <div className="grid grid-cols-3 gap-2">
                {TIME_SLOTS.map(ts=>(
                  <button key={ts} onClick={()=>{setTime(ts);setErrors(p=>({...p,time:""}));}}
                    className={`py-2 rounded-xl text-xs font-semibold border transition-all active:scale-95 ${time===ts?"border-[#107789] bg-[#EBF5F7] text-[#107789]":"border-[#E2E8F0] text-[#64748b] hover:border-[#107789]/30 hover:bg-[#F8FAFC]"}`}>
                    {ts}
                  </button>
                ))}
              </div>
              {errors.time&&<p className="text-[11px] text-[#ef4444] mt-1">{errors.time}</p>}
            </div>

            {/* Summary */}
            {(teacher||date||time)&&(
              <div className="rounded-xl bg-[#EBF5F7] border border-[#b2dce4] p-4 space-y-1.5" style={{animation:"slideUp .2s ease both"}}>
                <p className="text-[10px] font-black text-[#107789] uppercase tracking-wide mb-2">{t("Summary","الملخص")}</p>
                {[
                  {lbl:t("Lead","العميل"),    val:lang==="ar"?lead.nameAr:lead.name},
                  {lbl:t("Subject","المادة"), val:subject},
                  {lbl:t("Teacher","المعلم"), val:TEACHERS_OPT.find(tc=>tc.id===teacher)?.[lang==="ar"?"ar":"en"]||"—"},
                  {lbl:t("Date","التاريخ"),   val:date||"—"},
                  {lbl:t("Time","الوقت"),     val:time||"—"},
                ].map(r=>(
                  <div key={r.lbl} className="flex justify-between text-[11px]">
                    <span className="text-[#64748b]">{r.lbl}</span>
                    <span className="font-bold text-[#107789]">{r.val}</span>
                  </div>
                ))}
              </div>
            )}
            <div className="flex items-start gap-2 text-[11px] text-[#94a3b8] bg-[#F8FAFC] rounded-xl p-3">
              {IC.info}<span>{t("The lead will receive an SMS confirmation once booked.","سيتلقى العميل رسالة SMS تأكيدية عند الحجز.")}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#F1F5F9] bg-white">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm font-semibold border border-[#E2E8F0] text-[#64748b] hover:bg-[#F5F7F9] active:scale-95 transition-all">{t("Cancel","إلغاء")}</button>
          <button onClick={handleBook} disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90 active:scale-[.98] transition-all"
            style={{backgroundColor:loading?"#5FA8B3":"#107789"}}>
            {loading?<>{IC.spinner}{t("Booking…","جارٍ الحجز…")}</>:<>{IC.trial}{t("Confirm Booking","تأكيد الحجز")}</>}
          </button>
        </div>
      </div>
    </Backdrop>
  );
}

// ═══════════════════════════════════════════════════
// SEND PAYMENT LINK MODAL — wide
// ═══════════════════════════════════════════════════
const PKGS=[{nameEn:"Starter — $120/mo",nameAr:"المبتدئ — $120/شهر",id:"starter"},{nameEn:"Standard — $220/mo",nameAr:"القياسي — $220/شهر",id:"standard"},{nameEn:"Premium — $300/mo",nameAr:"المتميز — $300/شهر",id:"premium"},{nameEn:"Intensive — $380/mo",nameAr:"المكثف — $380/شهر",id:"intensive"}];

function PaymentLinkModal({lead,lang,isRTL,t,onClose,onConfirm}:{lead:Lead;lang:string;isRTL:boolean;t:(a:string,b:string)=>string;onClose:()=>void;onConfirm:()=>void}){
  const [pkg,setPkg]=useState("standard");
  const [method,setMethod]=useState<"whatsapp"|"sms"|"email">("whatsapp");
  const [copied,setCopied]=useState(false);
  const [loading,setLoading]=useState(false);
  const link=`https://evothink.com/pay/${lead.id}-${pkg}`;

  const copy=()=>{ navigator.clipboard?.writeText(link).catch(()=>{}); setCopied(true); setTimeout(()=>setCopied(false),2000); };
  const handleSend=async()=>{
    setLoading(true); await new Promise(r=>setTimeout(r,1200)); setLoading(false); onConfirm();
  };

  const inp="w-full px-3 py-2.5 text-sm border border-[#E2E8F0] rounded-xl bg-white text-[#1e293b] focus:outline-none focus:border-[#107789] focus:ring-1 focus:ring-[#107789]/20 transition-all";

  return(
    <Backdrop onClose={onClose}>
      <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-3xl overflow-hidden"
        dir={isRTL?"rtl":"ltr"} style={{maxHeight:"90vh",overflowY:"auto"}}>
        <div className="h-1.5" style={{background:"linear-gradient(90deg,#7c3aed,#E8763A)"}}/>
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#F1F5F9]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#ede9fe] text-[#7c3aed] flex items-center justify-center">{IC.pay}</div>
            <div>
              <h2 className="text-base font-black text-[#1e293b]">{t("Send Payment Link","إرسال رابط الدفع")}</h2>
              <p className="text-xs text-[#94a3b8]">{t("To","إلى")} {lang==="ar"?lead.nameAr:lead.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#F5F7F9] text-[#94a3b8] hover:text-[#1e293b] hover:bg-[#E2E8F0] transition-all">{IC.close}</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x divide-[#F1F5F9]">
          {/* LEFT */}
          <div className="p-6 space-y-5">
            <p className="text-xs font-black text-[#94a3b8] uppercase tracking-widest">{t("Select Package","اختر الباقة")}</p>
            <div className="space-y-2">
              {PKGS.map(p=>(
                <button key={p.id} onClick={()=>setPkg(p.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-start transition-all active:scale-[.98] ${pkg===p.id?"border-[#7c3aed]/50 bg-[#ede9fe]":"border-[#E2E8F0] hover:border-[#7c3aed]/30"}`}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base flex-shrink-0" style={{backgroundColor:pkg===p.id?"#ede9fe":"#F8FAFC"}}>
                    {p.id==="starter"?"🌱":p.id==="standard"?"⭐":p.id==="premium"?"💎":"🚀"}
                  </div>
                  <span className={`text-sm font-semibold ${pkg===p.id?"text-[#7c3aed]":"text-[#1e293b]"}`}>{lang==="ar"?p.nameAr:p.nameEn}</span>
                  {pkg===p.id&&<span className="ms-auto w-5 h-5 rounded-full bg-[#7c3aed] flex items-center justify-center text-white flex-shrink-0">{IC.ok}</span>}
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT */}
          <div className="p-6 space-y-5">
            <p className="text-xs font-black text-[#94a3b8] uppercase tracking-widest">{t("Delivery Method","طريقة الإرسال")}</p>
            <div className="grid grid-cols-3 gap-2">
              {([["whatsapp","💬","WhatsApp","واتساب"],["sms","📱","SMS","رسالة"],["email","📧","Email","بريد"]] as const).map(([key,icon,en,ar])=>(
                <button key={key} onClick={()=>setMethod(key)}
                  className={`flex flex-col items-center gap-1 py-3 rounded-xl border text-[11px] font-semibold transition-all active:scale-95 ${method===key?"border-[#7c3aed]/50 bg-[#ede9fe] text-[#7c3aed]":"border-[#E2E8F0] text-[#64748b] hover:border-[#7c3aed]/30"}`}>
                  <span className="text-xl">{icon}</span>{lang==="ar"?ar:en}
                </button>
              ))}
            </div>

            {/* Contact preview */}
            <div className="rounded-xl bg-[#F8FAFC] border border-[#F1F5F9] p-4 space-y-2">
              <p className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-wide">{t("Sending to","يُرسل إلى")}</p>
              <div className="flex items-center gap-2">
                <Av i={lead.name.slice(0,2).toUpperCase()} size="sm"/>
                <div>
                  <p className="text-sm font-bold text-[#1e293b]">{lang==="ar"?lead.nameAr:lead.name}</p>
                  <p className="text-xs text-[#94a3b8]">{method==="email"?lead.email:lead.phone}</p>
                </div>
              </div>
            </div>

            {/* Link preview + copy */}
            <div className="rounded-xl bg-[#F8FAFC] border border-[#F1F5F9] p-3">
              <p className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-wide mb-1.5">{t("Payment Link","رابط الدفع")}</p>
              <div className="flex items-center gap-2">
                <p className="text-xs font-mono text-[#64748b] truncate flex-1">{link}</p>
                <button onClick={copy}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold border transition-all active:scale-95 flex-shrink-0"
                  style={copied?{backgroundColor:"#d1fae5",color:"#059669",borderColor:"#6ee7b7"}:{borderColor:"#E2E8F0",color:"#64748b"}}>
                  {IC.copy}{copied?t("Copied!","تم!"):t("Copy","نسخ")}
                </button>
              </div>
            </div>

            <div className="flex items-start gap-2 text-[11px] text-[#94a3b8] bg-[#F8FAFC] rounded-xl p-3">
              {IC.info}<span>{t("The link expires in 48 hours.","الرابط ينتهي بعد 48 ساعة.")}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#F1F5F9] bg-white">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm font-semibold border border-[#E2E8F0] text-[#64748b] hover:bg-[#F5F7F9] active:scale-95 transition-all">{t("Cancel","إلغاء")}</button>
          <button onClick={handleSend} disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90 active:scale-[.98] transition-all"
            style={{backgroundColor:loading?"#9f7aea":"#7c3aed"}}>
            {loading?<>{IC.spinner}{t("Sending…","جارٍ الإرسال…")}</>:<>{IC.pay}{t("Send Link","إرسال الرابط")}</>}
          </button>
        </div>
      </div>
    </Backdrop>
  );
}

// ═══════════════════════════════════════════════════
// ADD LEAD MODAL — wide 2-column
// ═══════════════════════════════════════════════════
const AGENTS_OPT=[
  {id:"NK",en:"Nour Al-Khalil",  ar:"نور الخليل",  avatar:"NK"},
  {id:"FM",en:"Fares Mansoor",   ar:"فارس منصور",  avatar:"FM"},
  {id:"DR",en:"Dana Rashid",     ar:"دانا راشد",   avatar:"DR"},
  {id:"SZ",en:"Sami Al-Zoubi",   ar:"سامي الزعبي", avatar:"SZ"},
];
const SOURCES_OPT=[
  {en:"Instagram",   ar:"إنستغرام"},
  {en:"Facebook",    ar:"فيسبوك"},
  {en:"Google Ads",  ar:"إعلانات قوقل"},
  {en:"Referral",    ar:"إحالة"},
  {en:"Website",     ar:"الموقع"},
  {en:"WhatsApp",    ar:"واتساب"},
];
const INTERESTS_OPT=[
  {en:"English Speaking",  ar:"محادثة إنجليزية"},
  {en:"Grammar & Writing", ar:"قواعد وكتابة"},
  {en:"IELTS Preparation", ar:"تحضير IELTS"},
  {en:"Business English",  ar:"إنجليزية الأعمال"},
  {en:"Kids English",      ar:"إنجليزية الأطفال"},
  {en:"Vocabulary Boost",  ar:"تعزيز المفردات"},
];

function AddLeadModal({lang,isRTL,t,onClose,onSave}:{
  lang:string; isRTL:boolean;
  t:(a:string,b:string)=>string;
  onClose:()=>void;
  onSave:(l:Lead)=>void;
}){
  const [form,setForm]=useState({
    name:"",nameAr:"",phone:"",email:"",
    city:"",cityAr:"",source:"Instagram",agent:"NK",
    interest:"English Speaking",notes:"",
  });
  const [errors,setErrors]=useState<Record<string,string>>({});
  const [loading,setLoading]=useState(false);

  const inp="w-full px-3 py-2.5 text-sm border border-[#E2E8F0] rounded-xl bg-white text-[#1e293b] placeholder:text-[#C4CAD4] focus:outline-none focus:border-[#107789] focus:ring-1 focus:ring-[#107789]/20 transition-all";
  const lbl="block text-xs font-semibold text-[#64748b] mb-1.5";

  const validate=()=>{
    const e:Record<string,string>={};
    if(!form.name.trim())  e.name  =t("Full name is required.","الاسم الكامل مطلوب.");
    if(!form.phone.trim()) e.phone =t("Phone number is required.","رقم الهاتف مطلوب.");
    if(form.email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email=t("Invalid email.","بريد غير صحيح.");
    if(!form.agent)        e.agent =t("Assign an agent.","عيّن وكيلاً.");
    setErrors(e); return Object.keys(e).length===0;
  };

  const handleSave=async()=>{
    if(!validate()) return;
    setLoading(true); await new Promise(r=>setTimeout(r,900)); setLoading(false);
    const ag=AGENTS_OPT.find(a=>a.id===form.agent)!;
    const newLead:Lead={
      id:`L${String(Date.now()).slice(-3)}`,
      name:form.name.trim(), nameAr:form.nameAr.trim()||form.name.trim(),
      phone:form.phone.trim(), email:form.email.trim(),
      city:form.city.trim(), cityAr:form.cityAr.trim()||form.city.trim(),
      source:form.source, sourceAr:SOURCES_OPT.find(s=>s.en===form.source)?.ar||form.source,
      status:"new",
      agent:ag.en, agentAr:ag.ar, agentAvatar:ag.id,
      notes:form.notes, notesAr:form.notes,
      createdAt:new Date().toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}),
      interest:form.interest,
      interestAr:INTERESTS_OPT.find(i=>i.en===form.interest)?.ar||form.interest,
      activity:[{
        en:`Lead added — ${form.source}`, ar:`أُضيف من ${SOURCES_OPT.find(s=>s.en===form.source)?.ar||form.source}`,
        time:"Just now", timeAr:"الآن", icon:"👤",
      }],
    };
    onSave(newLead);
  };

  return(
    <Backdrop onClose={onClose}>
      <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-3xl overflow-hidden"
        dir={isRTL?"rtl":"ltr"} style={{maxHeight:"92vh",overflowY:"auto"}}>
        <div className="h-1.5" style={{background:"linear-gradient(90deg,#107789,#E8763A)"}}/>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#F1F5F9]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EBF5F7] flex items-center justify-center text-xl">👤</div>
            <div>
              <h2 className="text-base font-black text-[#1e293b]">{t("Add New Lead","إضافة عميل جديد")}</h2>
              <p className="text-xs text-[#94a3b8] mt-0.5">{t("Fill in the details to add to the pipeline","أدخل التفاصيل لإضافته لخط العملاء")}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#F5F7F9] text-[#94a3b8] hover:text-[#1e293b] hover:bg-[#E2E8F0] transition-all">{IC.close}</button>
        </div>

        {/* 2-column body */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x divide-[#F1F5F9]">

          {/* LEFT: Personal info */}
          <div className="p-6 space-y-4">
            <p className="text-xs font-black text-[#94a3b8] uppercase tracking-widest">{t("Personal Information","المعلومات الشخصية")}</p>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={lbl}>{t("Full Name *","الاسم الكامل *")}</label>
                <input value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))}
                  placeholder={t("Ahmad Hassan","أحمد حسن")} className={inp}/>
                {errors.name&&<p className="text-[11px] text-[#ef4444] mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className={lbl}>{t("Name in Arabic","الاسم بالعربي")}</label>
                <input value={form.nameAr} onChange={e=>setForm(p=>({...p,nameAr:e.target.value}))}
                  placeholder="أحمد حسن" className={inp} dir="rtl"/>
              </div>
            </div>

            <div>
              <label className={lbl}>{t("Phone Number *","رقم الهاتف *")}</label>
              <input value={form.phone} onChange={e=>setForm(p=>({...p,phone:e.target.value}))}
                placeholder="+962 79 000 0000" className={inp} type="tel"/>
              {errors.phone&&<p className="text-[11px] text-[#ef4444] mt-1">{errors.phone}</p>}
            </div>

            <div>
              <label className={lbl}>{t("Email (optional)","البريد الإلكتروني (اختياري)")}</label>
              <input value={form.email} onChange={e=>setForm(p=>({...p,email:e.target.value}))}
                placeholder="email@example.com" className={inp} type="email"/>
              {errors.email&&<p className="text-[11px] text-[#ef4444] mt-1">{errors.email}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={lbl}>{t("City","المدينة")}</label>
                <input value={form.city} onChange={e=>setForm(p=>({...p,city:e.target.value}))}
                  placeholder="Amman" className={inp}/>
              </div>
              <div>
                <label className={lbl}>{t("City (Arabic)","المدينة (عربي)")}</label>
                <input value={form.cityAr} onChange={e=>setForm(p=>({...p,cityAr:e.target.value}))}
                  placeholder="عمّان" className={inp} dir="rtl"/>
              </div>
            </div>

            <div>
              <label className={lbl}>{t("Notes","ملاحظات")}</label>
              <textarea rows={2} value={form.notes} onChange={e=>setForm(p=>({...p,notes:e.target.value}))}
                placeholder={t("Any notes about this lead…","أي ملاحظات عن هذا العميل…")}
                className={`${inp} resize-none`}/>
            </div>
          </div>

          {/* RIGHT: Classification */}
          <div className="p-6 space-y-5">
            <p className="text-xs font-black text-[#94a3b8] uppercase tracking-widest">{t("Classification","التصنيف")}</p>

            {/* Source */}
            <div>
              <label className={lbl}>{t("Lead Source","مصدر العميل")}</label>
              <div className="flex flex-wrap gap-2">
                {SOURCES_OPT.map(s=>(
                  <button key={s.en} type="button" onClick={()=>setForm(p=>({...p,source:s.en}))}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all active:scale-95
                                ${form.source===s.en?"border-[#107789] bg-[#EBF5F7] text-[#107789]":"border-[#E2E8F0] text-[#64748b] hover:border-[#107789]/30 hover:bg-[#F8FAFC]"}`}>
                    {lang==="ar"?s.ar:s.en}
                  </button>
                ))}
              </div>
            </div>

            {/* Interest */}
            <div>
              <label className={lbl}>{t("Area of Interest","مجال الاهتمام")}</label>
              <div className="flex flex-wrap gap-2">
                {INTERESTS_OPT.map(i=>(
                  <button key={i.en} type="button" onClick={()=>setForm(p=>({...p,interest:i.en}))}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all active:scale-95
                                ${form.interest===i.en?"border-[#107789] bg-[#EBF5F7] text-[#107789]":"border-[#E2E8F0] text-[#64748b] hover:border-[#107789]/30 hover:bg-[#F8FAFC]"}`}>
                    {lang==="ar"?i.ar:i.en}
                  </button>
                ))}
              </div>
            </div>

            {/* Assign agent */}
            <div>
              <label className={lbl}>{t("Assign Agent *","تعيين الوكيل *")}</label>
              <div className="space-y-2">
                {AGENTS_OPT.map(ag=>(
                  <button key={ag.id} type="button" onClick={()=>{setForm(p=>({...p,agent:ag.id}));setErrors(p=>({...p,agent:""}));}}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl border text-start transition-all active:scale-[.98]
                                ${form.agent===ag.id?"border-[#107789]/60 bg-[#EBF5F7]":"border-[#E2E8F0] hover:border-[#107789]/30 hover:bg-[#F8FAFC]"}`}>
                    <Av i={ag.id} size="sm"/>
                    <span className={`text-sm font-semibold ${form.agent===ag.id?"text-[#107789]":"text-[#1e293b]"}`}>
                      {lang==="ar"?ag.ar:ag.en}
                    </span>
                    {form.agent===ag.id&&(
                      <span className="ms-auto w-5 h-5 rounded-full bg-[#107789] flex items-center justify-center text-white flex-shrink-0">
                        {IC.ok}
                      </span>
                    )}
                  </button>
                ))}
              </div>
              {errors.agent&&<p className="text-[11px] text-[#ef4444] mt-1">{errors.agent}</p>}
            </div>

            {/* Status preview */}
            <div className="rounded-xl bg-[#eff6ff] border border-[#bfdbfe] p-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#3b82f6] flex-shrink-0"/>
              <p className="text-xs text-[#2563eb] font-semibold">{t("Status will be set to: New","سيتم تعيين الحالة: جديد")}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#F1F5F9] bg-[#FAFBFC]">
          <button onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold border border-[#E2E8F0] text-[#64748b] hover:bg-[#F5F7F9] active:scale-95 transition-all">
            {t("Cancel","إلغاء")}
          </button>
          <button onClick={handleSave} disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90 active:scale-[.98] transition-all"
            style={{backgroundColor:loading?"#5FA8B3":"#107789"}}>
            {loading
              ? <><svg className="animate-spin" width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="white" strokeWidth="2" strokeOpacity="0.3"/><path d="M7 1.5a5.5 5.5 0 015.5 5.5" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>{t("Adding…","جارٍ الإضافة…")}</>
              : <>{IC.ok}{t("Add Lead","إضافة العميل")}</>
            }
          </button>
        </div>
      </div>
    </Backdrop>
  );
}

// ═══════════════════════════════════════════════════
// PAGE
// ═══════════════════════════════════════════════════
export default function LeadsPage(){
  const {lang,isRTL,t}=useLanguage();

  const [leads,     setLeads]     = useState<Lead[]>(LEADS);
  const [filter,    setFilter]    = useState<FilterTab>("all");
  const [search,    setSearch]    = useState("");
  const [showAdd,   setShowAdd]   = useState(false);
  const [viewLead,  setViewLead]  = useState<Lead|null>(null);
  const [trialLead, setTrialLead] = useState<Lead|null>(null);
  const [payLead,   setPayLead]   = useState<Lead|null>(null);
  const [toast,     setToast]     = useState<string|null>(null);

  const fire=(msg:string)=>{setToast(msg);setTimeout(()=>setToast(null),3500);};

  const filtered=leads.filter(l=>{
    const q=search.toLowerCase();
    const matchS=!q||l.name.toLowerCase().includes(q)||l.phone.includes(q)||l.email.toLowerCase().includes(q)||l.nameAr.includes(q);
    const matchF=filter==="all"||l.status===filter;
    return matchS&&matchF;
  });

  const TABS: [FilterTab,string,string][]=[
    ["all",t("All","الكل"),t("All","الكل")],
    ["new",t("New","جديد"),t("New","جديد")],
    ["contacted",t("Contacted","تم التواصل"),t("Contacted","تم التواصل")],
    ["trial_booked",t("Trial Booked","تجربة محجوزة"),t("Trial Booked","تجربة محجوزة")],
    ["converted",t("Converted","تحوّل"),t("Converted","تحوّل")],
    ["lost",t("Lost","خسارة"),t("Lost","خسارة")],
  ];

  const counts=TABS.reduce((acc,[key])=>{
    acc[key]=key==="all"?leads.length:leads.filter(l=>l.status===key).length; return acc;
  },{} as Record<string,number>);

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
            <h1 className="text-xl sm:text-2xl font-black text-[#1e293b] tracking-tight">{t("Lead Management","إدارة العملاء المحتملين")}</h1>
            <p className="mt-1 text-xs sm:text-sm text-[#94a3b8]">{t("Track, follow up, and convert your leads","تابع عملاءك المحتملين وحوّلهم")}</p>
          </div>
          <button onClick={()=>setShowAdd(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90 active:scale-95 transition-all"
            style={{backgroundColor:"#107789",animation:"cardIn .4s .05s both"}}>
            + {t("Add Lead","إضافة عميل")}
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5" style={{animation:"cardIn .45s .08s both"}}>
          {[
            {label:t("Total","الإجمالي"),     val:leads.length,                                              color:"#107789",bg:"#EBF5F7"},
            {label:t("New","جديد"),           val:leads.filter(l=>l.status==="new").length,                  color:"#2563eb",bg:"#eff6ff"},
            {label:t("Contacted","تواصل"),    val:leads.filter(l=>l.status==="contacted").length,            color:"#d97706",bg:"#fef3c7"},
            {label:t("Trials","تجارب"),       val:leads.filter(l=>l.status==="trial_booked").length,         color:"#7c3aed",bg:"#ede9fe"},
            {label:t("Converted","تحوّل"),   val:leads.filter(l=>l.status==="converted").length,            color:"#059669",bg:"#d1fae5"},
          ].map((s,i)=>(
            <div key={s.label} className="rounded-2xl bg-white border border-[#F1F5F9] shadow-sm p-4 hover:shadow-md hover:border-[#b2dce4] transition-all"
              style={{animation:`cardIn .45s ${i*.07}s cubic-bezier(.34,1.2,.64,1) both`}}>
              <p className="text-2xl font-black" style={{color:s.color}}>{s.val}</p>
              <p className="text-xs text-[#94a3b8] mt-1 font-medium">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filter + Search */}
        <div className="flex flex-wrap items-center gap-3" style={{animation:"cardIn .4s .22s both"}}>
          <div className="flex items-center flex-wrap gap-1.5">
            {TABS.map(([key,en])=>{
              const cnt=counts[key];
              return(
                <button key={key} onClick={()=>setFilter(key)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all active:scale-95"
                  style={filter===key?{backgroundColor:"#107789",color:"white",boxShadow:"0 2px 8px #10778940"}:{backgroundColor:"white",color:"#64748b",border:"1px solid #F1F5F9"}}>
                  {en}
                  <span className="text-[10px] rounded-full px-1.5 py-0.5 font-black"
                    style={filter===key?{backgroundColor:"rgba(255,255,255,.25)"}:{backgroundColor:"#F1F5F9",color:"#94a3b8"}}>
                    {cnt}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-[#F1F5F9] shadow-sm ms-auto" style={{minWidth:200}}>
            {IC.search}
            <input type="text" value={search} onChange={e=>setSearch(e.target.value)}
              placeholder={t("Search leads…","ابحث عن عميل…")}
              className="flex-1 bg-transparent text-sm text-[#1e293b] placeholder:text-[#C4CAD4] focus:outline-none"/>
            {search&&<button onClick={()=>setSearch("")} className="text-[#94a3b8] hover:text-[#1e293b] text-xs">✕</button>}
          </div>
        </div>

        {/* Mobile cards */}
        <div className="sm:hidden space-y-3">
          {filtered.map((l,i)=>(
            <div key={l.id} className="rounded-2xl bg-white border border-[#F1F5F9] shadow-sm overflow-hidden hover:shadow-md transition-all"
              style={{animation:`cardIn .4s ${i*.06}s both`}}>
              <div className="h-0.5" style={{backgroundColor:ST[l.status].dot}}/>
              <div className="p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <Av i={l.name.slice(0,2).toUpperCase()} size="md"/>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-[#1e293b] truncate">{lang==="ar"?l.nameAr:l.name}</p>
                    <p className="text-xs text-[#94a3b8]">{l.phone}</p>
                  </div>
                  <SPill s={l.status} lang={lang}/>
                </div>
                <div className="flex items-center gap-2 flex-wrap text-[10px] text-[#94a3b8]">
                  <span>{lang==="ar"?l.interestAr:l.interest}</span>
                  <span>·</span>
                  <span>{lang==="ar"?l.sourceAr:l.source}</span>
                  <span>·</span>
                  <span>{lang==="ar"?l.agentAr:l.agent}</span>
                </div>
                <div className="flex gap-2 pt-1 border-t border-[#F8FAFC]">
                  <button onClick={()=>setViewLead(l)} className="flex-1 py-2 rounded-xl text-xs font-bold border border-[#E2E8F0] text-[#107789] hover:bg-[#EBF5F7] active:scale-95 transition-all">{t("View","عرض")}</button>
                  <button onClick={()=>setTrialLead(l)} className="flex-1 py-2 rounded-xl text-xs font-bold text-white hover:opacity-90 active:scale-95 transition-all" style={{backgroundColor:"#107789"}}>{t("Trial","تجربة")}</button>
                  <button onClick={()=>setPayLead(l)} className="flex-1 py-2 rounded-xl text-xs font-bold text-white hover:opacity-90 active:scale-95 transition-all" style={{backgroundColor:"#7c3aed"}}>{t("Pay","دفع")}</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop table */}
        <div className="hidden sm:block rounded-2xl bg-white border border-[#F1F5F9] shadow-sm overflow-hidden" style={{animation:"cardIn .45s .3s both"}}>
          <div className="px-5 py-4 border-b border-[#F1F5F9] flex items-center justify-between">
            <p className="text-sm font-bold text-[#1e293b]">{filtered.length} {t("leads","عميل")}</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm" style={{borderCollapse:"collapse"}}>
              <thead>
                <tr style={{backgroundColor:"#F8FAFC"}}>
                  {[t("Lead","العميل"),t("Contact","التواصل"),t("Interest","الاهتمام"),t("Source","المصدر"),t("Status","الحالة"),t("Agent","الوكيل"),t("Actions","الإجراءات")].map(h=>(
                    <th key={h} className="px-4 py-3 text-start text-xs font-semibold uppercase tracking-wide text-[#94a3b8] whitespace-nowrap border-b border-[#F1F5F9]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length===0&&(
                  <tr><td colSpan={7} className="px-4 py-12 text-center text-sm text-[#94a3b8]">{t("No leads found","لا توجد عملاء")}</td></tr>
                )}
                {filtered.map((l,i)=>(
                  <tr key={l.id} className="hover:bg-[#F8FAFC] transition-colors border-b border-[#F1F5F9] last:border-0"
                    style={{animation:`slideUp .3s ${.34+i*.05}s ease both`}}>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <Av i={l.name.slice(0,2).toUpperCase()} size="sm"/>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-[#1e293b] truncate max-w-[130px]">{lang==="ar"?l.nameAr:l.name}</p>
                          <p className="text-[10px] text-[#94a3b8] font-mono">{l.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="text-xs text-[#64748b]">{l.phone}</p>
                      <p className="text-[10px] text-[#94a3b8] truncate max-w-[140px]">{l.email}</p>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-[#64748b] whitespace-nowrap">{lang==="ar"?l.interestAr:l.interest}</td>
                    <td className="px-4 py-3.5 text-xs text-[#64748b] whitespace-nowrap">{lang==="ar"?l.sourceAr:l.source}</td>
                    <td className="px-4 py-3.5"><SPill s={l.status} lang={lang}/></td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <Av i={l.agentAvatar} size="sm"/>
                        <span className="text-xs text-[#64748b] truncate max-w-[80px]">{lang==="ar"?l.agentAr:l.agent}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1">
                        <button onClick={()=>setViewLead(l)}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold border border-[#E2E8F0] text-[#107789] hover:bg-[#EBF5F7] active:scale-95 transition-all">
                          {IC.edit}{t("View/Edit","عرض")}
                        </button>
                        <button onClick={()=>setTrialLead(l)}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold text-white hover:opacity-90 active:scale-95 transition-all" style={{backgroundColor:"#107789"}}>
                          {IC.trial}{t("Trial","تجربة")}
                        </button>
                        <button onClick={()=>setPayLead(l)}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold text-white hover:opacity-90 active:scale-95 transition-all" style={{backgroundColor:"#7c3aed"}}>
                          {IC.pay}{t("Pay","دفع")}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between px-5 py-3.5 bg-[#F8FAFC] border-t border-[#F1F5F9]">
            <p className="text-xs text-[#94a3b8]">{t(`Showing ${filtered.length} of ${leads.length}`,`عرض ${filtered.length} من ${leads.length}`)}</p>
          </div>
        </div>

      </main>

      {showAdd&&<AddLeadModal lang={lang} isRTL={isRTL} t={t} onClose={()=>setShowAdd(false)}
        onSave={l=>{setLeads(p=>[l,...p]);setShowAdd(false);fire(t(`"${l.name}" added successfully!`,`تم إضافة "${l.nameAr}" بنجاح!`));}}/>}
      {viewLead&&<LeadModal lead={viewLead} lang={lang} isRTL={isRTL} t={t} onClose={()=>setViewLead(null)}
        onSave={u=>{setLeads(p=>p.map(l=>l.id===u.id?u:l));setViewLead(null);fire(t("Lead updated!","تم تحديث العميل!"));}}
        onBookTrial={l=>setTrialLead(l)} onSendPayment={l=>setPayLead(l)}/>}
      {trialLead&&<BookTrialModal lead={trialLead} lang={lang} isRTL={isRTL} t={t} onClose={()=>setTrialLead(null)} onConfirm={()=>{setTrialLead(null);fire(t("Trial class booked!","تم حجز الحصة التجريبية!"));}}/>}
      {payLead&&<PaymentLinkModal lead={payLead} lang={lang} isRTL={isRTL} t={t} onClose={()=>setPayLead(null)} onConfirm={()=>{setPayLead(null);fire(t("Payment link sent!","تم إرسال رابط الدفع!"));}}/>}
      {toast&&<Toast msg={toast} onClose={()=>setToast(null)}/>}
    </>
  );
}