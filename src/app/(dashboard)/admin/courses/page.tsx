"use client";

import { useState } from "react";
import { useLanguage } from "@/src/contexts/LanguageContext";

// ─── Types ────────────────────────────────────────────────────
type CourseStatus = "Published" | "Draft" | "Archived";

interface Level {
  id: string; titleEn: string; titleAr: string;
  lessons: number; status: CourseStatus;
}
interface Course {
  id: string; titleEn: string; titleAr: string;
  levels: Level[]; totalStudents: number;
  status: CourseStatus; createdAt: string;
}

// ─── Status config ────────────────────────────────────────────
const SC: Record<CourseStatus,{bg:string;text:string;border:string;dot:string;en:string;ar:string}> = {
  Published: {bg:"#d1fae5",text:"#059669",border:"#6ee7b7",dot:"#059669",en:"Published",ar:"منشور"},
  Draft:     {bg:"#fef3c7",text:"#d97706",border:"#fde68a",dot:"#d97706",en:"Draft",    ar:"مسودة"},
  Archived:  {bg:"#f1f5f9",text:"#64748b",border:"#e2e8f0",dot:"#94a3b8",en:"Archived", ar:"مؤرشف"},
};

// ─── Lesson components sidebar ────────────────────────────────
const LESSON_COMPS = [
  {key:"vocab",     en:"Vocabulary & Grammar",  ar:"المفردات والقواعد",   icon:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>},
  {key:"listening", en:"Listening & Practice",  ar:"الاستماع والتدريب",   icon:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>},
  {key:"quizzes",   en:"Quizzes",               ar:"الاختبارات",           icon:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>},
  {key:"speaking",  en:"Speaking Sessions",     ar:"جلسات المحادثة",       icon:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>},
];

// ─── Mock data ────────────────────────────────────────────────
const INITIAL: Course[] = [
  { id:"CRS-001", titleEn:"English Foundation", titleAr:"أساسيات اللغة الإنجليزية", totalStudents:420, status:"Published", createdAt:"Jan 2025",
    levels:[
      {id:"L1",titleEn:"Beginner A1",        titleAr:"مبتدئ A1",          lessons:12,status:"Published"},
      {id:"L2",titleEn:"Elementary A2",      titleAr:"أساسي A2",          lessons:14,status:"Published"},
      {id:"L3",titleEn:"Pre-Intermediate B1",titleAr:"ما قبل المتوسط B1", lessons:16,status:"Published"},
      {id:"L4",titleEn:"Intermediate B2",    titleAr:"متوسط B2",          lessons:18,status:"Draft"},
    ]},
  { id:"CRS-002", titleEn:"IELTS Preparation", titleAr:"تحضير IELTS", totalStudents:185, status:"Published", createdAt:"Feb 2025",
    levels:[
      {id:"L1",titleEn:"Band 5.0",titleAr:"Band 5.0",lessons:10,status:"Published"},
      {id:"L2",titleEn:"Band 6.0",titleAr:"Band 6.0",lessons:12,status:"Published"},
      {id:"L3",titleEn:"Band 7.0",titleAr:"Band 7.0",lessons:14,status:"Draft"},
      {id:"L4",titleEn:"Band 8.0+",titleAr:"Band 8.0+",lessons:10,status:"Draft"},
    ]},
  { id:"CRS-003", titleEn:"Business English", titleAr:"الإنجليزية التجارية", totalStudents:98, status:"Draft", createdAt:"Mar 2025",
    levels:[
      {id:"L1",titleEn:"Core Skills",titleAr:"المهارات الأساسية",lessons:8,status:"Draft"},
      {id:"L2",titleEn:"Advanced",  titleAr:"متقدم",             lessons:10,status:"Draft"},
    ]},
];

const genId = (prefix:string) => `${prefix}-${Math.floor(Math.random()*900)+100}`;
const fmtDate = () => new Date().toLocaleDateString("en-US",{month:"short",year:"numeric"});

// ─── Icons ────────────────────────────────────────────────────
const IC={
  close:  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  ok:     <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>,
  plus:   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  edit:   <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  trash:  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>,
  book:   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
  chevD:  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>,
  spinner:<svg className="animate-spin" width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="2" strokeOpacity="0.3"/><path d="M7 1.5a5.5 5.5 0 015.5 5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>,
};

