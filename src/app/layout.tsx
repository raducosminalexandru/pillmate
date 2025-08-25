import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ThemeRegistry from '@/components/ThemeRegistry';
import AppShell from '@/components/AppShell';
import AuthProvider from '@/providers/AuthProvider'; // dacă nu-l folosiți, îl poți scoate

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PillMate",
  description: "Medication management and pill scanning application",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <ThemeRegistry>
            <AppShell>{children}</AppShell>
          </ThemeRegistry>
        </AuthProvider>
      </body>
    </html>
  );
}
