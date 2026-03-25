"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/src/contexts/LanguageContext";

const LOGO_IMAGE = "/images/logo.png";
const BEAR_IMAGE = "/images/login-bear.png";

// ─── Steps ────────────────────────────────────────────────────
type Step = "email" | "otp" | "reset" | "done";

// ─── InputField — identical to login page ─────────────────────
function InputField({
  id, label, type, value, placeholder, error, onChange,
  icon, rightElement, isRTL,
}: {
  id: string; label: string; type: string; value: string;
  placeholder: string; error?: string; onChange: (v: string) => void;
  icon?: React.ReactNode; rightElement?: React.ReactNode; isRTL: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-xs font-medium"
          style={{ color:"#8A8F98", textAlign:isRTL?"right":"left" }}>
          {label}
        </label>
      )}
      <div style={{ position:"relative" }}>
        {icon && (
          <div style={{
            position:"absolute", top:"50%", transform:"translateY(-50%)",
            [isRTL?"right":"left"]:"12px",
            color:"#9CA3AF", pointerEvents:"none",
            display:"flex", alignItems:"center",
          }}>
            {icon}
          </div>
        )}
        <input
          id={id} type={type} value={value} placeholder={placeholder}
          onChange={e => onChange(e.target.value)}
          dir={isRTL ? "rtl" : "ltr"}
          className="w-full text-sm"
          style={{
            height:"44px", borderRadius:"10px",
            border:`1px solid ${error ? "#FCA5A5" : "#E5E7EB"}`,
            backgroundColor:"#FFFFFF", color:"#0B2C33",
            outline:"none", boxSizing:"border-box",
            textAlign:isRTL ? "right" : "left",
            paddingInlineStart: icon ? "38px" : "14px",
            paddingInlineEnd:   rightElement ? "38px" : "14px",
            transition:"border-color .15s, box-shadow .15s",
          }}
          onFocus={e => {
            e.currentTarget.style.borderColor = error ? "#FCA5A5" : "#107789";
            e.currentTarget.style.boxShadow = "0 0 0 3px rgba(16,119,137,0.12)";
          }}
          onBlur={e => {
            e.currentTarget.style.borderColor = error ? "#FCA5A5" : "#E5E7EB";
            e.currentTarget.style.boxShadow = "none";
          }}
        />
        {rightElement && (
          <div style={{
            position:"absolute", top:"50%", transform:"translateY(-50%)",
            [isRTL?"left":"right"]:"12px",
            display:"flex", alignItems:"center",
          }}>
            {rightElement}
          </div>
        )}
      </div>
      {error && (
        <p className="text-[11px] font-medium flex items-center gap-1"
          style={{ color:"#DC2626", textAlign:isRTL?"right":"left" }}>
          <svg width="11" height="11" viewBox="0 0 14 14" fill="none">
            <circle cx="7" cy="7" r="6.5" stroke="currentColor" strokeWidth="1.2"/>
            <path d="M7 4v3.5M7 9.5v.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}

// ─── OTP Input ────────────────────────────────────────────────
function OtpInput({ value, onChange, error, isRTL }: {
  value: string; onChange: (v: string) => void; error?: string; isRTL: boolean;
}) {
  const digits = value.padEnd(6, " ").split("").slice(0, 6);

  const handleKey = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    const inputs = document.querySelectorAll<HTMLInputElement>(".otp-cell");
    if (e.key === "Backspace") {
      const newVal = value.slice(0, i) + value.slice(i + 1);
      onChange(newVal);
      if (i > 0) inputs[i - 1]?.focus();
    } else if (/^\d$/.test(e.key)) {
      const newVal = value.slice(0, i) + e.key + value.slice(i + 1);
      onChange(newVal.slice(0, 6));
      if (i < 5) inputs[i + 1]?.focus();
      e.preventDefault();
    }
  };

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex gap-2 justify-center" dir="ltr">
        {digits.map((d, i) => (
  <input
    key={i}
    type="text"
    inputMode="numeric"
    maxLength={1}
    value={d.trim()}
    readOnly
    onKeyDown={e => handleKey(i, e)}
    onFocus={e => {
      e.currentTarget.select();
      e.currentTarget.style.borderColor = "#107789";
      e.currentTarget.style.boxShadow = "0 0 0 3px rgba(16,119,137,0.12)";
    }}
    className="otp-cell text-center text-lg font-bold"
    style={{
      width: 46,
      height: 52,
      borderRadius: 10,
      border: `1.5px solid ${error ? "#FCA5A5" : d.trim() ? "#107789" : "#E5E7EB"}`,
      backgroundColor: d.trim() ? "#EBF5F7" : "#FFFFFF",
      color: "#0B2C33",
      outline: "none",
      transition: "all .15s",
      cursor: "text",
    }}
    onBlur={e => {
      e.currentTarget.style.borderColor = d.trim() ? "#107789" : "#E5E7EB";
      e.currentTarget.style.boxShadow = "none";
    }}
  />
))}
      </div>
      {error && (
        <p className="text-[11px] font-medium flex items-center justify-center gap-1"
          style={{ color:"#DC2626" }}>
          <svg width="11" height="11" viewBox="0 0 14 14" fill="none">
            <circle cx="7" cy="7" r="6.5" stroke="currentColor" strokeWidth="1.2"/>
            <path d="M7 4v3.5M7 9.5v.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}

// ─── Password strength ────────────────────────────────────────
function getStrength(pw: string) {
  if (!pw)            return { level:0, color:"#E5E7EB", en:"",       ar:"" };
  if (pw.length < 6)  return { level:1, color:"#ef4444", en:"Weak",   ar:"ضعيفة" };
  if (pw.length < 10) return { level:2, color:"#f97316", en:"Medium", ar:"متوسطة" };
  return               { level:3, color:"#22c55e", en:"Strong", ar:"قوية" };
}

// ─── Step indicator ───────────────────────────────────────────
function StepDots({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-1.5 justify-center mb-6">
      {[0,1,2].map(i => (
        <div key={i} style={{
          height:4,
          width: i === current ? 20 : 8,
          borderRadius:99,
          backgroundColor: i <= current ? "#107789" : "#E5E7EB",
          transition:"all .3s",
        }}/>
      ))}
    </div>
  );
}

// ─── Icons ────────────────────────────────────────────────────
const IC = {
  mail: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <rect x="1" y="2.5" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M1 5l6 4 6-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  ),
  lock: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <rect x="2" y="6" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M4 6V4.5a3 3 0 016 0V6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      <circle cx="7" cy="9.5" r="1" fill="currentColor"/>
    </svg>
  ),
  arrow: (flipped: boolean) => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
      style={{ transform:flipped?"rotate(180deg)":"none" }}>
      <path d="M2 7h10M8 3l4 4-4 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  spinner: (
    <svg className="animate-spin" width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="7" r="5.5" stroke="white" strokeWidth="2" strokeOpacity="0.3"/>
      <path d="M7 1.5a5.5 5.5 0 015.5 5.5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  eye: (show: boolean) => show ? (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M1 7s2.5-4 6-4 6 4 6 4-2.5 4-6 4-6-4-6-4z" stroke="currentColor" strokeWidth="1.2"/>
      <circle cx="7" cy="7" r="1.5" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M2 2l10 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  ) : (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M1 7s2.5-4 6-4 6 4 6 4-2.5 4-6 4-6-4-6-4z" stroke="currentColor" strokeWidth="1.2"/>
      <circle cx="7" cy="7" r="1.5" stroke="currentColor" strokeWidth="1.2"/>
    </svg>
  ),
  back: (isRTL: boolean) => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
      style={{ transform:isRTL?"rotate(180deg)":"none" }}>
      <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  shield: (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
      <path d="M7 1.5l4.5 2v3.5c0 2.7-1.8 4.3-4.5 5.5C4.3 11.3 2.5 9.7 2.5 7V3.5L7 1.5z"
        stroke="#107789" strokeWidth="1.2" fill="none"/>
    </svg>
  ),
};

// ─── PAGE ─────────────────────────────────────────────────────
export default function ForgotPasswordPage() {
  const { lang, setLang, t, isRTL } = useLanguage();

  const [step,        setStep]        = useState<Step>("email");
  const [email,       setEmail]       = useState("");
  const [otp,         setOtp]         = useState("");
  const [newPw,       setNewPw]       = useState("");
  const [confirmPw,   setConfirmPw]   = useState("");
  const [showPw,      setShowPw]      = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading,     setLoading]     = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [errors,      setErrors]      = useState<Record<string,string>>({});

  const strength = getStrength(newPw);

  // ── Step 0: Email ──
  const submitEmail = async (e: FormEvent) => {
    e.preventDefault();
    const err: Record<string,string> = {};
    if (!email.trim())                                      err.email = t("Email is required.","البريد الإلكتروني مطلوب.");
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))    err.email = t("Enter a valid email.","أدخل بريدًا إلكترونيًا صحيحًا.");
    if (Object.keys(err).length) { setErrors(err); return; }
    setErrors({});
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    setStep("otp");
    // Start 60-second resend timer
    setResendTimer(60);
    const id = setInterval(() => {
      setResendTimer(p => { if (p <= 1) { clearInterval(id); return 0; } return p - 1; });
    }, 1000);
  };

  // ── Step 1: OTP ──
  const submitOtp = async (e: FormEvent) => {
    e.preventDefault();
    const err: Record<string,string> = {};
    if (otp.replace(/\s/g,"").length < 6) err.otp = t("Enter the 6-digit code.","أدخل الرمز المكوّن من 6 أرقام.");
    if (Object.keys(err).length) { setErrors(err); return; }
    setErrors({});
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    setStep("reset");
  };

  const resendOtp = async () => {
    if (resendTimer > 0) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setLoading(false);
    setOtp("");
    setResendTimer(60);
    const id = setInterval(() => {
      setResendTimer(p => { if (p <= 1) { clearInterval(id); return 0; } return p - 1; });
    }, 1000);
  };

  // ── Step 2: Reset ──
  const submitReset = async (e: FormEvent) => {
    e.preventDefault();
    const err: Record<string,string> = {};
    if (!newPw)               err.newPw     = t("Password is required.","كلمة المرور مطلوبة.");
    else if (newPw.length < 6) err.newPw    = t("Password must be at least 6 characters.","يجب أن تكون 6 أحرف على الأقل.");
    if (!confirmPw)            err.confirmPw = t("Please confirm your password.","يرجى تأكيد كلمة المرور.");
    else if (newPw !== confirmPw) err.confirmPw = t("Passwords do not match.","كلمتا المرور غير متطابقتان.");
    if (Object.keys(err).length) { setErrors(err); return; }
    setErrors({});
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    setStep("done");
  };

  // ── Button label ──
  const submitLabel = {
    email: { en:"Send Reset Code",    ar:"إرسال رمز الاستعادة" },
    otp:   { en:"Verify Code",        ar:"تحقق من الرمز"       },
    reset: { en:"Reset Password",     ar:"إعادة تعيين كلمة المرور" },
    done:  { en:"",                   ar:""                    },
  }[step];

  const stepIndex = { email:0, otp:1, reset:2, done:2 }[step];

  // ── Panel copy per step ──
  const panelTitle = {
    email: t("Forgot your password?","نسيت كلمة المرور؟"),
    otp:   t("Check your inbox","تحقق من بريدك"),
    reset: t("Almost there!","أنت على وشك الانتهاء!"),
    done:  t("All done!","تم بنجاح!"),
  }[step];

  const panelSub = {
    email: t("No worries — we'll send you a reset code right away.","لا قلق، سنرسل لك رمز الاستعادة فورًا."),
    otp:   t("We sent a 6-digit verification code to your email.","أرسلنا رمزًا مكوّنًا من 6 أرقام إلى بريدك الإلكتروني."),
    reset: t("Choose a strong new password to protect your account.","اختر كلمة مرور قوية لحماية حسابك."),
    done:  t("Your password has been reset. You can now sign in with your new password.","تمت إعادة تعيين كلمة مرورك. يمكنك الآن تسجيل الدخول."),
  }[step];

  return (
    <main dir={isRTL?"rtl":"ltr"} style={{ minHeight:"100vh", backgroundColor:"#F8FAFC" }}>
      <div className="grid min-h-screen" style={{ gridTemplateColumns:"1.05fr 1fr" }}>

        {/* ═══════════════════════════════════════════
            FORM SIDE
        ════════════════════════════════════════════ */}
        <section style={{
          display:"flex", alignItems:"center", justifyContent:"center",
          padding:"48px 32px", backgroundColor:"#F8FAFC",
          order: isRTL ? 2 : 1,
        }}>
          <div style={{ width:"100%", maxWidth:"420px" }}>

            {/* Logo */}
            <div className="mb-10 flex items-center justify-center">
              <img src={LOGO_IMAGE} alt="Evothink logo"
                style={{ width:"220px", height:"auto", objectFit:"contain" }}/>
            </div>

            {/* Back to login */}
            <div className="mb-6">
              <Link href="/auth/login"
                className="inline-flex items-center gap-1.5 text-xs font-semibold"
                style={{ color:"#8A8F98", textDecoration:"none" }}>
                {IC.back(isRTL)}
                {t("Back to Sign In","العودة لتسجيل الدخول")}
              </Link>
            </div>

            {/* Step dots */}
            <StepDots current={stepIndex}/>

            {/* ── STEP 0: Email ── */}
            {step === "email" && (
              <>
                <div style={{ textAlign:isRTL?"right":"left" }} className="mb-8">
                  <h1 className="text-2xl font-bold mb-1" style={{ color:"#0B2C33" }}>
                    {t("Forgot Password","نسيت كلمة المرور")}
                  </h1>
                  <p className="text-sm" style={{ color:"#8A8F98" }}>
                    {t(
                      "Enter the email address linked to your account and we'll send you a reset code.",
                      "أدخل عنوان البريد الإلكتروني المرتبط بحسابك وسنرسل لك رمز إعادة التعيين."
                    )}
                  </p>
                </div>

                <form onSubmit={submitEmail} noValidate className="flex flex-col gap-4">
                  <InputField
                    id="email"
                    label={t("Email Address","البريد الإلكتروني")}
                    type="email"
                    value={email}
                    placeholder={t("Enter your email","أدخل بريدك الإلكتروني")}
                    error={errors.email}
                    onChange={v => { setEmail(v); setErrors({}); }}
                    icon={IC.mail}
                    isRTL={isRTL}
                  />

                  <button type="submit" disabled={loading}
                    className="mt-2 flex items-center justify-center gap-2 text-base font-semibold text-white"
                    style={{
                      height:46, backgroundColor:loading?"#5FA8B3":"#107789",
                      border:"none", borderRadius:10,
                      cursor:loading?"not-allowed":"pointer", transition:"background-color .2s",
                    }}>
                    {loading ? <>{IC.spinner}{t("Sending…","جارٍ الإرسال…")}</> : <>
                      {t(submitLabel.en, submitLabel.ar)}
                      {IC.arrow(isRTL)}
                    </>}
                  </button>

                  <p className="text-xs text-center" style={{ color:"#8A8F98" }}>
                    {t("Remember your password?","تذكرت كلمة مرورك؟")}{" "}
                    <Link href="/auth/login" style={{ color:"#107789", fontWeight:600, textDecoration:"none" }}>
                      {t("Sign In","تسجيل الدخول")}
                    </Link>
                  </p>
                </form>
              </>
            )}

            {/* ── STEP 1: OTP ── */}
            {step === "otp" && (
              <>
                <div style={{ textAlign:isRTL?"right":"left" }} className="mb-6">
                  <h1 className="text-2xl font-bold mb-1" style={{ color:"#0B2C33" }}>
                    {t("Enter Verification Code","أدخل رمز التحقق")}
                  </h1>
                  <p className="text-sm" style={{ color:"#8A8F98" }}>
                    {t("We sent a 6-digit code to","أرسلنا رمزًا مكوّنًا من 6 أرقام إلى")}{" "}
                    <span style={{ color:"#107789", fontWeight:600 }}>{email}</span>
                  </p>
                </div>

                <form onSubmit={submitOtp} noValidate className="flex flex-col gap-6">
                  <OtpInput value={otp} onChange={setOtp} error={errors.otp} isRTL={isRTL}/>

                  {/* Resend */}
                  <div className="text-center">
                    <p className="text-xs mb-2" style={{ color:"#8A8F98" }}>
                      {t("Didn't receive the code?","لم تستلم الرمز؟")}
                    </p>
                    <button type="button" onClick={resendOtp} disabled={resendTimer > 0 || loading}
                      style={{
                        background:"none", border:"none", cursor: resendTimer > 0 ? "not-allowed" : "pointer",
                        color: resendTimer > 0 ? "#9CA3AF" : "#107789",
                        fontWeight:600, fontSize:13,
                      }}>
                      {resendTimer > 0
                        ? t(`Resend in ${resendTimer}s`, `إعادة الإرسال بعد ${resendTimer}ث`)
                        : t("Resend Code","إعادة إرسال الرمز")
                      }
                    </button>
                  </div>

                  <button type="submit" disabled={loading}
                    className="flex items-center justify-center gap-2 text-base font-semibold text-white"
                    style={{
                      height:46, backgroundColor:loading?"#5FA8B3":"#107789",
                      border:"none", borderRadius:10,
                      cursor:loading?"not-allowed":"pointer", transition:"background-color .2s",
                    }}>
                    {loading ? <>{IC.spinner}{t("Verifying…","جارٍ التحقق…")}</> : <>
                      {t(submitLabel.en, submitLabel.ar)}
                      {IC.arrow(isRTL)}
                    </>}
                  </button>

                  <button type="button" onClick={()=>setStep("email")}
                    className="text-xs font-medium" style={{ background:"none", border:"none", cursor:"pointer", color:"#8A8F98" }}>
                    {t("Wrong email?","بريد خاطئ؟")}{" "}
                    <span style={{ color:"#107789", fontWeight:600 }}>{t("Change it","عدّله")}</span>
                  </button>
                </form>
              </>
            )}

            {/* ── STEP 2: Reset Password ── */}
            {step === "reset" && (
              <>
                <div style={{ textAlign:isRTL?"right":"left" }} className="mb-8">
                  <h1 className="text-2xl font-bold mb-1" style={{ color:"#0B2C33" }}>
                    {t("Reset Password","إعادة تعيين كلمة المرور")}
                  </h1>
                  <p className="text-sm" style={{ color:"#8A8F98" }}>
                    {t(
                      "Your identity is verified. Choose a strong new password.",
                      "تم التحقق من هويتك. اختر كلمة مرور جديدة قوية."
                    )}
                  </p>
                </div>

                <form onSubmit={submitReset} noValidate className="flex flex-col gap-4">
                  {/* New password */}
                  <div className="flex flex-col gap-1.5">
                    <InputField
                      id="newPw"
                      label={t("New Password","كلمة المرور الجديدة")}
                      type={showPw?"text":"password"}
                      value={newPw}
                      placeholder={t("Min 6 characters","6 أحرف على الأقل")}
                      error={errors.newPw}
                      onChange={v => { setNewPw(v); setErrors(p=>({...p,newPw:undefined as unknown as string})); }}
                      icon={IC.lock}
                      isRTL={isRTL}
                      rightElement={
                        <button type="button" onClick={()=>setShowPw(p=>!p)} style={{ color:"#8A8F98" }}>
                          {IC.eye(showPw)}
                        </button>
                      }
                    />
                    {/* Strength meter */}
                    {newPw && (
                      <div className="flex items-center gap-2 mt-0.5">
                        <div className="flex gap-1 flex-1">
                          {[1,2,3].map(n=>(
                            <div key={n} style={{
                              flex:1, height:3, borderRadius:99,
                              backgroundColor: n<=strength.level ? strength.color : "#E5E7EB",
                              transition:"background-color .3s",
                            }}/>
                          ))}
                        </div>
                        <span style={{ fontSize:11, fontWeight:600, color:strength.color, whiteSpace:"nowrap" }}>
                          {isRTL ? strength.ar : strength.en}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Confirm password */}
                  <div className="flex flex-col gap-1.5">
                    <InputField
                      id="confirmPw"
                      label={t("Confirm New Password","تأكيد كلمة المرور الجديدة")}
                      type={showConfirm?"text":"password"}
                      value={confirmPw}
                      placeholder={t("Re-enter new password","أعد إدخال كلمة المرور الجديدة")}
                      error={errors.confirmPw}
                      onChange={v => { setConfirmPw(v); setErrors(p=>({...p,confirmPw:undefined as unknown as string})); }}
                      icon={IC.lock}
                      isRTL={isRTL}
                      rightElement={
                        <button type="button" onClick={()=>setShowConfirm(p=>!p)} style={{ color:"#8A8F98" }}>
                          {IC.eye(showConfirm)}
                        </button>
                      }
                    />
                    {/* Match indicator */}
                    {confirmPw && (
                      <p className="text-[11px] font-medium flex items-center gap-1"
                        style={{ color: newPw===confirmPw ? "#059669" : "#DC2626" }}>
                        {newPw===confirmPw ? (
                          <><svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="2 6 5 9 10 3"/></svg>
                          {t("Passwords match","كلمتا المرور متطابقتان")}</>
                        ) : (
                          <><svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="10" y1="2" x2="2" y2="10"/><line x1="2" y1="2" x2="10" y2="10"/></svg>
                          {t("Passwords do not match","كلمتا المرور غير متطابقتان")}</>
                        )}
                      </p>
                    )}
                  </div>

                  {/* Password rules hint */}
                  <div className="flex items-start gap-2 px-3 py-2.5 text-xs rounded-[10px]"
                    style={{ backgroundColor:"#EBF5F7", border:"1px solid #a5d8e0", color:"#107789" }}>
                    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" className="flex-shrink-0 mt-0.5">
                      <circle cx="7" cy="7" r="6.5" stroke="currentColor" strokeWidth="1.2"/>
                      <path d="M7 5v4M7 10.5v.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                    </svg>
                    {t(
                      "Use at least 6 characters with a mix of letters and numbers for a stronger password.",
                      "استخدم 6 أحرف على الأقل مع خليط من الحروف والأرقام لكلمة مرور أقوى."
                    )}
                  </div>

                  <button type="submit" disabled={loading}
                    className="mt-1 flex items-center justify-center gap-2 text-base font-semibold text-white"
                    style={{
                      height:46, backgroundColor:loading?"#5FA8B3":"#107789",
                      border:"none", borderRadius:10,
                      cursor:loading?"not-allowed":"pointer", transition:"background-color .2s",
                    }}>
                    {loading ? <>{IC.spinner}{t("Resetting…","جارٍ إعادة التعيين…")}</> : <>
                      {t(submitLabel.en, submitLabel.ar)}
                      {IC.arrow(isRTL)}
                    </>}
                  </button>
                </form>
              </>
            )}

            {/* ── STEP 3: Done ── */}
            {step === "done" && (
              <div className="flex flex-col items-center gap-5 py-6 text-center">
                {/* Success icon with pulse ring */}
                <div style={{ position:"relative", width:72, height:72 }}>
                  <div style={{
                    position:"absolute", inset:0, borderRadius:"50%",
                    backgroundColor:"rgba(5,150,105,0.12)",
                    animation:"pulse 1.8s ease-in-out infinite",
                  }}/>
                  <div style={{
                    width:72, height:72, borderRadius:"50%",
                    backgroundColor:"#d1fae5",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    position:"relative",
                  }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
                      stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                </div>

                <div>
                  <h1 className="text-2xl font-bold mb-2" style={{ color:"#0B2C33" }}>
                    {t("Password Reset!","تمت إعادة التعيين!")}
                  </h1>
                  <p className="text-sm leading-relaxed" style={{ color:"#8A8F98", maxWidth:320 }}>
                    {t(
                      "Your password has been successfully reset. You can now sign in with your new password.",
                      "تمت إعادة تعيين كلمة مرورك بنجاح. يمكنك الآن تسجيل الدخول باستخدام كلمة المرور الجديدة."
                    )}
                  </p>
                </div>

                <Link href="/auth/login"
                  className="flex items-center justify-center gap-2 text-base font-semibold text-white"
                  style={{
                    height:46, paddingInline:28, borderRadius:10,
                    backgroundColor:"#107789", textDecoration:"none",
                    marginTop:4,
                  }}>
                  {t("Sign In Now","تسجيل الدخول الآن")}
                  {IC.arrow(isRTL)}
                </Link>
              </div>
            )}

            {/* Security note */}
            <div className="mt-8 flex items-center gap-2 text-xs uppercase tracking-[0.18em]"
              style={{ color:"#A1A1AA", justifyContent:"center" }}>
              {IC.shield}
              {t("Secured by Evothink Infrastructure","محمي عبر البنية التحتية لـ Evothink")}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            VISUAL SIDE — identical to login
        ════════════════════════════════════════════ */}
        <section style={{
          padding:"20px 20px 20px 0",
          backgroundColor:"#F8FAFC",
          order: isRTL ? 1 : 2,
        }}>
          <div style={{
            position:"relative", width:"100%",
            height:"100%", minHeight:"calc(100vh - 40px)",
            borderRadius:16, overflow:"hidden",
          }}>

            {/* Language switcher */}
            <button type="button" onClick={()=>setLang(lang==="en"?"ar":"en")}
              style={{
                position:"absolute", top:16,
                [isRTL?"left":"right"]:16,
                zIndex:20,
                display:"inline-flex", alignItems:"center", gap:8,
                height:40, padding:"0 14px", borderRadius:999,
                border:"1px solid rgba(255,255,255,0.16)",
                backgroundColor:"#FFFFFF", color:"#334155",
                fontSize:14, fontWeight:600, cursor:"pointer",
                boxShadow:"0 8px 20px rgba(0,0,0,0.08)",
              }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="2" y1="12" x2="22" y2="12"/>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
              </svg>
              {lang==="en" ? "عربي" : "English"}
            </button>

            {/* Gradient bg */}
            <div className="absolute inset-0"
              style={{ background:"linear-gradient(135deg, #107789 0%, #0B2C33 100%)" }}/>

            {/* Dot pattern */}
            <svg className="absolute inset-0 h-full w-full opacity-10"
              viewBox="0 0 600 700" preserveAspectRatio="xMidYMid slice">
              {Array.from({length:12}).map((_,row)=>
                Array.from({length:10}).map((_,col)=>(
                  <circle key={`${row}-${col}`} cx={col*60+30} cy={row*60+30} r="2" fill="white"/>
                ))
              )}
            </svg>

            {/* Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center px-12"
              style={{ gap:32 }}>

              {/* Bear card */}
              <div style={{
                width:320, height:340, borderRadius:16, overflow:"hidden",
                backgroundColor:"rgba(255,255,255,0.08)",
                border:"1px solid rgba(255,255,255,0.15)",
                display:"flex", alignItems:"center", justifyContent:"center",
              }}>
                <img src={BEAR_IMAGE} alt={t("Evothink mascot","تميمة Evothink")}
                  style={{ width:290, height:310, objectFit:"contain", display:"block" }}/>
              </div>

              {/* Dynamic text per step */}
              <div className="text-center">
                <h2 className="mb-2 text-2xl font-bold" style={{ color:"#FFFFFF" }}>
                  {panelTitle}
                </h2>
                <p className="text-sm leading-relaxed"
                  style={{ color:"rgba(255,255,255,0.7)", maxWidth:280, unicodeBidi:"plaintext" }}>
                  {panelSub}
                </p>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-6">
                {[
                  { label:t("Active Users","المستخدمون النشطون"), value:"12K+" },
                  { label:t("Workspaces","مساحات العمل"),          value:"3.4K" },
                  { label:t("Uptime","الجاهزية"),                   value:"99.9%" },
                ].map(s=>(
                  <div key={s.label} className="text-center">
                    <div className="text-lg font-bold" style={{ color:"#FFFFFF" }}>{s.value}</div>
                    <div className="text-xs" style={{ color:"rgba(255,255,255,0.6)" }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

      </div>

      {/* Pulse keyframe for success icon */}
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1);   opacity: .6; }
          50%       { transform: scale(1.18); opacity: .2; }
        }
      `}</style>
    </main>
  );
}