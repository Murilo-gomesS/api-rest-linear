import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  getActiveService,
  useServiceMode
} from "../services/serviceDetector";
import { StatsSummary } from "../types/structures";

const initialStats: StatsSummary = {
  totalStructures: 0,
  inUse: {
    stack: 0,
    queue: 0,
    list: 0
  }
};

export function MenuBar() {
  const [stats, setStats] = useState<StatsSummary>(initialStats);
  const [error, setError] = useState<string>("");
  const { mode, loading } = useServiceMode();

  useEffect(() => {
    if (loading) return;

    let active = true;

    async function loadStats() {
      try {
        const service = getActiveService();
        const data = await service.getStats();
        if (active) {
          setStats(data);
          setError("");
        }
      } catch (err) {
        if (active) {
          const message =
            err instanceof Error ? err.message : "Nao foi possivel carregar estatisticas";
          setError(message);
        }
      }
    }

    loadStats();
    const interval = setInterval(loadStats, 3000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [loading, mode]);

  return (
    <header className="menu-bar">
      <div className="menu-links">
        <NavLink to="/pilha" className={({ isActive }) => (isActive ? "active" : "")}>Pilha</NavLink>
        <NavLink to="/fila" className={({ isActive }) => (isActive ? "active" : "")}>Fila</NavLink>
        <NavLink to="/lista" className={({ isActive }) => (isActive ? "active" : "")}>Lista</NavLink>
      </div>

      <div className="menu-stats">
        <span>Total: {stats.totalStructures}</span>
        <span>Em uso: P({stats.inUse.stack}) F({stats.inUse.queue}) L({stats.inUse.list})</span>
        {!loading && <span className={`mode-badge ${mode}`}>{mode === "api" ? "🟢 API" : "🔵 Simulado"}</span>}
        {error && <span className="stats-error">{error}</span>}
      </div>
    </header>
  );
}