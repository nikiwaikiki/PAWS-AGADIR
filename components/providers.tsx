"use client";

import { I18nextProvider } from "react-i18next";
import i18n from "@/lib/i18n";
import { AuthProvider } from "@/lib/auth-context";
import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <I18nextProvider i18n={i18n}>
      <AuthProvider>
        {children}
        <Toaster position="top-center" richColors />
      </AuthProvider>
    </I18nextProvider>
  );
}
