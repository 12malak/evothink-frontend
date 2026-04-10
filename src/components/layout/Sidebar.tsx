"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useLanguage } from "@/src/contexts/LanguageContext";

// ─── Types ────────────────────────────────────────────────────
type Role = "student" | "teacher" | "parent" | "sales" | "admin";

interface StoredUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
}

interface NavChild {
  key: string; labelEn: string; labelAr: string; href: string;
}
interface NavItem {
  key: string; labelEn: string; labelAr: string;
  href?: string; icon: React.ReactNode;
  children?: NavChild[];
  roles?: Role[];
}

// ─── Role badge ───────────────────────────────────────────────
const ROLE_BADGE: Record<Role, { bg: string; text: string; en: string; ar: string }> = {
  student: { bg: "#EBF5F7", text: "#107789", en: "Student",  ar: "طالب"    },
  teacher: { bg: "#FEF3C7", text: "#D97706", en: "Teacher",  ar: "معلم"    },
  parent:  { bg: "#F0FDF4", text: "#15803D", en: "Parent",   ar: "ولي أمر" },
  sales:   { bg: "#FFF1F2", text: "#BE123C", en: "Sales",    ar: "مبيعات"  },
  admin:   { bg: "#F5F3FF", text: "#7C3AED", en: "Admin",    ar: "مدير"    },
};

// ─── Icons ────────────────────────────────────────────────────
const IC = {
  dashboard: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>,
  student:   <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>,
  teacher:   <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  parent:    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  sales:     <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>,
  admin:     <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  settings:  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  logout:    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  chevron:   <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>,
  menu:      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  close:     <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
};

// ─── Nav definition ───────────────────────────────────────────
const ALL_NAV: NavItem[] = [
  // Student
  {
    key:"student", labelEn:"My Learning", labelAr:"تعلمي", icon:IC.student, roles:["student"],
    children:[
      {key:"s-dash",     labelEn:"Dashboard", labelAr:"الرئيسية",    href:"/student/dashboard"},
      {key:"s-learning", labelEn:"Learning",  labelAr:"التعلم",      href:"/student/learning"},
      {key:"s-classes",  labelEn:"Classes",   labelAr:"الحصص",       href:"/student/classes"},
      {key:"s-payments", labelEn:"Payments",  labelAr:"المدفوعات",   href:"/student/payments"},
    ],
  },
  // Teacher
  {
    key:"teacher", labelEn:"Teaching", labelAr:"التدريس", icon:IC.teacher, roles:["teacher"],
    children:[
      {key:"t-dash",    labelEn:"Dashboard",  labelAr:"الرئيسية", href:"/teacher/dashboard"},
      {key:"t-classes", labelEn:"Classes",    labelAr:"الحصص",    href:"/teacher/classes"},
      {key:"t-eval",    labelEn:"Evaluation", labelAr:"التقييم",  href:"/teacher/evaluation"},
      {key:"t-wallet",  labelEn:"Wallet",     labelAr:"المحفظة",  href:"/teacher/wallet"},
    ],
  },
  // Parent
  {
    key:"parent", labelEn:"My Children", labelAr:"أبنائي", icon:IC.parent, roles:["parent"],
    children:[
      {key:"p-dash",     labelEn:"Dashboard", labelAr:"الرئيسية",  href:"/parent/dashboard"},
      {key:"p-payments", labelEn:"Payments",  labelAr:"المدفوعات", href:"/parent/payments"},
    ],
  },
  // Sales (sales )
  {
    key:"sales", labelEn:"Sales", labelAr:"المبيعات", icon:IC.sales, roles:["sales"],
    children:[
      {key:"sa-dash",   labelEn:"Dashboard", labelAr:"الرئيسية",          href:"/sales/dashboard"},
      {key:"sa-leads",  labelEn:"Leads",     labelAr:"العملاء المحتملون", href:"/sales/leads"},
      {key:"sa-trials", labelEn:"Trials",    labelAr:"الحصص التجريبية",   href:"/sales/trials"},
    ],
  },
  // Admin — management sections

  {
    key:"admin", labelEn:"Administration", labelAr:"الإدارة", icon:IC.admin, roles:["admin"],
    children:[
      {key:"adm-users",     labelEn:"Users",       labelAr:"المستخدمون", href:"/admin/users"},
      {key:"adm-courses",   labelEn:"Courses",     labelAr:"المقررات",   href:"/admin/courses"},
      {key:"adm-schedule",  labelEn:"Scheduling",  labelAr:"الجدولة",    href:"/admin/schedule"},
      {key:"adm-packages",  labelEn:"Packages",    labelAr:"الباقات",    href:"/admin/packages"},
      {key:"adm-reports",   labelEn:"Reports",     labelAr:"التقارير",   href:"/admin/reports"},
    ],
  },
];

