import { useEffect, useMemo, useState } from "react";

type Role = "SUPER_ADMIN" | "COMPETIDOR" | "ORGANIZADOR" | "ARBITRO" | string;
type UserType = "COMPETIDOR" | "ORGANIZADOR" | "ARBITRO";
type View = "home" | "roleRegister" | "login" | "panel";

type Option = { id: string; name: string; sportId?: string };
type Tournament = { id: string; name: string };
type Profile = {
  cityId: string;
  sportId: string;
  sportCategoryId: string;
  city?: Option;
  sport?: Option;
  sportCategory?: Option;
};

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";
const TOKEN_KEY = "competidoreya_token";

function decodeJwtPayload(token: string): { email?: string; role?: Role } {
  try {
    const payloadBase64 = token.split(".")[1];
    if (!payloadBase64) return {};
    return JSON.parse(atob(payloadBase64));
  } catch {
    return {};
  }
}

export function App() {
  const [view, setView] = useState<View>("home");
  const [selectedRole, setSelectedRole] = useState<UserType | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem(TOKEN_KEY));
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cityId, setCityId] = useState("");
  const [sportId, setSportId] = useState("");
  const [sportCategoryId, setSportCategoryId] = useState("");
  const [cities, setCities] = useState<Option[]>([]);
  const [sports, setSports] = useState<Option[]>([]);
  const [categories, setCategories] = useState<Option[]>([]);
  const [message, setMessage] = useState("");
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);

  const user = useMemo(() => (token ? decodeJwtPayload(token) : {}), [token]);
  const filteredCategories = useMemo(
    () => categories.filter((c) => !sportId || c.sportId === sportId),
    [categories, sportId]
  );

  async function fetchJson(path: string, options?: RequestInit) {
    const res = await fetch(`${API_BASE}${path}`, options);
    const data = await res.json().catch(() => ({}));
    return { res, data };
  }

  async function loadCatalogs() {
    const [citiesRes, sportsRes, categoriesRes] = await Promise.all([
      fetchJson("/cities"),
      fetchJson("/sports"),
      fetchJson("/sport-categories")
    ]);

    if (citiesRes.res.ok) setCities(citiesRes.data);
    if (sportsRes.res.ok) setSports(sportsRes.data);
    if (categoriesRes.res.ok) setCategories(categoriesRes.data);
  }

  async function handleCompetitorRegister(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    const registerResult = await fetchJson("/auth/register/competitor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    if (!registerResult.res.ok) {
      return setMessage(registerResult.data.message || "No se pudo registrar competidor");
    }

    const loginResult = await fetchJson("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    if (!loginResult.res.ok) {
      setMessage("Cuenta creada. Iniciá sesión para completar perfil.");
      setView("login");
      return;
    }

    localStorage.setItem(TOKEN_KEY, loginResult.data.token);
    setToken(loginResult.data.token);

    const profileResult = await fetchJson("/competitor-profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${loginResult.data.token}`
      },
      body: JSON.stringify({ cityId, sportId, sportCategoryId })
    });

    setMessage(profileResult.res.ok ? "Registro completo." : "Cuenta creada. Completá tu perfil más tarde.");
    setView("panel");
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    const { res, data } = await fetchJson("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) return setMessage(data.message || "Credenciales inválidas");
    localStorage.setItem(TOKEN_KEY, data.token);
    setToken(data.token);
    setView("panel");
  }

  async function loadPanelData() {
    if (!token) return;
    const headers = { Authorization: `Bearer ${token}` };
    const tournamentsResult = await fetchJson("/tournaments", { headers });
    if (tournamentsResult.res.ok) setTournaments(tournamentsResult.data);

    if (user.role === "COMPETIDOR") {
      const profileResult = await fetchJson("/competitor-profile", { headers });
      if (profileResult.res.ok) setProfile(profileResult.data);
    }
  }

  async function registerToTournament(tournamentId: string) {
    if (!token) return;
    const { res, data } = await fetchJson("/registrations", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ tournamentId })
    });
    setMessage(res.ok ? "Inscripción realizada." : data.message || "No se pudo completar la inscripción");
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setProfile(null);
    setTournaments([]);
    setSelectedRole(null);
    setView("home");
  }

  useEffect(() => {
    void loadCatalogs();
  }, []);

  useEffect(() => {
    if (token && view === "panel") void loadPanelData();
  }, [token, view]);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-5xl p-6">
        <h1 className="text-3xl font-bold">CompetidoresYa</h1>
        <p className="mt-2 text-slate-600">Plataforma deportiva para competidores, organizadores y árbitros</p>

        {!token && view === "home" && (
          <section className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              { role: "COMPETIDOR", title: "Competidor" },
              { role: "ORGANIZADOR", title: "Organizador / Administrador" },
              { role: "ARBITRO", title: "Árbitro" }
            ].map((item) => (
              <button
                key={item.role}
                className="rounded-lg border bg-white p-4 text-left shadow-sm hover:border-blue-500"
                onClick={() => {
                  setSelectedRole(item.role as UserType);
                  setView("roleRegister");
                }}
              >
                <h2 className="text-lg font-semibold">{item.title}</h2>
                <p className="text-sm text-slate-500">Seleccionar tipo de usuario</p>
              </button>
            ))}
            <button className="rounded border border-slate-300 px-4 py-2 md:col-span-3" onClick={() => setView("login")}>Iniciar sesión</button>
          </section>
        )}

        {!token && view === "roleRegister" && selectedRole === "COMPETIDOR" && (
          <form className="mt-6 max-w-lg space-y-3 rounded bg-white p-4 shadow" onSubmit={handleCompetitorRegister}>
            <h2 className="text-xl font-semibold">Registro de competidor</h2>
            <input className="w-full rounded border p-2" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <input className="w-full rounded border p-2" type="password" placeholder="Password (mínimo 10)" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <select className="w-full rounded border p-2" value={cityId} onChange={(e) => setCityId(e.target.value)} required>
              <option value="">Seleccionar ciudad</option>
              {cities.map((city) => <option key={city.id} value={city.id}>{city.name}</option>)}
            </select>
            <select className="w-full rounded border p-2" value={sportId} onChange={(e) => setSportId(e.target.value)} required>
              <option value="">Seleccionar deporte</option>
              {sports.map((sport) => <option key={sport.id} value={sport.id}>{sport.name}</option>)}
            </select>
            <select className="w-full rounded border p-2" value={sportCategoryId} onChange={(e) => setSportCategoryId(e.target.value)} required>
              <option value="">Seleccionar categoría</option>
              {filteredCategories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
            </select>
            <button className="w-full rounded bg-blue-600 px-4 py-2 text-white" type="submit">Crear cuenta</button>
            <button className="w-full rounded border px-4 py-2" type="button" onClick={() => setView("home")}>Volver</button>
          </form>
        )}

        {!token && view === "roleRegister" && selectedRole === "ORGANIZADOR" && (
          <section className="mt-6 max-w-lg rounded bg-white p-4 shadow">
            <h2 className="text-xl font-semibold">Registro de organizadores</h2>
            <p className="mt-2 text-slate-600">Registro de organizadores próximamente.</p>
            <button className="mt-4 rounded border px-4 py-2" onClick={() => setView("home")}>Volver</button>
          </section>
        )}

        {!token && view === "roleRegister" && selectedRole === "ARBITRO" && (
          <section className="mt-6 max-w-lg rounded bg-white p-4 shadow">
            <h2 className="text-xl font-semibold">Registro de árbitros</h2>
            <p className="mt-2 text-slate-600">Registro de árbitros próximamente.</p>
            <button className="mt-4 rounded border px-4 py-2" onClick={() => setView("home")}>Volver</button>
          </section>
        )}

        {!token && view === "login" && (
          <form className="mt-6 max-w-md space-y-3 rounded bg-white p-4 shadow" onSubmit={handleLogin}>
            <h2 className="text-xl font-semibold">Iniciar sesión</h2>
            <input className="w-full rounded border p-2" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <input className="w-full rounded border p-2" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button className="w-full rounded bg-blue-600 px-4 py-2 text-white" type="submit">Ingresar</button>
          </form>
        )}

        {token && view === "panel" && (
          <section className="mt-6 space-y-4 rounded bg-white p-4 shadow">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Panel {user.role}</h2>
                <p className="text-sm text-slate-600">{user.email}</p>
              </div>
              <button className="rounded border px-3 py-2" onClick={logout}>Cerrar sesión</button>
            </div>

            {user.role === "COMPETIDOR" && (
              <>
                <div className="rounded border p-3">
                  <h3 className="font-medium">Perfil deportivo</h3>
                  <p className="text-sm text-slate-600">Ciudad: {profile?.city?.name ?? "No configurada"}</p>
                  <p className="text-sm text-slate-600">Deporte: {profile?.sport?.name ?? "No configurado"}</p>
                  <p className="text-sm text-slate-600">Categoría: {profile?.sportCategory?.name ?? "No configurada"}</p>
                </div>
                <div>
                  <h3 className="font-medium">Torneos disponibles</h3>
                  <ul className="mt-2 space-y-2">
                    {tournaments.map((t) => (
                      <li key={t.id} className="flex items-center justify-between rounded border p-3">
                        <span>{t.name}</span>
                        <button className="rounded bg-emerald-600 px-3 py-1 text-sm text-white" onClick={() => void registerToTournament(t.id)}>Inscribirme</button>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}

            {user.role === "ORGANIZADOR" && (
              <div>
                <h3 className="font-medium">Torneos administrados</h3>
                <ul className="mt-2 space-y-2">
                  {tournaments.map((t) => <li key={t.id} className="rounded border p-3">{t.name}</li>)}
                </ul>
                <button className="mt-3 rounded bg-slate-800 px-3 py-2 text-sm text-white" disabled>Crear torneo (próximamente)</button>
              </div>
            )}

            {user.role === "ARBITRO" && <p className="text-slate-600">Panel de árbitro en preparación.</p>}
          </section>
        )}

        {!!message && <p className="mt-4 text-sm text-slate-700">{message}</p>}
      </div>
    </main>
  );
}
