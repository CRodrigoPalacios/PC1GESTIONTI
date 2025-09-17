// src/pages/HomePage.tsx
import { Link } from "react-router-dom";
import "./Home.css";

export default function Home() {
  return (
    <div className="home-container">
      <div className="intro-card">
        <h1 className="title">Práctica Calificada 1 – Gestión de TI</h1>
        <p className="description">
          Bienvenido al sistema desarrollado para la práctica calificada 1 del curso de Gestión
          de Tecnologías de Información. Aquí podrás elaborar y gestionar tus análisis de
          las 5 Fuerzas de Porter y Lean Canvas de manera sencilla.
        </p>
        <p>
          <strong>Link de trabajo: </strong>
          <a
            href="https://www.canva.com/design/DAGzGaCGPJY/ulgfmYix9ZZpRi6e5LX56Q/edit?utm_content=DAGzGaCGPJY&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton"
            target="_blank"
            rel="noopener noreferrer"
          >
            Canva – Proyecto
          </a>
        </p>
        <div className="buttons">
          <Link to="/porter" className="btn-action">
            Ir a 5 Fuerzas de Porter
          </Link>
          <Link to="/leancanvas" className="btn-action">
            Ir a Lean Canvas
          </Link>
        </div>
      </div>

      <div className="team-card">
        <h3>Integrantes:</h3>
        <ul>
          <li>Antón Chévez Darwin Joel</li>
          <li>Correa Chanta Daniel</li>
          <li>Gutiérrez Arrunátegui Gabriel</li>
          <li>Llacsahuanga Abad Carlos Eduardo</li>
          <li>Palacios Zapata Rodrigo</li>
        </ul>
      </div>
    </div>
  );
}
