"use client";

import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL + "/api";

export default function UsuariosPage() {

  const [usuarios, setUsuarios] = useState([]);
  const [editandoId, setEditandoId] = useState<number | null>(null);

  const [form, setForm] = useState({
    nombre: "",
    apellido_paterno: "",
    apellido_materno: "",
    correo: "",
    rol_id: 2
  });

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : "";

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  };

  const cargarUsuarios = async () => {
    const res = await fetch(`${API}/usuarios`, { headers });
    const data = await res.json();
    setUsuarios(data);
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const limpiarForm = () => {
    setForm({
      nombre: "",
      apellido_paterno: "",
      apellido_materno: "",
      correo: "",
      rol_id: 2
    });
    setEditandoId(null);
  };

  const guardar = async (e: any) => {
    e.preventDefault();

    if (editandoId) {
      await fetch(`${API}/usuarios/${editandoId}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(form)
      });
    } else {
      await fetch(`${API}/auth/registro`, {
        method: "POST",
        headers,
        body: JSON.stringify(form)
      });
    }

    limpiarForm();
    cargarUsuarios();
  };

  const editar = (usuario: any) => {
    setForm({
      nombre: usuario.nombre,
      apellido_paterno: usuario.apellido_paterno,
      apellido_materno: usuario.apellido_materno || "",
      correo: usuario.correo,
      rol_id: usuario.rol_id
    });
    setEditandoId(usuario.id);
  };

  const cambiarEstado = async (id: number) => {
    await fetch(`${API}/usuarios/${id}/estado`, {
      method: "PATCH",
      headers
    });
    cargarUsuarios();
  };

  const eliminar = async (id: number) => {
    await fetch(`${API}/usuarios/${id}`, {
      method: "DELETE",
      headers
    });
    cargarUsuarios();
  };

  return (
    <div>

      <h1 className="text-2xl font-bold mb-6">Gestión de Usuarios</h1>

      <form
        onSubmit={guardar}
        className="bg-gray-100 p-6 rounded-xl shadow mb-10 grid grid-cols-2 gap-4"
      >
        <input
          placeholder="Nombre"
          value={form.nombre}
          onChange={(e) => setForm({ ...form, nombre: e.target.value })}
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
          onChange={(e) => setForm({ ...form, correo: e.target.value })}
          className="p-3 rounded border"
          required
        />

        <select
          value={form.rol_id}
          onChange={(e) =>
            setForm({ ...form, rol_id: Number(e.target.value) })
          }
          className="p-3 rounded border col-span-2"
        >
          <option value={1}>Administrador</option>
          <option value={2}>Cliente</option>
        </select>

        <button className="col-span-2 bg-gray-900 text-white p-3 rounded-lg hover:bg-gray-800 transition">
          {editandoId ? "Actualizar Usuario" : "Crear Usuario"}
        </button>

        {editandoId && (
          <button
            type="button"
            onClick={limpiarForm}
            className="col-span-2 bg-gray-500 text-white p-3 rounded-lg"
          >
            Cancelar edición
          </button>
        )}
      </form>

      <div className="overflow-x-auto">
        <table className="w-full bg-white shadow rounded-xl overflow-hidden">
          <thead className="bg-gray-900 text-white">
            <tr>
              <th className="p-3 text-left">Nombre</th>
              <th className="p-3 text-left">Correo</th>
              <th className="p-3 text-left">Rol</th>
              <th className="p-3 text-left">Estado</th>
              <th className="p-3 text-center">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {usuarios.map((u: any) => (
              <tr key={u.id} className="border-b">
                <td className="p-3">
                  {u.nombre} {u.apellido_paterno}
                </td>
                <td className="p-3">{u.correo}</td>
                <td className="p-3">{u.rol}</td>
                <td className="p-3">
                  {u.activo ? (
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
                    onClick={() => editar(u)}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                  >
                    Editar
                  </button>

                  <button
                    onClick={() => cambiarEstado(u.id)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Activar/Desactivar
                  </button>

                  <button
                    onClick={() => eliminar(u.id)}
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