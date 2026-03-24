"use client";

import { useState } from "react";
import { useLanguage } from "@/src/contexts/LanguageContext";

// ─── Types ────────────────────────────────────────────────────
type PackageStatus = "Active" | "Inactive";

interface PackageFeature {
  id:  string;
  en:  string;
  ar:  string;
}

interface Package {
  id:           string;
  nameEn:       string;
  nameAr:       string;
  lessons:      number;
  price:        number;
  currency:     string;
  durationDays: number;
  status:       PackageStatus;
  popular?:     boolean;
  descriptionEn: string;
  descriptionAr: string;
  features:     PackageFeature[];
}

// ─── Config ───────────────────────────────────────────────────
const statusConfig: Record<PackageStatus, { bg: string; text: string; labelAr: string }> = {
  Active:   { bg: "#dcfce7", text: "#15803d", labelAr: "نشط"      },
  Inactive: { bg: "#f3f4f6", text: "#6b7280", labelAr: "غير نشط"  },
};

const genId   = (p: string) => `${p}-${Math.floor(Math.random() * 900) + 100}`;
const featId  = ()           => `F-${Date.now()}-${Math.random().toString(36).slice(2,6)}`;

// ─── Initial Data ─────────────────────────────────────────────
const initialPackages: Package[] = [
  {
    id: "PKG-001", nameEn: "Basic Pack", nameAr: "الباقة الأساسية",
    lessons: 12, price: 150, currency: "$", durationDays: 60, status: "Active",
    descriptionEn: "Perfect for beginners getting started", descriptionAr: "مثالية للمبتدئين في البداية",
    features: [
      { id: featId(), en: "12 one-on-one lessons",       ar: "12 درسًا فرديًا"               },
      { id: featId(), en: "Access to learning materials", ar: "الوصول إلى المواد التعليمية" },
      { id: featId(), en: "Progress tracking",            ar: "متابعة التقدم"                },
    ],
  },
  {
    id: "PKG-002", nameEn: "Standard Pack", nameAr: "الباقة المعيارية",
    lessons: 24, price: 280, currency: "$", durationDays: 90, status: "Active", popular: true,
    descriptionEn: "Most popular choice for steady progress", descriptionAr: "الخيار الأكثر شيوعًا لتقدم مستمر",
    features: [
      { id: featId(), en: "24 one-on-one lessons",     ar: "24 درسًا فرديًا"           },
      { id: featId(), en: "Access to all courses",     ar: "الوصول لجميع المقررات"    },
      { id: featId(), en: "Progress tracking",         ar: "متابعة التقدم"             },
      { id: featId(), en: "Monthly performance report",ar: "تقرير أداء شهري"           },
    ],
  },
  {
    id: "PKG-003", nameEn: "Premium Pack", nameAr: "الباقة المميزة",
    lessons: 50, price: 500, currency: "$", durationDays: 180, status: "Active",
    descriptionEn: "Comprehensive plan for fast learners", descriptionAr: "خطة شاملة للمتعلمين السريعين",
    features: [
      { id: featId(), en: "50 one-on-one lessons",      ar: "50 درسًا فرديًا"          },
      { id: featId(), en: "Access to all courses",      ar: "الوصول لجميع المقررات"   },
      { id: featId(), en: "Priority teacher selection", ar: "اختيار معلم بالأولوية"   },
      { id: featId(), en: "Weekly performance report",  ar: "تقرير أداء أسبوعي"       },
      { id: featId(), en: "Free trial extension",       ar: "تمديد تجريبي مجاني"      },
    ],
  },
  {
    id: "PKG-004", nameEn: "IELTS Intensive", nameAr: "مكثف IELTS",
    lessons: 30, price: 380, currency: "$", durationDays: 90, status: "Inactive",
    descriptionEn: "Targeted prep for IELTS exam success", descriptionAr: "تحضير مستهدف لنجاح اختبار IELTS",
    features: [
      { id: featId(), en: "30 IELTS-focused lessons",  ar: "30 درسًا مخصصًا لـ IELTS" },
      { id: featId(), en: "Mock exam sessions",         ar: "جلسات اختبار تجريبي"       },
      { id: featId(), en: "Detailed scoring feedback",  ar: "تغذية راجعة تفصيلية"      },
    ],
  },
];

