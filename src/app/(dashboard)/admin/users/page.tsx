"use client";

import { useState } from "react";
import { useLanguage } from "@/src/contexts/LanguageContext";

// ─── Types ────────────────────────────────────────────────────
type Role   = "Student" | "Teacher" | "Sales" | "Admin";
type Status = "Active"  | "Inactive";

interface User {
  id:       string;
  name:     string;
  email:    string;
  role:     Role;
  status:   Status;
  joinedAt: string;
  avatar:   string;
}

interface UserForm {
  name:            string;
  email:           string;
  role:            Role | "";
  password:        string;
  confirmPassword: string;
}

// ─── Static config ────────────────────────────────────────────
const ROLES: Role[] = ["Student", "Teacher", "Sales", "Admin"];

const ROLE_CFG: Record<Role, { bg:string; text:string; border:string; dot:string; ar:string }> = {
  Student: { bg:"#EBF5F7", text:"#107789", border:"#b2dce4", dot:"#107789", ar:"طالب"    },
  Teacher: { bg:"#ede9fe", text:"#7c3aed", border:"#c4b5fd", dot:"#7c3aed", ar:"معلم"    },
  Sales:   { bg:"#fef3c7", text:"#d97706", border:"#fde68a", dot:"#d97706", ar:"مبيعات"  },
  Admin:   { bg:"#fee2e2", text:"#dc2626", border:"#fca5a5", dot:"#dc2626", ar:"مدير"    },
};

const STATUS_CFG: Record<Status, { bg:string; text:string; border:string; ar:string }> = {
  Active:   { bg:"#dcfce7", text:"#15803d", border:"#bbf7d0", ar:"نشط"       },
  Inactive: { bg:"#f3f4f6", text:"#6b7280", border:"#e5e7eb", ar:"غير نشط"   },
};

const AVT_COLORS: Record<string,string> = {
  S:"#107789", A:"#7c3aed", L:"#059669", O:"#d97706",
  N:"#ef4444", T:"#0891b2", R:"#db2777", K:"#1d4ed8",
};
const avtBg = (ch:string) => AVT_COLORS[ch?.toUpperCase()] ?? "#107789";

const genId  = () => `USR-${String(Math.floor(Math.random()*900)+100)}`;
const today  = () => new Date().toLocaleDateString("en-US",{ month:"short", day:"numeric", year:"numeric" });

// ─── Icons ────────────────────────────────────────────────────
const IC = {
  plus:   <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  search: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  close:  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  ok:     <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>,
  eye:    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  eyeOff: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>,
  edit:   <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  trash:  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>,
  toggle: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="1" y="5" width="22" height="14" rx="7"/><circle cx="16" cy="12" r="3" fill="currentColor"/></svg>,
  user:   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  users:  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  info:   <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  save:   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>,
  filter: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
};

// ─── Small reusable components ────────────────────────────────
function Av({ ch, size="md" }:{ ch:string; size?:"sm"|"md"|"lg" }){
  const s = { sm:"w-7 h-7 text-[10px]", md:"w-9 h-9 text-xs", lg:"w-11 h-11 text-sm" }[size];
  return (
    <div className={`${s} rounded-full flex items-center justify-center font-bold text-white flex-shrink-0 select-none`}
      style={{backgroundColor:avtBg(ch)}}>
      {ch?.toUpperCase()}
    </div>
  );
}

function RolePill({ role,lang }:{ role:Role; lang:string }){
  const c = ROLE_CFG[role];
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold whitespace-nowrap"
      style={{backgroundColor:c.bg,color:c.text,border:`1px solid ${c.border}`}}>
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{backgroundColor:c.dot}}/>
      {lang==="ar"?c.ar:role}
    </span>
  );
}

