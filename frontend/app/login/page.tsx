"use client";

import { useState } from "react";
import { loginRequest } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = await loginRequest(correo, password);

    if (data.token) {
      localStorage.setItem("token", data.token);

      if (data.usuario.rol === 1) {
        router.push("/admin");
      } else {
        router.push("/peliculas");
      }
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow w-80">
        <h1 className="text-2xl mb-4 text-center">Login</h1>

        <input
          type="email"
          placeholder="Correo"
          className="w-full mb-3 p-2 border rounded"
          onChange={(e) => setCorreo(e.target.value)}
        />

        <input
          type="password"
          placeholder="Contraseña"
          className="w-full mb-3 p-2 border rounded"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="w-full bg-black text-white p-2 rounded">
          Iniciar sesión
        </button>
      </form>
    </div>
  );
}