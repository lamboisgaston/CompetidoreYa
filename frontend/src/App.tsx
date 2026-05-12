type View = "home" | "register" | "login" | "panel";

type Role = "SUPER_ADMIN" | "COMPETIDOR" | string;

type Tournament = { id: string; name: string };

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";
const TOKEN_KEY = "competidoreya_token";

import { useEffect, useMemo, useState } from "react";

function decodeJwtPayload(token: string): { email?: string; role?: Role } {
  try {
    const payloadBase64 = token.split(".")[1];
    if (!payloadBase64) return {};
    const payload = JSON.parse(atob(payloadBase64));
    return payload;
  } catch {
    return {};
  }
}

export function App() {
  const [view, setView] = useState<View>("home");
  const [token, setToken] = useState<string | null>(localStorage.getItem(TOKEN_KEY));
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string>("");
  const [tournaments, setTournaments] = useState<Tournament[]>([]);

  const user = useMemo(() => (token ? decodeJwtPayload(token) : {}), [token]);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    const res = await fetch(`${API_BASE}/auth/register/competitor`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    setMessage(res.ok ? "Cuenta creada correctamente. Ahora iniciá sesión." : data.message || "Error al registrar");
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) return setMessage(data.message || "Credenciales inválidas");
    localStorage.setItem(TOKEN_KEY, data.token);
    setToken(data.token);
    setView("panel");
  }

  async function loadTournaments() {
    if (!token) return;
    const res = await fetch(`${API_BASE}/tournaments`, { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    if (res.ok) setTournaments(data);
    else setMessage(data.message || "No se pudieron cargar torneos");
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setTournaments([]);
    setView("home");
  }

  useEffect(() => {
    if (token && view === "panel") void loadTournaments();
  }, [token, view]);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-4xl p-6">
        <h1 className="text-3xl font-bold">CompetidoresYa</h1>
        <p className="mt-2 text-slate-600">Organizá, encontrá e inscribite en competencias deportivas</p>

        {!token && view === "home" && (
          <div className="mt-6 flex gap-3">
            <button className="rounded bg-blue-600 px-4 py-2 text-white" onClick={() => setView("register")}>Registrarme</button>
            <button className="rounded border border-slate-300 px-4 py-2" onClick={() => setView("login")}>Iniciar sesión</button>
          </div>
        )}

        {view === "register" && !token && (
          <form className="mt-6 max-w-md space-y-3 rounded bg-white p-4 shadow" onSubmit={handleRegister}>
            <h2 className="text-xl font-semibold">Registro de competidor</h2>
            <input className="w-full rounded border p-2" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <input className="w-full rounded border p-2" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button className="w-full rounded bg-blue-600 px-4 py-2 text-white" type="submit">Crear cuenta</button>
            <button className="w-full rounded border px-4 py-2" type="button" onClick={() => setView("home")}>Volver</button>
          </form>
        )}

        {view === "login" && !token && (
          <form className="mt-6 max-w-md space-y-3 rounded bg-white p-4 shadow" onSubmit={handleLogin}>
            <h2 className="text-xl font-semibold">Login</h2>
            <input className="w-full rounded border p-2" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <input className="w-full rounded border p-2" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button className="w-full rounded bg-blue-600 px-4 py-2 text-white" type="submit">Iniciar sesión</button>
            <button className="w-full rounded border px-4 py-2" type="button" onClick={() => setView("home")}>Volver</button>
          </form>
        )}

        {token && view === "panel" && (
          <section className="mt-6 space-y-4 rounded bg-white p-4 shadow">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Panel {user.role === "SUPER_ADMIN" ? "Administrador" : "Competidor"}</h2>
                <p className="text-sm text-slate-600">{user.email ?? "Usuario autenticado"}</p>
              </div>
              <button className="rounded border px-3 py-2" onClick={logout}>Cerrar sesión</button>
            </div>
            <div>
              <h3 className="font-medium">Torneos disponibles</h3>
              <ul className="mt-2 space-y-2">
                {tournaments.map((t) => (
                  <li key={t.id} className="flex items-center justify-between rounded border p-3">
                    <span>{t.name}</span>
                    <button className="rounded bg-emerald-600 px-3 py-1 text-sm text-white">Inscribirme</button>
                  </li>
                ))}
                {tournaments.length === 0 && <li className="text-sm text-slate-500">No hay torneos para mostrar.</li>}
              </ul>
            </div>
          </section>
        )}

        {token && view !== "panel" && (
          <button className="mt-6 rounded bg-blue-600 px-4 py-2 text-white" onClick={() => setView("panel")}>Ir al panel</button>
        )}

        {!!message && <p className="mt-4 text-sm text-slate-700">{message}</p>}
      </div>
    </main>
  );
}
