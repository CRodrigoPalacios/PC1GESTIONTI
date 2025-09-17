import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import html2canvas from "html2canvas";
import api from "../api/api";

import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./Porter.css";

const placeholders = {
  threatNewEntrants: "Analiza la facilidad con que nuevas empresas pueden entrar al mercado...",
  bargainingSuppliers: "Evalúa el poder que tienen los proveedores...",
  bargainingCustomers: "Examina el poder que tienen los clientes...",
  threatSubstitutes: "Identifica productos o servicios alternativos...",
  competitiveRivalry: "Analiza la intensidad de la competencia entre empresas existentes...",
};

const labels: Record<keyof typeof placeholders, string> = {
  threatNewEntrants: "Amenaza de Nuevos Entrantes",
  bargainingSuppliers: "Poder de Negociación de Proveedores",
  bargainingCustomers: "Poder de Negociación de Clientes",
  threatSubstitutes: "Amenaza de Productos Sustitutos",
  competitiveRivalry: "Rivalidad entre Competidores",
};

type Forces = Record<keyof typeof placeholders, string>;

type PorterItem = {
  _id: string;
  title: string;
  threatNewEntrants: string;
  bargainingSuppliers: string;
  bargainingCustomers: string;
  threatSubstitutes: string;
  competitiveRivalry: string;
};

export default function PorterPage() {
  // 📝 datos del formulario
  const [title, setTitle] = useState("");
  const [formData, setFormData] = useState<Forces>(() => {
    const init: any = {};
    (Object.keys(placeholders) as (keyof typeof placeholders)[]).forEach((k) => (init[k] = ""));
    return init;
  });

  // 📚 historial
  const [porterList, setPorterList] = useState<PorterItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    loadPorter();
  }, []);

  const loadPorter = async () => {
    const res = await api.get("/porter");
    setPorterList(res.data);
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSelect = (item: PorterItem) => {
    setSelectedId(item._id);
    setTitle(item.title);
    setFormData({
      threatNewEntrants: item.threatNewEntrants,
      bargainingSuppliers: item.bargainingSuppliers,
      bargainingCustomers: item.bargainingCustomers,
      threatSubstitutes: item.threatSubstitutes,
      competitiveRivalry: item.competitiveRivalry,
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
        await api.put(`/porter/${selectedId}`, transformedData);
        alert("¡Análisis de Porter actualizado!");
      } else {
        await api.post("/porter", transformedData);
        alert("¡Análisis de Porter guardado!");
      }
      loadPorter();
      clearForm();
    } catch (err) {
      console.error("Error al guardar:", err);
      alert("Error al guardar análisis");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("¿Seguro de eliminar este análisis Porter?")) return;
    await api.delete(`/porter/${id}`);
    loadPorter();
    if (selectedId === id) clearForm();
  };

  const clearForm = () => {
    setSelectedId(null);
    setTitle("");
    const init: any = {};
    (Object.keys(placeholders) as (keyof typeof placeholders)[]).forEach((k) => (init[k] = ""));
    setFormData(init);
  };

  const downloadDiagram = () => {
    const diagram = document.getElementById("porterDiagram");
    if (!diagram) return;
    html2canvas(diagram, { scale: 2, backgroundColor: "#ffffff" })
      .then((canvas) => {
        const link = document.createElement("a");
        link.download = `porter-${new Date().toISOString().split("T")[0]}.png`;
        link.href = canvas.toDataURL();
        link.click();
      })
      .catch((error) => {
        console.error("Error al generar la imagen:", error);
        alert("Hubo un error al descargar el análisis.");
      });
  };

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Historial */}
        <div className="col-md-3">
          <h5>Historial de Análisis Porter</h5>
          <ul className="list-group mb-3">
            {porterList.map((item) => (
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
            Nuevo Análisis
          </button>
        </div>

        {/* Diagrama + Formulario */}
        <div className="col-md-9">
          <div className="porter-container" id="porterDiagram">
            <h2 className="porter-title">{title || "Nuevo Análisis Porter"}</h2>
            <div className="diagram-layout">
              {/* top */}
              <div className="top-section">
                <div className="force-box amenaza-nuevos">
                  <div className="force-title">AMENAZA DE NUEVOS ENTRANTES</div>
                  <div className="force-content">
                    {formData.threatNewEntrants || placeholders.threatNewEntrants}
                  </div>
                </div>
              </div>
              <div className="arrow-down">
                <i className="fas fa-arrow-down arrow"></i>
              </div>
              {/* middle */}
              <div className="middle-section">
                <div className="force-box poder-proveedores side-box">
                  <div className="force-title">PODER DE NEGOCIACIÓN DE PROVEEDORES</div>
                  <div className="force-content">
                    {formData.bargainingSuppliers || placeholders.bargainingSuppliers}
                  </div>
                </div>
                <div className="arrow-horizontal">
                  <i className="fas fa-arrow-right arrow"></i>
                </div>
                <div className="force-box rivalidad center-box">
                  <div className="force-title">RIVALIDAD ENTRE COMPETIDORES</div>
                  <div className="force-content">
                    {formData.competitiveRivalry || placeholders.competitiveRivalry}
                  </div>
                </div>
                <div className="arrow-horizontal">
                  <i className="fas fa-arrow-left arrow"></i>
                </div>
                <div className="force-box poder-clientes side-box">
                  <div className="force-title">PODER DE NEGOCIACIÓN DE CLIENTES</div>
                  <div className="force-content">
                    {formData.bargainingCustomers || placeholders.bargainingCustomers}
                  </div>
                </div>
              </div>
              <div className="arrow-down">
                <i className="fas fa-arrow-up arrow"></i>
              </div>
              {/* bottom */}
              <div className="bottom-section">
                <div className="force-box amenaza-sustitutos">
                  <div className="force-title">AMENAZA DE PRODUCTOS SUSTITUTOS</div>
                  <div className="force-content">
                    {formData.threatSubstitutes || placeholders.threatSubstitutes}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Formulario */}
          <div className="form-container mt-3">
            <h3 className="mb-4">{selectedId ? "Editar Análisis" : "Crear Análisis"}</h3>
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
                  placeholder="Ponle un título a tu Análisis Porter"
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
                <button
                  type="button"
                  className="btn btn-download btn-lg"
                  onClick={downloadDiagram}
                >
                  <i className="fas fa-download"></i> Descargar Análisis
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
