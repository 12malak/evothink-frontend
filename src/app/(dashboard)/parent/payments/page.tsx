"use client";

import { useState } from "react";
import { useLanguage } from "@/src/contexts/LanguageContext";

// ─── Types ────────────────────────────────────────────────────
type PackageId  = "starter" | "standard" | "premium" | "intensive";
type PayStatus  = "paid" | "pending" | "failed";
type PayMethod  = "card" | "bank" | "apple";

interface Package {
  id:          PackageId;
  nameEn:      string;
  nameAr:      string;
  sessions:    number;
  price:       number;
  currency:    string;
  perSession:  number;
  validDays:   number;
  color:       string;
  bg:          string;
  featuresEn:  string[];
  featuresAr:  string[];
  popular:     boolean;
  current:     boolean;
  badge:       string;
}

interface Invoice {
  id:         string;
  packageEn:  string;
  packageAr:  string;
  childEn:    string;
  childAr:    string;
  amount:     number;
  currency:   string;
  date:       string;
  method:     PayMethod;
  status:     PayStatus;
  ref:        string;
  sessions:   number;
  period:     string;
}

// ─── Data ─────────────────────────────────────────────────────
const PACKAGES: Package[] = [
  {
    id:"starter", nameEn:"Starter", nameAr:"المبتدئ",
    sessions:8, price:120, currency:"$", perSession:15, validDays:30,
    color:"#64748b", bg:"#f1f5f9", badge:"",
    featuresEn:["8 sessions / month","60 min per session","1 teacher","Email support","Progress reports"],
    featuresAr:["8 جلسات / شهر","60 دقيقة للجلسة","معلم واحد","دعم بالبريد","تقارير تقدم"],
    popular:false, current:false,
  },
  {
    id:"standard", nameEn:"Standard", nameAr:"القياسي",
    sessions:16, price:220, currency:"$", perSession:13.75, validDays:30,
    color:"#107789", bg:"#EBF5F7", badge:"",
    featuresEn:["16 sessions / month","60 min per session","Choose your teacher","Priority support","Progress reports","Parent portal access"],
    featuresAr:["16 جلسة / شهر","60 دقيقة للجلسة","اختيار المعلم","دعم أولوية","تقارير التقدم","وصول بوابة ولي الأمر"],
    popular:false, current:true,
  },
  {
    id:"premium", nameEn:"Premium", nameAr:"المتميز",
    sessions:24, price:300, currency:"$", perSession:12.5, validDays:30,
    color:"#7c3aed", bg:"#ede9fe", badge:"Most Popular",
    featuresEn:["24 sessions / month","90 min per session","2 teachers","24/7 support","Full reports","IELTS prep","Monthly review call"],
    featuresAr:["24 جلسة / شهر","90 دقيقة للجلسة","معلمان","دعم 24/7","تقارير كاملة","تحضير IELTS","مكالمة مراجعة شهرية"],
    popular:true, current:false,
  },
  {
    id:"intensive", nameEn:"Intensive", nameAr:"المكثف",
    sessions:32, price:380, currency:"$", perSession:11.875, validDays:30,
    color:"#d97706", bg:"#fef3c7", badge:"Best Value",
    featuresEn:["32 sessions / month","90 min per session","3 teachers","Dedicated manager","Custom curriculum","Exam registration help"],
    featuresAr:["32 جلسة / شهر","90 دقيقة للجلسة","3 معلمين","مدير مخصص","منهج مخصص","مساعدة تسجيل الاختبار"],
    popular:false, current:false,
  },
];

const INVOICES: Invoice[] = [
  { id:"INV-2025-003", packageEn:"Standard Plan",  packageAr:"الباقة القياسية", childEn:"Sara Al-Rashid", childAr:"سارة الراشد", amount:220, currency:"$", date:"Mar 15, 2025", method:"card",  status:"paid",    ref:"TXN-83921", sessions:16, period:"Mar 2025" },
  { id:"INV-2025-002", packageEn:"Standard Plan",  packageAr:"الباقة القياسية", childEn:"Sara Al-Rashid", childAr:"سارة الراشد", amount:220, currency:"$", date:"Feb 15, 2025", method:"card",  status:"paid",    ref:"TXN-71840", sessions:16, period:"Feb 2025" },
  { id:"INV-2025-001", packageEn:"Starter Plan",   packageAr:"باقة المبتدئ",    childEn:"Sara Al-Rashid", childAr:"سارة الراشد", amount:120, currency:"$", date:"Jan 10, 2025", method:"bank",  status:"paid",    ref:"TXN-60318", sessions:8,  period:"Jan 2025" },
  { id:"INV-2024-012", packageEn:"Starter Plan",   packageAr:"باقة المبتدئ",    childEn:"Sara Al-Rashid", childAr:"سارة الراشد", amount:120, currency:"$", date:"Dec 10, 2024", method:"card",  status:"paid",    ref:"TXN-54210", sessions:8,  period:"Dec 2024" },
  { id:"INV-2024-011", packageEn:"Trial Session",  packageAr:"جلسة تجريبية",   childEn:"Sara Al-Rashid", childAr:"سارة الراشد", amount:0,   currency:"$", date:"Nov 20, 2024", method:"apple", status:"paid",    ref:"TXN-FREE1", sessions:1,  period:"Nov 2024" },
];