// ─── Helpers ──────────────────────────────────────────────────
function inputCls(err?: boolean) {
  return `w-full px-3 py-2.5 text-sm border rounded-lg bg-white text-[#0B2C33] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-1 transition-colors ${
    err ? "border-[#fca5a5] focus:border-[#dc2626] focus:ring-[#dc2626]/20"
        : "border-[#E5E7EB] focus:border-[#107789]/50 focus:ring-[#107789]/20"
  }`;
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-[#0B2C33]">{label}</label>
      {children}
      {error && <p className="text-[11px] text-[#dc2626] font-medium">{error}</p>}
    </div>
  );
}

// ─── Package Form Modal ───────────────────────────────────────
type PkgForm = {
  nameEn: string; nameAr: string;
  descriptionEn: string; descriptionAr: string;
  lessons: number; price: number; durationDays: number;
  status: PackageStatus; popular: boolean;
  features: PackageFeature[];
};

function PackageModal({ pkg, onClose, onSave }: {
  pkg?:    Package;
  onClose: () => void;
  onSave:  (p: Package) => void;
}) {
  const { isRTL, t, lang } = useLanguage();
  const isEdit = !!pkg;

  const [form, setForm] = useState<PkgForm>({
    nameEn:        pkg?.nameEn        ?? "",
    nameAr:        pkg?.nameAr        ?? "",
    descriptionEn: pkg?.descriptionEn ?? "",
    descriptionAr: pkg?.descriptionAr ?? "",
    lessons:       pkg?.lessons       ?? 12,
    price:         pkg?.price         ?? 100,
    durationDays:  pkg?.durationDays  ?? 60,
    status:        pkg?.status        ?? "Active",
    popular:       pkg?.popular       ?? false,
    features:      pkg?.features      ?? [],
  });

  const [errors, setErrors] = useState<Partial<Record<keyof PkgForm, string>>>({});
  const [newFeatEn, setNewFeatEn] = useState("");
  const [newFeatAr, setNewFeatAr] = useState("");

  const validate = () => {
    const e: typeof errors = {};
    if (!form.nameEn.trim())        e.nameEn        = t("Required","مطلوب");
    if (!form.nameAr.trim())        e.nameAr        = t("Required","مطلوب");
    if (!form.descriptionEn.trim()) e.descriptionEn = t("Required","مطلوب");
    if (!form.descriptionAr.trim()) e.descriptionAr = t("Required","مطلوب");
    if (form.lessons < 1)           e.lessons       = t("Min 1","الحد الأدنى 1");
    if (form.price < 1)             e.price         = t("Min 1","الحد الأدنى 1");
    if (form.durationDays < 1)      e.durationDays  = t("Min 1","الحد الأدنى 1");
    setErrors(e);
    return !Object.keys(e).length;
  };

  const addFeature = () => {
    if (!newFeatEn.trim() || !newFeatAr.trim()) return;
    setForm({ ...form, features: [...form.features, { id: featId(), en: newFeatEn.trim(), ar: newFeatAr.trim() }] });
    setNewFeatEn(""); setNewFeatAr("");
  };

  const removeFeature = (id: string) =>
    setForm({ ...form, features: form.features.filter((f) => f.id !== id) });

  const handleSave = () => {
    if (!validate()) return;
    onSave({
      id:           pkg?.id ?? genId("PKG"),
      currency:     "$",
      ...form,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto p-6 space-y-5"
        dir={isRTL ? "rtl" : "ltr"} onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#EBF5F7] flex items-center justify-center text-[#107789]">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
            </div>
            <div>
              <h2 className="text-base font-bold text-[#0B2C33]">{isEdit ? t("Edit Package","تعديل الباقة") : t("New Package","باقة جديدة")}</h2>
              <p className="text-xs text-[#8A8F98] mt-0.5">{isEdit ? t("Update package details","تحديث تفاصيل الباقة") : t("Fill in the details below","أدخل التفاصيل أدناه")}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-[#F5F7F9] flex items-center justify-center text-[#8A8F98] hover:text-[#0B2C33] hover:bg-[#E5E7EB] transition-colors">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="border-t border-[#F0F2F5]" />

        <div className="space-y-4">
          {/* Names */}
          <div className="grid grid-cols-2 gap-3">
            <Field label={`${t("Name (EN)","الاسم إنجليزي")} *`} error={errors.nameEn}>
              <input type="text" placeholder="e.g. Basic Pack" value={form.nameEn}
                onChange={(e) => setForm({ ...form, nameEn: e.target.value })} className={inputCls(!!errors.nameEn)} />
            </Field>
            <Field label={`${t("Name (AR)","الاسم عربي")} *`} error={errors.nameAr}>
              <input type="text" placeholder="مثال: الباقة الأساسية" value={form.nameAr}
                onChange={(e) => setForm({ ...form, nameAr: e.target.value })} className={inputCls(!!errors.nameAr)} dir="rtl" />
            </Field>
          </div>

          {/* Descriptions */}
          <Field label={`${t("Description (EN)","الوصف إنجليزي")} *`} error={errors.descriptionEn}>
            <input type="text" placeholder="Short description in English" value={form.descriptionEn}
              onChange={(e) => setForm({ ...form, descriptionEn: e.target.value })} className={inputCls(!!errors.descriptionEn)} />
          </Field>
          <Field label={`${t("Description (AR)","الوصف عربي")} *`} error={errors.descriptionAr}>
            <input type="text" placeholder="وصف مختصر بالعربية" value={form.descriptionAr}
              onChange={(e) => setForm({ ...form, descriptionAr: e.target.value })} className={inputCls(!!errors.descriptionAr)} dir="rtl" />
          </Field>

          {/* Numbers */}
          <div className="grid grid-cols-3 gap-3">
            <Field label={`${t("Lessons","الدروس")} *`} error={errors.lessons}>
              <input type="number" min={1} value={form.lessons}
                onChange={(e) => setForm({ ...form, lessons: +e.target.value })} className={inputCls(!!errors.lessons)} />
            </Field>
            <Field label={`${t("Price ($)","السعر ($)")} *`} error={errors.price}>
              <input type="number" min={1} value={form.price}
                onChange={(e) => setForm({ ...form, price: +e.target.value })} className={inputCls(!!errors.price)} />
            </Field>
            <Field label={`${t("Days","الأيام")} *`} error={errors.durationDays}>
              <input type="number" min={1} value={form.durationDays}
                onChange={(e) => setForm({ ...form, durationDays: +e.target.value })} className={inputCls(!!errors.durationDays)} />
            </Field>
          </div>

          {/* Status + Popular */}
          <div className="grid grid-cols-2 gap-3">
            <Field label={t("Status","الحالة")}>
              <div className="flex gap-2">
                {(["Active","Inactive"] as PackageStatus[]).map((s) => (
                  <button key={s} type="button" onClick={() => setForm({ ...form, status: s })}
                    className={["flex-1 py-2.5 rounded-lg text-xs font-semibold border transition-all",
                      form.status === s ? "border-transparent" : "border-[#E5E7EB] text-[#9CA3AF] hover:bg-[#F5F7F9]",
                    ].join(" ")}
                    style={form.status === s ? { backgroundColor: statusConfig[s].bg, color: statusConfig[s].text } : {}}>
                    {lang === "ar" ? statusConfig[s].labelAr : s}
                  </button>
                ))}
              </div>
            </Field>
            <Field label={t("Mark as Popular","تمييز كشائع")}>
              <button type="button" onClick={() => setForm({ ...form, popular: !form.popular })}
                className={["w-full py-2.5 rounded-lg text-xs font-semibold border transition-all",
                  form.popular
                    ? "bg-[#EBF5F7] border-[#107789]/40 text-[#107789]"
                    : "border-[#E5E7EB] text-[#9CA3AF] hover:bg-[#F5F7F9]",
                ].join(" ")}>
                {form.popular ? `★ ${t("Popular","شائع")}` : `☆ ${t("Not Popular","غير شائع")}`}
              </button>
            </Field>
          </div>

          {/* Features */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#0B2C33]">{t("Features","المميزات")}</label>

            {/* Existing features */}
            {form.features.map((f) => (
              <div key={f.id} className="flex items-center gap-2 bg-[#F5F7F9] rounded-lg px-3 py-2 border border-[#F0F2F5]">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#107789" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-[#0B2C33] truncate">{f.en}</p>
                  <p className="text-[10px] text-[#8A8F98] truncate">{f.ar}</p>
                </div>
                <button onClick={() => removeFeature(f.id)}
                  className="text-[#dc2626] hover:text-[#b91c1c] flex-shrink-0 transition-colors">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
            ))}

            {/* Add new feature */}
            <div className="space-y-2 pt-1">
              <div className="grid grid-cols-2 gap-2">
                <input type="text" placeholder={t("Feature in English","ميزة بالإنجليزية")}
                  value={newFeatEn} onChange={(e) => setNewFeatEn(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-[#E5E7EB] rounded-lg bg-white text-[#0B2C33] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#107789]/50" />
                <input type="text" placeholder={t("Feature in Arabic","ميزة بالعربية")}
                  value={newFeatAr} onChange={(e) => setNewFeatAr(e.target.value)}
                  dir="rtl" className="w-full px-3 py-2 text-xs border border-[#E5E7EB] rounded-lg bg-white text-[#0B2C33] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#107789]/50" />
              </div>
              <button onClick={addFeature}
                disabled={!newFeatEn.trim() || !newFeatAr.trim()}
                className="flex items-center gap-1.5 text-xs font-medium text-[#107789] hover:underline disabled:opacity-40 disabled:no-underline transition-opacity">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                {t("Add Feature","إضافة ميزة")}
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-[#F0F2F5]" />
        <div className="flex items-center gap-3 justify-end">
          <button onClick={onClose} className="px-4 py-2.5 text-sm font-semibold text-[#6B7280] bg-[#F5F7F9] rounded-lg hover:bg-[#E5E7EB] transition-colors">
            {t("Cancel","إلغاء")}
          </button>
          <button onClick={handleSave} className="px-5 py-2.5 text-sm font-semibold text-white bg-[#107789] hover:bg-[#0d6275] rounded-lg transition-colors">
            {isEdit ? t("Save Changes","حفظ التغييرات") : t("Create Package","إنشاء الباقة")}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Delete Confirm Modal ─────────────────────────────────────
function DeleteModal({ title, description, onClose, onConfirm }: {
  title:       string;
  description: string;
  onClose:     () => void;
  onConfirm:   () => void;
}) {
  const { isRTL, t } = useLanguage();
  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4"
        dir={isRTL ? "rtl" : "ltr"} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#fee2e2] flex items-center justify-center text-[#dc2626] flex-shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/>
              <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
            </svg>
          </div>
          <div>
            <h2 className="text-base font-bold text-[#0B2C33]">{title}</h2>
            <p className="text-sm text-[#6B7280] mt-1">{description}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 justify-end pt-2">
          <button onClick={onClose} className="px-4 py-2.5 text-sm font-semibold text-[#6B7280] bg-[#F5F7F9] rounded-lg hover:bg-[#E5E7EB] transition-colors">
            {t("Cancel","إلغاء")}
          </button>
          <button onClick={onConfirm} className="px-5 py-2.5 text-sm font-semibold text-white bg-[#dc2626] hover:bg-[#b91c1c] rounded-lg transition-colors">
            {t("Delete","حذف")}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────
export default function PackagesPricingPage() {
  const { lang, isRTL, t } = useLanguage();

  const [packages, setPackages]       = useState<Package[]>(initialPackages);
  const [view, setView]               = useState<"cards" | "table">("cards");
  const [statusFilter, setStatusFilter] = useState<PackageStatus | "All">("All");

  const [addOpen,    setAddOpen]    = useState(false);
  const [editPkg,    setEditPkg]    = useState<Package | null>(null);
  const [deletePkg,  setDeletePkg]  = useState<Package | null>(null);
  const [toast,      setToast]      = useState("");

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3500); };

  const filtered = packages.filter((p) => statusFilter === "All" || p.status === statusFilter);

  // CRUD
  const handleAdd = (p: Package) => {
    setPackages((prev) => [p, ...prev]);
    setAddOpen(false);
    showToast(t(`Package "${p.nameEn}" created!`, `تم إنشاء "${p.nameAr}"!`));
  };

  const handleEdit = (p: Package) => {
    setPackages((prev) => prev.map((x) => x.id === p.id ? p : x));
    setEditPkg(null);
    showToast(t(`Package "${p.nameEn}" updated!`, `تم تحديث "${p.nameAr}"!`));
  };

  const handleDelete = () => {
    if (!deletePkg) return;
    setPackages((prev) => prev.filter((x) => x.id !== deletePkg.id));
    showToast(t(`Package "${deletePkg.nameEn}" deleted.`, `تم حذف "${deletePkg.nameAr}".`));
    setDeletePkg(null);
  };

  const toggleStatus = (id: string) => {
    setPackages((prev) => prev.map((p) =>
      p.id === id ? { ...p, status: p.status === "Active" ? "Inactive" : "Active" } : p
    ));
  };

  return (
    <main className="flex-1 space-y-5 overflow-auto p-6" dir={isRTL ? "rtl" : "ltr"}>

      {/* Page Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-lg font-bold text-[#0B2C33]">{t("Packages & Pricing","الباقات والأسعار")}</h1>
          <p className="mt-0.5 text-sm text-[#8A8F98]">{t("Manage subscription packages and pricing plans","إدارة باقات الاشتراك وخطط الأسعار")}</p>
        </div>
        <button onClick={() => setAddOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-[#107789] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0d6275] shadow-sm">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          {t("New Package","باقة جديدة")}
        </button>
      </div>

      {/* Toast */}
      {toast && (
        <div className="flex items-center gap-2.5 bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl px-4 py-3">
          <svg className="text-[#15803d] flex-shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          <p className="text-sm font-semibold text-[#15803d]">{toast}</p>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { labelEn: "Total Packages", labelAr: "إجمالي الباقات", value: packages.length,                                      color: "#107789" },
          { labelEn: "Active",         labelAr: "النشطة",          value: packages.filter((p) => p.status === "Active").length, color: "#15803d" },
          { labelEn: "Max Lessons",    labelAr: "أعلى درس",        value: packages.length ? Math.max(...packages.map((p) => p.lessons)) : 0, color: "#7c3aed" },
          { labelEn: "Price Range",    labelAr: "نطاق السعر",      value: packages.length ? `$${Math.min(...packages.map(p=>p.price))}–$${Math.max(...packages.map(p=>p.price))}` : "—", color: "#d97706" },
        ].map((c) => (
          <div key={c.labelEn} className="rounded-xl border border-[#F0F2F5] bg-white p-4 shadow-sm">
            <p className="text-xs font-medium text-[#8A8F98]">{t(c.labelEn, c.labelAr)}</p>
            <p className="mt-1 truncate text-xl font-bold" style={{ color: c.color }}>{c.value}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {(["All", "Active", "Inactive"] as const).map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={["rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
                statusFilter === s ? "bg-[#107789] text-white" : "border border-[#F0F2F5] bg-white text-[#6B7280] hover:bg-[#EBF5F7] hover:text-[#107789]",
              ].join(" ")}>
              {s === "All" ? t("All","الكل") : s === "Active" ? t("Active","نشط") : t("Inactive","غير نشط")}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1 rounded-lg border border-[#F0F2F5] bg-white p-1">
          {(["cards","table"] as const).map((v) => (
            <button key={v} onClick={() => setView(v)}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${view === v ? "bg-[#107789] text-white" : "text-[#6B7280] hover:text-[#107789]"}`}>
              {v === "cards" ? t("Cards","بطاقات") : t("Table","جدول")}
            </button>
          ))}
        </div>
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="bg-white rounded-xl border border-[#F0F2F5] p-12 text-center shadow-sm">
          <p className="text-sm text-[#8A8F98] mb-3">{t("No packages found.","لا توجد باقات.")}</p>
          <button onClick={() => setAddOpen(true)} className="text-sm font-semibold text-[#107789] hover:underline">
            + {t("Create one","أنشئ باقة")}
          </button>
        </div>
      )}

      {/* ── Cards View ── */}
      {view === "cards" && filtered.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {filtered.map((pkg) => (
            <div key={pkg.id} className={[
              "flex flex-col overflow-hidden rounded-xl border bg-white shadow-sm transition-all",
              pkg.popular ? "border-[#107789]/40 ring-1 ring-[#107789]/20" : "border-[#F0F2F5]",
              pkg.status === "Inactive" ? "opacity-60" : "",
            ].join(" ")}>
              {pkg.popular && (
                <div className="bg-[#107789] py-1.5 text-center text-[10px] font-bold uppercase tracking-wide text-white">
                  {t("Most Popular","الأكثر شيوعًا")}
                </div>
              )}
              <div className="flex flex-1 flex-col gap-4 p-5">
                {/* Name + Status */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-bold text-[#0B2C33]">{t(pkg.nameEn, pkg.nameAr)}</p>
                    <p className="mt-0.5 text-xs text-[#8A8F98]">{t(pkg.descriptionEn, pkg.descriptionAr)}</p>
                  </div>
                  <span className="flex-shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold"
                    style={{ backgroundColor: statusConfig[pkg.status].bg, color: statusConfig[pkg.status].text }}>
                    {lang === "ar" ? statusConfig[pkg.status].labelAr : pkg.status}
                  </span>
                </div>
                {/* Price */}
                <div className="flex items-end gap-1">
                  <span className="text-3xl font-bold text-[#0B2C33]">{pkg.currency}{pkg.price}</span>
                  <span className="mb-1 text-xs text-[#8A8F98]">/ {pkg.lessons} {t("lessons","درس")}</span>
                </div>
                {/* Meta */}
                <div className="flex items-center gap-3 text-xs text-[#8A8F98]">
                  <span className="flex items-center gap-1">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                    </svg>
                    {pkg.durationDays} {t("days","يومًا")}
                  </span>
                  <span>·</span>
                  <span>{pkg.features.length} {t("features","ميزات")}</span>
                </div>
                {/* Features */}
                <ul className="flex-1 space-y-1.5">
                  {pkg.features.map((f) => (
                    <li key={f.id} className="flex items-center gap-2 text-xs text-[#4B5563]">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#107789" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      {t(f.en, f.ar)}
                    </li>
                  ))}
                </ul>
                {/* Actions */}
                <div className="flex items-center gap-2 border-t border-[#F0F2F5] pt-2">
                  <button onClick={() => setEditPkg(pkg)}
                    className="flex-1 rounded-lg border border-[#107789]/30 py-2 text-xs font-semibold text-[#107789] transition-colors hover:bg-[#EBF5F7]">
                    {t("Edit","تعديل")}
                  </button>
                  <button onClick={() => toggleStatus(pkg.id)}
                    className={["flex-1 rounded-lg py-2 text-xs font-semibold transition-colors border",
                      pkg.status === "Active"
                        ? "border-[#d97706]/30 text-[#d97706] hover:bg-[#fef3c7]"
                        : "border-[#15803d]/30 text-[#15803d] hover:bg-[#dcfce7]",
                    ].join(" ")}>
                    {pkg.status === "Active" ? t("Deactivate","تعطيل") : t("Activate","تفعيل")}
                  </button>
                  <button onClick={() => setDeletePkg(pkg)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#fca5a5]/40 text-[#dc2626] hover:bg-[#fee2e2] transition-colors flex-shrink-0">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/>
                      <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Quick Add card */}
          <button onClick={() => setAddOpen(true)}
            className="flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#D1D5DB] text-[#9CA3AF] hover:border-[#107789] hover:text-[#107789] hover:bg-[#EBF5F7] transition-colors min-h-[200px]">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            <span className="text-sm font-semibold">{t("New Package","باقة جديدة")}</span>
          </button>
        </div>
      )}

      {/* ── Table View ── */}
      {view === "table" && filtered.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-[#F0F2F5] bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#F0F2F5] bg-[#FAFBFC]">
                  {[{en:"Package",ar:"الباقة"},{en:"Lessons",ar:"الدروس"},{en:"Price",ar:"السعر"},{en:"Duration",ar:"المدة"},{en:"Features",ar:"المميزات"},{en:"Status",ar:"الحالة"},{en:"Actions",ar:"الإجراءات"}].map((col) => (
                    <th key={col.en} className="whitespace-nowrap px-5 py-3 text-start text-xs font-semibold uppercase tracking-wide text-[#8A8F98]">
                      {t(col.en, col.ar)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F2F5]">
                {filtered.map((pkg) => (
                  <tr key={pkg.id} className="transition-colors hover:bg-[#F5F7F9]">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-[#0B2C33]">{t(pkg.nameEn, pkg.nameAr)}</p>
                        {pkg.popular && (
                          <span className="rounded bg-[#EBF5F7] px-1.5 py-0.5 text-[10px] font-bold text-[#107789]">
                            {t("Popular","شائع")}
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 text-xs text-[#8A8F98]">{pkg.id}</p>
                    </td>
                    <td className="px-5 py-3.5 text-[#4B5563]">{pkg.lessons} {t("lessons","درس")}</td>
                    <td className="px-5 py-3.5 font-bold text-[#0B2C33]">{pkg.currency}{pkg.price}</td>
                    <td className="px-5 py-3.5 text-[#8A8F98]">{pkg.durationDays} {t("days","يومًا")}</td>
                    <td className="px-5 py-3.5 text-[#8A8F98]">{pkg.features.length}</td>
                    <td className="px-5 py-3.5">
                      <span className="rounded-full px-2.5 py-1 text-xs font-semibold"
                        style={{ backgroundColor: statusConfig[pkg.status].bg, color: statusConfig[pkg.status].text }}>
                        {lang === "ar" ? statusConfig[pkg.status].labelAr : pkg.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <button onClick={() => setEditPkg(pkg)} className="text-xs font-medium text-[#107789] hover:underline">{t("Edit","تعديل")}</button>
                        <span className="text-[#E5E7EB]">|</span>
                        <button onClick={() => toggleStatus(pkg.id)}
                          className={`text-xs font-medium hover:underline ${pkg.status === "Active" ? "text-[#d97706]" : "text-[#15803d]"}`}>
                          {pkg.status === "Active" ? t("Deactivate","تعطيل") : t("Activate","تفعيل")}
                        </button>
                        <span className="text-[#E5E7EB]">|</span>
                        <button onClick={() => setDeletePkg(pkg)} className="text-xs font-medium text-[#dc2626] hover:underline">{t("Delete","حذف")}</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Modals ── */}
      {addOpen  && <PackageModal onClose={() => setAddOpen(false)} onSave={handleAdd} />}
      {editPkg  && <PackageModal pkg={editPkg} onClose={() => setEditPkg(null)} onSave={handleEdit} />}
      {deletePkg && (
        <DeleteModal
          title={t("Delete Package","حذف الباقة")}
          description={t(
            `Are you sure you want to delete "${deletePkg.nameEn}"? This cannot be undone.`,
            `هل أنت متأكد من حذف "${deletePkg.nameAr}"؟ لا يمكن التراجع عن هذا الإجراء.`
          )}
          onClose={() => setDeletePkg(null)}
          onConfirm={handleDelete}
        />
      )}
    </main>
  );
}