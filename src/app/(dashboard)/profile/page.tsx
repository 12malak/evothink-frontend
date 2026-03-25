"use client";

import { useState } from "react";
import { useLanguage } from "@/src/contexts/LanguageContext";

// ─── Types ────────────────────────────────────────────────────
interface ProfileData {
  name:        string;
  nameAr:      string;
  role:        string;
  roleAr:      string;
  email:       string;
  phone:       string;
  bio:         string;
  bioAr:       string;
  location:    string;
  locationAr:  string;
  joinedAt:    string;
  languages:   string[];
  languagesAr: string[];
  specialties: string[];
  specialtiesAr: string[];
  avatar:      string;
  timezone:    string;
}

interface StatItem {
  labelEn: string;
  labelAr: string;
  value:   string;
  color:   string;
  bg:      string;
  icon:    React.ReactNode;
}

interface ActivityItem {
  id:      string;
  en:      string;
  ar:      string;
  time:    string;
  timeAr:  string;
  dot:     string;
  icon:    React.ReactNode;
}

// ─── Mock profile data ────────────────────────────────────────
const INITIAL_PROFILE: ProfileData = {
  name:           "Ahmad Al-Nasser",
  nameAr:         "أحمد الناصر",
  role:           "Senior English Teacher",
  roleAr:         "معلم إنجليزية أول",
  email:          "ahmad.nasser@evothink.com",
  phone:          "+966 50 123 4567",
  bio:            "Passionate English language educator with over 8 years of experience teaching students from A1 to C2 levels. Specializing in IELTS preparation, business English, and academic writing. Committed to creating engaging, student-centered lessons that build confidence and fluency.",
  bioAr:          "معلم لغة إنجليزية متحمس بخبرة تزيد عن 8 سنوات في تدريس الطلاب من مستوى A1 إلى C2. متخصص في التحضير لاختبار IELTS وإنجليزية الأعمال والكتابة الأكاديمية. ملتزم بإنشاء دروس جذابة تمحورها الطالب لبناء الثقة والطلاقة.",
  location:       "Riyadh, Saudi Arabia",
  locationAr:     "الرياض، المملكة العربية السعودية",
  joinedAt:       "January 2022",
  languages:      ["English", "Arabic", "French"],
  languagesAr:    ["الإنجليزية", "العربية", "الفرنسية"],
  specialties:    ["IELTS Preparation", "Business English", "Academic Writing", "Speaking & Pronunciation", "Grammar"],
  specialtiesAr:  ["تحضير IELTS", "إنجليزية الأعمال", "الكتابة الأكاديمية", "المحادثة والنطق", "قواعد اللغة"],
  avatar:         "AN",
  timezone:       "Asia/Riyadh (UTC+3)",
};

const ACTIVITY: ActivityItem[] = [
  { id:"a1", en:"Completed session with Sara Al-Rashid",    ar:"أنهيت جلسة مع سارة الراشد",       time:"2h ago",    timeAr:"منذ ساعتين",   dot:"#107789",
    icon:<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="9 12 11 14 15 10"/></svg> },
  { id:"a2", en:"Submitted evaluation for Omar Khalid",     ar:"أرسلت تقييم عمر خالد",             time:"5h ago",    timeAr:"منذ 5 ساعات",   dot:"#7c3aed",
    icon:<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> },
  { id:"a3", en:"Rescheduled Lina Hassan's class",          ar:"أعدت جدولة حصة لينا حسن",          time:"Yesterday", timeAr:"أمس",           dot:"#d97706",
    icon:<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg> },
  { id:"a4", en:"Received payout of $920",                  ar:"استلمت دفعة بقيمة $920",           time:"3 days ago",timeAr:"منذ 3 أيام",    dot:"#059669",
    icon:<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/></svg> },
  { id:"a5", en:"Updated profile information",              ar:"حدّثت معلومات الملف الشخصي",       time:"1 week ago", timeAr:"منذ أسبوع",    dot:"#94a3b8",
    icon:<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg> },
];

