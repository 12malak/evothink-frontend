"use client";

import { useLanguage } from "@/src/contexts/LanguageContext";

// ─── Stat Cards ───────────────────────────────────────────────
const stats = [
  {
    label: "Total Students", labelAr: "إجمالي الطلاب",
    value: "3,482", change: "+12%", positive: true,
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>,
    color: "#107789", bg: "#EBF5F7",
  },
  {
    label: "Active Teachers", labelAr: "المعلمون النشطون",
    value: "148", change: "+4%", positive: true,
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    color: "#7c3aed", bg: "#ede9fe",
  },
  {
    label: "Total Revenue", labelAr: "إجمالي الإيرادات",
    value: "$84,230", change: "+8.3%", positive: true,
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
    color: "#059669", bg: "#d1fae5",
  },
  {
    label: "Pending Enrollments", labelAr: "التسجيلات المعلقة",
    value: "57", change: "-3%", positive: false,
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
    color: "#d97706", bg: "#fef3c7",
  },
];

// ─── Recent Activity ───────────────────────────────────────────
const recentActivity = [
  { name:"Sara Al-Rashid",  role:"Student", roleAr:"طالب",  action:"Enrolled in Math 101",    actionAr:"سجل في مادة الرياضيات 101", time:"2 min ago",  timeAr:"منذ دقيقتين",   avatar:"S", color:"#107789", bg:"#EBF5F7" },
  { name:"Mr. Khalid Nasser",role:"Teacher", roleAr:"معلم", action:"Uploaded new lesson",     actionAr:"رفع درس جديد",              time:"18 min ago", timeAr:"منذ 18 دقيقة",  avatar:"K", color:"#7c3aed", bg:"#ede9fe" },
  { name:"Layla Hassan",    role:"Student", roleAr:"طالب",  action:"Submitted assignment",    actionAr:"سلّم الواجب",               time:"35 min ago", timeAr:"منذ 35 دقيقة",  avatar:"L", color:"#059669", bg:"#d1fae5" },
  { name:"Ms. Rima Yousef", role:"Teacher", roleAr:"معلم",  action:"Graded Quiz #4",          actionAr:"صحّح الاختبار الرابع",      time:"1 hr ago",   timeAr:"منذ ساعة",      avatar:"R", color:"#d97706", bg:"#fef3c7" },
];

// ─── Monthly Data ─────────────────────────────────────────────
const monthlyData = [
  { month:"Sep", monthAr:"سبت", value:60 },
  { month:"Oct", monthAr:"أكت", value:75 },
  { month:"Nov", monthAr:"نوف", value:55 },
  { month:"Dec", monthAr:"ديس", value:80 },
  { month:"Jan", monthAr:"ينا", value:70 },
  { month:"Feb", monthAr:"فبر", value:90 },
  { month:"Mar", monthAr:"مار", value:85 },
];

// ─── Top Courses ──────────────────────────────────────────────
const topCourses = [
  { name:"Mathematics 101",   nameAr:"رياضيات 101",    teacher:"Mr. Ahmad",  teacherAr:"أ. أحمد",  enrolled:312, capacity:350, completion:89, status:"Active", statusAr:"نشط"    },
  { name:"English Literature", nameAr:"أدب إنجليزي",   teacher:"Ms. Nora",   teacherAr:"أ. نورا",  enrolled:278, capacity:300, completion:74, status:"Active", statusAr:"نشط"    },
  { name:"Physics Advanced",  nameAr:"فيزياء متقدم",   teacher:"Dr. Samir",  teacherAr:"د. سمير",  enrolled:190, capacity:250, completion:62, status:"Active", statusAr:"نشط"    },
  { name:"Arabic Language",   nameAr:"اللغة العربية",  teacher:"Mr. Tariq",  teacherAr:"أ. طارق",  enrolled:340, capacity:340, completion:95, status:"Full",   statusAr:"ممتلئ"  },
  { name:"Chemistry Basics",  nameAr:"كيمياء أساسية",  teacher:"Ms. Dina",   teacherAr:"أ. دينا",  enrolled:145, capacity:200, completion:51, status:"Active", statusAr:"نشط"    },
];

