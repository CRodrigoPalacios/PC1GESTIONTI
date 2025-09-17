import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import html2canvas from "html2canvas";
import api from "../api/api";

import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./LeanCanvas.css";

const placeholders = {
  problem: "Identifica los problemas principales que experimenta tu segmento de clientes...",
  solution: "Describe las soluciones que ofreces para resolver los problemas identificados...",
  keyMetrics: "Define las métricas clave que usarás para medir el éxito...",
  uniqueValueProposition: "Describe qué valor único ofreces a tus clientes...",
  unfairAdvantage: "Identifica qué ventaja competitiva tienes que no puede ser fácilmente copiada...",
  channels: "Describe cómo tu empresa se comunica y llega a sus clientes...",
  customerSegments: "Identifica los diferentes grupos de clientes objetivo...",
  costStructure: "Describe todos los costos involucrados en tu modelo de negocio...",
  revenueStreams: "Representa las diferentes formas en que generas ingresos...",
};

const labels: Record<keyof typeof placeholders, string> = {
  problem: "Problema",
  solution: "Solución", 
  keyMetrics: "Métricas Clave",
  uniqueValueProposition: "Propuesta de Valor Única",
  unfairAdvantage: "Ventaja Competitiva",
  channels: "Canales",
  customerSegments: "Segmentos de Clientes",
  costStructure: "Estructura de Costos",
  revenueStreams: "Flujos de Ingresos",
};

type CanvasData = Record<keyof typeof placeholders, string>;

type LeanItem = {
  _id: string;
  title: string;
  problem: string;
  solution: string;
  keyMetrics: string;
  uniqueValueProposition: string;
  unfairAdvantage: string;
  channels: string;
  customerSegments: string;
  costStructure: string;
  revenueStreams: string;
};

// Función auxiliar para convertir saltos de línea en <br>
const formatTextWithLineBreaks = (text: string) => {
  return text.split('\n').map((line, index) => (
    <span key={index}>
      {line}
      {index < text.split('\n').length - 1 && <br />}
    </span>
  ));
};