function StatusPill({ status,lang }:{ status:Status; lang:string }){
  const c = STATUS_CFG[status];
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold whitespace-nowrap"
      style={{backgroundColor:c.bg,color:c.text,border:`1px solid ${c.border}`}}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${status==="Active"?"animate-pulse":""}`}
        style={{backgroundColor:c.text}}/>
      {lang==="ar"?c.ar:status}
    </span>
  );
}

function StatCard({ icon,value,label,color,bg,delay=0 }:{
  icon:React.ReactNode; value:number|string; label:string; color:string; bg:string; delay?:number;
}){
  return (
    <div className="rounded-2xl bg-white border border-[#F1F5F9] shadow-sm p-4 sm:p-5 flex items-start gap-3 sm:gap-4
                    hover:shadow-md hover:border-[#b2dce4] transition-all duration-300"
      style={{animation:`cardIn .45s ${delay}s cubic-bezier(.34,1.2,.64,1) both`}}>
      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{backgroundColor:bg}}>
        <span style={{color}}>{icon}</span>
      </div>
      <div className="min-w-0">
        <p className="text-xl sm:text-2xl font-black text-[#1e293b] leading-none">{value}</p>
        <p className="text-xs text-[#94a3b8] mt-1 font-medium leading-tight">{label}</p>
      </div>
    </div>
  );
}

// ─── Backdrop ─────────────────────────────────────────────────
function Backdrop({ onClose,children }:{ onClose:()=>void; children:React.ReactNode }){
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
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
function Toast({ msg,type="success",onClose }:{ msg:string; type?:"success"|"error"|"info"; onClose:()=>void }){
  const C = {
    success:{ bg:"#f0fdf4", br:"#bbf7d0", tx:"#15803d" },
    info:   { bg:"#eff6ff", br:"#bfdbfe", tx:"#1d4ed8" },
    error:  { bg:"#fef2f2", br:"#fecaca", tx:"#dc2626" },
  };
  const c = C[type];
  return (
    <div className="fixed bottom-4 end-4 z-[60] flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl text-sm font-semibold max-w-[calc(100vw-2rem)]"
      style={{backgroundColor:c.bg,border:`1px solid ${c.br}`,color:c.tx,animation:"slideUp .3s cubic-bezier(.34,1.56,.64,1) both"}}>
      <span className="flex-shrink-0">{type==="success"?IC.ok:IC.info}</span>
      <span className="flex-1 min-w-0 truncate">{msg}</span>
      <button onClick={onClose} className="opacity-50 hover:opacity-100 flex-shrink-0 transition-opacity">{IC.close}</button>
    </div>
  );
}

// ─── Field + input helpers ────────────────────────────────────
function Field({ label,error,children }:{ label:string; error?:string; children:React.ReactNode }){
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-[#0B2C33]">{label}</label>
      {children}
      {error && <p className="text-[11px] font-medium text-[#dc2626] flex items-center gap-1">{IC.info}{error}</p>}
    </div>
  );
}
const inp = (err?:string) =>
  `w-full px-3 py-2.5 text-sm rounded-xl bg-white text-[#0B2C33] placeholder:text-[#9CA3AF]
   focus:outline-none focus:ring-1 transition-all border ${
   err ? "border-[#fca5a5] focus:border-[#dc2626] focus:ring-[#dc2626]/20"
       : "border-[#E5E7EB] focus:border-[#107789]/50 focus:ring-[#107789]/20"}`;

// ─── Password strength ────────────────────────────────────────
function PwStrength({ pw, lang }:{ pw:string; lang:string }){
  if(!pw) return null;
  const level = pw.length<6 ? 0 : pw.length<10 ? 1 : 2;
  const colors = ["#ef4444","#f97316","#22c55e"];
  const labels = {
    en:["Weak","Medium","Strong"],
    ar:["ضعيفة","متوسطة","قوية"],
  };
  return (
    <div className="mt-2 space-y-1">
      <div className="flex gap-1">
        {[0,1,2].map(i=>(
          <div key={i} className="h-1 flex-1 rounded-full transition-all duration-500"
            style={{backgroundColor:i<=level?colors[level]:"#E5E7EB"}}/>
        ))}
      </div>
      <p className="text-[11px] font-medium" style={{color:colors[level]}}>
        {lang==="ar"?labels.ar[level]:labels.en[level]}
      </p>
    </div>
  );
}

// ─── Role selector ────────────────────────────────────────────
function RoleSelector({ value,onChange,lang }:{ value:Role|""; onChange:(r:Role)=>void; lang:string }){
  return (
    <div className="grid grid-cols-2 gap-2">
      {ROLES.map(r=>(
        <button key={r} type="button" onClick={()=>onChange(r)}
          className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all active:scale-[.98]
                      ${value===r
                        ? "border-[#107789]/60 bg-[#EBF5F7] text-[#107789]"
                        : "border-[#E5E7EB] text-[#4B5563] hover:border-[#107789]/30 hover:bg-[#F5F7F9]"}`}>
          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{backgroundColor:ROLE_CFG[r].dot}}/>
          <span className="truncate">{lang==="ar"?ROLE_CFG[r].ar:r}</span>
          {value===r&&<span className="ms-auto text-[#107789] flex-shrink-0">{IC.ok}</span>}
        </button>
      ))}
    </div>
  );
}

