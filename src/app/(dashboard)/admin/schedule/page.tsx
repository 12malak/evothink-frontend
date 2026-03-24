"use client";

import { useState } from "react";
import { useLanguage } from "@/src/contexts/LanguageContext";

// ─── Types ────────────────────────────────────────────────────
type Day = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat";
type SlotStatus = "Available" | "Booked" | "Conflict";

interface TimeSlot {
  time: string;
  status: SlotStatus;
  studentName?: string;
}

interface TeacherSchedule {
  id: string;
  name: string;
  avatar: string;
  avatarColor: string;
  subject: string;
  workDays: Day[];
  slots: Record<string, TimeSlot[]>;
}

interface Conflict {
  teacherName: string;
  time: string;
  dayEn: string;
  dayAr: string;
  descriptionEn: string;
  descriptionAr: string;
}

interface AddSlotForm {
  teacherId: string;
  day: Day | "";
  startTime: string;
  endTime: string;
  studentName: string;
}

// ─── Helpers ──────────────────────────────────────────────────
function timeToMinutes(t: string): number {
  const match = t.match(/^(\d+):(\d+)\s*(AM|PM)$/i);
  if (!match) return 0;
  let h = parseInt(match[1]);
  const m = parseInt(match[2]);
  const period = match[3].toUpperCase();
  if (period === "PM" && h !== 12) h += 12;
  if (period === "AM" && h === 12) h = 0;
  return h * 60 + m;
}

