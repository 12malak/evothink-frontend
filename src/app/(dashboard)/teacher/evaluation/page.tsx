"use client";

import { useState } from "react";
import { useLanguage } from "@/src/contexts/LanguageContext";

// ─── Types ────────────────────────────────────────────────────
type EvalStatus  = "pending" | "submitted" | "draft";
type EvalType    = "trial" | "normal";
type SkillRating = 1|2|3|4|5;
type FilterTab   = "all"|"pending"|"submitted"|"draft";

interface Feature { id:string; en:string; ar:string; }
interface Eval {
  id:string; student:string; studentAr?:string; avatar:string;
  level:string; newLevel:string; classDate:string; classTime:string;
  type:EvalType; status:EvalStatus; subject:string; subjectAr:string;
  strengths:Feature[]; weaknesses:Feature[]; notes:string;
  skills:{speaking:SkillRating;listening:SkillRating;reading:SkillRating;writing:SkillRating;vocabulary:SkillRating};
  submittedAt?:string;
}

// ─── Data ─────────────────────────────────────────────────────
const INIT: Eval[] = [
  { id:"E001", student:"Omar Khalid",       studentAr:"عمر خالد",       avatar:"OK", level:"A1", newLevel:"A1", classDate:"2025-03-24", classTime:"11:00 AM", type:"trial",  status:"pending",   subject:"Placement Test",      subjectAr:"اختبار تحديد مستوى",
    strengths:[{id:"s1",en:"Good pronunciation",ar:"نطق جيد"},{id:"s2",en:"Motivated learner",ar:"متحمس للتعلم"}],
    weaknesses:[{id:"w1",en:"Limited vocabulary",ar:"مفردات محدودة"},{id:"w2",en:"Grammar gaps",ar:"فجوات نحوية"}],
    notes:"Omar shows strong enthusiasm. Recommend A1 structured program.",
    skills:{speaking:2,listening:3,reading:2,writing:1,vocabulary:2}},
  { id:"E002", student:"Noor Al-Amin",      studentAr:"نور الأمين",     avatar:"NA", level:"A2", newLevel:"A2", classDate:"2025-03-24", classTime:"05:00 PM", type:"trial",  status:"draft",     subject:"Placement Test",      subjectAr:"اختبار تحديد مستوى",
    strengths:[{id:"s1",en:"Good reading speed",ar:"سرعة قراءة جيدة"}],
    weaknesses:[{id:"w1",en:"Weak speaking",ar:"ضعف في المحادثة"},{id:"w2",en:"Spelling issues",ar:"أخطاء إملائية"}],
    notes:"Did not attend. Draft saved for rescheduling.",
    skills:{speaking:1,listening:2,reading:3,writing:2,vocabulary:2}},
  { id:"E003", student:"Sara Al-Rashid",    studentAr:"سارة الراشد",    avatar:"SA", level:"B2", newLevel:"B2", classDate:"2025-03-24", classTime:"09:00 AM", type:"normal", status:"submitted", subject:"English Speaking",     subjectAr:"محادثة إنجليزية",
    strengths:[{id:"s1",en:"Excellent intonation",ar:"تنغيم ممتاز"},{id:"s2",en:"Wide vocabulary",ar:"مفردات واسعة"},{id:"s3",en:"Confident speaker",ar:"متحدثة واثقة"}],
    weaknesses:[{id:"w1",en:"Occasional filler words",ar:"كلمات حشو أحياناً"}],
    notes:"Sara is progressing excellently. Recommend C1 after 3 more sessions.",
    skills:{speaking:5,listening:4,reading:4,writing:4,vocabulary:5}, submittedAt:"2025-03-24 10:15 AM"},
  { id:"E004", student:"Reem Al-Jabri",     studentAr:"ريم الجابري",    avatar:"RJ", level:"A1", newLevel:"A1", classDate:"2025-03-25", classTime:"02:00 PM", type:"trial",  status:"pending",   subject:"Placement Test",      subjectAr:"اختبار تحديد مستوى",
    strengths:[{id:"s1",en:"Attentive listener",ar:"مستمعة منتبهة"}],
    weaknesses:[{id:"w1",en:"No prior English",ar:"لا خبرة سابقة"},{id:"w2",en:"Low confidence",ar:"ثقة منخفضة"}],
    notes:"",skills:{speaking:1,listening:2,reading:1,writing:1,vocabulary:1}},
  { id:"E005", student:"Layla Ahmad",       studentAr:"ليلى أحمد",      avatar:"LA", level:"B2", newLevel:"B2", classDate:"2025-03-23", classTime:"10:00 AM", type:"normal", status:"submitted", subject:"English Literature",   subjectAr:"أدب إنجليزي",
    strengths:[{id:"s1",en:"Strong analytical skills",ar:"قدرة تحليلية قوية"},{id:"s2",en:"Good written expression",ar:"تعبير كتابي جيد"}],
    weaknesses:[{id:"w1",en:"Reading speed",ar:"سرعة القراءة"}],
    notes:"Excellent engagement with literary texts.",
    skills:{speaking:4,listening:4,reading:3,writing:5,vocabulary:4}, submittedAt:"2025-03-23 11:30 AM"},
  { id:"E006", student:"Hani Saeed",        studentAr:"هاني سعيد",      avatar:"HS", level:"B1", newLevel:"B1", classDate:"2025-03-22", classTime:"09:00 AM", type:"normal", status:"submitted", subject:"Business English",     subjectAr:"إنجليزية الأعمال",
    strengths:[{id:"s1",en:"Professional vocabulary",ar:"مفردات مهنية"},{id:"s2",en:"Email writing",ar:"كتابة البريد"}],
    weaknesses:[{id:"w1",en:"Presentations",ar:"العروض التقديمية"},{id:"w2",en:"Phone English",ar:"الإنجليزية الهاتفية"}],
    notes:"Consistent and professional. Needs spoken presentation practice.",
    skills:{speaking:3,listening:4,reading:4,writing:4,vocabulary:3}, submittedAt:"2025-03-22 10:05 AM"},
];

