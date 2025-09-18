import { useEffect, useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import api from "../api/api";
import { scoreByLength, normalizeTo100 } from "../utils/scoring"; // <-- usa tu scoring
import "./Reportes.css";

type LeanCanvasItem = {
  _id: string;
  title?: string;
  problem: string;
  solution: string;
  keyMetrics: string;
  uniqueValueProposition: string;
  channels: string;
  customerSegments: string;
  costStructure: string;
  revenueStreams: string;
  createdAt?: string;
};

type PorterItem = {
  _id: string;
  title?: string;
  threatNewEntrants: string;
  bargainingSuppliers: string;
  bargainingCustomers: string;
  threatSubstitutes: string;
  competitiveRivalry: string;
  createdAt?: string;
};

export default function ReportesPage() {
  const [leanList, setLeanList] = useState<LeanCanvasItem[]>([]);
  const [porterList, setPorterList] = useState<PorterItem[]>([]);
  const [selectedLean, setSelectedLean] = useState("");
  const [selectedPorter, setSelectedPorter] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const [lres, pres] = await Promise.all([
          api.get("/leancanvas"),
          api.get("/porter"),
        ]);
        setLeanList(Array.isArray(lres.data) ? lres.data : []);
        setPorterList(Array.isArray(pres.data) ? pres.data : []);
      } catch (err) {
        console.error(err);
        alert("Error cargando datos del servidor");
      }
    })();
  }, []);

  // ---- cálculo ITIL ----
  const getLeanAnalysis = (item: LeanCanvasItem) => [
    { name: "Problema", value: scoreByLength(item.problem) },
    { name: "Segmento Clientes", value: scoreByLength(item.customerSegments) },
    { name: "Propuesta Valor", value: scoreByLength(item.uniqueValueProposition) },
    { name: "Solución", value: scoreByLength(item.solution) },
    { name: "Canales", value: scoreByLength(item.channels) },
    { name: "Flujos Ingresos", value: scoreByLength(item.revenueStreams) },
    { name: "Estructura Costos", value: scoreByLength(item.costStructure) },
    { name: "Métricas Clave", value: scoreByLength(item.keyMetrics) },
  ];

  const getPorterAnalysis = (item: PorterItem) => [
    { name: "Nuevos Competidores", value: scoreByLength(item.threatNewEntrants) },
    { name: "Proveedores", value: scoreByLength(item.bargainingSuppliers) },
    { name: "Compradores", value: scoreByLength(item.bargainingCustomers) },
    { name: "Sustitutos", value: scoreByLength(item.threatSubstitutes) },
    { name: "Rivalidad", value: scoreByLength(item.competitiveRivalry) },
  ];

  const currentLean = leanList.find((l) => l._id === selectedLean);
  const currentPorter = porterList.find((p) => p._id === selectedPorter);

  // promedio & conclusiones
  const leanConclusion = useMemo(() => {
    if (!currentLean) return "";
    const values = getLeanAnalysis(currentLean).map((d) => d.value);
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const pct = normalizeTo100(avg);
    if (pct > 80)
      return `El Lean Canvas está muy completo. Desde ITIL, existe un alto grado de madurez en la definición de valor, riesgo y capacidades.`;
    if (pct > 50)
      return `El Lean Canvas es aceptable. Desde ITIL, hay margen para mejorar en gestión de riesgos, valor y métricas clave.`;
    return `El Lean Canvas es insuficiente. Desde ITIL, se recomienda clarificar el valor al cliente y establecer métricas y riesgos más detallados.`;
  }, [currentLean]);

  const porterConclusion = useMemo(() => {
    if (!currentPorter) return "";
    const values = getPorterAnalysis(currentPorter).map((d) => d.value);
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const pct = normalizeTo100(avg);
    if (pct > 80)
      return `El análisis de Porter es muy sólido. Desde ITIL, la comprensión del entorno y gestión de riesgos es robusta.`;
    if (pct > 50)
      return `El análisis de Porter es moderado. Desde ITIL, se identifican riesgos pero aún pueden priorizarse acciones.`;
    return `El análisis de Porter es débil. Desde ITIL, se recomienda profundizar en riesgos, proveedores y competidores.`;
  }, [currentPorter]);

  return (
    <div className="report-container">
      <h2 className="report-title">📊 Análisis ITIL de Lean Canvas y 5 Fuerzas de Porter</h2>

      {/* Selector Lean */}
      <section className="report-section">
        <h3>Selecciona un Lean Canvas</h3>
        <select
          value={selectedLean}
          onChange={(e) => setSelectedLean(e.target.value)}
          className="report-select"
        >
          <option value="">-- Elegir --</option>
          {leanList.map((item) => (
            <option key={item._id} value={item._id}>
              {item.title || `Lean Canvas ${item._id.slice(-4)}`}
            </option>
          ))}
        </select>

        {currentLean && (
          <>
            <h4>{currentLean.title}</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={getLeanAnalysis(currentLean)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
            <p className="report-conclusion">{leanConclusion}</p>
          </>
        )}
      </section>

      {/* Selector Porter */}
      <section className="report-section">
        <h3>Selecciona un Análisis de 5 Fuerzas de Porter</h3>
        <select
          value={selectedPorter}
          onChange={(e) => setSelectedPorter(e.target.value)}
          className="report-select"
        >
          <option value="">-- Elegir --</option>
          {porterList.map((item) => (
            <option key={item._id} value={item._id}>
              {item.title || `Porter ${item._id.slice(-4)}`}
            </option>
          ))}
        </select>

        {currentPorter && (
          <>
            <h4>{currentPorter.title}</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={getPorterAnalysis(currentPorter)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
            <p className="report-conclusion">{porterConclusion}</p>
          </>
        )}
      </section>

      <p className="report-legend">
        Selecciona un elemento del historial para ver su análisis adaptado a ITIL. El puntaje
        (0–5) representa la completitud en cada sección; las conclusiones interpretan ese
        puntaje desde la perspectiva ITIL.
      </p>
    </div>
  );
}
