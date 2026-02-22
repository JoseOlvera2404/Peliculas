"use client";

import { useState } from "react";
import { loginRequest } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");

  const [errorMensaje, setErrorMensaje] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    const data = await loginRequest(correo, password);

    setLoading(false);

    if (data.token) {
      localStorage.setItem("token", data.token);
      router.push("/admin");
    } else {
      setErrorMensaje(data.message || "Error al iniciar sesión");
      setMostrarModal(true);
    }
  };

  return (
    <>
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <form
          onSubmit={handleLogin}
          className="bg-white p-8 rounded-xl shadow-lg w-96"
        >
          <h1 className="text-2xl font-bold mb-6 text-center">
            🎬 Login Administrador
          </h1>

          <input
            type="email"
            placeholder="Correo"
            className="w-full mb-4 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            onChange={(e) => setCorreo(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Contraseña"
            className="w-full mb-6 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            disabled={loading}
            className="w-full bg-black text-white p-3 rounded-lg hover:bg-gray-800 transition disabled:opacity-50"
          >
            {loading ? "Ingresando..." : "Iniciar sesión"}
          </button>
        </form>
      </div>

      {/* ================= MODAL ERROR ================= */}
      {mostrarModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-xl shadow-xl w-80 p-6 animate-fade-in">
            <h2 className="text-lg font-semibold mb-4 text-red-600">
              Error de autenticación
            </h2>

            <p className="text-gray-700 mb-6">
              {errorMensaje}
            </p>

            <button
              onClick={() => setMostrarModal(false)}
              className="w-full bg-black text-white p-2 rounded-lg hover:bg-gray-800 transition"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </>
  );
}