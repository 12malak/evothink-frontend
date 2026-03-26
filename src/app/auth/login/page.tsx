"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/src/contexts/LanguageContext";

const LOGO  = "/images/logo.png";
const BEAR  = "/images/login-bear.png";

// ─── Types ────────────────────────────────────────────────────
type Form   = { email: string; password: string };
type Errors = Partial<Record<keyof Form | "general", string>>;

// ─── Icons ────────────────────────────────────────────────────
const IC = {
  mail:   <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 8l10 6 10-6"/></svg>,
  lock:   <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/><circle cx="12" cy="16" r="1" fill="currentColor"/></svg>,
  globe:  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  shield: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#107789" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  arrow:  (flip:boolean) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{transform:flip?"rotate(180deg)":"none"}}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  spin:   <svg className="animate-spin" width="15" height="15" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="white" strokeWidth="2" strokeOpacity="0.3"/><path d="M7 1.5a5.5 5.5 0 015.5 5.5" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>,
  eye:    (show:boolean) => show
    ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/><line x1="2" y1="2" x2="22" y2="22"/></svg>
    : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  warn:   <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
};

// ─── Field ────────────────────────────────────────────────────
function Field({id,label,type,value,placeholder,error,onChange,icon,right,isRTL}:{
  id:string; label:string; type:string; value:string; placeholder:string;
  error?:string; onChange:(v:string)=>void;
  icon?:React.ReactNode; right?:React.ReactNode; isRTL:boolean;
}){
  const [focus,setFocus]=useState(false);
  const border=error?"#fca5a5":focus?"#107789":"#E5E7EB";
  const shadow=focus?`0 0 0 3px rgba(16,119,137,${error?".05":".12"})` :"none";
  return(
    <div className="flex flex-col gap-1.5">
      {label&&<label htmlFor={id} className="text-xs font-semibold" style={{color:"#8A8F98",textAlign:isRTL?"right":"left"}}>{label}</label>}
      <div className="relative">
        {icon&&<span className="absolute top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none" style={{[isRTL?"right":"left"]:"12px",display:"flex"}}>{icon}</span>}
        <input id={id} type={type} value={value} placeholder={placeholder} dir={isRTL?"rtl":"ltr"}
          onChange={e=>onChange(e.target.value)}
          onFocus={()=>setFocus(true)} onBlur={()=>setFocus(false)}
          className="w-full text-sm bg-white text-[#0B2C33] placeholder:text-[#C4CAD4] outline-none transition-all"
          style={{height:46,borderRadius:12,border:`1.5px solid ${border}`,boxShadow:shadow,boxSizing:"border-box",
            paddingInlineStart:icon?"40px":"14px",paddingInlineEnd:right?"40px":"14px",
            textAlign:isRTL?"right":"left"}}/>
        {right&&<span className="absolute top-1/2 -translate-y-1/2 flex" style={{[isRTL?"left":"right"]:"12px"}}>{right}</span>}
      </div>
      {error&&<p className="text-[11px] font-medium flex items-center gap-1" style={{color:"#DC2626",textAlign:isRTL?"right":"left"}}>{IC.warn}{error}</p>}
    </div>
  );
}

