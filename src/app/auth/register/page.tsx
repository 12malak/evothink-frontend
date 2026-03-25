"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/src/contexts/LanguageContext";

const LOGO_IMAGE = "/images/logo.png";
const BEAR_IMAGE = "/images/login-bear.png";

type Role = "student" | "teacher" | "parent";
type RegisterForm = {
  firstName: string; lastName: string; email: string; phone: string;
  role: Role | ""; password: string; confirmPassword: string; agree: boolean;
};
type RegisterErrors = Partial<Record<keyof RegisterForm | "general", string>>;

const ROLES: { key: Role; labelEn: string; labelAr: string; icon: React.ReactNode }[] = [
  {
    key:"student", labelEn:"Student", labelAr:"طالب",
    icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>,
  },
  {
    key:"teacher", labelEn:"Teacher", labelAr:"معلم",
    icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  },
  {
    key:"parent", labelEn:"Parent", labelAr:"ولي أمر",
    icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  },
];

function getStrength(pw: string): { level:0|1|2|3; color:string; labelEn:string; labelAr:string } {
  if (!pw)           return { level:0, color:"#E5E7EB", labelEn:"",       labelAr:"" };
  if (pw.length < 6) return { level:1, color:"#ef4444", labelEn:"Weak",   labelAr:"ضعيفة" };
  if (pw.length < 10)return { level:2, color:"#f97316", labelEn:"Medium", labelAr:"متوسطة" };
  return              { level:3, color:"#22c55e", labelEn:"Strong", labelAr:"قوية" };
}

