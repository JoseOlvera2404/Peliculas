"use client";

import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function PeliculasAdmin() {
  const [peliculas, setPeliculas] = useState([]);
  const [generos, setGeneros] = useState([]);
  const [editandoId, setEditandoId] = useState<number | null>(null);

  const [form, setForm] = useState({
    nombre: "",
    genero_id: "",
    descripcion: "",
    trailer_link: "",
    imagen: "" as string | null
  });

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : "";

  // ================================
  // CONVERTIR IMAGEN A BASE64
  // ================================
  const convertirBase64 = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });

  // ================================
  // CARGAR PELÍCULAS
  // ================================
  const cargarPeliculas = async () => {
    const res = await fetch(`${API}/api/peliculas`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setPeliculas(data);
  };

  // ================================
  // CARGAR GÉNEROS
  // ================================
  const cargarGeneros = async () => {
    try {
      const res = await fetch(`${API}/api/generos`);

      if (!res.ok) {
        console.error("Error generos:", res.status);
        return;
      }

      const data = await res.json();
      setGeneros(data);

    } catch (error) {
      console.error("Error cargando generos:", error);
    }
  };
  
  useEffect(() => {
    cargarPeliculas();
    cargarGeneros();
  }, []);

  const limpiarForm = () => {
    setForm({
      nombre: "",
      genero_id: "",
      descripcion: "",
      trailer_link: "",
      imagen: null
    });
    setEditandoId(null);
  };

  // ================================
  // GUARDAR (CREAR / EDITAR)
  // ================================
  const guardar = async (e: any) => {
    e.preventDefault();

    const url = editandoId
      ? `${API}/api/peliculas/${editandoId}`
      : `${API}/api/peliculas`;

    const method = editandoId ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(form)
    });

    limpiarForm();
    cargarPeliculas();
  };

  const editar = (p: any) => {
    setForm({
      nombre: p.nombre,
      genero_id: p.genero_id,
      descripcion: p.descripcion || "",
      trailer_link: p.trailer_link || "",
      imagen: null // no cargamos base64 existente para no sobreescribir
    });
    setEditandoId(p.id);
  };

  const cambiarEstado = async (p: any) => {
    await fetch(`${API}/api/peliculas/${p.id}/estado`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ activa: !p.activa })
    });

    cargarPeliculas();
  };

  const eliminar = async (id: number) => {
    await fetch(`${API}/api/peliculas/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });

    cargarPeliculas();
  };

  return (
    <div>

      <h1 className="text-2xl font-bold mb-6">
        Gestión de Películas
      </h1>

      {/* ================= FORMULARIO ================= */}
      <form
        onSubmit={guardar}
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

        <select
          value={form.genero_id}
          onChange={(e) =>
            setForm({ ...form, genero_id: e.target.value })
          }
          className="p-3 rounded border"
          required
        >
          <option value="">Seleccionar género</option>
          {generos.map((g: any) => (
            <option key={g.id} value={g.id}>
              {g.nombre}
            </option>
          ))}
        </select>

        <textarea
          placeholder="Descripción"
          value={form.descripcion}
          onChange={(e) =>
            setForm({ ...form, descripcion: e.target.value })
          }
          className="p-3 rounded border col-span-2"
          required
        />

        <input
          placeholder="Link del trailer"
          value={form.trailer_link}
          onChange={(e) =>
            setForm({ ...form, trailer_link: e.target.value })
          }
          className="p-3 rounded border col-span-2"
        />

        <input
          type="file"
          accept="image/*"
          className="col-span-2"
          onChange={async (e: any) => {
            const file = e.target.files[0];
            if (file) {
              const base64 = await convertirBase64(file);
              setForm({ ...form, imagen: base64 });
            }
          }}
        />

        <button className="col-span-2 bg-gray-900 text-white p-3 rounded-lg hover:bg-gray-800 transition">
          {editandoId ? "Actualizar Película" : "Crear Película"}
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

      {/* ================= TABLA ================= */}
      <div className="overflow-x-auto">
        <table className="w-full bg-white shadow rounded-xl overflow-hidden">
          <thead className="bg-gray-900 text-white">
            <tr>
              <th className="p-3 text-left">Imagen</th>
              <th className="p-3 text-left">Nombre</th>
              <th className="p-3 text-left">Género</th>
              <th className="p-3 text-left">Estado</th>
              <th className="p-3 text-center">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {peliculas.map((p: any) => (
              <tr key={p.id} className="border-b">
                <td className="p-3">
                  {p.imagen && (
                    <img
                      src={p.imagen}
                      className="w-16 h-20 object-cover rounded"
                    />
                  )}
                </td>

                <td className="p-3">{p.nombre}</td>
                <td className="p-3">{p.genero}</td>

                <td className="p-3">
                  {p.activa ? (
                    <span className="text-green-600 font-semibold">
                      Activa
                    </span>
                  ) : (
                    <span className="text-red-600 font-semibold">
                      Inactiva
                    </span>
                  )}
                </td>

                <td className="p-3 text-center flex gap-2 justify-center">
                  <button
                    onClick={() => editar(p)}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                  >
                    Editar
                  </button>

                  <button
                    onClick={() => cambiarEstado(p)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Activar/Desactivar
                  </button>

                  <button
                    onClick={() => eliminar(p.id)}
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