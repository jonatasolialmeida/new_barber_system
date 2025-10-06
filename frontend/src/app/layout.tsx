import type { Metadata } from "next";
import ThemeRegistry from '@/components/ThemeRegistry';

export const metadata: Metadata = {
  title: "Barbearia - Sistema de Agendamento",
  description: "Sistema de agendamento para barbearia",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  );
}