const LEVEL_COLORS: Record<string,{ bg:string; text:string }> = {
  "A1":{ bg:"#f0fdf4", text:"#15803d" }, "A2":{ bg:"#dcfce7", text:"#15803d" },
  "B1":{ bg:"#eff6ff", text:"#1d4ed8" }, "B2":{ bg:"#dbeafe", text:"#1d4ed8" },
  "C1":{ bg:"#fdf4ff", text:"#7e22ce" }, "C2":{ bg:"#f5f3ff", text:"#7e22ce" },
};

// ─── Icons ────────────────────────────────────────────────────
const IC = {
  edit:     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  close:    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  ok:       <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  mail:     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  phone:    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
  pin:      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  cal:      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  globe:    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  clock:    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  camera:   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>,
  star:     <svg width="16" height="16" viewBox="0 0 24 24" fill="#d97706" stroke="#d97706" strokeWidth="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  sessions: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="9 12 11 14 15 10"/></svg>,
  students: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  rating:   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  earnings: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/><circle cx="16" cy="13" r="1.5" fill="currentColor"/></svg>,
  plus:     <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  trash:    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/></svg>,
  save:     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>,
};

const STATS: StatItem[] = [
  { labelEn:"Total Sessions",  labelAr:"إجمالي الجلسات",  value:"312",    color:"#107789", bg:"#EBF5F7", icon:IC.sessions },
  { labelEn:"Active Students", labelAr:"الطلاب النشطون",  value:"28",     color:"#7c3aed", bg:"#ede9fe", icon:IC.students },
  { labelEn:"Avg. Rating",     labelAr:"متوسط التقييم",   value:"4.9",    color:"#d97706", bg:"#fef3c7", icon:IC.rating   },
  { labelEn:"Total Earned",    labelAr:"إجمالي الأرباح",  value:"$12,480",color:"#059669", bg:"#d1fae5", icon:IC.earnings },
];

