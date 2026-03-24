"use client";

import { useState } from "react";
import { useLanguage } from "@/src/contexts/LanguageContext";

// ─── Types ────────────────────────────────────────────────────
type Period = "week" | "month" | "quarter" | "year";

// ─── SVG Bar Chart ────────────────────────────────────────────
function BarChart({
  data,
  color = "#107789",
}: {
  data: { label: string; value: number }[];
  color?: string;
}) {
  const max = Math.max(...data.map((d) => d.value));
  const chartH = 80;
  const barW = 28;
  const gap = 12;
  const totalW = data.length * (barW + gap) - gap;

  return (
    <svg viewBox={`0 0 ${totalW} ${chartH + 22}`} width="100%" style={{ display: "block" }}>
      {data.map((d, i) => {
        const x = i * (barW + gap);
        const barH = max === 0 ? 0 : (d.value / max) * chartH;
        const y = chartH - barH;
        const isLast = i === data.length - 1;
        return (
          <g key={d.label}>
            <rect x={x} y={y} width={barW} height={barH} rx="4" fill={isLast ? color : color + "33"} />
            <text
              x={x + barW / 2}
              y={chartH + 16}
              textAnchor="middle"
              fontSize="9"
              fill="#8A8F98"
              fontFamily="inherit"
            >
              {d.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ─── SVG Line Chart ───────────────────────────────────────────
function LineChart({
  data,
  color = "#107789",
}: {
  data: { label: string; value: number }[];
  color?: string;
}) {
  const max = Math.max(...data.map((d) => d.value)) * 1.1;
  const w = 340;
  const h = 80;
  const padX = 10;
  const stepX = (w - padX * 2) / (data.length - 1);

  const points = data.map((d, i) => ({
    x: padX + i * stepX,
    y: h - (d.value / max) * h,
  }));

  const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaD = `${pathD} L ${points[points.length - 1].x} ${h} L ${points[0].x} ${h} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h + 22}`} width="100%" style={{ display: "block" }}>
      <path d={areaD} fill={color + "18"} />
      <path d={pathD} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3" fill={color} />
      ))}
      {data.map((d, i) => (
        <text
          key={d.label}
          x={points[i].x}
          y={h + 16}
          textAnchor="middle"
          fontSize="9"
          fill="#8A8F98"
          fontFamily="inherit"
        >
          {d.label}
        </text>
      ))}
    </svg>
  );
}

// ─── Data ─────────────────────────────────────────────────────
const salesData: Record<Period, { label: string; value: number }[]> = {
  week: [
    { label: "Mon", value: 1800 },
    { label: "Tue", value: 2200 },
    { label: "Wed", value: 1500 },
    { label: "Thu", value: 2800 },
    { label: "Fri", value: 3100 },
    { label: "Sat", value: 900 },
  ],
  month: [
    { label: "W1", value: 9200 },
    { label: "W2", value: 11400 },
    { label: "W3", value: 8700 },
    { label: "W4", value: 12400 },
  ],
  quarter: [
    { label: "Jan", value: 32000 },
    { label: "Feb", value: 28500 },
    { label: "Mar", value: 41000 },
  ],
  year: [
    { label: "Q1", value: 101500 },
    { label: "Q2", value: 118000 },
    { label: "Q3", value: 95000 },
    { label: "Q4", value: 134000 },
  ],
};

const attendanceData: Record<Period, { label: string; value: number }[]> = {
  week: [
    { label: "Mon", value: 88 },
    { label: "Tue", value: 94 },
    { label: "Wed", value: 91 },
    { label: "Thu", value: 96 },
    { label: "Fri", value: 89 },
    { label: "Sat", value: 70 },
  ],
  month: [
    { label: "W1", value: 90 },
    { label: "W2", value: 93 },
    { label: "W3", value: 88 },
    { label: "W4", value: 95 },
  ],
  quarter: [
    { label: "Jan", value: 91 },
    { label: "Feb", value: 89 },
    { label: "Mar", value: 94 },
  ],
  year: [
    { label: "Q1", value: 91 },
    { label: "Q2", value: 93 },
    { label: "Q3", value: 90 },
    { label: "Q4", value: 94 },
  ],
};

const topTeachers = [
  { name: "Ahmad Nasser", avatar: "A", color: "#107789", sessions: 148, rating: 4.9, revenue: "$8,200" },
  { name: "Layla Hassan", avatar: "L", color: "#7c3aed", sessions: 132, rating: 4.8, revenue: "$7,400" },
  { name: "Khalid Samir", avatar: "K", color: "#059669", sessions: 119, rating: 4.7, revenue: "$6,600" },
  { name: "Reem Faris", avatar: "R", color: "#d97706", sessions: 104, rating: 4.6, revenue: "$5,800" },
];

const recentTransactions = [
  { student: "Sara Al-Rashid", avatar: "S", color: "#107789", pkg: "Standard Pack", amount: "$280", date: "Mar 20, 2025", status: "Paid" },
  { student: "Omar Yousef", avatar: "O", color: "#7c3aed", pkg: "Basic Pack", amount: "$150", date: "Mar 19, 2025", status: "Paid" },
  { student: "Nour Khalil", avatar: "N", color: "#059669", pkg: "Premium Pack", amount: "$500", date: "Mar 18, 2025", status: "Paid" },
  { student: "Tariq Ziad", avatar: "T", color: "#d97706", pkg: "Standard Pack", amount: "$280", date: "Mar 17, 2025", status: "Pending" },
  { student: "Lina Hamdan", avatar: "L", color: "#ef4444", pkg: "Basic Pack", amount: "$150", date: "Mar 16, 2025", status: "Paid" },
];

const txStatusConfig = {
  Paid: { bg: "#dcfce7", text: "#15803d", ar: "مدفوع" },
  Pending: { bg: "#fef9c3", text: "#a16207", ar: "قيد الانتظار" },
};

// ─── Page ──────────────────────────────────────────────────────
export default function ReportsAnalyticsPage() {
  const { lang, isRTL, t } = useLanguage();

  const [period, setPeriod] = useState<Period>("month");

  const periods: { key: Period; en: string; ar: string }[] = [
    { key: "week", en: "Week", ar: "الأسبوع" },
    { key: "month", en: "Month", ar: "الشهر" },
    { key: "quarter", en: "Quarter", ar: "الربع" },
    { key: "year", en: "Year", ar: "السنة" },
  ];

  const totalSales = salesData[period].reduce((a, b) => a + b.value, 0);
  const avgAttendance = Math.round(
    attendanceData[period].reduce((a, b) => a + b.value, 0) / attendanceData[period].length
  );

  return (
    <main className="flex-1 p-6 space-y-5 overflow-auto" dir={isRTL ? "rtl" : "ltr"}>
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-lg font-bold text-[#0B2C33]">
            {t("Reports & Analytics", "التقارير والتحليلات")}
          </h1>
          <p className="text-sm text-[#8A8F98] mt-0.5">
            {t("Platform performance and financial overview", "أداء المنصة ونظرة مالية شاملة")}
          </p>
        </div>

        <div className="flex items-center gap-1 bg-white border border-[#F0F2F5] rounded-lg p-1">
          {periods.map((p) => (
            <button
              key={p.key}
              onClick={() => setPeriod(p.key)}
              className={[
                "px-3 py-1.5 rounded-md text-xs font-semibold transition-colors",
                period === p.key ? "bg-[#107789] text-white" : "text-[#6B7280] hover:text-[#107789]",
              ].join(" ")}
            >
              {t(p.en, p.ar)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          {
            labelEn: "Monthly Sales",
            labelAr: "المبيعات الشهرية",
            value: `$${totalSales.toLocaleString()}`,
            change: "+8.3%",
            positive: true,
            color: "#107789",
            bg: "#EBF5F7",
            icon: (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="1" x2="12" y2="23" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            ),
          },
          {
            labelEn: "Attendance Rate",
            labelAr: "نسبة الحضور",
            value: `${avgAttendance}%`,
            change: "+2.1%",
            positive: true,
            color: "#059669",
            bg: "#d1fae5",
            icon: (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ),
          },
          {
            labelEn: "Student Progress",
            labelAr: "تقدم الطلاب",
            value: "High",
            change: "Stable",
            positive: true,
            color: "#7c3aed",
            bg: "#ede9fe",
            icon: (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                <polyline points="16 7 22 7 22 13" />
              </svg>
            ),
          },
          {
            labelEn: "Teacher Performance",
            labelAr: "أداء المعلمين",
            value: "Excellent",
            change: "+0.3 pts",
            positive: true,
            color: "#d97706",
            bg: "#fef3c7",
            icon: (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            ),
          },
        ].map((s) => (
          <div key={s.labelEn} className="bg-white rounded-xl border border-[#F0F2F5] p-5 flex items-start gap-4 shadow-sm">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: s.bg, color: s.color }}
            >
              {s.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-[#8A8F98] font-medium truncate">{t(s.labelEn, s.labelAr)}</p>
              <p className="text-xl font-bold text-[#0B2C33] mt-0.5 leading-tight">{s.value}</p>
              <p className="text-xs font-semibold mt-1" style={{ color: s.positive ? "#059669" : "#ef4444" }}>
                {s.change}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-[#F0F2F5] shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-semibold text-[#0B2C33]">{t("Sales Revenue", "إيرادات المبيعات")}</p>
              <p className="text-xs text-[#8A8F98] mt-0.5">{t("Total earned this period", "إجمالي الأرباح في هذه الفترة")}</p>
            </div>
            <span className="text-sm font-bold text-[#107789]">${totalSales.toLocaleString()}</span>
          </div>
          <BarChart data={salesData[period]} color="#107789" />
        </div>

        <div className="bg-white rounded-xl border border-[#F0F2F5] shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-semibold text-[#0B2C33]">{t("Attendance Rate", "نسبة الحضور")}</p>
              <p className="text-xs text-[#8A8F98] mt-0.5">{t("Average session attendance", "متوسط حضور الجلسات")}</p>
            </div>
            <span className="text-sm font-bold text-[#059669]">{avgAttendance}%</span>
          </div>
          <LineChart data={attendanceData[period]} color="#059669" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-[#F0F2F5] shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-[#F0F2F5]">
            <p className="text-sm font-semibold text-[#0B2C33]">{t("Top Teachers", "أفضل المعلمين")}</p>
            <p className="text-xs text-[#8A8F98] mt-0.5">{t("By sessions & revenue", "حسب الجلسات والإيرادات")}</p>
          </div>
          <div className="divide-y divide-[#F0F2F5]">
            {topTeachers.map((tc, i) => (
              <div key={tc.name} className="flex items-center gap-3 px-5 py-3.5 hover:bg-[#F5F7F9] transition-colors">
                <span className="text-xs font-bold text-[#8A8F98] w-4 flex-shrink-0">#{i + 1}</span>
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                  style={{ backgroundColor: tc.color }}
                >
                  {tc.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#0B2C33] truncate">{tc.name}</p>
                  <p className="text-xs text-[#8A8F98]">
                    {tc.sessions} {t("sessions", "جلسة")} · ⭐ {tc.rating}
                  </p>
                </div>
                <span className="text-xs font-bold text-[#107789]">{tc.revenue}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-xl border border-[#F0F2F5] shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#F0F2F5]">
            <div>
              <p className="text-sm font-semibold text-[#0B2C33]">{t("Recent Transactions", "آخر المعاملات المالية")}</p>
              <p className="text-xs text-[#8A8F98] mt-0.5">{t("Latest package purchases", "آخر عمليات شراء الباقات")}</p>
            </div>
            <button className="text-xs font-medium text-[#107789] hover:underline">
              {t("View all", "عرض الكل")}
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#F0F2F5] bg-[#FAFBFC]">
                  {[
                    { en: "Student", ar: "الطالب" },
                    { en: "Package", ar: "الباقة" },
                    { en: "Amount", ar: "المبلغ" },
                    { en: "Date", ar: "التاريخ" },
                    { en: "Status", ar: "الحالة" },
                  ].map((col) => (
                    <th
                      key={col.en}
                      className="px-5 py-3 text-start text-xs font-semibold text-[#8A8F98] uppercase tracking-wide whitespace-nowrap"
                    >
                      {t(col.en, col.ar)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F2F5]">
                {recentTransactions.map((tx) => (
                  <tr key={tx.student} className="hover:bg-[#F5F7F9] transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                          style={{ backgroundColor: tx.color }}
                        >
                          {tx.avatar}
                        </div>
                        <span className="font-medium text-[#0B2C33] text-xs">{tx.student}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-[#6B7280]">{tx.pkg}</td>
                    <td className="px-5 py-3.5 text-xs font-bold text-[#0B2C33]">{tx.amount}</td>
                    <td className="px-5 py-3.5 text-xs text-[#8A8F98] whitespace-nowrap">{tx.date}</td>
                    <td className="px-5 py-3.5">
                      <span
                        className="text-[10px] font-semibold px-2.5 py-1 rounded-full"
                        style={{
                          backgroundColor: txStatusConfig[tx.status as keyof typeof txStatusConfig].bg,
                          color: txStatusConfig[tx.status as keyof typeof txStatusConfig].text,
                        }}
                      >
                        {lang === "ar" ? txStatusConfig[tx.status as keyof typeof txStatusConfig].ar : tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#F0F2F5] shadow-sm p-5">
        <p className="text-sm font-semibold text-[#0B2C33] mb-4">{t("Performance Metrics", "مقاييس الأداء")}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { labelEn: "Trial Conversion", labelAr: "تحويل التجريبي", value: "68%", width: "68%", color: "#107789" },
            { labelEn: "Fee Collection Rate", labelAr: "معدل تحصيل الرسوم", value: "87%", width: "87%", color: "#059669" },
            { labelEn: "Quiz Pass Rate", labelAr: "معدل اجتياز الاختبارات", value: "83%", width: "83%", color: "#7c3aed" },
            { labelEn: "Student Retention", labelAr: "الاحتفاظ بالطلاب", value: "79%", width: "79%", color: "#d97706" },
          ].map((m) => (
            <div key={m.labelEn}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-[#8A8F98] font-medium">{t(m.labelEn, m.labelAr)}</span>
                <span className="text-sm font-bold text-[#0B2C33]">{m.value}</span>
              </div>
              <div className="w-full h-2 bg-[#F0F2F5] rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-500" style={{ width: m.width, backgroundColor: m.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}