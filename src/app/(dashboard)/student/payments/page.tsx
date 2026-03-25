"use client";

import { useState } from "react";
import { useLanguage } from "@/src/contexts/LanguageContext";

// ─── Types ────────────────────────────────────────────────────
type PackageId     = "starter" | "standard" | "premium" | "intensive";
type PayStatus     = "paid" | "pending" | "failed" | "refunded";
type PayMethod     = "card" | "bank" | "apple" | "google";

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
  badge:       string;
  featuresEn:  string[];
  featuresAr:  string[];
  popular:     boolean;
  current:     boolean;
}

interface PaymentRecord {
  id:          string;
  packageEn:   string;
  packageAr:   string;
  amount:      number;
  currency:    string;
  date:        string;
  method:      PayMethod;
  status:      PayStatus;
  invoice:     string;
  sessions:    number;
}

interface Subscription {
  packageId:   PackageId;
  nameEn:      string;
  nameAr:      string;
  sessionsUsed: number;
  sessionsTotal:number;
  expiryDate:  string;
  autoRenew:   boolean;
  price:       number;
}

// ─── Data ─────────────────────────────────────────────────────
const PACKAGES: Package[] = [
  {
    id:"starter", nameEn:"Starter", nameAr:"المبتدئ",
    sessions:8, price:120, currency:"$", perSession:15, validDays:30,
    color:"#64748b", bg:"#f1f5f9", badge:"",
    featuresEn:["8 sessions / month","60 min per session","1 teacher","Basic support"],
    featuresAr:["8 جلسات / شهر","60 دقيقة للجلسة","معلم واحد","دعم أساسي"],
    popular:false, current:false,
  },
  {
    id:"standard", nameEn:"Standard", nameAr:"القياسي",
    sessions:16, price:220, currency:"$", perSession:13.75, validDays:30,
    color:"#107789", bg:"#EBF5F7", badge:"",
    featuresEn:["16 sessions / month","60 min per session","Choose teacher","Priority support","Progress reports"],
    featuresAr:["16 جلسة / شهر","60 دقيقة للجلسة","اختيار المعلم","دعم أولوية","تقارير التقدم"],
    popular:false, current:true,
  },
  {
    id:"premium", nameEn:"Premium", nameAr:"المتميز",
    sessions:24, price:300, currency:"$", perSession:12.5, validDays:30,
    color:"#7c3aed", bg:"#ede9fe", badge:"Most Popular",
    featuresEn:["24 sessions / month","90 min per session","2 teachers","24/7 support","Progress reports","IELTS prep included"],
    featuresAr:["24 جلسة / شهر","90 دقيقة للجلسة","معلمان","دعم 24/7","تقارير التقدم","تحضير IELTS مشمول"],
    popular:true, current:false,
  },
  {
    id:"intensive", nameEn:"Intensive", nameAr:"المكثف",
    sessions:32, price:380, currency:"$", perSession:11.875, validDays:30,
    color:"#d97706", bg:"#fef3c7", badge:"Best Value",
    featuresEn:["32 sessions / month","90 min per session","3 teachers","Dedicated manager","All features","Custom curriculum"],
    featuresAr:["32 جلسة / شهر","90 دقيقة للجلسة","3 معلمين","مدير مخصص","جميع المميزات","منهج مخصص"],
    popular:false, current:false,
  },
];

const CURRENT_SUB: Subscription = {
  packageId:"standard", nameEn:"Standard", nameAr:"القياسي",
  sessionsUsed:10, sessionsTotal:16,
  expiryDate:"Apr 15, 2025",
  autoRenew:true, price:220,
};

const PAYMENT_HISTORY: PaymentRecord[] = [
  { id:"INV-2025-003", packageEn:"Standard Plan",  packageAr:"الباقة القياسية",  amount:220, currency:"$", date:"Mar 15, 2025", method:"card",   status:"paid",    invoice:"INV-2025-003", sessions:16 },
  { id:"INV-2025-002", packageEn:"Standard Plan",  packageAr:"الباقة القياسية",  amount:220, currency:"$", date:"Feb 15, 2025", method:"card",   status:"paid",    invoice:"INV-2025-002", sessions:16 },
  { id:"INV-2025-001", packageEn:"Starter Plan",   packageAr:"باقة المبتدئ",     amount:120, currency:"$", date:"Jan 10, 2025", method:"bank",   status:"paid",    invoice:"INV-2025-001", sessions:8  },
  { id:"INV-2024-012", packageEn:"Starter Plan",   packageAr:"باقة المبتدئ",     amount:120, currency:"$", date:"Dec 10, 2024", method:"card",   status:"paid",    invoice:"INV-2024-012", sessions:8  },
  { id:"INV-2024-011", packageEn:"Trial Session",  packageAr:"جلسة تجريبية",     amount:0,   currency:"$", date:"Nov 20, 2024", method:"card",   status:"paid",    invoice:"INV-2024-011", sessions:1  },
];

