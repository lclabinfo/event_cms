"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";

export default function TestLoginPage() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("auth");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(t("signin.errors.invalidCredentials"));
      } else {
        router.push(`/${locale}/dashboard`);
        router.refresh();
      }
    } catch (error) {
      setError(t("signin.errors.genericError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "50px auto" }}>
      <h1>{t("signin.title")}</h1>

      <div style={{ marginBottom: "20px", padding: "10px", backgroundColor: "#f0f0f0" }}>
        <p><strong>{t("testAccount.title")}:</strong></p>
        <p>{t("testAccount.admin")}: admin@ubf.org / Admin123!</p>
        <p>{t("testAccount.staff")}: staff@ubf.org / Staff123!</p>
        <p>{t("testAccount.user")}: user@example.com / User123!</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "10px" }}>
          <label>
            {t("signin.emailLabel")}:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: "100%", padding: "5px", marginTop: "5px" }}
              required
            />
          </label>
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>
            {t("signin.passwordLabel")}:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: "100%", padding: "5px", marginTop: "5px" }}
              required
            />
          </label>
        </div>

        {error && (
          <div style={{ color: "red", marginBottom: "10px" }}>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "10px 20px",
            backgroundColor: loading ? "#ccc" : "#007bff",
            color: "white",
            border: "none",
            cursor: loading ? "not-allowed" : "pointer",
            width: "100%",
          }}
        >
          {loading ? t("signin.submitting") : t("signin.submitButton")}
        </button>
      </form>
    </div>
  );
}