"use client";

import { useState } from "react";
import { useLanguage } from "@/src/contexts/LanguageContext";

// ─── Types ────────────────────────────────────────────────────
type PackageStatus = "Active" | "Inactive";

interface PkgFeature { id: string; en: string; ar: string; }
interface Package {
  id: string; nameEn: string; nameAr: string;
  descriptionEn: string; descriptionAr: string;
  lessons: number; price: number; currency: string;
  durationDays: number; status: PackageStatus;
  popular?: boolean; features: PkgFeature[];
}

// ─── Configs ──────────────────────────────────────────────────
const SC: Record<PackageStatus,{bg:string;text:string;border:string;dot:string;en:string;ar:string}> = {
  Active:   {bg:"#d1fae5",text:"#059669",border:"#6ee7b7",dot:"#059669",en:"Active",   ar:"نشط"},
  Inactive: {bg:"#f1f5f9",text:"#64748b",border:"#e2e8f0",dot:"#94a3b8",en:"Inactive", ar:"غير نشط"},
};

// ─── Helpers ──────────────────────────────────────────────────
const genId  = (p:string) => `${p}-${Math.floor(Math.random()*900)+100}`;
const featId = () => `F-${Date.now()}-${Math.random().toString(36).slice(2,6)}`;

// ─── Initial data ─────────────────────────────────────────────
const INITIAL: Package[] = [
  { id:"PKG-001", nameEn:"Basic Pack",     nameAr:"الباقة الأساسية",  descriptionEn:"Perfect for beginners",             descriptionAr:"مثالية للمبتدئين",              lessons:12, price:150, currency:"$", durationDays:60,  status:"Active",
    features:[{id:featId(),en:"12 one-on-one lessons",      ar:"12 درسًا فرديًا"},{id:featId(),en:"Learning materials access",  ar:"الوصول للمواد التعليمية"},{id:featId(),en:"Progress tracking",            ar:"متابعة التقدم"}]},
  { id:"PKG-002", nameEn:"Standard Pack",  nameAr:"الباقة المعيارية", descriptionEn:"Most popular for steady progress",   descriptionAr:"الأكثر شيوعًا لتقدم مستمر",    lessons:24, price:280, currency:"$", durationDays:90,  status:"Active", popular:true,
    features:[{id:featId(),en:"24 one-on-one lessons",      ar:"24 درسًا فرديًا"},{id:featId(),en:"Access to all courses",       ar:"الوصول لجميع المقررات"},{id:featId(),en:"Progress tracking",            ar:"متابعة التقدم"},{id:featId(),en:"Monthly performance report",   ar:"تقرير أداء شهري"}]},
  { id:"PKG-003", nameEn:"Premium Pack",   nameAr:"الباقة المميزة",   descriptionEn:"Comprehensive for fast learners",    descriptionAr:"شاملة للمتعلمين السريعين",      lessons:50, price:500, currency:"$", durationDays:180, status:"Active",
    features:[{id:featId(),en:"50 one-on-one lessons",      ar:"50 درسًا فرديًا"},{id:featId(),en:"Priority teacher selection",  ar:"اختيار معلم بالأولوية"},{id:featId(),en:"Weekly performance report",      ar:"تقرير أداء أسبوعي"},{id:featId(),en:"Free trial extension",         ar:"تمديد تجريبي مجاني"}]},
  { id:"PKG-004", nameEn:"IELTS Intensive",nameAr:"مكثف IELTS",       descriptionEn:"Targeted prep for IELTS success",    descriptionAr:"تحضير مستهدف لنجاح IELTS",      lessons:30, price:380, currency:"$", durationDays:90,  status:"Inactive",
    features:[{id:featId(),en:"30 IELTS-focused lessons",   ar:"30 درسًا مخصصًا لـ IELTS"},{id:featId(),en:"Mock exam sessions",          ar:"جلسات اختبار تجريبي"},{id:featId(),en:"Detailed scoring feedback",       ar:"تغذية راجعة تفصيلية"}]},
];

