"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/src/contexts/LanguageContext";

// ─── Types ────────────────────────────────────────────────────
interface HeaderProps {
  userName?:          string;
  userRole?:          string;
  userInitial?:       string;
  notificationCount?: number;
}

interface Notification {
  id:   string;
  en:   string;
  ar:   string;
  time: string;
  dot:  string;
  read: boolean;
}

// ─── Data ─────────────────────────────────────────────────────
const INITIAL_NOTIFS: Notification[] = [
  { id:"n1", en:"New student enrolled: Omar Khalid",   ar:"طالب جديد: عمر خالد",            time:"2m",  dot:"#107789", read:false },
  { id:"n2", en:"Class starting in 30 minutes",        ar:"حصة تبدأ خلال 30 دقيقة",         time:"25m", dot:"#d97706", read:false },
  { id:"n3", en:"Evaluation submitted successfully",   ar:"تم إرسال التقييم بنجاح",          time:"1h",  dot:"#059669", read:true  },
  { id:"n4", en:"Payout of $320 is now processing",   ar:"دفعة $320 قيد المعالجة الآن",     time:"3h",  dot:"#7c3aed", read:true  },
];

const MENU_ITEMS = [
  { key:"profile",  href:"/profile",    danger:false, label:{ en:"Profile",  ar:"الملف الشخصي" } },
  { key:"settings", href:"/settings",   danger:false, label:{ en:"Settings", ar:"الإعدادات"    } },
  { key:"divider",  href:"",            danger:false, label:{ en:"",         ar:""             } },
  { key:"logout",   href:"/auth/login", danger:true,  label:{ en:"Sign Out", ar:"تسجيل الخروج" } },
] as const;

const ROLE_COLORS: Record<string,{ bg:string; text:string }> = {
  ADMIN:   { bg:"#ede9fe", text:"#7c3aed" },
  TEACHER: { bg:"#EBF5F7", text:"#107789" },
  STUDENT: { bg:"#d1fae5", text:"#059669" },
  SALES:   { bg:"#fef3c7", text:"#d97706" },
  PARENT:  { bg:"#fee2e2", text:"#ef4444" },
};

const AVT_COLORS = ["#f97316","#107789","#7c3aed","#059669","#d97706","#ef4444","#0369a1"];
const avtColor   = (s:string) => AVT_COLORS[(s.charCodeAt(0)+(s.charCodeAt(1)||0))%AVT_COLORS.length];

// ─── Icons ────────────────────────────────────────────────────
const IC = {
  globe: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="2" y1="12" x2="22" y2="12"/>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  ),
  bell: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  ),
  chevron: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  ),
  check: (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  user: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  settings: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  ),
  logout: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      <polyline points="16 17 21 12 16 7"/>
      <line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  ),
};

const ITEM_ICONS: Record<string, React.ReactNode> = {
  profile:  IC.user,
  settings: IC.settings,
  logout:   IC.logout,
};