// ─── Sub-components ───────────────────────────────────────────
function InfoRow({ icon, label, value }:{ icon:React.ReactNode; label:string; value:string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-lg bg-[#F8FAFC] border border-[#F1F5F9] flex items-center justify-center text-[#94a3b8] flex-shrink-0 mt-0.5">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-[#94a3b8]">{label}</p>
        <p className="text-sm font-semibold text-[#1e293b] mt-0.5 break-all">{value}</p>
      </div>
    </div>
  );
}

function ProgressBar({ val, color }:{ val:number; color:string }) {
  return (
    <div className="h-2 bg-[#F1F5F9] rounded-full overflow-hidden">
      <div className="h-full rounded-full" style={{ width:`${val}%`, backgroundColor:color, transition:"width .7s ease" }}/>
    </div>
  );
}

// ─── Backdrop ─────────────────────────────────────────────────
function Backdrop({ onClose, children }:{ onClose:()=>void; children:React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      style={{ backgroundColor:"rgba(11,44,51,.45)", backdropFilter:"blur(4px)" }}
      onClick={onClose}>
      <div className="w-full sm:w-auto" onClick={e=>e.stopPropagation()}
        style={{ animation:"modalIn .22s cubic-bezier(.34,1.56,.64,1) both" }}>
        {children}
      </div>
    </div>
  );
}

// ─── Toast ────────────────────────────────────────────────────
function Toast({ msg, onClose }:{ msg:string; onClose:()=>void }) {
  return (
    <div className="fixed bottom-5 end-5 z-[60] flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl text-sm font-semibold max-w-[calc(100vw-2.5rem)]"
      style={{ backgroundColor:"#f0fdf4", border:"1px solid #bbf7d0", color:"#15803d",
               animation:"slideUp .3s cubic-bezier(.34,1.56,.64,1) both" }}>
      <span className="flex-shrink-0">{IC.ok}</span>
      <span className="flex-1 min-w-0 truncate">{msg}</span>
      <button onClick={onClose} className="opacity-50 hover:opacity-100 flex-shrink-0 transition-opacity">{IC.close}</button>
    </div>
  );
}

// ─── EDIT PROFILE MODAL ───────────────────────────────────────
function EditModal({ profile, onSave, onClose, lang, t }:{
  profile: ProfileData;
  onSave: (p: ProfileData) => void;
  onClose: () => void;
  lang: string;
  t: (en:string, ar:string) => string;
}) {
  const [form, setForm]     = useState<ProfileData>(profile);
  const [newSpec, setNewSpec] = useState("");

  const inp = "w-full px-3 py-2.5 text-sm border border-[#E2E8F0] rounded-xl bg-white text-[#1e293b] focus:outline-none focus:border-[#107789] focus:ring-1 focus:ring-[#107789]/20 transition-all";
  const lbl = "block text-xs font-semibold text-[#64748b] mb-1.5";

  const addSpecialty = () => {
    if (!newSpec.trim()) return;
    setForm(p => ({ ...p, specialties:[...p.specialties, newSpec.trim()], specialtiesAr:[...p.specialtiesAr, newSpec.trim()] }));
    setNewSpec("");
  };
  const removeSpecialty = (i:number) => {
    setForm(p => ({
      ...p,
      specialties: p.specialties.filter((_,j)=>j!==i),
      specialtiesAr: p.specialtiesAr.filter((_,j)=>j!==i),
    }));
  };

  return (
    <Backdrop onClose={onClose}>
      <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-2xl overflow-hidden"
        dir={lang==="ar"?"rtl":"ltr"} style={{ maxHeight:"92vh", overflowY:"auto" }}>
        <div className="h-1" style={{ background:"linear-gradient(90deg,#107789,#E8763A)" }}/>

        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-[#F1F5F9]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#EBF5F7] flex items-center justify-center text-[#107789]">{IC.edit}</div>
            <div>
              <h2 className="text-sm font-bold text-[#1e293b]">{t("Edit Profile","تعديل الملف الشخصي")}</h2>
              <p className="text-xs text-[#94a3b8] mt-0.5">{t("Update your personal information","حدّث معلوماتك الشخصية")}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-xl bg-[#F5F7F9] text-[#94a3b8] hover:text-[#1e293b] hover:bg-[#E2E8F0] transition-all">{IC.close}</button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Name */}
          <div>
            <label className={lbl}>{t("Name (English)","الاسم (إنجليزي)")}</label>
            <input className={inp} value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Ahmad Al-Nasser"/>
          </div>
          <div>
            <label className={lbl}>{t("Name (Arabic)","الاسم (عربي)")}</label>
            <input className={inp} value={form.nameAr} onChange={e=>setForm({...form,nameAr:e.target.value})} placeholder="أحمد الناصر" dir="rtl"/>
          </div>

          {/* Role */}
          <div>
            <label className={lbl}>{t("Role (English)","المسمى الوظيفي (إنجليزي)")}</label>
            <input className={inp} value={form.role} onChange={e=>setForm({...form,role:e.target.value})}/>
          </div>
          <div>
            <label className={lbl}>{t("Role (Arabic)","المسمى الوظيفي (عربي)")}</label>
            <input className={inp} value={form.roleAr} onChange={e=>setForm({...form,roleAr:e.target.value})} dir="rtl"/>
          </div>

          {/* Contact */}
          <div>
            <label className={lbl}>{t("Email","البريد الإلكتروني")}</label>
            <input type="email" className={inp} value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/>
          </div>
          <div>
            <label className={lbl}>{t("Phone","رقم الهاتف")}</label>
            <input className={inp} value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/>
          </div>

          {/* Location */}
          <div>
            <label className={lbl}>{t("Location (English)","الموقع (إنجليزي)")}</label>
            <input className={inp} value={form.location} onChange={e=>setForm({...form,location:e.target.value})}/>
          </div>
          <div>
            <label className={lbl}>{t("Location (Arabic)","الموقع (عربي)")}</label>
            <input className={inp} value={form.locationAr} onChange={e=>setForm({...form,locationAr:e.target.value})} dir="rtl"/>
          </div>

          {/* Bio */}
          <div className="sm:col-span-2">
            <label className={lbl}>{t("Bio (English)","النبذة الشخصية (إنجليزي)")}</label>
            <textarea rows={3} className={`${inp} resize-none`} value={form.bio} onChange={e=>setForm({...form,bio:e.target.value})}/>
          </div>
          <div className="sm:col-span-2">
            <label className={lbl}>{t("Bio (Arabic)","النبذة الشخصية (عربي)")}</label>
            <textarea rows={3} className={`${inp} resize-none`} value={form.bioAr} dir="rtl" onChange={e=>setForm({...form,bioAr:e.target.value})}/>
          </div>

          {/* Specialties */}
          <div className="sm:col-span-2">
            <label className={lbl}>{t("Specialties","التخصصات")}</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {form.specialties.map((s,i)=>(
                <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#EBF5F7] text-[#107789] border border-[#b2dce4]">
                  {s}
                  <button onClick={()=>removeSpecialty(i)} className="text-[#94a3b8] hover:text-[#ef4444] transition-colors">{IC.trash}</button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input className={`${inp} flex-1`} value={newSpec} onChange={e=>setNewSpec(e.target.value)}
                placeholder={t("Add specialty…","أضف تخصصاً…")}
                onKeyDown={e=>{ if(e.key==="Enter"){ e.preventDefault(); addSpecialty(); }}}/>
              <button onClick={addSpecialty}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#107789] text-white hover:bg-[#0d6275] active:scale-95 transition-all flex-shrink-0">
                {IC.plus}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-5 sm:px-6 py-4 border-t border-[#F1F5F9] bg-[#FAFBFC]">
          <button onClick={onClose} className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-[#F5F7F9] text-[#64748b] hover:bg-[#E5E7EB] active:scale-95 transition-all">
            {t("Cancel","إلغاء")}
          </button>
          <button onClick={()=>onSave(form)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white hover:opacity-90 active:scale-95 transition-all"
            style={{ backgroundColor:"#107789" }}>
            {IC.save}{t("Save Changes","حفظ التغييرات")}
          </button>
        </div>
      </div>
    </Backdrop>
  );
}

// ─── PAGE ──────────────────────────────────────────────────────
export default function ProfilePage() {
  const { lang, isRTL, t } = useLanguage();

  const [profile,    setProfile]    = useState<ProfileData>(INITIAL_PROFILE);
  const [editOpen,   setEditOpen]   = useState(false);
  const [toast,      setToast]      = useState<string|null>(null);

  const fire = (msg:string) => { setToast(msg); setTimeout(()=>setToast(null),3500); };

  const handleSave = (updated: ProfileData) => {
    setProfile(updated);
    setEditOpen(false);
    fire(t("Profile updated successfully!","تم تحديث الملف الشخصي بنجاح!"));
  };

  const displayName = lang==="ar" ? profile.nameAr   : profile.name;
  const displayRole = lang==="ar" ? profile.roleAr   : profile.role;
  const displayBio  = lang==="ar" ? profile.bioAr    : profile.bio;
  const displayLoc  = lang==="ar" ? profile.locationAr : profile.location;
  const displaySpecs = lang==="ar" ? profile.specialtiesAr : profile.specialties;
  const displayLangs = lang==="ar" ? profile.languagesAr   : profile.languages;

  const skills = [
    { labelEn:"Speaking & Fluency",    labelAr:"المحادثة والطلاقة",   val:95, color:"#107789" },
    { labelEn:"Grammar & Writing",     labelAr:"القواعد والكتابة",    val:88, color:"#7c3aed" },
    { labelEn:"Student Engagement",    labelAr:"تفاعل الطلاب",        val:92, color:"#059669" },
    { labelEn:"IELTS Preparation",     labelAr:"تحضير IELTS",          val:97, color:"#d97706" },
    { labelEn:"Lesson Planning",       labelAr:"التخطيط للدروس",      val:85, color:"#0369a1" },
  ];

  return (
    <>
      <style>{`
        @keyframes cardIn  { from{opacity:0;transform:translateY(14px) scale(.97)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes slideUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes modalIn { from{opacity:0;transform:scale(.93) translateY(10px)} to{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
        @keyframes avatarIn{ from{opacity:0;transform:scale(.7)} to{opacity:1;transform:scale(1)} }
      `}</style>

      <main className="flex-1 min-h-screen overflow-auto p-4 sm:p-6 space-y-5 sm:space-y-6"
        style={{ backgroundColor:"#F5F7F9" }} dir={isRTL?"rtl":"ltr"}>

        {/* ── Page header ── */}
        <div className="flex flex-wrap items-center justify-between gap-3" style={{ animation:"fadeIn .4s ease both" }}>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[#1e293b] tracking-tight">{t("My Profile","ملفي الشخصي")}</h1>
            <p className="mt-1 text-xs sm:text-sm text-[#94a3b8]">{t("Manage your personal information and preferences","إدارة معلوماتك الشخصية وتفضيلاتك")}</p>
          </div>
          <button onClick={()=>setEditOpen(true)}
            className="flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-sm font-semibold text-white hover:opacity-90 active:scale-95 transition-all shadow-sm"
            style={{ backgroundColor:"#107789", animation:"cardIn .4s .05s both" }}>
            {IC.edit}<span>{t("Edit Profile","تعديل الملف")}</span>
          </button>
        </div>

        {/* ── Stats row ── */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {STATS.map((s,i)=>(
            <div key={s.labelEn}
              className="rounded-2xl bg-white border border-[#F1F5F9] shadow-sm p-4 sm:p-5 flex items-start gap-3 sm:gap-4 hover:shadow-md hover:border-[#b2dce4] transition-all duration-300"
              style={{ animation:`cardIn .45s ${i*0.07}s cubic-bezier(.34,1.2,.64,1) both` }}>
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor:s.bg }}>
                <span style={{ color:s.color }}>{s.icon}</span>
              </div>
              <div className="min-w-0">
                <p className="text-xl sm:text-2xl font-black text-[#1e293b] leading-none truncate">{s.value}</p>
                <p className="text-xs text-[#94a3b8] mt-1 font-medium leading-tight">{lang==="ar"?s.labelAr:s.labelEn}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Main grid: Hero card + right col ── */}
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">

          {/* ── Hero profile card ── */}
          <div className="xl:col-span-1 rounded-2xl bg-white border border-[#F1F5F9] shadow-sm overflow-hidden"
            style={{ animation:"cardIn .45s .25s cubic-bezier(.34,1.2,.64,1) both" }}>

            {/* Cover gradient */}
            <div className="relative h-28 sm:h-32"
              style={{ background:"linear-gradient(135deg,#0B2C33 0%,#107789 55%,#E8763A 100%)" }}>
              {/* Decorative rings */}
              <div className="absolute -bottom-1 -start-8 w-36 h-36 rounded-full opacity-10 bg-white pointer-events-none"/>
              <div className="absolute top-2 end-6 w-20 h-20 rounded-full opacity-10 bg-white pointer-events-none"/>

              {/* Edit button overlay */}
              <button onClick={()=>setEditOpen(true)}
                className="absolute top-3 end-3 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-semibold backdrop-blur-sm transition-all active:scale-95">
                {IC.camera}{t("Edit","تعديل")}
              </button>
            </div>

            {/* Avatar — overlaps cover */}
            <div className="relative px-5 sm:px-6">
              <div className="absolute -top-10 sm:-top-12 start-5 sm:start-6">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl font-black text-white ring-4 ring-white shadow-xl"
                  style={{ backgroundColor:"#107789", animation:"avatarIn .5s .3s cubic-bezier(.34,1.56,.64,1) both" }}>
                  {profile.avatar}
                </div>
              </div>

              {/* Name + role */}
              <div className="pt-12 sm:pt-14 pb-5 space-y-4">
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-[#1e293b]">{displayName}</h2>
                  <p className="text-sm text-[#94a3b8] mt-0.5">{displayRole}</p>
                  {/* Rating stars */}
                  <div className="flex items-center gap-1 mt-2">
                    {[1,2,3,4,5].map(n=>(
                      <span key={n} style={{ opacity:n<=4?1:0.35 }}>{IC.star}</span>
                    ))}
                    <span className="text-xs font-bold text-[#d97706] ms-1">4.9</span>
                    <span className="text-xs text-[#94a3b8]">({t("312 sessions","312 جلسة")})</span>
                  </div>
                </div>

                {/* Bio */}
                <p className="text-xs text-[#64748b] leading-relaxed border-s-2 border-[#b2dce4] ps-3">
                  {displayBio}
                </p>

                {/* Contact info */}
                <div className="space-y-3">
                  <InfoRow icon={IC.mail}  label={t("Email","البريد")}      value={profile.email}    />
                  <InfoRow icon={IC.phone} label={t("Phone","الهاتف")}      value={profile.phone}    />
                  <InfoRow icon={IC.pin}   label={t("Location","الموقع")}   value={displayLoc}       />
                  <InfoRow icon={IC.cal}   label={t("Joined","تاريخ الانضمام")} value={profile.joinedAt} />
                  <InfoRow icon={IC.clock} label={t("Timezone","المنطقة الزمنية")} value={profile.timezone} />
                </div>
              </div>
            </div>
          </div>

          {/* ── Right column ── */}
          <div className="xl:col-span-2 flex flex-col gap-5">

            {/* Skills card */}
            <div className="rounded-2xl bg-white border border-[#F1F5F9] shadow-sm p-5 sm:p-6 hover:shadow-md transition-all duration-300"
              style={{ animation:"cardIn .45s .32s cubic-bezier(.34,1.2,.64,1) both" }}>
              <h3 className="text-sm font-bold text-[#1e293b] mb-4">{t("Teaching Skills","مهارات التدريس")}</h3>
              <div className="space-y-4">
                {skills.map((s,i)=>(
                  <div key={s.labelEn} style={{ animation:`slideUp .35s ${0.35+i*0.07}s ease both` }}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-semibold text-[#64748b]">{lang==="ar"?s.labelAr:s.labelEn}</span>
                      <span className="text-xs font-bold" style={{ color:s.color }}>{s.val}%</span>
                    </div>
                    <ProgressBar val={s.val} color={s.color}/>
                  </div>
                ))}
              </div>
            </div>

            {/* Specialties + Languages row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

              {/* Specialties */}
              <div className="rounded-2xl bg-white border border-[#F1F5F9] shadow-sm p-5 hover:shadow-md transition-all duration-300"
                style={{ animation:"cardIn .45s .38s cubic-bezier(.34,1.2,.64,1) both" }}>
                <h3 className="text-sm font-bold text-[#1e293b] mb-3">{t("Specialties","التخصصات")}</h3>
                <div className="flex flex-wrap gap-2">
                  {displaySpecs.map((s,i)=>(
                    <span key={i}
                      className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all hover:scale-105"
                      style={{ backgroundColor:"#EBF5F7", color:"#107789", borderColor:"#b2dce4",
                               animationDelay:`${0.4+i*0.05}s`, animation:"fadeIn .4s ease both" }}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Languages */}
              <div className="rounded-2xl bg-white border border-[#F1F5F9] shadow-sm p-5 hover:shadow-md transition-all duration-300"
                style={{ animation:"cardIn .45s .44s cubic-bezier(.34,1.2,.64,1) both" }}>
                <h3 className="text-sm font-bold text-[#1e293b] mb-3">{t("Languages","اللغات")}</h3>
                <div className="space-y-3">
                  {displayLangs.map((l,i)=>{
                    const levels = ["Native","Fluent","Conversational"];
                    const levelsAr = ["اللغة الأم","طلاقة","محادثة"];
                    const colors = ["#107789","#7c3aed","#d97706"];
                    const vals = [100, 95, 70];
                    return (
                      <div key={i} style={{ animation:`slideUp .35s ${0.45+i*0.08}s ease both` }}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-semibold text-[#1e293b]">{l}</span>
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                            style={{ backgroundColor:`${colors[i]}18`, color:colors[i] }}>
                            {lang==="ar"?levelsAr[i]:levels[i]}
                          </span>
                        </div>
                        <ProgressBar val={vals[i]} color={colors[i]}/>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Level distribution */}
            <div className="rounded-2xl bg-white border border-[#F1F5F9] shadow-sm p-5 sm:p-6 hover:shadow-md transition-all duration-300"
              style={{ animation:"cardIn .45s .5s cubic-bezier(.34,1.2,.64,1) both" }}>
              <h3 className="text-sm font-bold text-[#1e293b] mb-4">{t("Student Level Distribution","توزيع مستويات الطلاب")}</h3>
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
                {(["A1","A2","B1","B2","C1","C2"] as const).map((lvl,i)=>{
                  const cnt = [4,6,8,5,3,2][i];
                  const pct = Math.round((cnt/28)*100);
                  const lc = LEVEL_COLORS[lvl];
                  return (
                    <div key={lvl} className="flex flex-col items-center gap-2 p-3 rounded-xl border border-[#F1F5F9] hover:border-[#b2dce4] transition-all"
                      style={{ animation:`cardIn .35s ${0.52+i*0.06}s both` }}>
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black"
                        style={{ backgroundColor:lc.bg, color:lc.text }}>
                        {lvl}
                      </div>
                      <span className="text-base font-black text-[#1e293b]">{cnt}</span>
                      <span className="text-[10px] text-[#94a3b8] font-medium">{pct}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ── Recent Activity ── */}
        <div className="rounded-2xl bg-white border border-[#F1F5F9] shadow-sm overflow-hidden hover:shadow-md transition-all duration-300"
          style={{ animation:"cardIn .45s .55s cubic-bezier(.34,1.2,.64,1) both" }}>
          <div className="px-5 sm:px-6 py-4 border-b border-[#F1F5F9]">
            <h3 className="text-sm font-bold text-[#1e293b]">{t("Recent Activity","النشاط الأخير")}</h3>
            <p className="text-xs text-[#94a3b8] mt-0.5">{t("Your latest actions on the platform","أحدث أنشطتك على المنصة")}</p>
          </div>
          <div className="divide-y divide-[#F8FAFC]">
            {ACTIVITY.map((a,i)=>(
              <div key={a.id} className="flex items-start gap-4 px-5 sm:px-6 py-4 hover:bg-[#F8FAFC] transition-colors"
                style={{ animation:`slideUp .3s ${0.58+i*0.06}s ease both` }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ backgroundColor:`${a.dot}18`, color:a.dot }}>
                  {a.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#1e293b] leading-snug">{lang==="ar"?a.ar:a.en}</p>
                  <p className="text-xs text-[#94a3b8] mt-0.5">{lang==="ar"?a.timeAr:a.time}</p>
                </div>
                <div className="w-2 h-2 rounded-full flex-shrink-0 mt-2" style={{ backgroundColor:a.dot }}/>
              </div>
            ))}
          </div>
        </div>

      </main>

      {/* Modals + Toast */}
      {editOpen && (
        <EditModal profile={profile} onSave={handleSave} onClose={()=>setEditOpen(false)} lang={lang} t={t}/>
      )}
      {toast && <Toast msg={toast} onClose={()=>setToast(null)}/>}
    </>
  );
}