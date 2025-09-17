import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import html2canvas from "html2canvas";
import api from "../api/api";

import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./LeanCanvas.css";

const placeholders = {
  aliados: "Escribe aquí los aliados y socios estratégicos clave...",
  actividades: "Define las actividades más importantes...",
  propuesta: "Describe qué valor único ofreces a tus clientes...",
  relacion: "Explica qué tipo de relación estableces...",
  segmento: "Identifica los diferentes grupos...",
  recursos: "Lista los recursos más importantes...",
  canales: "Describe cómo tu empresa se comunica...",
  costos: "Describe todos los costos involucrados...",
  ingresos: "Representa el dinero que se genera...",
};

type CanvasData = Record<keyof typeof placeholders, string>;

type LeanItem = {
  _id: string;
  title: string;
  problem: string;
  solution: string;
  keyMetrics: string;
  uniqueValueProposition: string;
  channels: string;
  customerSegments: string;
  costStructure: string;
  revenueStreams: string;
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
      aliados: item.problem,
      actividades: item.solution,
      propuesta: item.keyMetrics,
      relacion: item.uniqueValueProposition,
      segmento: item.channels,
      recursos: item.customerSegments,
      costos: item.costStructure,
      ingresos: item.revenueStreams,
      canales: "", // campo libre
    } as CanvasData);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const transformedData = {
      title,
      problem: formData.aliados,
      solution: formData.actividades,
      keyMetrics: formData.propuesta,
      uniqueValueProposition: formData.relacion,
      channels: formData.segmento,
      customerSegments: formData.recursos,
      costStructure: formData.costos,
      revenueStreams: formData.ingresos,
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
    html2canvas(canvasElement, { scale: 2, backgroundColor: "#ffffff" })
      .then((canvas) => {
        const link = document.createElement("a");
        link.download = `lean-canvas-${new Date().toISOString().split("T")[0]}.png`;
        link.href = canvas.toDataURL();
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
              {(Object.keys(placeholders) as (keyof typeof placeholders)[]).map((field) => (
                <div className={`canvas-box ${field}`} key={field}>
                  <div className="box-title">{placeholders[field]}</div>
                  <div className="box-content">
                    {(formData[field] || placeholders[field])
                      .split("\n")
                      .map((line, idx) => (
                        <p key={idx}>{line}</p>
                      ))}
                  </div>
                </div>
              ))}
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
                />
              </div>
              <div className="row">
                {(Object.keys(placeholders) as (keyof typeof placeholders)[]).map((field) => (
                  <div className="col-md-6 mb-3" key={field}>
                    <label htmlFor={field} className="form-label">
                      {field.charAt(0).toUpperCase() + field.slice(1)}
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
