"use client";

import { useState, useRef } from "react";
import { useLanguage } from "@/src/contexts/LanguageContext";

// ─── Types ────────────────────────────────────────────────────
type Tab = "account" | "security" | "billing" | "notifications";

// ─── Icons ────────────────────────────────────────────────────
const IC = {
  account: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  security:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/><circle cx="12" cy="16" r="1" fill="currentColor"/></svg>,
  billing: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>,
  notif:   <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  upload:  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,
  eye:     (show:boolean) => show
    ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/><line x1="2" y1="2" x2="22" y2="22"/></svg>
    : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  ok:      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>,
  warn:    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  close:   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  spinner: <svg className="animate-spin" width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="white" strokeWidth="2" strokeOpacity="0.3"/><path d="M7 1.5a5.5 5.5 0 015.5 5.5" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>,
  shield2: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  key:     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="15" r="4"/><path d="M15.5 9l-7 7"/><path d="M18 7l-1 2-2-1"/><path d="M22 3l-1 2-2-1"/><path d="M20 5l-7 7"/></svg>,
  device:  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>,
  star:    <svg width="14" height="14" viewBox="0 0 24 24" fill="#d97706" stroke="#d97706" strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  check2:  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>,
  crown:   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2 20h20M5 20V10l7-7 7 7v10"/></svg>,
  card:    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>,
};