// ─── Sub-children animated list ──────────────────────────────
function SectionChildren({ isOpen, isRTL, childrenItems, pathname, t, onNavigate }: {
  isOpen: boolean; isRTL: boolean; childrenItems: NavChild[];
  pathname: string; t: (en: string, ar: string) => string; onNavigate: () => void;
}) {
  return (
    <div className={["grid transition-all duration-300 ease-out", isOpen?"grid-rows-[1fr] opacity-100":"grid-rows-[0fr] opacity-0"].join(" ")}>
      <div className="overflow-hidden">
        <div className={["mt-1 space-y-1 py-1", isRTL?"me-4 border-r border-[#F0F2F5] pe-3":"ms-4 border-l border-[#F0F2F5] ps-3"].join(" ")}>
          {childrenItems.map((child, i) => {
            const active = pathname === child.href || pathname.startsWith(child.href + "/");
            return (
              <Link key={child.key} href={child.href} onClick={onNavigate}
                className={["group flex items-center gap-2 rounded-xl px-2.5 py-2 text-[14.5px] font-medium transition-all duration-200",
                  active?"bg-[#EBF5F7] text-[#107789]":"text-[#6B7280] hover:bg-[#F5F7F9] hover:text-[#107789]",
                  isOpen?"opacity-100":"pointer-events-none opacity-0",
                ].join(" ")}
                style={{ transitionDelay: isOpen ? `${i * 35}ms` : "0ms" }}>
                <span className={["h-1.5 w-1.5 flex-shrink-0 rounded-full transition-all", active?"bg-[#107789]":"bg-[#D1D5DB] group-hover:bg-[#107789]"].join(" ")} />
                {t(child.labelEn, child.labelAr)}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// SIDEBAR
// ═══════════════════════════════════════════════════
export default function Sidebar() {
  const pathname = usePathname();
  const router   = useRouter();
  const { isRTL, t } = useLanguage();

  // ── Read user from localStorage ──────────────────
  const [user, setUser] = useState<StoredUser | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("evothink_user");
      if (raw) setUser(JSON.parse(raw));
    } catch {}
  }, []);

  // ── Filter nav by role ───────────────────────────
  const visibleItems = useMemo(() => {
    if (!user) return [];
    return ALL_NAV.filter(item => !item.roles || item.roles.includes(user.role));
  }, [user]);

  // ── Accordion state ──────────────────────────────
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const auto: Record<string, boolean> = {};
    visibleItems.forEach(item => {
      if (item.children?.some(c => pathname === c.href || pathname.startsWith(c.href + "/"))) {
        auto[item.key] = true;
      }
    });
    setOpenSections(prev => ({ ...prev, ...auto }));
  }, [pathname, visibleItems]);

  // ── Mobile drawer ─────────────────────────────────
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => {
    if (!mobileOpen) return;
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") setMobileOpen(false); };
    document.addEventListener("keydown", esc);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", esc); document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const closeMobile = () => setMobileOpen(false);
  const toggle = (key: string) => setOpenSections(p => ({ ...p, [key]: !p[key] }));

  const isActive = (item: NavItem) =>
    item.href ? pathname === item.href : item.children?.some(c => pathname === c.href || pathname.startsWith(c.href + "/")) ?? false;

  // ── Logout ────────────────────────────────────────
  const handleLogout = () => {
    localStorage.removeItem("evothink_user");
    closeMobile();
    router.push("/auth/login");
  };

  const badge = user ? ROLE_BADGE[user.role] : null;

  // ── Inner content (shared desktop/mobile) ─────────
  const Content = () => (
    <div className="flex h-full flex-col bg-white" dir={isRTL ? "rtl" : "ltr"}>

      {/* User card */}
      {user && badge && (
        <div className="mx-3 mt-3 rounded-xl p-3 flex items-center gap-3"
          style={{ background: "linear-gradient(135deg,#EBF5F7,#F8FAFC)", border: "1px solid #E5E7EB" }}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-black flex-shrink-0"
            style={{ background: "linear-gradient(135deg,#107789,#0B2C33)" }}>
            {user.firstName[0]}{user.lastName[0]}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-[#0B2C33] truncate">{user.firstName} {user.lastName}</p>
            <span className="inline-block text-[11px] font-bold px-2 py-0.5 rounded-full mt-0.5"
              style={{ backgroundColor: badge.bg, color: badge.text }}>
              {isRTL ? badge.ar : badge.en}
            </span>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="m-3 flex-1 overflow-y-auto px-2 py-3 space-y-1">
        {visibleItems.map(item => {
          const active = isActive(item);
          const isOpen = openSections[item.key] ?? false;

          if (!item.children) {
            return (
              <Link key={item.key} href={item.href!} onClick={closeMobile}
                className={["group flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[15px] font-medium transition-all duration-200 hover:-translate-y-[1px]",
                  active ? "bg-[#EBF5F7] text-[#107789]" : "text-[#4B5563] hover:bg-[#F5F7F9] hover:text-[#107789]",
                ].join(" ")}>
                <span className={active ? "text-[#107789]" : "text-[#9CA3AF] group-hover:text-[#107789]"}>{item.icon}</span>
                <span className="flex-1">{t(item.labelEn, item.labelAr)}</span>
                {active && <span className="h-1.5 w-1.5 rounded-full bg-[#107789]" />}
              </Link>
            );
          }

          return (
            <div key={item.key}>
              <button type="button" onClick={() => toggle(item.key)}
                className={["group flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-[15px] font-medium transition-all duration-200 hover:-translate-y-[1px] hover:bg-[#F8FAFB]",
                  active ? "text-[#107789]" : "text-[#4B5563] hover:text-[#107789]",
                ].join(" ")}
                aria-expanded={isOpen}>
                <span className={active ? "text-[#107789]" : "text-[#9CA3AF] group-hover:text-[#107789]"}>{item.icon}</span>
                <span className="flex-1 text-start">{t(item.labelEn, item.labelAr)}</span>
                <span className={["text-[#9CA3AF] transition-transform duration-300", isOpen ? "rotate-180" : ""].join(" ")}>{IC.chevron}</span>
              </button>
              <SectionChildren isOpen={isOpen} isRTL={isRTL} childrenItems={item.children}
                pathname={pathname} t={t} onNavigate={closeMobile} />
            </div>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="flex-shrink-0 border-t border-[#F0F2F5] px-2 py-3 space-y-1">
        <Link href="/settings" onClick={closeMobile}
          className="group flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[14.5px] font-medium text-[#6B7280] hover:bg-[#F5F7F9] hover:text-[#107789] transition-all">
          <span className="text-[#9CA3AF] group-hover:text-[#107789]">{IC.settings}</span>
          {t("Settings", "الإعدادات")}
        </Link>
        <button type="button" onClick={handleLogout}
          className="group w-full flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[14.5px] font-medium text-[#6B7280] hover:bg-[#FEF2F2] hover:text-[#DC2626] transition-all">
          <span className="text-[#9CA3AF] group-hover:text-[#DC2626]">{IC.logout}</span>
          {t("Sign Out", "تسجيل الخروج")}
        </button>
      </div>
    </div>
  );

  const sideEdge = isRTL ? "border-l" : "border-r";
  const mobileEdge = isRTL ? "right-0" : "left-0";
  const mobileHidden = isRTL ? "translate-x-full" : "-translate-x-full";

  return (
    <>
      {/* Desktop */}
      <aside className={["sticky top-0 hidden h-screen w-60 flex-shrink-0 bg-white md:flex md:flex-col border-[#F0F2F5]", sideEdge].join(" ")}>
        <Content />
      </aside>

      {/* Mobile toggle */}
      <button type="button" onClick={() => setMobileOpen(true)}
        className="fixed top-4 start-4 z-50 flex h-10 w-10 items-center justify-center rounded-xl border border-[#F0F2F5] bg-white text-[#4B5563] shadow-sm md:hidden active:scale-95 transition-all">
        {IC.menu}
      </button>

      {/* Overlay */}
      <div onClick={closeMobile}
        className={["fixed inset-0 z-40 bg-black/30 backdrop-blur-[1px] transition-all duration-300 md:hidden", mobileOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"].join(" ")} />

      {/* Mobile drawer */}
      <aside className={["fixed top-0 z-50 h-full w-60 bg-white shadow-2xl transition-transform duration-300 ease-out md:hidden", mobileEdge, mobileOpen ? "translate-x-0" : mobileHidden].join(" ")}
        dir={isRTL ? "rtl" : "ltr"}>
        <button type="button" onClick={closeMobile}
          className="absolute end-3 top-4 flex h-8 w-8 items-center justify-center rounded-lg bg-[#F5F7F9] text-[#9CA3AF] hover:bg-[#EEF2F5] active:scale-95 transition-all">
          {IC.close}
        </button>
        <Content />
      </aside>
    </>
  );
}