// ─── Configs ──────────────────────────────────────────────────
const SC:Record<EvalStatus,{bg:string;text:string;border:string;dot:string;en:string;ar:string}> = {
  pending:  {bg:"#FEF3C7",text:"#D97706",border:"#FDE68A",dot:"#D97706",en:"Pending",  ar:"معلق"},
  submitted:{bg:"#D1FAE5",text:"#059669",border:"#6EE7B7",dot:"#059669",en:"Submitted",ar:"مُرسَل"},
  draft:    {bg:"#F1F5F9",text:"#64748B",border:"#CBD5E1",dot:"#94A3B8",en:"Draft",    ar:"مسودة"},
};
const TC:Record<EvalType,{bg:string;text:string;en:string;ar:string}> = {
  trial: {bg:"#FEF3C7",text:"#D97706",en:"Trial",ar:"تجريبية"},
  normal:{bg:"#E0F2FE",text:"#0369A1",en:"Normal",ar:"عادية"},
};
const LC:Record<string,{bg:string;text:string}> = {
  A1:{bg:"#f0fdf4",text:"#15803d"},A2:{bg:"#dcfce7",text:"#15803d"},
  B1:{bg:"#eff6ff",text:"#1d4ed8"},B2:{bg:"#dbeafe",text:"#1d4ed8"},
  C1:{bg:"#fdf4ff",text:"#7e22ce"},C2:{bg:"#f5f3ff",text:"#7e22ce"},
};
const LEVELS=["A1","A2","B1","B2","C1","C2"];
const AVT=[{bg:"#EBF5F7",text:"#107789"},{bg:"#ede9fe",text:"#7c3aed"},{bg:"#d1fae5",text:"#059669"},{bg:"#fef3c7",text:"#d97706"},{bg:"#fee2e2",text:"#ef4444"},{bg:"#e0f2fe",text:"#0369a1"}];
const avt=(s:string)=>AVT[(s.charCodeAt(0)+(s.charCodeAt(1)||0))%AVT.length];

const SKILL_LABELS:Record<string,{en:string;ar:string}> = {
  speaking:{en:"Speaking",ar:"المحادثة"}, listening:{en:"Listening",ar:"الاستماع"},
  reading:{en:"Reading",ar:"القراءة"},   writing:{en:"Writing",ar:"الكتابة"},
  vocabulary:{en:"Vocabulary",ar:"المفردات"},
};
const STR_SUGG:Feature[]=[
  {id:"ss1",en:"Good pronunciation",ar:"نطق جيد"},{id:"ss2",en:"Wide vocabulary",ar:"مفردات واسعة"},
  {id:"ss3",en:"Motivated learner",ar:"متحمس للتعلم"},{id:"ss4",en:"Strong reading",ar:"قراءة قوية"},
  {id:"ss5",en:"Good listening",ar:"استماع جيد"},{id:"ss6",en:"Fast learner",ar:"سريع التعلم"},
  {id:"ss7",en:"Confident speaker",ar:"متحدث واثق"},{id:"ss8",en:"Creative writing",ar:"كتابة إبداعية"},
];
const WEA_SUGG:Feature[]=[
  {id:"ws1",en:"Limited vocabulary",ar:"مفردات محدودة"},{id:"ws2",en:"Grammar gaps",ar:"فجوات نحوية"},
  {id:"ws3",en:"Weak speaking",ar:"ضعف في المحادثة"},{id:"ws4",en:"Reading speed",ar:"سرعة القراءة"},
  {id:"ws5",en:"Low confidence",ar:"ثقة منخفضة"},{id:"ws6",en:"Pronunciation",ar:"النطق"},
  {id:"ws7",en:"Spelling issues",ar:"أخطاء إملائية"},{id:"ws8",en:"Listening",ar:"فهم الاستماع"},
];
const genId=()=>`id-${Math.random().toString(36).slice(2,8)}`;

