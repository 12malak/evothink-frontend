"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/src/contexts/LanguageContext";

const LOGO_IMAGE = "/images/logo.png";
const BEAR_IMAGE = "/images/login-bear.png";

type LoginForm = {
  email: string;
  password: string;
};

type LoginErrors = {
  email?: string;
  password?: string;
  general?: string;
};

function InputField({
  id,
  label,
  type,
  value,
  placeholder,
  error,
  onChange,
  icon,
  rightElement,
  isRTL,
}: {
  id: string;
  label: string;
  type: string;
  value: string;
  placeholder: string;
  error?: string;
  onChange: (value: string) => void;
  icon?: React.ReactNode;
  rightElement?: React.ReactNode;
  isRTL: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      {label ? (
        <label
          htmlFor={id}
          className="text-xs font-medium"
          style={{
            color: "#8A8F98",
            textAlign: isRTL ? "right" : "left",
          }}
        >
          {label}
        </label>
      ) : null}

      <div style={{ position: "relative" }}>
        {icon && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              transform: "translateY(-50%)",
              [isRTL ? "right" : "left"]: "12px",
              color: "#9CA3AF",
              pointerEvents: "none",
              display: "flex",
              alignItems: "center",
            }}
          >
            {icon}
          </div>
        )}

        <input
          id={id}
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          dir={isRTL ? "rtl" : "ltr"}
          className="w-full text-sm"
          style={{
            height: "44px",
            borderRadius: "10px",
            border: `1px solid ${error ? "#FCA5A5" : "#E5E7EB"}`,
            backgroundColor: "#FFFFFF",
            color: "#0B2C33",
            outline: "none",
            boxSizing: "border-box",
            textAlign: isRTL ? "right" : "left",
            paddingInlineStart: icon ? "38px" : "14px",
            paddingInlineEnd: rightElement ? "38px" : "14px",
          }}
        />

        {rightElement && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              transform: "translateY(-50%)",
              [isRTL ? "left" : "right"]: "12px",
              display: "flex",
              alignItems: "center",
            }}
          >
            {rightElement}
          </div>
        )}
      </div>

      {error ? (
        <p
          className="text-[11px] font-medium"
          style={{
            color: "#DC2626",
            textAlign: isRTL ? "right" : "left",
          }}
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}

export default function LoginPage() {
  const { lang, setLang, t, isRTL } = useLanguage();

  const [form, setForm] = useState<LoginForm>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<LoginErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const setField =
    (field: keyof LoginForm) =>
    (value: string) =>
      setForm((prev) => ({ ...prev, [field]: value }));

  const validate = () => {
    const nextErrors: LoginErrors = {};

    if (!form.email.trim()) {
      nextErrors.email = t("Email is required.", "البريد الإلكتروني مطلوب.");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      nextErrors.email = t("Enter a valid email.", "أدخل بريدًا إلكترونيًا صحيحًا.");
    }

    if (!form.password.trim()) {
      nextErrors.password = t("Password is required.", "كلمة المرور مطلوبة.");
    } else if (form.password.trim().length < 6) {
      nextErrors.password = t(
        "Password must be at least 6 characters.",
        "يجب أن تكون كلمة المرور 6 أحرف على الأقل."
      );
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    setErrors({});

    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      console.log("Login submitted:", form);
    } catch {
      setErrors({
        general: t(
          "Unable to sign in right now. Please try again.",
          "تعذر تسجيل الدخول الآن. حاول مرة أخرى."
        ),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      dir={isRTL ? "rtl" : "ltr"}
      style={{
        minHeight: "100vh",
        backgroundColor: "#F8FAFC",
      }}
    >
      <div
        className="grid min-h-screen"
        style={{
          gridTemplateColumns: "1.05fr 1fr",
        }}
      >
        {/* Form Side */}
        <section
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "48px 32px",
            backgroundColor: "#F8FAFC",
            order: isRTL ? 2 : 1,
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "420px",
            }}
          >
            {/* Brand */}
            <div
              className="mb-10 flex items-center"
              style={{
                justifyContent: isRTL ? "flex-end" : "flex-start",
              }}
            >
              <img
                src={LOGO_IMAGE}
                alt="Evothink logo"
                style={{
                  width: "180px",
                  height: "auto",
                  display: "block",
                  objectFit: "contain",
                }}
              />
            </div>

            {/* Heading */}
            <div style={{ textAlign: isRTL ? "right" : "left" }}>
              <h1
                className="mb-1 text-2xl font-bold"
                style={{ color: "#0B2C33" }}
              >
                {t("Welcome Back", "مرحبًا بعودتك")}
              </h1>
              <p
                className="mb-8 text-sm"
                style={{
                  color: "#8A8F98",
                  unicodeBidi: "plaintext",
                }}
              >
                {t(
                  "Sign in to access your Evothink workspace.",
                  "سجّل الدخول للوصول إلى مساحة عمل Evothink."
                )}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
              {errors.general ? (
                <div
                  className="flex items-center gap-2 px-3 py-2.5 text-sm"
                  style={{
                    backgroundColor: "#FEF2F2",
                    border: "1px solid #FECACA",
                    borderRadius: "8px",
                    color: "#DC2626",
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <circle cx="7" cy="7" r="6.5" stroke="currentColor" strokeWidth="1.2" />
                    <path d="M7 4v4M7 9.5V10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                  </svg>
                  {errors.general}
                </div>
              ) : null}

              <InputField
                id="email"
                label={t("Email Address", "البريد الإلكتروني")}
                type="email"
                value={form.email}
                placeholder={t("Enter your email", "أدخل بريدك الإلكتروني")}
                error={errors.email}
                onChange={setField("email")}
                isRTL={isRTL}
                icon={
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <rect x="1" y="2.5" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
                    <path d="M1 5l6 4 6-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                  </svg>
                }
              />

              <div className="flex flex-col gap-1.5">
                <div
                  className="flex items-center justify-between"
                  style={{
                    flexDirection: isRTL ? "row-reverse" : "row",
                  }}
                >
                  <label
                    htmlFor="password"
                    className="text-xs font-medium"
                    style={{ color: "#8A8F98" }}
                  >
                    {t("Password", "كلمة المرور")}
                  </label>

                  <Link
                    href="/auth/forgot-password"
                    className="text-xs font-medium"
                    style={{ color: "#EA814F" }}
                  >
                    {t("Forgot Password?", "هل نسيت كلمة المرور؟")}
                  </Link>
                </div>

                <InputField
                  id="password"
                  label=""
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  placeholder={t("Enter your password", "أدخل كلمة المرور")}
                  error={errors.password}
                  onChange={setField("password")}
                  isRTL={isRTL}
                  icon={
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <rect x="2" y="6" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
                      <path d="M4 6V4.5a3 3 0 016 0V6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                      <circle cx="7" cy="9.5" r="1" fill="currentColor" />
                    </svg>
                  }
                  rightElement={
                    <button
                      type="button"
                      onClick={() => setShowPassword((p) => !p)}
                      style={{ color: "#8A8F98" }}
                      aria-label={
                        showPassword
                          ? t("Hide password", "إخفاء كلمة المرور")
                          : t("Show password", "إظهار كلمة المرور")
                      }
                    >
                      {showPassword ? (
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path d="M1 7s2.5-4 6-4 6 4 6 4-2.5 4-6 4-6-4-6-4z" stroke="currentColor" strokeWidth="1.2" />
                          <circle cx="7" cy="7" r="1.5" stroke="currentColor" strokeWidth="1.2" />
                          <path d="M2 2l10 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                        </svg>
                      ) : (
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path d="M1 7s2.5-4 6-4 6 4 6 4-2.5 4-6 4-6-4-6-4z" stroke="currentColor" strokeWidth="1.2" />
                          <circle cx="7" cy="7" r="1.5" stroke="currentColor" strokeWidth="1.2" />
                        </svg>
                      )}
                    </button>
                  }
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 flex items-center justify-center gap-2 text-base font-semibold text-white"
                style={{
                  height: "46px",
                  backgroundColor: loading ? "#5FA8B3" : "#107789",
                  border: "none",
                  borderRadius: "10px",
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin" width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <circle cx="7" cy="7" r="5.5" stroke="white" strokeWidth="2" strokeOpacity="0.3" />
                      <path d="M7 1.5a5.5 5.5 0 015.5 5.5" stroke="white" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    {t("Signing in...", "جارٍ تسجيل الدخول...")}
                  </>
                ) : (
                  <>
                    {t("Sign In", "تسجيل الدخول")}
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      style={{
                        transform: isRTL ? "rotate(180deg)" : "none",
                      }}
                    >
                      <path
                        d="M2 7h10M8 3l4 4-4 4"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </>
                )}
              </button>
            </form>

            {/* Footer note */}
            <div
              className="mt-8 flex items-center gap-2 text-xs uppercase tracking-[0.18em]"
              style={{
                color: "#A1A1AA",
                justifyContent: isRTL ? "flex-end" : "center",
              }}
            >
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                <path
                  d="M7 1.5l4.5 2v3.5c0 2.7-1.8 4.3-4.5 5.5-2.7-1.2-4.5-2.8-4.5-5.5V3.5L7 1.5z"
                  stroke="#107789"
                  strokeWidth="1.2"
                  fill="none"
                />
              </svg>
              {t(
                "Secured by Evothink Infrastructure",
                "محمي عبر البنية التحتية لـ Evothink"
              )}
            </div>
          </div>
        </section>

        {/* Visual Side */}
        <section
          style={{
            padding: "20px 20px 20px 0",
            backgroundColor: "#F8FAFC",
            order: isRTL ? 1 : 2,
          }}
        >
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
              minHeight: "calc(100vh - 40px)",
              borderRadius: "16px",
              overflow: "hidden",
            }}
          >
            <button
              type="button"
              onClick={() => setLang(lang === "en" ? "ar" : "en")}
              style={{
                position: "absolute",
                top: "16px",
                [isRTL ? "left" : "right"]: "16px",
                zIndex: 20,
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                height: "40px",
                padding: "0 14px",
                borderRadius: "999px",
                border: "1px solid rgba(255,255,255,0.16)",
                backgroundColor: "#FFFFFF",
                color: "#334155",
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
                boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
              }}
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
              {lang === "en" ? "عربي" : "English"}
            </button>

            <div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(135deg, #107789 0%, #0B2C33 100%)",
              }}
            />

            <svg
              className="absolute inset-0 h-full w-full opacity-10"
              viewBox="0 0 600 700"
              preserveAspectRatio="xMidYMid slice"
            >
              {Array.from({ length: 12 }).map((_, row) =>
                Array.from({ length: 10 }).map((_, col) => (
                  <circle
                    key={`${row}-${col}`}
                    cx={col * 60 + 30}
                    cy={row * 60 + 30}
                    r="2"
                    fill="white"
                  />
                ))
              )}
            </svg>

            <div
              className="absolute inset-0 flex flex-col items-center justify-center px-12"
              style={{ gap: "32px" }}
            >
              <div
                style={{
                  width: "320px",
                  height: "340px",
                  borderRadius: "16px",
                  overflow: "hidden",
                  backgroundColor: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  src={BEAR_IMAGE}
                  alt={t("Evothink mascot", "تميمة Evothink")}
                  style={{
                    width: "290px",
                    height: "310px",
                    objectFit: "contain",
                    display: "block",
                  }}
                />
              </div>

              <div className="text-center">
                <h2
                  className="mb-2 text-2xl font-bold"
                  style={{ color: "#FFFFFF" }}
                >
                  {t("Welcome to Evothink", "مرحبًا بك في Evothink")}
                </h2>
                <p
                  className="text-sm leading-relaxed"
                  style={{
                    color: "rgba(255,255,255,0.7)",
                    maxWidth: "280px",
                    unicodeBidi: "plaintext",
                  }}
                >
                  {t(
                    "Your all-in-one workspace for smarter collaboration and growth.",
                    "مساحة العمل المتكاملة للتعاون الأذكى والنمو الأسرع."
                  )}
                </p>
              </div>

              <div className="flex items-center gap-6">
                {[
                  {
                    label: t("Active Users", "المستخدمون النشطون"),
                    value: "12K+",
                  },
                  {
                    label: t("Workspaces", "مساحات العمل"),
                    value: "3.4K",
                  },
                  {
                    label: t("Uptime", "الجاهزية"),
                    value: "99.9%",
                  },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div
                      className="text-lg font-bold"
                      style={{ color: "#FFFFFF" }}
                    >
                      {stat.value}
                    </div>
                    <div
                      className="text-xs"
                      style={{ color: "rgba(255,255,255,0.6)" }}
                    >
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}