// ─── Visual panel (shared) ─────────────────────────────────────
function Visual({lang,setLang,isRTL,title,sub}:{lang:string;setLang:(l:"en"|"ar")=>void;isRTL:boolean;title:string;sub:string}){
  return(
    <div className="relative w-full h-full rounded-2xl overflow-hidden" style={{minHeight:"calc(100vh - 32px)"}}>
      {/* lang btn */}
      <button onClick={()=>setLang(lang==="en"?"ar":"en")}
        className="absolute z-20 flex items-center gap-2 text-sm font-bold text-[#334155] bg-white rounded-full px-4 h-10 shadow-lg transition-all hover:shadow-xl active:scale-95"
        style={{top:16,[isRTL?"left":"right"]:16,border:"1px solid rgba(255,255,255,.2)"}}>
        {IC.globe}{lang==="en"?"عربي":"English"}
      </button>
      {/* gradient bg */}
      <div className="absolute inset-0" style={{background:"linear-gradient(135deg,#107789 0%,#0B2C33 100%)"}}/>
      {/* dot pattern */}
      <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 600 700" preserveAspectRatio="xMidYMid slice">
        {Array.from({length:12}).map((_,r)=>Array.from({length:10}).map((_,c)=>(
          <circle key={`${r}-${c}`} cx={c*60+30} cy={r*60+30} r="2" fill="white"/>
        )))}
      </svg>
      {/* content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-8 gap-8">
        <div className="rounded-2xl overflow-hidden flex items-center justify-center w-72 h-80 sm:w-80 sm:h-96" style={{backgroundColor:"rgba(255,255,255,.08)",border:"1px solid rgba(255,255,255,.15)"}}>
          <img src={BEAR} alt="mascot" className="w-64 h-72 sm:w-72 sm:h-80 object-contain"/>
        </div>
        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-black text-white mb-2">{title}</h2>
          <p className="text-sm leading-relaxed text-white/70 max-w-xs">{sub}</p>
        </div>
        <div className="flex items-center gap-6">
          {[{v:"12K+",l:lang==="ar"?"المستخدمون":"Active Users"},{v:"3.4K",l:lang==="ar"?"مساحات العمل":"Workspaces"},{v:"99.9%",l:lang==="ar"?"الجاهزية":"Uptime"}].map(s=>(
            <div key={s.v} className="text-center">
              <p className="text-base sm:text-lg font-black text-white">{s.v}</p>
              <p className="text-[11px] text-white/60">{s.l}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// PAGE
// ═══════════════════════════════════════════════════
export default function LoginPage(){
  const {lang,setLang,t,isRTL}=useLanguage();
  const [form,setForm]=useState<Form>({email:"",password:""});
  const [errors,setErrors]=useState<Errors>({});
  const [showPw,setShowPw]=useState(false);
  const [loading,setLoading]=useState(false);

  const validate=()=>{
    const e:Errors={};
    if(!form.email.trim())                                      e.email=t("Email is required.","البريد الإلكتروني مطلوب.");
    else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))   e.email=t("Enter a valid email.","أدخل بريدًا صحيحًا.");
    if(!form.password.trim())                                   e.password=t("Password is required.","كلمة المرور مطلوبة.");
    else if(form.password.length<6)                            e.password=t("Password must be at least 6 characters.","6 أحرف على الأقل.");
    setErrors(e); return Object.keys(e).length===0;
  };

  const handleSubmit=async(e:FormEvent)=>{
    e.preventDefault(); if(!validate()) return;
    setLoading(true); setErrors({});
    try{ await new Promise(r=>setTimeout(r,1200)); }
    catch{ setErrors({general:t("Unable to sign in. Please try again.","تعذر تسجيل الدخول. حاول مجدداً.")}); }
    finally{ setLoading(false); }
  };

  return(
    <main dir={isRTL?"rtl":"ltr"} className="min-h-screen bg-[#F8FAFC]">

      {/* ── Mobile: stacked layout ── */}
      <div className="flex flex-col lg:hidden min-h-screen">
        {/* Mobile header with lang switcher */}
        <div className="flex items-center justify-between px-5 py-4">
          <img src={LOGO} alt="Evothink" className="h-10 object-contain"/>
          <button onClick={()=>setLang(lang==="en"?"ar":"en")}
            className="flex items-center gap-2 text-sm font-bold text-[#334155] bg-white rounded-full px-4 h-9 shadow-sm border border-[#E5E7EB] active:scale-95 transition-all">
            {IC.globe}{lang==="en"?"عربي":"English"}
          </button>
        </div>
        {/* Mobile visual strip */}
        <div className="mx-4 rounded-2xl overflow-hidden" style={{background:"linear-gradient(135deg,#107789,#0B2C33)",padding:"28px 20px"}}>
          <div className="flex items-center gap-4">
            <img src={BEAR} alt="mascot" className="w-20 h-20 object-contain flex-shrink-0"/>
            <div className="text-white">
              <h2 className="text-lg font-black">{t("Welcome to Evothink","مرحبًا بك في Evothink")}</h2>
              <p className="text-xs text-white/70 mt-1">{t("Your all-in-one learning workspace","مساحة عملك التعليمية المتكاملة")}</p>
            </div>
          </div>
        </div>
        {/* Mobile form */}
        <div className="flex-1 flex flex-col justify-center px-5 py-8 max-w-md mx-auto w-full">
          {renderForm()}
        </div>
      </div>

      {/* ── Desktop: side-by-side ── */}
      <div className="hidden lg:grid min-h-screen" style={{gridTemplateColumns:"1.05fr 1fr"}}>
        <section className="flex items-center justify-center p-12" style={{order:isRTL?2:1}}>
          <div className="w-full max-w-md">
            <div className="flex justify-center mb-10">
              <img src={LOGO} alt="Evothink" style={{width:220,objectFit:"contain"}}/>
            </div>
            {renderForm()}
          </div>
        </section>
        <section className="p-4" style={{order:isRTL?1:2}}>
          <Visual lang={lang} setLang={setLang} isRTL={isRTL}
            title={t("Welcome to Evothink","مرحبًا بك في Evothink")}
            sub={t("Your all-in-one workspace for smarter collaboration and growth.","مساحة العمل المتكاملة للتعاون الأذكى والنمو الأسرع.")}/>
        </section>
      </div>
    </main>
  );

  function renderForm(){
    return(
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-black text-[#0B2C33] mb-1">{t("Welcome Back","مرحبًا بعودتك")}</h1>
        <p className="text-sm text-[#8A8F98] mb-6">{t("Sign in to access your Evothink workspace.","سجّل الدخول للوصول إلى مساحة عمل Evothink.")}</p>

        {errors.general&&(
          <div className="flex items-center gap-2 px-3 py-2.5 text-sm mb-4 rounded-xl" style={{backgroundColor:"#FEF2F2",border:"1px solid #FECACA",color:"#DC2626"}}>
            {IC.warn}{errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          <Field id="email" label={t("Email Address","البريد الإلكتروني")} type="email"
            value={form.email} placeholder={t("Enter your email","أدخل بريدك")}
            error={errors.email} onChange={v=>setForm(p=>({...p,email:v}))} icon={IC.mail} isRTL={isRTL}/>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between" style={{flexDirection:isRTL?"row-reverse":"row"}}>
              <label className="text-xs font-semibold text-[#8A8F98]">{t("Password","كلمة المرور")}</label>
              <Link href="/auth/forgot-password" className="text-xs font-semibold text-[#EA814F] hover:underline">{t("Forgot Password?","هل نسيت كلمة المرور؟")}</Link>
            </div>
            <Field id="password" label="" type={showPw?"text":"password"}
              value={form.password} placeholder={t("Enter your password","أدخل كلمة المرور")}
              error={errors.password} onChange={v=>setForm(p=>({...p,password:v}))} icon={IC.lock} isRTL={isRTL}
              right={<button type="button" onClick={()=>setShowPw(p=>!p)} className="text-[#8A8F98] hover:text-[#107789] transition-colors">{IC.eye(showPw)}</button>}/>
          </div>

          <button type="submit" disabled={loading}
            className="mt-1 flex items-center justify-center gap-2 text-sm font-bold text-white rounded-xl transition-all active:scale-[.98]"
            style={{height:46,backgroundColor:loading?"#5FA8B3":"#107789",border:"none",cursor:loading?"not-allowed":"pointer"}}>
            {loading?<>{IC.spin}{t("Signing in…","جارٍ تسجيل الدخول…")}</>:<>{t("Sign In","تسجيل الدخول")}{IC.arrow(isRTL)}</>}
          </button>

          <p className="text-xs text-center text-[#8A8F98] mt-1">
            {t("Don't have an account?","ليس لديك حساب؟")}{" "}
            <Link href="/auth/register" className="text-[#107789] font-bold hover:underline">{t("Create one","أنشئ حسابًا")}</Link>
          </p>
        </form>

        <div className="mt-8 flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest text-[#A1A1AA]">
          {IC.shield}{t("Secured by Evothink Infrastructure","محمي عبر البنية التحتية لـ Evothink")}
        </div>
      </div>
    );
  }
}