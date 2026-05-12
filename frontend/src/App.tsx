import { useEffect, useMemo, useState } from "react";

type Role = "SUPER_ADMIN" | "COMPETIDOR" | "ORGANIZADOR" | "ARBITRO" | string;
type UserType = "COMPETIDOR" | "ORGANIZADOR" | "ARBITRO";
type View = "home" | "roleRegister" | "login" | "panel";

type Option = { id: string; name: string; sportId?: string };
type Tournament = { id: string; name: string };
type TournamentCategory = { tournamentId: string; sportId: string; sportCategory: Option };
type Profile = { cityId: string; sportId?: string; sportCategoryId?: string; city?: Option; sport?: Option; sportCategory?: Option };

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";
const TOKEN_KEY = "competidoreya_token";

function decodeJwtPayload(token: string): { email?: string; role?: Role } { try { return JSON.parse(atob(token.split(".")[1] || "")); } catch { return {}; } }

export function App() {
  const [view, setView] = useState<View>("home");
  const [selectedRole, setSelectedRole] = useState<UserType | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem(TOKEN_KEY));
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
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
  const [tournamentCategories, setTournamentCategories] = useState<TournamentCategory[]>([]);
  const [selectedTournament, setSelectedTournament] = useState("");
  const [profile, setProfile] = useState<Profile | null>(null);

  const user = useMemo(() => (token ? decodeJwtPayload(token) : {}), [token]);
  const filteredCategories = useMemo(() => categories.filter((c) => c.sportId === sportId), [categories, sportId]);
  const visibleTournaments = useMemo(() => !sportId ? [] : tournaments.filter((t) => tournamentCategories.some((tc) => tc.tournamentId === t.id && tc.sportId === sportId)), [sportId, tournaments, tournamentCategories]);
  const selectedTournamentCategories = useMemo(() => tournamentCategories.filter((tc) => tc.tournamentId === selectedTournament && tc.sportId === sportId).map((tc) => tc.sportCategory), [selectedTournament, sportId, tournamentCategories]);

  async function fetchJson(path: string, options?: RequestInit) { const res = await fetch(`${API_BASE}${path}`, options); const data = await res.json().catch(() => ({})); return { res, data }; }
  async function loadCatalogs() { const [a,b,c] = await Promise.all([fetchJson('/cities'), fetchJson('/sports'), fetchJson('/sport-categories')]); if(a.res.ok) setCities(a.data); if(b.res.ok) setSports(b.data); if(c.res.ok) setCategories(c.data); }

  async function handleCompetitorRegister(e: React.FormEvent) {
    e.preventDefault(); setMessage("");
    const r = await fetchJson('/auth/register/competitor', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ firstName, lastName, cityId, email, password }) });
    if (!r.res.ok) return setMessage(r.data.message || 'No se pudo registrar competidor');
    setMessage('Cuenta creada. Ahora iniciá sesión.'); setView('login');
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault(); setMessage("");
    const { res, data } = await fetchJson('/auth/login', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ email, password }) });
    if (!res.ok) return setMessage(data.message || 'Credenciales inválidas');
    localStorage.setItem(TOKEN_KEY, data.token); setToken(data.token); setView('panel');
  }

  async function loadPanelData() {
    if (!token) return;
    const headers = { Authorization: `Bearer ${token}` };
    const [tRes, tcRes, pRes] = await Promise.all([fetchJson('/tournaments', { headers }), fetchJson('/tournament-categories', { headers }), fetchJson('/competitor-profile', { headers })]);
    if (tRes.res.ok) setTournaments(tRes.data);
    if (tcRes.res.ok) setTournamentCategories(tcRes.data);
    if (pRes.res.ok && pRes.data) { setProfile(pRes.data); setCityId(pRes.data.cityId); if (pRes.data.sportId) setSportId(pRes.data.sportId); }
  }

  async function registerToTournament() {
    if (!token || !selectedTournament || !sportId || !sportCategoryId || !cityId) return;
    const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
    const pRes = await fetchJson('/competitor-profile', { method:'PUT', headers, body: JSON.stringify({ cityId, sportId, sportCategoryId }) });
    if (!pRes.res.ok) return setMessage(pRes.data.message || 'No se pudo actualizar el perfil');
    const {res,data} = await fetchJson('/registrations', { method:'POST', headers, body: JSON.stringify({ tournamentId: selectedTournament }) });
    setMessage(res.ok ? 'Inscripción realizada.' : data.message || 'No se pudo completar la inscripción');
  }

  function logout(){ localStorage.removeItem(TOKEN_KEY); setToken(null); setView('home'); }
  useEffect(() => { void loadCatalogs(); }, []);
  useEffect(() => { if (token && view === 'panel') void loadPanelData(); }, [token, view]);

  return <main className="min-h-screen bg-slate-50 text-slate-900"><div className="mx-auto max-w-5xl p-6"><h1 className="text-3xl font-bold">CompetidoresYa</h1>
    {!token && view==='home' && <section className="mt-8 grid gap-4 md:grid-cols-3">{[{ role:'COMPETIDOR', title:'Competidor' },{ role:'ORGANIZADOR', title:'Organizador / Administrador' },{ role:'ARBITRO', title:'Árbitro' }].map((item)=><button key={item.role} className="rounded-lg border bg-white p-4 text-left shadow-sm" onClick={()=>{setSelectedRole(item.role as UserType); setView('roleRegister');}}><h2 className="text-lg font-semibold">{item.title}</h2></button>)}<button className="rounded border px-4 py-2 md:col-span-3" onClick={()=>setView('login')}>Iniciar sesión</button></section>}

    {!token && view==='roleRegister' && selectedRole==='COMPETIDOR' && <form className="mt-6 max-w-lg space-y-3 rounded bg-white p-4 shadow" onSubmit={handleCompetitorRegister}><h2 className="text-xl font-semibold">Registro de competidor</h2>
      <input className="w-full rounded border p-2" placeholder="Nombre" value={firstName} onChange={(e)=>setFirstName(e.target.value)} required />
      <input className="w-full rounded border p-2" placeholder="Apellido" value={lastName} onChange={(e)=>setLastName(e.target.value)} required />
      <input className="w-full rounded border p-2" type="email" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
      <input className="w-full rounded border p-2" type="password" placeholder="Password (mínimo 10)" value={password} onChange={(e)=>setPassword(e.target.value)} required />
      <select className="w-full rounded border p-2" value={cityId} onChange={(e)=>setCityId(e.target.value)} required><option value="">Seleccionar ciudad</option>{cities.map((city)=><option key={city.id} value={city.id}>{city.name}</option>)}</select>
      <button className="w-full rounded bg-blue-600 px-4 py-2 text-white" type="submit">Crear cuenta</button></form>}

    {!token && view==='login' && <form className="mt-6 max-w-md space-y-3 rounded bg-white p-4 shadow" onSubmit={handleLogin}><h2 className="text-xl font-semibold">Iniciar sesión</h2><input className="w-full rounded border p-2" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required /><input className="w-full rounded border p-2" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required /><button className="w-full rounded bg-blue-600 px-4 py-2 text-white" type="submit">Ingresar</button></form>}

    {token && view==='panel' && <section className="mt-6 space-y-4 rounded bg-white p-4 shadow"><div className="flex items-center justify-between"><h2 className="text-xl font-semibold">Panel {user.role}</h2><button className="rounded border px-3 py-2" onClick={logout}>Cerrar sesión</button></div>
      {user.role==='COMPETIDOR' && <><div className="rounded border p-3"><h3 className="font-medium">Datos del deportista</h3><p className="text-sm">Email: {user.email}</p><p className="text-sm">Ciudad: {profile?.city?.name ?? 'No configurada'}</p></div>
      <div className="rounded border p-3"><h3 className="font-medium">¿En qué deporte querés competir?</h3><select className="mt-2 w-full rounded border p-2" value={sportId} onChange={(e)=>{setSportId(e.target.value); setSelectedTournament(''); setSportCategoryId('');}}><option value="">Seleccionar deporte</option>{sports.map((sport)=><option key={sport.id} value={sport.id}>{sport.name}</option>)}</select></div>
      <div className="rounded border p-3"><h3 className="font-medium">Torneos disponibles</h3><ul className="mt-2 space-y-2">{visibleTournaments.map((t)=><li key={t.id} className="rounded border p-3"><div className="flex items-center justify-between"><span>{t.name}</span><button className="rounded bg-emerald-600 px-3 py-1 text-white" onClick={()=>setSelectedTournament(t.id)}>Inscribirme</button></div>{selectedTournament===t.id && <div className="mt-2"><select className="w-full rounded border p-2" value={sportCategoryId} onChange={(e)=>setSportCategoryId(e.target.value)}><option value="">Seleccionar categoría</option>{selectedTournamentCategories.map((c)=><option key={c.id} value={c.id}>{c.name}</option>)}</select><button className="mt-2 rounded bg-blue-600 px-3 py-1 text-white" onClick={()=>void registerToTournament()}>Confirmar inscripción</button></div>}</li>)}</ul></div></>}
    </section>}

    {!!message && <p className="mt-4 text-sm text-slate-700">{message}</p>}
  </div></main>;
}
