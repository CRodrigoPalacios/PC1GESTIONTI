import { useEffect, useState } from "react";
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
import { scoreByLength, normalizeTo100 } from "../utils/scoring";
import "./Reportes.css";

type LeanCanvasItem = {
  _id: string;
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [lres, pres] = await Promise.all([
          api.get("/leancanvas"),
          api.get("/porter"),
        ]);

        // LeanCanvas ya es array
        const leanData = Array.isArray(lres.data) ? lres.data : [];

        // Porter: si es objeto, lo metemos en array
        const porterData = Array.isArray(pres.data)
          ? pres.data
          : pres.data
          ? [pres.data]
          : [];

        setLeanList(leanData);
        setPorterList(porterData);
      } catch (err) {
        console.error("Error cargando reportes:", err);
        alert("Error cargando datos del servidor");
        setLeanList([]);
        setPorterList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const computeLeanScore = (item: LeanCanvasItem) => {
    const fields = [
      item.problem,
      item.solution,
      item.keyMetrics,
      item.uniqueValueProposition,
      item.channels,
      item.customerSegments,
      item.costStructure,
      item.revenueStreams,
    ];
    const scores = fields.map(scoreByLength);
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    return { scores, percent: normalizeTo100(avg, 5) };
  };

  const computePorterScore = (item: PorterItem) => {
    const fields = [
      item.threatNewEntrants,
      item.bargainingSuppliers,
      item.bargainingCustomers,
      item.threatSubstitutes,
      item.competitiveRivalry,
    ];
    const scores = fields.map(scoreByLength);
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    return { scores, percent: normalizeTo100(avg, 5) };
  };

  if (loading) return <div className="report-container">Cargando reportes...</div>;

  // Datos para gráficas
  const leanChartData = leanList.map((item) => {
    const { percent } = computeLeanScore(item);
    return {
      fecha: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "N/A",
      porcentaje: percent,
    };
  });

  const porterChartData = porterList.map((item) => {
    const { percent } = computePorterScore(item);
    return {
      fecha: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "N/A",
      porcentaje: percent,
    };
  });

  // Conclusión simple
  const promedioLean =
    leanChartData.reduce((a, b) => a + b.porcentaje, 0) / (leanChartData.length || 1);
  const promedioPorter =
    porterChartData.reduce((a, b) => a + b.porcentaje, 0) /
    (porterChartData.length || 1);

  return (
    <div className="report-container">
      <h2 className="report-title">📊 Reportes Cuantificados (Producción y Logística)</h2>

      {/* Lean Canvas */}
      <section className="report-section">
        <h3>Lean Canvas</h3>
        {leanList.length === 0 ? (
          <p>No hay Lean Canvas guardados aún.</p>
        ) : (
          <>
            <table className="report-table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>% General</th>
                  <th>Problema</th>
                  <th>Solución</th>
                  <th>Métricas</th>
                  <th>UVP</th>
                  <th>Canales</th>
                  <th>Segmentos</th>
                  <th>Costos</th>
                  <th>Ingresos</th>
                </tr>
              </thead>
              <tbody>
                {leanList.map((item) => {
                  const { scores, percent } = computeLeanScore(item);
                  return (
                    <tr key={item._id}>
                      <td>{item.createdAt ? new Date(item.createdAt).toLocaleString() : "-"}</td>
                      <td>{percent}%</td>
                      <td>{scores[0]}</td>
                      <td>{scores[1]}</td>
                      <td>{scores[2]}</td>
                      <td>{scores[3]}</td>
                      <td>{scores[4]}</td>
                      <td>{scores[5]}</td>
                      <td>{scores[6]}</td>
                      <td>{scores[7]}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Gráfico barras Lean */}
            <h4 className="grafico-title">Desempeño Lean Canvas</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={leanChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="fecha" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="porcentaje" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </>
        )}
      </section>

      {/* Porter */}
      <section className="report-section">
        <h3>5 Fuerzas de Porter</h3>
        {porterList.length === 0 ? (
          <p>No hay 5 Fuerzas guardadas aún.</p>
        ) : (
          <>
            <table className="report-table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>% General</th>
                  <th>Nuevos</th>
                  <th>Proveedores</th>
                  <th>Clientes</th>
                  <th>Sustitutos</th>
                  <th>Rivalidad</th>
                </tr>
              </thead>
              <tbody>
                {porterList.map((item) => {
                  const { scores, percent } = computePorterScore(item);
                  return (
                    <tr key={item._id}>
                      <td>{item.createdAt ? new Date(item.createdAt).toLocaleString() : "-"}</td>
                      <td>{percent}%</td>
                      <td>{scores[0]}</td>
                      <td>{scores[1]}</td>
                      <td>{scores[2]}</td>
                      <td>{scores[3]}</td>
                      <td>{scores[4]}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Gráfico barras Porter */}
            <h4 className="grafico-title">Desempeño 5 Fuerzas de Porter</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={porterChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="fecha" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="porcentaje" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </>
        )}
      </section>

      {/* Conclusión automática */}
      <div className="report-legend">
        <strong>Conclusión:</strong>
        <p>
          En promedio, los Lean Canvas registrados tienen un <b>{promedioLean.toFixed(1)}%</b> de
          completitud. Las 5 Fuerzas de Porter muestran un <b>{promedioPorter.toFixed(1)}%</b>.
        </p>
        <p>
          Esto permite visualizar rápidamente qué modelo necesita más detalle y cómo se comportan
          tus proyectos desde la perspectiva de <b>Producción y Logística</b>.
        </p>
      </div>
    </div>
  );
}
