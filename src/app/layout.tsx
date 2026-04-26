import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Encuesta de Autoidentificación Étnica",
  description: "Dashboard interactivo para el análisis de identidad cultural en universidades.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
