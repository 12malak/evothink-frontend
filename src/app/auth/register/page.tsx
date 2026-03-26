"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/src/contexts/LanguageContext";

const LOGO = "/images/logo.png";
const BEAR = "/images/login-bear.png";

type Role = "student" | "teacher" | "parent";
type Form = { firstName:string; lastName:string; email:string; phone:string; role:Role|""; password:string; confirmPassword:string; agree:boolean; };
type Errors = Partial<Record<keyof Form|"general", string>>;

const ROLES:[Role,string,string,React.ReactNode][] = [
  ["student","Student","طالب",<svg key="s" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>],
  ["teacher","Teacher","معلم",<svg key="t" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>],
  ["parent","Parent","ولي أمر",<svg key="p" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>],
];

function strength(pw:string){
  if(!pw)           return {lvl:0,color:"#E5E7EB",en:"",ar:""};
  if(pw.length<6)   return {lvl:1,color:"#ef4444",en:"Weak",ar:"ضعيفة"};
  if(pw.length<10)  return {lvl:2,color:"#f97316",en:"Medium",ar:"متوسطة"};
  return             {lvl:3,color:"#22c55e",en:"Strong",ar:"قوية"};
}

const IC={
  globe:  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  shield: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#107789" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  arrow:  (flip:boolean)=><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{transform:flip?"rotate(180deg)":"none"}}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  spin:   <svg className="animate-spin" width="15" height="15" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="white" strokeWidth="2" strokeOpacity="0.3"/><path d="M7 1.5a5.5 5.5 0 015.5 5.5" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>,
  user:   <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  mail:   <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 8l10 6 10-6"/></svg>,
  phone:  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.11 9a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3 .27h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
  lock:   <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/><circle cx="12" cy="16" r="1" fill="currentColor"/></svg>,
  eye:    (show:boolean)=>show
    ?<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/><line x1="2" y1="2" x2="22" y2="22"/></svg>
    :<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  check:  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>,
  warn:   <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  x:      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
};