// ─── Password field with toggle ───────────────────────────────
function PwField({ label,value,onChange,error,show,onToggle,placeholder }:{
  label:string; value:string; onChange:(v:string)=>void; error?:string;
  show:boolean; onToggle:()=>void; placeholder:string;
}){
  return (
    <Field label={label} error={error}>
      <div className="relative">
        <input type={show?"text":"password"} value={value} onChange={e=>onChange(e.target.value)}
          placeholder={placeholder} className={`${inp(error)} pe-10`}/>
        <button type="button" onClick={onToggle}
          className="absolute end-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280] transition-colors">
          {show ? IC.eyeOff : IC.eye}
        </button>
      </div>
    </Field>
  );
}

// ─── ADD USER MODAL ───────────────────────────────────────────
function AddModal({ lang,onClose,onSave }:{ lang:string; onClose:()=>void; onSave:(u:User)=>void }){
  const t = (en:string,ar:string) => lang==="ar"?ar:en;
  const [form, setForm]       = useState<UserForm>({ name:"", email:"", role:"", password:"", confirmPassword:"" });
  const [errors, setErrors]   = useState<Partial<Record<keyof UserForm,string>>>({});
  const [showPw, setShowPw]   = useState(false);
  const [showCf, setShowCf]   = useState(false);

  const validate = () => {
    const e: typeof errors = {};
    if(!form.name.trim())    e.name  = t("Full name is required.","الاسم مطلوب.");
    if(!form.email.trim())   e.email = t("Email is required.","البريد مطلوب.");
    else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = t("Invalid email.","بريد غير صحيح.");
    if(!form.role)           e.role  = t("Select a role.","اختر دورًا.");
    if(!form.password)       e.password = t("Password required.","كلمة المرور مطلوبة.");
    else if(form.password.length<6) e.password = t("Min 6 chars.","6 أحرف على الأقل.");
    if(form.password!==form.confirmPassword) e.confirmPassword = t("Passwords don't match.","غير متطابقتان.");
    setErrors(e);
    return Object.keys(e).length===0;
  };

  const save = () => {
    if(!validate()) return;
    const ch = form.name.trim()[0].toUpperCase();
    onSave({ id:genId(), name:form.name.trim(), email:form.email.trim().toLowerCase(),
              role:form.role as Role, status:"Active", joinedAt:today(), avatar:ch });
  };

  return (
    <Backdrop onClose={onClose}>
      <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-lg overflow-hidden"
        dir={lang==="ar"?"rtl":"ltr"} style={{maxHeight:"92vh",overflowY:"auto"}}>
        <div className="h-1" style={{background:"linear-gradient(90deg,#107789,#E8763A)"}}/>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#F1F5F9]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#EBF5F7] flex items-center justify-center text-[#107789]">{IC.user}</div>
            <div>
              <h2 className="text-sm font-bold text-[#0B2C33]">{t("Add New User","إضافة مستخدم جديد")}</h2>
              <p className="text-xs text-[#94a3b8] mt-0.5">{t("Fill in details to create account","أدخل التفاصيل لإنشاء حساب")}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-xl bg-[#F5F7F9] text-[#94a3b8] hover:text-[#1e293b] hover:bg-[#E2E8F0] transition-all">{IC.close}</button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label={`${t("Full Name","الاسم الكامل")} *`} error={errors.name}>
              <input type="text" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}
                placeholder={t("e.g. Sara Al-Rashid","مثال: سارة الراشد")} className={inp(errors.name)}/>
            </Field>
            <Field label={`${t("Email Address","البريد الإلكتروني")} *`} error={errors.email}>
              <input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}
                placeholder="sara@evothink.com" className={inp(errors.email)}/>
            </Field>
          </div>

          <Field label={`${t("System Role","الدور في النظام")} *`} error={errors.role}>
            <RoleSelector value={form.role} onChange={r=>setForm({...form,role:r})} lang={lang}/>
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <PwField label={`${t("Password","كلمة المرور")} *`} value={form.password}
                onChange={v=>setForm({...form,password:v})} error={errors.password}
                show={showPw} onToggle={()=>setShowPw(p=>!p)}
                placeholder={t("Min 6 characters","6 أحرف على الأقل")}/>
              <PwStrength pw={form.password} lang={lang}/>
            </div>
            <div>
              <PwField label={`${t("Confirm Password","تأكيد كلمة المرور")} *`} value={form.confirmPassword}
                onChange={v=>setForm({...form,confirmPassword:v})} error={errors.confirmPassword}
                show={showCf} onToggle={()=>setShowCf(p=>!p)}
                placeholder={t("Re-enter password","أعد إدخال كلمة المرور")}/>
              {form.confirmPassword&&(
                <p className={`mt-2 text-[11px] font-medium flex items-center gap-1 ${form.password===form.confirmPassword?"text-[#15803d]":"text-[#dc2626]"}`}>
                  {form.password===form.confirmPassword?IC.ok:IC.close}
                  {form.password===form.confirmPassword?t("Passwords match","متطابقتان"):t("Don't match","غير متطابقتان")}
                </p>
              )}
            </div>
          </div>

          {/* Info note */}
          <div className="flex items-start gap-2 rounded-xl border border-[#a5d8e0] bg-[#EBF5F7] px-3.5 py-3">
            <span className="mt-0.5 flex-shrink-0 text-[#107789]">{IC.info}</span>
            <p className="text-xs text-[#107789]">{t("New user will be set as Active by default.","سيُعيَّن المستخدم الجديد كنشط افتراضيًا.")}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-[#F1F5F9] bg-[#FAFBFC]">
          <button onClick={onClose} className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-[#F5F7F9] text-[#6B7280] hover:bg-[#E5E7EB] active:scale-95 transition-all">
            {t("Cancel","إلغاء")}
          </button>
          <button onClick={save}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white hover:opacity-90 active:scale-95 transition-all"
            style={{backgroundColor:"#107789"}}>
            {IC.user}{t("Create User","إنشاء المستخدم")}
          </button>
        </div>
      </div>
    </Backdrop>
  );
}

// ─── EDIT USER MODAL ──────────────────────────────────────────
function EditModal({ user,lang,onClose,onSave }:{ user:User; lang:string; onClose:()=>void; onSave:(u:User)=>void }){
  const t = (en:string,ar:string) => lang==="ar"?ar:en;
  const [form,setForm] = useState({ name:user.name, email:user.email, role:user.role as Role|"", status:user.status });
  const [errors,setErrors] = useState<Partial<Record<"name"|"email"|"role",string>>>({});

  const validate = () => {
    const e:typeof errors = {};
    if(!form.name.trim())  e.name  = t("Full name required.","الاسم مطلوب.");
    if(!form.email.trim()) e.email = t("Email required.","البريد مطلوب.");
    else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = t("Invalid email.","بريد غير صحيح.");
    if(!form.role)         e.role  = t("Select a role.","اختر دورًا.");
    setErrors(e); return Object.keys(e).length===0;
  };

  const save = () => {
    if(!validate()) return;
    onSave({...user, name:form.name.trim(), email:form.email.trim().toLowerCase(),
             role:form.role as Role, status:form.status, avatar:form.name.trim()[0].toUpperCase()});
  };

  return (
    <Backdrop onClose={onClose}>
      <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-lg overflow-hidden"
        dir={lang==="ar"?"rtl":"ltr"} style={{maxHeight:"92vh",overflowY:"auto"}}>
        <div className="h-1" style={{background:`linear-gradient(90deg,${ROLE_CFG[user.role].dot},transparent)`}}/>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#F1F5F9]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#EBF5F7] flex items-center justify-center text-[#107789]">{IC.edit}</div>
            <div>
              <h2 className="text-sm font-bold text-[#0B2C33]">{t("Edit User","تعديل المستخدم")}</h2>
              <p className="text-xs text-[#94a3b8] mt-0.5 truncate max-w-[180px]">{user.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-xl bg-[#F5F7F9] text-[#94a3b8] hover:text-[#1e293b] hover:bg-[#E2E8F0] transition-all">{IC.close}</button>
        </div>

        <div className="p-5 space-y-4">
          {/* User preview */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-[#F8FAFC] border border-[#F1F5F9]">
            <Av ch={form.name[0]} size="md"/>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-[#0B2C33] truncate">{form.name||"—"}</p>
              <p className="text-xs text-[#94a3b8] font-mono">{user.id}</p>
            </div>
            <StatusPill status={form.status} lang={lang}/>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label={`${t("Full Name","الاسم الكامل")} *`} error={errors.name}>
              <input type="text" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className={inp(errors.name)}/>
            </Field>
            <Field label={`${t("Email","البريد")} *`} error={errors.email}>
              <input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} className={inp(errors.email)}/>
            </Field>
          </div>

          <Field label={`${t("Role","الدور")} *`} error={errors.role}>
            <RoleSelector value={form.role} onChange={r=>setForm({...form,role:r})} lang={lang}/>
          </Field>

          <Field label={t("Account Status","حالة الحساب")}>
            <div className="flex gap-2">
              {(["Active","Inactive"] as Status[]).map(s=>(
                <button key={s} type="button" onClick={()=>setForm({...form,status:s})}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all active:scale-[.98]
                              ${form.status===s
                                ? s==="Active"
                                  ? "border-[#bbf7d0] bg-[#dcfce7] text-[#15803d]"
                                  : "border-[#E5E7EB] bg-[#f3f4f6] text-[#6b7280]"
                                : "border-[#E5E7EB] bg-white text-[#9CA3AF] hover:bg-[#F5F7F9]"}`}>
                  {lang==="ar"?STATUS_CFG[s].ar:s}
                </button>
              ))}
            </div>
          </Field>
        </div>

        <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-[#F1F5F9] bg-[#FAFBFC]">
          <button onClick={onClose} className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-[#F5F7F9] text-[#6B7280] hover:bg-[#E5E7EB] active:scale-95 transition-all">
            {t("Cancel","إلغاء")}
          </button>
          <button onClick={save}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white hover:opacity-90 active:scale-95 transition-all"
            style={{backgroundColor:"#107789"}}>
            {IC.save}{t("Save Changes","حفظ التغييرات")}
          </button>
        </div>
      </div>
    </Backdrop>
  );
}

// ─── DELETE CONFIRM MODAL ─────────────────────────────────────
function DeleteModal({ user,lang,onClose,onConfirm }:{ user:User; lang:string; onClose:()=>void; onConfirm:()=>void }){
  const t = (en:string,ar:string) => lang==="ar"?ar:en;
  return (
    <Backdrop onClose={onClose}>
      <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-sm overflow-hidden"
        dir={lang==="ar"?"rtl":"ltr"}>
        <div className="p-5 space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#fee2e2] flex items-center justify-center text-[#dc2626] flex-shrink-0">{IC.trash}</div>
            <div>
              <h2 className="text-base font-bold text-[#1e293b]">{t("Delete User","حذف المستخدم")}</h2>
              <p className="text-sm text-[#64748b] mt-1">
                {t("This will permanently delete","سيتم حذف")} <strong>{user.name}</strong> {t("from the system.","من النظام نهائيًا.")}
                <br/><span className="text-xs text-[#dc2626] font-medium">{t("This cannot be undone.","لا يمكن التراجع.")}</span>
              </p>
            </div>
          </div>
        </div>
        <div className="flex gap-3 px-5 pb-5">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-semibold border border-[#F1F5F9] text-[#64748b] hover:bg-[#F5F7F9] active:scale-95 transition-all">{t("Cancel","إلغاء")}</button>
          <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white hover:opacity-90 active:scale-95 transition-all" style={{backgroundColor:"#dc2626"}}>{t("Yes, Delete","نعم، احذف")}</button>
        </div>
      </div>
    </Backdrop>
  );
}

// ─── PAGE ──────────────────────────────────────────────────────
const INITIAL_USERS: User[] = [
  { id:"USR-001", name:"Sara Al-Rashid",  email:"sara@evothink.com",   role:"Student", status:"Active",   joinedAt:"Jan 12, 2025", avatar:"S" },
  { id:"USR-002", name:"Ahmad Nasser",    email:"ahmad@evothink.com",  role:"Teacher", status:"Active",   joinedAt:"Feb 3, 2025",  avatar:"A" },
  { id:"USR-003", name:"Layla Hassan",    email:"layla@evothink.com",  role:"Teacher", status:"Active",   joinedAt:"Mar 7, 2025",  avatar:"L" },
  { id:"USR-004", name:"Omar Yousef",     email:"omar@evothink.com",   role:"Student", status:"Inactive", joinedAt:"Jan 20, 2025", avatar:"O" },
  { id:"USR-005", name:"Nour Khalil",     email:"nour@evothink.com",   role:"Sales",   status:"Active",   joinedAt:"Apr 1, 2025",  avatar:"N" },
  { id:"USR-006", name:"Tariq Ziad",      email:"tariq@evothink.com",  role:"Student", status:"Active",   joinedAt:"Feb 15, 2025", avatar:"T" },
  { id:"USR-007", name:"Reem Faris",      email:"reem@evothink.com",   role:"Sales",   status:"Inactive", joinedAt:"Mar 22, 2025", avatar:"R" },
  { id:"USR-008", name:"Khalid Samir",    email:"khalid@evothink.com", role:"Admin",   status:"Active",   joinedAt:"Jan 1, 2025",  avatar:"K" },
];

export default function UserManagementPage(){
  const { lang, isRTL, t } = useLanguage();

  const [users,        setUsers]       = useState<User[]>(INITIAL_USERS);
  const [search,       setSearch]      = useState("");
  const [roleFilter,   setRoleFilter]  = useState<Role|"All">("All");
  const [statFilter,   setStatFilter]  = useState<Status|"All">("All");
  const [addOpen,      setAddOpen]     = useState(false);
  const [editUser,     setEditUser]    = useState<User|null>(null);
  const [deleteUser,   setDeleteUser]  = useState<User|null>(null);
  const [toast,        setToast]       = useState<{msg:string;type:"success"|"error"|"info"}|null>(null);
  const [filterOpen,   setFilterOpen]  = useState(false);

  const fire = (msg:string, type:"success"|"error"|"info"="success") => {
    setToast({msg,type}); setTimeout(()=>setToast(null),4000);
  };

  const filtered = users.filter(u=>{
    const q = search.toLowerCase();
    const matchS = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    return matchS && (roleFilter==="All"||u.role===roleFilter) && (statFilter==="All"||u.status===statFilter);
  });

  const handleAdd = (u:User) => {
    setUsers(p=>[u,...p]); setAddOpen(false);
    fire(t(`"${u.name}" created successfully!`,`تم إنشاء "${u.name}" بنجاح!`));
  };
  const handleEdit = (u:User) => {
    setUsers(p=>p.map(x=>x.id===u.id?u:x)); setEditUser(null);
    fire(t(`"${u.name}" updated!`,`تم تحديث "${u.name}"!`));
  };
  const handleDelete = () => {
    if(!deleteUser) return;
    setUsers(p=>p.filter(u=>u.id!==deleteUser.id));
    fire(t(`"${deleteUser.name}" deleted.`,`تم حذف "${deleteUser.name}".`),"info");
    setDeleteUser(null);
  };
  const toggleStatus = (id:string) => {
    setUsers(p=>p.map(u=>u.id===id?{...u,status:u.status==="Active"?"Inactive":"Active"}:u));
  };

  const stats = [
    { icon:IC.users, value:users.length,                                        label:t("Total Users","إجمالي المستخدمين"),  color:"#107789", bg:"#EBF5F7", delay:0    },
    { icon:IC.user,  value:users.filter(u=>u.role==="Student").length,           label:t("Students","الطلاب"),               color:"#107789", bg:"#EBF5F7", delay:0.06 },
    { icon:IC.user,  value:users.filter(u=>u.role==="Teacher").length,           label:t("Teachers","المعلمون"),             color:"#7c3aed", bg:"#ede9fe", delay:0.12 },
    { icon:IC.ok,    value:users.filter(u=>u.status==="Active").length,          label:t("Active","النشطون"),               color:"#059669", bg:"#d1fae5", delay:0.18 },
  ];

  return (
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
            <h1 className="text-xl sm:text-2xl font-black text-[#0B2C33] tracking-tight">{t("User Management","إدارة المستخدمين")}</h1>
            <p className="mt-1 text-xs sm:text-sm text-[#94a3b8]">{t("Manage all system accounts and roles","إدارة جميع حسابات وأدوار النظام")}</p>
          </div>
          <button onClick={()=>setAddOpen(true)}
            className="flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-sm font-semibold text-white hover:opacity-90 active:scale-95 transition-all shadow-sm"
            style={{backgroundColor:"#107789",animation:"cardIn .4s .05s both"}}>
            {IC.plus}
            <span className="hidden xs:inline">{t("Add User","إضافة مستخدم")}</span>
            <span className="xs:hidden">{t("Add","إضافة")}</span>
          </button>
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {stats.map(s=><StatCard key={s.label} {...s}/>)}
        </div>

        {/* ── Filters ── */}
        <div className="rounded-2xl bg-white border border-[#F1F5F9] shadow-sm p-4 space-y-3"
          style={{animation:"cardIn .45s .2s cubic-bezier(.34,1.2,.64,1) both"}}>

          {/* Search + filter toggle */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <span className="absolute start-3 top-1/2 -translate-y-1/2 text-[#94a3b8]">{IC.search}</span>
              <input type="text" value={search} onChange={e=>setSearch(e.target.value)}
                placeholder={t("Search by name or email…","ابحث بالاسم أو البريد…")}
                className="w-full ps-9 pe-3 py-2.5 text-sm rounded-xl bg-[#F8FAFC] border border-[#F1F5F9] text-[#0B2C33] placeholder:text-[#94a3b8] focus:outline-none focus:border-[#107789]/40 focus:ring-1 focus:ring-[#107789]/15 transition-all"/>
              {search&&(
                <button onClick={()=>setSearch("")} className="absolute end-3 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#1e293b] transition-colors">{IC.close}</button>
              )}
            </div>
            {/* Filter toggle — mobile */}
            <button onClick={()=>setFilterOpen(p=>!p)}
              className={`sm:hidden flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all active:scale-95 ${filterOpen?"bg-[#107789] text-white border-[#107789]":"bg-white text-[#64748b] border-[#F1F5F9]"}`}>
              {IC.filter}{t("Filter","فلتر")}
            </button>
          </div>

          {/* Filter pills — always visible on sm+, toggle on mobile */}
          <div className={`${filterOpen?"flex":"hidden"} sm:flex flex-wrap items-center gap-2`}>
            {/* Role filters */}
            <div className="flex items-center flex-wrap gap-1.5">
              {(["All",...ROLES] as (Role|"All")[]).map(r=>(
                <button key={r} onClick={()=>setRoleFilter(r)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all active:scale-95 whitespace-nowrap
                              ${roleFilter===r?"text-white shadow-sm":"bg-[#F5F7F9] text-[#6B7280] hover:bg-[#EBF5F7] hover:text-[#107789]"}`}
                  style={roleFilter===r?{backgroundColor:r==="All"?"#107789":ROLE_CFG[r as Role].dot}:{}}>
                  {r==="All"?t("All Roles","جميع الأدوار"):lang==="ar"?ROLE_CFG[r as Role].ar:r}
                </button>
              ))}
            </div>
            {/* Divider */}
            <div className="hidden sm:block w-px h-5 bg-[#E5E7EB]"/>
            {/* Status filters */}
            <div className="flex items-center flex-wrap gap-1.5">
              {(["All","Active","Inactive"] as (Status|"All")[]).map(s=>(
                <button key={s} onClick={()=>setStatFilter(s)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all active:scale-95 whitespace-nowrap
                              ${statFilter===s?"bg-[#0B2C33] text-white":"bg-[#F5F7F9] text-[#6B7280] hover:bg-[#F0F2F5]"}`}>
                  {s==="All"?t("All Status","كل الحالات"):s==="Active"?t("Active","نشط"):t("Inactive","غير نشط")}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Table / Cards ── */}
        <div className="rounded-2xl bg-white border border-[#F1F5F9] shadow-sm overflow-hidden"
          style={{animation:"cardIn .45s .28s cubic-bezier(.34,1.2,.64,1) both"}}>

          {/* Table header bar */}
          <div className="flex items-center justify-between px-4 sm:px-5 py-3.5 border-b border-[#F1F5F9]">
            <p className="text-sm font-bold text-[#0B2C33]">
              {filtered.length} <span className="font-medium text-[#94a3b8]">{t("users found","مستخدم")}</span>
            </p>
          </div>

          {/* ── MOBILE: card list (hidden sm+) ── */}
          <div className="sm:hidden divide-y divide-[#F8FAFC]">
            {filtered.length===0&&(
              <div className="py-12 text-center text-sm text-[#94a3b8]" style={{animation:"fadeIn .4s both"}}>
                {t("No users found","لا يوجد مستخدمون")}
              </div>
            )}
            {filtered.map((u,i)=>(
              <div key={u.id} className="p-4 flex items-start gap-3 hover:bg-[#F8FAFC] transition-colors"
                style={{animation:`slideUp .3s ${0.3+i*0.04}s ease both`}}>
                <Av ch={u.avatar} size="md"/>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-[#0B2C33] truncate">{u.name}</p>
                      <p className="text-xs text-[#94a3b8] truncate mt-0.5">{u.email}</p>
                    </div>
                    <StatusPill status={u.status} lang={lang}/>
                  </div>
                  <div className="flex items-center flex-wrap gap-1.5 mt-2">
                    <RolePill role={u.role} lang={lang}/>
                    <span className="text-[10px] text-[#94a3b8] font-mono">{u.id}</span>
                  </div>
                  {/* Mobile action row */}
                  <div className="flex items-center gap-3 mt-3 pt-2.5 border-t border-[#F8FAFC]">
                    <button onClick={()=>setEditUser(u)}
                      className="flex items-center gap-1 text-xs font-semibold text-[#107789] hover:underline active:opacity-70 transition-all">
                      {IC.edit}{t("Edit","تعديل")}
                    </button>
                    <span className="w-px h-3.5 bg-[#E5E7EB]"/>
                    <button onClick={()=>toggleStatus(u.id)}
                      className={`flex items-center gap-1 text-xs font-semibold hover:underline active:opacity-70 transition-all ${u.status==="Active"?"text-[#d97706]":"text-[#059669]"}`}>
                      {IC.toggle}{u.status==="Active"?t("Deactivate","تعطيل"):t("Activate","تفعيل")}
                    </button>
                    <span className="w-px h-3.5 bg-[#E5E7EB]"/>
                    <button onClick={()=>setDeleteUser(u)}
                      className="flex items-center gap-1 text-xs font-semibold text-[#dc2626] hover:underline active:opacity-70 transition-all">
                      {IC.trash}{t("Delete","حذف")}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ── DESKTOP: full table (hidden below sm) ── */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#F8FAFC]">
                  {[
                    {en:"User",ar:"المستخدم"},{en:"ID",ar:"الرقم"},{en:"Role",ar:"الدور"},
                    {en:"Status",ar:"الحالة"},{en:"Joined",ar:"تاريخ الانضمام"},{en:"Actions",ar:"الإجراءات"},
                  ].map(col=>(
                    <th key={col.en} className="px-5 py-3 text-start text-xs font-semibold uppercase tracking-wide text-[#94a3b8] whitespace-nowrap">
                      {t(col.en,col.ar)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {filtered.length===0&&(
                  <tr><td colSpan={6} className="px-5 py-12 text-center text-sm text-[#94a3b8]" style={{animation:"fadeIn .4s both"}}>{t("No users found","لا يوجد مستخدمون")}</td></tr>
                )}
                {filtered.map((u,i)=>(
                  <tr key={u.id} className="hover:bg-[#F8FAFC] transition-colors duration-150"
                    style={{animation:`slideUp .3s ${0.3+i*0.04}s ease both`}}>
                    {/* User */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3 min-w-0">
                        <Av ch={u.avatar} size="md"/>
                        <div className="min-w-0">
                          <p className="font-semibold text-[#0B2C33] truncate max-w-[140px]">{u.name}</p>
                          <p className="text-xs text-[#94a3b8] truncate max-w-[160px]">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    {/* ID */}
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span className="font-mono text-xs text-[#94a3b8] bg-[#F8FAFC] border border-[#F1F5F9] px-2 py-0.5 rounded-lg">{u.id}</span>
                    </td>
                    {/* Role */}
                    <td className="px-5 py-3.5"><RolePill role={u.role} lang={lang}/></td>
                    {/* Status */}
                    <td className="px-5 py-3.5"><StatusPill status={u.status} lang={lang}/></td>
                    {/* Joined */}
                    <td className="px-5 py-3.5 whitespace-nowrap text-xs text-[#94a3b8]">{u.joinedAt}</td>
                    {/* Actions */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1">
                        <button onClick={()=>setEditUser(u)}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border border-[#E2E8F0] text-[#107789] hover:bg-[#EBF5F7] active:scale-95 transition-all whitespace-nowrap">
                          {IC.edit}{t("Edit","تعديل")}
                        </button>
                        <button onClick={()=>toggleStatus(u.id)}
                          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border active:scale-95 transition-all whitespace-nowrap
                                      ${u.status==="Active"
                                        ?"border-[#fde68a] text-[#d97706] hover:bg-[#fef3c7]"
                                        :"border-[#bbf7d0] text-[#059669] hover:bg-[#dcfce7]"}`}>
                          {IC.toggle}{u.status==="Active"?t("Deactivate","تعطيل"):t("Activate","تفعيل")}
                        </button>
                        <button onClick={()=>setDeleteUser(u)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#fecaca] text-[#dc2626] hover:bg-[#fee2e2] active:scale-95 transition-all">
                          {IC.trash}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#F1F5F9] bg-[#FAFBFC] px-4 sm:px-5 py-3.5">
            <p className="text-xs text-[#94a3b8]">
              {t(`Showing ${filtered.length} of ${users.length} users`,`عرض ${filtered.length} من ${users.length} مستخدم`)}
            </p>
            <div className="flex items-center gap-1">
              {[t("Previous","السابق"), "1", t("Next","التالي")].map((lbl,i)=>(
                <button key={i} className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all active:scale-95
                                            ${lbl==="1"?"bg-[#107789] text-white":"bg-[#F5F7F9] text-[#6B7280] hover:bg-[#EBF5F7] hover:text-[#107789] border border-[#F1F5F9]"}`}>
                  {lbl}
                </button>
              ))}
            </div>
          </div>
        </div>

      </main>

      {/* ── Modals ── */}
      {addOpen    && <AddModal    lang={lang} onClose={()=>setAddOpen(false)}   onSave={handleAdd}/>}
      {editUser   && <EditModal   user={editUser} lang={lang} onClose={()=>setEditUser(null)} onSave={handleEdit}/>}
      {deleteUser && <DeleteModal user={deleteUser} lang={lang} onClose={()=>setDeleteUser(null)} onConfirm={handleDelete}/>}

      {/* ── Toast ── */}
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={()=>setToast(null)}/>}
    </>
  );
}