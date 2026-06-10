import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    template: "%s | MediConnect",
    default: "MediConnect — Plataforma de Telemedicina",
  },
  description:
    "Reserva citas médicas, videoconsultas y recetas digitales con los mejores especialistas.",
};

export default function RootLayout( {
  children,
}: {
  children: React.ReactNode;
} ) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}