function formatTime(val: string): string {
  if (!val) return "";
  const [h, m] = val.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${String(hour).padStart(2, "0")}:${String(m).padStart(2, "0")} ${period}`;
}

// ─── Static Data ──────────────────────────────────────────────
const days: { key: Day; en: string; ar: string }[] = [
  { key: "Mon", en: "Mon", ar: "الإثنين" },
  { key: "Tue", en: "Tue", ar: "الثلاثاء" },
  { key: "Wed", en: "Wed", ar: "الأربعاء" },
  { key: "Thu", en: "Thu", ar: "الخميس" },
  { key: "Fri", en: "Fri", ar: "الجمعة" },
  { key: "Sat", en: "Sat", ar: "السبت" },
];

const initialTeachers: TeacherSchedule[] = [
  {
    id: "TCH-001",
    name: "Ahmad Nasser",
    avatar: "A",
    avatarColor: "#107789",
    subject: "English Foundation",
    workDays: ["Mon", "Wed", "Fri"],
    slots: {
      Mon: [
        { time: "09:00 AM", status: "Booked", studentName: "Sara Al-Rashid" },
        { time: "10:00 AM", status: "Booked", studentName: "Omar Yousef" },
        { time: "11:00 AM", status: "Available" },
        { time: "12:00 PM", status: "Available" },
        { time: "02:00 PM", status: "Booked", studentName: "Nour Khalil" },
        { time: "03:00 PM", status: "Available" },
      ],
      Wed: [
        { time: "09:00 AM", status: "Available" },
        { time: "10:00 AM", status: "Booked", studentName: "Tariq Ziad" },
        { time: "11:00 AM", status: "Booked", studentName: "Lina Hamdan" },
        { time: "02:00 PM", status: "Available" },
        { time: "03:00 PM", status: "Available" },
      ],
      Fri: [
        { time: "10:00 AM", status: "Available" },
        { time: "11:00 AM", status: "Booked", studentName: "Ahmad Ali" },
        { time: "12:00 PM", status: "Available" },
      ],
    },
  },
  {
    id: "TCH-002",
    name: "Layla Hassan",
    avatar: "L",
    avatarColor: "#7c3aed",
    subject: "IELTS Preparation",
    workDays: ["Tue", "Thu", "Sat"],
    slots: {
      Tue: [
        { time: "10:00 AM", status: "Booked", studentName: "Reem Faris" },
        { time: "11:00 AM", status: "Conflict", studentName: "Omar Saleh" },
        { time: "12:00 PM", status: "Available" },
        { time: "03:00 PM", status: "Booked", studentName: "Khalid Samir" },
      ],
      Thu: [
        { time: "09:00 AM", status: "Available" },
        { time: "10:00 AM", status: "Booked", studentName: "Sara Al-Rashid" },
        { time: "02:00 PM", status: "Available" },
        { time: "03:00 PM", status: "Conflict", studentName: "Nour Khalil" },
      ],
      Sat: [
        { time: "10:00 AM", status: "Available" },
        { time: "11:00 AM", status: "Booked", studentName: "Tariq Ziad" },
      ],
    },
  },
  {
    id: "TCH-003",
    name: "Khalid Samir",
    avatar: "K",
    avatarColor: "#059669",
    subject: "English Foundation",
    workDays: ["Mon", "Tue", "Thu"],
    slots: {
      Mon: [
        { time: "09:00 AM", status: "Booked", studentName: "Lina Hamdan" },
        { time: "10:00 AM", status: "Available" },
        { time: "11:00 AM", status: "Available" },
      ],
      Tue: [
        { time: "02:00 PM", status: "Booked", studentName: "Ahmad Ali" },
        { time: "03:00 PM", status: "Available" },
      ],
      Thu: [
        { time: "10:00 AM", status: "Booked", studentName: "Omar Yousef" },
        { time: "11:00 AM", status: "Available" },
        { time: "12:00 PM", status: "Available" },
      ],
    },
  },
];

const initialConflicts: Conflict[] = [
  {
    teacherName: "Layla Hassan",
    time: "11:00 AM",
    dayEn: "Tuesday",
    dayAr: "الثلاثاء",
    descriptionEn: "Overlapping sessions assigned at the same time slot",
    descriptionAr: "جلستان متداخلتان في نفس الوقت",
  },
  {
    teacherName: "Layla Hassan",
    time: "03:00 PM",
    dayEn: "Thursday",
    dayAr: "الخميس",
    descriptionEn: "Student Nour Khalil already has a session at this time",
    descriptionAr: "الطالبة نور خليل لديها جلسة في نفس الوقت",
  },
];

const slotConfig: Record<SlotStatus, { bg: string; text: string; border: string; labelAr: string }> = {
  Available: { bg: "#f0fdf4", text: "#15803d", border: "#bbf7d0", labelAr: "متاح" },
  Booked: { bg: "#EBF5F7", text: "#107789", border: "#a5d8e0", labelAr: "محجوز" },
  Conflict: { bg: "#fef2f2", text: "#dc2626", border: "#fecaca", labelAr: "تعارض" },
};

// ─── Add Slot Modal ───────────────────────────────────────────
function AddSlotModal({
  teachers,
  defaultTeacherId,
  lang,
  onClose,
  onSave,
}: {
  teachers: TeacherSchedule[];
  defaultTeacherId: string;
  lang: "en" | "ar";
  onClose: () => void;
  onSave: (teacherId: string, day: Day, slot: TimeSlot) => void;
}) {
  const t = (en: string, ar: string) => (lang === "ar" ? ar : en);

  const [form, setForm] = useState<AddSlotForm>({
    teacherId: defaultTeacherId,
    day: "",
    startTime: "",
    endTime: "",
    studentName: "",
  });
  const [error, setError] = useState<string>("");
  const [warning, setWarning] = useState<string>("");

  const selectedTeacher = teachers.find((tc) => tc.id === form.teacherId);

  const validate = (): boolean => {
    setError("");
    setWarning("");

    if (!form.teacherId) {
      setError(t("Please select a teacher.", "الرجاء اختيار معلم."));
      return false;
    }
    if (!form.day) {
      setError(t("Please select a day.", "الرجاء اختيار يوم."));
      return false;
    }
    if (!form.startTime) {
      setError(t("Please enter a start time.", "الرجاء إدخال وقت البداية."));
      return false;
    }
    if (!form.endTime) {
      setError(t("Please enter an end time.", "الرجاء إدخال وقت النهاية."));
      return false;
    }

    const start = timeToMinutes(formatTime(form.startTime));
    const end = timeToMinutes(formatTime(form.endTime));

    if (end <= start) {
      setError(t("End time must be after start time.", "يجب أن يكون وقت النهاية بعد وقت البداية."));
      return false;
    }

    if (selectedTeacher && !selectedTeacher.workDays.includes(form.day as Day)) {
      setWarning(
        t(
          `${selectedTeacher.name} doesn't usually work on ${form.day}. Slot will be added anyway.`,
          `${selectedTeacher.name} لا يعمل عادةً يوم ${form.day}. سيتم إضافة الوقت على أي حال.`
        )
      );
    }

    const existingSlots = selectedTeacher?.slots[form.day] ?? [];
    const overlap = existingSlots.find((s) => {
      const existing = timeToMinutes(s.time);
      return existing >= start && existing < end;
    });

    if (overlap) {
      setError(
        t(
          `Conflict: slot at ${overlap.time} already exists in this time range.`,
          `تعارض: يوجد وقت ${overlap.time} ضمن هذا النطاق.`
        )
      );
      return false;
    }

    return true;
  };

  const handleSave = () => {
    if (!validate()) return;

    const formatted = formatTime(form.startTime);
    const newSlot: TimeSlot = {
      time: formatted,
      status: form.studentName.trim() ? "Booked" : "Available",
      studentName: form.studentName.trim() || undefined,
    };

    onSave(form.teacherId, form.day as Day, newSlot);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4" onClick={onClose}>
        <div
          className="w-full max-w-md space-y-5 rounded-2xl bg-white p-6 shadow-2xl"
          dir={lang === "ar" ? "rtl" : "ltr"}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-[#0B2C33]">{t("Add New Time Slot", "إضافة وقت جديد")}</h2>
              <p className="mt-0.5 text-xs text-[#8A8F98]">{t("Fill in the details to create a new slot", "أدخل التفاصيل لإنشاء وقت جديد")}</p>
            </div>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F5F7F9] text-[#8A8F98] transition-colors hover:text-[#0B2C33]"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {error && (
            <div className="flex items-start gap-2.5 rounded-lg border border-[#fecaca] bg-[#fef2f2] px-3.5 py-3">
              <svg className="mt-0.5 flex-shrink-0 text-[#dc2626]" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <p className="text-xs font-medium text-[#dc2626]">{error}</p>
            </div>
          )}

          {warning && !error && (
            <div className="flex items-start gap-2.5 rounded-lg border border-[#fde68a] bg-[#fef9c3] px-3.5 py-3">
              <svg className="mt-0.5 flex-shrink-0 text-[#d97706]" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              <p className="text-xs font-medium text-[#d97706]">{warning}</p>
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#0B2C33]">
                {t("Teacher", "المعلم")} <span className="text-[#dc2626]">*</span>
              </label>
              <select
                value={form.teacherId}
                onChange={(e) => setForm({ ...form, teacherId: e.target.value, day: "" })}
                className="w-full rounded-lg border border-[#E5E7EB] bg-white px-3 py-2.5 text-sm text-[#0B2C33] focus:border-[#107789]/50 focus:outline-none focus:ring-1 focus:ring-[#107789]/20"
              >
                <option value="">{t("Select teacher…", "اختر معلمًا…")}</option>
                {teachers.map((tc) => (
                  <option key={tc.id} value={tc.id}>
                    {tc.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#0B2C33]">
                {t("Day", "اليوم")} <span className="text-[#dc2626]">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {days.map((d) => {
                  const isWork = selectedTeacher?.workDays.includes(d.key) ?? true;
                  const isSelected = form.day === d.key;
                  return (
                    <button
                      key={d.key}
                      type="button"
                      onClick={() => setForm({ ...form, day: d.key })}
                      className={[
                        "rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors",
                        isSelected
                          ? "border-[#107789] bg-[#107789] text-white"
                          : isWork
                          ? "border-[#EBF5F7] bg-[#EBF5F7] text-[#107789] hover:border-[#107789]"
                          : "border-[#F0F2F5] bg-[#F5F7F9] text-[#9CA3AF]",
                      ].join(" ")}
                    >
                      {t(d.en, d.ar)}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#0B2C33]">
                  {t("Start Time", "وقت البداية")} <span className="text-[#dc2626]">*</span>
                </label>
                <input
                  type="time"
                  value={form.startTime}
                  onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                  className="w-full rounded-lg border border-[#E5E7EB] bg-white px-3 py-2.5 text-sm text-[#0B2C33] focus:border-[#107789]/50 focus:outline-none focus:ring-1 focus:ring-[#107789]/20"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#0B2C33]">
                  {t("End Time", "وقت النهاية")} <span className="text-[#dc2626]">*</span>
                </label>
                <input
                  type="time"
                  value={form.endTime}
                  onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                  className="w-full rounded-lg border border-[#E5E7EB] bg-white px-3 py-2.5 text-sm text-[#0B2C33] focus:border-[#107789]/50 focus:outline-none focus:ring-1 focus:ring-[#107789]/20"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#0B2C33]">
                {t("Student Name", "اسم الطالب")}{" "}
                <span className="font-normal text-[#8A8F98]">({t("optional", "اختياري")})</span>
              </label>
              <input
                type="text"
                placeholder={t("Leave empty for availability slot", "اتركه فارغًا لوقت متاح")}
                value={form.studentName}
                onChange={(e) => setForm({ ...form, studentName: e.target.value })}
                className="w-full rounded-lg border border-[#E5E7EB] bg-white px-3 py-2.5 text-sm text-[#0B2C33] placeholder:text-[#9CA3AF] focus:border-[#107789]/50 focus:outline-none focus:ring-1 focus:ring-[#107789]/20"
              />
              <div className="flex items-center gap-2 pt-0.5">
                <span className="text-[10px] text-[#8A8F98]">{t("Slot will be marked as:", "سيُصنَّف الوقت كـ:")}</span>
                <span
                  className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
                  style={
                    form.studentName.trim()
                      ? { backgroundColor: slotConfig.Booked.bg, color: slotConfig.Booked.text }
                      : { backgroundColor: slotConfig.Available.bg, color: slotConfig.Available.text }
                  }
                >
                  {form.studentName.trim() ? t("Booked", "محجوز") : t("Available", "متاح")}
                </span>
              </div>
            </div>
          </div>

          <div className="border-t border-[#F0F2F5]" />

          <div className="flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="rounded-lg bg-[#F5F7F9] px-4 py-2.5 text-sm font-semibold text-[#6B7280] transition-colors hover:bg-[#E5E7EB]"
            >
              {t("Cancel", "إلغاء")}
            </button>
            <button
              onClick={handleSave}
              className="rounded-lg bg-[#107789] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0d6275]"
            >
              {t("Save Slot", "حفظ الوقت")}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Page ──────────────────────────────────────────────────────
export default function ScheduleManagementPage() {
  const { lang, isRTL, t } = useLanguage();

  const [teachers, setTeachers] = useState<TeacherSchedule[]>(initialTeachers);
  const [conflicts, setConflicts] = useState<Conflict[]>(initialConflicts);
  const [selectedTeacher, setSelectedTeacher] = useState<string>(initialTeachers[0].id);
  const [selectedDay, setSelectedDay] = useState<Day>("Mon");
  const [modalOpen, setModalOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const teacher = teachers.find((tc) => tc.id === selectedTeacher)!;
  const daySlots = teacher.slots[selectedDay] ?? [];

  const totalBooked = Object.values(teacher.slots).flat().filter((s) => s.status === "Booked").length;
  const totalAvailable = Object.values(teacher.slots).flat().filter((s) => s.status === "Available").length;
  const totalConflicts = Object.values(teacher.slots).flat().filter((s) => s.status === "Conflict").length;

  const handleSaveSlot = (teacherId: string, day: Day, newSlot: TimeSlot) => {
    setTeachers((prev) =>
      prev.map((tc) => {
        if (tc.id !== teacherId) return tc;
        const existing = tc.slots[day] ?? [];
        const updated = [...existing, newSlot].sort((a, b) => timeToMinutes(a.time) - timeToMinutes(b.time));
        return { ...tc, slots: { ...tc.slots, [day]: updated } };
      })
    );

    setSelectedTeacher(teacherId);
    setSelectedDay(day);
    setModalOpen(false);

    setSuccessMsg(t("Slot added successfully!", "تمت إضافة الوقت بنجاح!"));
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const resolveConflict = (index: number) => {
    setConflicts((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="flex min-h-screen bg-[#F5F7F9]" dir={isRTL ? "rtl" : "ltr"}>
      <div className="flex min-w-0 flex-1 flex-col">
        <main className="flex-1 space-y-5 overflow-auto p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold text-[#0B2C33]">{t("Schedule Management", "إدارة الجداول")}</h1>
              <p className="mt-0.5 text-sm text-[#8A8F98]">{t("View teacher availability and resolve conflicts", "عرض توفر المعلمين وحل التعارضات")}</p>
            </div>
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-2 rounded-lg bg-[#107789] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#0d6275]"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              {t("Add Slot", "إضافة وقت")}
            </button>
          </div>

          {successMsg && (
            <div className="flex items-center gap-2.5 rounded-xl border border-[#bbf7d0] bg-[#f0fdf4] px-4 py-3">
              <svg className="flex-shrink-0 text-[#15803d]" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <p className="text-sm font-semibold text-[#15803d]">{successMsg}</p>
            </div>
          )}

          {conflicts.length > 0 && (
            <div className="rounded-xl border border-[#fecaca] bg-[#fef2f2] p-4">
              <div className="flex items-start gap-3">
                <svg className="mt-0.5 flex-shrink-0 text-[#dc2626]" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                <div className="flex-1">
                  <p className="mb-2 text-sm font-semibold text-[#dc2626]">
                    {conflicts.length} {t("Schedule Conflict(s) Detected", "تعارض في الجدول")}
                  </p>
                  <div className="space-y-2">
                    {conflicts.map((c, i) => (
                      <div key={i} className="flex items-center justify-between gap-3">
                        <p className="text-xs text-[#7f1d1d]">
                          <span className="font-semibold">{c.teacherName}</span>
                          {" — "}
                          {t(c.dayEn, c.dayAr)} {t("at", "الساعة")} {c.time}: {t(c.descriptionEn, c.descriptionAr)}
                        </p>
                        <button
                          onClick={() => resolveConflict(i)}
                          className="flex-shrink-0 rounded-lg border border-[#fecaca] px-2.5 py-1 text-xs font-semibold text-[#dc2626] transition-colors hover:bg-white"
                        >
                          {t("Resolve", "حل")}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-5 xl:grid-cols-4">
            <div className="space-y-2 xl:col-span-1">
              <p className="mb-3 px-1 text-xs font-semibold uppercase tracking-wide text-[#8A8F98]">{t("Teachers", "المعلمون")}</p>
              {teachers.map((tc) => {
                const tcConflicts = Object.values(tc.slots).flat().filter((s) => s.status === "Conflict").length;
                const isSelected = selectedTeacher === tc.id;
                return (
                  <button
                    key={tc.id}
                    onClick={() => {
                      setSelectedTeacher(tc.id);
                      setSelectedDay(tc.workDays[0]);
                    }}
                    className={[
                      "w-full rounded-xl border p-3.5 text-start transition-all",
                      "flex items-center gap-3",
                      isSelected ? "border-[#107789]/40 bg-[#EBF5F7] ring-1 ring-[#107789]/20" : "border-[#F0F2F5] bg-white hover:bg-[#F5F7F9]",
                    ].join(" ")}
                  >
                    <div
                      className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                      style={{ backgroundColor: tc.avatarColor }}
                    >
                      {tc.avatar}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-[#0B2C33]">{tc.name}</p>
                      <p className="truncate text-xs text-[#8A8F98]">{tc.subject}</p>
                    </div>
                    {tcConflicts > 0 && (
                      <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#dc2626] text-[10px] font-bold text-white">
                        {tcConflicts}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="space-y-4 xl:col-span-3">
              <div className="rounded-xl border border-[#F0F2F5] bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full font-bold text-white"
                      style={{ backgroundColor: teacher.avatarColor }}
                    >
                      {teacher.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-[#0B2C33]">{teacher.name}</p>
                      <p className="text-xs text-[#8A8F98]">{teacher.subject}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {[
                      { labelEn: "Booked", labelAr: "محجوز", value: totalBooked, color: "#107789", bg: "#EBF5F7" },
                      { labelEn: "Available", labelAr: "متاح", value: totalAvailable, color: "#15803d", bg: "#dcfce7" },
                      { labelEn: "Conflicts", labelAr: "تعارضات", value: totalConflicts, color: "#dc2626", bg: "#fee2e2" },
                    ].map((s) => (
                      <div key={s.labelEn} className="rounded-lg px-3 py-2 text-center" style={{ backgroundColor: s.bg }}>
                        <p className="text-lg font-bold leading-none" style={{ color: s.color }}>
                          {s.value}
                        </p>
                        <p className="mt-0.5 text-[10px] font-medium" style={{ color: s.color }}>
                          {t(s.labelEn, s.labelAr)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 border-t border-[#F0F2F5] pt-4">
                  <p className="mb-2.5 text-xs font-medium text-[#8A8F98]">{t("Work Days", "أيام العمل")}</p>
                  <div className="flex flex-wrap items-center gap-2">
                    {days.map((d) => {
                      const isWorkDay = teacher.workDays.includes(d.key as Day);
                      const isSelected = selectedDay === d.key;
                      return (
                        <button
                          key={d.key}
                          disabled={!isWorkDay}
                          onClick={() => isWorkDay && setSelectedDay(d.key as Day)}
                          className={[
                            "rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
                            !isWorkDay
                              ? "cursor-not-allowed bg-[#F5F7F9] text-[#D1D5DB]"
                              : isSelected
                              ? "bg-[#107789] text-white"
                              : "bg-[#EBF5F7] text-[#107789] hover:bg-[#107789] hover:text-white",
                          ].join(" ")}
                        >
                          {t(d.en, d.ar)}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="overflow-hidden rounded-xl border border-[#F0F2F5] bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-[#F0F2F5] px-5 py-4">
                  <p className="text-sm font-semibold text-[#0B2C33]">
                    {t("Time Slots", "الأوقات")}
                    {" — "}
                    {t(days.find((d) => d.key === selectedDay)?.en ?? "", days.find((d) => d.key === selectedDay)?.ar ?? "")}
                  </p>
                  <div className="flex items-center gap-4">
                    {(["Available", "Booked", "Conflict"] as SlotStatus[]).map((s) => (
                      <div key={s} className="flex items-center gap-1.5">
                        <span className="h-2 w-2 flex-shrink-0 rounded-full" style={{ backgroundColor: slotConfig[s].text }} />
                        <span className="text-xs text-[#8A8F98]">{lang === "ar" ? slotConfig[s].labelAr : s}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {daySlots.length === 0 ? (
                  <div className="px-5 py-12 text-center">
                    <svg className="mx-auto mb-3 text-[#D1D5DB]" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    <p className="mb-3 text-sm text-[#8A8F98]">{t("No slots for this day yet.", "لا توجد أوقات لهذا اليوم بعد.")}</p>
                    <button onClick={() => setModalOpen(true)} className="text-sm font-semibold text-[#107789] hover:underline">
                      + {t("Add a slot", "أضف وقتًا")}
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-2 lg:grid-cols-3">
                    {daySlots.map((slot, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between rounded-xl border p-4 transition-colors"
                        style={{ backgroundColor: slotConfig[slot.status].bg, borderColor: slotConfig[slot.status].border }}
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-bold" style={{ color: slotConfig[slot.status].text }}>
                            {slot.time}
                          </p>
                          <p className="mt-0.5 truncate text-xs" style={{ color: slotConfig[slot.status].text }}>
                            {slot.studentName ? slot.studentName : lang === "ar" ? slotConfig[slot.status].labelAr : slot.status}
                          </p>
                        </div>
                        <div className="ms-2 flex-shrink-0">
                          {slot.status === "Conflict" && (
                            <button className="rounded-lg border border-[#fecaca] px-2 py-1 text-[10px] font-semibold text-[#dc2626] transition-colors hover:bg-white">
                              {t("Fix", "حل")}
                            </button>
                          )}
                          {slot.status === "Available" && (
                            <button className="rounded-lg border border-[#a5d8e0] px-2 py-1 text-[10px] font-semibold text-[#107789] transition-colors hover:bg-white">
                              {t("Book", "حجز")}
                            </button>
                          )}
                          {slot.status === "Booked" && (
                            <button className="rounded-lg border border-[#E5E7EB] px-2 py-1 text-[10px] font-semibold text-[#6B7280] transition-colors hover:bg-white">
                              {t("View", "عرض")}
                            </button>
                          )}
                        </div>
                      </div>
                    ))}

                    <button
                      onClick={() => setModalOpen(true)}
                      className="flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#D1D5DB] p-4 text-[#9CA3AF] transition-colors hover:border-[#107789] hover:bg-[#EBF5F7] hover:text-[#107789]"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                      <span className="text-xs font-semibold">{t("Add Slot", "إضافة وقت")}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {modalOpen && (
        <AddSlotModal
          teachers={teachers}
          defaultTeacherId={selectedTeacher}
          lang={lang}
          onClose={() => setModalOpen(false)}
          onSave={handleSaveSlot}
        />
      )}
    </div>
  );
}