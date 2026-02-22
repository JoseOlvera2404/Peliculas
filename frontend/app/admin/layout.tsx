"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/");
    } else {
      setLoading(false);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  const linkClass = (path: string) =>
    `p-3 rounded-lg transition cursor-pointer ${
      pathname === path
        ? "bg-white text-gray-900 font-semibold"
        : "hover:bg-white/10"
    }`;

  if (loading) return null;

  return (
    <div className="flex min-h-screen">

      {/* SIDEBAR */}
      <aside className="w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white p-6 flex flex-col shadow-xl">
        <h2 className="text-2xl font-bold mb-10">🎬 Películas</h2>

        <nav className="flex flex-col gap-3">
          <div onClick={() => router.push("/admin")} className={linkClass("/admin")}>
            Dashboard
          </div>

          <div onClick={() => router.push("/admin/peliculas")} className={linkClass("/admin/peliculas")}>
            Películas
          </div>

          <div onClick={() => router.push("/admin/clientes")} className={linkClass("/admin/clientes")}>
            Clientes
          </div>

          <div onClick={() => router.push("/admin/usuarios")} className={linkClass("/admin/usuarios")}>
            Usuarios
          </div>
        </nav>

        <div className="mt-auto">
          <button
            onClick={logout}
            className="w-full bg-red-600 hover:bg-red-700 p-3 rounded-lg transition font-semibold"
          >
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* CONTENIDO */}
      <main className="flex-1 bg-gray-100 p-10">
        <div className="bg-white rounded-2xl shadow-md p-8 min-h-[80vh]">
          {children}
        </div>
      </main>
    </div>
  );
}