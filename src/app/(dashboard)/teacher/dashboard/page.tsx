"use client";

import { useRouter } from "next/navigation";
import { useLanguage } from "@/src/contexts/LanguageContext";

// ─── Types ────────────────────────────────────────────────────
type ClassStatus = "upcoming" | "completed" | "missed" | "in-progress";
type ClassType   = "trial" | "normal";

interface TodayClass {
  id:      string;
  time:    string;
  student: string;
  avatar:  string;
  level:   string;
  status:  ClassStatus;
  type:    ClassType;
}

interface UpcomingSession {
  id:      string;
  student: string;
  avatar:  string;
  time:    string;
  date:    string;
  type:    ClassType;
}

interface ActivityItem {
  id:     string;
  actor:  string;
  avatar: string;
  action: { en: string; ar: string };
  time:   string;
  color:  string;
}

// ─── Mock Data ────────────────────────────────────────────────
const todayClasses: TodayClass[] = [
  { id: "c1", time: "09:00 AM", student: "Sara Al-Rashid",    avatar: "SA", level: "B2 Upper-Intermediate", status: "completed",    type: "normal" },
  { id: "c2", time: "11:00 AM", student: "Omar Khalid",       avatar: "OK", level: "A1 Beginner",           status: "in-progress",  type: "trial"  },
  { id: "c3", time: "01:00 PM", student: "Lina Hassan",       avatar: "LH", level: "B1 Intermediate",       status: "upcoming",     type: "normal" },
  { id: "c4", time: "03:00 PM", student: "Faisal Al-Mutairi", avatar: "FA", level: "C1 Advanced",           status: "upcoming",     type: "normal" },
  { id: "c5", time: "05:00 PM", student: "Noor Al-Amin",      avatar: "NA", level: "A2 Elementary",         status: "missed",       type: "trial"  },
];

const upcomingSessions: UpcomingSession[] = [
  { id: "s1", student: "Khalid Mansoor",   avatar: "KM", time: "10:00 AM", date: "Tomorrow",  type: "normal" },
  { id: "s2", student: "Reem Al-Jabri",    avatar: "RJ", time: "02:00 PM", date: "Tomorrow",  type: "trial"  },
  { id: "s3", student: "Ahmed Al-Zahrani", avatar: "AZ", time: "09:00 AM", date: "Wednesday", type: "normal" },
  { id: "s4", student: "Dina Yousef",      avatar: "DY", time: "04:00 PM", date: "Thursday",  type: "trial"  },
];

const activities: ActivityItem[] = [
  { id: "a1", actor: "Sara Al-Rashid",    avatar: "SA", action: { en: "Completed her B2 lesson session",      ar: "أكملت جلسة درس B2 الخاصة بها"    }, time: "2h ago",    color: "#059669" },
  { id: "a2", actor: "You",               avatar: "ME", action: { en: "Submitted evaluation for Omar Khalid", ar: "أرسلت تقييم عمر خالد"              }, time: "3h ago",    color: "#107789" },
  { id: "a3", actor: "Noor Al-Amin",      avatar: "NA", action: { en: "Missed scheduled trial class",         ar: "غابت عن الحصة التجريبية المجدولة"  }, time: "5h ago",    color: "#ef4444" },
  { id: "a4", actor: "Faisal Al-Mutairi", avatar: "FA", action: { en: "Booked a new class for next week",     ar: "حجز حصة جديدة للأسبوع القادم"      }, time: "Yesterday", color: "#7c3aed" },
  { id: "a5", actor: "Lina Hassan",       avatar: "LH", action: { en: "Reached B1 level milestone",           ar: "وصلت إلى مرحلة مستوى B1"            }, time: "Yesterday", color: "#d97706" },
];

const overviewMetrics = [
  { labelEn: "Attendance Rate",   labelAr: "معدل الحضور",   value: 88, color: "#107789" },
  { labelEn: "Completion Rate",   labelAr: "معدل الإكمال",   value: 92, color: "#059669" },
  { labelEn: "Performance Score", labelAr: "مؤشر الأداء",   value: 76, color: "#7c3aed" },
];

// ─── Status Config ─────────────────────────────────────────────
const statusConfig: Record<ClassStatus, { bg: string; text: string; labelEn: string; labelAr: string }> = {
  upcoming:     { bg: "#EBF5F7", text: "#107789", labelEn: "Upcoming",    labelAr: "قادمة"      },
  completed:    { bg: "#d1fae5", text: "#059669", labelEn: "Completed",   labelAr: "مكتملة"     },
  missed:       { bg: "#fee2e2", text: "#ef4444", labelEn: "Missed",      labelAr: "فائتة"      },
  "in-progress":{ bg: "#ede9fe", text: "#7c3aed", labelEn: "In Progress", labelAr: "جارية الآن" },
};

