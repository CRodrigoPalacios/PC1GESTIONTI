// Navbar.tsx
import { Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <h1 className="navbar-brand">Gestión TI</h1>
        <ul className="navbar-links">
          <li><Link to="/">Inicio</Link></li>
          <li><Link to="/leancanvas">Lean Canvas</Link></li>
          <li><Link to="/porter">5 Fuerzas Porter</Link></li>
          <li><Link to="/reportes">Reportes</Link></li>
        </ul>
      </div>
    </nav>
  );
}
