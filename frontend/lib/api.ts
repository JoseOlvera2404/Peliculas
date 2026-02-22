const API_URL = process.env.RAILWAY_PRIVATE_DOMAIN;

export async function loginRequest(correo: string, password: string) {
  const res = await fetch(`${API_URL}/api/auth/login-admin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ correo, password })
  });

  return res.json();
}

export async function getPeliculasActivas() {
  const res = await fetch(`${API_URL}/api/peliculas/activas`);
  return res.json();
}