const typeConfig: Record<ClassType, { bg: string; text: string; labelEn: string; labelAr: string }> = {
  trial:  { bg: "#fef3c7", text: "#d97706", labelEn: "Trial",  labelAr: "تجريبية" },
  normal: { bg: "#e0f2fe", text: "#0369a1", labelEn: "Normal", labelAr: "عادية"   },
};

// ─── Avatar ────────────────────────────────────────────────────
function Avatar({ initials, size = "md" }: { initials: string; size?: "sm" | "md" }) {
  const dim = size === "sm" ? "w-7 h-7 text-[10px]" : "w-9 h-9 text-xs";
  const colors = [
    "bg-[#EBF5F7] text-[#107789]",
    "bg-[#ede9fe] text-[#7c3aed]",
    "bg-[#d1fae5] text-[#059669]",
    "bg-[#fef3c7] text-[#d97706]",
    "bg-[#fee2e2] text-[#ef4444]",
  ];
  const palette = colors[(initials.charCodeAt(0) + (initials.charCodeAt(1) || 0)) % colors.length];
  return (
    <div className={`${dim} ${palette} rounded-full flex items-center justify-center font-bold flex-shrink-0 select-none`}>
      {initials}
    </div>
  );
}

// ─── Stat Card — cardIn animation with stagger delay ──────────
function StatCard({
  icon, value, label, bg, color, delay = 0,
}: {
  icon: React.ReactNode; value: string; label: string;
  bg: string; color: string; delay?: number;
}) {
  return (
    <div
      className="rounded-2xl bg-white border border-[#F1F5F9] shadow-sm p-5 flex items-start gap-4
                 hover:shadow-md hover:border-[#b2dce4] transition-all duration-300"
      style={{ animation: `cardIn .45s ${delay}s cubic-bezier(.34,1.2,.64,1) both` }}
    >
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: bg }}
      >
        <span style={{ color }}>{icon}</span>
      </div>
      <div>
        <p className="text-2xl font-bold text-[#1e293b] leading-none">{value}</p>
        <p className="text-xs text-[#94a3b8] mt-1 font-medium">{label}</p>
      </div>
    </div>
  );
}

// ─── Status Badge ─────────────────────────────────────────────
function StatusBadge({ status, lang }: { status: ClassStatus; lang: string }) {
  const cfg = statusConfig[status];
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
      style={{ backgroundColor: cfg.bg, color: cfg.text }}
    >
      {/* live pulse dot for in-progress */}
      {status === "in-progress" ? (
        <span className="relative flex h-1.5 w-1.5 flex-shrink-0">
          <span
            className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
            style={{ backgroundColor: cfg.text }}
          />
          <span
            className="relative inline-flex rounded-full h-1.5 w-1.5"
            style={{ backgroundColor: cfg.text }}
          />
        </span>
      ) : (
        <span
          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
          style={{ backgroundColor: cfg.text }}
        />
      )}
      {lang === "ar" ? cfg.labelAr : cfg.labelEn}
    </span>
  );
}

// ─── Type Badge ───────────────────────────────────────────────
function TypeBadge({ type, lang }: { type: ClassType; lang: string }) {
  const cfg = typeConfig[type];
  return (
    <span
      className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold"
      style={{ backgroundColor: cfg.bg, color: cfg.text }}
    >
      {lang === "ar" ? cfg.labelAr : cfg.labelEn}
    </span>
  );
}

// ─── Progress Bar — animated width ────────────────────────────
function ProgressBar({ label, value, color, delay = 0 }: {
  label: string; value: number; color: string; delay?: number;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-[#64748b]">{label}</span>
        <span className="text-xs font-bold" style={{ color }}>{value}%</span>
      </div>
      <div className="h-2 bg-[#F1F5F9] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{
            width: `${value}%`,
            backgroundColor: color,
            transition: `width .7s ${delay}s ease`,
          }}
        />
      </div>
    </div>
  );
}

// ─── Icons ────────────────────────────────────────────────────
function IconCalendar() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  );
}
function IconClock() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  );
}
function IconCheck() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="9 12 11 14 15 10"/>
    </svg>
  );
}
function IconWallet() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
      <path d="M16 3H8l-2 4h12l-2-4z"/><circle cx="16" cy="13" r="1.5" fill="currentColor"/>
    </svg>
  );
}
function IconPlay() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
      <polygon points="5 3 19 12 5 21 5 3"/>
    </svg>
  );
}
function IconEye() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  );
}
function IconBell() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  );
}

