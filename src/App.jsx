import { useState, useEffect, useRef } from "react";
import "./App.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:8000";

// Gatito SVG dibujado a mano, con partes animadas por CSS
function CatSVG({ happy }) {
  return (
    <div className={`cat-svg-wrap ${happy ? "happy" : ""}`}>
      <svg width="110" height="110" viewBox="0 0 110 110" fill="none" xmlns="http://www.w3.org/2000/svg">

        {/* Cola — animada por CSS */}
        <g className="cat-tail">
          <path
            d="M28 92 Q10 100 14 80 Q18 65 30 72"
            stroke="#E8A0B8" strokeWidth="5" strokeLinecap="round" fill="none"
          />
        </g>

        {/* Cuerpo y cabeza como grupo que rebota */}
        <g className="cat-body-group">

          {/* Cuerpo */}
          <ellipse cx="58" cy="80" rx="28" ry="22" fill="#F9C6D8" />

          {/* Barriga */}
          <ellipse cx="58" cy="82" rx="16" ry="13" fill="#FDE8F0" />

          {/* Cabeza */}
          <ellipse cx="58" cy="45" rx="26" ry="24" fill="#F9C6D8" />

          {/* Oreja izquierda */}
          <g className="cat-ear-left">
            <polygon points="34,28 28,10 46,22" fill="#F9C6D8" />
            <polygon points="36,26 31,14 44,23" fill="#F5A0BB" />
          </g>

          {/* Oreja derecha */}
          <g className="cat-ear-right">
            <polygon points="82,28 88,10 70,22" fill="#F9C6D8" />
            <polygon points="80,26 85,14 72,23" fill="#F5A0BB" />
          </g>

          {/* Ojo izquierdo */}
          <g className="cat-eye-left">
            <ellipse cx="48" cy="44" rx="5" ry="6" fill="#3D1A2E" />
            <circle cx="49.5" cy="42.5" r="1.5" fill="white" />
          </g>

          {/* Ojo derecho */}
          <g className="cat-eye-right">
            <ellipse cx="68" cy="44" rx="5" ry="6" fill="#3D1A2E" />
            <circle cx="69.5" cy="42.5" r="1.5" fill="white" />
          </g>

          {/* Nariz */}
          <polygon points="58,53 55,57 61,57" fill="#E05C8A" />

          {/* Boca */}
          <path d="M55,57 Q52,62 49,60" stroke="#C0405A" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
          <path d="M61,57 Q64,62 67,60" stroke="#C0405A" strokeWidth="1.5" strokeLinecap="round" fill="none"/>

          {/* Bigotes izquierda */}
          <line x1="52" y1="56" x2="32" y2="53" stroke="#C090A8" strokeWidth="1.2" strokeLinecap="round"/>
          <line x1="52" y1="58" x2="32" y2="58" stroke="#C090A8" strokeWidth="1.2" strokeLinecap="round"/>
          <line x1="52" y1="60" x2="33" y2="63" stroke="#C090A8" strokeWidth="1.2" strokeLinecap="round"/>

          {/* Bigotes derecha */}
          <line x1="64" y1="56" x2="84" y2="53" stroke="#C090A8" strokeWidth="1.2" strokeLinecap="round"/>
          <line x1="64" y1="58" x2="84" y2="58" stroke="#C090A8" strokeWidth="1.2" strokeLinecap="round"/>
          <line x1="64" y1="60" x2="83" y2="63" stroke="#C090A8" strokeWidth="1.2" strokeLinecap="round"/>

          {/* Patitas delanteras */}
          <ellipse cx="44" cy="98" rx="9" ry="6" fill="#F9C6D8" />
          <ellipse cx="72" cy="98" rx="9" ry="6" fill="#F9C6D8" />
          {/* Deditos */}
          <ellipse cx="40" cy="101" rx="3" ry="2" fill="#F5A0BB" />
          <ellipse cx="44" cy="102" rx="3" ry="2" fill="#F5A0BB" />
          <ellipse cx="48" cy="101" rx="3" ry="2" fill="#F5A0BB" />
          <ellipse cx="68" cy="101" rx="3" ry="2" fill="#F5A0BB" />
          <ellipse cx="72" cy="102" rx="3" ry="2" fill="#F5A0BB" />
          <ellipse cx="76" cy="101" rx="3" ry="2" fill="#F5A0BB" />

          {/* Manchita mejilla */}
          <ellipse cx="42" cy="52" rx="5" ry="3.5" fill="#F5A0BB" opacity="0.5"/>
          <ellipse cx="74" cy="52" rx="5" ry="3.5" fill="#F5A0BB" opacity="0.5"/>
        </g>
      </svg>
    </div>
  );
}

// Patita SVG para el checkbox
function PawIcon() {
  return (
    <svg className="paw" width="13" height="13" viewBox="0 0 20 20" fill="white" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="10" cy="13" rx="5" ry="4.5"/>
      <ellipse cx="4.5" cy="9" rx="2.5" ry="3"/>
      <ellipse cx="15.5" cy="9" rx="2.5" ry="3"/>
      <ellipse cx="7" cy="6" rx="2.2" ry="2.8"/>
      <ellipse cx="13" cy="6" rx="2.2" ry="2.8"/>
    </svg>
  );
}