export default function LeanCanvasPage() {
  // 📝 datos del formulario
  const [title, setTitle] = useState("");
  const [formData, setFormData] = useState<CanvasData>(() => {
    const init: any = {};
    (Object.keys(placeholders) as (keyof typeof placeholders)[]).forEach((k) => (init[k] = ""));
    return init;
  });

  // 📚 historial
  const [leanList, setLeanList] = useState<LeanItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // cargar lista al montar
  useEffect(() => {
    loadLeanCanvas();
  }, []);

  const loadLeanCanvas = async () => {
    const res = await api.get("/leancanvas");
    setLeanList(res.data);
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // seleccionar para editar
  const handleSelect = (item: LeanItem) => {
    setSelectedId(item._id);
    setTitle(item.title);
    setFormData({
      problem: item.problem || "",
      solution: item.solution || "",
      keyMetrics: item.keyMetrics || "",
      uniqueValueProposition: item.uniqueValueProposition || "",
      unfairAdvantage: item.unfairAdvantage || "",
      channels: item.channels || "",
      customerSegments: item.customerSegments || "",
      costStructure: item.costStructure || "",
      revenueStreams: item.revenueStreams || "",
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const transformedData = {
      title,
      ...formData,
    };

    try {
      if (selectedId) {
        await api.put(`/leancanvas/${selectedId}`, transformedData);
        alert("¡Canvas actualizado!");
      } else {
        await api.post("/leancanvas", transformedData);
        alert("¡Canvas guardado!");
      }
      loadLeanCanvas();
      clearForm();
    } catch (err) {
      console.error("Error al guardar:", err);
      alert("Error al guardar canvas");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("¿Seguro de eliminar este Lean Canvas?")) return;
    await api.delete(`/leancanvas/${id}`);
    loadLeanCanvas();
    if (selectedId === id) clearForm();
  };

  const clearForm = () => {
    setSelectedId(null);
    setTitle("");
    const init: any = {};
    (Object.keys(placeholders) as (keyof typeof placeholders)[]).forEach((k) => (init[k] = ""));
    setFormData(init);
  };

  const downloadCanvas = () => {
    const canvasElement = document.getElementById("canvas");
    if (!canvasElement) return;
    
    html2canvas(canvasElement, { 
      scale: 2, 
      backgroundColor: "#ffffff",
      useCORS: true,
      allowTaint: false,
      foreignObjectRendering: true,
      letterRendering: true,
      logging: false,
      width: canvasElement.scrollWidth,
      height: canvasElement.scrollHeight,
      scrollX: 0,
      scrollY: 0
    })
      .then((canvas) => {
        const link = document.createElement("a");
        link.download = `lean-canvas-${new Date().toISOString().split("T")[0]}.png`;
        link.href = canvas.toDataURL("image/png", 1.0);
        link.click();
      })
      .catch((error) => {
        console.error("Error al generar la imagen:", error);
        alert("Hubo un error al descargar el canvas.");
      });
  };

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Historial */}
        <div className="col-md-3">
          <h5>Historial de Lean Canvas</h5>
          <ul className="list-group mb-3">
            {leanList.map((item) => (
              <li
                key={item._id}
                className={`list-group-item d-flex justify-content-between align-items-center ${
                  selectedId === item._id ? "active" : ""
                }`}
                onClick={() => handleSelect(item)}
                style={{ cursor: "pointer" }}
              >
                {item.title || "Sin título"}
                <button
                  className="btn btn-sm btn-danger"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(item._id);
                  }}
                >
                  <i className="fas fa-trash"></i>
                </button>
              </li>
            ))}
          </ul>
          <button className="btn btn-secondary w-100" onClick={clearForm}>
            Nuevo Canvas
          </button>
        </div>

        {/* Canvas */}
        <div className="col-md-9">
          <div className="canvas-container" id="canvas">
            <h2 className="canvas-title">{title || "Nuevo Lean Canvas"}</h2>

            <div className="canvas-grid">
              {/* Fila 1 */}
              <div className="canvas-box problem">
                <div className="box-title">{labels.problem}</div>
                <div className="box-content">
                  {formData.problem ? 
                    formatTextWithLineBreaks(formData.problem) : 
                    placeholders.problem}
                </div>
              </div>
              <div className="canvas-box solution">
                <div className="box-title">{labels.solution}</div>
                <div className="box-content">
                  {formData.solution ? 
                    formatTextWithLineBreaks(formData.solution) : 
                    placeholders.solution}
                </div>
              </div>
              <div className="canvas-box keyMetrics">
                <div className="box-title">{labels.keyMetrics}</div>
                <div className="box-content">
                  {formData.keyMetrics ? 
                    formatTextWithLineBreaks(formData.keyMetrics) : 
                    placeholders.keyMetrics}
                </div>
              </div>
              <div className="canvas-box uniqueValueProposition">
                <div className="box-title">{labels.uniqueValueProposition}</div>
                <div className="box-content">
                  {formData.uniqueValueProposition ? 
                    formatTextWithLineBreaks(formData.uniqueValueProposition) : 
                    placeholders.uniqueValueProposition}
                </div>
              </div>
              <div className="canvas-box unfairAdvantage">
                <div className="box-title">{labels.unfairAdvantage}</div>
                <div className="box-content">
                  {formData.unfairAdvantage ? 
                    formatTextWithLineBreaks(formData.unfairAdvantage) : 
                    placeholders.unfairAdvantage}
                </div>
              </div>

              {/* Fila 2 */}
              <div className="canvas-box channels">
                <div className="box-title">{labels.channels}</div>
                <div className="box-content">
                  {formData.channels ? 
                    formatTextWithLineBreaks(formData.channels) : 
                    placeholders.channels}
                </div>
              </div>
              <div className="canvas-box customerSegments">
                <div className="box-title">{labels.customerSegments}</div>
                <div className="box-content">
                  {formData.customerSegments ? 
                    formatTextWithLineBreaks(formData.customerSegments) : 
                    placeholders.customerSegments}
                </div>
              </div>

              {/* Fila 3 */}
              <div className="canvas-box costStructure">
                <div className="box-title">{labels.costStructure}</div>
                <div className="box-content">
                  {formData.costStructure ? 
                    formatTextWithLineBreaks(formData.costStructure) : 
                    placeholders.costStructure}
                </div>
              </div>
              <div className="canvas-box revenueStreams">
                <div className="box-title">{labels.revenueStreams}</div>
                <div className="box-content">
                  {formData.revenueStreams ? 
                    formatTextWithLineBreaks(formData.revenueStreams) : 
                    placeholders.revenueStreams}
                </div>
              </div>
            </div>
          </div>

          {/* Formulario */}
          <div className="form-container mt-3">
            <h3 className="mb-4">{selectedId ? "Editar Lean Canvas" : "Crear Lean Canvas"}</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="title" className="form-label">
                  Título
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ponle un título a tu Canvas"
                  required
                />
              </div>
              <div className="row">
                {(Object.keys(placeholders) as (keyof typeof placeholders)[]).map((field) => (
                  <div className="col-md-6 mb-3" key={field}>
                    <label htmlFor={field} className="form-label">
                      {labels[field]}
                    </label>
                    <textarea
                      className="form-control"
                      id={field}
                      name={field}
                      rows={3}
                      placeholder={placeholders[field]}
                      value={formData[field]}
                      onChange={handleChange}
                    />
                  </div>
                ))}
              </div>
              <div className="text-center">
                <button type="submit" className="btn btn-primary btn-lg me-3">
                  <i className="fas fa-save"></i> {selectedId ? "Actualizar" : "Guardar"}
                </button>
                <button type="button" className="btn btn-download btn-lg" onClick={downloadCanvas}>
                  <i className="fas fa-download"></i> Descargar Canvas
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}