// ─── Shared input ─────────────────────────────────────────────
function Field({label,error,children}:{label:string;error?:string;children:React.ReactNode}){
  return(
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-[#64748b]">{label}</label>
      {children}
      {error&&<p className="text-[11px] text-[#ef4444] flex items-center gap-1">{IC.warn}{error}</p>}
    </div>
  );
}

const inpBase="w-full px-3 py-2.5 text-sm text-[#1e293b] bg-white border rounded-xl placeholder:text-[#C4CAD4] outline-none transition-all";
const inpOk  =`${inpBase} border-[#E2E8F0] focus:border-[#107789] focus:ring-1 focus:ring-[#107789]/20`;
const inpErr =`${inpBase} border-[#fca5a5] focus:border-[#ef4444] focus:ring-1 focus:ring-[#ef4444]/20`;

// ─── Toggle switch ────────────────────────────────────────────
function Toggle({checked,onChange}:{checked:boolean;onChange:(v:boolean)=>void}){
  return(
    <button type="button" onClick={()=>onChange(!checked)}
      className="relative flex-shrink-0 w-11 h-6 rounded-full transition-all duration-300 active:scale-95"
      style={{backgroundColor:checked?"#107789":"#E2E8F0"}}>
      <span className="absolute top-[3px] h-[18px] w-[18px] rounded-full bg-white shadow-sm transition-all duration-300"
        style={{left:checked?"20px":"3px"}}/>
    </button>
  );
}

// ─── Toast ────────────────────────────────────────────────────
function Toast({msg,type,onClose}:{msg:string;type:"success"|"error";onClose:()=>void}){
  const c=type==="success"?{bg:"#f0fdf4",br:"#bbf7d0",tx:"#15803d"}:{bg:"#fef2f2",br:"#fecaca",tx:"#dc2626"};
  return(
    <div className="fixed bottom-5 end-5 z-[60] flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl text-sm font-semibold max-w-[calc(100vw-2.5rem)]"
      style={{backgroundColor:c.bg,border:`1px solid ${c.br}`,color:c.tx,animation:"slideUp .3s cubic-bezier(.34,1.56,.64,1) both"}}>
      {type==="success"?IC.ok:IC.warn}<span className="flex-1 min-w-0 truncate">{msg}</span>
      <button onClick={onClose} className="opacity-50 hover:opacity-100">{IC.close}</button>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// ACCOUNT TAB
// ═══════════════════════════════════════════════════
function AccountTab({t,isRTL,lang}:{t:(a:string,b:string)=>string;isRTL:boolean;lang:string}){
  const fileRef=useRef<HTMLInputElement>(null);
  const [avatar,setAvatar]=useState<string|null>(null);
  const [form,setForm]=useState({
    firstName:"Ahmad",firstNameAr:"أحمد",
    lastName:"Nasser",lastNameAr:"ناصر",
    email:"ahmad.nasser@evothink.com",
    phone:"+966 50 111 2222",
    org:"Evothink",
    address:"",state:"",zipCode:"",
    country:"",language:"",timezone:"",currency:"",
  });
  const [errors,setErrors]=useState<Record<string,string>>({});
  const [loading,setLoading]=useState(false);

  const validate=()=>{
    const e:Record<string,string>={};
    if(!form.firstName.trim()) e.firstName=t("Required","مطلوب");
    if(!form.lastName.trim())  e.lastName=t("Required","مطلوب");
    if(!form.email.trim())     e.email=t("Required","مطلوب");
    else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email=t("Invalid email","بريد غير صحيح");
    setErrors(e); return Object.keys(e).length===0;
  };

  const handleSave=async()=>{
    if(!validate()) return;
    setLoading(true); await new Promise(r=>setTimeout(r,1000)); setLoading(false);
    return true;
  };

  const handleFile=(e:React.ChangeEvent<HTMLInputElement>)=>{
    const f=e.target.files?.[0];
    if(!f) return;
    const r=new FileReader();
    r.onload=ev=>setAvatar(ev.target?.result as string);
    r.readAsDataURL(f);
  };

  const SET=(k:string)=>(v:string)=>{ setForm(p=>({...p,[k]:v})); setErrors(p=>({...p,[k]:""})); };

  const COUNTRIES=["Saudi Arabia","UAE","Kuwait","Qatar","Jordan","Egypt"];
  const LANGUAGES=["Arabic","English","French"];
  const TIMEZONES=["Asia/Riyadh (UTC+3)","Asia/Dubai (UTC+4)","Europe/London (UTC+0)","America/New_York (UTC-5)"];
  const CURRENCIES=["SAR – Saudi Riyal","USD – US Dollar","EUR – Euro","AED – UAE Dirham"];

  return(
    <div className="space-y-8" style={{animation:"fadeIn .35s ease both"}}>

      {/* Avatar section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 p-5 sm:p-6 rounded-2xl bg-white border border-[#F1F5F9] shadow-sm"
        style={{animation:"cardIn .4s .05s cubic-bezier(.34,1.2,.64,1) both"}}>
        {/* Avatar circle */}
        <div className="relative flex-shrink-0">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-[#b2dce4] shadow-md bg-[#EBF5F7] flex items-center justify-center">
            {avatar
              ? <img src={avatar} alt="avatar" className="w-full h-full object-cover"/>
              : <span className="text-3xl sm:text-4xl font-black text-[#107789]">
                  {(lang==="ar"?form.firstNameAr:form.firstName).charAt(0)}
                </span>}
          </div>
          {avatar&&(
            <button onClick={()=>setAvatar(null)}
              className="absolute -top-1.5 -end-1.5 w-6 h-6 rounded-full bg-[#ef4444] text-white flex items-center justify-center shadow-md hover:bg-[#dc2626] transition-all active:scale-90">
              {IC.close}
            </button>
          )}
        </div>
        {/* Upload controls */}
        <div className="flex flex-col gap-2 min-w-0">
          <div className="flex flex-wrap gap-2">
            <button onClick={()=>fileRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90 active:scale-95 transition-all"
              style={{backgroundColor:"#107789"}}>
              {IC.upload}{t("Upload new photo","رفع صورة جديدة")}
            </button>
            {avatar&&(
              <button onClick={()=>setAvatar(null)}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold border border-[#E2E8F0] text-[#64748b] hover:bg-[#F5F7F9] active:scale-95 transition-all">
                {t("Reset","إعادة تعيين")}
              </button>
            )}
          </div>
          <p className="text-xs text-[#94a3b8]">{t("Allowed JPG, GIF or PNG. Max size of 800K","JPG أو GIF أو PNG. الحجم الأقصى 800K")}</p>
        </div>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile}/>
      </div>

      {/* Personal info form */}
      <div className="rounded-2xl bg-white border border-[#F1F5F9] shadow-sm overflow-hidden"
        style={{animation:"cardIn .4s .1s cubic-bezier(.34,1.2,.64,1) both"}}>
        <div className="px-5 sm:px-6 py-4 border-b border-[#F1F5F9] bg-[#FAFBFC]">
          <h3 className="text-sm font-bold text-[#1e293b]">{t("Personal Information","المعلومات الشخصية")}</h3>
          <p className="text-xs text-[#94a3b8] mt-0.5">{t("Update your name, email and contact details","تحديث الاسم والبريد وبيانات التواصل")}</p>
        </div>
        <div className="p-5 sm:p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label={`${t("First Name","الاسم الأول")} *`} error={errors.firstName}>
              <input value={lang==="ar"?form.firstNameAr:form.firstName}
                onChange={e=>SET(lang==="ar"?"firstNameAr":"firstName")(e.target.value)}
                className={errors.firstName?inpErr:inpOk} placeholder={t("Ahmad","أحمد")} dir={isRTL?"rtl":"ltr"}/>
            </Field>
            <Field label={`${t("Last Name","اسم العائلة")} *`} error={errors.lastName}>
              <input value={lang==="ar"?form.lastNameAr:form.lastName}
                onChange={e=>SET(lang==="ar"?"lastNameAr":"lastName")(e.target.value)}
                className={errors.lastName?inpErr:inpOk} placeholder={t("Nasser","ناصر")} dir={isRTL?"rtl":"ltr"}/>
            </Field>
            <Field label={`${t("E-mail","البريد الإلكتروني")} *`} error={errors.email}>
              <input type="email" value={form.email} onChange={e=>SET("email")(e.target.value)}
                className={errors.email?inpErr:inpOk} placeholder="you@example.com" dir="ltr"/>
            </Field>
            <Field label={t("Organization","المؤسسة")}>
              <input value={form.org} onChange={e=>SET("org")(e.target.value)}
                className={inpOk} placeholder="Evothink" dir={isRTL?"rtl":"ltr"}/>
            </Field>
            <Field label={t("Phone Number","رقم الهاتف")}>
              <input value={form.phone} onChange={e=>SET("phone")(e.target.value)}
                className={inpOk} placeholder="+966 50 000 0000" dir="ltr"/>
            </Field>
            <Field label={t("Address","العنوان")}>
              <input value={form.address} onChange={e=>SET("address")(e.target.value)}
                className={inpOk} placeholder={t("Address","العنوان")} dir={isRTL?"rtl":"ltr"}/>
            </Field>
            <Field label={t("State","المنطقة")}>
              <input value={form.state} onChange={e=>SET("state")(e.target.value)}
                className={inpOk} placeholder={t("e.g. Riyadh","مثال: الرياض")} dir={isRTL?"rtl":"ltr"}/>
            </Field>
            <Field label={t("Zip Code","الرمز البريدي")}>
              <input value={form.zipCode} onChange={e=>SET("zipCode")(e.target.value)}
                className={inpOk} placeholder="12345" dir="ltr"/>
            </Field>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label={t("Country","البلد")}>
              <select value={form.country} onChange={e=>SET("country")(e.target.value)} className={`${inpOk} cursor-pointer`}>
                <option value="">{t("Select","اختر")}</option>
                {COUNTRIES.map(c=><option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
            <Field label={t("Language","اللغة")}>
              <select value={form.language} onChange={e=>SET("language")(e.target.value)} className={`${inpOk} cursor-pointer`}>
                <option value="">{t("Select Language","اختر اللغة")}</option>
                {LANGUAGES.map(l=><option key={l} value={l}>{l}</option>)}
              </select>
            </Field>
            <Field label={t("Timezone","المنطقة الزمنية")}>
              <select value={form.timezone} onChange={e=>SET("timezone")(e.target.value)} className={`${inpOk} cursor-pointer`}>
                <option value="">{t("Select Timezone","اختر المنطقة الزمنية")}</option>
                {TIMEZONES.map(z=><option key={z} value={z}>{z}</option>)}
              </select>
            </Field>
            <Field label={t("Currency","العملة")}>
              <select value={form.currency} onChange={e=>SET("currency")(e.target.value)} className={`${inpOk} cursor-pointer`}>
                <option value="">{t("Select Currency","اختر العملة")}</option>
                {CURRENCIES.map(c=><option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
          </div>
        </div>

        <div className="px-5 sm:px-6 py-4 border-t border-[#F1F5F9] bg-[#FAFBFC] flex flex-wrap items-center gap-3">
          <button onClick={async()=>{const ok=await handleSave();if(ok)return;}}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90 active:scale-[.98] transition-all"
            style={{backgroundColor:loading?"#5FA8B3":"#107789"}}>
            {loading?<>{IC.spinner}{t("Saving…","جارٍ الحفظ…")}</>:<>{IC.ok}{t("Save changes","حفظ التغييرات")}</>}
          </button>
          <button onClick={()=>setErrors({})} className="px-5 py-2.5 rounded-xl text-sm font-semibold border border-[#E2E8F0] text-[#64748b] hover:bg-[#F5F7F9] active:scale-95 transition-all">
            {t("Cancel","إلغاء")}
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// SECURITY TAB
// ═══════════════════════════════════════════════════
function SecurityTab({t,isRTL}:{t:(a:string,b:string)=>string;isRTL:boolean}){
  const [show,setShow]=useState({curr:false,newP:false,conf:false});
  const [form,setForm]=useState({curr:"",newP:"",conf:""});
  const [errors,setErrors]=useState<Record<string,string>>({});
  const [loading,setLoading]=useState(false);
  const [twoFA,setTwoFA]=useState(false);

  const strength=(pw:string)=>{
    if(!pw) return {lvl:0,color:"#E2E8F0",en:"",ar:""};
    if(pw.length<6) return {lvl:1,color:"#ef4444",en:"Weak",ar:"ضعيفة"};
    if(pw.length<10) return {lvl:2,color:"#f97316",en:"Medium",ar:"متوسطة"};
    return {lvl:3,color:"#22c55e",en:"Strong",ar:"قوية"};
  };
  const s=strength(form.newP);

  const validate=()=>{
    const e:Record<string,string>={};
    if(!form.curr) e.curr=t("Required","مطلوب");
    if(!form.newP) e.newP=t("Required","مطلوب");
    else if(form.newP.length<8) e.newP=t("Min 8 characters","8 أحرف على الأقل");
    if(!form.conf) e.conf=t("Required","مطلوب");
    else if(form.newP!==form.conf) e.conf=t("Passwords do not match","كلمتا المرور غير متطابقتان");
    setErrors(e); return Object.keys(e).length===0;
  };

 const DEVICES = [
  {
    name: "MacBook Pro 16",
    os: "macOS Sonoma",
    time: t("Active now", "نشط الآن"),
    loc: "Riyadh, SA",
    current: true
  },
  {
    name: "iPhone 15 Pro",
    os: "iOS 17",
    time: "2h ago",
    loc: "Riyadh, SA",
    current: false
  },
  {
    name: "Chrome / Windows",
    os: "Windows 11",
    time: "3 days ago",
    loc: "Dubai, UAE",
    current: false
  }
];

  return(
    <div className="space-y-6" style={{animation:"fadeIn .35s ease both"}}>

      {/* Change password */}
      <div className="rounded-2xl bg-white border border-[#F1F5F9] shadow-sm overflow-hidden"
        style={{animation:"cardIn .4s .05s cubic-bezier(.34,1.2,.64,1) both"}}>
        <div className="px-5 sm:px-6 py-4 border-b border-[#F1F5F9] bg-[#FAFBFC] flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#EBF5F7] flex items-center justify-center text-[#107789]">{IC.key}</div>
          <div>
            <h3 className="text-sm font-bold text-[#1e293b]">{t("Change Password","تغيير كلمة المرور")}</h3>
            <p className="text-xs text-[#94a3b8] mt-0.5">{t("Update your password regularly to stay secure","حدّث كلمة مرورك بانتظام")}</p>
          </div>
        </div>
        <div className="p-5 sm:p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Current */}
            <Field label={t("Current Password","كلمة المرور الحالية")} error={errors.curr}>
              <div className="relative">
                <input type={show.curr?"text":"password"} value={form.curr} onChange={e=>{setForm(p=>({...p,curr:e.target.value}));setErrors(p=>({...p,curr:""}));}}
                  className={errors.curr?inpErr:inpOk} placeholder="••••••••" dir="ltr"
                  style={{paddingInlineEnd:40}}/>
                <button type="button" onClick={()=>setShow(p=>({...p,curr:!p.curr}))} className="absolute top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#107789] transition-colors" style={{[isRTL?"left":"right"]:"12px"}}>
                  {IC.eye(show.curr)}
                </button>
              </div>
            </Field>
            {/* New */}
            <Field label={t("New Password","كلمة المرور الجديدة")} error={errors.newP}>
              <div className="relative">
                <input type={show.newP?"text":"password"} value={form.newP} onChange={e=>{setForm(p=>({...p,newP:e.target.value}));setErrors(p=>({...p,newP:""}));}}
                  className={errors.newP?inpErr:inpOk} placeholder="••••••••" dir="ltr"
                  style={{paddingInlineEnd:40}}/>
                <button type="button" onClick={()=>setShow(p=>({...p,newP:!p.newP}))} className="absolute top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#107789] transition-colors" style={{[isRTL?"left":"right"]:"12px"}}>
                  {IC.eye(show.newP)}
                </button>
              </div>
              {form.newP&&(
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex gap-1 flex-1">{[1,2,3].map(n=><div key={n} className="flex-1 h-1 rounded-full transition-all" style={{backgroundColor:n<=s.lvl?s.color:"#E2E8F0"}}/>)}</div>
                  <span className="text-[11px] font-bold whitespace-nowrap" style={{color:s.color}}>{isRTL?s.ar:s.en}</span>
                </div>
              )}
            </Field>
            {/* Confirm */}
            <Field label={t("Confirm New Password","تأكيد كلمة المرور الجديدة")} error={errors.conf}>
              <div className="relative">
                <input type={show.conf?"text":"password"} value={form.conf} onChange={e=>{setForm(p=>({...p,conf:e.target.value}));setErrors(p=>({...p,conf:""}));}}
                  className={errors.conf?inpErr:inpOk} placeholder="••••••••" dir="ltr"
                  style={{paddingInlineEnd:40}}/>
                <button type="button" onClick={()=>setShow(p=>({...p,conf:!p.conf}))} className="absolute top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#107789] transition-colors" style={{[isRTL?"left":"right"]:"12px"}}>
                  {IC.eye(show.conf)}
                </button>
              </div>
              {form.conf&&form.newP===form.conf&&(
                <p className="flex items-center gap-1 text-[11px] font-medium text-[#059669] mt-1">{IC.ok}{t("Passwords match","متطابقتان")}</p>
              )}
            </Field>
          </div>
        </div>
        <div className="px-5 sm:px-6 py-4 border-t border-[#F1F5F9] bg-[#FAFBFC]">
          <button onClick={async()=>{if(!validate())return;setLoading(true);await new Promise(r=>setTimeout(r,900));setLoading(false);setForm({curr:"",newP:"",conf:""}); }}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90 active:scale-[.98] transition-all"
            style={{backgroundColor:loading?"#5FA8B3":"#107789"}}>
            {loading?<>{IC.spinner}{t("Updating…","جارٍ التحديث…")}</>:<>{IC.ok}{t("Update Password","تحديث كلمة المرور")}</>}
          </button>
        </div>
      </div>

      {/* 2FA */}
      <div className="rounded-2xl bg-white border border-[#F1F5F9] shadow-sm overflow-hidden"
        style={{animation:"cardIn .4s .1s cubic-bezier(.34,1.2,.64,1) both"}}>
        <div className="px-5 sm:px-6 py-4 border-b border-[#F1F5F9] bg-[#FAFBFC] flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#EBF5F7] flex items-center justify-center text-[#107789]">{IC.shield2}</div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-[#1e293b]">{t("Two-Factor Authentication","المصادقة الثنائية")}</h3>
            <p className="text-xs text-[#94a3b8] mt-0.5">{t("Add an extra layer of security to your account","أضف طبقة أمان إضافية لحسابك")}</p>
          </div>
          <Toggle checked={twoFA} onChange={setTwoFA}/>
        </div>
        {twoFA&&(
          <div className="p-5 sm:p-6 bg-[#EBF5F7] border-t border-[#b2dce4]" style={{animation:"slideUp .2s ease both"}}>
            <p className="text-sm font-semibold text-[#107789]">{t("2FA is enabled ✓","المصادقة الثنائية مُفعّلة ✓")}</p>
            <p className="text-xs text-[#107789]/70 mt-1">{t("You'll be asked for a code each login.","ستُطلب منك رمز عند كل تسجيل دخول.")}</p>
          </div>
        )}
      </div>

      {/* Devices */}
      <div className="rounded-2xl bg-white border border-[#F1F5F9] shadow-sm overflow-hidden"
        style={{animation:"cardIn .4s .15s cubic-bezier(.34,1.2,.64,1) both"}}>
        <div className="px-5 sm:px-6 py-4 border-b border-[#F1F5F9] bg-[#FAFBFC] flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#EBF5F7] flex items-center justify-center text-[#107789]">{IC.device}</div>
          <div>
            <h3 className="text-sm font-bold text-[#1e293b]">{t("Active Sessions","الجلسات النشطة")}</h3>
            <p className="text-xs text-[#94a3b8] mt-0.5">{t("Devices currently signed in","الأجهزة المسجّلة حالياً")}</p>
          </div>
        </div>
        <div className="divide-y divide-[#F8FAFC]">
          {DEVICES.map((d,i)=>(
            <div key={i} className="flex items-center gap-4 px-5 sm:px-6 py-4 hover:bg-[#F8FAFC] transition-colors"
              style={{animation:`slideUp .3s ${i*.06}s ease both`}}>
              <div className="w-10 h-10 rounded-xl bg-[#EBF5F7] flex items-center justify-center text-[#107789] flex-shrink-0">{IC.device}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-semibold text-[#1e293b]">{d.name}</p>
                  {d.current&&<span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#d1fae5] text-[#059669]">{t("Current","الحالي")}</span>}
                </div>
                <p className="text-xs text-[#94a3b8] mt-0.5">{d.os} · {d.loc} · {d.time}</p>
              </div>
              {!d.current&&(
                <button className="flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold text-[#ef4444] border border-[#fca5a5] hover:bg-[#fee2e2] active:scale-95 transition-all">
                  {t("Sign out","تسجيل الخروج")}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// BILLING TAB
// ═══════════════════════════════════════════════════
function BillingTab({t}:{t:(a:string,b:string)=>string}){
  const [plan,setPlan]=useState<"starter"|"pro"|"enterprise">("pro");

  const PLANS=[
    { key:"starter", nameEn:"Starter",    nameAr:"المبتدئ",    price:"$0",   period:"/mo",
      features:[{en:"Up to 5 students",ar:"حتى 5 طلاب"},{en:"Basic reports",ar:"تقارير أساسية"},{en:"Email support",ar:"دعم عبر البريد"}]},
    { key:"pro",     nameEn:"Pro",         nameAr:"المحترف",    price:"$29",  period:"/mo", popular:true,
      features:[{en:"Unlimited students",ar:"طلاب غير محدودين"},{en:"Advanced analytics",ar:"تحليلات متقدمة"},{en:"Priority support",ar:"دعم بالأولوية"},{en:"Custom branding",ar:"علامة تجارية مخصصة"}]},
    { key:"enterprise",nameEn:"Enterprise",nameAr:"المؤسسي",   price:"$99",  period:"/mo",
      features:[{en:"Everything in Pro",ar:"كل ما في المحترف"},{en:"API access",ar:"وصول API"},{en:"Dedicated manager",ar:"مدير حساب مخصص"},{en:"SLA guarantee",ar:"ضمان مستوى الخدمة"}]},
  ] as const;

  const INVOICES=[
    {date:"Mar 2025",amount:"$29.00",status:"Paid",   statusAr:"مدفوع"},
    {date:"Feb 2025",amount:"$29.00",status:"Paid",   statusAr:"مدفوع"},
    {date:"Jan 2025",amount:"$29.00",status:"Paid",   statusAr:"مدفوع"},
    {date:"Dec 2024",amount:"$29.00",status:"Paid",   statusAr:"مدفوع"},
  ];

  return(
    <div className="space-y-6" style={{animation:"fadeIn .35s ease both"}}>

      {/* Plans */}
      <div className="rounded-2xl bg-white border border-[#F1F5F9] shadow-sm overflow-hidden"
        style={{animation:"cardIn .4s .05s cubic-bezier(.34,1.2,.64,1) both"}}>
        <div className="px-5 sm:px-6 py-4 border-b border-[#F1F5F9] bg-[#FAFBFC] flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#EBF5F7] flex items-center justify-center text-[#107789]">{IC.crown}</div>
          <div>
            <h3 className="text-sm font-bold text-[#1e293b]">{t("Subscription Plan","خطة الاشتراك")}</h3>
            <p className="text-xs text-[#94a3b8] mt-0.5">{t("Choose the plan that fits your needs","اختر الخطة المناسبة لاحتياجاتك")}</p>
          </div>
        </div>
        <div className="p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
         {PLANS.map((p, i) => {
  const active = plan === p.key;

  return (
    <div
      key={p.key}
      onClick={() => setPlan(p.key as typeof plan)}
      className={`relative rounded-2xl border-2 p-5 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 active:scale-[.98] ${
        active
          ? "border-[#107789] shadow-lg"
          : "border-[#F1F5F9] hover:border-[#b2dce4] hover:shadow-md"
      }`}
      style={{ animation: `cardIn .4s ${i * 0.07}s cubic-bezier(.34,1.2,.64,1) both` }}
    >
      {"popular" in p && p.popular && (
        <div
          className="absolute -top-3 start-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-black text-white whitespace-nowrap"
          style={{ backgroundColor: "#107789" }}
        >
          {t("Most Popular", "الأكثر شيوعاً")}
        </div>
      )}

      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-black text-[#1e293b]">{t(p.nameEn, p.nameAr)}</p>
        {active && (
          <span className="w-5 h-5 rounded-full bg-[#107789] flex items-center justify-center text-white">
            {IC.check2}
          </span>
        )}
      </div>

      <p className="text-2xl font-black text-[#1e293b] mb-1">
        {p.price}
        <span className="text-sm font-medium text-[#94a3b8]">{p.period}</span>
      </p>

      <ul className="space-y-1.5 mt-3">
        {p.features.map((f) => (
          <li key={f.en} className="flex items-center gap-2 text-xs text-[#64748b]">
            <span className="text-[#107789] flex-shrink-0">{IC.check2}</span>
            {t(f.en, f.ar)}
          </li>
        ))}
      </ul>
    </div>
  );
})}
        </div>
        <div className="px-5 sm:px-6 py-4 border-t border-[#F1F5F9] bg-[#FAFBFC]">
          <button className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90 active:scale-[.98] transition-all" style={{backgroundColor:"#107789"}}>
            {IC.crown}{t("Upgrade Plan","ترقية الخطة")}
          </button>
        </div>
      </div>

      {/* Payment method */}
      <div className="rounded-2xl bg-white border border-[#F1F5F9] shadow-sm overflow-hidden"
        style={{animation:"cardIn .4s .1s cubic-bezier(.34,1.2,.64,1) both"}}>
        <div className="px-5 sm:px-6 py-4 border-b border-[#F1F5F9] bg-[#FAFBFC] flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#EBF5F7] flex items-center justify-center text-[#107789]">{IC.card}</div>
          <div>
            <h3 className="text-sm font-bold text-[#1e293b]">{t("Payment Method","طريقة الدفع")}</h3>
            <p className="text-xs text-[#94a3b8] mt-0.5">{t("Your default payment method","طريقة الدفع الافتراضية")}</p>
          </div>
        </div>
        <div className="p-5 sm:p-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-9 rounded-lg bg-[#1a1f71] flex items-center justify-center text-white text-xs font-black">VISA</div>
            <div>
              <p className="text-sm font-bold text-[#1e293b]">•••• •••• •••• 4242</p>
              <p className="text-xs text-[#94a3b8] mt-0.5">{t("Expires","تنتهي")} 08/2027</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 rounded-xl text-xs font-semibold border border-[#107789]/30 text-[#107789] hover:bg-[#EBF5F7] active:scale-95 transition-all">{t("Edit","تعديل")}</button>
            <button className="px-4 py-2 rounded-xl text-xs font-semibold border border-[#E2E8F0] text-[#64748b] hover:bg-[#F5F7F9] active:scale-95 transition-all">{t("Add New","إضافة جديدة")}</button>
          </div>
        </div>
      </div>

      {/* Invoice history */}
      <div className="rounded-2xl bg-white border border-[#F1F5F9] shadow-sm overflow-hidden"
        style={{animation:"cardIn .4s .15s cubic-bezier(.34,1.2,.64,1) both"}}>
        <div className="px-5 sm:px-6 py-4 border-b border-[#F1F5F9] bg-[#FAFBFC]">
          <h3 className="text-sm font-bold text-[#1e293b]">{t("Invoice History","سجل الفواتير")}</h3>
        </div>
        {/* Mobile */}
        <div className="sm:hidden divide-y divide-[#F8FAFC]">
          {INVOICES.map((inv,i)=>(
            <div key={i} className="flex items-center justify-between px-5 py-3.5">
              <div>
                <p className="text-xs font-bold text-[#1e293b]">{inv.date}</p>
                <p className="text-xs text-[#94a3b8] mt-0.5">{inv.amount}</p>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#d1fae5] text-[#059669]">{t(inv.status,inv.statusAr)}</span>
            </div>
          ))}
        </div>
        {/* Desktop */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-sm" style={{borderCollapse:"collapse"}}>
            <thead>
              <tr style={{backgroundColor:"#F8FAFC"}}>
                {[{en:"Date",ar:"التاريخ"},{en:"Amount",ar:"المبلغ"},{en:"Status",ar:"الحالة"},{en:"Invoice",ar:"الفاتورة"}].map(col=>(
                  <th key={col.en} className="px-5 py-3 text-start text-xs font-semibold text-[#94a3b8] uppercase tracking-wide border-b border-[#F1F5F9]">{t(col.en,col.ar)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {INVOICES.map((inv,i)=>(
                <tr key={i} className="hover:bg-[#F8FAFC] transition-colors border-b border-[#F1F5F9] last:border-0">
                  <td className="px-5 py-3.5 text-xs font-semibold text-[#1e293b]">{inv.date}</td>
                  <td className="px-5 py-3.5 text-xs font-bold text-[#1e293b]">{inv.amount}</td>
                  <td className="px-5 py-3.5"><span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#d1fae5] text-[#059669]">{t(inv.status,inv.statusAr)}</span></td>
                  <td className="px-5 py-3.5"><button className="text-xs font-semibold text-[#107789] hover:underline">{t("Download","تحميل")}</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// NOTIFICATIONS TAB
// ═══════════════════════════════════════════════════
function NotificationsTab({t}:{t:(a:string,b:string)=>string}){
  const [settings,setSettings]=useState({
    newStudent:true, classReminder:true, evalDue:true, payoutReady:true,
    classCancel:true, systemUpdate:false, marketing:false,
    emailEnabled:true, smsEnabled:false, pushEnabled:true,
  });
  const toggle=(k:keyof typeof settings)=>setSettings(p=>({...p,[k]:!p[k]}));

  const GROUPS=[
    { labelEn:"Class & Student Activity",      labelAr:"نشاط الحصص والطلاب",
      items:[
        {key:"newStudent",   en:"New student enrolled",      ar:"تسجيل طالب جديد"},
        {key:"classReminder",en:"Class reminder (30 min)",   ar:"تذكير الحصة (30 دقيقة)"},
        {key:"classCancel",  en:"Class cancelled or missed", ar:"حصة ملغاة أو فائتة"},
        {key:"evalDue",      en:"Evaluation due",            ar:"موعد تسليم التقييم"},
      ]},
    { labelEn:"Financial",                     labelAr:"المالية",
      items:[
        {key:"payoutReady",  en:"Payout ready",              ar:"الدفعة جاهزة"},
      ]},
    { labelEn:"Platform",                      labelAr:"المنصة",
      items:[
        {key:"systemUpdate", en:"System updates & maintenance",ar:"تحديثات النظام والصيانة"},
        {key:"marketing",    en:"Tips, promotions & news",   ar:"نصائح وعروض وأخبار"},
      ]},
  ] as const;

  const CHANNELS=[
    {key:"emailEnabled",icon:"📧",en:"Email Notifications",    ar:"إشعارات البريد الإلكتروني",desc:{en:"Sent to your registered email",ar:"تُرسل إلى بريدك المسجّل"}},
    {key:"smsEnabled",  icon:"💬",en:"SMS Notifications",      ar:"إشعارات الرسائل النصية",    desc:{en:"Sent to your phone number",  ar:"تُرسل إلى رقم هاتفك"}},
    {key:"pushEnabled", icon:"🔔",en:"Push Notifications",     ar:"الإشعارات الفورية",          desc:{en:"Browser & app notifications",ar:"إشعارات المتصفح والتطبيق"}},
  ] as const;

  return(
    <div className="space-y-6" style={{animation:"fadeIn .35s ease both"}}>

      {/* Channels */}
      <div className="rounded-2xl bg-white border border-[#F1F5F9] shadow-sm overflow-hidden"
        style={{animation:"cardIn .4s .05s cubic-bezier(.34,1.2,.64,1) both"}}>
        <div className="px-5 sm:px-6 py-4 border-b border-[#F1F5F9] bg-[#FAFBFC]">
          <h3 className="text-sm font-bold text-[#1e293b]">{t("Notification Channels","قنوات الإشعارات")}</h3>
          <p className="text-xs text-[#94a3b8] mt-0.5">{t("Choose how you want to be notified","اختر كيف تريد أن تتلقى الإشعارات")}</p>
        </div>
        <div className="divide-y divide-[#F8FAFC]">
          {CHANNELS.map((ch,i)=>(
            <div key={ch.key} className="flex items-center gap-4 px-5 sm:px-6 py-4 hover:bg-[#F8FAFC] transition-colors"
              style={{animation:`slideUp .3s ${i*.06}s ease both`}}>
              <span className="text-xl flex-shrink-0">{ch.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#1e293b]">{t(ch.en,ch.ar)}</p>
                <p className="text-xs text-[#94a3b8] mt-0.5">{t(ch.desc.en,ch.desc.ar)}</p>
              </div>
              <Toggle checked={settings[ch.key]} onChange={()=>toggle(ch.key)}/>
            </div>
          ))}
        </div>
      </div>

      {/* Groups */}
      {GROUPS.map((grp,gi)=>(
        <div key={gi} className="rounded-2xl bg-white border border-[#F1F5F9] shadow-sm overflow-hidden"
          style={{animation:`cardIn .4s ${(gi+1)*.08}s cubic-bezier(.34,1.2,.64,1) both`}}>
          <div className="px-5 sm:px-6 py-3.5 border-b border-[#F1F5F9] bg-[#FAFBFC]">
            <h3 className="text-sm font-bold text-[#1e293b]">{t(grp.labelEn,grp.labelAr)}</h3>
          </div>
          <div className="divide-y divide-[#F8FAFC]">
            {grp.items.map((item,ii)=>(
              <div key={item.key} className="flex items-center justify-between gap-4 px-5 sm:px-6 py-4 hover:bg-[#F8FAFC] transition-colors"
                style={{animation:`slideUp .25s ${ii*.05}s ease both`}}>
                <p className="text-sm text-[#1e293b] font-medium">{t(item.en,item.ar)}</p>
                <Toggle checked={settings[item.key as keyof typeof settings] as boolean} onChange={()=>toggle(item.key as keyof typeof settings)}/>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════
// PAGE
// ═══════════════════════════════════════════════════
export default function SettingsPage(){
  const {lang,isRTL,t}=useLanguage();
  const [tab,setTab]=useState<Tab>("account");
  const [toast,setToast]=useState<{msg:string;type:"success"|"error"}|null>(null);

  const TABS:[Tab,string,string,React.ReactNode][]=[
    ["account",    t("Account","الحساب"),          t("Account","الحساب"),       IC.account],
    ["security",   t("Security","الأمان"),          t("Security","الأمان"),      IC.security],
    ["billing",    t("Billing & Plans","الاشتراك"), t("الاشتراك","الاشتراك"),    IC.billing],
    ["notifications",t("Notifications","الإشعارات"),t("الإشعارات","الإشعارات"), IC.notif],
  ];

  return(
    <>
      <style>{`
        @keyframes cardIn  { from{opacity:0;transform:translateY(12px) scale(.97)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes slideUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
      `}</style>

      <main className="flex-1 min-h-screen overflow-auto p-4 sm:p-6 space-y-5 sm:space-y-6"
        style={{backgroundColor:"#F5F7F9"}} dir={isRTL?"rtl":"ltr"}>

        {/* Page header */}
        <div style={{animation:"fadeIn .4s ease both"}}>
          <h1 className="text-xl sm:text-2xl font-black text-[#1e293b] tracking-tight">{t("Settings","الإعدادات")}</h1>
          <p className="mt-1 text-xs sm:text-sm text-[#94a3b8]">{t("Manage your account, security, and preferences","إدارة حسابك وأمانك وتفضيلاتك")}</p>
        </div>

        {/* Tab bar — scrollable on mobile */}
        <div className="rounded-2xl bg-white border border-[#F1F5F9] shadow-sm overflow-hidden"
          style={{animation:"cardIn .4s .05s cubic-bezier(.34,1.2,.64,1) both"}}>
          <div className="flex items-stretch overflow-x-auto scrollbar-none" style={{scrollbarWidth:"none"}}>
            {TABS.map(([key,en,ar,icon])=>{
              const active=tab===key;
              return(
                <button key={key} onClick={()=>setTab(key)}
                  className={`flex items-center gap-2 px-4 sm:px-6 py-4 text-sm font-semibold whitespace-nowrap border-b-2 transition-all duration-200 flex-shrink-0 active:scale-[.97] ${active?"border-[#107789] text-[#107789] bg-[#EBF5F7]/40":"border-transparent text-[#64748b] hover:text-[#107789] hover:bg-[#F8FAFC]"}`}>
                  <span className={active?"text-[#107789]":"text-[#94a3b8]"}>{icon}</span>
                  <span className="hidden xs:inline sm:inline">{lang==="ar"?ar:en}</span>
                  {/* icon-only on very small screens */}
                  <span className="xs:hidden sm:hidden">{lang==="ar"?ar.slice(0,2):en.slice(0,2)}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab content */}
        {tab==="account"       && <AccountTab       t={t} isRTL={isRTL} lang={lang}/>}
        {tab==="security"      && <SecurityTab      t={t} isRTL={isRTL}/>}
        {tab==="billing"       && <BillingTab       t={t}/>}
        {tab==="notifications" && <NotificationsTab t={t}/>}

      </main>

      {toast&&<Toast msg={toast.msg} type={toast.type} onClose={()=>setToast(null)}/>}
    </>
  );
}