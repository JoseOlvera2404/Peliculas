"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CrearPelicula() {
  const router = useRouter();

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [genero_id, setGeneroId] = useState("1");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/peliculas`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        nombre,
        descripcion,
        genero_id,
      }),
    });

    router.push("/admin/peliculas");
  };

  return (
    <div>
      <h1 className="text-2xl mb-4">Registrar Película</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
        <input
          placeholder="Nombre"
          className="p-2 border rounded"
          onChange={(e) => setNombre(e.target.value)}
        />

        <textarea
          placeholder="Descripción"
          className="p-2 border rounded"
          onChange={(e) => setDescripcion(e.target.value)}
        />

        <input
          placeholder="Genero ID"
          className="p-2 border rounded"
          onChange={(e) => setGeneroId(e.target.value)}
        />

        <button className="bg-black text-white p-2 rounded">
          Guardar
        </button>
      </form>
    </div>
  );
}