function Field({id,label,type,value,placeholder,error,onChange,icon,right,isRTL}:{
  id:string;label:string;type:string;value:string;placeholder:string;
  error?:string;onChange:(v:string)=>void;
  icon?:React.ReactNode;right?:React.ReactNode;isRTL:boolean;
}){
  const [focus,setFocus]=useState(false);
  const border=error?"#fca5a5":focus?"#107789":"#E5E7EB";
  const shadow=focus?`0 0 0 3px rgba(16,119,137,${error?".05":".12"})` :"none";
  return(
    <div className="flex flex-col gap-1.5">
      {label&&<label htmlFor={id} className="text-xs font-semibold text-[#8A8F98]" style={{textAlign:isRTL?"right":"left"}}>{label}</label>}
      <div className="relative">
        {icon&&<span className="absolute top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none flex" style={{[isRTL?"right":"left"]:"12px"}}>{icon}</span>}
        <input id={id} type={type} value={value} placeholder={placeholder} dir={isRTL?"rtl":"ltr"}
          onChange={e=>onChange(e.target.value)} onFocus={()=>setFocus(true)} onBlur={()=>setFocus(false)}
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

// ─── Visual panel ─────────────────────────────────────────────
function Visual({lang,setLang,isRTL}:{lang:string;setLang:(l:"en"|"ar")=>void;isRTL:boolean}){
  const t=(en:string,ar:string)=>lang==="ar"?ar:en;
  return(
    <div className="relative w-full h-full rounded-2xl overflow-hidden" style={{minHeight:"calc(100vh - 32px)"}}>
      <button onClick={()=>setLang(lang==="en"?"ar":"en")}
        className="absolute z-20 flex items-center gap-2 text-sm font-bold text-[#334155] bg-white rounded-full px-4 h-10 shadow-lg transition-all hover:shadow-xl active:scale-95"
        style={{top:16,[isRTL?"left":"right"]:16,border:"1px solid rgba(255,255,255,.2)"}}>
        {IC.globe}{lang==="en"?"عربي":"English"}
      </button>
      <div className="absolute inset-0" style={{background:"linear-gradient(135deg,#107789 0%,#0B2C33 100%)"}}/>
      <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 600 700" preserveAspectRatio="xMidYMid slice">
        {Array.from({length:12}).map((_,r)=>Array.from({length:10}).map((_,c)=>(
          <circle key={`${r}-${c}`} cx={c*60+30} cy={r*60+30} r="2" fill="white"/>
        )))}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center px-8 gap-8">
        <div className="rounded-2xl overflow-hidden flex items-center justify-center w-72 h-80" style={{backgroundColor:"rgba(255,255,255,.08)",border:"1px solid rgba(255,255,255,.15)"}}>
          <img src={BEAR} alt="mascot" className="w-64 h-72 object-contain"/>
        </div>
        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-black text-white mb-2">{t("Join Evothink Today","انضم إلى Evothink اليوم")}</h2>
          <p className="text-sm text-white/70 max-w-xs leading-relaxed">{t("Create your account and unlock a world of learning, collaboration, and growth.","أنشئ حسابك وافتح عالمًا من التعلم والتعاون والنمو.")}</p>
        </div>
        <div className="flex items-center gap-6">
          {[{v:"12K+",l:t("Active Users","المستخدمون")},{v:"500+",l:t("Courses","الدورات")},{v:"99.9%",l:t("Uptime","الجاهزية")}].map(s=>(
            <div key={s.v} className="text-center">
              <p className="text-lg font-black text-white">{s.v}</p>
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
export default function RegisterPage(){
  const {lang,setLang,t,isRTL}=useLanguage();
  const [form,setForm]=useState<Form>({firstName:"",lastName:"",email:"",phone:"",role:"",password:"",confirmPassword:"",agree:false});
  const [errors,setErrors]=useState<Errors>({});
  const [showPw,setShowPw]=useState(false);
  const [showCo,setShowCo]=useState(false);
  const [loading,setLoading]=useState(false);
  const [success,setSuccess]=useState(false);

  const s=strength(form.password);

  const validate=()=>{
    const e:Errors={};
    if(!form.firstName.trim())   e.firstName=t("First name is required.","الاسم الأول مطلوب.");
    if(!form.lastName.trim())    e.lastName=t("Last name is required.","اسم العائلة مطلوب.");
    if(!form.email.trim())       e.email=t("Email is required.","البريد مطلوب.");
    else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email=t("Invalid email.","بريد غير صحيح.");
    if(!form.role)               e.role=t("Please select your role.","اختر دورك.");
    if(!form.password)           e.password=t("Password is required.","كلمة المرور مطلوبة.");
    else if(form.password.length<6) e.password=t("At least 6 characters.","6 أحرف على الأقل.");
    if(!form.confirmPassword)    e.confirmPassword=t("Please confirm password.","أكّد كلمة المرور.");
    else if(form.password!==form.confirmPassword) e.confirmPassword=t("Passwords do not match.","كلمتا المرور غير متطابقتان.");
    if(!form.agree)              e.agree=t("You must accept the terms.","يجب قبول الشروط.");
    setErrors(e); return Object.keys(e).length===0;
  };

  const handleSubmit=async(e:FormEvent)=>{
    e.preventDefault(); if(!validate()) return;
    setLoading(true); setErrors({});
    try{ await new Promise(r=>setTimeout(r,1400)); setSuccess(true); }
    catch{ setErrors({general:t("Unable to create account. Try again.","تعذر إنشاء الحساب.")}); }
    finally{ setLoading(false); }
  };

  const set=<K extends keyof Form>(k:K)=>(v:Form[K])=>setForm(p=>({...p,[k]:v}));

  function renderForm(){
    if(success) return(
      <div className="flex flex-col items-center gap-5 py-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#d1fae5] flex items-center justify-center">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <div>
          <h2 className="text-xl font-black text-[#0B2C33]">{t("Account Created!","تم إنشاء الحساب!")}</h2>
          <p className="text-sm text-[#8A8F98] mt-2">{t("Welcome to Evothink. You can now sign in.","مرحبًا بك. يمكنك الآن تسجيل الدخول.")}</p>
        </div>
        <Link href="/auth/login" className="flex items-center gap-2 text-sm font-bold text-white rounded-xl px-6 hover:opacity-90 active:scale-[.98] transition-all"
          style={{height:46,backgroundColor:"#107789",textDecoration:"none"}}>
          {t("Sign In Now","سجّل الدخول")}
        </Link>
      </div>
    );

    return(
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3.5">
        {errors.general&&(
          <div className="flex items-center gap-2 px-3 py-2.5 text-sm rounded-xl" style={{backgroundColor:"#FEF2F2",border:"1px solid #FECACA",color:"#DC2626"}}>
            {IC.warn}{errors.general}
          </div>
        )}

        {/* Name row */}
        <div className="grid grid-cols-2 gap-3">
          <Field id="fn" label={t("First Name","الاسم الأول")} type="text" value={form.firstName}
            placeholder={t("Ahmad","أحمد")} error={errors.firstName} onChange={v=>set("firstName")(v)} icon={IC.user} isRTL={isRTL}/>
          <Field id="ln" label={t("Last Name","اسم العائلة")} type="text" value={form.lastName}
            placeholder={t("Nasser","الناصر")} error={errors.lastName} onChange={v=>set("lastName")(v)} isRTL={isRTL}/>
        </div>

        <Field id="email" label={t("Email","البريد الإلكتروني")} type="email" value={form.email}
          placeholder={t("your@email.com","بريدك@example.com")} error={errors.email}
          onChange={v=>set("email")(v)} icon={IC.mail} isRTL={isRTL}/>

        <Field id="phone" label={t("Phone (optional)","الهاتف (اختياري)")} type="tel" value={form.phone}
          placeholder="+962 79 000 0000" onChange={v=>set("phone")(v)} icon={IC.phone} isRTL={isRTL}/>

        {/* Role selector */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-[#8A8F98]" style={{textAlign:isRTL?"right":"left"}}>{t("I am a…","أنا…")}</label>
          <div className="grid grid-cols-3 gap-2">
            {ROLES.map(([key,en,ar,icon])=>{
              const active=form.role===key;
              return(
                <button key={key} type="button" onClick={()=>{set("role")(key);setErrors(p=>({...p,role:""}));}}
                  className="flex flex-col items-center gap-1.5 py-3 rounded-xl text-xs font-bold transition-all active:scale-[.97]"
                  style={{border:`1.5px solid ${active?"#107789":"#E5E7EB"}`,backgroundColor:active?"#EBF5F7":"white",color:active?"#107789":"#6B7280"}}>
                  <span style={{color:active?"#107789":"#9CA3AF"}}>{icon}</span>
                  {lang==="ar"?ar:en}
                  {active&&<span className="w-4.5 h-4.5 rounded-full bg-[#107789] flex items-center justify-center text-white" style={{width:18,height:18}}>{IC.check}</span>}
                </button>
              );
            })}
          </div>
          {errors.role&&<p className="text-[11px] font-medium flex items-center gap-1" style={{color:"#DC2626"}}>{IC.warn}{errors.role}</p>}
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1.5">
          <Field id="pw" label={t("Password","كلمة المرور")} type={showPw?"text":"password"} value={form.password}
            placeholder={t("Min 6 characters","6 أحرف على الأقل")} error={errors.password}
            onChange={v=>set("password")(v)} icon={IC.lock} isRTL={isRTL}
            right={<button type="button" onClick={()=>setShowPw(p=>!p)} className="text-[#8A8F98] hover:text-[#107789] transition-colors">{IC.eye(showPw)}</button>}/>
          {form.password&&(
            <div className="flex items-center gap-2 mt-0.5">
              <div className="flex gap-1 flex-1">
                {[1,2,3].map(n=><div key={n} className="flex-1 h-1 rounded-full transition-all" style={{backgroundColor:n<=s.lvl?s.color:"#E5E7EB"}}/>)}
              </div>
              <span className="text-[11px] font-bold whitespace-nowrap" style={{color:s.color}}>{lang==="ar"?s.ar:s.en}</span>
            </div>
          )}
        </div>

        {/* Confirm */}
        <div className="flex flex-col gap-1.5">
          <Field id="co" label={t("Confirm Password","تأكيد كلمة المرور")} type={showCo?"text":"password"} value={form.confirmPassword}
            placeholder={t("Re-enter password","أعد الإدخال")} error={errors.confirmPassword}
            onChange={v=>set("confirmPassword")(v)} icon={IC.lock} isRTL={isRTL}
            right={<button type="button" onClick={()=>setShowCo(p=>!p)} className="text-[#8A8F98] hover:text-[#107789] transition-colors">{IC.eye(showCo)}</button>}/>
          {form.confirmPassword&&(
            <p className="text-[11px] font-medium flex items-center gap-1" style={{color:form.password===form.confirmPassword?"#059669":"#DC2626"}}>
              {form.password===form.confirmPassword?<>{IC.check}{t("Passwords match","كلمتا المرور متطابقتان")}</>:<>{IC.x}{t("Passwords do not match","غير متطابقتان")}</>}
            </p>
          )}
        </div>

        {/* Terms */}
        <label className="flex items-start gap-2.5 cursor-pointer" style={{flexDirection:isRTL?"row-reverse":"row"}}>
          <input type="checkbox" checked={form.agree} onChange={e=>set("agree")(e.target.checked)}
            className="mt-0.5" style={{accentColor:"#107789",flexShrink:0,width:15,height:15}}/>
          <span className="text-xs text-[#8A8F98] leading-relaxed">
            {t("I agree to the ","أوافق على ")}<Link href="#" className="text-[#107789] font-bold hover:underline">{t("Terms of Service","شروط الخدمة")}</Link>
            {t(" and ","و")} <Link href="#" className="text-[#107789] font-bold hover:underline">{t("Privacy Policy","سياسة الخصوصية")}</Link>
          </span>
        </label>
        {errors.agree&&<p className="text-[11px] font-medium flex items-center gap-1" style={{color:"#DC2626"}}>{IC.warn}{errors.agree}</p>}

        <button type="submit" disabled={loading}
          className="mt-1 flex items-center justify-center gap-2 text-sm font-bold text-white rounded-xl transition-all active:scale-[.98]"
          style={{height:46,backgroundColor:loading?"#5FA8B3":"#107789",border:"none",cursor:loading?"not-allowed":"pointer"}}>
          {loading?<>{IC.spin}{t("Creating account…","جارٍ إنشاء الحساب…")}</>:<>{t("Create Account","إنشاء حساب")}{IC.arrow(isRTL)}</>}
        </button>

        <p className="text-xs text-center text-[#8A8F98]">
          {t("Already have an account?","لديك حساب؟")}{" "}
          <Link href="/auth/login" className="text-[#107789] font-bold hover:underline">{t("Sign In","تسجيل الدخول")}</Link>
          {" · "}
          <Link href="/auth/forgot-password" className="text-[#EA814F] font-bold hover:underline">{t("Forgot password?","نسيت كلمة المرور؟")}</Link>
        </p>
      </form>
    );
  }

  return(
    <main dir={isRTL?"rtl":"ltr"} className="min-h-screen bg-[#F8FAFC]">

      {/* Mobile */}
      <div className="flex flex-col lg:hidden min-h-screen">
        <div className="flex items-center justify-between px-5 py-4">
          <img src={LOGO} alt="Evothink" className="h-10 object-contain"/>
          <button onClick={()=>setLang(lang==="en"?"ar":"en")}
            className="flex items-center gap-2 text-sm font-bold text-[#334155] bg-white rounded-full px-4 h-9 shadow-sm border border-[#E5E7EB] active:scale-95 transition-all">
            {IC.globe}{lang==="en"?"عربي":"English"}
          </button>
        </div>
        <div className="mx-4 rounded-2xl overflow-hidden" style={{background:"linear-gradient(135deg,#107789,#0B2C33)",padding:"20px"}}>
          <div className="flex items-center gap-4">
            <img src={BEAR} alt="mascot" className="w-16 h-16 object-contain flex-shrink-0"/>
            <div className="text-white">
              <h2 className="text-base font-black">{t("Join Evothink Today","انضم إلى Evothink")}</h2>
              <p className="text-xs text-white/70 mt-0.5">{t("Create your account and start learning","أنشئ حسابك وابدأ التعلم")}</p>
            </div>
          </div>
        </div>
        <div className="flex-1 flex flex-col justify-start px-5 py-6 max-w-md mx-auto w-full">
          <h1 className="text-2xl font-black text-[#0B2C33] mb-1" style={{textAlign:isRTL?"right":"left"}}>{t("Create your account","أنشئ حسابك")}</h1>
          <p className="text-sm text-[#8A8F98] mb-5" style={{textAlign:isRTL?"right":"left"}}>{t("Join Evothink and start your learning journey today.","انضم وابدأ رحلتك التعليمية اليوم.")}</p>
          {renderForm()}
          <div className="mt-5 flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest text-[#A1A1AA]">
            {IC.shield}{t("Secured by Evothink Infrastructure","محمي عبر البنية التحتية لـ Evothink")}
          </div>
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden lg:grid min-h-screen" style={{gridTemplateColumns:"1.05fr 1fr"}}>
        <section className="flex items-start justify-center p-10 overflow-y-auto" style={{order:isRTL?2:1}}>
          <div className="w-full max-w-[440px] py-8">
            <div className="flex justify-center mb-8">
              <img src={LOGO} alt="Evothink" style={{width:200,objectFit:"contain"}}/>
            </div>
            <div className="mb-5" style={{textAlign:isRTL?"right":"left"}}>
              <h1 className="text-2xl font-black text-[#0B2C33] mb-1">{t("Create your account","أنشئ حسابك")}</h1>
              <p className="text-sm text-[#8A8F98]">{t("Join Evothink and start your learning journey today.","انضم وابدأ رحلتك التعليمية اليوم.")}</p>
            </div>
            {renderForm()}
            <div className="mt-6 flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest text-[#A1A1AA]">
              {IC.shield}{t("Secured by Evothink Infrastructure","محمي عبر البنية التحتية لـ Evothink")}
            </div>
          </div>
        </section>
        <section className="p-4 sticky top-0 h-screen" style={{order:isRTL?1:2}}>
          <Visual lang={lang} setLang={setLang} isRTL={isRTL}/>
        </section>
      </div>
    </main>
  );
}