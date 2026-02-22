export default function AdminHome() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">
        Bienvenido Administrador
      </h1>

      <p className="text-gray-600 mb-8">
        Desde aquí puedes gestionar películas, clientes y usuarios.
      </p>

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-gray-100 p-6 rounded-xl shadow-sm">
          <h3 className="font-semibold text-lg">Películas</h3>
          <p className="text-gray-500 text-sm mt-2">
            Crear, editar y activar películas.
          </p>
        </div>

        <div className="bg-gray-100 p-6 rounded-xl shadow-sm">
          <h3 className="font-semibold text-lg">Clientes</h3>
          <p className="text-gray-500 text-sm mt-2">
            Gestión de clientes registrados.
          </p>
        </div>

        <div className="bg-gray-100 p-6 rounded-xl shadow-sm">
          <h3 className="font-semibold text-lg">Usuarios</h3>
          <p className="text-gray-500 text-sm mt-2">
            Administración de accesos.
          </p>
        </div>
      </div>
    </div>
  );
}