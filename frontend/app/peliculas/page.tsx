"use client";

import { useEffect, useState } from "react";
import { getPeliculasActivas } from "@/lib/api";

export default function PeliculasPage() {
  const [peliculas, setPeliculas] = useState([]);

  useEffect(() => {
    async function cargar() {
      const data = await getPeliculasActivas();
      setPeliculas(data);
    }

    cargar();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl mb-6">Películas Disponibles</h1>

      <div className="grid grid-cols-3 gap-6">
        {peliculas.map((p: any) => (
          <div key={p.id} className="border p-4 rounded shadow">
            <h2 className="text-xl font-bold">{p.nombre}</h2>
            <p>{p.descripcion}</p>
            <a
              href={p.trailer_link}
              target="_blank"
              className="text-blue-600 block mt-2"
            >
              Ver trailer
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}