// ─── Configs ──────────────────────────────────────────────────
const PAY_ST: Record<PayStatus,{bg:string;text:string;border:string;dot:string;en:string;ar:string}> = {
  paid:    {bg:"#d1fae5",text:"#059669",border:"#6ee7b7",dot:"#059669",en:"Paid",    ar:"مدفوع"},
  pending: {bg:"#fef3c7",text:"#d97706",border:"#fde68a",dot:"#d97706",en:"Pending", ar:"معلق"},
  failed:  {bg:"#fee2e2",text:"#ef4444",border:"#fca5a5",dot:"#ef4444",en:"Failed",  ar:"فشل"},
};
const METHOD_CFG: Record<PayMethod,{en:string;ar:string;icon:React.ReactNode}> = {
  card:  {en:"Credit Card",  ar:"بطاقة ائتمان", icon:<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>},
  bank:  {en:"Bank Transfer",ar:"تحويل بنكي",   icon:<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>},
  apple: {en:"Apple Pay",    ar:"Apple Pay",    icon:<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83z"/></svg>},
};

// ─── Icons ────────────────────────────────────────────────────
const I={
  close:    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  ok:       <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>,
  wallet:   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/><circle cx="16" cy="13" r="1.5" fill="currentColor"/></svg>,
  calendar: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  sessions: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="9 12 11 14 15 10"/></svg>,
  invoice:  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  download: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  arrow:    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  shield:   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  info:     <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  spinner:  <svg className="animate-spin" width="15" height="15" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="white" strokeWidth="2" strokeOpacity="0.3"/><path d="M7 1.5a5.5 5.5 0 015.5 5.5" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>,
  copy:     <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>,
};

// ─── Backdrop — always centered wide ────────────────────────
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
      {I.ok}<span className="flex-1 min-w-0 truncate">{msg}</span>
      <button onClick={onClose} className="opacity-50 hover:opacity-100">{I.close}</button>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// BUY MODAL — wide 2-column
// ═══════════════════════════════════════════════════
function BuyModal({pkg,lang,isRTL,t,onClose,onConfirm}:{
  pkg:Package;lang:string;isRTL:boolean;
  t:(a:string,b:string)=>string;
  onClose:()=>void;onConfirm:()=>void;
}){
  const [method,  setMethod]  = useState<PayMethod>("card");
  const [cardNo,  setCardNo]  = useState("");
  const [expiry,  setExpiry]  = useState("");
  const [cvv,     setCvv]     = useState("");
  const [agree,   setAgree]   = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors,  setErrors]  = useState<Record<string,string>>({});
  const name = lang==="ar"?pkg.nameAr:pkg.nameEn;

  const validate=()=>{
    const e:Record<string,string>={};
    if(method==="card"){
      if(cardNo.replace(/\s/g,"").length<16) e.cardNo=t("Enter valid 16-digit number.","أدخل رقم صحيح من 16 رقمًا.");
      if(!expiry.match(/^\d{2}\/\d{2}$/))   e.expiry=t("Format: MM/YY","الصيغة: شهر/سنة");
      if(cvv.length<3)                        e.cvv   =t("Invalid CVV.","CVV غير صحيح.");
    }
    if(!agree) e.agree=t("You must agree to proceed.","يجب الموافقة للمتابعة.");
    setErrors(e); return Object.keys(e).length===0;
  };

  const handlePay=async()=>{
    if(!validate()) return;
    setLoading(true); await new Promise(r=>setTimeout(r,1600)); setLoading(false); onConfirm();
  };

  const inp="w-full px-3 py-2.5 text-sm border border-[#E2E8F0] rounded-xl bg-white text-[#1e293b] placeholder:text-[#C4CAD4] focus:outline-none focus:border-[#107789] focus:ring-1 focus:ring-[#107789]/20 transition-all";

  return(
    <Backdrop onClose={onClose}>
      <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-3xl overflow-hidden"
        dir={isRTL?"rtl":"ltr"} style={{maxHeight:"92vh",overflowY:"auto"}}>
        <div className="h-1.5" style={{background:`linear-gradient(90deg,${pkg.color},#E8763A)`}}/>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#F1F5F9]">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl" style={{backgroundColor:pkg.bg}}>
              {pkg.id==="starter"?"🌱":pkg.id==="standard"?"⭐":pkg.id==="premium"?"💎":"🚀"}
            </div>
            <div>
              <h2 className="text-base font-black text-[#1e293b]">{t("Buy Package","شراء الباقة")} — {name}</h2>
              <p className="text-xs text-[#94a3b8]">{pkg.sessions} {t("sessions","جلسة")} · {pkg.currency}{pkg.price}/{t("month","شهر")}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#F5F7F9] text-[#94a3b8] hover:text-[#1e293b] hover:bg-[#E2E8F0] transition-all">{I.close}</button>
        </div>

        {/* 2-column body */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x divide-[#F1F5F9]">

          {/* LEFT: Order summary */}
          <div className="p-6 space-y-5">
            <p className="text-xs font-black text-[#94a3b8] uppercase tracking-widest">{t("Order Summary","ملخص الطلب")}</p>

            {/* Summary rows */}
            <div className="rounded-2xl border border-[#F1F5F9] overflow-hidden">
              {[
                {lbl:t("Package","الباقة"),      val:name},
                {lbl:t("Sessions","الجلسات"),    val:`${pkg.sessions} ${t("sessions / month","جلسة / شهر")}`},
                {lbl:t("Per Session","للجلسة"),  val:`${pkg.currency}${pkg.perSession.toFixed(2)}`},
                {lbl:t("Validity","الصلاحية"),   val:`${pkg.validDays} ${t("days","يوم")}`},
              ].map((r,i,arr)=>(
                <div key={r.lbl} className={`flex items-center justify-between px-4 py-3 ${i<arr.length-1?"border-b border-[#F1F5F9]":""}`}>
                  <span className="text-xs text-[#94a3b8]">{r.lbl}</span>
                  <span className="text-xs font-bold text-[#1e293b]">{r.val}</span>
                </div>
              ))}
              {/* Total row */}
              <div className="flex items-center justify-between px-4 py-4 border-t-2 border-[#F1F5F9]" style={{backgroundColor:pkg.bg}}>
                <span className="text-sm font-bold" style={{color:pkg.color}}>{t("Total Due","الإجمالي المستحق")}</span>
                <span className="text-2xl font-black" style={{color:pkg.color}}>{pkg.currency}{pkg.price}</span>
              </div>
            </div>

            {/* Features */}
            <div className="rounded-2xl bg-[#F8FAFC] border border-[#F1F5F9] p-4 space-y-2">
              <p className="text-[10px] font-black text-[#94a3b8] uppercase tracking-wide mb-2">{t("What's included","ما يشمله")}</p>
              {(lang==="ar"?pkg.featuresAr:pkg.featuresEn).map((f,i)=>(
                <div key={i} className="flex items-center gap-2 text-xs text-[#64748b]">
                  <span style={{color:pkg.color}}>{I.ok}</span>{f}
                </div>
              ))}
            </div>

            {/* Security */}
            <div className="flex items-center gap-2 text-[11px] text-[#94a3b8]">
              <span className="text-[#059669]">{I.shield}</span>
              {t("256-bit SSL secured. Cancel anytime.","مؤمّن 256-bit. إلغاء في أي وقت.")}
            </div>
          </div>

          {/* RIGHT: Payment form */}
          <div className="p-6 space-y-5">
            <p className="text-xs font-black text-[#94a3b8] uppercase tracking-widest">{t("Payment Details","تفاصيل الدفع")}</p>

            {/* Method selector */}
            <div className="grid grid-cols-3 gap-2">
              {(Object.entries(METHOD_CFG) as [PayMethod,typeof METHOD_CFG[PayMethod]][]).map(([key,mc])=>(
                <button key={key} onClick={()=>setMethod(key)}
                  className={`flex flex-col items-center gap-1.5 px-2 py-3 rounded-xl border text-[10px] font-semibold transition-all active:scale-[.97]
                              ${method===key?"border-[#107789]/60 bg-[#EBF5F7] text-[#107789]":"border-[#E2E8F0] text-[#64748b] hover:border-[#107789]/30 hover:bg-[#F8FAFC]"}`}>
                  <span style={{color:method===key?"#107789":"#94a3b8"}}>{mc.icon}</span>
                  {lang==="ar"?mc.ar:mc.en}
                </button>
              ))}
            </div>

            {/* Card fields */}
            {method==="card"&&(
              <div className="space-y-3" style={{animation:"slideUp .2s ease both"}}>
                <div>
                  <label className="block text-xs font-semibold text-[#64748b] mb-1.5">{t("Card Number","رقم البطاقة")}</label>
                  <input value={cardNo} onChange={e=>{
                    const v=e.target.value.replace(/\D/g,"").slice(0,16);
                    setCardNo(v.replace(/(.{4})/g,"$1 ").trim());
                  }} placeholder="0000 0000 0000 0000" className={inp} maxLength={19}/>
                  {errors.cardNo&&<p className="text-[11px] text-[#ef4444] mt-1">{errors.cardNo}</p>}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#64748b] mb-1.5">{t("Expiry","انتهاء الصلاحية")}</label>
                    <input value={expiry} onChange={e=>{
                      let v=e.target.value.replace(/\D/g,"");
                      if(v.length>2) v=v.slice(0,2)+"/"+v.slice(2,4);
                      setExpiry(v);
                    }} placeholder="MM/YY" className={inp} maxLength={5}/>
                    {errors.expiry&&<p className="text-[11px] text-[#ef4444] mt-1">{errors.expiry}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#64748b] mb-1.5">CVV</label>
                    <input value={cvv} onChange={e=>setCvv(e.target.value.replace(/\D/g,"").slice(0,4))} placeholder="•••" className={inp} maxLength={4} type="password"/>
                    {errors.cvv&&<p className="text-[11px] text-[#ef4444] mt-1">{errors.cvv}</p>}
                  </div>
                </div>
              </div>
            )}

            {method!=="card"&&(
              <div className="rounded-xl bg-[#EBF5F7] border border-[#b2dce4] p-4 text-xs text-[#107789] flex items-start gap-2" style={{animation:"slideUp .2s ease both"}}>
                {I.info}<span>{t(`You will be redirected to complete your ${METHOD_CFG[method].en} payment securely.`,`سيتم توجيهك لإتمام الدفع عبر ${METHOD_CFG[method].ar} بأمان.`)}</span>
              </div>
            )}

            {/* Auto-renew */}
            <div className="flex items-center justify-between rounded-xl bg-[#F8FAFC] border border-[#F1F5F9] px-4 py-3">
              <div>
                <p className="text-xs font-bold text-[#1e293b]">{t("Auto Renew Monthly","تجديد تلقائي شهري")}</p>
                <p className="text-[10px] text-[#94a3b8]">{t("Cancel anytime in settings","إلغاء في الإعدادات في أي وقت")}</p>
              </div>
              <div className="w-11 rounded-full bg-[#107789] flex items-center px-1 cursor-pointer" style={{height:24}}>
                <div className="w-4 h-4 rounded-full bg-white shadow ms-auto"/>
              </div>
            </div>

            {/* Terms */}
            <label className="flex items-start gap-2.5 cursor-pointer" style={{flexDirection:isRTL?"row-reverse":"row"}}>
              <input type="checkbox" checked={agree} onChange={e=>setAgree(e.target.checked)} style={{marginTop:3,accentColor:"#107789",flexShrink:0}}/>
              <span className="text-[11px] text-[#64748b] leading-relaxed">{t("I agree to the Terms of Service and authorize this recurring charge.","أوافق على شروط الخدمة وأُجيز الرسوم المتكررة.")}</span>
            </label>
            {errors.agree&&<p className="text-[11px] text-[#ef4444]">{errors.agree}</p>}

            {/* Pay btn */}
            <button onClick={handlePay} disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold text-white hover:opacity-90 active:scale-[.98] transition-all"
              style={{backgroundColor:loading?"#5FA8B3":pkg.color}}>
              {loading?<>{I.spinner}{t("Processing…","جارٍ المعالجة…")}</>:<>{I.shield}&nbsp;{t(`Pay ${pkg.currency}${pkg.price}`,`ادفع ${pkg.currency}${pkg.price}`)}{I.arrow}</>}
            </button>
          </div>
        </div>
      </div>
    </Backdrop>
  );
}

// ═══════════════════════════════════════════════════
// INVOICE MODAL — wide 2-column
// ═══════════════════════════════════════════════════
function InvoiceModal({inv,lang,isRTL,t,onClose}:{inv:Invoice;lang:string;isRTL:boolean;t:(a:string,b:string)=>string;onClose:()=>void}){
  const sc=PAY_ST[inv.status];
  const mc=METHOD_CFG[inv.method];
  const [copied,setCopied]=useState(false);
  const copy=()=>{ navigator.clipboard?.writeText(inv.ref).catch(()=>{}); setCopied(true); setTimeout(()=>setCopied(false),2000); };

  return(
    <Backdrop onClose={onClose}>
      <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-3xl overflow-hidden"
        dir={isRTL?"rtl":"ltr"}>
        <div className="h-1.5" style={{background:"linear-gradient(90deg,#107789,#E8763A)"}}/>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#F1F5F9]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EBF5F7] text-[#107789] flex items-center justify-center">{I.invoice}</div>
            <div>
              <h2 className="text-base font-black text-[#1e293b]">{t("Invoice Details","تفاصيل الفاتورة")}</h2>
              <p className="text-xs text-[#94a3b8] font-mono mt-0.5">{inv.id}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#F5F7F9] text-[#94a3b8] hover:text-[#1e293b] hover:bg-[#E2E8F0] transition-all">{I.close}</button>
        </div>

        {/* 2-column body */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x divide-[#F1F5F9]">

          {/* LEFT: Amount hero + status */}
          <div className="p-6 space-y-5 flex flex-col">
            <p className="text-xs font-black text-[#94a3b8] uppercase tracking-widest">{t("Payment Summary","ملخص الدفع")}</p>

            {/* Amount card */}
            <div className="rounded-2xl text-center py-8 flex-1 flex flex-col items-center justify-center gap-3" style={{backgroundColor:sc.bg}}>
              <p className="text-5xl font-black" style={{color:sc.text}}>
                {inv.amount===0?t("Free","مجاني"):`${inv.currency}${inv.amount}`}
              </p>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-white"
                style={{color:sc.text}}>
                <span className="w-2 h-2 rounded-full" style={{backgroundColor:sc.dot}}/>
                {lang==="ar"?sc.ar:sc.en}
              </span>
              <p className="text-sm font-semibold" style={{color:sc.text}}>{inv.date}</p>
            </div>

            {/* Reference + copy */}
            <div className="rounded-xl bg-[#F8FAFC] border border-[#F1F5F9] px-4 py-3 flex items-center gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-[10px] text-[#94a3b8] font-bold uppercase tracking-wide">{t("Transaction Reference","مرجع المعاملة")}</p>
                <p className="text-sm font-black text-[#1e293b] font-mono truncate mt-0.5">{inv.ref}</p>
              </div>
              <button onClick={copy}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-bold border transition-all active:scale-95 flex-shrink-0"
                style={copied?{backgroundColor:"#d1fae5",color:"#059669",borderColor:"#6ee7b7"}:{borderColor:"#E2E8F0",color:"#64748b"}}>
                {I.copy}{copied?t("Copied!","تم!"):t("Copy","نسخ")}
              </button>
            </div>
          </div>

          {/* RIGHT: Invoice details grid */}
          <div className="p-6 space-y-5">
            <p className="text-xs font-black text-[#94a3b8] uppercase tracking-widest">{t("Invoice Details","تفاصيل الفاتورة")}</p>

            {/* Info tiles 2x2 */}
            <div className="grid grid-cols-2 gap-3">
              {[
                {lbl:t("Invoice No","رقم الفاتورة"),   val:inv.id,                                  icon:"🧾"},
                {lbl:t("Date","التاريخ"),               val:inv.date,                                icon:"📅"},
                {lbl:t("Package","الباقة"),             val:lang==="ar"?inv.packageAr:inv.packageEn, icon:"📦"},
                {lbl:t("Period","الفترة"),              val:inv.period,                              icon:"📆"},
                {lbl:t("Sessions","الجلسات"),           val:String(inv.sessions),                    icon:"🎓"},
                {lbl:t("Method","طريقة الدفع"),         val:lang==="ar"?mc.ar:mc.en,                 icon:"💳"},
              ].map(r=>(
                <div key={r.lbl} className="rounded-xl bg-[#F8FAFC] border border-[#F1F5F9] p-3">
                  <p className="text-lg mb-1">{r.icon}</p>
                  <p className="text-[10px] text-[#94a3b8] font-semibold uppercase tracking-wide">{r.lbl}</p>
                  <p className="text-xs font-bold text-[#1e293b] mt-0.5 truncate">{r.val}</p>
                </div>
              ))}
            </div>

            {/* Child info */}
            <div className="rounded-xl bg-[#EBF5F7] border border-[#b2dce4] p-4">
              <p className="text-[10px] font-black text-[#107789] uppercase tracking-wide mb-1.5">{t("Student","الطالب")}</p>
              <p className="text-sm font-bold text-[#1e293b]">{lang==="ar"?inv.childAr:inv.childEn}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#F1F5F9] bg-[#FAFBFC]">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm font-semibold border border-[#E2E8F0] text-[#64748b] hover:bg-[#F5F7F9] active:scale-95 transition-all">{t("Close","إغلاق")}</button>
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90 active:scale-95 transition-all" style={{backgroundColor:"#107789"}}>
            {I.download}{t("Download PDF","تنزيل PDF")}
          </button>
        </div>
      </div>
    </Backdrop>
  );
}

// ═══════════════════════════════════════════════════
// PAGE
// ═══════════════════════════════════════════════════
export default function ParentPayments(){
  const {lang,isRTL,t}=useLanguage();

  const [buyPkg,  setBuyPkg]  = useState<Package|null>(null);
  const [viewInv, setViewInv] = useState<Invoice|null>(null);
  const [toast,   setToast]   = useState<string|null>(null);
  const [activeTab,setTab]    = useState<"packages"|"history">("packages");
  const [autoRenew,setAuto]   = useState(true);

  const fire=(msg:string)=>{setToast(msg);setTimeout(()=>setToast(null),3500);};

  const current=PACKAGES.find(p=>p.current)!;
  const sessUsed=10; const sessTotal=current.sessions;
  const pct=Math.round((sessUsed/sessTotal)*100);

  const stats=[
    {icon:I.sessions, value:`${sessUsed}/${sessTotal}`, label:t("Sessions Used","الجلسات المستخدمة"), sub:t(`${sessTotal-sessUsed} remaining`,`${sessTotal-sessUsed} متبقية`), color:"#107789",bg:"#EBF5F7",delay:0    },
    {icon:I.calendar, value:"12",                       label:t("Days Remaining","الأيام المتبقية"),   sub:t("Until renewal","حتى التجديد"),                                     color:"#7c3aed",bg:"#ede9fe",delay:0.07 },
    {icon:I.wallet,   value:`$${current.price}`,        label:t("Monthly Plan","الباقة الشهرية"),      sub:`${current.sessions} ${t("sessions","جلسة")}`,                         color:"#059669",bg:"#d1fae5",delay:0.14 },
    {icon:I.invoice,  value:String(INVOICES.filter(i=>i.status==="paid").length), label:t("Paid Invoices","الفواتير المدفوعة"), sub:t("All time","جميع الأوقات"),               color:"#d97706",bg:"#fef3c7",delay:0.21 },
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
        <div style={{animation:"fadeIn .4s ease both"}}>
          <h1 className="text-xl sm:text-2xl font-black text-[#1e293b] tracking-tight">{t("Packages & Payments","الباقات والمدفوعات")}</h1>
          <p className="mt-1 text-xs sm:text-sm text-[#94a3b8]">{t("Manage your child's subscription and billing","إدارة اشتراك طفلك والفواتير")}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {stats.map(s=>(
            <div key={s.label} className="rounded-2xl bg-white border border-[#F1F5F9] shadow-sm p-4 sm:p-5 flex items-start gap-3 sm:gap-4 hover:shadow-md hover:border-[#b2dce4] transition-all duration-300"
              style={{animation:`cardIn .45s ${s.delay}s cubic-bezier(.34,1.2,.64,1) both`}}>
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{backgroundColor:s.bg}}>
                <span style={{color:s.color}}>{s.icon}</span>
              </div>
              <div className="min-w-0">
                <p className="text-xl sm:text-2xl font-black text-[#1e293b] leading-none">{s.value}</p>
                <p className="text-xs text-[#94a3b8] mt-1 font-medium leading-tight">{s.label}</p>
                {s.sub&&<p className="text-[10px] text-[#94a3b8] mt-0.5">{s.sub}</p>}
              </div>
            </div>
          ))}
        </div>

        {/* Current Subscription Hero */}
        <div className="rounded-2xl overflow-hidden shadow-sm"
          style={{background:"linear-gradient(135deg,#0B2C33 0%,#107789 60%,#0d8a9e 100%)",animation:"cardIn .45s .22s both"}}>
          <div className="relative p-5 sm:p-6">
            <div className="absolute -top-8 -end-8 w-48 h-48 rounded-full opacity-10 bg-white pointer-events-none"/>
            <div className="absolute -bottom-10 -start-10 w-56 h-56 rounded-full opacity-5 bg-white pointer-events-none"/>
            <div className="relative flex flex-wrap items-start justify-between gap-5">
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-1">{t("Current Subscription","الاشتراك الحالي")}</p>
                <h2 className="text-2xl sm:text-3xl font-black text-white">{lang==="ar"?current.nameAr:current.nameEn}</h2>
                <p className="text-sm text-white/60 mt-1">{t("Renews Apr 15, 2025","يتجدد 15 أبريل 2025")}</p>
                <div className="mt-5 space-y-2 max-w-sm">
                  <div className="flex justify-between text-xs text-white/60">
                    <span>{t("Sessions","الجلسات")}</span>
                    <span><strong className="text-white">{sessUsed}</strong>/{sessTotal} · {pct}%</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full rounded-full" style={{width:`${pct}%`,background:"linear-gradient(90deg,#E8763A,#f59e0b)",transition:"width .9s ease"}}/>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-3 items-end flex-shrink-0">
                <div className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3">
                  <div className="text-end">
                    <p className="text-xs font-bold text-white">{t("Auto Renew","تجديد تلقائي")}</p>
                    <p className="text-[10px] text-white/50">{autoRenew?t("On","مفعّل"):t("Off","متوقف")}</p>
                  </div>
                  <button onClick={()=>setAuto(p=>!p)}
                    className="relative w-12 h-6 rounded-full transition-all duration-300 flex-shrink-0"
                    style={{backgroundColor:autoRenew?"#22c55e":"rgba(255,255,255,0.2)"}}>
                    <div className="absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-300"
                      style={{[isRTL?"right":"left"]:autoRenew?"26px":"4px"}}/>
                  </button>
                </div>
                <button onClick={()=>{const p=PACKAGES.find(p=>!p.current&&p.id==="premium");if(p)setBuyPkg(p);}}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-white text-[#107789] hover:bg-white/90 active:scale-[.98] transition-all">
                  {t("Upgrade Plan","ترقية الباقة")}{I.arrow}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 flex-wrap" style={{animation:"cardIn .4s .3s both"}}>
          {([["packages",t("Available Packages","الباقات المتاحة")],["history",t("Payment History & Invoices","سجل المدفوعات والفواتير")]] as const).map(([key,lbl])=>(
            <button key={key} onClick={()=>setTab(key)}
              className="px-4 py-2 rounded-xl text-sm font-semibold transition-all active:scale-95"
              style={activeTab===key?{backgroundColor:"#107789",color:"white",boxShadow:"0 2px 8px #10778940"}:{backgroundColor:"white",color:"#64748b",border:"1px solid #F1F5F9"}}>
              {lbl}
            </button>
          ))}
        </div>

        {/* Packages */}
        {activeTab==="packages"&&(
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4" style={{animation:"cardIn .4s .35s both"}}>
            {PACKAGES.map((pkg,i)=>{
              const name=lang==="ar"?pkg.nameAr:pkg.nameEn;
              const feats=lang==="ar"?pkg.featuresAr:pkg.featuresEn;
              return(
                <div key={pkg.id}
                  className={`relative rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${pkg.popular?"shadow-lg":""}`}
                  style={{
                    border:pkg.current?`2px solid ${pkg.color}`:pkg.popular?`2px solid ${pkg.color}`:"1px solid #F1F5F9",
                    backgroundColor:"white",
                    animation:`cardIn .45s ${i*0.09}s cubic-bezier(.34,1.2,.64,1) both`,
                  }}>
                  {(pkg.popular||pkg.badge)&&(
                    <div className="py-1 text-center text-[10px] font-black tracking-wider text-white uppercase" style={{backgroundColor:pkg.color}}>
                      {pkg.badge||(pkg.popular?t("Most Popular","الأكثر طلباً"):"")}
                    </div>
                  )}
                  {pkg.current&&(
                    <div className="absolute top-3 end-3 z-10 flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-black text-white" style={{backgroundColor:pkg.color}}>
                      {I.ok}{t("Current","حالية")}
                    </div>
                  )}
                  <div className={`p-5 flex flex-col flex-1 ${pkg.popular||pkg.badge?"pt-3":""}`}>
                    <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-3" style={{backgroundColor:pkg.bg}}>
                      <span className="text-xl">{pkg.id==="starter"?"🌱":pkg.id==="standard"?"⭐":pkg.id==="premium"?"💎":"🚀"}</span>
                    </div>
                    <p className="text-lg font-black text-[#1e293b]">{name}</p>
                    <div className="flex items-end gap-1 mt-1">
                      <span className="text-3xl font-black" style={{color:pkg.color}}>{pkg.currency}{pkg.price}</span>
                      <span className="text-xs text-[#94a3b8] mb-1">/{t("mo","شهر")}</span>
                    </div>
                    <p className="text-[11px] text-[#94a3b8] mb-4">{pkg.sessions} {t("sessions","جلسة")} · {pkg.currency}{pkg.perSession.toFixed(2)}/{t("session","جلسة")}</p>
                    <div className="space-y-2 flex-1 mb-5">
                      {feats.map((f,j)=>(
                        <div key={j} className="flex items-start gap-2 text-xs text-[#64748b]">
                          <span style={{color:pkg.color,flexShrink:0}}>{I.ok}</span>{f}
                        </div>
                      ))}
                    </div>
                    <button onClick={()=>!pkg.current&&setBuyPkg(pkg)}
                      className="w-full py-2.5 rounded-xl text-sm font-bold transition-all active:scale-[.98]"
                      style={pkg.current?{backgroundColor:pkg.bg,color:pkg.color,cursor:"default"}:{backgroundColor:pkg.color,color:"white"}}>
                      {pkg.current?t("Current Plan","الباقة الحالية"):t("Buy Package","شراء الباقة")}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Payment History */}
        {activeTab==="history"&&(
          <div className="rounded-2xl bg-white border border-[#F1F5F9] shadow-sm overflow-hidden"
            style={{animation:"cardIn .4s .35s cubic-bezier(.34,1.2,.64,1) both"}}>
            <div className="px-5 py-4 border-b border-[#F1F5F9]">
              <h2 className="text-sm font-bold text-[#1e293b]">{t("Payment History & Invoices","سجل المدفوعات والفواتير")}</h2>
              <p className="text-xs text-[#94a3b8] mt-0.5">{INVOICES.length} {t("transactions","معاملة")}</p>
            </div>

            {/* Mobile */}
            <div className="sm:hidden divide-y divide-[#F8FAFC]">
              {INVOICES.map((inv,i)=>{
                const sc=PAY_ST[inv.status];
                return(
                  <div key={inv.id} className="flex items-center gap-3 px-4 py-4 hover:bg-[#F8FAFC] cursor-pointer"
                    style={{animation:`slideUp .3s ${0.38+i*0.05}s ease both`}}
                    onClick={()=>setViewInv(inv)}>
                    <div className="w-10 h-10 rounded-xl bg-[#EBF5F7] text-[#107789] flex items-center justify-center flex-shrink-0">{I.invoice}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-[#1e293b] truncate">{lang==="ar"?inv.packageAr:inv.packageEn}</p>
                      <p className="text-[10px] text-[#94a3b8] mt-0.5">{inv.date} · {inv.period}</p>
                    </div>
                    <div className="text-end flex-shrink-0">
                      <p className="text-sm font-black">{inv.amount===0?t("Free","مجاني"):`$${inv.amount}`}</p>
                      <span className="text-[10px] font-bold" style={{color:sc.text}}>{lang==="ar"?sc.ar:sc.en}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm" style={{borderCollapse:"collapse"}}>
                <thead>
                  <tr style={{backgroundColor:"#F8FAFC"}}>
                    {[t("Invoice","الفاتورة"),t("Package","الباقة"),t("Period","الفترة"),t("Date","التاريخ"),t("Method","الطريقة"),t("Sessions","الجلسات"),t("Amount","المبلغ"),t("Status","الحالة"),t("Action","إجراء")].map(h=>(
                      <th key={h} className="px-4 py-3 text-start text-xs font-semibold uppercase tracking-wide text-[#94a3b8] whitespace-nowrap border-b border-[#F1F5F9]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {INVOICES.map((inv,i)=>{
                    const sc=PAY_ST[inv.status];
                    const mc2=METHOD_CFG[inv.method];
                    return(
                      <tr key={inv.id} className="hover:bg-[#F8FAFC] transition-colors border-b border-[#F1F5F9] last:border-0"
                        style={{animation:`slideUp .3s ${0.4+i*0.05}s ease both`}}>
                        <td className="px-4 py-3.5">
                          <span className="font-mono text-xs bg-[#F8FAFC] border border-[#F1F5F9] px-2 py-0.5 rounded-lg text-[#94a3b8]">{inv.id}</span>
                        </td>
                        <td className="px-4 py-3.5 font-semibold text-[#1e293b] whitespace-nowrap">{lang==="ar"?inv.packageAr:inv.packageEn}</td>
                        <td className="px-4 py-3.5 text-xs text-[#94a3b8] whitespace-nowrap">{inv.period}</td>
                        <td className="px-4 py-3.5 text-xs text-[#94a3b8] whitespace-nowrap">{inv.date}</td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-1.5 text-xs text-[#64748b]">
                            <span className="flex-shrink-0">{mc2.icon}</span>
                            <span className="whitespace-nowrap">{lang==="ar"?mc2.ar:mc2.en}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-sm font-bold text-[#1e293b]">{inv.sessions}</td>
                        <td className="px-4 py-3.5">
                          <span className="text-base font-black">{inv.amount===0?<span className="text-sm font-bold text-[#059669]">{t("Free","مجاني")}</span>:`$${inv.amount}`}</span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold whitespace-nowrap"
                            style={{backgroundColor:sc.bg,color:sc.text,border:`1px solid ${sc.border}`}}>
                            <span className="w-1.5 h-1.5 rounded-full" style={{backgroundColor:sc.dot}}/>
                            {lang==="ar"?sc.ar:sc.en}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <button onClick={()=>setViewInv(inv)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border border-[#E2E8F0] text-[#107789] hover:bg-[#EBF5F7] active:scale-95 transition-all whitespace-nowrap">
                            {I.invoice}{t("View","عرض")}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Footer total */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 bg-[#F8FAFC] border-t border-[#F1F5F9]">
              <p className="text-xs text-[#94a3b8]">{t("All transactions","جميع المعاملات")}</p>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#64748b] font-medium">{t("Total paid:","إجمالي المدفوع:")}</span>
                <span className="text-base font-black text-[#107789]">${INVOICES.filter(i=>i.status==="paid"&&i.amount>0).reduce((a,i)=>a+i.amount,0)}</span>
              </div>
            </div>
          </div>
        )}

      </main>

      {buyPkg&&<BuyModal pkg={buyPkg} lang={lang} isRTL={isRTL} t={t} onClose={()=>setBuyPkg(null)} onConfirm={()=>{setBuyPkg(null);fire(t("Payment successful! Package is now active.","تمت عملية الدفع! الباقة نشطة الآن."));}}/>}
      {viewInv&&<InvoiceModal inv={viewInv} lang={lang} isRTL={isRTL} t={t} onClose={()=>setViewInv(null)}/>}
      {toast&&<Toast msg={toast} onClose={()=>setToast(null)}/>}
    </>
  );
}