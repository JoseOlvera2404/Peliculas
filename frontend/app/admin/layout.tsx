"use client";

import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      
      {/* Sidebar */}
      <aside className="w-64 bg-black text-white p-6">
        <h2 className="text-xl mb-6 font-bold">Panel Admin</h2>

        <nav className="flex flex-col gap-4">
          <Link href="/admin/peliculas" className="hover:text-gray-300">
            Gestión de Películas
          </Link>

          <Link href="/admin/clientes" className="hover:text-gray-300">
            Gestión de Clientes
          </Link>

          <Link href="/admin" className="hover:text-gray-300">
            Dashboard
          </Link>
        </nav>
      </aside>

      {/* Contenido */}
      <main className="flex-1 p-8 bg-gray-100">
        {children}
      </main>
    </div>
  );
}