"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/src/contexts/LanguageContext";

const LOGO = "/images/logo.png";
const BEAR = "/images/login-bear.png";

type Step = "email" | "otp" | "reset" | "done";

function strength(pw:string){
  if(!pw)          return {lvl:0,color:"#E5E7EB",en:"",ar:""};
  if(pw.length<6)  return {lvl:1,color:"#ef4444",en:"Weak",ar:"ضعيفة"};
  if(pw.length<10) return {lvl:2,color:"#f97316",en:"Medium",ar:"متوسطة"};
  return            {lvl:3,color:"#22c55e",en:"Strong",ar:"قوية"};
}

const IC={
  globe:  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  shield: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#107789" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  mail:   <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 8l10 6 10-6"/></svg>,
  lock:   <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/><circle cx="12" cy="16" r="1" fill="currentColor"/></svg>,
  arrow:  (flip:boolean)=><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{transform:flip?"rotate(180deg)":"none"}}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  back:   (flip:boolean)=><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{transform:flip?"rotate(180deg)":"none"}}><polyline points="15 18 9 12 15 6"/></svg>,
  spin:   <svg className="animate-spin" width="15" height="15" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="white" strokeWidth="2" strokeOpacity="0.3"/><path d="M7 1.5a5.5 5.5 0 015.5 5.5" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>,
  eye:    (show:boolean)=>show
    ?<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/><line x1="2" y1="2" x2="22" y2="22"/></svg>
    :<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  check:  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>,
  x:      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  warn:   <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  info:   <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
};

// ─── Field ────────────────────────────────────────────────────
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
      {error&&<p className="text-[11px] font-medium flex items-center gap-1" style={{color:"#DC2626"}}>{IC.warn}{error}</p>}
    </div>
  );
}

// ─── OTP ──────────────────────────────────────────────────────
function OTP({value,onChange,error,isRTL}:{value:string;onChange:(v:string)=>void;error?:string;isRTL:boolean}){
  const digits=value.padEnd(6," ").split("").slice(0,6);
  const handle=(i:number,e:React.KeyboardEvent<HTMLInputElement>)=>{
    const cells=document.querySelectorAll<HTMLInputElement>(".otp-c");
    if(e.key==="Backspace"){
      onChange(value.slice(0,i)+value.slice(i+1));
      if(i>0) cells[i-1]?.focus();
    } else if(/^\d$/.test(e.key)){
      const nv=value.slice(0,i)+e.key+value.slice(i+1);
      onChange(nv.slice(0,6));
      if(i<5) cells[i+1]?.focus();
      e.preventDefault();
    }
  };
  return(
    <div className="flex flex-col gap-2">
      <div className="flex gap-2 justify-center" dir="ltr">
        {digits.map((d,i)=>(
          <input key={i} type="text" inputMode="numeric" maxLength={1} value={d.trim()} readOnly
            onKeyDown={e=>handle(i,e)}
            onFocus={e=>{e.currentTarget.select();e.currentTarget.style.borderColor="#107789";e.currentTarget.style.boxShadow="0 0 0 3px rgba(16,119,137,.12)";}}
            onBlur={e=>{e.currentTarget.style.borderColor=d.trim()?"#107789":"#E5E7EB";e.currentTarget.style.boxShadow="none";}}
            className="otp-c text-center text-xl font-black text-[#0B2C33] outline-none transition-all cursor-text"
            style={{width:46,height:54,borderRadius:12,border:`1.5px solid ${error?"#fca5a5":d.trim()?"#107789":"#E5E7EB"}`,
              backgroundColor:d.trim()?"#EBF5F7":"white"}}/>
        ))}
      </div>
      {error&&<p className="text-[11px] font-medium flex items-center justify-center gap-1" style={{color:"#DC2626"}}>{IC.warn}{error}</p>}
    </div>
  );
}

