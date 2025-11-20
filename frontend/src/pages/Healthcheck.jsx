import React, { useEffect, useState } from "react";
import { API } from "../api";

export default function Healthcheck(){
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${API}/healthz`);
        if (!res.ok) throw new Error("Healthcheck failed");
        const json = await res.json();
        if (active) setData(json);
      } catch (err) {
        if (active) setError(err.message || "Unable to reach backend");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  return (
    <section className="dashboard-section">
      <header className="section-header">
        <p className="section-eyebrow">Tinylink</p>
        <h1 className="section-title">Healthcheck</h1>
        <p className="section-subtitle">Backend availability diagnostics.</p>
      </header>

      <div className="card">
        {loading && <div className="table-placeholder">Checking service status…</div>}

        {!loading && error && (
          <div className="status-banner error">
            {error}
          </div>
        )}

        {!loading && !error && data && (
          <div className="stats-content">
            <div className="stat-grid">
              <StatTile label="Status" value={data.ok ? "Online" : "Offline"} intent={data.ok ? "success" : "error"} />
              <StatTile label="Version" value={data.version || "n/a"} />
              <StatTile label="Timestamp" value={new Date().toLocaleString()} />
            </div>
            <pre className="health-json">{JSON.stringify(data, null, 2)}</pre>
          </div>
        )}
      </div>
    </section>
  );
}

function StatTile({ label, value, intent }){
  return (
    <div className={`stat-card ${intent || ""}`}>
      <p className="stat-card-label">{label}</p>
      <p className="stat-card-value">{value}</p>
    </div>
  );
}