// ─── Configs ──────────────────────────────────────────────────
const PAY_STATUS_CFG: Record<PayStatus,{bg:string;text:string;border:string;dot:string;en:string;ar:string}> = {
  paid:     {bg:"#d1fae5",text:"#059669",border:"#6ee7b7",dot:"#059669",en:"Paid",     ar:"مدفوع"},
  pending:  {bg:"#fef3c7",text:"#d97706",border:"#fde68a",dot:"#d97706",en:"Pending",  ar:"معلق"},
  failed:   {bg:"#fee2e2",text:"#ef4444",border:"#fca5a5",dot:"#ef4444",en:"Failed",   ar:"فشل"},
  refunded: {bg:"#f1f5f9",text:"#64748b",border:"#e2e8f0",dot:"#94a3b8",en:"Refunded",ar:"مُسترد"},
};

const METHOD_CFG: Record<PayMethod,{labelEn:string;labelAr:string;icon:React.ReactNode}> = {
  card:   {labelEn:"Credit Card", labelAr:"بطاقة ائتمان", icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>},
  bank:   {labelEn:"Bank Transfer",labelAr:"تحويل بنكي",  icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/></svg>},
  apple:  {labelEn:"Apple Pay",   labelAr:"Apple Pay",   icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>},
  google: {labelEn:"Google Pay",  labelAr:"Google Pay",  icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M8 12h8M12 8v8"/></svg>},
};

// ─── Icons ────────────────────────────────────────────────────
const I = {
  check:    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>,
  close:    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  info:     <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  download: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  wallet:   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/><path d="M16 3H8l-2 4h12l-2-4z"/><circle cx="16" cy="13" r="1.5" fill="currentColor"/></svg>,
  calendar: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  sessions: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="9 12 11 14 15 10"/></svg>,
  invoice:  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
  arrow:    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  shield:   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  refresh:  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>,
  star:     <svg width="14" height="14" viewBox="0 0 24 24" fill="#d97706" stroke="#d97706" strokeWidth="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  lock:     <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  ok:       <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>,
};

// ─── Backdrop ─────────────────────────────────────────────────
function Backdrop({onClose,children}:{onClose:()=>void;children:React.ReactNode}){
  return(
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      style={{backgroundColor:"rgba(11,44,51,.45)",backdropFilter:"blur(4px)"}}
      onClick={onClose}>
      <div className="w-full sm:w-auto" onClick={e=>e.stopPropagation()}
        style={{animation:"modalIn .22s cubic-bezier(.34,1.56,.64,1) both"}}>
        {children}
      </div>
    </div>
  );
}

// ─── Toast ────────────────────────────────────────────────────
function Toast({msg,onClose}:{msg:string;onClose:()=>void}){
  return(
    <div className="fixed bottom-5 end-5 z-[60] flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl text-sm font-semibold max-w-[calc(100vw-2.5rem)]"
      style={{backgroundColor:"#f0fdf4",border:"1px solid #bbf7d0",color:"#15803d",animation:"slideUp .3s cubic-bezier(.34,1.56,.64,1) both"}}>
      {I.ok}
      <span className="flex-1 min-w-0 truncate">{msg}</span>
      <button onClick={onClose} className="opacity-50 hover:opacity-100">{I.close}</button>
    </div>
  );
}

// ─── Package Card ─────────────────────────────────────────────
function PackageCard({pkg,idx,lang,t,onBuy}:{pkg:Package;idx:number;lang:string;t:(a:string,b:string)=>string;onBuy:(p:Package)=>void}){
  const name   = lang==="ar" ? pkg.nameAr : pkg.nameEn;
  const feats  = lang==="ar" ? pkg.featuresAr : pkg.featuresEn;

  return(
    <div className={`relative rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${pkg.popular?"shadow-lg":"shadow-sm"}`}
      style={{
        border: pkg.current ? `2px solid ${pkg.color}` : pkg.popular ? `2px solid ${pkg.color}` : "1px solid #F1F5F9",
        backgroundColor:"white",
        animation:`cardIn .45s ${idx*0.09}s cubic-bezier(.34,1.2,.64,1) both`,
      }}>

      {/* Popular / Best value badge */}
      {(pkg.popular||pkg.badge)&&(
        <div className="absolute top-0 inset-x-0 py-1 text-center text-[10px] font-black tracking-wider text-white uppercase"
          style={{backgroundColor:pkg.color}}>
          {pkg.badge || (pkg.popular ? t("Most Popular","الأكثر طلباً") : "")}
        </div>
      )}

      {/* Current badge */}
      {pkg.current&&(
        <div className="absolute top-3 end-3 z-10 flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black text-white"
          style={{backgroundColor:pkg.color}}>
          {I.ok}{t("Current","حالية")}
        </div>
      )}

      <div className={`p-6 flex flex-col flex-1 ${pkg.popular||pkg.badge?"pt-9":""}`}>
        {/* Icon circle */}
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4" style={{backgroundColor:pkg.bg}}>
          <span className="text-xl">{pkg.id==="starter"?"🌱":pkg.id==="standard"?"⭐":pkg.id==="premium"?"💎":"🚀"}</span>
        </div>

        {/* Name + price */}
        <p className="text-lg font-black text-[#1e293b]">{name}</p>
        <div className="flex items-end gap-1 mt-1 mb-1">
          <span className="text-3xl font-black" style={{color:pkg.color}}>{pkg.currency}{pkg.price}</span>
          <span className="text-xs text-[#94a3b8] mb-1">/{t("month","شهر")}</span>
        </div>
        <p className="text-[11px] text-[#94a3b8] mb-5">
          {pkg.currency}{pkg.perSession.toFixed(2)} {t("per session","للجلسة")} · {pkg.sessions} {t("sessions","جلسة")} · {pkg.validDays} {t("days","يوم")}
        </p>

        {/* Features */}
        <div className="space-y-2.5 flex-1 mb-6">
          {feats.map((f,i)=>(
            <div key={i} className="flex items-start gap-2.5">
              <div className="w-4.5 h-4.5 rounded-full flex-shrink-0 mt-0.5 flex items-center justify-center"
                style={{backgroundColor:pkg.bg}}>
                <span style={{color:pkg.color}}>{I.ok}</span>
              </div>
              <span className="text-xs text-[#64748b] leading-snug">{f}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button onClick={()=>!pkg.current&&onBuy(pkg)}
          className="w-full py-3 rounded-xl text-sm font-bold transition-all active:scale-[.98]"
          style={pkg.current
            ?{backgroundColor:pkg.bg,color:pkg.color,cursor:"default"}
            :{backgroundColor:pkg.color,color:"white"}
          }>
          {pkg.current ? t("Current Plan","الباقة الحالية") : t("Buy Package","شراء الباقة")}
        </button>
      </div>
    </div>
  );
}

// ─── Buy Modal ────────────────────────────────────────────────
function BuyModal({pkg,lang,t,isRTL,onClose,onConfirm}:{pkg:Package;lang:string;t:(a:string,b:string)=>string;isRTL:boolean;onClose:()=>void;onConfirm:()=>void}){
  const [method,setMethod] = useState<PayMethod>("card");
  const [cardNo,setCardNo] = useState("");
  const [expiry,setExpiry] = useState("");
  const [cvv,setCvv]       = useState("");
  const [agree,setAgree]   = useState(false);
  const [loading,setLoading]=useState(false);
  const [errors,setErrors] = useState<Record<string,string>>({});
  const name = lang==="ar" ? pkg.nameAr : pkg.nameEn;

  const validate = () => {
    const e:Record<string,string>={};
    if(method==="card"){
      if(cardNo.replace(/\s/g,"").length<16) e.cardNo=t("Enter valid 16-digit card number.","أدخل رقم بطاقة صحيح من 16 رقمًا.");
      if(!expiry.match(/^\d{2}\/\d{2}$/)) e.expiry=t("Format: MM/YY","الصيغة: شهر/سنة");
      if(cvv.length<3) e.cvv=t("Invalid CVV.","CVV غير صحيح.");
    }
    if(!agree) e.agree=t("You must agree to proceed.","يجب الموافقة للمتابعة.");
    setErrors(e);
    return Object.keys(e).length===0;
  };

  const handlePay = async () => {
    if(!validate()) return;
    setLoading(true);
    await new Promise(r=>setTimeout(r,1600));
    setLoading(false);
    onConfirm();
  };

  const inp="w-full px-3 py-2.5 text-sm border border-[#E2E8F0] rounded-xl bg-white text-[#1e293b] placeholder:text-[#C4CAD4] focus:outline-none focus:border-[#107789] focus:ring-1 focus:ring-[#107789]/20 transition-all";

  return(
    <Backdrop onClose={onClose}>
      <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-2xl overflow-hidden"
        dir={isRTL?"rtl":"ltr"} style={{maxHeight:"92vh",overflowY:"auto"}}>
        <div className="h-1.5" style={{background:`linear-gradient(90deg,${pkg.color},#E8763A)`}}/>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#F1F5F9]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{backgroundColor:pkg.bg}}>
              {pkg.id==="starter"?"🌱":pkg.id==="standard"?"⭐":pkg.id==="premium"?"💎":"🚀"}
            </div>
            <div>
              <h2 className="text-base font-black text-[#1e293b]">{t("Buy Package","شراء الباقة")} — {name}</h2>
              <p className="text-xs text-[#94a3b8]">{pkg.sessions} {t("sessions","جلسة")} · {pkg.currency}{pkg.price}/{t("month","شهر")}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#F5F7F9] text-[#94a3b8] hover:text-[#1e293b] hover:bg-[#E2E8F0] transition-all">{I.close}</button>
        </div>

        {/* Body — 2 columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-0">

          {/* LEFT: Summary */}
          <div className="p-6 space-y-4 border-b sm:border-b-0 sm:border-e border-[#F1F5F9]">
            <p className="text-xs font-bold text-[#94a3b8] uppercase tracking-widest">{t("Order Summary","ملخص الطلب")}</p>

            {/* Package info tiles */}
            <div className="rounded-2xl overflow-hidden border border-[#F1F5F9]">
              {[
                {lbl:t("Package","الباقة"),       val:name},
                {lbl:t("Sessions","الجلسات"),     val:`${pkg.sessions} ${t("sessions","جلسة")}`},
                {lbl:t("Validity","الصلاحية"),    val:`${pkg.validDays} ${t("days","يوم")}`},
                {lbl:t("Per Session","للجلسة"),   val:`${pkg.currency}${pkg.perSession.toFixed(2)}`},
              ].map((r,i,arr)=>(
                <div key={r.lbl} className={`flex items-center justify-between px-4 py-3 ${i<arr.length-1?"border-b border-[#F1F5F9]":""}`}>
                  <span className="text-xs text-[#94a3b8] font-medium">{r.lbl}</span>
                  <span className="text-xs font-bold text-[#1e293b]">{r.val}</span>
                </div>
              ))}
              <div className="flex items-center justify-between px-4 py-3.5 border-t-2 border-[#F1F5F9]" style={{backgroundColor:pkg.bg}}>
                <span className="text-sm font-bold" style={{color:pkg.color}}>{t("Total","الإجمالي")}</span>
                <span className="text-xl font-black" style={{color:pkg.color}}>{pkg.currency}{pkg.price}</span>
              </div>
            </div>

            {/* Features quick list */}
            <div className="rounded-2xl bg-[#F8FAFC] border border-[#F1F5F9] p-4 space-y-2">
              {(lang==="ar"?pkg.featuresAr:pkg.featuresEn).slice(0,4).map((f,i)=>(
                <div key={i} className="flex items-center gap-2 text-xs text-[#64748b]">
                  <span style={{color:pkg.color}}>{I.ok}</span>{f}
                </div>
              ))}
            </div>

            {/* Security note */}
            <div className="flex items-center gap-2 text-[11px] text-[#94a3b8]">
              <span className="text-[#059669]">{I.shield}</span>
              {t("256-bit SSL encrypted payment. Your data is safe.","دفع مشفر 256-bit. بياناتك آمنة.")}
            </div>
          </div>

          {/* RIGHT: Payment form */}
          <div className="p-6 space-y-5">
            <p className="text-xs font-bold text-[#94a3b8] uppercase tracking-widest">{t("Payment Method","طريقة الدفع")}</p>

            {/* Method tabs */}
            <div className="grid grid-cols-2 gap-2">
              {(Object.entries(METHOD_CFG) as [PayMethod,typeof METHOD_CFG[PayMethod]][]).map(([key,mc])=>(
                <button key={key} onClick={()=>setMethod(key)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all active:scale-[.97] ${method===key?"border-[#107789]/60 bg-[#EBF5F7] text-[#107789]":"border-[#E2E8F0] text-[#64748b] hover:border-[#107789]/30 hover:bg-[#F8FAFC]"}`}>
                  <span style={{color:method===key?"#107789":"#94a3b8"}}>{mc.icon}</span>
                  {lang==="ar"?mc.labelAr:mc.labelEn}
                  {method===key&&<span className="ms-auto w-3.5 h-3.5 rounded-full bg-[#107789] flex items-center justify-center text-white">{I.ok}</span>}
                </button>
              ))}
            </div>

            {/* Card form */}
            {method==="card"&&(
              <div className="space-y-3" style={{animation:"slideUp .25s ease both"}}>
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
                    <label className="block text-xs font-semibold text-[#64748b] mb-1.5">{t("Expiry","تاريخ الانتهاء")}</label>
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

            {/* Non-card notice */}
            {method!=="card"&&(
              <div className="rounded-xl bg-[#EBF5F7] border border-[#b2dce4] p-4 text-xs text-[#107789]" style={{animation:"slideUp .25s ease both"}}>
                {I.info}&nbsp;{t(`You'll be redirected to complete your ${METHOD_CFG[method].labelEn} payment.`,`سيتم توجيهك لإكمال الدفع عبر ${METHOD_CFG[method].labelAr}.`)}
              </div>
            )}

            {/* Auto-renew toggle */}
            <div className="flex items-center justify-between rounded-xl bg-[#F8FAFC] border border-[#F1F5F9] px-4 py-3">
              <div>
                <p className="text-xs font-bold text-[#1e293b]">{t("Auto Renew","تجديد تلقائي")}</p>
                <p className="text-[10px] text-[#94a3b8]">{t("Cancel anytime","إلغاء في أي وقت")}</p>
              </div>
              <div className="w-10 h-5.5 rounded-full bg-[#107789] relative cursor-pointer flex items-center px-0.5"
                style={{height:22}}>
                <div className="w-4 h-4 rounded-full bg-white shadow ms-auto"/>
              </div>
            </div>

            {/* Terms checkbox */}
            <label className="flex items-start gap-2.5 cursor-pointer" style={{flexDirection:isRTL?"row-reverse":"row"}}>
              <input type="checkbox" checked={agree} onChange={e=>setAgree(e.target.checked)}
                style={{marginTop:2,accentColor:"#107789",flexShrink:0}}/>
              <span className="text-[11px] text-[#64748b] leading-relaxed">
                {t("I agree to the Terms of Service and authorize this charge.","أوافق على شروط الخدمة وأُجيز هذه الرسوم.")}
              </span>
            </label>
            {errors.agree&&<p className="text-[11px] text-[#ef4444]">{errors.agree}</p>}

            {/* Pay button */}
            <button onClick={handlePay} disabled={loading}
              className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl text-sm font-bold text-white hover:opacity-90 active:scale-[.98] transition-all"
              style={{backgroundColor:loading?"#5FA8B3":pkg.color}}>
              {loading?(
                <><svg className="animate-spin" width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="white" strokeWidth="2" strokeOpacity="0.3"/><path d="M7 1.5a5.5 5.5 0 015.5 5.5" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>{t("Processing…","جارٍ المعالجة…")}</>
              ):(
                <>{I.lock}&nbsp;{t(`Pay ${pkg.currency}${pkg.price}`,`ادفع ${pkg.currency}${pkg.price}`)}{I.arrow}</>
              )}
            </button>
          </div>
        </div>
      </div>
    </Backdrop>
  );
}

// ─── Invoice Modal ────────────────────────────────────────────
function InvoiceModal({pay,lang,t,isRTL,onClose}:{pay:PaymentRecord;lang:string;t:(a:string,b:string)=>string;isRTL:boolean;onClose:()=>void}){
  const sc=PAY_STATUS_CFG[pay.status];
  return(
    <Backdrop onClose={onClose}>
      <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-sm overflow-hidden"
        dir={isRTL?"rtl":"ltr"}>
        <div className="h-1.5" style={{background:"linear-gradient(90deg,#107789,#E8763A)"}}/>
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#F1F5F9]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#EBF5F7] text-[#107789] flex items-center justify-center">{I.invoice}</div>
            <div>
              <h2 className="text-sm font-bold text-[#1e293b]">{t("Invoice","الفاتورة")}</h2>
              <p className="text-xs text-[#94a3b8] font-mono">{pay.invoice}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-xl bg-[#F5F7F9] text-[#94a3b8] hover:text-[#1e293b] hover:bg-[#E2E8F0] transition-all">{I.close}</button>
        </div>
        <div className="p-5 space-y-4">
          {/* Amount hero */}
          <div className="rounded-2xl text-center py-6" style={{backgroundColor:sc.bg}}>
            <p className="text-4xl font-black" style={{color:sc.text}}>
              {pay.amount===0?t("Free","مجاني"):`${pay.currency}${pay.amount}`}
            </p>
            <span className="inline-flex items-center gap-1.5 mt-2 text-xs font-bold px-3 py-1 rounded-full"
              style={{backgroundColor:"white",color:sc.text}}>
              <span className="w-1.5 h-1.5 rounded-full" style={{backgroundColor:sc.dot}}/>
              {lang==="ar"?sc.ar:sc.en}
            </span>
          </div>

          {/* Details */}
          <div className="space-y-0 rounded-xl border border-[#F1F5F9] overflow-hidden">
            {[
              {lbl:t("Package","الباقة"),     val:lang==="ar"?pay.packageAr:pay.packageEn},
              {lbl:t("Date","التاريخ"),       val:pay.date},
              {lbl:t("Method","الطريقة"),     val:lang==="ar"?METHOD_CFG[pay.method].labelAr:METHOD_CFG[pay.method].labelEn},
              {lbl:t("Sessions","الجلسات"),  val:`${pay.sessions}`},
            ].map((r,i,arr)=>(
              <div key={r.lbl} className={`flex items-center justify-between px-4 py-3 ${i<arr.length-1?"border-b border-[#F1F5F9]":""}`}>
                <span className="text-xs text-[#94a3b8]">{r.lbl}</span>
                <span className="text-xs font-bold text-[#1e293b]">{r.val}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex gap-3 px-5 pb-5">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-semibold border border-[#F1F5F9] text-[#64748b] hover:bg-[#F5F7F9] active:scale-95 transition-all">{t("Close","إغلاق")}</button>
          <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90 active:scale-95 transition-all" style={{backgroundColor:"#107789"}}>
            {I.download}{t("Download","تنزيل")}
          </button>
        </div>
      </div>
    </Backdrop>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────
export default function PaymentsPage(){
  const {lang,isRTL,t} = useLanguage();

  const [buyPkg,    setBuyPkg]    = useState<Package|null>(null);
  const [viewInv,   setViewInv]   = useState<PaymentRecord|null>(null);
  const [autoRenew, setAutoRenew] = useState(CURRENT_SUB.autoRenew);
  const [toast,     setToast]     = useState<string|null>(null);
  const [activeTab, setActiveTab] = useState<"packages"|"history">("packages");

  const fire=(msg:string)=>{ setToast(msg); setTimeout(()=>setToast(null),3500); };

  const usedPct = Math.round((CURRENT_SUB.sessionsUsed/CURRENT_SUB.sessionsTotal)*100);
  const daysLeft = 12;

  const stats = [
    {icon:I.sessions, value:`${CURRENT_SUB.sessionsUsed}/${CURRENT_SUB.sessionsTotal}`, label:t("Sessions Used","الجلسات المستخدمة"), color:"#107789", bg:"#EBF5F7", delay:0    },
    {icon:I.calendar, value:`${daysLeft}`,                                               label:t("Days Remaining","الأيام المتبقية"),   color:"#7c3aed", bg:"#ede9fe", delay:0.07 },
    {icon:I.wallet,   value:`$${CURRENT_SUB.price}`,                                     label:t("Monthly Plan","الباقة الشهرية"),      color:"#059669", bg:"#d1fae5", delay:0.14 },
    {icon:I.invoice,  value:`${PAYMENT_HISTORY.filter(p=>p.status==="paid").length}`,    label:t("Total Payments","إجمالي المدفوعات"),  color:"#d97706", bg:"#fef3c7", delay:0.21 },
  ];

  return(
    <>
      <style>{`
        @keyframes cardIn  { from{opacity:0;transform:translateY(14px) scale(.97)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes slideUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes modalIn { from{opacity:0;transform:scale(.93) translateY(10px)} to{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
        @keyframes blink   { 0%,100%{opacity:1} 50%{opacity:.5} }
      `}</style>

      <main className="flex-1 min-h-screen overflow-auto p-4 sm:p-6 space-y-5 sm:space-y-6"
        style={{backgroundColor:"#F5F7F9"}} dir={isRTL?"rtl":"ltr"}>

        {/* ── Header ── */}
        <div style={{animation:"fadeIn .4s ease both"}}>
          <h1 className="text-xl sm:text-2xl font-black text-[#1e293b] tracking-tight">{t("Packages & Payments","الباقات والمدفوعات")}</h1>
          <p className="mt-1 text-xs sm:text-sm text-[#94a3b8]">{t("Manage your subscription and billing history","إدارة اشتراكك وسجل الفواتير")}</p>
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {stats.map(s=>(
            <div key={s.label} className="rounded-2xl bg-white border border-[#F1F5F9] shadow-sm p-4 sm:p-5 flex items-start gap-3 hover:shadow-md hover:border-[#b2dce4] transition-all duration-300"
              style={{animation:`cardIn .45s ${s.delay}s cubic-bezier(.34,1.2,.64,1) both`}}>
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{backgroundColor:s.bg}}>
                <span style={{color:s.color}}>{s.icon}</span>
              </div>
              <div className="min-w-0">
                <p className="text-xl sm:text-2xl font-black text-[#1e293b] leading-none">{s.value}</p>
                <p className="text-xs text-[#94a3b8] mt-1 font-medium leading-tight">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Current Subscription Hero ── */}
        <div className="rounded-2xl overflow-hidden shadow-sm" style={{background:"linear-gradient(135deg,#0B2C33 0%,#107789 60%,#0d8a9e 100%)",animation:"cardIn .45s .22s both"}}>
          <div className="relative p-5 sm:p-6">
            <div className="absolute -top-8 -end-8 w-48 h-48 rounded-full opacity-10 bg-white pointer-events-none"/>
            <div className="absolute -bottom-10 -start-10 w-56 h-56 rounded-full opacity-5 bg-white pointer-events-none"/>

            <div className="relative flex flex-wrap items-start justify-between gap-5">
              {/* Left info */}
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-1">{t("Current Subscription","الاشتراك الحالي")}</p>
                <h2 className="text-2xl sm:text-3xl font-black text-white mb-1">
                  {lang==="ar"?CURRENT_SUB.nameAr:CURRENT_SUB.nameEn}
                </h2>
                <p className="text-sm text-white/60">
                  {t("Renews on","يتجدد في")} <span className="font-bold text-white">{CURRENT_SUB.expiryDate}</span>
                </p>

                {/* Session progress */}
                <div className="mt-5 space-y-2 max-w-sm">
                  <div className="flex justify-between text-xs text-white/60">
                    <span>{t("Sessions","الجلسات")}</span>
                    <span><strong className="text-white">{CURRENT_SUB.sessionsUsed}</strong>/{CURRENT_SUB.sessionsTotal} {t("used","مستخدمة")}</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{width:`${usedPct}%`,background:"linear-gradient(90deg,#E8763A,#f59e0b)"}}/>
                  </div>
                  <p className="text-[10px] text-white/40">
                    {CURRENT_SUB.sessionsTotal-CURRENT_SUB.sessionsUsed} {t("sessions remaining","جلسة متبقية")} · {daysLeft} {t("days left","يوم متبقي")}
                  </p>
                </div>
              </div>

              {/* Right: auto-renew + upgrade */}
              <div className="flex flex-col items-end gap-3 flex-shrink-0">
                {/* Auto-renew toggle */}
                <div className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3" style={{backdropFilter:"blur(8px)"}}>
                  <div className="text-end">
                    <p className="text-xs font-bold text-white">{t("Auto Renew","تجديد تلقائي")}</p>
                    <p className="text-[10px] text-white/50">{autoRenew?t("On","مفعّل"):t("Off","متوقف")}</p>
                  </div>
                  <button onClick={()=>setAutoRenew(p=>!p)}
                    className="relative w-12 h-6 rounded-full transition-all duration-300 flex-shrink-0"
                    style={{backgroundColor:autoRenew?"#22c55e":"rgba(255,255,255,0.2)"}}>
                    <div className="absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-300"
                      style={{[isRTL?"right":"left"]:autoRenew?"26px":"4px"}}/>
                  </button>
                </div>
                {/* Upgrade button */}
                <button onClick={()=>{const p=PACKAGES.find(p=>!p.current&&p.id==="premium");if(p)setBuyPkg(p);}}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-white hover:bg-white/90 active:scale-[.98] transition-all"
                  style={{color:"#107789"}}>
                  {t("Upgrade Plan","ترقية الباقة")}{I.arrow}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="flex items-center gap-2 flex-wrap" style={{animation:"cardIn .4s .3s both"}}>
          {([["packages",t("Available Packages","الباقات المتاحة")],["history",t("Payment History","سجل المدفوعات")]] as const).map(([key,lbl])=>(
            <button key={key} onClick={()=>setActiveTab(key)}
              className="px-4 py-2 rounded-xl text-sm font-semibold transition-all active:scale-95"
              style={activeTab===key
                ?{backgroundColor:"#107789",color:"white",boxShadow:"0 2px 8px #10778940"}
                :{backgroundColor:"white",color:"#64748b",border:"1px solid #F1F5F9"}}>
              {lbl}
            </button>
          ))}
        </div>

        {/* ── Packages Tab ── */}
        {activeTab==="packages"&&(
          <>
            <p className="text-xs text-[#94a3b8] font-medium" style={{animation:"fadeIn .4s both"}}>
              {t("All prices are monthly. Cancel or change your plan anytime.","جميع الأسعار شهرية. يمكنك الإلغاء أو التغيير في أي وقت.")}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {PACKAGES.map((pkg,i)=>(
                <PackageCard key={pkg.id} pkg={pkg} idx={i} lang={lang} t={t}
                  onBuy={p=>setBuyPkg(p)}/>
              ))}
            </div>

            {/* Compare note */}
            <div className="rounded-2xl bg-white border border-[#F1F5F9] p-5 flex flex-wrap items-center gap-4"
              style={{animation:"cardIn .4s .45s both"}}>
              <div className="w-10 h-10 rounded-xl bg-[#EBF5F7] flex items-center justify-center text-[#107789] flex-shrink-0">{I.info}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-[#1e293b]">{t("Need help choosing a plan?","تحتاج مساعدة في اختيار الباقة؟")}</p>
                <p className="text-xs text-[#94a3b8] mt-0.5">{t("Our team is available to guide you to the right plan for your goals.","فريقنا متاح لمساعدتك في اختيار الباقة المناسبة لأهدافك.")}</p>
              </div>
              <button className="px-4 py-2.5 rounded-xl text-sm font-semibold border border-[#107789]/30 text-[#107789] hover:bg-[#EBF5F7] active:scale-95 transition-all flex-shrink-0">
                {t("Contact Us","تواصل معنا")}
              </button>
            </div>
          </>
        )}

        {/* ── Payment History Tab ── */}
        {activeTab==="history"&&(
          <div className="rounded-2xl bg-white border border-[#F1F5F9] shadow-sm overflow-hidden"
            style={{animation:"cardIn .4s .32s cubic-bezier(.34,1.2,.64,1) both"}}>
            <div className="px-5 py-4 border-b border-[#F1F5F9]">
              <h2 className="text-sm font-bold text-[#1e293b]">{t("Payment History","سجل المدفوعات")}</h2>
              <p className="text-xs text-[#94a3b8] mt-0.5">{PAYMENT_HISTORY.length} {t("transactions","معاملة")}</p>
            </div>

            {/* Mobile: card list */}
            <div className="sm:hidden divide-y divide-[#F8FAFC]">
              {PAYMENT_HISTORY.map((pay,i)=>{
                const sc=PAY_STATUS_CFG[pay.status];
                const mc=METHOD_CFG[pay.method];
                return(
                  <div key={pay.id} className="flex items-center gap-3 px-4 py-4 hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                    style={{animation:`slideUp .3s ${0.35+i*0.05}s ease both`}}
                    onClick={()=>setViewInv(pay)}>
                    <div className="w-10 h-10 rounded-xl bg-[#EBF5F7] flex items-center justify-center text-[#107789] flex-shrink-0">{I.invoice}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-[#1e293b] truncate">{lang==="ar"?pay.packageAr:pay.packageEn}</p>
                      <p className="text-[10px] text-[#94a3b8] mt-0.5">{pay.date} · {lang==="ar"?mc.labelAr:mc.labelEn}</p>
                    </div>
                    <div className="text-end flex-shrink-0">
                      <p className="text-sm font-black text-[#1e293b]">{pay.amount===0?t("Free","مجاني"):`$${pay.amount}`}</p>
                      <span className="text-[10px] font-bold" style={{color:sc.text}}>{lang==="ar"?sc.ar:sc.en}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop: full table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm" style={{borderCollapse:"collapse"}}>
                <thead>
                  <tr style={{backgroundColor:"#F8FAFC"}}>
                    {[t("Invoice","الفاتورة"),t("Package","الباقة"),t("Date","التاريخ"),t("Method","الطريقة"),t("Sessions","الجلسات"),t("Amount","المبلغ"),t("Status","الحالة"),t("Action","إجراء")].map(h=>(
                      <th key={h} className="px-4 py-3 text-start text-xs font-semibold uppercase tracking-wide text-[#94a3b8] whitespace-nowrap border-b border-[#F1F5F9]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {PAYMENT_HISTORY.map((pay,i)=>{
                    const sc=PAY_STATUS_CFG[pay.status];
                    const mc=METHOD_CFG[pay.method];
                    return(
                      <tr key={pay.id} className="hover:bg-[#F8FAFC] transition-colors border-b border-[#F1F5F9] last:border-0"
                        style={{animation:`slideUp .3s ${0.38+i*0.05}s ease both`}}>
                        <td className="px-4 py-3.5">
                          <span className="font-mono text-xs text-[#94a3b8] bg-[#F8FAFC] border border-[#F1F5F9] px-2 py-0.5 rounded-lg">{pay.invoice}</span>
                        </td>
                        <td className="px-4 py-3.5 font-semibold text-[#1e293b] whitespace-nowrap">{lang==="ar"?pay.packageAr:pay.packageEn}</td>
                        <td className="px-4 py-3.5 text-xs text-[#94a3b8] whitespace-nowrap">{pay.date}</td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-1.5 text-xs text-[#64748b]">
                            <span>{mc.icon}</span>{lang==="ar"?mc.labelAr:mc.labelEn}
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-sm font-bold text-[#1e293b]">{pay.sessions}</td>
                        <td className="px-4 py-3.5">
                          <span className="text-base font-black text-[#1e293b]">
                            {pay.amount===0?<span className="text-sm text-[#059669] font-bold">{t("Free","مجاني")}</span>:`$${pay.amount}`}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold whitespace-nowrap"
                            style={{backgroundColor:sc.bg,color:sc.text,border:`1px solid ${sc.border}`}}>
                            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{backgroundColor:sc.dot}}/>
                            {lang==="ar"?sc.ar:sc.en}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <button onClick={()=>setViewInv(pay)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border border-[#E2E8F0] text-[#107789] hover:bg-[#EBF5F7] active:scale-95 transition-all whitespace-nowrap">
                            {I.invoice}{t("Invoice","الفاتورة")}
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
              <p className="text-xs text-[#94a3b8]">{t("Showing all transactions","عرض جميع المعاملات")}</p>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#64748b] font-medium">{t("Total paid:","إجمالي المدفوع:")}</span>
                <span className="text-base font-black text-[#107789]">${PAYMENT_HISTORY.filter(p=>p.status==="paid"&&p.amount>0).reduce((a,p)=>a+p.amount,0)}</span>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Modals */}
      {buyPkg&&(
        <BuyModal pkg={buyPkg} lang={lang} t={t} isRTL={isRTL}
          onClose={()=>setBuyPkg(null)}
          onConfirm={()=>{setBuyPkg(null);fire(t("Payment successful! Your new package is now active.","تمت عملية الدفع! باقتك الجديدة نشطة الآن."));}}/>
      )}
      {viewInv&&<InvoiceModal pay={viewInv} lang={lang} t={t} isRTL={isRTL} onClose={()=>setViewInv(null)}/>}
      {toast&&<Toast msg={toast} onClose={()=>setToast(null)}/>}
    </>
  );
}