// ─── Step dots ────────────────────────────────────────────────
function StepDots({current}:{current:number}){
  return(
    <div className="flex items-center gap-1.5 justify-center mb-6">
      {[0,1,2].map(i=>(
        <div key={i} className="rounded-full transition-all duration-300" style={{height:4,width:i===current?20:8,backgroundColor:i<=current?"#107789":"#E5E7EB"}}/>
      ))}
    </div>
  );
}

// ─── Visual panel ─────────────────────────────────────────────
function Visual({lang,setLang,isRTL,step}:{lang:string;setLang:(l:"en"|"ar")=>void;isRTL:boolean;step:Step}){
  const t=(en:string,ar:string)=>lang==="ar"?ar:en;
  const PANEL:{[K in Step]:{title:string;sub:string}}={
    email:{title:t("Forgot your password?","نسيت كلمة المرور؟"),sub:t("No worries — we'll send a reset code right away.","لا قلق، سنرسل رمز الاستعادة فورًا.")},
    otp:  {title:t("Check your inbox","تحقق من بريدك"),sub:t("We sent a 6-digit code to your email.","أرسلنا رمزًا من 6 أرقام إلى بريدك.")},
    reset:{title:t("Almost there!","أنت على وشك الانتهاء!"),sub:t("Choose a strong new password to protect your account.","اختر كلمة مرور قوية لحماية حسابك.")},
    done: {title:t("All done!","تم بنجاح!"),sub:t("Your password has been reset. Sign in with your new password.","تمت إعادة التعيين. يمكنك الآن تسجيل الدخول.")},
  };
  const {title,sub}=PANEL[step];
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
          <h2 className="text-xl sm:text-2xl font-black text-white mb-2">{title}</h2>
          <p className="text-sm text-white/70 max-w-xs leading-relaxed">{sub}</p>
        </div>
        <div className="flex items-center gap-6">
          {[{v:"12K+",l:t("Active Users","المستخدمون")},{v:"3.4K",l:t("Workspaces","مساحات العمل")},{v:"99.9%",l:t("Uptime","الجاهزية")}].map(s=>(
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
export default function ForgotPasswordPage(){
  const {lang,setLang,t,isRTL}=useLanguage();
  const [step,setStep]=useState<Step>("email");
  const [email,setEmail]=useState("");
  const [otp,setOtp]=useState("");
  const [newPw,setNewPw]=useState("");
  const [confirmPw,setConfirmPw]=useState("");
  const [showPw,setShowPw]=useState(false);
  const [showCo,setShowCo]=useState(false);
  const [loading,setLoading]=useState(false);
  const [timer,setTimer]=useState(0);
  const [errors,setErrors]=useState<Record<string,string>>({});

  const s=strength(newPw);
  const stepIdx={email:0,otp:1,reset:2,done:2}[step];

  const startTimer=()=>{
    setTimer(60);
    const id=setInterval(()=>setTimer(p=>{ if(p<=1){clearInterval(id);return 0;} return p-1; }),1000);
  };

  const submitEmail=async(e:FormEvent)=>{
    e.preventDefault();
    const err:Record<string,string>={};
    if(!email.trim())                                     err.email=t("Email is required.","البريد مطلوب.");
    else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))  err.email=t("Enter a valid email.","أدخل بريدًا صحيحًا.");
    if(Object.keys(err).length){setErrors(err);return;}
    setErrors({}); setLoading(true);
    await new Promise(r=>setTimeout(r,1200)); setLoading(false);
    setStep("otp"); startTimer();
  };

  const submitOtp=async(e:FormEvent)=>{
    e.preventDefault();
    const err:Record<string,string>={};
    if(otp.replace(/\s/g,"").length<6) err.otp=t("Enter the 6-digit code.","أدخل الرمز من 6 أرقام.");
    if(Object.keys(err).length){setErrors(err);return;}
    setErrors({}); setLoading(true);
    await new Promise(r=>setTimeout(r,1000)); setLoading(false); setStep("reset");
  };

  const resend=async()=>{
    if(timer>0) return;
    setLoading(true); setOtp("");
    await new Promise(r=>setTimeout(r,800)); setLoading(false); startTimer();
  };

  const submitReset=async(e:FormEvent)=>{
    e.preventDefault();
    const err:Record<string,string>={};
    if(!newPw)              err.newPw=t("Password is required.","كلمة المرور مطلوبة.");
    else if(newPw.length<6) err.newPw=t("At least 6 characters.","6 أحرف على الأقل.");
    if(!confirmPw)          err.co=t("Please confirm password.","أكّد كلمة المرور.");
    else if(newPw!==confirmPw) err.co=t("Passwords do not match.","كلمتا المرور غير متطابقتان.");
    if(Object.keys(err).length){setErrors(err);return;}
    setErrors({}); setLoading(true);
    await new Promise(r=>setTimeout(r,1200)); setLoading(false); setStep("done");
  };

  function renderForm(){
    return(
      <div className="flex flex-col gap-0 w-full">
        {/* Back link */}
        <div className="mb-4">
          <Link href="/auth/login" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8A8F98] hover:text-[#107789] transition-colors" style={{textDecoration:"none"}}>
            {IC.back(isRTL)}{t("Back to Sign In","العودة لتسجيل الدخول")}
          </Link>
        </div>

        <StepDots current={stepIdx}/>

        {/* ── Email step ── */}
        {step==="email"&&(
          <div style={{animation:"fadeSlide .3s ease both"}}>
            <h1 className="text-2xl font-black text-[#0B2C33] mb-1" style={{textAlign:isRTL?"right":"left"}}>{t("Forgot Password","نسيت كلمة المرور")}</h1>
            <p className="text-sm text-[#8A8F98] mb-6" style={{textAlign:isRTL?"right":"left"}}>{t("Enter the email linked to your account and we'll send a reset code.","أدخل البريد المرتبط بحسابك وسنرسل رمز إعادة التعيين.")}</p>
            <form onSubmit={submitEmail} noValidate className="flex flex-col gap-4">
              <Field id="email" label={t("Email Address","البريد الإلكتروني")} type="email" value={email}
                placeholder={t("Enter your email","أدخل بريدك")} error={errors.email}
                onChange={v=>{setEmail(v);setErrors({});}} icon={IC.mail} isRTL={isRTL}/>
              <button type="submit" disabled={loading} className="flex items-center justify-center gap-2 text-sm font-bold text-white rounded-xl transition-all active:scale-[.98]"
                style={{height:46,backgroundColor:loading?"#5FA8B3":"#107789",border:"none",cursor:loading?"not-allowed":"pointer"}}>
                {loading?<>{IC.spin}{t("Sending…","جارٍ الإرسال…")}</>:<>{t("Send Reset Code","إرسال رمز الاستعادة")}{IC.arrow(isRTL)}</>}
              </button>
              <p className="text-xs text-center text-[#8A8F98]">
                {t("Remember your password?","تذكرت كلمة مرورك؟")}{" "}
                <Link href="/auth/login" className="text-[#107789] font-bold hover:underline">{t("Sign In","تسجيل الدخول")}</Link>
              </p>
            </form>
          </div>
        )}

        {/* ── OTP step ── */}
        {step==="otp"&&(
          <div style={{animation:"fadeSlide .3s ease both"}}>
            <h1 className="text-2xl font-black text-[#0B2C33] mb-1" style={{textAlign:isRTL?"right":"left"}}>{t("Enter Verification Code","أدخل رمز التحقق")}</h1>
            <p className="text-sm text-[#8A8F98] mb-6" style={{textAlign:isRTL?"right":"left"}}>
              {t("We sent a 6-digit code to","أرسلنا رمزًا من 6 أرقام إلى")}{" "}<span className="font-bold text-[#107789]">{email}</span>
            </p>
            <form onSubmit={submitOtp} noValidate className="flex flex-col gap-5">
              <OTP value={otp} onChange={setOtp} error={errors.otp} isRTL={isRTL}/>
              <div className="text-center">
                <p className="text-xs text-[#8A8F98] mb-1.5">{t("Didn't receive the code?","لم تستلم الرمز؟")}</p>
                <button type="button" onClick={resend} disabled={timer>0||loading}
                  className="text-xs font-bold transition-colors"
                  style={{background:"none",border:"none",cursor:timer>0?"not-allowed":"pointer",color:timer>0?"#9CA3AF":"#107789"}}>
                  {timer>0?t(`Resend in ${timer}s`,`إعادة الإرسال بعد ${timer}ث`):t("Resend Code","إعادة إرسال الرمز")}
                </button>
              </div>
              <button type="submit" disabled={loading} className="flex items-center justify-center gap-2 text-sm font-bold text-white rounded-xl transition-all active:scale-[.98]"
                style={{height:46,backgroundColor:loading?"#5FA8B3":"#107789",border:"none",cursor:loading?"not-allowed":"pointer"}}>
                {loading?<>{IC.spin}{t("Verifying…","جارٍ التحقق…")}</>:<>{t("Verify Code","تحقق من الرمز")}{IC.arrow(isRTL)}</>}
              </button>
              <button type="button" onClick={()=>setStep("email")} className="text-xs text-center text-[#8A8F98] hover:text-[#107789] transition-colors"
                style={{background:"none",border:"none",cursor:"pointer"}}>
                {t("Wrong email? ","بريد خاطئ؟ ")}<span className="font-bold text-[#107789]">{t("Change it","عدّله")}</span>
              </button>
            </form>
          </div>
        )}

        {/* ── Reset step ── */}
        {step==="reset"&&(
          <div style={{animation:"fadeSlide .3s ease both"}}>
            <h1 className="text-2xl font-black text-[#0B2C33] mb-1" style={{textAlign:isRTL?"right":"left"}}>{t("Reset Password","إعادة تعيين كلمة المرور")}</h1>
            <p className="text-sm text-[#8A8F98] mb-6" style={{textAlign:isRTL?"right":"left"}}>{t("Your identity is verified. Choose a strong new password.","تم التحقق. اختر كلمة مرور جديدة قوية.")}</p>
            <form onSubmit={submitReset} noValidate className="flex flex-col gap-4">
              {/* New pw */}
              <div className="flex flex-col gap-1.5">
                <Field id="np" label={t("New Password","كلمة المرور الجديدة")} type={showPw?"text":"password"} value={newPw}
                  placeholder={t("Min 6 characters","6 أحرف على الأقل")} error={errors.newPw}
                  onChange={v=>{setNewPw(v);setErrors(p=>({...p,newPw:""}));}} icon={IC.lock} isRTL={isRTL}
                  right={<button type="button" onClick={()=>setShowPw(p=>!p)} className="text-[#8A8F98] hover:text-[#107789] transition-colors">{IC.eye(showPw)}</button>}/>
                {newPw&&(
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
                <Field id="co" label={t("Confirm New Password","تأكيد كلمة المرور الجديدة")} type={showCo?"text":"password"} value={confirmPw}
                  placeholder={t("Re-enter new password","أعد الإدخال")} error={errors.co}
                  onChange={v=>{setConfirmPw(v);setErrors(p=>({...p,co:""}));}} icon={IC.lock} isRTL={isRTL}
                  right={<button type="button" onClick={()=>setShowCo(p=>!p)} className="text-[#8A8F98] hover:text-[#107789] transition-colors">{IC.eye(showCo)}</button>}/>
                {confirmPw&&(
                  <p className="text-[11px] font-medium flex items-center gap-1" style={{color:newPw===confirmPw?"#059669":"#DC2626"}}>
                    {newPw===confirmPw?<>{IC.check}{t("Passwords match","متطابقتان")}</>:<>{IC.x}{t("Passwords do not match","غير متطابقتان")}</>}
                  </p>
                )}
              </div>
              {/* Hint */}
              <div className="flex items-start gap-2 px-3 py-2.5 rounded-xl text-xs text-[#107789]" style={{backgroundColor:"#EBF5F7",border:"1px solid #a5d8e0"}}>
                {IC.info}{t("Use at least 6 characters with letters and numbers for a stronger password.","استخدم 6 أحرف على الأقل مع خليط من الحروف والأرقام لكلمة مرور أقوى.")}
              </div>
              <button type="submit" disabled={loading} className="flex items-center justify-center gap-2 text-sm font-bold text-white rounded-xl transition-all active:scale-[.98]"
                style={{height:46,backgroundColor:loading?"#5FA8B3":"#107789",border:"none",cursor:loading?"not-allowed":"pointer"}}>
                {loading?<>{IC.spin}{t("Resetting…","جارٍ إعادة التعيين…")}</>:<>{t("Reset Password","إعادة تعيين كلمة المرور")}{IC.arrow(isRTL)}</>}
              </button>
            </form>
          </div>
        )}

        {/* ── Done step ── */}
        {step==="done"&&(
          <div className="flex flex-col items-center gap-5 py-6 text-center" style={{animation:"fadeSlide .3s ease both"}}>
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 rounded-full" style={{backgroundColor:"rgba(5,150,105,.15)",animation:"pulse 1.8s ease-in-out infinite"}}/>
              <div className="w-20 h-20 rounded-full bg-[#d1fae5] flex items-center justify-center relative">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-black text-[#0B2C33] mb-2">{t("Password Reset!","تمت إعادة التعيين!")}</h1>
              <p className="text-sm text-[#8A8F98] leading-relaxed max-w-xs">{t("Your password has been successfully reset. You can now sign in with your new password.","تمت إعادة تعيين كلمة مرورك بنجاح. يمكنك الآن تسجيل الدخول.")}</p>
            </div>
            <Link href="/auth/login" className="flex items-center gap-2 text-sm font-bold text-white rounded-xl px-6 hover:opacity-90 active:scale-[.98] transition-all"
              style={{height:46,backgroundColor:"#107789",textDecoration:"none"}}>
              {t("Sign In Now","تسجيل الدخول الآن")}{IC.arrow(isRTL)}
            </Link>
          </div>
        )}

        <div className="mt-8 flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest text-[#A1A1AA]">
          {IC.shield}{t("Secured by Evothink Infrastructure","محمي عبر البنية التحتية لـ Evothink")}
        </div>
      </div>
    );
  }

  return(
    <>
      <style>{`
        @keyframes fadeSlide{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{transform:scale(1);opacity:.6}50%{transform:scale(1.2);opacity:.2}}
      `}</style>

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
                <h2 className="text-base font-black">
                  {{email:t("Forgot password?","نسيت كلمة المرور؟"),otp:t("Check your inbox","تحقق من بريدك"),reset:t("Almost there!","أنت على وشك الانتهاء!"),done:t("All done!","تم بنجاح!")}[step]}
                </h2>
                <p className="text-xs text-white/70 mt-0.5">
                  {{email:t("We'll send you a reset code.","سنرسل رمز الاستعادة."),otp:t("Enter the code from your email.","أدخل الرمز من بريدك."),reset:t("Choose a strong new password.","اختر كلمة مرور قوية."),done:t("Your password has been reset.","تمت إعادة التعيين.")}[step]}
                </p>
              </div>
            </div>
          </div>
          <div className="flex-1 flex flex-col justify-center px-5 py-8 max-w-md mx-auto w-full">
            {renderForm()}
          </div>
        </div>

        {/* Desktop */}
        <div className="hidden lg:grid min-h-screen" style={{gridTemplateColumns:"1.05fr 1fr"}}>
          <section className="flex items-center justify-center p-12 overflow-y-auto" style={{order:isRTL?2:1}}>
            <div className="w-full max-w-md">
              <div className="flex justify-center mb-10">
                <img src={LOGO} alt="Evothink" style={{width:220,objectFit:"contain"}}/>
              </div>
              {renderForm()}
            </div>
          </section>
          <section className="p-4 sticky top-0 h-screen" style={{order:isRTL?1:2}}>
            <Visual lang={lang} setLang={setLang} isRTL={isRTL} step={step}/>
          </section>
        </div>
      </main>
    </>
  );
}