// ─── Page ──────────────────────────────────────────────────────
export default function TeacherDashboard() {
  const { lang, isRTL, t } = useLanguage();
  const router = useRouter();

  const startClass = (id: string) => { void id; router.push("/class/live"); };

  const today = new Date().toLocaleDateString(lang === "ar" ? "ar-SA" : "en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  const statCards = [
    { icon: <IconCalendar />, value: String(todayClasses.length),                                         label: t("Today's Classes",   "حصص اليوم"),         bg: "#EBF5F7", color: "#107789", delay: 0    },
    { icon: <IconClock />,    value: String(upcomingSessions.length),                                      label: t("Upcoming Sessions", "الجلسات القادمة"),   bg: "#ede9fe", color: "#7c3aed", delay: 0.06 },
    { icon: <IconCheck />,    value: String(todayClasses.filter(c => c.status === "completed").length),    label: t("Completed Today",   "مكتملة اليوم"),       bg: "#d1fae5", color: "#059669", delay: 0.12 },
    { icon: <IconWallet />,   value: "$1,240",                                                             label: t("Total Earnings",    "إجمالي الأرباح"),    bg: "#fef3c7", color: "#d97706", delay: 0.18 },
  ];

  return (
    <>
      {/* ── Global keyframes ── */}
      <style>{`
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(14px) scale(.97); }
          to   { opacity: 1; transform: translateY(0)    scale(1);   }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        @keyframes modalIn {
          from { opacity: 0; transform: scale(.93) translateY(10px); }
          to   { opacity: 1; transform: scale(1)   translateY(0);    }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>

      <main
        className="flex-1 min-h-screen overflow-auto p-6 space-y-6"
        style={{ backgroundColor: "#F5F7F9" }}
        dir={isRTL ? "rtl" : "ltr"}
      >

        {/* ── Page Header — fadeIn ── */}
        <div
          className="flex flex-wrap items-start justify-between gap-3"
          style={{ animation: "fadeIn .4s ease both" }}
        >
          <div>
            <h1 className="text-xl font-bold text-[#1e293b]">
              {t("Teacher Dashboard", "لوحة تحكم المعلم")}
            </h1>
            <p className="mt-0.5 text-sm text-[#94a3b8]">{today}</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative w-9 h-9 rounded-xl bg-white border border-[#F1F5F9] shadow-sm
                               flex items-center justify-center text-[#64748b]
                               hover:text-[#107789] hover:shadow-md hover:border-[#b2dce4]
                               active:scale-95 transition-all duration-200">
              <IconBell />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#ef4444]" />
            </button>
            <button
              onClick={() => router.push("/teacher/schedule")}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white
                         hover:opacity-90 active:scale-95 transition-all duration-200"
              style={{ backgroundColor: "#107789" }}
            >
              <IconCalendar />
              {t("View Schedule", "عرض الجدول")}
            </button>
          </div>
        </div>

        {/* ── Stat Cards — cardIn stagger ── */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {statCards.map((s) => <StatCard key={s.label} {...s} />)}
        </div>

        {/* ── Main Grid ── */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

          {/* Today's Classes Table — cardIn */}
          <section
            className="xl:col-span-2 rounded-2xl bg-white border border-[#F1F5F9] shadow-sm overflow-hidden
                       hover:shadow-md transition-shadow duration-300"
            style={{ animation: "cardIn .45s .22s cubic-bezier(.34,1.2,.64,1) both" }}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#F1F5F9]">
              <div>
                <h2 className="text-sm font-bold text-[#1e293b]">{t("Today's Classes", "حصص اليوم")}</h2>
                <p className="text-xs text-[#94a3b8] mt-0.5">
                  {todayClasses.length} {t("classes scheduled", "حصة مجدولة")}
                </p>
              </div>
              <span className="text-xs text-[#107789] font-semibold cursor-pointer hover:underline transition-all">
                {t("See All", "عرض الكل")}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#F8FAFC]">
                    {[
                      { en: "Time",    ar: "الوقت"     },
                      { en: "Student", ar: "الطالب"    },
                      { en: "Level",   ar: "المستوى"   },
                      { en: "Type",    ar: "النوع"     },
                      { en: "Status",  ar: "الحالة"    },
                      { en: "Actions", ar: "الإجراءات" },
                    ].map((col) => (
                      <th
                        key={col.en}
                        className="px-4 py-3 text-start text-xs font-semibold uppercase tracking-wide text-[#94a3b8] whitespace-nowrap"
                      >
                        {lang === "ar" ? col.ar : col.en}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9]">
                  {todayClasses.map((cls, i) => (
                    <tr
                      key={cls.id}
                      className="hover:bg-[#F8FAFC] transition-colors duration-150"
                      style={{ animation: `cardIn .35s ${0.28 + i * 0.06}s cubic-bezier(.34,1.2,.64,1) both` }}
                    >
                      {/* Time */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className="text-xs font-bold text-[#1e293b]">{cls.time}</span>
                      </td>

                      {/* Student */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <Avatar initials={cls.avatar} />
                          <span className="text-xs font-semibold text-[#1e293b] whitespace-nowrap">{cls.student}</span>
                        </div>
                      </td>

                      {/* Level */}
                      <td className="px-4 py-3.5">
                        <span className="text-xs text-[#64748b]">{cls.level}</span>
                      </td>

                      {/* Type */}
                      <td className="px-4 py-3.5">
                        <TypeBadge type={cls.type} lang={lang} />
                      </td>

                      {/* Status — live pulse for in-progress */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <StatusBadge status={cls.status} lang={lang} />
                          {/* Extra LIVE label for in-progress */}
                          {cls.status === "in-progress" && (
                            <span className="text-[10px] font-black text-[#7c3aed] uppercase tracking-wider">
                              {t("LIVE", "مباشر")}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Actions — active:scale-95 on buttons */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          {(cls.status === "upcoming" || cls.status === "in-progress") && (
                            <button
                              onClick={() => startClass(cls.id)}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-semibold text-white
                                         hover:opacity-90 active:scale-95 transition-all duration-150 whitespace-nowrap"
                              style={{ backgroundColor: cls.status === "in-progress" ? "#7c3aed" : "#107789" }}
                            >
                              <IconPlay />
                              {t("Start Class", "ابدأ الحصة")}
                            </button>
                          )}
                          <button
                            onClick={() => router.push(`/teacher/class/${cls.id}`)}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-semibold
                                       border border-[#F1F5F9] text-[#64748b]
                                       hover:bg-[#F1F5F9] hover:shadow-sm
                                       active:scale-95 transition-all duration-150 whitespace-nowrap"
                          >
                            <IconEye />
                            {t("Details", "التفاصيل")}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Right Column */}
          <div className="flex flex-col gap-6">

            {/* Quick Overview — cardIn */}
            <section
              className="rounded-2xl bg-white border border-[#F1F5F9] shadow-sm p-5 space-y-4
                         hover:shadow-md hover:border-[#b2dce4] transition-all duration-300"
              style={{ animation: "cardIn .45s .28s cubic-bezier(.34,1.2,.64,1) both" }}
            >
              <div>
                <h2 className="text-sm font-bold text-[#1e293b]">{t("Quick Overview", "نظرة سريعة")}</h2>
                <p className="text-xs text-[#94a3b8] mt-0.5">{t("Your performance metrics", "مؤشرات أدائك")}</p>
              </div>

              {/* Progress bars — staggered width transition */}
              {overviewMetrics.map((m, i) => (
                <ProgressBar
                  key={m.labelEn}
                  label={lang === "ar" ? m.labelAr : m.labelEn}
                  value={m.value}
                  color={m.color}
                  delay={0.4 + i * 0.15}
                />
              ))}

              {/* Absences — fadeIn */}
              <div
                className="rounded-xl border border-[#fee2e2] bg-[#fff5f5] p-3 mt-2"
                style={{ animation: "fadeIn .5s .6s both" }}
              >
                <p className="text-[11px] font-bold text-[#ef4444] mb-1">
                  {t("Absences & Penalties", "الغيابات والخصومات")}
                </p>
                <div className="flex items-center justify-between text-xs text-[#64748b]">
                  <span>{t("Total absences", "إجمالي الغيابات")}</span>
                  <span className="font-bold text-[#ef4444]">2</span>
                </div>
                <div className="flex items-center justify-between text-xs text-[#64748b] mt-1">
                  <span>{t("Sessions deducted", "حصص مخصومة")}</span>
                  <span className="font-bold text-[#d97706]">4</span>
                </div>
              </div>
            </section>

            {/* Earnings Summary — cardIn */}
            <section
              className="rounded-2xl bg-white border border-[#F1F5F9] shadow-sm p-5 space-y-3
                         hover:shadow-md hover:border-[#b2dce4] transition-all duration-300"
              style={{ animation: "cardIn .45s .34s cubic-bezier(.34,1.2,.64,1) both" }}
            >
              <h2 className="text-sm font-bold text-[#1e293b]">{t("Earnings Summary", "ملخص الأرباح")}</h2>
              {[
                { labelEn: "This Month",     labelAr: "هذا الشهر",    value: "$1,240", color: "#107789" },
                { labelEn: "Last Month",     labelAr: "الشهر الماضي", value: "$980",   color: "#64748b" },
                { labelEn: "Pending Payout", labelAr: "دفعة معلقة",  value: "$320",   color: "#d97706" },
              ].map((row, i) => (
                <div
                  key={row.labelEn}
                  className="flex items-center justify-between py-1.5 border-b border-[#F1F5F9] last:border-0"
                  style={{ animation: `slideUp .35s ${0.4 + i * 0.08}s ease both` }}
                >
                  <span className="text-xs text-[#64748b]">
                    {lang === "ar" ? row.labelAr : row.labelEn}
                  </span>
                  <span className="text-sm font-bold" style={{ color: row.color }}>{row.value}</span>
                </div>
              ))}
              <button
                onClick={() => router.push("/teacher/wallet")}
                className="w-full py-2 rounded-xl text-xs font-semibold text-[#107789]
                           border border-[#107789]/30
                           hover:bg-[#EBF5F7] hover:shadow-sm
                           active:scale-95 transition-all duration-150 mt-1"
                style={{ animation: "fadeIn .4s .65s both" }}
              >
                {t("View Wallet", "عرض المحفظة")}
              </button>
            </section>
          </div>
        </div>

        {/* ── Bottom Row ── */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

          {/* Upcoming Sessions — cardIn */}
          <section
            className="rounded-2xl bg-white border border-[#F1F5F9] shadow-sm overflow-hidden
                       hover:shadow-md hover:border-[#b2dce4] transition-all duration-300"
            style={{ animation: "cardIn .45s .38s cubic-bezier(.34,1.2,.64,1) both" }}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#F1F5F9]">
              <div>
                <h2 className="text-sm font-bold text-[#1e293b]">{t("Upcoming Sessions", "الجلسات القادمة")}</h2>
                <p className="text-xs text-[#94a3b8] mt-0.5">{t("Next scheduled classes", "الحصص المجدولة التالية")}</p>
              </div>
            </div>
            <div className="divide-y divide-[#F1F5F9]">
              {upcomingSessions.map((s, i) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between px-5 py-3.5
                             hover:bg-[#F8FAFC] transition-colors duration-150"
                  style={{ animation: `slideUp .35s ${0.44 + i * 0.07}s ease both` }}
                >
                  <div className="flex items-center gap-3">
                    <Avatar initials={s.avatar} />
                    <div>
                      <p className="text-xs font-semibold text-[#1e293b]">{s.student}</p>
                      <p className="text-[11px] text-[#94a3b8] mt-0.5">{s.date} · {s.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <TypeBadge type={s.type} lang={lang} />
                    <button
                      onClick={() => startClass(s.id)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-semibold text-white
                                 hover:opacity-90 active:scale-95 transition-all duration-150"
                      style={{ backgroundColor: "#107789" }}
                    >
                      <IconPlay />
                      {t("Start", "ابدأ")}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Recent Activity — cardIn */}
          <section
            className="rounded-2xl bg-white border border-[#F1F5F9] shadow-sm overflow-hidden
                       hover:shadow-md hover:border-[#b2dce4] transition-all duration-300"
            style={{ animation: "cardIn .45s .44s cubic-bezier(.34,1.2,.64,1) both" }}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#F1F5F9]">
              <div>
                <h2 className="text-sm font-bold text-[#1e293b]">{t("Recent Activity", "النشاط الأخير")}</h2>
                <p className="text-xs text-[#94a3b8] mt-0.5">{t("Latest events and updates", "أحدث الأحداث والتحديثات")}</p>
              </div>
            </div>
            <div className="divide-y divide-[#F1F5F9]">
              {activities.map((a, i) => (
                <div
                  key={a.id}
                  className="flex items-start gap-3 px-5 py-3.5
                             hover:bg-[#F8FAFC] transition-colors duration-150"
                  style={{ animation: `slideUp .35s ${0.5 + i * 0.06}s ease both` }}
                >
                  <div
                    className="mt-0.5 w-2 h-2 rounded-full flex-shrink-0 self-center"
                    style={{ backgroundColor: a.color }}
                  />
                  <Avatar initials={a.avatar} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-[#1e293b]">
                      <span className="font-semibold">{a.actor}</span>{" "}
                      <span className="text-[#64748b]">
                        {lang === "ar" ? a.action.ar : a.action.en}
                      </span>
                    </p>
                    <p className="text-[11px] text-[#94a3b8] mt-0.5">{a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

      </main>
    </>
  );
}