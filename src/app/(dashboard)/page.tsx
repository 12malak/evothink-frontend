"use client";

import { useLanguage } from "@/src/contexts/LanguageContext";

// ─── Stat Cards ───────────────────────────────────────────────
const stats = [
  {
    label: "Total Students",
    labelAr: "إجمالي الطلاب",
    value: "3,482",
    change: "+12%",
    positive: true,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" />
      </svg>
    ),
    color: "#107789",
    bg: "#EBF5F7",
  },
  {
    label: "Active Teachers",
    labelAr: "المعلمون النشطون",
    value: "148",
    change: "+4%",
    positive: true,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    color: "#7c3aed",
    bg: "#ede9fe",
  },
  {
    label: "Total Revenue",
    labelAr: "إجمالي الإيرادات",
    value: "$84,230",
    change: "+8.3%",
    positive: true,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
    color: "#059669",
    bg: "#d1fae5",
  },
  {
    label: "Pending Enrollments",
    labelAr: "التسجيلات المعلقة",
    value: "57",
    change: "-3%",
    positive: false,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    color: "#d97706",
    bg: "#fef3c7",
  },
];

// ─── Recent Activity ───────────────────────────────────────────
const recentActivity = [
  {
    name: "Sara Al-Rashid",
    role: "Student",
    roleAr: "طالب",
    action: "Enrolled in Math 101",
    actionAr: "سجل في مادة الرياضيات 101",
    time: "2 min ago",
    timeAr: "منذ دقيقتين",
    avatar: "S",
    color: "#107789",
    bg: "#EBF5F7",
  },
  {
    name: "Mr. Khalid Nasser",
    role: "Teacher",
    roleAr: "معلم",
    action: "Uploaded new lesson",
    actionAr: "رفع درس جديد",
    time: "18 min ago",
    timeAr: "منذ 18 دقيقة",
    avatar: "K",
    color: "#7c3aed",
    bg: "#ede9fe",
  },
  {
    name: "Layla Hassan",
    role: "Student",
    roleAr: "طالب",
    action: "Submitted assignment",
    actionAr: "سلّم الواجب",
    time: "35 min ago",
    timeAr: "منذ 35 دقيقة",
    avatar: "L",
    color: "#059669",
    bg: "#d1fae5",
  },
  {
    name: "Ms. Rima Yousef",
    role: "Teacher",
    roleAr: "معلم",
    action: "Graded Quiz #4",
    actionAr: "صحّح الاختبار الرابع",
    time: "1 hr ago",
    timeAr: "منذ ساعة",
    avatar: "R",
    color: "#d97706",
    bg: "#fef3c7",
  },
];

// ─── Monthly Data ─────────────────────────────────────────────
const monthlyData = [
  { month: "Sep", monthAr: "سبت", value: 60 },
  { month: "Oct", monthAr: "أكت", value: 75 },
  { month: "Nov", monthAr: "نوف", value: 55 },
  { month: "Dec", monthAr: "ديس", value: 80 },
  { month: "Jan", monthAr: "ينا", value: 70 },
  { month: "Feb", monthAr: "فبر", value: 90 },
  { month: "Mar", monthAr: "مار", value: 85 },
];

// ─── Top Courses Table Data ───────────────────────────────────
const topCourses = [
  { name: "Mathematics 101", nameAr: "رياضيات 101", teacher: "Mr. Ahmad", teacherAr: "أ. أحمد", enrolled: 312, capacity: 350, completion: 89, status: "Active", statusAr: "نشط" },
  { name: "English Literature", nameAr: "أدب إنجليزي", teacher: "Ms. Nora", teacherAr: "أ. نورا", enrolled: 278, capacity: 300, completion: 74, status: "Active", statusAr: "نشط" },
  { name: "Physics Advanced", nameAr: "فيزياء متقدم", teacher: "Dr. Samir", teacherAr: "د. سمير", enrolled: 190, capacity: 250, completion: 62, status: "Active", statusAr: "نشط" },
  { name: "Arabic Language", nameAr: "اللغة العربية", teacher: "Mr. Tariq", teacherAr: "أ. طارق", enrolled: 340, capacity: 340, completion: 95, status: "Full", statusAr: "ممتلئ" },
  { name: "Chemistry Basics", nameAr: "كيمياء أساسية", teacher: "Ms. Dina", teacherAr: "أ. دينا", enrolled: 145, capacity: 200, completion: 51, status: "Active", statusAr: "نشط" },
];

