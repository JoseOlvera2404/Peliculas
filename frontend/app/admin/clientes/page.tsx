"use client";

import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function ClientesAdmin() {
  const [clientes, setClientes] = useState([]);
  const [form, setForm] = useState({
    nombre: "",
    apellido_paterno: "",
    apellido_materno: "",
    correo: ""
  });

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : "";

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  };

  const cargarClientes = async () => {
    const res = await fetch(`${API}/api/usuarios/clientes`, { headers });
    const data = await res.json();
    setClientes(data);
  };

  useEffect(() => {
    cargarClientes();
  }, []);

  const crearCliente = async (e: any) => {
    e.preventDefault();

    await fetch(`${API}/api/auth/registro`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        ...form,
        rol_id: 2 // FORZAMOS CLIENTE
      })
    });

    setForm({
      nombre: "",
      apellido_paterno: "",
      apellido_materno: "",
      correo: ""
    });

    cargarClientes();
  };

  const cambiarEstado = async (id: number) => {
    await fetch(`${API}/api/usuarios/${id}/estado`, {
      method: "PATCH",
      headers
    });

    cargarClientes();
  };

  const eliminar = async (id: number) => {
    await fetch(`${API}/api/usuarios/${id}`, {
      method: "DELETE",
      headers
    });

    cargarClientes();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Gestión de Clientes</h1>

      {/* FORMULARIO */}
      <form
        onSubmit={crearCliente}
        className="bg-gray-100 p-6 rounded-xl shadow mb-10 grid grid-cols-2 gap-4"
      >
        <input
          placeholder="Nombre"
          value={form.nombre}
          onChange={(e) =>
            setForm({ ...form, nombre: e.target.value })
          }
          className="p-3 rounded border"
          required
        />

        <input
          placeholder="Apellido Paterno"
          value={form.apellido_paterno}
          onChange={(e) =>
            setForm({ ...form, apellido_paterno: e.target.value })
          }
          className="p-3 rounded border"
          required
        />

        <input
          placeholder="Apellido Materno"
          value={form.apellido_materno}
          onChange={(e) =>
            setForm({ ...form, apellido_materno: e.target.value })
          }
          className="p-3 rounded border"
        />

        <input
          type="email"
          placeholder="Correo"
          value={form.correo}
          onChange={(e) =>
            setForm({ ...form, correo: e.target.value })
          }
          className="p-3 rounded border col-span-2"
          required
        />

        <button className="col-span-2 bg-gray-900 text-white p-3 rounded-lg hover:bg-gray-800 transition">
          Crear Cliente
        </button>
      </form>

      {/* TABLA */}
      <div className="overflow-x-auto">
        <table className="w-full bg-white shadow rounded-xl overflow-hidden">
          <thead className="bg-gray-900 text-white">
            <tr>
              <th className="p-3 text-left">Nombre</th>
              <th className="p-3 text-left">Correo</th>
              <th className="p-3 text-left">Estado</th>
              <th className="p-3 text-center">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {clientes.map((c: any) => (
              <tr key={c.id} className="border-b">
                <td className="p-3">
                  {c.nombre} {c.apellido_paterno}
                </td>

                <td className="p-3">{c.correo}</td>

                <td className="p-3">
                  {c.activo ? (
                    <span className="text-green-600 font-semibold">
                      Activo
                    </span>
                  ) : (
                    <span className="text-red-600 font-semibold">
                      Inactivo
                    </span>
                  )}
                </td>

                <td className="p-3 text-center flex gap-2 justify-center">
                  <button
                    onClick={() => cambiarEstado(c.id)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Activar/Desactivar
                  </button>

                  <button
                    onClick={() => eliminar(c.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}