// ─── Atoms ────────────────────────────────────────────────────
function Av({i,size="md"}:{i:string;size?:"sm"|"md"|"lg"}){
  const c=avt(i); const d={sm:"w-7 h-7 text-[10px]",md:"w-9 h-9 text-xs",lg:"w-12 h-12 text-sm"}[size];
  return <div className={`${d} rounded-full flex items-center justify-center font-bold flex-shrink-0 select-none`} style={{backgroundColor:c.bg,color:c.text}}>{i}</div>;
}
function SPill({s,lang}:{s:EvalStatus;lang:string}){const c=SC[s];return <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold whitespace-nowrap" style={{backgroundColor:c.bg,color:c.text,border:`1px solid ${c.border}`}}><span className="w-1.5 h-1.5 rounded-full" style={{backgroundColor:c.dot}}/>{lang==="ar"?c.ar:c.en}</span>;}
function TPill({type,lang}:{type:EvalType;lang:string}){const c=TC[type];return <span className="inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold whitespace-nowrap" style={{backgroundColor:c.bg,color:c.text}}>{lang==="ar"?c.ar:c.en}</span>;}
function LBadge({level}:{level:string}){const c=LC[level]||{bg:"#f1f5f9",text:"#64748b"};return <span className="inline-flex rounded-md px-2 py-0.5 text-[10px] font-black tracking-wider" style={{backgroundColor:c.bg,color:c.text}}>{level}</span>;}
function PBar({val,color,delay=0}:{val:number;color:string;delay?:number}){return <div className="h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden"><div className="h-full rounded-full" style={{width:`${val}%`,backgroundColor:color,transition:`width .7s ${delay}s ease`}}/></div>;}
function Stars({val,onChange,readonly=false}:{val:SkillRating;onChange?:(v:SkillRating)=>void;readonly?:boolean}){
  return <div className="flex gap-0.5">{[1,2,3,4,5].map(n=>(
    <button key={n} type="button" onClick={()=>!readonly&&onChange&&onChange(n as SkillRating)}
      className={`transition-all ${readonly?"cursor-default":"hover:scale-125 cursor-pointer active:scale-110"}`}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill={n<=val?"#d97706":"#E2E8F0"} stroke={n<=val?"#d97706":"#CBD5E1"} strokeWidth="1.5">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    </button>
  ))}</div>;
}

// ─── Icons ────────────────────────────────────────────────────
const IC={
  close:  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  edit:   <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  eye:    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  send:   <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
  plus:   <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  trash:  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>,
  ok:     <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>,
  up:     <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="18 15 12 9 6 15"/></svg>,
  dn:     <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>,
  search: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  cal:    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  clip:   <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  star:   <svg width="14" height="14" viewBox="0 0 24 24" fill="#d97706" stroke="#d97706" strokeWidth="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  spinner:<svg className="animate-spin" width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="white" strokeWidth="2" strokeOpacity="0.3"/><path d="M7 1.5a5.5 5.5 0 015.5 5.5" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>,
};

// ─── Backdrop — bottom sheet mobile, centered desktop ─────────
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
  return <div className="fixed bottom-5 end-5 z-[60] flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl text-sm font-semibold max-w-[calc(100vw-2.5rem)]"
    style={{backgroundColor:c.bg,border:`1px solid ${c.br}`,color:c.tx,animation:"slideUp .3s cubic-bezier(.34,1.56,.64,1) both"}}>
    {IC.ok}<span className="flex-1 min-w-0 truncate">{msg}</span>
    <button onClick={onClose} className="opacity-50 hover:opacity-100">{IC.close}</button>
  </div>;
}

