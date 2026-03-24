"use client";

import { useState } from "react";
import { useLanguage } from "@/src/contexts/LanguageContext";

// ─── Types ────────────────────────────────────────────────────
type Lang = "en" | "ar";
type CourseStatus = "Published" | "Draft" | "Archived";

interface Level {
  id: string;
  titleEn: string;
  titleAr: string;
  lessons: number;
  status: CourseStatus;
}

interface Course {
  id: string;
  titleEn: string;
  titleAr: string;
  levels: Level[];
  totalStudents: number;
  status: CourseStatus;
  createdAt: string;
}

// ─── Config ───────────────────────────────────────────────────
const statusConfig: Record<CourseStatus, { bg: string; text: string; labelAr: string }> = {
  Published: { bg: "#dcfce7", text: "#15803d", labelAr: "منشور" },
  Draft: { bg: "#fef9c3", text: "#a16207", labelAr: "مسودة" },
  Archived: { bg: "#f3f4f6", text: "#6b7280", labelAr: "مؤرشف" },
};

const lessonComponents = [
  {
    key: "vocab",
    labelEn: "Vocabulary & Grammar",
    labelAr: "المفردات والقواعد",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
  },
  {
    key: "listening",
    labelEn: "Listening & Practice",
    labelAr: "الاستماع والتدريب",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
        <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
      </svg>
    ),
  },
  {
    key: "quizzes",
    labelEn: "Quizzes",
    labelAr: "الاختبارات",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
  },
  {
    key: "speaking",
    labelEn: "Speaking Sessions",
    labelAr: "جلسات المحادثة",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
];

const initialCourses: Course[] = [
  {
    id: "CRS-001",
    titleEn: "English Foundation",
    titleAr: "أساسيات اللغة الإنجليزية",
    totalStudents: 420,
    status: "Published",
    createdAt: "Jan 2025",
    levels: [
      { id: "L1", titleEn: "Beginner A1", titleAr: "مبتدئ A1", lessons: 12, status: "Published" },
      { id: "L2", titleEn: "Elementary A2", titleAr: "أساسي A2", lessons: 14, status: "Published" },
      { id: "L3", titleEn: "Pre-Intermediate B1", titleAr: "ما قبل المتوسط B1", lessons: 16, status: "Published" },
      { id: "L4", titleEn: "Intermediate B2", titleAr: "متوسط B2", lessons: 18, status: "Draft" },
    ],
  },
  {
    id: "CRS-002",
    titleEn: "IELTS Preparation",
    titleAr: "تحضير IELTS",
    totalStudents: 185,
    status: "Published",
    createdAt: "Feb 2025",
    levels: [
      { id: "L1", titleEn: "Band 5.0", titleAr: "Band 5.0", lessons: 10, status: "Published" },
      { id: "L2", titleEn: "Band 6.0", titleAr: "Band 6.0", lessons: 12, status: "Published" },
      { id: "L3", titleEn: "Band 7.0", titleAr: "Band 7.0", lessons: 14, status: "Draft" },
      { id: "L4", titleEn: "Band 8.0+", titleAr: "Band 8.0+", lessons: 10, status: "Draft" },
    ],
  },
  {
    id: "CRS-003",
    titleEn: "Business English",
    titleAr: "الإنجليزية التجارية",
    totalStudents: 98,
    status: "Draft",
    createdAt: "Mar 2025",
    levels: [
      { id: "L1", titleEn: "Core Skills", titleAr: "المهارات الأساسية", lessons: 8, status: "Draft" },
      { id: "L2", titleEn: "Advanced", titleAr: "متقدم", lessons: 10, status: "Draft" },
    ],
  },
];

const generateId = (prefix: string) => `${prefix}-${Math.floor(Math.random() * 900) + 100}`;
const fmtDate = () => new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" });

