import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import LeanCanvasPage from "./pages/LeanCanvasPage";
import PorterPage from "./pages/PorterPage";
import ReportesPage from "./pages/ReportesPage";
import "./App.css";

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/leancanvas" element={<LeanCanvasPage />} />
          <Route path="/porter" element={<PorterPage />} />
          <Route path="/reportes" element={<ReportesPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
