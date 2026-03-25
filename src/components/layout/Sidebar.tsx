"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/src/contexts/LanguageContext";

// ─── Types ────────────────────────────────────────────────────
interface NavChild {
  key: string;
  labelEn: string;
  labelAr: string;
  href: string;
}

interface NavItem {
  key: string;
  labelEn: string;
  labelAr: string;
  href?: string;
  icon: React.ReactNode;
  children?: NavChild[];
}

// ─── Icons ────────────────────────────────────────────────────
const Icons = {
  dashboard: (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
    </svg>
  ),
  student: (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  ),
  teacher: (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  parent: (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  sales: (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  ),
  admin: (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  settings: (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),
  chevron: (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  ),
  menu: (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  ),
  close: (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
};

// ─── Menu Data ────────────────────────────────────────────────
const navItems: NavItem[] = [
  {
    key: "dashboard",
    labelEn: "Dashboard",
    labelAr: "لوحة التحكم",
    href: "/",
    icon: Icons.dashboard,
  },
  {
    key: "student",
    labelEn: "Student",
    labelAr: "الطلاب",
    icon: Icons.student,
    children: [
      { key: "student-dashboard", labelEn: "Dashboard", labelAr: "الرئيسية", href: "/student/dashboard" },
      { key: "student-learning", labelEn: "Learning", labelAr: "التعلم", href: "/student/learning" },
      { key: "student-classes", labelEn: "Classes", labelAr: "الحصص", href: "/student/classes" },
      { key: "student-payments", labelEn: "Payments", labelAr: "المدفوعات", href: "/student/payments" },
    ],
  },
  {
    key: "teacher",
    labelEn: "Teacher",
    labelAr: "المعلمون",
    icon: Icons.teacher,
    children: [
      { key: "teacher-dashboard", labelEn: "Dashboard", labelAr: "الرئيسية", href: "/teacher/dashboard" },
      { key: "teacher-classes", labelEn: "Classes", labelAr: "الحصص", href: "/teacher/classes" },
      { key: "teacher-evaluation", labelEn: "Evaluation", labelAr: "التقييم", href: "/teacher/evaluation" },
      { key: "teacher-wallet", labelEn: "Wallet", labelAr: "المحفظة", href: "/teacher/wallet" },
    ],
  },
  {
    key: "parent",
    labelEn: "Parent",
    labelAr: "أولياء الأمور",
    icon: Icons.parent,
    children: [
      { key: "parent-dashboard", labelEn: "Dashboard", labelAr: "الرئيسية", href: "/parent/dashboard" },
      { key: "parent-payments", labelEn: "Payments", labelAr: "المدفوعات", href: "/parent/payments" },
    ],
  },
  {
    key: "sales",
    labelEn: "Sales",
    labelAr: "المبيعات",
    icon: Icons.sales,
    children: [
        { key: "sales-dashboard", labelEn: "Dashboard", labelAr: "الرئيسية", href: "/sales/dashboard" },
      { key: "sales-leads", labelEn: "Leads", labelAr: "العملاء المحتملون", href: "/sales/leads" },
      { key: "sales-trials", labelEn: "Trials", labelAr: "الحصص التجريبية", href: "/sales/trials" },
    
    ],
  },
  {
    key: "admin",
    labelEn: "Admin",
    labelAr: "الإدارة",
    icon: Icons.admin,
    children: [
      { key: "admin-users", labelEn: "Users", labelAr: "المستخدمون", href: "/admin/users" },
      { key: "admin-courses", labelEn: "Courses", labelAr: "المقررات", href: "/admin/courses" },
      { key: "admin-scheduling", labelEn: "Scheduling", labelAr: "الجدولة", href: "/admin/schedule" },
      { key: "admin-packages", labelEn: "Packages", labelAr: "الباقات", href: "/admin/packages" },
      { key: "admin-reports", labelEn: "Reports", labelAr: "التقارير", href: "/admin/reports" },
    ],
  },
];

// ─── Helpers ──────────────────────────────────────────────────
function getInitialOpenState(pathname: string) {
  const open: Record<string, boolean> = {};

  navItems.forEach((item) => {
    if (!item.children) return;

    const hasActiveChild = item.children.some(
      (child) => pathname === child.href || pathname.startsWith(child.href + "/")
    );

    if (hasActiveChild) {
      open[item.key] = true;
    }
  });

  return open;
}

function SectionChildren({
  isOpen,
  isRTL,
  childrenItems,
  pathname,
  t,
  onNavigate,
}: {
  isOpen: boolean;
  isRTL: boolean;
  childrenItems: NavChild[];
  pathname: string;
  t: (en: string, ar: string) => string;
  onNavigate: () => void;
}) {
  return (
    <div
      className={[
        "grid transition-all duration-300 ease-out",
        isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
      ].join(" ")}
    >
      <div className="overflow-hidden">
        <div
          className={[
            "mt-1 space-y-1 py-1",
            isRTL ? "me-4 border-r border-[#F0F2F5] pe-3" : "ms-4 border-l border-[#F0F2F5] ps-3",
          ].join(" ")}
        >
          {childrenItems.map((child, index) => {
            const active = pathname === child.href || pathname.startsWith(child.href + "/");

            return (
              <Link
                key={child.key}
                href={child.href}
                onClick={onNavigate}
                className={[
                  "group flex translate-y-0 items-center gap-2 rounded-xl px-2.5 py-2 text-[14.5px] font-medium",
                  "transition-all duration-200 ease-out",
                  active
                    ? "bg-[#EBF5F7] text-[#107789] shadow-[inset_0_0_0_1px_rgba(16,119,137,0.08)]"
                    : "text-[#6B7280] hover:bg-[#F5F7F9] hover:text-[#107789]",
                  isOpen ? "opacity-100" : "pointer-events-none opacity-0",
                ].join(" ")}
                style={{
                  transitionDelay: isOpen ? `${index * 35}ms` : "0ms",
                }}
              >
                <span
                  className={[
                    "h-1.5 w-1.5 flex-shrink-0 rounded-full transition-all duration-200",
                    active ? "bg-[#107789] scale-100" : "bg-[#D1D5DB] scale-75 group-hover:bg-[#107789]",
                  ].join(" ")}
                />
                <span>{t(child.labelEn, child.labelAr)}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────
export default function Sidebar() {
  const pathname = usePathname();
  const { isRTL, t } = useLanguage();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setOpenSections((prev) => ({
      ...prev,
      ...getInitialOpenState(pathname),
    }));
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };

    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const sidebarSideClass = isRTL ? "border-l" : "border-r";
  const mobileSideClass = isRTL ? "right-0" : "left-0";
  const mobileClosedTransform = isRTL ? "translate-x-full" : "-translate-x-full";

  const normalizedItems = useMemo(() => navItems, []);

  const isChildActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  const isSectionActive = (item: NavItem) => {
    if (item.href) return pathname === item.href;
    return item.children?.some((child) => isChildActive(child.href)) ?? false;
  };

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const closeMobileMenu = () => setMobileOpen(false);

  const SidebarContent = () => (
    <div className="flex h-full flex-col bg-white" dir={isRTL ? "rtl" : "ltr"}>
      <nav className="m-3 flex-1 overflow-y-auto px-2 py-3">
        {normalizedItems.map((item) => {
          const sectionActive = isSectionActive(item);
          const isOpen = openSections[item.key] ?? false;

          if (!item.children) {
            return (
              <Link
                key={item.key}
                href={item.href!}
                onClick={closeMobileMenu}
                className={[
                  "group mb-1 flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[15px] font-medium",
                  "transition-all duration-200 ease-out",
                  "hover:-translate-y-[1px] hover:shadow-sm",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#107789]/20",
                  sectionActive
                    ? "bg-[#EBF5F7] text-[#107789] shadow-[inset_0_0_0_1px_rgba(16,119,137,0.08)]"
                    : "text-[#4B5563] hover:bg-[#F5F7F9] hover:text-[#107789]",
                ].join(" ")}
              >
                <span
                  className={[
                    "transition-colors duration-200",
                    sectionActive ? "text-[#107789]" : "text-[#9CA3AF] group-hover:text-[#107789]",
                  ].join(" ")}
                >
                  {item.icon}
                </span>

                <span className="flex-1">{t(item.labelEn, item.labelAr)}</span>

                <span
                  className={[
                    "h-1.5 w-1.5 rounded-full transition-all duration-200",
                    sectionActive ? "scale-100 bg-[#107789]" : "scale-0 bg-transparent",
                  ].join(" ")}
                />
              </Link>
            );
          }

          return (
            <div key={item.key} className="mb-2">
              <button
                type="button"
                onClick={() => toggleSection(item.key)}
                className={[
                  "group flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-[15px] font-medium",
                  "transition-all duration-200 ease-out",
                  "hover:-translate-y-[1px] hover:bg-[#F8FAFB]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#107789]/20",
                  sectionActive ? "text-[#107789]" : "text-[#4B5563] hover:text-[#107789]",
                ].join(" ")}
                aria-expanded={isOpen}
                aria-controls={`section-${item.key}`}
              >
                <span
                  className={[
                    "transition-colors duration-200",
                    sectionActive ? "text-[#107789]" : "text-[#9CA3AF] group-hover:text-[#107789]",
                  ].join(" ")}
                >
                  {item.icon}
                </span>

                <span className="flex-1 text-start">{t(item.labelEn, item.labelAr)}</span>

                <span
                  className={[
                    "text-[#9CA3AF] transition-transform duration-300 ease-out",
                    isOpen ? "rotate-180" : "rotate-0",
                  ].join(" ")}
                >
                  {Icons.chevron}
                </span>
              </button>

              <div id={`section-${item.key}`}>
                <SectionChildren
                  isOpen={isOpen}
                  isRTL={isRTL}
                  childrenItems={item.children}
                  pathname={pathname}
                  t={t}
                  onNavigate={closeMobileMenu}
                />
              </div>
            </div>
          );
        })}
      </nav>

      <div className="flex-shrink-0 border-t border-[#F0F2F5] px-2 py-3">
        <Link
          href="/settings"
          onClick={closeMobileMenu}
          className={[
            "group flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[14.5px] font-medium",
            "text-[#6B7280] transition-all duration-200 ease-out",
            "hover:-translate-y-[1px] hover:bg-[#F5F7F9] hover:text-[#107789]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#107789]/20",
          ].join(" ")}
        >
          <span className="text-[#9CA3AF] transition-colors duration-200 group-hover:text-[#107789]">
            {Icons.settings}
          </span>
          <span>{t("Settings", "الإعدادات")}</span>
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={[
          "sticky top-0 hidden h-screen w-60 flex-shrink-0 bg-white md:flex md:flex-col",
          "border-[#F0F2F5]",
          sidebarSideClass,
        ].join(" ")}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Menu Button */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className={[
          "fixed top-4 start-4 z-50 flex h-10 w-10 items-center justify-center rounded-xl border border-[#F0F2F5]",
          "bg-white text-[#4B5563] shadow-sm transition-all duration-200 md:hidden",
          "hover:-translate-y-[1px] hover:shadow-md active:scale-95",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#107789]/20",
        ].join(" ")}
        aria-label={t("Open menu", "فتح القائمة")}
        aria-expanded={mobileOpen}
      >
        {Icons.menu}
      </button>

      {/* Mobile Overlay */}
      <div
        onClick={closeMobileMenu}
        className={[
          "fixed inset-0 z-40 bg-black/30 backdrop-blur-[1px] transition-all duration-300 md:hidden",
          mobileOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        ].join(" ")}
      />

      {/* Mobile Sidebar */}
      <aside
        className={[
          "fixed top-0 z-50 h-full w-60 bg-white shadow-2xl transition-transform duration-300 ease-out md:hidden",
          mobileSideClass,
          mobileOpen ? "translate-x-0" : mobileClosedTransform,
        ].join(" ")}
        dir={isRTL ? "rtl" : "ltr"}
      >
        <button
          type="button"
          onClick={closeMobileMenu}
          className={[
            "absolute end-3 top-4 flex h-8 w-8 items-center justify-center rounded-lg bg-[#F5F7F9] text-[#9CA3AF]",
            "transition-all duration-200 hover:bg-[#EEF2F5] hover:text-[#4B5563] active:scale-95",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#107789]/20",
          ].join(" ")}
          aria-label={t("Close menu", "إغلاق القائمة")}
        >
          {Icons.close}
        </button>

        <SidebarContent />
      </aside>
    </>
  );
}