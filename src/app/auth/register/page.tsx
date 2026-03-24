"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/src/contexts/LanguageContext";

const LOGO_IMAGE = "/images/logo.png";
const BEAR_IMAGE = "/images/login-bear.png";

type RegisterForm = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type RegisterErrors = {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
};

export default function RegisterPage() {
  const { lang, setLang, t, isRTL } = useLanguage();

  const [form, setForm] = useState<RegisterForm>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<RegisterErrors>({});
  const [loading, setLoading] = useState(false);

  const setField =
    (field: keyof RegisterForm) =>
    (value: string) =>
      setForm((prev) => ({ ...prev, [field]: value }));

  const validate = () => {
    const e: RegisterErrors = {};

    if (!form.name.trim()) {
      e.name = t("Name is required", "الاسم مطلوب");
    }

    if (!form.email.trim()) {
      e.email = t("Email is required", "البريد مطلوب");
    }

    if (form.password.length < 6) {
      e.password = t("Password too short", "كلمة المرور قصيرة");
    }

    if (form.password !== form.confirmPassword) {
      e.confirmPassword = t("Passwords do not match", "كلمتا المرور غير متطابقتين");
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    await new Promise((r) => setTimeout(r, 1200));

    setLoading(false);
    console.log("REGISTER:", form);
  };

  return (
    <main
      dir={isRTL ? "rtl" : "ltr"}
      className="min-h-screen bg-[#F8FAFC]"
    >
      <div className="grid min-h-screen lg:grid-cols-2">

        {/* FORM SIDE */}
        <section className="flex items-center justify-center p-8">
          <div className="w-full max-w-[420px]">

            {/* Logo */}
            <img src={LOGO_IMAGE} className="mb-8 w-[160px]" />

            {/* Heading */}
            <h1 className="text-2xl font-bold text-[#0B2C33]">
              {t("Create Account", "إنشاء حساب")}
            </h1>

            <p className="text-sm text-[#8A8F98] mb-6">
              {t(
                "Join Evothink and start your journey.",
                "انضم إلى Evothink وابدأ رحلتك."
              )}
            </p>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">

              <input
                placeholder={t("Full Name", "الاسم الكامل")}
                className="input"
                onChange={(e) => setField("name")(e.target.value)}
              />

              <input
                placeholder={t("Email", "البريد")}
                className="input"
                onChange={(e) => setField("email")(e.target.value)}
              />

              <input
                type="password"
                placeholder={t("Password", "كلمة المرور")}
                className="input"
                onChange={(e) => setField("password")(e.target.value)}
              />

              <input
                type="password"
                placeholder={t("Confirm Password", "تأكيد كلمة المرور")}
                className="input"
                onChange={(e) => setField("confirmPassword")(e.target.value)}
              />

              <button
                disabled={loading}
                className="btn-primary"
              >
                {loading
                  ? t("Creating...", "جارٍ الإنشاء...")
                  : t("Create Account", "إنشاء حساب")}
              </button>
            </form>

            {/* Footer */}
            <p className="text-sm mt-4 text-[#8A8F98]">
              {t("Already have an account?", "لديك حساب بالفعل؟")}{" "}
              <Link href="/auth/login" className="text-[#107789] font-semibold">
                {t("Sign in", "تسجيل الدخول")}
              </Link>
            </p>

          </div>
        </section>

        {/* VISUAL SIDE */}
        <section className="hidden lg:flex items-center justify-center bg-gradient-to-br from-[#107789] to-[#0B2C33]">
          <img src={BEAR_IMAGE} className="w-[300px]" />
        </section>

      </div>
    </main>
  );
}