// ─── Backdrop — always centered wide ────────────────────────
function Backdrop({onClose,children}:{onClose:()=>void;children:React.ReactNode}){
  return(
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6"
      style={{backgroundColor:"rgba(11,44,51,.48)",backdropFilter:"blur(4px)"}}
      onClick={onClose}>
      <div className="w-full sm:w-auto sm:min-w-[580px]" onClick={e=>e.stopPropagation()}
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

// ─── Shared input style ───────────────────────────────────────
const inpBase="w-full px-3 py-2.5 text-sm border rounded-xl bg-white text-[#1e293b] placeholder:text-[#C4CAD4] focus:outline-none focus:ring-1 transition-all";
const inpOk  =`${inpBase} border-[#E2E8F0] focus:border-[#107789] focus:ring-[#107789]/20`;
const inpErr =`${inpBase} border-[#fca5a5] focus:border-[#ef4444] focus:ring-[#ef4444]/20`;

// ─── Status pill ──────────────────────────────────────────────
function SPill({s,lang}:{s:CourseStatus;lang:string}){
  const c=SC[s];
  return(
    <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold whitespace-nowrap"
      style={{backgroundColor:c.bg,color:c.text,border:`1px solid ${c.border}`}}>
      <span className="w-1.5 h-1.5 rounded-full" style={{backgroundColor:c.dot}}/>
      {lang==="ar"?c.ar:c.en}
    </span>
  );
}

// ─── Status selector ─────────────────────────────────────────
function StatusSelector({value,onChange,statuses,lang}:{value:CourseStatus;onChange:(s:CourseStatus)=>void;statuses:CourseStatus[];lang:string}){
  return(
    <div className="flex gap-2">
      {statuses.map(s=>{
        const c=SC[s];
        const active=value===s;
        return(
          <button key={s} type="button" onClick={()=>onChange(s)}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition-all active:scale-95 ${active?"":"border-[#E2E8F0] text-[#94a3b8] hover:bg-[#F8FAFC]"}`}
            style={active?{backgroundColor:c.bg,color:c.text,borderColor:c.border}:{}}>
            {lang==="ar"?c.ar:c.en}
          </button>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════
// COURSE MODAL — wide 2-column
// ═══════════════════════════════════════════════════
function CourseModal({course,lang,isRTL,t,onClose,onSave}:{
  course?:Course; lang:string; isRTL:boolean;
  t:(a:string,b:string)=>string;
  onClose:()=>void; onSave:(c:Course)=>void;
}){
  const isEdit=!!course;
  const [form,setForm]=useState({
    titleEn:course?.titleEn??"",
    titleAr:course?.titleAr??"",
    status:(course?.status??"Draft") as CourseStatus,
  });
  const [errors,setErrors]=useState<Record<string,string>>({});
  const [loading,setLoading]=useState(false);

  const validate=()=>{
    const e:Record<string,string>={};
    if(!form.titleEn.trim()) e.titleEn=t("English title is required.","العنوان الإنجليزي مطلوب.");
    if(!form.titleAr.trim()) e.titleAr=t("Arabic title is required.","العنوان العربي مطلوب.");
    setErrors(e); return Object.keys(e).length===0;
  };
  const handleSave=async()=>{
    if(!validate()) return;
    setLoading(true); await new Promise(r=>setTimeout(r,700)); setLoading(false);
    onSave({id:course?.id??genId("CRS"),titleEn:form.titleEn.trim(),titleAr:form.titleAr.trim(),status:form.status,totalStudents:course?.totalStudents??0,createdAt:course?.createdAt??fmtDate(),levels:course?.levels??[]});
  };

  return(
    <Backdrop onClose={onClose}>
      <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-2xl overflow-hidden"
        dir={isRTL?"rtl":"ltr"}>
        <div className="h-1.5" style={{background:"linear-gradient(90deg,#107789,#E8763A)"}}/>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#F1F5F9]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EBF5F7] flex items-center justify-center text-[#107789]">{IC.book}</div>
            <div>
              <h2 className="text-base font-black text-[#1e293b]">{isEdit?t("Edit Course","تعديل المقرر"):t("New Course","مقرر جديد")}</h2>
              <p className="text-xs text-[#94a3b8] mt-0.5">{isEdit?t("Update course details","تحديث تفاصيل المقرر"):t("Fill in the details below","أدخل التفاصيل أدناه")}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#F5F7F9] text-[#94a3b8] hover:text-[#1e293b] hover:bg-[#E2E8F0] transition-all">{IC.close}</button>
        </div>

        {/* 2-column body */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x divide-[#F1F5F9]">

          {/* LEFT: Titles */}
          <div className="p-6 space-y-4">
            <p className="text-xs font-black text-[#94a3b8] uppercase tracking-widest">{t("Course Title","عنوان المقرر")}</p>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#64748b]">{t("English Title *","العنوان الإنجليزي *")}</label>
              <input value={form.titleEn} onChange={e=>{setForm(p=>({...p,titleEn:e.target.value}));setErrors(p=>({...p,titleEn:""}));}}
                placeholder={t("e.g. English Foundation","مثال: English Foundation")} className={errors.titleEn?inpErr:inpOk}/>
              {errors.titleEn&&<p className="text-[11px] text-[#ef4444]">{errors.titleEn}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#64748b]">{t("Arabic Title *","العنوان بالعربي *")}</label>
              <input value={form.titleAr} onChange={e=>{setForm(p=>({...p,titleAr:e.target.value}));setErrors(p=>({...p,titleAr:""}));}}
                placeholder="مثال: أساسيات اللغة الإنجليزية" className={errors.titleAr?inpErr:inpOk} dir="rtl"/>
              {errors.titleAr&&<p className="text-[11px] text-[#ef4444]">{errors.titleAr}</p>}
            </div>

            {/* Preview */}
            {(form.titleEn||form.titleAr)&&(
              <div className="rounded-xl bg-[#F8FAFC] border border-[#F1F5F9] p-3" style={{animation:"slideUp .2s ease both"}}>
                <p className="text-[10px] font-black text-[#94a3b8] uppercase tracking-wide mb-1.5">{t("Preview","معاينة")}</p>
                {form.titleEn&&<p className="text-sm font-bold text-[#1e293b]">{form.titleEn}</p>}
                {form.titleAr&&<p className="text-xs text-[#64748b] mt-0.5" dir="rtl">{form.titleAr}</p>}
              </div>
            )}
          </div>

          {/* RIGHT: Status + info */}
          <div className="p-6 space-y-5">
            <p className="text-xs font-black text-[#94a3b8] uppercase tracking-widest">{t("Course Status","حالة المقرر")}</p>

            <StatusSelector value={form.status} onChange={s=>setForm(p=>({...p,status:s}))} statuses={["Published","Draft","Archived"]} lang={lang}/>

            {/* Status description */}
            <div className="rounded-xl p-3 border" style={{backgroundColor:SC[form.status].bg,borderColor:SC[form.status].border}}>
              <p className="text-xs font-bold mb-1" style={{color:SC[form.status].text}}>
                {form.status==="Published"?t("✅ Visible to students","✅ مرئي للطلاب"):
                 form.status==="Draft"?t("📝 Not visible yet","📝 غير مرئي بعد"):
                 t("📦 Hidden, archived","📦 مخفي، مؤرشف")}
              </p>
              <p className="text-[11px]" style={{color:SC[form.status].text}}>
                {form.status==="Published"?t("Students can enroll and access lessons.","يمكن للطلاب التسجيل والوصول للدروس."):
                 form.status==="Draft"?t("Only admins can see this course.","فقط المسؤولون يمكنهم رؤية هذا المقرر."):
                 t("Course is archived and inactive.","المقرر مؤرشف وغير نشط.")}
              </p>
            </div>

            {/* Lesson components badge list */}
            <div>
              <p className="text-xs font-semibold text-[#64748b] mb-2">{t("Includes components","يشمل المكونات")}</p>
              <div className="flex flex-wrap gap-1.5">
                {LESSON_COMPS.map(c=>(
                  <span key={c.key} className="flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-full bg-[#EBF5F7] text-[#107789]">
                    <span>{c.icon}</span>{lang==="ar"?c.ar:c.en}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#F1F5F9] bg-[#FAFBFC]">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm font-semibold border border-[#E2E8F0] text-[#64748b] hover:bg-[#F5F7F9] active:scale-95 transition-all">{t("Cancel","إلغاء")}</button>
          <button onClick={handleSave} disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90 active:scale-[.98] transition-all"
            style={{backgroundColor:loading?"#5FA8B3":"#107789"}}>
            {loading?<>{IC.spinner}{t("Saving…","جارٍ الحفظ…")}</>:<>{IC.ok}{isEdit?t("Save Changes","حفظ التغييرات"):t("Create Course","إنشاء المقرر")}</>}
          </button>
        </div>
      </div>
    </Backdrop>
  );
}

// ═══════════════════════════════════════════════════
// LEVEL MODAL — wide 2-column
// ═══════════════════════════════════════════════════
function LevelModal({level,courseTitle,courseTitleAr,lang,isRTL,t,onClose,onSave}:{
  level?:Level; courseTitle:string; courseTitleAr:string;
  lang:string; isRTL:boolean;
  t:(a:string,b:string)=>string;
  onClose:()=>void; onSave:(l:Level)=>void;
}){
  const isEdit=!!level;
  const [form,setForm]=useState({
    titleEn:level?.titleEn??"",
    titleAr:level?.titleAr??"",
    lessons:level?.lessons??10,
    status:(level?.status??"Draft") as CourseStatus,
  });
  const [errors,setErrors]=useState<Record<string,string>>({});
  const [loading,setLoading]=useState(false);

  const validate=()=>{
    const e:Record<string,string>={};
    if(!form.titleEn.trim()) e.titleEn=t("English title is required.","العنوان الإنجليزي مطلوب.");
    if(!form.titleAr.trim()) e.titleAr=t("Arabic title is required.","العنوان العربي مطلوب.");
    if(!form.lessons||form.lessons<1) e.lessons=t("At least 1 lesson.","درس واحد على الأقل.");
    setErrors(e); return Object.keys(e).length===0;
  };
  const handleSave=async()=>{
    if(!validate()) return;
    setLoading(true); await new Promise(r=>setTimeout(r,700)); setLoading(false);
    onSave({id:level?.id??genId("LVL"),titleEn:form.titleEn.trim(),titleAr:form.titleAr.trim(),lessons:form.lessons,status:form.status});
  };

  return(
    <Backdrop onClose={onClose}>
      <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-2xl overflow-hidden"
        dir={isRTL?"rtl":"ltr"}>
        <div className="h-1.5" style={{background:"linear-gradient(90deg,#7c3aed,#E8763A)"}}/>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#F1F5F9]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#ede9fe] flex items-center justify-center text-2xl">📚</div>
            <div>
              <h2 className="text-base font-black text-[#1e293b]">{isEdit?t("Edit Level","تعديل المستوى"):t("Add Level","إضافة مستوى")}</h2>
              <p className="text-xs text-[#94a3b8] mt-0.5">{lang==="ar"?courseTitleAr:courseTitle}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#F5F7F9] text-[#94a3b8] hover:text-[#1e293b] hover:bg-[#E2E8F0] transition-all">{IC.close}</button>
        </div>

        {/* 2-column body */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x divide-[#F1F5F9]">

          {/* LEFT: Titles + lessons */}
          <div className="p-6 space-y-4">
            <p className="text-xs font-black text-[#94a3b8] uppercase tracking-widest">{t("Level Details","تفاصيل المستوى")}</p>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#64748b]">{t("English Title *","العنوان الإنجليزي *")}</label>
              <input value={form.titleEn} onChange={e=>{setForm(p=>({...p,titleEn:e.target.value}));setErrors(p=>({...p,titleEn:""}));}}
                placeholder="e.g. Beginner A1" className={errors.titleEn?inpErr:inpOk}/>
              {errors.titleEn&&<p className="text-[11px] text-[#ef4444]">{errors.titleEn}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#64748b]">{t("Arabic Title *","العنوان بالعربي *")}</label>
              <input value={form.titleAr} onChange={e=>{setForm(p=>({...p,titleAr:e.target.value}));setErrors(p=>({...p,titleAr:""}));}}
                placeholder="مثال: مبتدئ A1" className={errors.titleAr?inpErr:inpOk} dir="rtl"/>
              {errors.titleAr&&<p className="text-[11px] text-[#ef4444]">{errors.titleAr}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#64748b]">{t("Number of Lessons *","عدد الدروس *")}</label>
              <div className="flex items-center gap-2">
                <button type="button" onClick={()=>setForm(p=>({...p,lessons:Math.max(1,p.lessons-1)}))}
                  className="w-10 h-10 rounded-xl border border-[#E2E8F0] flex items-center justify-center text-[#64748b] hover:bg-[#F5F7F9] hover:text-[#107789] active:scale-95 transition-all text-lg font-bold flex-shrink-0">−</button>
                <input type="number" min={1} max={100} value={form.lessons}
                  onChange={e=>{setForm(p=>({...p,lessons:parseInt(e.target.value)||1}));setErrors(p=>({...p,lessons:""}));}}
                  className={`${errors.lessons?inpErr:inpOk} text-center text-base font-black`}/>
                <button type="button" onClick={()=>setForm(p=>({...p,lessons:Math.min(100,p.lessons+1)}))}
                  className="w-10 h-10 rounded-xl border border-[#E2E8F0] flex items-center justify-center text-[#64748b] hover:bg-[#F5F7F9] hover:text-[#107789] active:scale-95 transition-all text-lg font-bold flex-shrink-0">+</button>
              </div>
              {errors.lessons&&<p className="text-[11px] text-[#ef4444]">{errors.lessons}</p>}
            </div>
          </div>

          {/* RIGHT: Status + components */}
          <div className="p-6 space-y-5">
            <p className="text-xs font-black text-[#94a3b8] uppercase tracking-widest">{t("Level Status","حالة المستوى")}</p>

            <StatusSelector value={form.status} onChange={s=>setForm(p=>({...p,status:s}))} statuses={["Published","Draft"]} lang={lang}/>

            {/* Preview card */}
            {(form.titleEn||form.titleAr)&&(
              <div className="rounded-xl bg-[#F8FAFC] border border-[#F1F5F9] p-4 space-y-2" style={{animation:"slideUp .2s ease both"}}>
                <p className="text-[10px] font-black text-[#94a3b8] uppercase tracking-wide">{t("Level Preview","معاينة المستوى")}</p>
                <div className="flex items-center justify-between">
                  <div>
                    {form.titleEn&&<p className="text-sm font-bold text-[#1e293b]">{form.titleEn}</p>}
                    {form.titleAr&&<p className="text-xs text-[#64748b]" dir="rtl">{form.titleAr}</p>}
                  </div>
                  <SPill s={form.status} lang={lang}/>
                </div>
                <p className="text-[11px] text-[#94a3b8]">{form.lessons} {lang==="ar"?"درس":"lessons"}</p>
              </div>
            )}

            {/* Components included */}
            <div>
              <p className="text-xs font-semibold text-[#64748b] mb-2">{t("Components per lesson","مكونات كل درس")}</p>
              <div className="space-y-1.5">
                {LESSON_COMPS.map(c=>(
                  <div key={c.key} className="flex items-center gap-2.5 py-1.5 px-3 rounded-xl bg-[#F8FAFC] border border-[#F1F5F9]">
                    <span className="text-[#107789]">{c.icon}</span>
                    <span className="text-xs font-medium text-[#64748b]">{lang==="ar"?c.ar:c.en}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#F1F5F9] bg-[#FAFBFC]">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm font-semibold border border-[#E2E8F0] text-[#64748b] hover:bg-[#F5F7F9] active:scale-95 transition-all">{t("Cancel","إلغاء")}</button>
          <button onClick={handleSave} disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90 active:scale-[.98] transition-all"
            style={{backgroundColor:loading?"#9f7aea":"#7c3aed"}}>
            {loading?<>{IC.spinner}{t("Saving…","جارٍ الحفظ…")}</>:<>{IC.ok}{isEdit?t("Save Changes","حفظ التغييرات"):t("Add Level","إضافة المستوى")}</>}
          </button>
        </div>
      </div>
    </Backdrop>
  );
}

// ═══════════════════════════════════════════════════
// DELETE CONFIRM MODAL — wide, clear
// ═══════════════════════════════════════════════════
function DeleteModal({title,descEn,descAr,lang,isRTL,t,onClose,onConfirm}:{
  title:string; descEn:string; descAr:string;
  lang:string; isRTL:boolean;
  t:(a:string,b:string)=>string;
  onClose:()=>void; onConfirm:()=>void;
}){
  const [loading,setLoading]=useState(false);
  const handle=async()=>{setLoading(true);await new Promise(r=>setTimeout(r,600));setLoading(false);onConfirm();};

  return(
    <Backdrop onClose={onClose}>
      <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-2xl overflow-hidden"
        dir={isRTL?"rtl":"ltr"}>
        <div className="h-1.5 bg-[#ef4444]"/>
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#F1F5F9]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#fee2e2] flex items-center justify-center text-[#ef4444]">{IC.trash}</div>
            <h2 className="text-base font-black text-[#1e293b]">{title}</h2>
          </div>
          <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#F5F7F9] text-[#94a3b8] hover:text-[#1e293b] hover:bg-[#E2E8F0] transition-all">{IC.close}</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x divide-[#F1F5F9]">
          {/* LEFT: Warning */}
          <div className="p-6 space-y-4">
            <div className="rounded-2xl bg-[#fff5f5] border border-[#fca5a5] p-5 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-[#fee2e2] flex items-center justify-center mx-auto">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              </div>
              <p className="text-sm font-black text-[#ef4444]">{t("This action is permanent","هذا الإجراء دائم")}</p>
              <p className="text-xs text-[#ef4444]/80 leading-relaxed">{t("Once deleted, this cannot be undone. All associated data will be permanently lost.","بعد الحذف، لا يمكن التراجع. ستُفقد جميع البيانات المرتبطة نهائياً.")}</p>
            </div>
          </div>

          {/* RIGHT: Description + confirm */}
          <div className="p-6 space-y-4">
            <p className="text-xs font-black text-[#94a3b8] uppercase tracking-widest">{t("What will be deleted","ما سيتم حذفه")}</p>
            <div className="rounded-xl bg-[#F8FAFC] border border-[#F1F5F9] p-4">
              <p className="text-sm text-[#1e293b] leading-relaxed">{lang==="ar"?descAr:descEn}</p>
            </div>
            <div className="flex items-start gap-2 rounded-xl bg-[#FFFBEB] border border-[#FDE68A] p-3 text-xs text-[#d97706]">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="flex-shrink-0 mt-0.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <span>{t("All levels and lesson data will be removed.","سيتم حذف جميع المستويات وبيانات الدروس.")}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#F1F5F9] bg-[#FAFBFC]">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm font-semibold border border-[#E2E8F0] text-[#64748b] hover:bg-[#F5F7F9] active:scale-95 transition-all">{t("Cancel","إلغاء")}</button>
          <button onClick={handle} disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90 active:scale-[.98] transition-all"
            style={{backgroundColor:loading?"#f87171":"#ef4444"}}>
            {loading?<>{IC.spinner}{t("Deleting…","جارٍ الحذف…")}</>:<>{IC.trash}&nbsp;{t("Delete","حذف")}</>}
          </button>
        </div>
      </div>
    </Backdrop>
  );
}

// ═══════════════════════════════════════════════════
// COURSE CARD (expanded)
// ═══════════════════════════════════════════════════
function CourseCard({course,idx,expanded,lang,isRTL,t,
  onToggle,onEdit,onDelete,onAddLevel,onEditLevel,onDeleteLevel}:{
  course:Course; idx:number; expanded:boolean;
  lang:string; isRTL:boolean;
  t:(a:string,b:string)=>string;
  onToggle:()=>void; onEdit:()=>void; onDelete:()=>void;
  onAddLevel:()=>void; onEditLevel:(l:Level)=>void; onDeleteLevel:(l:Level)=>void;
}){
  return(
    <div className="rounded-2xl bg-white border border-[#F1F5F9] shadow-sm overflow-hidden hover:shadow-md hover:border-[#b2dce4] transition-all duration-300"
      style={{animation:`cardIn .45s ${idx*.09}s cubic-bezier(.34,1.2,.64,1) both`}}>

      {/* Course header row */}
      <div className="flex items-center gap-3 px-4 sm:px-5 py-4 hover:bg-[#F8FAFC] transition-colors">
        {/* Expand toggle area */}
        <button onClick={onToggle} className="flex items-center gap-3 flex-1 min-w-0 text-start">
          <div className="w-10 h-10 rounded-xl bg-[#EBF5F7] flex items-center justify-center text-[#107789] flex-shrink-0">{IC.book}</div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-0.5">
              <p className="text-sm font-bold text-[#1e293b] truncate">{lang==="ar"?course.titleAr:course.titleEn}</p>
              <SPill s={course.status} lang={lang}/>
            </div>
            <p className="text-xs text-[#94a3b8] truncate">
              {course.levels.length} {t("levels","مستويات")} · {course.totalStudents} {t("students","طالب")} · {course.createdAt}
            </p>
          </div>
        </button>

        {/* Action buttons */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <button onClick={onEdit}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-[#107789] border border-[#E2E8F0] hover:bg-[#EBF5F7] active:scale-95 transition-all">
            {IC.edit}<span className="hidden sm:inline">{t("Edit","تعديل")}</span>
          </button>
          <button onClick={onDelete}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-[#ef4444] border border-[#E2E8F0] hover:bg-[#fee2e2] active:scale-95 transition-all">
            {IC.trash}<span className="hidden sm:inline">{t("Delete","حذف")}</span>
          </button>
          <button onClick={onToggle}
            className="w-8 h-8 flex items-center justify-center rounded-xl text-[#94a3b8] hover:bg-[#F5F7F9] active:scale-95 transition-all"
            style={{transform:expanded?"rotate(180deg)":"none",transitionProperty:"transform"}}>
            {IC.chevD}
          </button>
        </div>
      </div>

      {/* Expanded: Levels */}
      {expanded&&(
        <div className="border-t border-[#F1F5F9]" style={{animation:"slideUp .2s ease both"}}>
          {/* Levels header */}
          <div className="flex items-center justify-between px-4 sm:px-5 py-3 bg-[#F8FAFC] border-b border-[#F1F5F9]">
            <p className="text-xs font-black text-[#94a3b8] uppercase tracking-widest">{t("Levels","المستويات")}</p>
            <button onClick={onAddLevel}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white hover:opacity-90 active:scale-95 transition-all"
              style={{backgroundColor:"#7c3aed"}}>
              {IC.plus}{t("Add Level","إضافة مستوى")}
            </button>
          </div>

          {course.levels.length===0?(
            <div className="px-5 py-8 text-center">
              <p className="text-sm text-[#94a3b8]">{t("No levels yet. Add the first one!","لا توجد مستويات بعد. أضف أول مستوى!")}</p>
            </div>
          ):(
            <>
              {/* Mobile: card list */}
              <div className="sm:hidden divide-y divide-[#F8FAFC]">
                {course.levels.map((lv,i)=>(
                  <div key={lv.id} className="flex items-center gap-3 px-4 py-3.5"
                    style={{animation:`slideUp .2s ${i*.05}s ease both`}}>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-[#1e293b] truncate">{lang==="ar"?lv.titleAr:lv.titleEn}</p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="text-[10px] text-[#94a3b8]">{lv.lessons} {t("lessons","درس")}</span>
                        <SPill s={lv.status} lang={lang}/>
                      </div>
                    </div>
                    <div className="flex gap-1.5 flex-shrink-0">
                      <button onClick={()=>onEditLevel(lv)} className="px-2.5 py-1.5 rounded-xl text-[10px] font-bold text-[#107789] border border-[#E2E8F0] hover:bg-[#EBF5F7] active:scale-95 transition-all">{t("Edit","تعديل")}</button>
                      <button onClick={()=>onDeleteLevel(lv)} className="px-2.5 py-1.5 rounded-xl text-[10px] font-bold text-[#ef4444] border border-[#E2E8F0] hover:bg-[#fee2e2] active:scale-95 transition-all">{t("Del","حذف")}</button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop: table */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-sm" style={{borderCollapse:"collapse"}}>
                  <thead>
                    <tr style={{backgroundColor:"#F8FAFC"}}>
                      {[{en:"Level",ar:"المستوى"},{en:"Lessons",ar:"الدروس"},{en:"Status",ar:"الحالة"},{en:"Actions",ar:"إجراءات"}].map(col=>(
                        <th key={col.en} className="px-5 py-2.5 text-start text-xs font-semibold text-[#94a3b8] border-b border-[#F1F5F9] whitespace-nowrap">
                          {lang==="ar"?col.ar:col.en}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {course.levels.map((lv,i)=>(
                      <tr key={lv.id} className="hover:bg-[#F8FAFC] transition-colors border-b border-[#F1F5F9] last:border-0"
                        style={{animation:`slideUp .2s ${i*.05}s ease both`}}>
                        <td className="px-5 py-3 font-semibold text-[#1e293b]">{lang==="ar"?lv.titleAr:lv.titleEn}</td>
                        <td className="px-5 py-3 text-xs text-[#64748b]">{lv.lessons} {t("lessons","درس")}</td>
                        <td className="px-5 py-3"><SPill s={lv.status} lang={lang}/></td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2">
                            <button onClick={()=>onEditLevel(lv)}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-[#107789] border border-[#E2E8F0] hover:bg-[#EBF5F7] active:scale-95 transition-all">
                              {IC.edit}{t("Edit","تعديل")}
                            </button>
                            <button onClick={()=>onDeleteLevel(lv)}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-[#ef4444] border border-[#E2E8F0] hover:bg-[#fee2e2] active:scale-95 transition-all">
                              {IC.trash}{t("Delete","حذف")}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════
// PAGE
// ═══════════════════════════════════════════════════
export default function CourseManagementPage(){
  const {lang,isRTL,t}=useLanguage();

  const [courses,setCourses]=useState<Course[]>(INITIAL);
  const [expanded,setExpanded]=useState<string|null>("CRS-001");
  const [filter,setFilter]=useState<CourseStatus|"All">("All");

  // Modals
  const [addCourse,   setAddCourse]   = useState(false);
  const [editCourse,  setEditCourse]  = useState<Course|null>(null);
  const [delCourse,   setDelCourse]   = useState<Course|null>(null);
  const [addLevelFor, setAddLevelFor] = useState<Course|null>(null);
  const [editLvl,     setEditLvl]     = useState<{course:Course;level:Level}|null>(null);
  const [delLvl,      setDelLvl]      = useState<{course:Course;level:Level}|null>(null);

  const [toast,setToast]=useState<string|null>(null);
  const fire=(msg:string)=>{setToast(msg);setTimeout(()=>setToast(null),3500);};

  const filtered=courses.filter(c=>filter==="All"||c.status===filter);

  // Course CRUD
  const handleAddCourse=(c:Course)=>{setCourses(p=>[c,...p]);setAddCourse(false);fire(t(`"${c.titleEn}" created!`,`تم إنشاء "${c.titleAr}"!`));};
  const handleEditCourse=(c:Course)=>{setCourses(p=>p.map(x=>x.id===c.id?c:x));setEditCourse(null);fire(t(`"${c.titleEn}" updated!`,`تم تحديث "${c.titleAr}"!`));};
  const handleDelCourse=()=>{if(!delCourse)return;setCourses(p=>p.filter(x=>x.id!==delCourse.id));if(expanded===delCourse.id)setExpanded(null);fire(t(`"${delCourse.titleEn}" deleted.`,`تم حذف "${delCourse.titleAr}".`));setDelCourse(null);};

  // Level CRUD
  const updLevels=(cid:string,levels:Level[])=>setCourses(p=>p.map(c=>c.id===cid?{...c,levels}:c));
  const handleAddLevel=(lv:Level)=>{if(!addLevelFor)return;updLevels(addLevelFor.id,[...addLevelFor.levels,lv]);setAddLevelFor(null);fire(t("Level added!","تمت إضافة المستوى!"));};
  const handleEditLevel=(lv:Level)=>{if(!editLvl)return;updLevels(editLvl.course.id,editLvl.course.levels.map(l=>l.id===lv.id?lv:l));setEditLvl(null);fire(t("Level updated!","تم تحديث المستوى!"));};
  const handleDelLevel=()=>{if(!delLvl)return;updLevels(delLvl.course.id,delLvl.course.levels.filter(l=>l.id!==delLvl.level.id));setDelLvl(null);fire(t("Level deleted.","تم حذف المستوى."));};

  const stats=[
    {en:"Total Courses",  ar:"إجمالي المقررات",    val:courses.length,                                              color:"#107789",bg:"#EBF5F7",delay:0    },
    {en:"Published",      ar:"المنشورة",             val:courses.filter(c=>c.status==="Published").length,            color:"#059669",bg:"#d1fae5",delay:0.07 },
    {en:"Draft",          ar:"المسودات",             val:courses.filter(c=>c.status==="Draft").length,               color:"#d97706",bg:"#fef3c7",delay:0.14 },
    {en:"Total Levels",   ar:"إجمالي المستويات",    val:courses.reduce((a,c)=>a+c.levels.length,0),                  color:"#7c3aed",bg:"#ede9fe",delay:0.21 },
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
            <h1 className="text-xl sm:text-2xl font-black text-[#1e293b] tracking-tight">{t("Course Management","إدارة المقررات")}</h1>
            <p className="mt-1 text-xs sm:text-sm text-[#94a3b8]">{t("Manage curriculums, levels, and lesson components","إدارة المناهج والمستويات ومكونات الدروس")}</p>
          </div>
          <button onClick={()=>setAddCourse(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90 active:scale-95 transition-all shadow-sm"
            style={{backgroundColor:"#107789",animation:"cardIn .4s .05s both"}}>
            {IC.plus}{t("New Course","مقرر جديد")}
          </button>
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {stats.map(s=>(
            <div key={s.en} className="rounded-2xl bg-white border border-[#F1F5F9] shadow-sm p-4 sm:p-5 hover:shadow-md hover:border-[#b2dce4] transition-all duration-300"
              style={{animation:`cardIn .45s ${s.delay}s cubic-bezier(.34,1.2,.64,1) both`}}>
              <p className="text-2xl sm:text-3xl font-black leading-none" style={{color:s.color}}>{s.val}</p>
              <p className="text-xs text-[#94a3b8] mt-1.5 font-medium">{lang==="ar"?s.ar:s.en}</p>
            </div>
          ))}
        </div>

        {/* ── Main layout: courses + sidebar ── */}
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">

          {/* ── Courses list ── */}
          <div className="xl:col-span-2 space-y-4">
            {/* Filter tabs */}
            <div className="flex items-center flex-wrap gap-1.5" style={{animation:"cardIn .4s .22s both"}}>
              {(["All","Published","Draft","Archived"] as const).map(s=>(
                <button key={s} onClick={()=>setFilter(s)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all active:scale-95"
                  style={filter===s?{backgroundColor:"#107789",color:"white",boxShadow:"0 2px 8px #10778940"}:{backgroundColor:"white",color:"#64748b",border:"1px solid #F1F5F9"}}>
                  {s==="All"?t("All","الكل"):lang==="ar"?SC[s].ar:SC[s].en}
                  <span className="text-[10px] rounded-full px-1.5 py-0.5 font-black"
                    style={filter===s?{backgroundColor:"rgba(255,255,255,.25)"}:{backgroundColor:"#F1F5F9",color:"#94a3b8"}}>
                    {s==="All"?courses.length:courses.filter(c=>c.status===s).length}
                  </span>
                </button>
              ))}
            </div>

            {/* Empty state */}
            {filtered.length===0&&(
              <div className="rounded-2xl bg-white border border-[#F1F5F9] p-12 text-center" style={{animation:"fadeIn .4s both"}}>
                <p className="text-2xl mb-2">📚</p>
                <p className="text-base font-bold text-[#1e293b]">{t("No courses found","لا توجد مقررات")}</p>
                <p className="text-sm text-[#94a3b8] mt-1">{t("Create your first course to get started.","أنشئ أول مقرر للبدء.")}</p>
              </div>
            )}

            {/* Course cards */}
            {filtered.map((course,idx)=>(
              <CourseCard key={course.id} course={course} idx={idx} expanded={expanded===course.id}
                lang={lang} isRTL={isRTL} t={t}
                onToggle={()=>setExpanded(expanded===course.id?null:course.id)}
                onEdit={()=>setEditCourse(course)}
                onDelete={()=>setDelCourse(course)}
                onAddLevel={()=>setAddLevelFor(course)}
                onEditLevel={lv=>setEditLvl({course,level:lv})}
                onDeleteLevel={lv=>setDelLvl({course,level:lv})}/>
            ))}
          </div>

          {/* ── Sidebar ── */}
          <div className="space-y-4">
            {/* Lesson components */}
            <div className="rounded-2xl bg-white border border-[#F1F5F9] shadow-sm p-5 hover:shadow-md hover:border-[#b2dce4] transition-all duration-300"
              style={{animation:"cardIn .45s .32s both"}}>
              <p className="text-sm font-bold text-[#1e293b] mb-0.5">{t("Lesson Components","مكونات الدرس")}</p>
              <p className="text-xs text-[#94a3b8] mb-4">{t("Each lesson includes:","كل درس يحتوي على:")}</p>
              <div className="space-y-2">
                {LESSON_COMPS.map((c,i)=>(
                  <div key={c.key} className="group flex items-center gap-3 rounded-xl border border-[#F1F5F9] p-3 hover:border-[#b2dce4] hover:bg-[#EBF5F7] transition-all cursor-default"
                    style={{animation:`slideUp .3s ${0.36+i*.07}s ease both`}}>
                    <span className="text-[#107789] flex-shrink-0">{c.icon}</span>
                    <span className="text-xs font-semibold text-[#1e293b] group-hover:text-[#107789] transition-colors">{lang==="ar"?c.ar:c.en}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Course Stats */}
            <div className="rounded-2xl bg-white border border-[#F1F5F9] shadow-sm p-5 hover:shadow-md hover:border-[#b2dce4] transition-all duration-300"
              style={{animation:"cardIn .45s .38s both"}}>
              <p className="text-sm font-bold text-[#1e293b] mb-4">{t("Course Stats","إحصائيات المقررات")}</p>
              <div className="space-y-4">
                {[
                  {en:"Avg. Completion Rate",ar:"متوسط معدل الإتمام",  val:74, color:"#107789"},
                  {en:"Student Satisfaction",ar:"رضا الطلاب",           val:91, color:"#059669"},
                  {en:"Quiz Pass Rate",      ar:"معدل اجتياز الاختبارات",val:83, color:"#7c3aed"},
                ].map((item,i)=>(
                  <div key={item.en} style={{animation:`slideUp .3s ${0.42+i*.08}s ease both`}}>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-xs text-[#94a3b8]">{lang==="ar"?item.ar:item.en}</span>
                      <span className="text-xs font-black" style={{color:item.color}}>{item.val}%</span>
                    </div>
                    <div className="h-2 bg-[#F1F5F9] rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{width:`${item.val}%`,backgroundColor:item.color,transition:`width .8s ${0.5+i*.1}s ease`}}/>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick add */}
            <button onClick={()=>setAddCourse(true)}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-bold border-2 border-dashed border-[#107789]/30 text-[#107789] hover:bg-[#EBF5F7] hover:border-[#107789]/60 active:scale-[.98] transition-all"
              style={{animation:"cardIn .45s .44s both"}}>
              {IC.plus}{t("Add New Course","إضافة مقرر جديد")}
            </button>
          </div>
        </div>

      </main>

      {/* ── Modals ── */}
      {addCourse&&<CourseModal lang={lang} isRTL={isRTL} t={t} onClose={()=>setAddCourse(false)} onSave={handleAddCourse}/>}
      {editCourse&&<CourseModal course={editCourse} lang={lang} isRTL={isRTL} t={t} onClose={()=>setEditCourse(null)} onSave={handleEditCourse}/>}
      {delCourse&&(
        <DeleteModal title={t("Delete Course","حذف المقرر")}
          descEn={`Are you sure you want to delete "${delCourse.titleEn}"? All levels will be permanently removed.`}
          descAr={`هل أنت متأكد من حذف "${delCourse.titleAr}"؟ سيتم حذف جميع المستويات نهائياً.`}
          lang={lang} isRTL={isRTL} t={t} onClose={()=>setDelCourse(null)} onConfirm={handleDelCourse}/>
      )}
      {addLevelFor&&(
        <LevelModal courseTitle={addLevelFor.titleEn} courseTitleAr={addLevelFor.titleAr}
          lang={lang} isRTL={isRTL} t={t} onClose={()=>setAddLevelFor(null)} onSave={handleAddLevel}/>
      )}
      {editLvl&&(
        <LevelModal level={editLvl.level} courseTitle={editLvl.course.titleEn} courseTitleAr={editLvl.course.titleAr}
          lang={lang} isRTL={isRTL} t={t} onClose={()=>setEditLvl(null)} onSave={handleEditLevel}/>
      )}
      {delLvl&&(
        <DeleteModal title={t("Delete Level","حذف المستوى")}
          descEn={`Delete "${delLvl.level.titleEn}" from "${delLvl.course.titleEn}"?`}
          descAr={`حذف "${delLvl.level.titleAr}" من "${delLvl.course.titleAr}"؟`}
          lang={lang} isRTL={isRTL} t={t} onClose={()=>setDelLvl(null)} onConfirm={handleDelLevel}/>
      )}
      {toast&&<Toast msg={toast} onClose={()=>setToast(null)}/>}
    </>
  );
}