// ─── Dropdown Shell ───────────────────────────────────────────
function Dropdown({
  open, align, width = "w-52", children,
}: {
  open: boolean; align: "left"|"right"; width?: string; children: React.ReactNode;
}) {
  return (
    <div className={[
      "absolute top-[calc(100%+8px)] z-[200] overflow-hidden rounded-2xl",
      "border border-[#F1F5F9] bg-white",
      "shadow-[0_20px_48px_rgba(15,23,42,0.13),0_4px_12px_rgba(15,23,42,0.06)]",
      "transition-all duration-[180ms] ease-out origin-top",
      width,
      align === "left" ? "left-0" : "right-0",
      open
        ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
        : "pointer-events-none -translate-y-2 scale-[0.96] opacity-0",
    ].join(" ")}>
      {children}
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────
export default function Header({
  userName          = "Admin",
  userRole          = "ADMIN",
  userInitial       = "A",
  notificationCount = 2,
}: HeaderProps) {
  const router              = useRouter();
  const { lang, setLang, t, isRTL } = useLanguage();
  const dropAlign           = isRTL ? "left" : "right";

  const [userOpen, setUserOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const [notifs,   setNotifs  ] = useState<Notification[]>(INITIAL_NOTIFS);

  const userRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);
  const bellRef = useRef<HTMLDivElement>(null);

  // ── Close on outside click ──
  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (userRef.current && !userRef.current.contains(e.target as Node)) setUserOpen(false);
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false);
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) setBellOpen(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  // ── Close on Escape ──
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setUserOpen(false); setLangOpen(false); setBellOpen(false); }
    };
    document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, []);

  const only = (which: "user"|"lang"|"bell") => {
    setUserOpen(which==="user" ? p=>!p : false);
    setLangOpen(which==="lang" ? p=>!p : false);
    setBellOpen(which==="bell" ? p=>!p : false);
  };

  const unread     = notifs.filter(n=>!n.read).length;
  const markAllRead = () => setNotifs(p=>p.map(n=>({...n,read:true})));

  const roleCfg = ROLE_COLORS[userRole] ?? { bg:"#F1F5F9", text:"#64748b" };
  const bgColor = avtColor(userInitial);

  // ── Shared icon-button class ──
  const iconBtn = [
    "relative flex items-center justify-center rounded-xl",
    "text-[#6b7280] transition-all duration-200",
    "hover:bg-[#F1F9FB] hover:text-[#107789]",
    "active:scale-95 focus-visible:outline-none",
    "focus-visible:ring-2 focus-visible:ring-[#107789]/25",
  ].join(" ");

  return (
    <>
      <style>{`
        @keyframes bellRing {
          0%,100%{transform:rotate(0)} 15%{transform:rotate(-14deg)} 30%{transform:rotate(14deg)}
          45%{transform:rotate(-10deg)} 60%{transform:rotate(10deg)} 75%{transform:rotate(-5deg)}
        }
        .bell-ico:hover { animation: bellRing .55s ease; }
      `}</style>

      <header
        dir={isRTL ? "rtl" : "ltr"}
        className="sticky top-0 z-50 w-full"
        style={{
          background:          "rgba(255,255,255,0.94)",
          backdropFilter:      "blur(20px) saturate(180%)",
          WebkitBackdropFilter:"blur(20px) saturate(180%)",
          borderBottom:        "1px solid rgba(241,245,249,0.8)",
          boxShadow:           "0 1px 0 rgba(241,245,249,1), 0 4px 24px rgba(15,23,42,0.04)",
        }}
      >
        <div className="flex h-[60px] sm:h-[68px] items-center justify-between gap-2 px-3 sm:px-5 lg:px-7">

          {/* ─── LOGO ─── always LTR, never flips in RTL ─── */}
          <div className="flex-shrink-0" dir="ltr">

            {/* Full logo: sm and above */}
            <svg
              viewBox="0 0 520 130"
              xmlns="http://www.w3.org/2000/svg"
              aria-label="Evothink"
              className="hidden sm:block"
              style={{ width:148, height:34 }}
            >
              <text x="8"   y="108" fontFamily="'Playfair Display',Georgia,serif" fontWeight="700" fontSize="105" fill="#107789">E</text>
              <text x="62"  y="94"  fontFamily="'Playfair Display',Georgia,serif" fontWeight="700" fontSize="70"  fill="#E8763A">TH</text>
              <text x="188" y="98"  fontFamily="'Playfair Display',Georgia,serif" fontWeight="700" fontSize="66"  fill="#107789">Evothink</text>
            </svg>

            {/* Compact logo: xs only */}
            <svg
              viewBox="0 0 142 130"
              xmlns="http://www.w3.org/2000/svg"
              aria-label="ETH"
              className="sm:hidden"
              style={{ width:44, height:28 }}
            >
              <text x="4"  y="108" fontFamily="'Playfair Display',Georgia,serif" fontWeight="700" fontSize="105" fill="#107789">E</text>
              <text x="58" y="94"  fontFamily="'Playfair Display',Georgia,serif" fontWeight="700" fontSize="70"  fill="#E8763A">TH</text>
            </svg>
          </div>

          {/* ─── CONTROLS ─── */}
          <div className="flex flex-shrink-0 items-center gap-0.5 sm:gap-1">

            {/* ── Language ── */}
            <div ref={langRef} className="relative">
              <button
                onClick={() => only("lang")}
                aria-label={t("Switch language","تغيير اللغة")}
                aria-expanded={langOpen}
                className={`${iconBtn} gap-1 sm:gap-1.5 px-2 sm:px-3 py-2 h-9`}
              >
                <span className="flex-shrink-0 transition-transform duration-200 hover:rotate-12">{IC.globe}</span>
                {/* sm+: full label */}
                <span className="hidden sm:inline text-[13px] font-semibold whitespace-nowrap">
                  {lang==="en" ? "عربي" : "English"}
                </span>
                {/* xs: 2-letter code */}
                <span className="sm:hidden text-[11px] font-black text-[#107789]">
                  {lang==="en" ? "ع" : "EN"}
                </span>
              </button>

              <Dropdown open={langOpen} align={dropAlign} width="w-36">
                <div className="px-3.5 pt-3 pb-1.5">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#94a3b8]">
                    {t("Language","اللغة")}
                  </p>
                </div>
                {(["en","ar"] as const).map(l => (
                  <button
                    key={l}
                    onClick={() => { setLang(l); setLangOpen(false); }}
                    className={[
                      "flex w-full items-center justify-between px-3.5 py-2.5 text-sm",
                      "transition-all duration-150 active:scale-[.98]",
                      lang===l
                        ? "bg-[#F1F9FB] font-bold text-[#107789]"
                        : "font-medium text-[#374151] hover:bg-[#F8FAFC] hover:text-[#107789]",
                    ].join(" ")}
                  >
                    <span>{l==="en" ? "English" : "عربي"}</span>
                    {lang===l && <span className="text-[#107789]">{IC.check}</span>}
                  </button>
                ))}
                <div className="h-1"/>
              </Dropdown>
            </div>

            {/* Divider */}
            <div className="mx-0.5 sm:mx-1 h-5 w-px rounded-full bg-[#E5E7EB]"/>

            {/* ── Bell ── */}
            <div ref={bellRef} className="relative">
              <button
                onClick={() => only("bell")}
                aria-label={t("Notifications","الإشعارات")}
                aria-expanded={bellOpen}
                className={`${iconBtn} h-9 w-9`}
              >
                <span className="bell-ico block">{IC.bell}</span>

                {/* Badge */}
                {unread > 0 && (
                  <span className="absolute end-1 top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full border-2 border-white bg-[#ef4444] px-0.5 text-[9px] font-black leading-none text-white">
                    <span className="absolute inline-flex h-3 w-3 animate-ping rounded-full bg-[#ef4444] opacity-50 -top-0.5 -end-0.5"/>
                    {unread > 9 ? "9+" : unread}
                  </span>
                )}
              </button>

              {/* Notification panel */}
              <Dropdown open={bellOpen} align={dropAlign} width="w-[calc(100vw-2rem)] sm:w-80 max-w-[340px]">
                {/* Panel header */}
                <div className="flex items-center justify-between border-b border-[#F1F5F9] px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-[#1e293b]">{t("Notifications","الإشعارات")}</span>
                    {unread > 0 && (
                      <span className="flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#ef4444] px-1 text-[9px] font-black text-white">
                        {unread}
                      </span>
                    )}
                  </div>
                  {unread > 0 && (
                    <button
                      onClick={markAllRead}
                      className="text-[11px] font-semibold text-[#107789] hover:underline transition-opacity active:opacity-60"
                    >
                      {t("Mark all read","قراءة الكل")}
                    </button>
                  )}
                </div>

                {/* Items */}
                <div className="max-h-64 overflow-y-auto divide-y divide-[#F8FAFC]">
                  {notifs.map((n,i) => (
                    <div
                      key={n.id}
                      onClick={() => setNotifs(p=>p.map((x,j)=>j===i?{...x,read:true}:x))}
                      className={[
                        "flex cursor-pointer items-start gap-3 px-4 py-3",
                        "transition-colors duration-150 active:scale-[.99]",
                        n.read ? "hover:bg-[#F8FAFC]" : "bg-[#F8FDFF] hover:bg-[#F1F9FB]",
                      ].join(" ")}
                    >
                      {/* Dot */}
                      <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full"
                        style={{backgroundColor: n.read ? "#CBD5E1" : n.dot}}/>
                      {/* Content */}
                      <div className="min-w-0 flex-1">
                        <p className={`text-xs leading-snug ${n.read ? "text-[#64748b]" : "font-semibold text-[#1e293b]"}`}>
                          {lang==="ar" ? n.ar : n.en}
                        </p>
                        <p className="mt-0.5 text-[10px] text-[#94a3b8]">
                          {n.time} {t("ago","مضت")}
                        </p>
                      </div>
                      {/* Unread indicator */}
                      {!n.read && (
                        <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full"
                          style={{backgroundColor:n.dot}}/>
                      )}
                    </div>
                  ))}
                </div>

                {/* Panel footer */}
                <div className="border-t border-[#F1F5F9] px-4 py-2.5">
                  <button
                    onClick={() => { router.push("/notifications"); setBellOpen(false); }}
                    className="w-full text-center text-xs font-semibold text-[#107789] transition-opacity hover:underline active:opacity-60"
                  >
                    {t("View all notifications","عرض كل الإشعارات")}
                  </button>
                </div>
              </Dropdown>
            </div>

            {/* Divider */}
            <div className="mx-0.5 sm:mx-1 h-5 w-px rounded-full bg-[#E5E7EB]"/>

            {/* ── User Menu ── */}
            <div ref={userRef} className="relative">
              <button
                onClick={() => only("user")}
                aria-expanded={userOpen}
                aria-label={t("User menu","قائمة المستخدم")}
                className={[
                  "flex items-center gap-1.5 sm:gap-2.5 rounded-xl px-1.5 sm:px-2.5 py-1.5",
                  "transition-all duration-200 active:scale-[.98]",
                  "hover:bg-[#F1F9FB]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#107789]/25",
                  "group",
                ].join(" ")}
              >
                {/* Name + role — sm and above only */}
                <div className={`hidden sm:flex flex-col gap-0.5 ${isRTL ? "items-start" : "items-end"}`}>
                  <span className="max-w-[90px] truncate text-[13.5px] font-bold leading-none text-[#1e293b]">
                    {userName}
                  </span>
                  <span
                    className="inline-flex items-center rounded-md px-1.5 py-[2px] text-[10px] font-bold leading-none whitespace-nowrap"
                    style={{ backgroundColor:roleCfg.bg, color:roleCfg.text }}
                  >
                    {userRole}
                  </span>
                </div>

                {/* Avatar */}
                <div
                  className="flex h-8 w-8 sm:h-9 sm:w-9 flex-shrink-0 items-center justify-center rounded-full text-[13px] font-bold text-white
                             shadow-[0_3px_10px_rgba(0,0,0,0.15)] ring-2 ring-white
                             transition-transform duration-200 group-hover:scale-105"
                  style={{ backgroundColor:bgColor }}
                >
                  {userInitial}
                </div>

                {/* Chevron — sm+ */}
                <span className={`hidden sm:block flex-shrink-0 text-[#9ca3af] transition-transform duration-200 ${userOpen ? "rotate-180":""}`}>
                  {IC.chevron}
                </span>
              </button>

              {/* User dropdown */}
              <Dropdown open={userOpen} align={dropAlign} width="w-52">
                {/* User info header */}
                <div className="px-4 py-3.5 border-b border-[#F8FAFC]">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-[13px] font-bold text-white ring-2 ring-white shadow-md"
                      style={{ backgroundColor:bgColor }}
                    >
                      {userInitial}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-[13.5px] font-bold text-[#1e293b]">{userName}</p>
                      <span
                        className="inline-flex items-center rounded-md px-1.5 py-[2px] text-[10px] font-bold leading-none mt-0.5"
                        style={{ backgroundColor:roleCfg.bg, color:roleCfg.text }}
                      >
                        {userRole}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Menu items */}
                <div className="py-1.5">
                  {MENU_ITEMS.map((item, i) => {
                    if (item.key === "divider") {
                      return <div key="div" className="my-1 h-px bg-[#F1F5F9]"/>;
                    }
                    const icon = ITEM_ICONS[item.key];
                    return (
                      <button
                        key={item.key}
                        onClick={() => { router.push(item.href); setUserOpen(false); }}
                        className={[
                          "flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium",
                          "transition-all duration-150 active:scale-[.98]",
                          item.danger
                            ? "text-[#ef4444] hover:bg-[#FEF2F2]"
                            : "text-[#374151] hover:bg-[#F8FAFC] hover:text-[#107789]",
                        ].join(" ")}
                        style={{ transitionDelay: userOpen ? `${i*20}ms` : "0ms" }}
                      >
                        <span className={`flex-shrink-0 ${item.danger ? "text-[#ef4444]" : "text-[#9ca3af] group-hover:text-[#107789]"}`}>
                          {icon}
                        </span>
                        {t(item.label.en, item.label.ar)}
                      </button>
                    );
                  })}
                </div>
              </Dropdown>
            </div>

          </div>
        </div>

        {/* ── Bottom progress line (subtle brand accent) ── */}
        <div className="h-[2px] w-full" style={{background:"linear-gradient(90deg,#107789 0%,#E8763A 50%,transparent 100%)",opacity:0.25}}/>
      </header>
    </>
  );
}