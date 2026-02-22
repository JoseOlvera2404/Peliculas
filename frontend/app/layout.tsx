import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Películas App",
  description: "Sistema Administrativo",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="antialiased bg-gray-100">
        {children}
      </body>
    </html>
  );
}