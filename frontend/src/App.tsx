import { createContext, useContext, useEffect, useState } from "react";
import { NavLink, Navigate, Route, Routes, useNavigate } from "react-router-dom";

import api, { User } from "./api";
import { AdminPage, DashboardPage, FindParkingPage, HistoryPage, LandingPage, LoginPage, ParkingMapPage, RecommendationsPage, RegisterPage } from "./pages";

type AuthContextValue = { user: User | null; loading: boolean; refresh: () => Promise<void>; logout: () => void };
const AuthContext = createContext<AuthContextValue | null>(null);
export const useAuth = () => {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used within AuthProvider");
  return value;
};

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const refresh = async () => {
    const token = localStorage.getItem("smartpark_token");
    if (!token) { setUser(null); setLoading(false); return; }
    try { setUser((await api.get<User>("/api/auth/me")).data); }
    catch { localStorage.removeItem("smartpark_token"); setUser(null); }
    finally { setLoading(false); }
  };
  useEffect(() => { void refresh(); }, []);
  const logout = () => { localStorage.removeItem("smartpark_token"); sessionStorage.removeItem("smartpark_recommendations"); setUser(null); };
  return <AuthContext.Provider value={{ user, loading, refresh, logout }}>{children}</AuthContext.Provider>;
}

const nav = [["/dashboard", "Dashboard"], ["/find-parking", "Find parking"], ["/map", "Parking map"], ["/history", "History"]] as const;

function Shell({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth(); const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);
  return <div className="min-h-screen bg-[#f6f8fb] text-slate-900">
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:gap-5 sm:px-5">
        <NavLink to="/dashboard" onClick={closeMenu} className="flex shrink-0 items-center gap-2 font-bold tracking-tight"><span className="grid h-8 w-8 place-items-center rounded-lg bg-teal-600 text-white">P</span><span>SMARTPARK <span className="text-teal-600">AI</span></span></NavLink>
        <div className="hidden items-center gap-1 lg:flex">{nav.map(([to, label]) => <NavLink key={to} to={to} className={({ isActive }) => `nav-link ${isActive ? "nav-link-active" : ""}`}>{label}</NavLink>)}{user?.role === "ADMIN" && <NavLink to="/admin" className={({ isActive }) => `nav-link ${isActive ? "nav-link-active" : ""}`}>Admin</NavLink>}</div>
        <div className="flex shrink-0 items-center gap-2 sm:gap-3"><span className="hidden text-sm text-slate-500 sm:block">{user?.username} · {user?.role}</span><button className="btn-secondary px-2.5 sm:px-3" onClick={() => { logout(); navigate("/"); closeMenu(); }}>Sign out</button><button type="button" className="btn-secondary grid h-10 w-10 place-items-center px-0 lg:hidden" aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"} aria-expanded={menuOpen} aria-controls="mobile-navigation" onClick={() => setMenuOpen((open) => !open)}>{menuOpen ? <span aria-hidden="true" className="text-lg">×</span> : <span aria-hidden="true" className="text-lg">☰</span>}</button></div>
      </nav>
      <div id="mobile-navigation" className={`${menuOpen ? "block" : "hidden"} border-t border-slate-100 px-4 pb-3 pt-2 lg:hidden`}>
        <div className="mx-auto grid max-w-7xl gap-1">{nav.map(([to, label]) => <NavLink key={to} to={to} onClick={closeMenu} className={({ isActive }) => `nav-link w-full ${isActive ? "nav-link-active" : ""}`}>{label}</NavLink>)}{user?.role === "ADMIN" && <NavLink to="/admin" onClick={closeMenu} className={({ isActive }) => `nav-link w-full ${isActive ? "nav-link-active" : ""}`}>Admin</NavLink>}</div>
      </div>
    </header><main className="mx-auto max-w-7xl px-4 py-6 sm:px-5 sm:py-8">{children}</main>
  </div>;
}

function Protected({ children, roles }: { children: React.ReactNode; roles?: string[] }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="grid min-h-screen place-items-center text-slate-500">Loading your workspace…</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" replace />;
  return <Shell>{children}</Shell>;
}

export default function App() {
  return <AuthProvider><Routes>
    <Route path="/" element={<LandingPage />} /><Route path="/login" element={<LoginPage />} /><Route path="/register" element={<RegisterPage />} />
    <Route path="/dashboard" element={<Protected><DashboardPage /></Protected>} /><Route path="/find-parking" element={<Protected><FindParkingPage /></Protected>} /><Route path="/recommendations" element={<Protected><RecommendationsPage /></Protected>} /><Route path="/map" element={<Protected><ParkingMapPage /></Protected>} /><Route path="/history" element={<Protected><HistoryPage /></Protected>} /><Route path="/admin" element={<Protected roles={["ADMIN"]}><AdminPage /></Protected>} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes></AuthProvider>;
}