// ─── Shared UI ────────────────────────────────────────────────
function inputCls(err?: boolean) {
  return `w-full px-3 py-2.5 text-sm border rounded-lg bg-white text-[#0B2C33] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-1 transition-colors ${
    err ? "border-[#fca5a5] focus:border-[#dc2626] focus:ring-[#dc2626]/20" : "border-[#E5E7EB] focus:border-[#107789]/50 focus:ring-[#107789]/20"
  }`;
}

function FormField({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-[#0B2C33]">{label}</label>
      {children}
      {error && <p className="text-[11px] text-[#dc2626] font-medium">{error}</p>}
    </div>
  );
}

// ─── Course Form Modal ────────────────────────────────────────
function CourseModal({
  course,
  lang,
  onClose,
  onSave,
}: {
  course?: Course;
  lang: Lang;
  onClose: () => void;
  onSave: (c: Course) => void;
}) {
  const t = (en: string, ar: string) => (lang === "ar" ? ar : en);
  const isEdit = !!course;

  const [form, setForm] = useState({
    titleEn: course?.titleEn ?? "",
    titleAr: course?.titleAr ?? "",
    status: (course?.status ?? "Draft") as CourseStatus,
  });
  const [errors, setErrors] = useState<{ titleEn?: string; titleAr?: string }>({});

  const validate = () => {
    const e: typeof errors = {};
    if (!form.titleEn.trim()) e.titleEn = t("English title is required.", "العنوان الإنجليزي مطلوب.");
    if (!form.titleAr.trim()) e.titleAr = t("Arabic title is required.", "العنوان العربي مطلوب.");
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSave = () => {
    if (!validate()) return;
    onSave({
      id: course?.id ?? generateId("CRS"),
      titleEn: form.titleEn.trim(),
      titleAr: form.titleAr.trim(),
      status: form.status,
      totalStudents: course?.totalStudents ?? 0,
      createdAt: course?.createdAt ?? fmtDate(),
      levels: course?.levels ?? [],
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4" onClick={onClose}>
      <div
        className="w-full max-w-md space-y-5 rounded-2xl bg-white p-6 shadow-2xl"
        dir={lang === "ar" ? "rtl" : "ltr"}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EBF5F7] text-[#107789]">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-base font-bold text-[#0B2C33]">{isEdit ? t("Edit Course", "تعديل المقرر") : t("New Course", "مقرر جديد")}</h2>
              <p className="mt-0.5 text-xs text-[#8A8F98]">
                {isEdit ? t("Update course details", "تحديث تفاصيل المقرر") : t("Fill in the details below", "أدخل التفاصيل أدناه")}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F5F7F9] text-[#8A8F98] transition-colors hover:bg-[#E5E7EB] hover:text-[#0B2C33]"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="border-t border-[#F0F2F5]" />

        <div className="space-y-4">
          <FormField label={`${t("English Title", "العنوان الإنجليزي")} *`} error={errors.titleEn}>
            <input
              type="text"
              placeholder="e.g. English Foundation"
              value={form.titleEn}
              onChange={(e) => setForm({ ...form, titleEn: e.target.value })}
              className={inputCls(!!errors.titleEn)}
            />
          </FormField>

          <FormField label={`${t("Arabic Title", "العنوان بالعربي")} *`} error={errors.titleAr}>
            <input
              type="text"
              placeholder="مثال: أساسيات اللغة الإنجليزية"
              value={form.titleAr}
              onChange={(e) => setForm({ ...form, titleAr: e.target.value })}
              className={inputCls(!!errors.titleAr)}
              dir="rtl"
            />
          </FormField>

          <FormField label={t("Status", "الحالة")}>
            <div className="flex items-center gap-2">
              {(["Published", "Draft", "Archived"] as CourseStatus[]).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setForm({ ...form, status: s })}
                  className={[
                    "flex-1 rounded-lg border py-2 text-xs font-semibold transition-all",
                    form.status === s ? "border-transparent" : "border-[#E5E7EB] text-[#9CA3AF] hover:bg-[#F5F7F9]",
                  ].join(" ")}
                  style={form.status === s ? { backgroundColor: statusConfig[s].bg, color: statusConfig[s].text, borderColor: "transparent" } : {}}
                >
                  {lang === "ar" ? statusConfig[s].labelAr : s}
                </button>
              ))}
            </div>
          </FormField>
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
            {isEdit ? t("Save Changes", "حفظ التغييرات") : t("Create Course", "إنشاء المقرر")}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Level Form Modal ─────────────────────────────────────────
function LevelModal({
  level,
  courseTitle,
  lang,
  onClose,
  onSave,
}: {
  level?: Level;
  courseTitle: string;
  lang: Lang;
  onClose: () => void;
  onSave: (l: Level) => void;
}) {
  const t = (en: string, ar: string) => (lang === "ar" ? ar : en);
  const isEdit = !!level;

  const [form, setForm] = useState({
    titleEn: level?.titleEn ?? "",
    titleAr: level?.titleAr ?? "",
    lessons: level?.lessons ?? 10,
    status: (level?.status ?? "Draft") as CourseStatus,
  });
  const [errors, setErrors] = useState<{ titleEn?: string; titleAr?: string; lessons?: string }>({});

  const validate = () => {
    const e: typeof errors = {};
    if (!form.titleEn.trim()) e.titleEn = t("English title is required.", "العنوان الإنجليزي مطلوب.");
    if (!form.titleAr.trim()) e.titleAr = t("Arabic title is required.", "العنوان العربي مطلوب.");
    if (!form.lessons || form.lessons < 1) e.lessons = t("At least 1 lesson.", "درس واحد على الأقل.");
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSave = () => {
    if (!validate()) return;
    onSave({
      id: level?.id ?? generateId("LVL"),
      titleEn: form.titleEn.trim(),
      titleAr: form.titleAr.trim(),
      lessons: form.lessons,
      status: form.status,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4" onClick={onClose}>
      <div
        className="w-full max-w-md space-y-5 rounded-2xl bg-white p-6 shadow-2xl"
        dir={lang === "ar" ? "rtl" : "ltr"}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-[#0B2C33]">{isEdit ? t("Edit Level", "تعديل المستوى") : t("Add Level", "إضافة مستوى")}</h2>
            <p className="mt-0.5 text-xs text-[#8A8F98]">{courseTitle}</p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F5F7F9] text-[#8A8F98] transition-colors hover:bg-[#E5E7EB] hover:text-[#0B2C33]"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="border-t border-[#F0F2F5]" />

        <div className="space-y-4">
          <FormField label={`${t("English Title", "العنوان الإنجليزي")} *`} error={errors.titleEn}>
            <input
              type="text"
              placeholder="e.g. Beginner A1"
              value={form.titleEn}
              onChange={(e) => setForm({ ...form, titleEn: e.target.value })}
              className={inputCls(!!errors.titleEn)}
            />
          </FormField>
          <FormField label={`${t("Arabic Title", "العنوان بالعربي")} *`} error={errors.titleAr}>
            <input
              type="text"
              placeholder="مثال: مبتدئ A1"
              value={form.titleAr}
              onChange={(e) => setForm({ ...form, titleAr: e.target.value })}
              className={inputCls(!!errors.titleAr)}
              dir="rtl"
            />
          </FormField>
          <FormField label={`${t("Number of Lessons", "عدد الدروس")} *`} error={errors.lessons}>
            <input
              type="number"
              min={1}
              max={100}
              value={form.lessons}
              onChange={(e) => setForm({ ...form, lessons: parseInt(e.target.value) || 0 })}
              className={inputCls(!!errors.lessons)}
            />
          </FormField>
          <FormField label={t("Status", "الحالة")}>
            <div className="flex items-center gap-2">
              {(["Published", "Draft"] as CourseStatus[]).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setForm({ ...form, status: s })}
                  className={[
                    "flex-1 rounded-lg border py-2 text-xs font-semibold transition-all",
                    form.status === s ? "border-transparent" : "border-[#E5E7EB] text-[#9CA3AF] hover:bg-[#F5F7F9]",
                  ].join(" ")}
                  style={form.status === s ? { backgroundColor: statusConfig[s].bg, color: statusConfig[s].text } : {}}
                >
                  {lang === "ar" ? statusConfig[s].labelAr : s}
                </button>
              ))}
            </div>
          </FormField>
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
            {isEdit ? t("Save Changes", "حفظ التغييرات") : t("Add Level", "إضافة المستوى")}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Delete Confirm Modal ─────────────────────────────────────
function DeleteModal({
  title,
  description,
  lang,
  onClose,
  onConfirm,
}: {
  title: string;
  description: string;
  lang: Lang;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const t = (en: string, ar: string) => (lang === "ar" ? ar : en);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4" onClick={onClose}>
      <div
        className="w-full max-w-sm space-y-4 rounded-2xl bg-white p-6 shadow-2xl"
        dir={lang === "ar" ? "rtl" : "ltr"}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#fee2e2] text-[#dc2626]">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14H6L5 6" />
              <path d="M10 11v6" />
              <path d="M14 11v6" />
              <path d="M9 6V4h6v2" />
            </svg>
          </div>
          <div>
            <h2 className="text-base font-bold text-[#0B2C33]">{title}</h2>
            <p className="mt-1 text-sm text-[#6B7280]">{description}</p>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="rounded-lg bg-[#F5F7F9] px-4 py-2.5 text-sm font-semibold text-[#6B7280] transition-colors hover:bg-[#E5E7EB]"
          >
            {t("Cancel", "إلغاء")}
          </button>
          <button
            onClick={onConfirm}
            className="rounded-lg bg-[#dc2626] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#b91c1c]"
          >
            {t("Delete", "حذف")}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────
export default function CourseManagementPage() {
  const { lang, isRTL, t } = useLanguage();

  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [expandedCourse, setExpanded] = useState<string | null>("CRS-001");
  const [statusFilter, setStatusFilter] = useState<CourseStatus | "All">("All");

  const [addCourseOpen, setAddCourseOpen] = useState(false);
  const [editCourse, setEditCourse] = useState<Course | null>(null);
  const [deleteCourse, setDeleteCourse] = useState<Course | null>(null);
  const [addLevelCourse, setAddLevelCourse] = useState<Course | null>(null);
  const [editLevel, setEditLevel] = useState<{ course: Course; level: Level } | null>(null);
  const [deleteLevel, setDeleteLevel] = useState<{ course: Course; level: Level } | null>(null);

  const [toast, setToast] = useState("");
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3500);
  };

  const filtered = courses.filter((c) => statusFilter === "All" || c.status === statusFilter);

  const handleAddCourse = (c: Course) => {
    setCourses((p) => [c, ...p]);
    setAddCourseOpen(false);
    showToast(t(`Course "${c.titleEn}" created!`, `تم إنشاء "${c.titleAr}"!`));
  };

  const handleEditCourse = (c: Course) => {
    setCourses((p) => p.map((x) => (x.id === c.id ? c : x)));
    setEditCourse(null);
    showToast(t(`Course "${c.titleEn}" updated!`, `تم تحديث "${c.titleAr}"!`));
  };

  const handleDeleteCourse = () => {
    if (!deleteCourse) return;
    setCourses((p) => p.filter((x) => x.id !== deleteCourse.id));
    if (expandedCourse === deleteCourse.id) setExpanded(null);
    showToast(t(`Course "${deleteCourse.titleEn}" deleted.`, `تم حذف "${deleteCourse.titleAr}".`));
    setDeleteCourse(null);
  };

  const updateLevels = (courseId: string, levels: Level[]) =>
    setCourses((p) => p.map((c) => (c.id === courseId ? { ...c, levels } : c)));

  const handleAddLevel = (level: Level) => {
    if (!addLevelCourse) return;
    updateLevels(addLevelCourse.id, [...addLevelCourse.levels, level]);
    setAddLevelCourse(null);
    showToast(t("Level added!", "تمت إضافة المستوى!"));
  };

  const handleEditLevel = (level: Level) => {
    if (!editLevel) return;
    const levels = editLevel.course.levels.map((l) => (l.id === level.id ? level : l));
    updateLevels(editLevel.course.id, levels);
    setEditLevel(null);
    showToast(t("Level updated!", "تم تحديث المستوى!"));
  };

  const handleDeleteLevel = () => {
    if (!deleteLevel) return;
    const levels = deleteLevel.course.levels.filter((l) => l.id !== deleteLevel.level.id);
    updateLevels(deleteLevel.course.id, levels);
    setDeleteLevel(null);
    showToast(t("Level deleted.", "تم حذف المستوى."));
  };

  return (
    <main className="flex-1 space-y-5 overflow-auto p-6" dir={isRTL ? "rtl" : "ltr"}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-bold text-[#0B2C33]">{t("Course Management", "إدارة المقررات")}</h1>
          <p className="mt-0.5 text-sm text-[#8A8F98]">{t("Manage curriculums, levels, and lesson components", "إدارة المناهج والمستويات ومكونات الدروس")}</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setAddCourseOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-[#107789] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#0d6275]"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            {t("New Course", "مقرر جديد")}
          </button>
        </div>
      </div>

      {toast && (
        <div className="flex items-center gap-2.5 rounded-xl border border-[#bbf7d0] bg-[#f0fdf4] px-4 py-3">
          <svg className="flex-shrink-0 text-[#15803d]" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <p className="text-sm font-semibold text-[#15803d]">{toast}</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { labelEn: "Total Courses", labelAr: "إجمالي المقررات", value: courses.length, color: "#107789" },
          { labelEn: "Published", labelAr: "المنشورة", value: courses.filter((c) => c.status === "Published").length, color: "#15803d" },
          { labelEn: "Draft", labelAr: "المسودات", value: courses.filter((c) => c.status === "Draft").length, color: "#a16207" },
          { labelEn: "Total Levels", labelAr: "إجمالي المستويات", value: courses.reduce((a, c) => a + c.levels.length, 0), color: "#7c3aed" },
        ].map((c) => (
          <div key={c.labelEn} className="rounded-xl border border-[#F0F2F5] bg-white p-4 shadow-sm">
            <p className="text-xs font-medium text-[#8A8F98]">{t(c.labelEn, c.labelAr)}</p>
            <p className="mt-1 text-2xl font-bold" style={{ color: c.color }}>
              {c.value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="space-y-3 xl:col-span-2">
          <div className="flex items-center gap-2">
            {(["All", "Published", "Draft", "Archived"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={[
                  "rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
                  statusFilter === s ? "bg-[#107789] text-white" : "border border-[#F0F2F5] bg-white text-[#6B7280] hover:bg-[#EBF5F7] hover:text-[#107789]",
                ].join(" ")}
              >
                {s === "All" ? t("All", "الكل") : lang === "ar" ? statusConfig[s].labelAr : s}
              </button>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="rounded-xl border border-[#F0F2F5] bg-white p-10 text-center">
              <p className="text-sm text-[#8A8F98]">{t("No courses found.", "لا توجد مقررات.")}</p>
            </div>
          )}

          {filtered.map((course) => {
            const isExpanded = expandedCourse === course.id;
            return (
              <div key={course.id} className="overflow-hidden rounded-xl border border-[#F0F2F5] bg-white shadow-sm">
                <div className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-[#FAFBFC]">
                  <button className="flex min-w-0 flex-1 items-center gap-4 text-start" onClick={() => setExpanded(isExpanded ? null : course.id)}>
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[#EBF5F7] text-[#107789]">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                      </svg>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold text-[#0B2C33]">{t(course.titleEn, course.titleAr)}</p>
                        <span
                          className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
                          style={{ backgroundColor: statusConfig[course.status].bg, color: statusConfig[course.status].text }}
                        >
                          {lang === "ar" ? statusConfig[course.status].labelAr : course.status}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-[#8A8F98]">
                        {course.levels.length} {t("levels", "مستويات")} · {course.totalStudents} {t("students", "طالب")} · {t("Created", "أُنشئ")} {course.createdAt}
                      </p>
                    </div>
                  </button>
                  <div className="flex flex-shrink-0 items-center gap-2">
                    <button
                      onClick={() => setEditCourse(course)}
                      className="rounded px-2 py-1 text-xs font-medium text-[#107789] transition-colors hover:bg-[#EBF5F7] hover:underline"
                    >
                      {t("Edit", "تعديل")}
                    </button>
                    <button
                      onClick={() => setDeleteCourse(course)}
                      className="rounded px-2 py-1 text-xs font-medium text-[#dc2626] transition-colors hover:bg-[#fee2e2] hover:underline"
                    >
                      {t("Delete", "حذف")}
                    </button>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#9CA3AF"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`cursor-pointer transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                      onClick={() => setExpanded(isExpanded ? null : course.id)}
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t border-[#F0F2F5]">
                    <div className="flex items-center justify-between bg-[#FAFBFC] px-5 py-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-[#8A8F98]">{t("Levels", "المستويات")}</p>
                      <button onClick={() => setAddLevelCourse(course)} className="flex items-center gap-1 text-xs font-medium text-[#107789] hover:underline">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="12" y1="5" x2="12" y2="19" />
                          <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        {t("Add Level", "إضافة مستوى")}
                      </button>
                    </div>

                    {course.levels.length === 0 ? (
                      <p className="px-5 py-4 text-center text-xs text-[#8A8F98]">{t("No levels yet.", "لا توجد مستويات بعد.")}</p>
                    ) : (
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-[#F0F2F5]">
                            {[{ en: "Level", ar: "المستوى" }, { en: "Lessons", ar: "الدروس" }, { en: "Status", ar: "الحالة" }, { en: "Actions", ar: "إجراءات" }].map(
                              (col) => (
                                <th key={col.en} className="px-5 py-2.5 text-start text-xs font-semibold text-[#8A8F98]">
                                  {t(col.en, col.ar)}
                                </th>
                              )
                            )}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#F0F2F5]">
                          {course.levels.map((level) => (
                            <tr key={level.id} className="transition-colors hover:bg-[#F5F7F9]">
                              <td className="px-5 py-3 font-medium text-[#0B2C33]">{t(level.titleEn, level.titleAr)}</td>
                              <td className="px-5 py-3 text-[#6B7280]">
                                {level.lessons} {t("lessons", "درس")}
                              </td>
                              <td className="px-5 py-3">
                                <span
                                  className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
                                  style={{ backgroundColor: statusConfig[level.status].bg, color: statusConfig[level.status].text }}
                                >
                                  {lang === "ar" ? statusConfig[level.status].labelAr : level.status}
                                </span>
                              </td>
                              <td className="px-5 py-3">
                                <div className="flex items-center gap-2">
                                  <button onClick={() => setEditLevel({ course, level })} className="text-xs font-medium text-[#107789] hover:underline">
                                    {t("Edit", "تعديل")}
                                  </button>
                                  <span className="text-[#E5E7EB]">|</span>
                                  <button onClick={() => setDeleteLevel({ course, level })} className="text-xs font-medium text-[#dc2626] hover:underline">
                                    {t("Delete", "حذف")}
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-[#F0F2F5] bg-white p-5 shadow-sm">
            <p className="mb-1 text-sm font-semibold text-[#0B2C33]">{t("Lesson Components", "مكونات الدرس")}</p>
            <p className="mb-4 text-xs text-[#8A8F98]">{t("Each lesson includes:", "كل درس يحتوي على:")}</p>
            <div className="space-y-2">
              {lessonComponents.map((comp) => (
                <div
                  key={comp.key}
                  className="group flex items-center gap-3 rounded-lg border border-[#F0F2F5] p-3 transition-colors hover:border-[#107789]/30 hover:bg-[#EBF5F7]"
                >
                  <span className="flex-shrink-0 text-[#107789]">{comp.icon}</span>
                  <span className="text-sm font-medium text-[#0B2C33] transition-colors group-hover:text-[#107789]">{t(comp.labelEn, comp.labelAr)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-[#F0F2F5] bg-white p-5 shadow-sm">
            <p className="mb-4 text-sm font-semibold text-[#0B2C33]">{t("Course Stats", "إحصائيات المقررات")}</p>
            <div className="space-y-3">
              {[
                { labelEn: "Avg. Completion Rate", labelAr: "متوسط معدل الإتمام", value: "74%", width: "74%" },
                { labelEn: "Student Satisfaction", labelAr: "رضا الطلاب", value: "91%", width: "91%" },
                { labelEn: "Quiz Pass Rate", labelAr: "معدل اجتياز الاختبارات", value: "83%", width: "83%" },
              ].map((item) => (
                <div key={item.labelEn}>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-xs text-[#8A8F98]">{t(item.labelEn, item.labelAr)}</span>
                    <span className="text-xs font-bold text-[#0B2C33]">{item.value}</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#F0F2F5]">
                    <div className="h-full rounded-full bg-[#107789]" style={{ width: item.width }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-[#a5d8e0] bg-[#EBF5F7] p-4">
            <p className="mb-1 text-xs font-semibold text-[#107789]">{t("Language Switching", "تبديل اللغة")}</p>
            <p className="text-xs leading-relaxed text-[#0B2C33]">
              {t(
                "Language is switched instantly on the client side. User preference can be saved to the backend via API for persistence across sessions.",
                "يتم تبديل اللغة فورياً على جانب العميل. يمكن حفظ تفضيل المستخدم في الخادم عبر API للاحتفاظ به عبر الجلسات."
              )}
            </p>
          </div>
        </div>
      </div>

      {addCourseOpen && <CourseModal lang={lang} onClose={() => setAddCourseOpen(false)} onSave={handleAddCourse} />}
      {editCourse && <CourseModal lang={lang} course={editCourse} onClose={() => setEditCourse(null)} onSave={handleEditCourse} />}
      {deleteCourse && (
        <DeleteModal
          lang={lang}
          title={t("Delete Course", "حذف المقرر")}
          description={t(
            `Are you sure you want to delete "${deleteCourse.titleEn}"? All levels will be permanently removed.`,
            `هل أنت متأكد من حذف "${deleteCourse.titleAr}"؟ سيتم حذف جميع المستويات نهائياً.`
          )}
          onClose={() => setDeleteCourse(null)}
          onConfirm={handleDeleteCourse}
        />
      )}
      {addLevelCourse && (
        <LevelModal lang={lang} courseTitle={t(addLevelCourse.titleEn, addLevelCourse.titleAr)} onClose={() => setAddLevelCourse(null)} onSave={handleAddLevel} />
      )}
      {editLevel && (
        <LevelModal
          lang={lang}
          level={editLevel.level}
          courseTitle={t(editLevel.course.titleEn, editLevel.course.titleAr)}
          onClose={() => setEditLevel(null)}
          onSave={handleEditLevel}
        />
      )}
      {deleteLevel && (
        <DeleteModal
          lang={lang}
          title={t("Delete Level", "حذف المستوى")}
          description={t(`Delete "${deleteLevel.level.titleEn}" from this course?`, `حذف "${deleteLevel.level.titleAr}" من هذا المقرر؟`)}
          onClose={() => setDeleteLevel(null)}
          onConfirm={handleDeleteLevel}
        />
      )}
    </main>
  );
}