// ═══════════════════════════════════════════════════
// VIEW MODAL — wide 2-column
// ═══════════════════════════════════════════════════
function ViewModal({ev,lang,isRTL,t,onClose,onEdit}:{ev:Eval;lang:string;isRTL:boolean;t:(a:string,b:string)=>string;onClose:()=>void;onEdit:(e:Eval)=>void}){
  const lc=LC[ev.newLevel]||{bg:"#f1f5f9",text:"#64748b"};
  const avgSkill=Math.round(Object.values(ev.skills).reduce((a,b)=>a+b,0)/5);
  const name=lang==="ar"?(ev.studentAr||ev.student):ev.student;

  return(
    <Backdrop onClose={onClose} wide>
      <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full overflow-hidden"
        dir={isRTL?"rtl":"ltr"} style={{maxHeight:"91vh",overflowY:"auto"}}>
        <div className="h-1.5" style={{background:`linear-gradient(90deg,${SC[ev.status].dot},#E8763A,transparent)`}}/>

        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-[#F1F5F9]">
          <div className="flex items-center gap-3">
            <Av i={ev.avatar} size="md"/>
            <div>
              <h2 className="text-base font-black text-[#1e293b]">{name}</h2>
              <p className="text-xs text-[#94a3b8] mt-0.5">{lang==="ar"?ev.subjectAr:ev.subject} · {ev.classDate}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#F5F7F9] text-[#94a3b8] hover:bg-[#E2E8F0] transition-all">{IC.close}</button>
        </div>

        {/* Badges row */}
        <div className="flex flex-wrap gap-2 px-5 sm:px-6 py-3 border-b border-[#F1F5F9] bg-[#FAFBFC]">
          <SPill s={ev.status} lang={lang}/>
          <TPill type={ev.type} lang={lang}/>
          <LBadge level={ev.level}/>
          {ev.newLevel!==ev.level&&<><span className="text-[10px] text-[#94a3b8]">→</span><LBadge level={ev.newLevel}/></>}
          <div className="ms-auto flex items-center gap-1">{IC.star}<span className="text-[11px] font-black text-[#d97706]">{avgSkill}/5</span></div>
        </div>

        {/* 2-column body */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x divide-[#F1F5F9]">

          {/* LEFT: Skills + strengths + weaknesses */}
          <div className="p-5 sm:p-6 space-y-5 overflow-y-auto">
            <div>
              <p className="text-xs font-black text-[#94a3b8] uppercase tracking-widest mb-3">{t("Skills Assessment","تقييم المهارات")}</p>
              <div className="space-y-3">
                {Object.entries(ev.skills).map(([key,val])=>(
                  <div key={key} className="flex items-center gap-3">
                    <span className="text-xs text-[#64748b] w-20 flex-shrink-0">{lang==="ar"?SKILL_LABELS[key].ar:SKILL_LABELS[key].en}</span>
                    <div className="flex-1"><PBar val={(val/5)*100} color={val>=4?"#059669":val>=3?"#107789":val>=2?"#d97706":"#ef4444"}/></div>
                    <Stars val={val as SkillRating} readonly/>
                    <span className="text-xs font-bold text-[#1e293b] w-4">{val}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-black text-[#94a3b8] uppercase tracking-widest mb-2">{t("Strengths","نقاط القوة")}</p>
              <div className="space-y-1.5">
                {ev.strengths.map(s=>(
                  <div key={s.id} className="flex items-center gap-2 text-xs text-[#059669] bg-[#f0fdf4] rounded-xl px-3 py-2">
                    {IC.up}<span className="font-medium">{lang==="ar"?s.ar:s.en}</span>
                  </div>
                ))}
                {ev.strengths.length===0&&<p className="text-xs text-[#94a3b8] italic">{t("None added","لم تُضف")}</p>}
              </div>
            </div>

            <div>
              <p className="text-xs font-black text-[#94a3b8] uppercase tracking-widest mb-2">{t("Weaknesses","نقاط الضعف")}</p>
              <div className="space-y-1.5">
                {ev.weaknesses.map(w=>(
                  <div key={w.id} className="flex items-center gap-2 text-xs text-[#ef4444] bg-[#fef2f2] rounded-xl px-3 py-2">
                    {IC.dn}<span className="font-medium">{lang==="ar"?w.ar:w.en}</span>
                  </div>
                ))}
                {ev.weaknesses.length===0&&<p className="text-xs text-[#94a3b8] italic">{t("None added","لم تُضف")}</p>}
              </div>
            </div>
          </div>

          {/* RIGHT: Details + notes */}
          <div className="p-5 sm:p-6 space-y-5">
            <div>
              <p className="text-xs font-black text-[#94a3b8] uppercase tracking-widest mb-3">{t("Details","التفاصيل")}</p>
              <div className="space-y-2">
                {[
                  {lbl:t("Date","التاريخ"),             val:ev.classDate},
                  {lbl:t("Time","الوقت"),                val:ev.classTime},
                  {lbl:t("Current Level","المستوى"),    val:ev.level},
                  {lbl:t("Recommended","المستوى المقترح"),val:ev.newLevel},
                ].map(r=>(
                  <div key={r.lbl} className="rounded-xl bg-[#F8FAFC] border border-[#F1F5F9] px-3 py-2.5">
                    <p className="text-[10px] text-[#94a3b8] font-semibold uppercase tracking-wide">{r.lbl}</p>
                    <p className="text-xs font-bold text-[#1e293b] mt-0.5">{r.val}</p>
                  </div>
                ))}
                {ev.submittedAt&&(
                  <div className="rounded-xl bg-[#f0fdf4] border border-[#bbf7d0] px-3 py-2.5">
                    <p className="text-[10px] text-[#059669] font-semibold uppercase tracking-wide">{t("Submitted At","أُرسل في")}</p>
                    <p className="text-xs font-bold text-[#059669] mt-0.5">{ev.submittedAt}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-2xl bg-[#FFFBEB] border border-[#FDE68A] p-4 flex-1">
              <div className="flex items-center gap-1.5 mb-2">
                <span className="text-[#d97706]">{IC.clip}</span>
                <p className="text-[10px] font-bold uppercase tracking-wide text-[#d97706]">{t("Teacher Notes","ملاحظات المعلم")}</p>
              </div>
              <p className="text-sm text-[#64748b] leading-relaxed">{ev.notes||t("No notes.","لا توجد ملاحظات.")}</p>
            </div>

            {ev.status!=="submitted"&&(
              <button onClick={()=>{onEdit(ev);onClose();}}
                className="w-full py-2.5 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 hover:opacity-90 active:scale-[.98] transition-all"
                style={{backgroundColor:"#107789"}}>
                {IC.edit}{t("Edit Evaluation","تعديل التقييم")}
              </button>
            )}
          </div>
        </div>
      </div>
    </Backdrop>
  );
}

// ═══════════════════════════════════════════════════
// EDIT / CREATE MODAL — wide 2-column, scrollable
// ═══════════════════════════════════════════════════
function EditModal({ev,lang,isRTL,t,onClose,onSave}:{ev:Eval|null;lang:string;isRTL:boolean;t:(a:string,b:string)=>string;onClose:()=>void;onSave:(e:Eval,submit:boolean)=>void}){
  const isNew=!ev;
  const [form,setForm]=useState<Eval>(ev??{
    id:genId(),student:"",avatar:"",level:"A1",newLevel:"A1",
    classDate:new Date().toISOString().slice(0,10),classTime:"09:00 AM",
    type:"trial",status:"draft",subject:"Placement Test",subjectAr:"اختبار تحديد مستوى",
    strengths:[],weaknesses:[],notes:"",
    skills:{speaking:3,listening:3,reading:3,writing:3,vocabulary:3},
  });
  const [errors,setErrors]=useState<string[]>([]);
  const [newStr,setNewStr]=useState(""); const [newWea,setNewWea]=useState("");
  const [loading,setLoading]=useState<"draft"|"submit"|null>(null);

  const setSkill=(key:string,val:SkillRating)=>setForm(p=>({...p,skills:{...p.skills,[key]:val}}));
  const addStr=(en:string,ar:string)=>{ if(!en.trim())return; setForm(p=>({...p,strengths:[...p.strengths,{id:genId(),en,ar:ar||en}]})); setNewStr(""); };
  const addWea=(en:string,ar:string)=>{ if(!en.trim())return; setForm(p=>({...p,weaknesses:[...p.weaknesses,{id:genId(),en,ar:ar||en}]})); setNewWea(""); };

  const validate=()=>{
    const e:string[]=[];
    if(!form.student.trim()) e.push(t("Student name is required.","اسم الطالب مطلوب."));
    setErrors(e); return e.length===0;
  };
  const handleSave=async(submit:boolean)=>{
    if(!validate()) return;
    setLoading(submit?"submit":"draft");
    await new Promise(r=>setTimeout(r,800));
    setLoading(null);
    onSave({...form,status:submit?"submitted":form.status==="submitted"?"submitted":"draft",
      avatar:form.student.slice(0,2).toUpperCase(),
      submittedAt:submit?new Date().toLocaleString():form.submittedAt},submit);
  };

  const inp="w-full px-3 py-2.5 text-sm border border-[#E2E8F0] rounded-xl bg-white text-[#1e293b] focus:outline-none focus:border-[#107789] focus:ring-1 focus:ring-[#107789]/20 transition-all";
  const lbl="block text-xs font-semibold text-[#64748b] mb-1.5";

  return(
    <Backdrop onClose={onClose} wide>
      <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full overflow-hidden"
        dir={isRTL?"rtl":"ltr"} style={{maxHeight:"92vh",overflowY:"auto"}}>
        <div className="h-1.5" style={{background:"linear-gradient(90deg,#107789,#E8763A)"}}/>

        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-[#F1F5F9]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EBF5F7] flex items-center justify-center text-[#107789]">{IC.edit}</div>
            <div>
              <h2 className="text-base font-black text-[#1e293b]">{isNew?t("New Evaluation","تقييم جديد"):t("Edit Evaluation","تعديل التقييم")}</h2>
              <p className="text-xs text-[#94a3b8] mt-0.5">{form.student||t("Fill in the form below","أدخل التفاصيل أدناه")}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#F5F7F9] text-[#94a3b8] hover:bg-[#E2E8F0] transition-all">{IC.close}</button>
        </div>

        {/* 2-column body — stacked on mobile, side-by-side on md+ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x divide-[#F1F5F9]">

          {/* LEFT: Basic info + Skills */}
          <div className="p-5 sm:p-6 space-y-4">
            <p className="text-xs font-black text-[#94a3b8] uppercase tracking-widest">{t("Basic Information","المعلومات الأساسية")}</p>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={lbl}>{t("Student Name *","اسم الطالب *")}</label>
                <input className={inp} value={form.student} onChange={e=>setForm(p=>({...p,student:e.target.value,avatar:e.target.value.slice(0,2).toUpperCase()}))} placeholder="e.g. Omar Khalid"/>
              </div>
              <div>
                <label className={lbl}>{t("Class Date","تاريخ الحصة")}</label>
                <input type="date" className={inp} value={form.classDate} onChange={e=>setForm(p=>({...p,classDate:e.target.value}))}/>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={lbl}>{t("Current Level","المستوى الحالي")}</label>
                <select className={inp} value={form.level} onChange={e=>setForm(p=>({...p,level:e.target.value}))}>
                  {LEVELS.map(l=><option key={l}>{l}</option>)}
                </select>
              </div>
              <div>
                <label className={lbl}>{t("Recommended Level","المستوى المقترح")}</label>
                <select className={inp} value={form.newLevel} onChange={e=>setForm(p=>({...p,newLevel:e.target.value}))}>
                  {LEVELS.map(l=><option key={l}>{l}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className={lbl}>{t("Class Type","نوع الحصة")}</label>
              <div className="flex gap-2">
                {(["trial","normal"] as EvalType[]).map(tp=>(
                  <button key={tp} type="button" onClick={()=>setForm(p=>({...p,type:tp}))}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95 ${form.type===tp?"text-white":"border border-[#E2E8F0] text-[#64748b] hover:bg-[#F5F7F9]"}`}
                    style={form.type===tp?{backgroundColor:TC[tp].text}:{}}>
                    {lang==="ar"?TC[tp].ar:TC[tp].en}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className={lbl}>{t("Skills Assessment","تقييم المهارات")}</p>
              <div className="space-y-2.5">
                {Object.entries(form.skills).map(([key,val])=>(
                  <div key={key} className="flex items-center gap-3 bg-[#F8FAFC] rounded-xl px-3 py-2">
                    <span className="text-xs text-[#64748b] w-20 flex-shrink-0">{lang==="ar"?SKILL_LABELS[key].ar:SKILL_LABELS[key].en}</span>
                    <Stars val={val as SkillRating} onChange={v=>setSkill(key,v)}/>
                    <span className="text-xs font-bold text-[#1e293b] ms-auto">{val}/5</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: Strengths, Weaknesses, Notes */}
          <div className="p-5 sm:p-6 space-y-5">
            <p className="text-xs font-black text-[#94a3b8] uppercase tracking-widest">{t("Feedback","التغذية الراجعة")}</p>

            {/* Strengths */}
            <div>
              <p className={lbl}>{t("Strengths","نقاط القوة")}</p>
              <div className="space-y-1.5 mb-2 max-h-32 overflow-y-auto">
                {form.strengths.map(s=>(
                  <div key={s.id} className="flex items-center gap-2 bg-[#f0fdf4] rounded-xl px-3 py-2">
                    <span className="text-[#059669]">{IC.up}</span>
                    <span className="text-xs font-medium text-[#059669] flex-1 truncate">{lang==="ar"?s.ar:s.en}</span>
                    <button onClick={()=>setForm(p=>({...p,strengths:p.strengths.filter(x=>x.id!==s.id)}))} className="text-[#ef4444] opacity-50 hover:opacity-100 active:scale-90 transition-all">{IC.trash}</button>
                  </div>
                ))}
                {form.strengths.length===0&&<p className="text-xs text-[#94a3b8] italic">{t("None added yet.","لم تُضف بعد.")}</p>}
              </div>
              {/* Suggestions */}
              <div className="flex flex-wrap gap-1.5 mb-2">
                {STR_SUGG.filter(s=>!form.strengths.find(x=>x.en===s.en)).slice(0,4).map(s=>(
                  <button key={s.id} onClick={()=>addStr(s.en,s.ar)} className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-[#f0fdf4] text-[#059669] hover:bg-[#bbf7d0] active:scale-95 transition-all">
                    + {lang==="ar"?s.ar:s.en}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <input className={`${inp} text-xs py-2`} value={newStr} onChange={e=>setNewStr(e.target.value)}
                  placeholder={t("Custom strength…","نقطة قوة مخصصة…")}
                  onKeyDown={e=>{if(e.key==="Enter"){e.preventDefault();addStr(newStr,newStr);}}}/>
                <button onClick={()=>addStr(newStr,newStr)} className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#107789] text-white hover:bg-[#0d6275] active:scale-95 transition-all flex-shrink-0">{IC.plus}</button>
              </div>
            </div>

            {/* Weaknesses */}
            <div>
              <p className={lbl}>{t("Weaknesses","نقاط الضعف")}</p>
              <div className="space-y-1.5 mb-2 max-h-32 overflow-y-auto">
                {form.weaknesses.map(w=>(
                  <div key={w.id} className="flex items-center gap-2 bg-[#fef2f2] rounded-xl px-3 py-2">
                    <span className="text-[#ef4444]">{IC.dn}</span>
                    <span className="text-xs font-medium text-[#ef4444] flex-1 truncate">{lang==="ar"?w.ar:w.en}</span>
                    <button onClick={()=>setForm(p=>({...p,weaknesses:p.weaknesses.filter(x=>x.id!==w.id)}))} className="text-[#ef4444] opacity-50 hover:opacity-100 active:scale-90 transition-all">{IC.trash}</button>
                  </div>
                ))}
                {form.weaknesses.length===0&&<p className="text-xs text-[#94a3b8] italic">{t("None added yet.","لم تُضف بعد.")}</p>}
              </div>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {WEA_SUGG.filter(w=>!form.weaknesses.find(x=>x.en===w.en)).slice(0,4).map(w=>(
                  <button key={w.id} onClick={()=>addWea(w.en,w.ar)} className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-[#fef2f2] text-[#ef4444] hover:bg-[#fecaca] active:scale-95 transition-all">
                    + {lang==="ar"?w.ar:w.en}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <input className={`${inp} text-xs py-2`} value={newWea} onChange={e=>setNewWea(e.target.value)}
                  placeholder={t("Custom weakness…","نقطة ضعف مخصصة…")}
                  onKeyDown={e=>{if(e.key==="Enter"){e.preventDefault();addWea(newWea,newWea);}}}/>
                <button onClick={()=>addWea(newWea,newWea)} className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#ef4444] text-white hover:bg-[#dc2626] active:scale-95 transition-all flex-shrink-0">{IC.plus}</button>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className={lbl}>{t("Teacher Notes","ملاحظات المعلم")}</label>
              <textarea rows={4} className={`${inp} resize-none`} value={form.notes}
                onChange={e=>setForm(p=>({...p,notes:e.target.value}))}
                placeholder={t("Write your notes about the student's performance…","اكتب ملاحظاتك حول أداء الطالب…")}/>
            </div>

            {errors.length>0&&(
              <div className="rounded-xl bg-[#fef2f2] border border-[#fecaca] p-3">
                {errors.map((e,i)=><p key={i} className="text-xs text-[#ef4444] font-medium">{e}</p>)}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-wrap items-center justify-end gap-3 px-5 sm:px-6 py-4 border-t border-[#F1F5F9] bg-[#FAFBFC]">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm font-semibold border border-[#E2E8F0] text-[#64748b] hover:bg-[#F5F7F9] active:scale-95 transition-all">{t("Cancel","إلغاء")}</button>
          <button onClick={()=>handleSave(false)} disabled={loading!==null}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold border text-[#107789] hover:bg-[#EBF5F7] active:scale-95 transition-all"
            style={{borderColor:"#107789"}}>
            {loading==="draft"?<span className="flex items-center gap-2">{IC.spinner}{t("Saving…","جارٍ الحفظ…")}</span>:t("Save Draft","حفظ كمسودة")}
          </button>
          <button onClick={()=>handleSave(true)} disabled={loading!==null}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90 active:scale-[.98] transition-all"
            style={{backgroundColor:loading?"#5FA8B3":"#107789"}}>
            {loading==="submit"?<>{IC.spinner}{t("Submitting…","جارٍ الإرسال…")}</>:<>{IC.send}{t("Submit Evaluation","إرسال التقييم")}</>}
          </button>
        </div>
      </div>
    </Backdrop>
  );
}

// ─── Delete confirm ────────────────────────────────────────────
function DeleteConfirm({name,lang,isRTL,t,onClose,onConfirm}:{name:string;lang:string;isRTL:boolean;t:(a:string,b:string)=>string;onClose:()=>void;onConfirm:()=>void}){
  return(
    <Backdrop onClose={onClose}>
      <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full overflow-hidden" dir={isRTL?"rtl":"ltr"}>
        <div className="p-5 space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#fee2e2] flex items-center justify-center text-[#ef4444] flex-shrink-0">{IC.trash}</div>
            <div>
              <h2 className="text-base font-bold text-[#1e293b]">{t("Delete Evaluation","حذف التقييم")}</h2>
              <p className="text-sm text-[#64748b] mt-1">{t("Delete evaluation for","حذف تقييم")} <strong>{name}</strong>? <span className="text-[#ef4444] text-xs font-medium">{t("Cannot be undone.","لا يمكن التراجع.")}</span></p>
            </div>
          </div>
        </div>
        <div className="flex gap-3 px-5 pb-5">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-semibold border border-[#E2E8F0] text-[#64748b] hover:bg-[#F5F7F9] active:scale-95 transition-all">{t("No, keep","لا، احتفظ")}</button>
          <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90 active:scale-95 transition-all" style={{backgroundColor:"#ef4444"}}>{t("Yes, Delete","نعم، احذف")}</button>
        </div>
      </div>
    </Backdrop>
  );
}

// ─── Eval Card ────────────────────────────────────────────────
function EvalCard({ev,idx,lang,t,onView,onEdit,onSubmit,onDelete}:{
  ev:Eval;idx:number;lang:string;t:(a:string,b:string)=>string;
  onView:(e:Eval)=>void;onEdit:(e:Eval)=>void;onSubmit:(id:string)=>void;onDelete:(e:Eval)=>void;
}){
  const sc=SC[ev.status];
  const avgSkill=Math.round(Object.values(ev.skills).reduce((a,b)=>a+b,0)/5);
  const name=lang==="ar"?(ev.studentAr||ev.student):ev.student;

  return(
    <div className="group relative bg-white rounded-2xl border border-[#F1F5F9] overflow-hidden hover:shadow-lg hover:border-[#b2dce4] transition-all duration-300"
      style={{animation:`cardIn .4s ${idx*.07}s cubic-bezier(.34,1.2,.64,1) both`}}>
      <div className="h-0.5 group-hover:h-1 transition-all duration-300" style={{backgroundColor:sc.dot}}/>

      <div className="p-4 sm:p-5 space-y-3.5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Av i={ev.avatar} size="md"/>
            <div className="min-w-0">
              <p className="text-sm font-bold text-[#1e293b] truncate">{name}</p>
              <p className="text-xs text-[#94a3b8] mt-0.5 truncate">{lang==="ar"?ev.subjectAr:ev.subject}</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
            <SPill s={ev.status} lang={lang}/>
            <TPill type={ev.type} lang={lang}/>
          </div>
        </div>

        {/* Date + level */}
        <div className="flex items-center gap-2 flex-wrap text-xs text-[#94a3b8]">
          <div className="flex items-center gap-1">{IC.cal}<span>{ev.classDate} · {ev.classTime}</span></div>
          <span className="text-[#E2E8F0]">·</span>
          <LBadge level={ev.level}/>
          {ev.newLevel!==ev.level&&<><span className="text-[10px]">→</span><LBadge level={ev.newLevel}/></>}
        </div>

        {/* Skills mini */}
        <div className="space-y-1.5">
          {Object.entries(ev.skills).slice(0,3).map(([key,val],i)=>(
            <div key={key} className="flex items-center gap-2">
              <span className="text-[10px] text-[#94a3b8] w-16 flex-shrink-0">{lang==="ar"?SKILL_LABELS[key].ar:SKILL_LABELS[key].en}</span>
              <div className="flex-1"><PBar val={(val/5)*100} color={val>=4?"#059669":val>=3?"#107789":val>=2?"#d97706":"#ef4444"} delay={.2+i*.08}/></div>
              <span className="text-[10px] font-bold w-4 text-[#64748b]">{val}</span>
            </div>
          ))}
        </div>

        {/* Counts + avg */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#d1fae5] text-[#059669]">{IC.up}{ev.strengths.length} {t("str.","نقاط قوة")}</span>
          <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#fee2e2] text-[#ef4444]">{IC.dn}{ev.weaknesses.length} {t("wea.","نقاط ضعف")}</span>
          <span className="ms-auto flex items-center gap-0.5">{IC.star}<span className="text-[11px] font-black text-[#d97706]">{avgSkill}/5</span></span>
        </div>

        {ev.notes&&<p className="text-xs text-[#64748b] italic line-clamp-2 border-s-2 border-[#E2E8F0] ps-2">"{ev.notes}"</p>}

        {/* Actions */}
        <div className="flex items-center gap-2 pt-2 border-t border-[#F8FAFC]">
          <button onClick={()=>onView(ev)} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-[#E2E8F0] text-[#64748b] hover:bg-[#F1F5F9] active:scale-95 transition-all flex-1 justify-center">{IC.eye}{t("View","عرض")}</button>
          {ev.status!=="submitted"&&(
            <button onClick={()=>onEdit(ev)} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-[#E2E8F0] text-[#107789] hover:bg-[#EBF5F7] active:scale-95 transition-all flex-1 justify-center">{IC.edit}{t("Edit","تعديل")}</button>
          )}
          {ev.status!=="submitted"&&(
            <button onClick={()=>onSubmit(ev.id)} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-white hover:opacity-90 active:scale-95 transition-all flex-1 justify-center" style={{backgroundColor:"#107789"}}>{IC.send}{t("Submit","إرسال")}</button>
          )}
          {ev.status==="submitted"&&<div className="flex items-center gap-1 text-[10px] text-[#059669] font-semibold ms-auto">{IC.ok}{t("Sent","أُرسل")}</div>}
          <button onClick={()=>onDelete(ev)} className="w-8 h-8 flex items-center justify-center rounded-xl border border-[#fecaca] text-[#ef4444] hover:bg-[#fee2e2] active:scale-95 transition-all flex-shrink-0">{IC.trash}</button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// PAGE
// ═══════════════════════════════════════════════════
export default function TeacherEvaluations(){
  const {lang,isRTL,t}=useLanguage();
  const [evals,setEvals]=useState<Eval[]>(INIT);
  const [filter,setFilter]=useState<FilterTab>("all");
  const [search,setSearch]=useState("");
  const [viewEv,setViewEv]=useState<Eval|null>(null);
  const [editEv,setEditEv]=useState<Eval|null|"new">(null);
  const [delEv,setDelEv]=useState<Eval|null>(null);
  const [toast,setToast]=useState<{msg:string;type:"success"|"info"|"error"}|null>(null);

  const fire=(msg:string,type:"success"|"info"|"error"="success")=>{setToast({msg,type});setTimeout(()=>setToast(null),3500);};

  const handleSave=(updated:Eval,submit:boolean)=>{
    setEvals(p=>{const i=p.findIndex(e=>e.id===updated.id);return i>=0?p.map(e=>e.id===updated.id?updated:e):[updated,...p];});
    setEditEv(null);
    fire(submit?t("Evaluation submitted!","تم إرسال التقييم!"):t("Draft saved.","تم حفظ المسودة."),submit?"success":"info");
  };
  const handleSubmit=(id:string)=>{
    setEvals(p=>p.map(e=>e.id===id?{...e,status:"submitted",submittedAt:new Date().toLocaleString()}:e));
    fire(t("Evaluation submitted!","تم إرسال التقييم!"),"success");
  };
  const handleDelete=()=>{
    if(!delEv) return;
    setEvals(p=>p.filter(e=>e.id!==delEv.id)); setDelEv(null);
    fire(t("Evaluation deleted.","تم حذف التقييم."),"error");
  };

  const filtered=evals.filter(e=>{
    const mf=filter==="all"||e.status===filter;
    const q=search.toLowerCase();
    const ms=!q||e.student.toLowerCase().includes(q)||e.subject.toLowerCase().includes(q)||(e.studentAr&&e.studentAr.includes(q));
    return mf&&ms;
  });

  const stats=[
    {icon:"📋",val:evals.length,                                             label:t("Total","الإجمالي"),   color:"#107789",bg:"#EBF5F7",delay:0},
    {icon:"⏳",val:evals.filter(e=>e.status==="pending").length,             label:t("Pending","معلقة"),    color:"#D97706",bg:"#FEF3C7",delay:.06},
    {icon:"✅",val:evals.filter(e=>e.status==="submitted").length,           label:t("Submitted","مُرسَلة"),color:"#059669",bg:"#D1FAE5",delay:.12},
    {icon:"🎯",val:evals.filter(e=>e.type==="trial").length,                 label:t("Trials","تجريبية"),   color:"#D97706",bg:"#FEF3C7",delay:.18},
  ];

  const FILTERS:[FilterTab,string,string,number][]=[
    ["all",t("All","الكل"),t("All","الكل"),evals.length],
    ["pending",t("Pending","معلقة"),t("Pending","معلقة"),evals.filter(e=>e.status==="pending").length],
    ["submitted",t("Submitted","مُرسَلة"),t("Submitted","مُرسَلة"),evals.filter(e=>e.status==="submitted").length],
    ["draft",t("Draft","مسودة"),t("Draft","مسودة"),evals.filter(e=>e.status==="draft").length],
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
            <h1 className="text-xl sm:text-2xl font-black text-[#1e293b] tracking-tight">{t("Evaluations","التقييمات")}</h1>
            <p className="mt-1 text-xs sm:text-sm text-[#94a3b8]">{t("Manage student evaluations and trial assessments","إدارة تقييمات الطلاب والحصص التجريبية")}</p>
          </div>
          <button onClick={()=>setEditEv("new")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90 active:scale-95 transition-all shadow-sm"
            style={{backgroundColor:"#107789",animation:"cardIn .4s .05s both"}}>
            {IC.plus}{t("New Evaluation","تقييم جديد")}
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {stats.map(s=>(
            <div key={s.label} className="bg-white rounded-2xl border border-[#F1F5F9] shadow-sm p-4 sm:p-5 flex items-center gap-3 hover:shadow-md hover:border-[#b2dce4] transition-all duration-300"
              style={{animation:`cardIn .45s ${s.delay}s cubic-bezier(.34,1.2,.64,1) both`}}>
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center flex-shrink-0 text-xl" style={{backgroundColor:s.bg}}>{s.icon}</div>
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

        {/* Empty */}
        {filtered.length===0&&(
          <div className="bg-white rounded-2xl border border-[#F1F5F9] shadow-sm p-16 flex flex-col items-center gap-3 text-center" style={{animation:"fadeIn .4s both"}}>
            <div className="w-14 h-14 rounded-2xl bg-[#EBF5F7] flex items-center justify-center text-[#107789] mb-1">{IC.clip}</div>
            <p className="text-base font-bold text-[#1e293b]">{t("No evaluations found","لا توجد تقييمات")}</p>
            <p className="text-sm text-[#94a3b8]">{t("Adjust filters or create one.","جرّب تعديل الفلاتر أو أنشئ تقييمًا.")}</p>
            <button onClick={()=>setEditEv("new")} className="mt-2 flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90 active:scale-95 transition-all" style={{backgroundColor:"#107789"}}>{IC.plus}{t("New Evaluation","تقييم جديد")}</button>
          </div>
        )}

        {/* Cards */}
        {filtered.length>0&&(
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((ev,i)=>(
              <EvalCard key={ev.id} ev={ev} idx={i} lang={lang} t={t}
                onView={setViewEv} onEdit={e=>setEditEv(e)} onSubmit={handleSubmit} onDelete={setDelEv}/>
            ))}
          </div>
        )}

      </main>

      {viewEv&&<ViewModal ev={viewEv} lang={lang} isRTL={isRTL} t={t} onClose={()=>setViewEv(null)} onEdit={e=>{setViewEv(null);setEditEv(e);}}/>}
      {editEv!==null&&<EditModal ev={editEv==="new"?null:editEv} lang={lang} isRTL={isRTL} t={t} onClose={()=>setEditEv(null)} onSave={handleSave}/>}
      {delEv&&<DeleteConfirm name={lang==="ar"?(delEv.studentAr||delEv.student):delEv.student} lang={lang} isRTL={isRTL} t={t} onClose={()=>setDelEv(null)} onConfirm={handleDelete}/>}
      {toast&&<Toast msg={toast.msg} type={toast.type} onClose={()=>setToast(null)}/>}
    </>
  );
}