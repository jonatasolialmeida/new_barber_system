import type { Metadata, Viewport } from "next";
import ThemeRegistry from '@/components/ThemeRegistry';
import ServiceWorkerRegister from '@/components/pwa/ServiceWorkerRegister';
import PWAInstallPrompt from '@/components/pwa/PWAInstallPrompt';
import { OnlineStatusBanner } from '@/components/pwa/ServiceWorkerRegister';
import SkipLinks from '@/components/accessibility/SkipLinks';

export const metadata: Metadata = {
  title: "Barbearia - Sistema de Agendamento",
  description: "Sistema de agendamento para barbearia",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Barber System",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#1976D2",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <SkipLinks />
        <ThemeRegistry>
          <ServiceWorkerRegister />
          <PWAInstallPrompt />
          <OnlineStatusBanner />
          {children}
        </ThemeRegistry>
      </body>
    </html>
  );
}
