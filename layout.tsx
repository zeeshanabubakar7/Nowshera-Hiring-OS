import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nowshera Hire OS",
  description: "Applicant tracking for Nowshera Digital — jobs, CVs, interviews and hiring decisions in one workspace.",
  other: { "codex-preview": "development" },
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
