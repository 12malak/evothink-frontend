import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/src/contexts/LanguageContext";
import { AuthProvider } from "@/src/contexts/AuthContext";

export const metadata: Metadata = {
  title: "Evothink",
  description: "Online English learning platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        <LanguageProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}