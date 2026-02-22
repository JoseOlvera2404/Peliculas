"use client";

import { useEffect, useState } from "react";

export default function ClientesAdmin() {
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/usuarios/clientes`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      setClientes(data);
    }

    fetchData();
  }, []);

  return (
    <div>
      <h1 className="text-2xl mb-4">Listado de Clientes</h1>

      <div>
        {clientes.map((c: any) => (
          <div key={c.id} className="bg-white p-4 mb-4 shadow rounded">
            <p>{c.nombre} {c.apellido_paterno}</p>
            <p className="text-sm text-gray-600">{c.correo}</p>
          </div>
        ))}
      </div>
    </div>
  );
}