export default function TodoApp() {
  const [tareas, setTareas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [filtro, setFiltro] = useState("todas");
  const [happy, setHappy] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    async function cargarTareas() {
      try {
        setCargando(true);
        const res = await fetch(`${API}/tareas`);
        if (!res.ok) throw new Error("No se pudo conectar a la API");
        setTareas(await res.json());
        setError(null);
      } catch (e) {
        setError("No se pudo conectar a la API. ¿Está corriendo el backend?");
      } finally {
        setCargando(false);
      }
    }
    cargarTareas();
  }, []);

  function celebrar() {
    setHappy(true);
    setTimeout(() => setHappy(false), 1200);
  }

  async function crearTarea(e) {
    e.preventDefault();
    if (!titulo.trim()) return;
    setEnviando(true);
    try {
      const res = await fetch(`${API}/tareas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titulo: titulo.trim(), descripcion: descripcion.trim() || null }),
      });
      const nueva = await res.json();
      setTareas(prev => [nueva, ...prev]);
      setTitulo("");
      setDescripcion("");
      celebrar();
      inputRef.current?.focus();
    } catch {
      setError("Error al crear la tarea.");
    } finally {
      setEnviando(false);
    }
  }

  async function toggleTarea(tarea) {
    try {
      const res = await fetch(`${API}/tareas/${tarea.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completada: !tarea.completada }),
      });
      const actualizada = await res.json();
      setTareas(prev => prev.map(t => t.id === tarea.id ? actualizada : t));
      if (actualizada.completada) celebrar();
    } catch {
      setError("Error al actualizar la tarea.");
    }
  }

  async function eliminarTarea(id) {
    try {
      await fetch(`${API}/tareas/${id}`, { method: "DELETE" });
      setTareas(prev => prev.filter(t => t.id !== id));
    } catch {
      setError("Error al eliminar la tarea.");
    }
  }

  const tareasFiltradas = tareas.filter(t => {
    if (filtro === "pendientes") return !t.completada;
    if (filtro === "completadas") return t.completada;
    return true;
  });

  const pendientes = tareas.filter(t => !t.completada).length;
  const completadas = tareas.filter(t => t.completada).length;

  return (
    <div className="app">
      <header className="header">
        <CatSVG happy={happy} />
        <p className="header-eyebrow">Mi espacio de trabajo</p>
        <h1>Mis <em>tareas</em></h1>
        <div className="stats">
          <span className="stat"><strong>{pendientes}</strong> pendientes</span>
          <span className="stat"><strong>{completadas}</strong> completadas</span>
        </div>
      </header>

      {error && (
        <div className="error-bar">
          <span>{error}</span>
          <button onClick={() => setError(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#C0405A", fontSize: 18 }}>×</button>
        </div>
      )}

      <div className="form-card">
        <form onSubmit={crearTarea}>
          <div className="form-row">
            <div className="input-group">
              <label htmlFor="titulo">Nueva tarea</label>
              <input
                id="titulo"
                ref={inputRef}
                type="text"
                placeholder="¿Qué tenés que hacer?"
                value={titulo}
                onChange={e => setTitulo(e.target.value)}
              />
            </div>
            <button className="btn-add" type="submit" disabled={enviando || !titulo.trim()}>
              {enviando ? "..." : "+ Agregar"}
            </button>
          </div>
          <textarea
            placeholder="Descripción opcional..."
            value={descripcion}
            onChange={e => setDescripcion(e.target.value)}
          />
        </form>
      </div>

      <div className="filters">
        {["todas", "pendientes", "completadas"].map(f => (
          <button
            key={f}
            className={`filter-btn ${filtro === f ? "active" : ""}`}
            onClick={() => setFiltro(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {cargando ? (
        <div className="loader">Cargando tareas...</div>
      ) : tareasFiltradas.length === 0 ? (
        <div className="empty">
          <svg className="empty-cat" width="60" height="40" viewBox="0 0 60 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="30" cy="28" rx="18" ry="10" fill="#F9C6D8"/>
            <ellipse cx="30" cy="18" rx="14" ry="13" fill="#F9C6D8"/>
            <polygon points="18,10 14,2 24,8" fill="#F9C6D8"/><polygon points="19,9 15,4 23,8" fill="#F5A0BB"/>
            <polygon points="42,10 46,2 36,8" fill="#F9C6D8"/><polygon points="41,9 45,4 37,8" fill="#F5A0BB"/>
            <ellipse cx="24" cy="17" rx="3" ry="3.5" fill="#3D1A2E"/>
            <ellipse cx="36" cy="17" rx="3" ry="3.5" fill="#3D1A2E"/>
            <polygon points="30,23 28,26 32,26" fill="#E05C8A"/>
            <path d="M28,26 Q26,29 24,28" stroke="#C0405A" strokeWidth="1" strokeLinecap="round" fill="none"/>
            <path d="M32,26 Q34,29 36,28" stroke="#C0405A" strokeWidth="1" strokeLinecap="round" fill="none"/>
            <line x1="26" y1="25" x2="14" y2="23" stroke="#C090A8" strokeWidth="1" strokeLinecap="round"/>
            <line x1="34" y1="25" x2="46" y2="23" stroke="#C090A8" strokeWidth="1" strokeLinecap="round"/>
          </svg>
          <p>{filtro === "todas" ? "No hay tareas todavía." : `No hay tareas ${filtro}.`}</p>
        </div>
      ) : (
        <div className="task-list">
          {tareasFiltradas.map(tarea => (
            <div key={tarea.id} className={`task-card ${tarea.completada ? "completada" : ""}`}>
              <div className="checkbox-wrap" onClick={() => toggleTarea(tarea)}>
                <div className={`checkbox-box ${tarea.completada ? "checked" : ""}`}>
                  <PawIcon />
                </div>
              </div>
              <div className="task-content">
                <div className="task-title">{tarea.titulo}</div>
                {tarea.descripcion && <div className="task-desc">{tarea.descripcion}</div>}
                <div className="task-meta">{tarea.creada_en}</div>
              </div>
              <button className="btn-delete" onClick={() => eliminarTarea(tarea.id)} title="Eliminar">×</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}