// ─── Quick Overview ───────────────────────────────────────────
const overviewItems = [
  { label:"Attendance Rate",       labelAr:"نسبة الحضور",    value:92, color:"#107789" },
  { label:"Assignment Completion", labelAr:"إتمام الواجبات", value:78, color:"#7c3aed" },
  { label:"Pass Rate",             labelAr:"نسبة النجاح",    value:86, color:"#059669" },
];

// ─── Bar Chart — FIXED ────────────────────────────────────────
function BarChart({ isRTL }: { isRTL: boolean }) {
  const max    = Math.max(...monthlyData.map(d => d.value));
  const cH     = 120;   // chart area height
  const bW     = 32;    // bar width
  const gap    = 12;    // gap between bars
  const topPad = 28;    // ← enough room above tallest bar for the label pill
  const botPad = 32;    // room for month labels below
  const totalW = monthlyData.length * (bW + gap) - gap;

  // viewBox: start at -topPad vertically so labels above y=0 are visible
  const vb = `0 -${topPad} ${totalW + 10} ${cH + topPad + botPad}`;

  return (
    <div className="w-full">
      <svg
        viewBox={vb}
        preserveAspectRatio="xMidYMid meet"
        style={{ width: "100%", height: "auto", display: "block" }}
      >
        {monthlyData.map((d, i) => {
          const bH     = Math.max(4, (d.value / max) * cH);
          const x      = i * (bW + gap);
          const y      = cH - bH;
          const isTop  = d.month === "Mar"; // tallest / highlight bar
          const fill   = isTop ? "#107789" : "#E2EFF1";

          // Approx pill width based on text length
          const labelText = String(d.value);
          const pillW     = labelText.length * 6.5 + 12;
          const pillH     = 16;
          const labelY    = y - 8;   // text baseline — sits 8px above bar top

          return (
            <g key={i}>
              {/* Bar background track */}
              <rect x={x} y={0} width={bW} height={cH} rx={6} fill="#F8FAFC" />

              {/* Bar fill */}
              <rect
                x={x} y={y} width={bW} height={bH} rx={6} fill={fill}
                style={{ transition: `height .7s ${i * 0.08}s ease, y .7s ${i * 0.08}s ease` }}
              />

              {/* Highlighted bar: teal pill with white value */}
              {isTop && (
                <g>
                  <rect
                    x={x + bW / 2 - pillW / 2}
                    y={labelY - pillH + 3}
                    width={pillW}
                    height={pillH}
                    rx={pillH / 2}
                    fill="#107789"
                  />
                  <text
                    x={x + bW / 2}
                    y={labelY}
                    textAnchor="middle"
                    fontSize="10"
                    fontWeight="800"
                    fill="white"
                    fontFamily="system-ui, sans-serif"
                  >
                    {labelText}
                  </text>
                </g>
              )}

              {/* Other bars: small muted value above */}
              {!isTop && (
                <text
                  x={x + bW / 2}
                  y={y - 5}
                  textAnchor="middle"
                  fontSize="9"
                  fontWeight="600"
                  fill="#94a3b8"
                  fontFamily="system-ui, sans-serif"
                >
                  {d.value}
                </text>
              )}

              {/* Month label */}
              <text
                x={x + bW / 2}
                y={cH + 18}
                textAnchor="middle"
                fontSize="11"
                fill="#94a3b8"
                fontFamily="system-ui, sans-serif"
              >
                {isRTL ? d.monthAr : d.month}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ─── Progress Bar ─────────────────────────────────────────────
function ProgressBar({ value, color }: { value: number; color: string }) {
  return (
    <div style={{ background: "#F1F5F9", borderRadius: 99, height: 8, overflow: "hidden", flex: 1 }}>
      <div style={{ width: `${value}%`, background: color, height: "100%", borderRadius: 99, transition: "width 0.7s ease" }} />
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────
export default function HomePage() {
  const { t, isRTL } = useLanguage();

  const statusColor = (status: string) =>
    status === "Full"
      ? { color: "#d97706", bg: "#fef3c7" }
      : { color: "#059669", bg: "#d1fae5" };

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="flex min-h-screen bg-[#F5F7F9]">
      <div className="flex flex-col flex-1 min-w-0">
        <main className="flex-1 p-4 sm:p-6 space-y-5 sm:space-y-6 overflow-auto">

          {/* ── Stat Cards ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {stats.map((s) => (
              <div key={s.label} className="bg-white rounded-2xl p-5 flex gap-4 items-start shadow-sm border border-[#F1F5F9] hover:shadow-md hover:border-[#b2dce4] transition-all duration-300">
                <div className="rounded-xl p-3 flex-shrink-0" style={{ backgroundColor: s.bg, color: s.color }}>
                  {s.icon}
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-[#94a3b8] font-medium truncate">{t(s.label, s.labelAr)}</p>
                  <p className="text-2xl font-bold text-[#1e293b] mt-0.5">{s.value}</p>
                  <p className="text-xs mt-1 font-medium" style={{ color: s.positive ? "#059669" : "#ef4444" }}>
                    {s.change}{" "}
                    <span className="text-[#94a3b8] font-normal">{t("vs last month", "مقارنة بالشهر الماضي")}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* ── Chart + Quick Overview ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

            {/* Bar Chart */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#F1F5F9] lg:col-span-2 hover:shadow-md transition-all duration-300">
              <p className="font-bold text-[#1e293b] text-sm">{t("Monthly Enrollments", "التسجيلات الشهرية")}</p>
              <p className="text-xs text-[#94a3b8] mb-4 mt-0.5">{t("Students enrolled per month", "عدد الطلاب المسجلين شهريًا")}</p>
              <BarChart isRTL={isRTL} />
            </div>

            {/* Quick Overview */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#F1F5F9] flex flex-col justify-between hover:shadow-md transition-all duration-300">
              <div>
                <p className="font-bold text-[#1e293b] text-sm mb-0.5">{t("Quick Overview", "نظرة سريعة")}</p>
                <p className="text-xs text-[#94a3b8] mb-5">{t("Key performance metrics", "مؤشرات الأداء الرئيسية")}</p>
                <div className="space-y-5">
                  {overviewItems.map((item) => (
                    <div key={item.label}>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-xs text-[#64748b] font-medium">{t(item.label, item.labelAr)}</span>
                        <span className="text-xs font-bold" style={{ color: item.color }}>{item.value}%</span>
                      </div>
                      <ProgressBar value={item.value} color={item.color} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Top Courses Table ── */}
          <div className="bg-white rounded-2xl shadow-sm border border-[#F1F5F9] overflow-hidden hover:shadow-md transition-all duration-300">
            <div className="p-5 border-b border-[#F1F5F9]">
              <p className="font-bold text-[#1e293b] text-sm">{t("Top Courses", "أفضل الكورسات")}</p>
              <p className="text-xs text-[#94a3b8] mt-0.5">{t("Enrollment and completion overview", "نظرة على التسجيل والإتمام")}</p>
            </div>

            {/* Mobile: card list */}
            <div className="sm:hidden divide-y divide-[#F8FAFC]">
              {topCourses.map((course, i) => {
                const sc = statusColor(course.status);
                return (
                  <div key={i} className="p-4 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-bold text-[#1e293b] truncate">{t(course.name, course.nameAr)}</p>
                      <span className="flex-shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-bold"
                        style={{ backgroundColor: sc.bg, color: sc.color }}>
                        {t(course.status, course.statusAr)}
                      </span>
                    </div>
                    <p className="text-xs text-[#94a3b8]">{t(course.teacher, course.teacherAr)}</p>
                    <div className="flex items-center gap-2">
                      <ProgressBar value={course.completion} color="#107789" />
                      <span className="text-xs font-bold text-[#107789] whitespace-nowrap flex-shrink-0">{course.completion}%</span>
                    </div>
                    <p className="text-xs text-[#94a3b8]">
                      {course.enrolled}<span className="text-[#cbd5e1]">/{course.capacity}</span> {t("enrolled","مسجل")}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Desktop: full table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#F8FAFC" }}>
                    {[t("Course","الكورس"), t("Teacher","المعلم"), t("Enrolled","المسجلون"), t("Completion","الإتمام"), t("Status","الحالة")].map((h) => (
                      <th key={h} className="px-4 py-3 text-start text-xs font-semibold uppercase tracking-wide text-[#94a3b8] whitespace-nowrap border-b border-[#F1F5F9]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {topCourses.map((course, i) => {
                    const sc = statusColor(course.status);
                    return (
                      <tr key={i} className="hover:bg-[#F8FAFC] transition-colors border-b border-[#F1F5F9] last:border-0">
                        <td className="px-4 py-3.5 font-semibold text-[#1e293b]">{t(course.name, course.nameAr)}</td>
                        <td className="px-4 py-3.5 text-[#64748b]">{t(course.teacher, course.teacherAr)}</td>
                        <td className="px-4 py-3.5 text-[#475569]">
                          {course.enrolled}<span className="text-[#94a3b8] text-[11px]">/{course.capacity}</span>
                        </td>
                        <td className="px-4 py-3.5" style={{ minWidth: 130 }}>
                          <div className="flex items-center gap-2">
                            <ProgressBar value={course.completion} color="#107789" />
                            <span className="text-[11px] font-bold text-[#107789] whitespace-nowrap">{course.completion}%</span>
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="rounded-full px-2.5 py-0.5 text-[11px] font-bold"
                            style={{ backgroundColor: sc.bg, color: sc.color }}>
                            {t(course.status, course.statusAr)}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Recent Activity ── */}
          <div className="bg-white rounded-2xl shadow-sm border border-[#F1F5F9] overflow-hidden hover:shadow-md transition-all duration-300">
            <div className="p-5 border-b border-[#F1F5F9]">
              <p className="font-bold text-[#1e293b] text-sm">{t("Recent Activity", "النشاط الأخير")}</p>
              <p className="text-xs text-[#94a3b8] mt-0.5">{t("Latest actions across the platform", "آخر الأنشطة في النظام")}</p>
            </div>

            {/* Mobile: card list */}
            <div className="sm:hidden divide-y divide-[#F8FAFC]">
              {recentActivity.map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-4">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
                    style={{ backgroundColor: item.bg, color: item.color }}>
                    {item.avatar}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-bold text-[#1e293b] truncate">{item.name}</p>
                      <span className="text-[10px] text-[#94a3b8] whitespace-nowrap flex-shrink-0">{t(item.time, item.timeAr)}</span>
                    </div>
                    <p className="text-xs text-[#64748b] mt-0.5">{t(item.action, item.actionAr)}</p>
                    <span className="inline-flex mt-1.5 rounded-full px-2 py-0.5 text-[10px] font-bold"
                      style={{ backgroundColor: item.bg, color: item.color }}>
                      {t(item.role, item.roleAr)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop: full table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#F8FAFC" }}>
                    {[t("User","المستخدم"), t("Role","الدور"), t("Action","الإجراء"), t("Time","الوقت")].map((h) => (
                      <th key={h} className="px-4 py-3 text-start text-xs font-semibold uppercase tracking-wide text-[#94a3b8] whitespace-nowrap border-b border-[#F1F5F9]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentActivity.map((item, i) => (
                    <tr key={i} className="hover:bg-[#F8FAFC] transition-colors border-b border-[#F1F5F9] last:border-0">
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-[13px] flex-shrink-0"
                            style={{ backgroundColor: item.bg, color: item.color }}>
                            {item.avatar}
                          </div>
                          <span className="font-semibold text-[#1e293b]">{item.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="rounded-full px-2.5 py-0.5 text-[11px] font-bold"
                          style={{ backgroundColor: item.bg, color: item.color }}>
                          {t(item.role, item.roleAr)}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-[#475569]">{t(item.action, item.actionAr)}</td>
                      <td className="px-4 py-3.5 text-[#94a3b8] text-xs whitespace-nowrap">{t(item.time, item.timeAr)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}