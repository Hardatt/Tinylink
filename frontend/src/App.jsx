import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Stats from "./pages/Stats";
import Healthcheck from "./pages/Healthcheck";

export default function App(){
  return (
    <BrowserRouter>
      <div className="app-shell">
        <Navbar />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/healthz" element={<Healthcheck />} />
            <Route path="/code/:code" element={<Stats />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
