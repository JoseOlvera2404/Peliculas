"use client";

import { useEffect, useState } from "react";

export default function PeliculasAdmin() {
  const [peliculas, setPeliculas] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/peliculas`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      setPeliculas(data);
    }

    fetchData();
  }, []);

  return (
    <div>
      <h1 className="text-2xl mb-4">Listado de Películas</h1>

      <a
        href="/admin/peliculas/crear"
        className="bg-black text-white px-4 py-2 rounded"
      >
        Crear Nueva Película
      </a>

      <div className="mt-6">
        {peliculas.map((p: any) => (
          <div key={p.id} className="bg-white p-4 mb-4 shadow rounded">
            <h2 className="font-bold">{p.nombre}</h2>
            <p>{p.genero}</p>
          </div>
        ))}
      </div>
    </div>
  );
}