function InputField({
  id, label, type, value, placeholder, error, onChange, icon, rightElement, isRTL,
}: {
  id:string; label:string; type:string; value:string; placeholder:string;
  error?:string; onChange:(v:string)=>void;
  icon?:React.ReactNode; rightElement?:React.ReactNode; isRTL:boolean;
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
            color:"#9CA3AF", pointerEvents:"none", display:"flex", alignItems:"center",
          }}>
            {icon}
          </div>
        )}
        <input
          id={id} type={type} value={value} placeholder={placeholder}
          onChange={e => onChange(e.target.value)}
          dir={isRTL?"rtl":"ltr"} className="w-full text-sm transition-all"
          style={{
            height:"44px", borderRadius:"10px",
            border:`1px solid ${error?"#FCA5A5":"#E5E7EB"}`,
            backgroundColor:"#FFFFFF", color:"#0B2C33",
            outline:"none", boxSizing:"border-box",
            textAlign:isRTL?"right":"left",
            paddingInlineStart:icon?"38px":"14px",
            paddingInlineEnd:rightElement?"38px":"14px",
          }}
          onFocus={e => { e.currentTarget.style.borderColor=error?"#FCA5A5":"#107789"; e.currentTarget.style.boxShadow="0 0 0 3px rgba(16,119,137,0.12)"; }}
          onBlur={e  => { e.currentTarget.style.borderColor=error?"#FCA5A5":"#E5E7EB"; e.currentTarget.style.boxShadow="none"; }}
        />
        {rightElement && (
          <div style={{
            position:"absolute", top:"50%", transform:"translateY(-50%)",
            [isRTL?"left":"right"]:"12px", display:"flex", alignItems:"center",
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

const iconUser = <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="4.5" r="2.5" stroke="currentColor" strokeWidth="1.2"/><path d="M1.5 12.5c0-2.761 2.462-5 5.5-5s5.5 2.239 5.5 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>;
const iconMail = <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="2.5" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M1 5l6 4 6-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>;
const iconPhone = <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M10.5 9l-1.5 1.5C6.5 9.5 4.5 7.5 3.5 5L5 3.5 3 1 1 3c0 5.523 4.477 10 10 10l2-2-2.5-2z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const iconLock = <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="2" y="6" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M4 6V4.5a3 3 0 016 0V6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><circle cx="7" cy="9.5" r="1" fill="currentColor"/></svg>;
const iconEye = (show: boolean) => show ? (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 7s2.5-4 6-4 6 4 6 4-2.5 4-6 4-6-4-6-4z" stroke="currentColor" strokeWidth="1.2"/><circle cx="7" cy="7" r="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M2 2l10 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
) : (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 7s2.5-4 6-4 6 4 6 4-2.5 4-6 4-6-4-6-4z" stroke="currentColor" strokeWidth="1.2"/><circle cx="7" cy="7" r="1.5" stroke="currentColor" strokeWidth="1.2"/></svg>
);

export default function RegisterPage() {
  const { lang, setLang, t, isRTL } = useLanguage();

  const [form, setForm] = useState<RegisterForm>({
    firstName:"", lastName:"", email:"", phone:"",
    role:"", password:"", confirmPassword:"", agree:false,
  });
  const [errors, setErrors]         = useState<RegisterErrors>({});
  const [showPw, setShowPw]         = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading]       = useState(false);
  const [success, setSuccess]       = useState(false);

  const set = <K extends keyof RegisterForm>(k: K) => (v: RegisterForm[K]) =>
    setForm(p => ({ ...p, [k]:v }));

  const strength = getStrength(form.password);

  const validate = (): boolean => {
    const e: RegisterErrors = {};
    if (!form.firstName.trim())  e.firstName = t("First name is required.","الاسم الأول مطلوب.");
    if (!form.lastName.trim())   e.lastName  = t("Last name is required.","اسم العائلة مطلوب.");
    if (!form.email.trim())      e.email     = t("Email is required.","البريد الإلكتروني مطلوب.");
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
                                 e.email     = t("Enter a valid email.","أدخل بريدًا إلكترونيًا صحيحًا.");
    if (!form.role)              e.role      = t("Please select your role.","يرجى اختيار دورك.");
    if (!form.password)          e.password  = t("Password is required.","كلمة المرور مطلوبة.");
    else if (form.password.length < 6)
                                 e.password  = t("Password must be at least 6 characters.","يجب أن تكون 6 أحرف على الأقل.");
    if (!form.confirmPassword)   e.confirmPassword = t("Please confirm your password.","يرجى تأكيد كلمة المرور.");
    else if (form.password !== form.confirmPassword)
                                 e.confirmPassword = t("Passwords do not match.","كلمتا المرور غير متطابقتان.");
    if (!form.agree)             e.agree     = t("You must accept the terms.","يجب قبول الشروط والأحكام.");
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true); setErrors({});
    try {
      await new Promise(r => setTimeout(r, 1400));
      setSuccess(true);
    } catch {
      setErrors({ general: t("Unable to create account. Please try again.","تعذر إنشاء الحساب. حاول مرة أخرى.") });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main dir={isRTL?"rtl":"ltr"} style={{ minHeight:"100vh", backgroundColor:"#F8FAFC" }}>
      <div className="grid min-h-screen" style={{ gridTemplateColumns:"1.05fr 1fr" }}>

        {/* ── FORM SIDE ── */}
        <section style={{
          display:"flex", alignItems:"center", justifyContent:"center",
          padding:"40px 32px", backgroundColor:"#F8FAFC",
          order:isRTL?2:1, overflowY:"auto",
        }}>
          <div style={{ width:"100%", maxWidth:"440px" }}>

            {/* ── Logo — centered, larger ── */}
            <div className="mb-8 flex items-center justify-center">
              <img src={LOGO_IMAGE} alt="Evothink logo"
                style={{ width:"220px", height:"auto", objectFit:"contain" }}/>
            </div>

            {/* Heading */}
            <div style={{ textAlign:isRTL?"right":"left" }} className="mb-6">
              <h1 className="text-2xl font-bold mb-1" style={{ color:"#0B2C33" }}>
                {t("Create your account","أنشئ حسابك")}
              </h1>
              <p className="text-sm" style={{ color:"#8A8F98" }}>
                {t("Join Evothink and start your learning journey today.","انضم إلى Evothink وابدأ رحلتك التعليمية اليوم.")}
              </p>
            </div>

            {/* ── Success state ── */}
            {success ? (
              <div className="flex flex-col items-center gap-4 py-10 text-center">
                <div style={{
                  width:64, height:64, borderRadius:"50%",
                  backgroundColor:"#d1fae5", display:"flex", alignItems:"center", justifyContent:"center",
                }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <h2 className="text-lg font-bold" style={{ color:"#0B2C33" }}>
                  {t("Account Created!","تم إنشاء الحساب!")}
                </h2>
                <p className="text-sm" style={{ color:"#8A8F98" }}>
                  {t("Welcome to Evothink. You can now sign in to your account.","مرحبًا بك في Evothink. يمكنك الآن تسجيل الدخول إلى حسابك.")}
                </p>
                {/* ── LINK: back to login after success ── */}
                <Link href="/auth/login"
                  className="mt-2 flex items-center justify-center gap-2 text-sm font-semibold text-white"
                  style={{ height:44, paddingInline:24, borderRadius:10, backgroundColor:"#107789", textDecoration:"none" }}>
                  {t("Sign In Now","سجّل الدخول الآن")}
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3.5">

                {errors.general && (
                  <div className="flex items-center gap-2 px-3 py-2.5 text-sm"
                    style={{ backgroundColor:"#FEF2F2", border:"1px solid #FECACA", borderRadius:8, color:"#DC2626" }}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <circle cx="7" cy="7" r="6.5" stroke="currentColor" strokeWidth="1.2"/>
                      <path d="M7 4v4M7 9.5V10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                    </svg>
                    {errors.general}
                  </div>
                )}

                {/* Name row */}
                <div className="grid grid-cols-2 gap-3">
                  <InputField id="firstName" label={t("First Name","الاسم الأول")}
                    type="text" value={form.firstName} placeholder={t("Ahmad","أحمد")}
                    error={errors.firstName} onChange={v => set("firstName")(v)} icon={iconUser} isRTL={isRTL}/>
                  <InputField id="lastName" label={t("Last Name","اسم العائلة")}
                    type="text" value={form.lastName} placeholder={t("Nasser","الناصر")}
                    error={errors.lastName} onChange={v => set("lastName")(v)} isRTL={isRTL}/>
                </div>

                <InputField id="email" label={t("Email Address","البريد الإلكتروني")}
                  type="email" value={form.email} placeholder={t("Enter your email","أدخل بريدك الإلكتروني")}
                  error={errors.email} onChange={v => set("email")(v)} icon={iconMail} isRTL={isRTL}/>

                <InputField id="phone" label={t("Phone Number (optional)","رقم الهاتف (اختياري)")}
                  type="tel" value={form.phone} placeholder="+966 50 000 0000"
                  onChange={v => set("phone")(v)} icon={iconPhone} isRTL={isRTL}/>

                {/* Role */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium" style={{ color:"#8A8F98", textAlign:isRTL?"right":"left" }}>
                    {t("I am a…","أنا…")}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {ROLES.map(r => (
                      <button key={r.key} type="button"
                        onClick={() => { set("role")(r.key); setErrors(p=>({...p,role:undefined})); }}
                        style={{
                          display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
                          gap:6, padding:"10px 8px", borderRadius:10, cursor:"pointer",
                          border:`1.5px solid ${form.role===r.key?"#107789":"#E5E7EB"}`,
                          backgroundColor:form.role===r.key?"#EBF5F7":"#FFFFFF",
                          color:form.role===r.key?"#107789":"#6B7280",
                          transition:"all .15s", fontWeight:600, fontSize:12,
                        }}>
                        <span style={{ color:form.role===r.key?"#107789":"#9CA3AF" }}>{r.icon}</span>
                        {isRTL?r.labelAr:r.labelEn}
                        {form.role===r.key && (
                          <span style={{
                            width:18, height:18, borderRadius:"50%", backgroundColor:"#107789",
                            display:"flex", alignItems:"center", justifyContent:"center",
                          }}>
                            <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="2 6 5 9 10 3"/>
                            </svg>
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                  {errors.role && (
                    <p className="text-[11px] font-medium flex items-center gap-1" style={{ color:"#DC2626" }}>
                      <svg width="11" height="11" viewBox="0 0 14 14" fill="none">
                        <circle cx="7" cy="7" r="6.5" stroke="currentColor" strokeWidth="1.2"/>
                        <path d="M7 4v3.5M7 9.5v.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                      </svg>
                      {errors.role}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className="flex flex-col gap-1.5">
                  <InputField id="password" label={t("Password","كلمة المرور")}
                    type={showPw?"text":"password"} value={form.password}
                    placeholder={t("Min 6 characters","6 أحرف على الأقل")}
                    error={errors.password} onChange={v => set("password")(v)}
                    icon={iconLock} isRTL={isRTL}
                    rightElement={
                      <button type="button" onClick={()=>setShowPw(p=>!p)} style={{ color:"#8A8F98" }}>
                        {iconEye(showPw)}
                      </button>
                    }/>
                  {form.password && (
                    <div className="flex items-center gap-2 mt-0.5">
                      <div className="flex gap-1 flex-1">
                        {[1,2,3].map(n=>(
                          <div key={n} style={{
                            flex:1, height:3, borderRadius:99,
                            backgroundColor:n<=strength.level?strength.color:"#E5E7EB",
                            transition:"background-color .3s",
                          }}/>
                        ))}
                      </div>
                      <span style={{ fontSize:11, fontWeight:600, color:strength.color, whiteSpace:"nowrap" }}>
                        {isRTL?strength.labelAr:strength.labelEn}
                      </span>
                    </div>
                  )}
                </div>

                {/* Confirm password */}
                <div className="flex flex-col gap-1.5">
                  <InputField id="confirmPassword" label={t("Confirm Password","تأكيد كلمة المرور")}
                    type={showConfirm?"text":"password"} value={form.confirmPassword}
                    placeholder={t("Re-enter password","أعد إدخال كلمة المرور")}
                    error={errors.confirmPassword} onChange={v => set("confirmPassword")(v)}
                    icon={iconLock} isRTL={isRTL}
                    rightElement={
                      <button type="button" onClick={()=>setShowConfirm(p=>!p)} style={{ color:"#8A8F98" }}>
                        {iconEye(showConfirm)}
                      </button>
                    }/>
                  {form.confirmPassword && (
                    <p className="text-[11px] font-medium flex items-center gap-1"
                      style={{ color:form.password===form.confirmPassword?"#059669":"#DC2626" }}>
                      {form.password===form.confirmPassword ? (
                        <><svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="2 6 5 9 10 3"/></svg>{t("Passwords match","كلمتا المرور متطابقتان")}</>
                      ) : (
                        <><svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="10" y1="2" x2="2" y2="10"/><line x1="2" y1="2" x2="10" y2="10"/></svg>{t("Passwords do not match","كلمتا المرور غير متطابقتان")}</>
                      )}
                    </p>
                  )}
                </div>

                {/* Terms */}
              

                <button type="submit" disabled={loading}
                  className="mt-1 flex items-center justify-center gap-2 text-base font-semibold text-white"
                  style={{
                    height:46, backgroundColor:loading?"#5FA8B3":"#107789",
                    border:"none", borderRadius:10,
                    cursor:loading?"not-allowed":"pointer", transition:"background-color .2s",
                  }}>
                  {loading ? (
                    <>
                      <svg className="animate-spin" width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <circle cx="7" cy="7" r="5.5" stroke="white" strokeWidth="2" strokeOpacity="0.3"/>
                        <path d="M7 1.5a5.5 5.5 0 015.5 5.5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                      {t("Creating account…","جارٍ إنشاء الحساب…")}
                    </>
                  ) : (
                    <>
                      {t("Create Account","إنشاء حساب")}
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
                        style={{ transform:isRTL?"rotate(180deg)":"none" }}>
                        <path d="M2 7h10M8 3l4 4-4 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </>
                  )}
                </button>

                {/* ── LINKS: Sign in + Forgot password ── */}
                <p className="text-xs text-center mt-1" style={{ color:"#8A8F98" }}>
                  {t("Already have an account?","هل لديك حساب بالفعل؟")}{" "}
                  <Link href="/auth/login"
                    style={{ color:"#107789", fontWeight:600, textDecoration:"none" }}>
                    {t("Sign In","تسجيل الدخول")}
                  </Link>
                </p>
                <p className="text-xs text-center" style={{ color:"#8A8F98" }}>
                  {t("Forgot your password?","نسيت كلمة مرورك؟")}{" "}
                  <Link href="/auth/forgot-password"
                    style={{ color:"#EA814F", fontWeight:600, textDecoration:"none" }}>
                    {t("Reset it","استعدها")}
                  </Link>
                </p>
              </form>
            )}

            {/* ── Security note — always centered ── */}
            <div className="mt-6 flex items-center justify-center gap-2 text-xs uppercase tracking-[0.18em]"
              style={{ color:"#A1A1AA" }}>
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                <path d="M7 1.5l4.5 2v3.5c0 2.7-1.8 4.3-4.5 5.5C4.3 11.3 2.5 9.7 2.5 7V3.5L7 1.5z"
                  stroke="#107789" strokeWidth="1.2" fill="none"/>
              </svg>
              {t("Secured by Evothink Infrastructure","محمي عبر البنية التحتية لـ Evothink")}
            </div>
          </div>
        </section>

        {/* ── VISUAL SIDE ── */}
        <section style={{ padding:"20px 20px 20px 0", backgroundColor:"#F8FAFC", order:isRTL?1:2 }}>
          <div style={{
            position:"relative", width:"100%", height:"100%",
            minHeight:"calc(100vh - 40px)", borderRadius:16, overflow:"hidden",
          }}>
            <button type="button" onClick={()=>setLang(lang==="en"?"ar":"en")}
              style={{
                position:"absolute", top:16, [isRTL?"left":"right"]:16, zIndex:20,
                display:"inline-flex", alignItems:"center", gap:8,
                height:40, padding:"0 14px", borderRadius:999,
                border:"1px solid rgba(255,255,255,0.16)",
                backgroundColor:"#FFFFFF", color:"#334155",
                fontSize:14, fontWeight:600, cursor:"pointer",
                boxShadow:"0 8px 20px rgba(0,0,0,0.08)",
              }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="2" y1="12" x2="22" y2="12"/>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
              </svg>
              {lang==="en"?"عربي":"English"}
            </button>

            <div className="absolute inset-0"
              style={{ background:"linear-gradient(135deg, #107789 0%, #0B2C33 100%)" }}/>

            <svg className="absolute inset-0 h-full w-full opacity-10"
              viewBox="0 0 600 700" preserveAspectRatio="xMidYMid slice">
              {Array.from({length:12}).map((_,row) =>
                Array.from({length:10}).map((_,col) => (
                  <circle key={`${row}-${col}`} cx={col*60+30} cy={row*60+30} r="2" fill="white"/>
                ))
              )}
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center px-12" style={{ gap:32 }}>
              <div style={{
                width:320, height:340, borderRadius:16, overflow:"hidden",
                backgroundColor:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.15)",
                display:"flex", alignItems:"center", justifyContent:"center",
              }}>
                <img src={BEAR_IMAGE} alt={t("Evothink mascot","تميمة Evothink")}
                  style={{ width:290, height:310, objectFit:"contain", display:"block" }}/>
              </div>

              <div className="text-center">
                <h2 className="mb-2 text-2xl font-bold" style={{ color:"#FFFFFF" }}>
                  {t("Join Evothink Today","انضم إلى Evothink اليوم")}
                </h2>
                <p className="text-sm leading-relaxed"
                  style={{ color:"rgba(255,255,255,0.7)", maxWidth:280, unicodeBidi:"plaintext" }}>
                  {t(
                    "Create your account and unlock a world of learning, collaboration, and growth.",
                    "أنشئ حسابك وافتح عالمًا من التعلم والتعاون والنمو."
                  )}
                </p>
              </div>

              <div className="flex items-center gap-6">
                {[
                  { label:t("Active Users","المستخدمون النشطون"), value:"12K+" },
                  { label:t("Courses","الدورات"),                  value:"500+" },
                  { label:t("Uptime","الجاهزية"),                   value:"99.9%" },
                ].map(stat => (
                  <div key={stat.label} className="text-center">
                    <div className="text-lg font-bold" style={{ color:"#FFFFFF" }}>{stat.value}</div>
                    <div className="text-xs" style={{ color:"rgba(255,255,255,0.6)" }}>{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}