// ─── Icons ────────────────────────────────────────────────────
const IC={
  close:  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  ok:     <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>,
  plus:   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  edit:   <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  trash:  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>,
  dollar: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  clock:  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  star:   <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" stroke="#d97706" strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" style={{fill:"#d97706"}}/></svg>,
  spinner:<svg className="animate-spin" width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="white" strokeWidth="2" strokeOpacity="0.3"/><path d="M7 1.5a5.5 5.5 0 015.5 5.5" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>,
  warn:   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
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

const inpOk ="w-full px-3 py-2.5 text-sm border border-[#E2E8F0] rounded-xl bg-white text-[#1e293b] placeholder:text-[#C4CAD4] focus:outline-none focus:border-[#107789] focus:ring-1 focus:ring-[#107789]/20 transition-all";
const inpErr="w-full px-3 py-2.5 text-sm border border-[#fca5a5] rounded-xl bg-white text-[#1e293b] placeholder:text-[#C4CAD4] focus:outline-none focus:border-[#ef4444] focus:ring-1 focus:ring-[#ef4444]/20 transition-all";

function SPill({s,lang}:{s:PackageStatus;lang:string}){
  const c=SC[s];
  return(
    <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold whitespace-nowrap"
      style={{backgroundColor:c.bg,color:c.text,border:`1px solid ${c.border}`}}>
      <span className="w-1.5 h-1.5 rounded-full" style={{backgroundColor:c.dot}}/>
      {lang==="ar"?c.ar:c.en}
    </span>
  );
}

// ═══════════════════════════════════════════════════
// PACKAGE MODAL — wide 2-column
// ═══════════════════════════════════════════════════
type PkgForm = {nameEn:string;nameAr:string;descriptionEn:string;descriptionAr:string;lessons:number;price:number;durationDays:number;status:PackageStatus;popular:boolean;features:PkgFeature[];};

function PackageModal({pkg,lang,isRTL,t,onClose,onSave}:{
  pkg?:Package; lang:string; isRTL:boolean;
  t:(a:string,b:string)=>string;
  onClose:()=>void; onSave:(p:Package)=>void;
}){
  const isEdit=!!pkg;
  const [form,setForm]=useState<PkgForm>({
    nameEn:pkg?.nameEn??"", nameAr:pkg?.nameAr??"",
    descriptionEn:pkg?.descriptionEn??"", descriptionAr:pkg?.descriptionAr??"",
    lessons:pkg?.lessons??12, price:pkg?.price??100, durationDays:pkg?.durationDays??60,
    status:pkg?.status??"Active", popular:pkg?.popular??false,
    features:pkg?.features??[],
  });
  const [errors,setErrors]=useState<Record<string,string>>({});
  const [newEn,setNewEn]=useState(""); const [newAr,setNewAr]=useState("");
  const [loading,setLoading]=useState(false);

  const validate=()=>{
    const e:Record<string,string>={};
    if(!form.nameEn.trim())        e.nameEn=t("Required","مطلوب");
    if(!form.nameAr.trim())        e.nameAr=t("Required","مطلوب");
    if(!form.descriptionEn.trim()) e.descEn=t("Required","مطلوب");
    if(!form.descriptionAr.trim()) e.descAr=t("Required","مطلوب");
    if(form.lessons<1)             e.lessons=t("Min 1","الحد الأدنى 1");
    if(form.price<1)               e.price=t("Min 1","الحد الأدنى 1");
    if(form.durationDays<1)        e.days=t("Min 1","الحد الأدنى 1");
    setErrors(e); return Object.keys(e).length===0;
  };

  const addFeat=()=>{
    if(!newEn.trim()||!newAr.trim()) return;
    setForm(p=>({...p,features:[...p.features,{id:featId(),en:newEn.trim(),ar:newAr.trim()}]}));
    setNewEn(""); setNewAr("");
  };
  const removeFeat=(id:string)=>setForm(p=>({...p,features:p.features.filter(f=>f.id!==id)}));

  const handleSave=async()=>{
    if(!validate()) return;
    setLoading(true); await new Promise(r=>setTimeout(r,800)); setLoading(false);
    onSave({id:pkg?.id??genId("PKG"),currency:"$",...form});
  };

  return(
    <Backdrop onClose={onClose}>
      <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-3xl overflow-hidden"
        dir={isRTL?"rtl":"ltr"} style={{maxHeight:"92vh",overflowY:"auto"}}>
        <div className="h-1.5" style={{background:"linear-gradient(90deg,#107789,#E8763A)"}}/>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#F1F5F9]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EBF5F7] flex items-center justify-center text-[#107789]">{IC.dollar}</div>
            <div>
              <h2 className="text-base font-black text-[#1e293b]">{isEdit?t("Edit Package","تعديل الباقة"):t("New Package","باقة جديدة")}</h2>
              <p className="text-xs text-[#94a3b8] mt-0.5">{isEdit?t("Update package details","تحديث تفاصيل الباقة"):t("Fill in the details below","أدخل التفاصيل أدناه")}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#F5F7F9] text-[#94a3b8] hover:text-[#1e293b] hover:bg-[#E2E8F0] transition-all">{IC.close}</button>
        </div>

        {/* 2-column body */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x divide-[#F1F5F9]">

          {/* LEFT: Basic info */}
          <div className="p-6 space-y-4">
            <p className="text-xs font-black text-[#94a3b8] uppercase tracking-widest">{t("Package Info","معلومات الباقة")}</p>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#64748b]">{t("Name (EN) *","الاسم إنجليزي *")}</label>
                <input value={form.nameEn} onChange={e=>{setForm(p=>({...p,nameEn:e.target.value}));setErrors(p=>({...p,nameEn:""}));}}
                  placeholder="e.g. Basic Pack" className={errors.nameEn?inpErr:inpOk}/>
                {errors.nameEn&&<p className="text-[11px] text-[#ef4444]">{errors.nameEn}</p>}
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#64748b]">{t("Name (AR) *","الاسم عربي *")}</label>
                <input value={form.nameAr} onChange={e=>{setForm(p=>({...p,nameAr:e.target.value}));setErrors(p=>({...p,nameAr:""}));}}
                  placeholder="مثال: الباقة الأساسية" className={errors.nameAr?inpErr:inpOk} dir="rtl"/>
                {errors.nameAr&&<p className="text-[11px] text-[#ef4444]">{errors.nameAr}</p>}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#64748b]">{t("Description (EN) *","الوصف إنجليزي *")}</label>
              <input value={form.descriptionEn} onChange={e=>{setForm(p=>({...p,descriptionEn:e.target.value}));setErrors(p=>({...p,descEn:""}));}}
                placeholder="Short description..." className={errors.descEn?inpErr:inpOk}/>
              {errors.descEn&&<p className="text-[11px] text-[#ef4444]">{errors.descEn}</p>}
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#64748b]">{t("Description (AR) *","الوصف عربي *")}</label>
              <input value={form.descriptionAr} onChange={e=>{setForm(p=>({...p,descriptionAr:e.target.value}));setErrors(p=>({...p,descAr:""}));}}
                placeholder="وصف مختصر..." className={errors.descAr?inpErr:inpOk} dir="rtl"/>
              {errors.descAr&&<p className="text-[11px] text-[#ef4444]">{errors.descAr}</p>}
            </div>

            {/* Numbers row */}
            <div className="grid grid-cols-3 gap-2">
              {[
                {lbl:t("Lessons *","الدروس *"),   key:"lessons",    err:errors.lessons},
                {lbl:t("Price ($) *","السعر *"),  key:"price",      err:errors.price},
                {lbl:t("Days *","الأيام *"),       key:"durationDays",err:errors.days},
              ].map(r=>(
                <div key={r.key} className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#64748b]">{r.lbl}</label>
                  <input type="number" min={1}
                    value={(form as any)[r.key]}
                    onChange={e=>setForm(p=>({...p,[r.key]:+e.target.value}))}
                    className={r.err?inpErr:inpOk}/>
                  {r.err&&<p className="text-[11px] text-[#ef4444]">{r.err}</p>}
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Status + features */}
          <div className="p-6 space-y-5">
            <p className="text-xs font-black text-[#94a3b8] uppercase tracking-widest">{t("Settings & Features","الإعدادات والمميزات")}</p>

            {/* Status */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#64748b]">{t("Status","الحالة")}</label>
              <div className="flex gap-2">
                {(["Active","Inactive"] as PackageStatus[]).map(s=>{
                  const c=SC[s]; const active=form.status===s;
                  return(
                    <button key={s} type="button" onClick={()=>setForm(p=>({...p,status:s}))}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition-all active:scale-95 ${active?"":"border-[#E2E8F0] text-[#94a3b8] hover:bg-[#F8FAFC]"}`}
                      style={active?{backgroundColor:c.bg,color:c.text,borderColor:c.border}:{}}>
                      {lang==="ar"?c.ar:c.en}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Popular */}
            <button type="button" onClick={()=>setForm(p=>({...p,popular:!p.popular}))}
              className={`w-full flex items-center gap-2.5 py-2.5 px-4 rounded-xl text-sm font-semibold border transition-all active:scale-[.98] ${form.popular?"border-[#d97706]/50 bg-[#fef3c7] text-[#d97706]":"border-[#E2E8F0] text-[#94a3b8] hover:bg-[#F8FAFC]"}`}>
              {IC.star}{form.popular?t("Marked as Popular","مُميّزة كشائعة"):t("Mark as Popular","مييّز كشائعة")}
              {form.popular&&<span className="ms-auto text-[10px] font-black">{t("Popular","شائع")} ✓</span>}
            </button>

            {/* Features list */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#64748b]">{t("Features","المميزات")} ({form.features.length})</label>
              <div className="max-h-36 overflow-y-auto space-y-1.5 rounded-xl bg-[#F8FAFC] border border-[#F1F5F9] p-2">
                {form.features.length===0&&(
                  <p className="text-xs text-center text-[#94a3b8] py-2">{t("No features yet","لا توجد مميزات بعد")}</p>
                )}
                {form.features.map(f=>(
                  <div key={f.id} className="flex items-center gap-2 bg-white rounded-xl px-3 py-2 border border-[#F1F5F9]"
                    style={{animation:"slideUp .15s ease both"}}>
                    <span className="text-[#107789]">{IC.ok}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-semibold text-[#1e293b] truncate">{f.en}</p>
                      <p className="text-[10px] text-[#94a3b8] truncate">{f.ar}</p>
                    </div>
                    <button onClick={()=>removeFeat(f.id)} className="text-[#ef4444] hover:text-[#b91c1c] flex-shrink-0 active:scale-90 transition-all">
                      {IC.close}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Add feature */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-[#64748b]">{t("Add Feature","إضافة ميزة")}</p>
              <div className="grid grid-cols-2 gap-2">
                <input value={newEn} onChange={e=>setNewEn(e.target.value)}
                  placeholder={t("Feature in English","ميزة بالإنجليزية")}
                  className="w-full px-3 py-2 text-xs border border-[#E2E8F0] rounded-xl bg-white text-[#1e293b] placeholder:text-[#C4CAD4] focus:outline-none focus:border-[#107789] transition-all"/>
                <input value={newAr} onChange={e=>setNewAr(e.target.value)}
                  placeholder={t("Feature in Arabic","ميزة بالعربية")}
                  className="w-full px-3 py-2 text-xs border border-[#E2E8F0] rounded-xl bg-white text-[#1e293b] placeholder:text-[#C4CAD4] focus:outline-none focus:border-[#107789] transition-all" dir="rtl"/>
              </div>
              <button onClick={addFeat} disabled={!newEn.trim()||!newAr.trim()}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-white disabled:opacity-40 active:scale-95 transition-all"
                style={{backgroundColor:"#107789"}}>
                {IC.plus}{t("Add Feature","إضافة")}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#F1F5F9] bg-[#FAFBFC]">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm font-semibold border border-[#E2E8F0] text-[#64748b] hover:bg-[#F5F7F9] active:scale-95 transition-all">{t("Cancel","إلغاء")}</button>
          <button onClick={handleSave} disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90 active:scale-[.98] transition-all"
            style={{backgroundColor:loading?"#5FA8B3":"#107789"}}>
            {loading?<>{IC.spinner}{t("Saving…","جارٍ الحفظ…")}</>:<>{IC.ok}{isEdit?t("Save Changes","حفظ التغييرات"):t("Create Package","إنشاء الباقة")}</>}
          </button>
        </div>
      </div>
    </Backdrop>
  );
}

// ═══════════════════════════════════════════════════
// DELETE MODAL — wide
// ═══════════════════════════════════════════════════
function DeleteModal({pkg,lang,isRTL,t,onClose,onConfirm}:{pkg:Package;lang:string;isRTL:boolean;t:(a:string,b:string)=>string;onClose:()=>void;onConfirm:()=>void}){
  const [loading,setLoading]=useState(false);
  const handle=async()=>{setLoading(true);await new Promise(r=>setTimeout(r,600));setLoading(false);onConfirm();};
  return(
    <Backdrop onClose={onClose}>
      <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-2xl overflow-hidden"
        dir={isRTL?"rtl":"ltr"}>
        <div className="h-1.5 bg-[#ef4444]"/>
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#F1F5F9]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#fee2e2] flex items-center justify-center">{IC.warn}</div>
            <h2 className="text-base font-black text-[#1e293b]">{t("Delete Package","حذف الباقة")}</h2>
          </div>
          <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#F5F7F9] text-[#94a3b8] hover:bg-[#E2E8F0] transition-all">{IC.close}</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x divide-[#F1F5F9]">
          <div className="p-6 flex flex-col items-center justify-center text-center gap-4">
            <div className="w-20 h-20 rounded-2xl bg-[#fee2e2] flex items-center justify-center">
              <span className="text-4xl">🗑️</span>
            </div>
            <div>
              <p className="text-base font-black text-[#ef4444]">{t("This is permanent","هذا الإجراء دائم")}</p>
              <p className="text-xs text-[#94a3b8] mt-1">{t("Cannot be undone once deleted.","لا يمكن التراجع بعد الحذف.")}</p>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <p className="text-xs font-black text-[#94a3b8] uppercase tracking-widest">{t("Package to delete","الباقة المراد حذفها")}</p>
            <div className="rounded-2xl bg-[#F8FAFC] border border-[#F1F5F9] p-4 space-y-2">
              <p className="text-sm font-black text-[#1e293b]">{lang==="ar"?pkg.nameAr:pkg.nameEn}</p>
              <p className="text-xs text-[#94a3b8]">{pkg.id}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#EBF5F7] text-[#107789]">{pkg.lessons} {t("lessons","درس")}</span>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#fef3c7] text-[#d97706]">${pkg.price}</span>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#ede9fe] text-[#7c3aed]">{pkg.features.length} {t("features","مميزات")}</span>
              </div>
            </div>
            <div className="flex items-start gap-2 rounded-xl bg-[#FFFBEB] border border-[#FDE68A] p-3 text-xs text-[#d97706]">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="flex-shrink-0 mt-0.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <span>{t("Active subscriptions linked to this package may be affected.","الاشتراكات النشطة المرتبطة بهذه الباقة قد تتأثر.")}</span>
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
// PAGE
// ═══════════════════════════════════════════════════
export default function PackagesPricingPage(){
  const {lang,isRTL,t}=useLanguage();

  const [packages,setPackages]=useState<Package[]>(INITIAL);
  const [view,setView]=useState<"cards"|"table">("cards");
  const [filter,setFilter]=useState<PackageStatus|"All">("All");
  const [addOpen,setAddOpen]=useState(false);
  const [editPkg,setEditPkg]=useState<Package|null>(null);
  const [delPkg,setDelPkg]=useState<Package|null>(null);
  const [toast,setToast]=useState<string|null>(null);

  const fire=(msg:string)=>{setToast(msg);setTimeout(()=>setToast(null),3500);};

  const filtered=packages.filter(p=>filter==="All"||p.status===filter);

  const handleAdd=(p:Package)=>{setPackages(prev=>[p,...prev]);setAddOpen(false);fire(t(`"${p.nameEn}" created!`,`تم إنشاء "${p.nameAr}"!`));};
  const handleEdit=(p:Package)=>{setPackages(prev=>prev.map(x=>x.id===p.id?p:x));setEditPkg(null);fire(t(`"${p.nameEn}" updated!`,`تم تحديث "${p.nameAr}"!`));};
  const handleDel=()=>{if(!delPkg)return;setPackages(prev=>prev.filter(x=>x.id!==delPkg.id));fire(t(`"${delPkg.nameEn}" deleted.`,`تم حذف "${delPkg.nameAr}".`));setDelPkg(null);};
  const toggleStatus=(id:string)=>setPackages(prev=>prev.map(p=>p.id===id?{...p,status:p.status==="Active"?"Inactive":"Active"}:p));

  const stats=[
    {en:"Total Packages", ar:"إجمالي الباقات",  val:packages.length,                                            color:"#107789",bg:"#EBF5F7",delay:0},
    {en:"Active",         ar:"النشطة",            val:packages.filter(p=>p.status==="Active").length,            color:"#059669",bg:"#d1fae5",delay:0.07},
    {en:"Max Lessons",    ar:"أعلى درس",          val:packages.length?Math.max(...packages.map(p=>p.lessons)):0, color:"#7c3aed",bg:"#ede9fe",delay:0.14},
    {en:"Price Range",    ar:"نطاق السعر",        val:packages.length?`$${Math.min(...packages.map(p=>p.price))}–$${Math.max(...packages.map(p=>p.price))}`:"—",color:"#d97706",bg:"#fef3c7",delay:0.21},
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
            <h1 className="text-xl sm:text-2xl font-black text-[#1e293b] tracking-tight">{t("Packages & Pricing","الباقات والأسعار")}</h1>
            <p className="mt-1 text-xs sm:text-sm text-[#94a3b8]">{t("Manage subscription packages and pricing plans","إدارة باقات الاشتراك وخطط الأسعار")}</p>
          </div>
          <button onClick={()=>setAddOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90 active:scale-95 transition-all shadow-sm"
            style={{backgroundColor:"#107789",animation:"cardIn .4s .05s both"}}>
            {IC.plus}{t("New Package","باقة جديدة")}
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {stats.map(s=>(
            <div key={s.en} className="rounded-2xl bg-white border border-[#F1F5F9] shadow-sm p-4 sm:p-5 hover:shadow-md hover:border-[#b2dce4] transition-all duration-300"
              style={{animation:`cardIn .45s ${s.delay}s cubic-bezier(.34,1.2,.64,1) both`}}>
              <p className="text-2xl sm:text-3xl font-black leading-none" style={{color:s.color}}>{s.val}</p>
              <p className="text-xs text-[#94a3b8] mt-1.5 font-medium">{lang==="ar"?s.ar:s.en}</p>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3" style={{animation:"cardIn .4s .22s both"}}>
          <div className="flex items-center gap-1.5 flex-wrap">
            {(["All","Active","Inactive"] as const).map(s=>(
              <button key={s} onClick={()=>setFilter(s)}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold transition-all active:scale-95"
                style={filter===s?{backgroundColor:"#107789",color:"white",boxShadow:"0 2px 8px #10778940"}:{backgroundColor:"white",color:"#64748b",border:"1px solid #F1F5F9"}}>
                {s==="All"?t("All","الكل"):s==="Active"?t("Active","نشط"):t("Inactive","غير نشط")}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1 rounded-xl border border-[#F1F5F9] bg-white p-1">
            {(["cards","table"] as const).map(v=>(
              <button key={v} onClick={()=>setView(v)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${view===v?"bg-[#107789] text-white":"text-[#64748b] hover:text-[#107789]"}`}>
                {v==="cards"?t("Cards","بطاقات"):t("Table","جدول")}
              </button>
            ))}
          </div>
        </div>

        {/* Empty */}
        {filtered.length===0&&(
          <div className="bg-white rounded-2xl border border-[#F1F5F9] p-16 text-center shadow-sm" style={{animation:"fadeIn .4s both"}}>
            <p className="text-2xl mb-2">💳</p>
            <p className="text-sm font-bold text-[#1e293b]">{t("No packages found.","لا توجد باقات.")}</p>
            <button onClick={()=>setAddOpen(true)} className="mt-3 text-sm font-semibold text-[#107789] hover:underline">
              + {t("Create one","أنشئ باقة")}
            </button>
          </div>
        )}

        {/* Cards */}
        {view==="cards"&&filtered.length>0&&(
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {filtered.map((pkg,i)=>(
              <div key={pkg.id}
                className={`flex flex-col overflow-hidden rounded-2xl border bg-white shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 ${pkg.popular?"ring-1 ring-[#107789]/20 border-[#107789]/40":"border-[#F1F5F9]"} ${pkg.status==="Inactive"?"opacity-60":""}`}
                style={{animation:`cardIn .45s ${i*.08}s cubic-bezier(.34,1.2,.64,1) both`}}>
                {pkg.popular&&(
                  <div className="py-1.5 text-center text-[10px] font-black uppercase tracking-wide text-white"
                    style={{backgroundColor:"#107789"}}>
                    {IC.star} {t("Most Popular","الأكثر شيوعًا")}
                  </div>
                )}
                <div className="flex flex-col flex-1 gap-4 p-5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-black text-[#1e293b] truncate">{lang==="ar"?pkg.nameAr:pkg.nameEn}</p>
                      <p className="text-xs text-[#94a3b8] mt-0.5 line-clamp-1">{lang==="ar"?pkg.descriptionAr:pkg.descriptionEn}</p>
                    </div>
                    <SPill s={pkg.status} lang={lang}/>
                  </div>

                  <div>
                    <div className="flex items-end gap-1">
                      <span className="text-3xl font-black text-[#1e293b]">{pkg.currency}{pkg.price}</span>
                      <span className="mb-1 text-xs text-[#94a3b8]">/ {pkg.lessons} {t("lessons","درس")}</span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-1 text-[10px] text-[#94a3b8]">
                      {IC.clock}<span>{pkg.durationDays} {t("days","يوم")}</span>
                      <span>·</span>
                      <span>{pkg.features.length} {t("features","ميزات")}</span>
                    </div>
                  </div>

                  <ul className="flex-1 space-y-1.5">
                    {pkg.features.slice(0,4).map(f=>(
                      <li key={f.id} className="flex items-center gap-2 text-xs text-[#64748b]">
                        <span className="text-[#107789] flex-shrink-0">{IC.ok}</span>
                        <span className="truncate">{lang==="ar"?f.ar:f.en}</span>
                      </li>
                    ))}
                    {pkg.features.length>4&&(
                      <li className="text-[10px] text-[#94a3b8] ps-5">+{pkg.features.length-4} {t("more","أكثر")}</li>
                    )}
                  </ul>

                  <div className="flex items-center gap-2 border-t border-[#F1F5F9] pt-3">
                    <button onClick={()=>setEditPkg(pkg)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold text-[#107789] border border-[#107789]/30 hover:bg-[#EBF5F7] active:scale-95 transition-all">
                      {IC.edit}{t("Edit","تعديل")}
                    </button>
                    <button onClick={()=>toggleStatus(pkg.id)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold border active:scale-95 transition-all ${pkg.status==="Active"?"border-[#d97706]/30 text-[#d97706] hover:bg-[#fef3c7]":"border-[#059669]/30 text-[#059669] hover:bg-[#d1fae5]"}`}>
                      {pkg.status==="Active"?t("Deactivate","تعطيل"):t("Activate","تفعيل")}
                    </button>
                    <button onClick={()=>setDelPkg(pkg)}
                      className="w-9 h-9 flex items-center justify-center rounded-xl border border-[#fca5a5]/40 text-[#ef4444] hover:bg-[#fee2e2] active:scale-95 transition-all flex-shrink-0">
                      {IC.trash}
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Quick add card */}
            <button onClick={()=>setAddOpen(true)}
              className="flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[#E2E8F0] text-[#94a3b8] hover:border-[#107789] hover:text-[#107789] hover:bg-[#EBF5F7] transition-all min-h-[220px] active:scale-[.98]"
              style={{animation:`cardIn .45s ${filtered.length*.08}s both`}}>
              {IC.plus}<span className="text-sm font-bold">{t("New Package","باقة جديدة")}</span>
            </button>
          </div>
        )}

        {/* Table */}
        {view==="table"&&filtered.length>0&&(
          <div className="rounded-2xl bg-white border border-[#F1F5F9] shadow-sm overflow-hidden" style={{animation:"cardIn .4s .28s both"}}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm" style={{borderCollapse:"collapse"}}>
                <thead>
                  <tr style={{backgroundColor:"#F8FAFC"}}>
                    {[{en:"Package",ar:"الباقة"},{en:"Lessons",ar:"الدروس"},{en:"Price",ar:"السعر"},{en:"Duration",ar:"المدة"},{en:"Features",ar:"المميزات"},{en:"Status",ar:"الحالة"},{en:"Actions",ar:"الإجراءات"}].map(col=>(
                      <th key={col.en} className="px-5 py-3 text-start text-xs font-semibold uppercase tracking-wide text-[#94a3b8] whitespace-nowrap border-b border-[#F1F5F9]">
                        {lang==="ar"?col.ar:col.en}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((pkg,i)=>(
                    <tr key={pkg.id} className="hover:bg-[#F8FAFC] transition-colors border-b border-[#F1F5F9] last:border-0"
                      style={{animation:`slideUp .3s ${0.3+i*.05}s ease both`}}>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-[#1e293b]">{lang==="ar"?pkg.nameAr:pkg.nameEn}</p>
                          {pkg.popular&&<span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#EBF5F7] text-[#107789]">{t("Popular","شائع")}</span>}
                        </div>
                        <p className="text-[10px] text-[#94a3b8] mt-0.5 font-mono">{pkg.id}</p>
                      </td>
                      <td className="px-5 py-3.5 text-xs text-[#64748b]">{pkg.lessons} {t("lessons","درس")}</td>
                      <td className="px-5 py-3.5 text-sm font-black text-[#1e293b]">{pkg.currency}{pkg.price}</td>
                      <td className="px-5 py-3.5 text-xs text-[#94a3b8]">{pkg.durationDays} {t("days","يوم")}</td>
                      <td className="px-5 py-3.5 text-xs text-[#64748b]">{pkg.features.length}</td>
                      <td className="px-5 py-3.5"><SPill s={pkg.status} lang={lang}/></td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <button onClick={()=>setEditPkg(pkg)} className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-[#107789] border border-[#E2E8F0] hover:bg-[#EBF5F7] active:scale-95 transition-all">{IC.edit}{t("Edit","تعديل")}</button>
                          <button onClick={()=>toggleStatus(pkg.id)} className={`px-3 py-1.5 rounded-xl text-xs font-semibold border active:scale-95 transition-all ${pkg.status==="Active"?"text-[#d97706] border-[#E2E8F0] hover:bg-[#fef3c7]":"text-[#059669] border-[#E2E8F0] hover:bg-[#d1fae5]"}`}>
                            {pkg.status==="Active"?t("Deactivate","تعطيل"):t("Activate","تفعيل")}
                          </button>
                          <button onClick={()=>setDelPkg(pkg)} className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-[#ef4444] border border-[#E2E8F0] hover:bg-[#fee2e2] active:scale-95 transition-all">{IC.trash}{t("Delete","حذف")}</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>

      {addOpen&&<PackageModal lang={lang} isRTL={isRTL} t={t} onClose={()=>setAddOpen(false)} onSave={handleAdd}/>}
      {editPkg&&<PackageModal pkg={editPkg} lang={lang} isRTL={isRTL} t={t} onClose={()=>setEditPkg(null)} onSave={handleEdit}/>}
      {delPkg&&<DeleteModal pkg={delPkg} lang={lang} isRTL={isRTL} t={t} onClose={()=>setDelPkg(null)} onConfirm={handleDel}/>}
      {toast&&<Toast msg={toast} onClose={()=>setToast(null)}/>}
    </>
  );
}