// ─── Quick Overview Items ─────────────────────────────────────
const overviewItems = [
  { label: "Attendance Rate", labelAr: "نسبة الحضور", value: 92, color: "#107789" },
  { label: "Assignment Completion", labelAr: "إتمام الواجبات", value: 78, color: "#7c3aed" },
  { label: "Pass Rate", labelAr: "نسبة النجاح", value: 86, color: "#059669" },
];

// ─── Bar Chart ────────────────────────────────────────────────
function BarChart({ isRTL }: { isRTL: boolean }) {
  const max = Math.max(...monthlyData.map((d) => d.value));
  const chartH = 120;
  const barW = 32;
  const gap = 12;
  const totalW = monthlyData.length * (barW + gap) - gap;

  return (
    <div className="overflow-x-auto">
      <svg viewBox={`0 0 ${totalW + 20} ${chartH + 36}`} style={{ width: "100%", minWidth: 260, height: "auto" }}>
        {monthlyData.map((d, i) => {
          const barH = (d.value / max) * chartH;
          const x = i * (barW + gap);
          const y = chartH - barH;
          const isLast = d.month === "Mar";
          return (
            <g key={i}>
              <rect
                x={x}
                y={y}
                width={barW}
                height={barH}
                rx={6}
                fill={isLast ? "#107789" : "#E2EFF1"}
              />
              {isLast && (
                <text x={x + barW / 2} y={y - 6} textAnchor="middle" fontSize="11" fontWeight="600" fill="#107789">
                  {d.value}
                </text>
              )}
              <text x={x + barW / 2} y={chartH + 18} textAnchor="middle" fontSize="11" fill="#94a3b8">
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
      <div style={{ width: `${value}%`, background: color, height: "100%", borderRadius: 99, transition: "width 0.6s ease" }} />
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
        <main className="flex-1 p-6 space-y-6 overflow-auto">

          {/* ── Stat Cards ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {stats.map((s) => (
              <div
                key={s.label}
                className="bg-white rounded-2xl p-5 flex gap-4 items-start shadow-sm border border-gray-100"
              >
                <div
                  className="rounded-xl p-3 flex-shrink-0"
                  style={{ backgroundColor: s.bg, color: s.color }}
                >
                  {s.icon}
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-gray-400 font-medium truncate">
                    {t(s.label, s.labelAr)}
                  </p>
                  <p className="text-2xl font-bold text-gray-800 mt-0.5">{s.value}</p>
                  <p className="text-xs mt-1 font-medium" style={{ color: s.positive ? "#059669" : "#ef4444" }}>
                    {s.change}{" "}
                    <span className="text-gray-400 font-normal">
                      {t("vs last month", "مقارنة بالشهر الماضي")}
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* ── Chart + Quick Overview ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

            {/* Bar Chart */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 lg:col-span-2">
              <p className="font-semibold text-gray-800 text-sm">
                {t("Monthly Enrollments", "التسجيلات الشهرية")}
              </p>
              <p className="text-xs text-gray-400 mb-4">
                {t("Students enrolled per month", "عدد الطلاب المسجلين شهريًا")}
              </p>
              <BarChart isRTL={isRTL} />
            </div>

            {/* Quick Overview */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col justify-between">
              <div>
                <p className="font-semibold text-gray-800 text-sm mb-1">
                  {t("Quick Overview", "نظرة سريعة")}
                </p>
                <p className="text-xs text-gray-400 mb-5">
                  {t("Key performance metrics", "مؤشرات الأداء الرئيسية")}
                </p>
                <div className="space-y-5">
                  {overviewItems.map((item) => (
                    <div key={item.label}>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-xs text-gray-500 font-medium">
                          {t(item.label, item.labelAr)}
                        </span>
                        <span className="text-xs font-bold" style={{ color: item.color }}>
                          {item.value}%
                        </span>
                      </div>
                      <ProgressBar value={item.value} color={item.color} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Top Courses Table ── */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <p className="font-semibold text-gray-800 text-sm">
                {t("Top Courses", "أفضل الكورسات")}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                {t("Enrollment and completion overview", "نظرة على التسجيل والإتمام")}
              </p>
            </div>
            <div className="overflow-x-auto">
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ background: "#F8FAFC" }}>
                    {[
                      t("Course", "الكورس"),
                      t("Teacher", "المعلم"),
                      t("Enrolled", "المسجلون"),
                      t("Completion", "الإتمام"),
                      t("Status", "الحالة"),
                    ].map((h) => (
                      <th
                        key={h}
                        style={{
                          padding: "10px 16px",
                          textAlign: isRTL ? "right" : "left",
                          color: "#94a3b8",
                          fontWeight: 600,
                          fontSize: 11,
                          letterSpacing: "0.05em",
                          textTransform: "uppercase",
                          whiteSpace: "nowrap",
                          borderBottom: "1px solid #F1F5F9",
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {topCourses.map((course, i) => {
                    const sc = statusColor(course.status);
                    return (
                      <tr
                        key={i}
                        style={{ borderBottom: i < topCourses.length - 1 ? "1px solid #F1F5F9" : "none" }}
                      >
                        <td style={{ padding: "12px 16px", fontWeight: 600, color: "#1e293b" }}>
                          {t(course.name, course.nameAr)}
                        </td>
                        <td style={{ padding: "12px 16px", color: "#64748b" }}>
                          {t(course.teacher, course.teacherAr)}
                        </td>
                        <td style={{ padding: "12px 16px", color: "#475569" }}>
                          {course.enrolled}
                          <span style={{ color: "#94a3b8", fontSize: 11 }}>/{course.capacity}</span>
                        </td>
                        <td style={{ padding: "12px 16px", minWidth: 120 }}>
                          <div className="flex items-center gap-2">
                            <ProgressBar value={course.completion} color="#107789" />
                            <span style={{ fontSize: 11, fontWeight: 700, color: "#107789", whiteSpace: "nowrap" }}>
                              {course.completion}%
                            </span>
                          </div>
                        </td>
                        <td style={{ padding: "12px 16px" }}>
                          <span
                            style={{
                              background: sc.bg,
                              color: sc.color,
                              borderRadius: 99,
                              padding: "2px 10px",
                              fontSize: 11,
                              fontWeight: 700,
                            }}
                          >
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
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <p className="font-semibold text-gray-800 text-sm">
                {t("Recent Activity", "النشاط الأخير")}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                {t("Latest actions across the platform", "آخر الأنشطة في النظام")}
              </p>
            </div>
            <div className="overflow-x-auto">
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ background: "#F8FAFC" }}>
                    {[
                      t("User", "المستخدم"),
                      t("Role", "الدور"),
                      t("Action", "الإجراء"),
                      t("Time", "الوقت"),
                    ].map((h) => (
                      <th
                        key={h}
                        style={{
                          padding: "10px 16px",
                          textAlign: isRTL ? "right" : "left",
                          color: "#94a3b8",
                          fontWeight: 600,
                          fontSize: 11,
                          letterSpacing: "0.05em",
                          textTransform: "uppercase",
                          whiteSpace: "nowrap",
                          borderBottom: "1px solid #F1F5F9",
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentActivity.map((item, i) => (
                    <tr
                      key={i}
                      style={{ borderBottom: i < recentActivity.length - 1 ? "1px solid #F1F5F9" : "none" }}
                    >
                      <td style={{ padding: "12px 16px" }}>
                        <div className="flex items-center gap-3">
                          <div
                            style={{
                              width: 34,
                              height: 34,
                              borderRadius: "50%",
                              background: item.bg,
                              color: item.color,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontWeight: 700,
                              fontSize: 13,
                              flexShrink: 0,
                            }}
                          >
                            {item.avatar}
                          </div>
                          <span style={{ fontWeight: 600, color: "#1e293b" }}>{item.name}</span>
                        </div>
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <span
                          style={{
                            background: item.bg,
                            color: item.color,
                            borderRadius: 99,
                            padding: "2px 10px",
                            fontSize: 11,
                            fontWeight: 700,
                          }}
                        >
                          {t(item.role, item.roleAr)}
                        </span>
                      </td>
                      <td style={{ padding: "12px 16px", color: "#475569" }}>
                        {t(item.action, item.actionAr)}
                      </td>
                      <td style={{ padding: "12px 16px", color: "#94a3b8", fontSize: 12, whiteSpace: "nowrap" }}>
                        {t(item.time, item.timeAr)}
                      </td>
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