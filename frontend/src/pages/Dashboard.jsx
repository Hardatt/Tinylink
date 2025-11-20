import React, { useCallback, useEffect, useState } from "react";
import AddLinkForm from "../components/AddLinkForm";
import LinksTable from "../components/LinksTable";
import { API } from "../api";

export default function Dashboard(){
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadLinks = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API}/api/links`);
      if (!res.ok) throw new Error("Failed to load links");
      const json = await res.json();
      setLinks(json);
    } catch (err) {
      console.error(err);
      setError("Failed to load links");
      setLinks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLinks();
  }, [loadLinks]);

  const statusRow = !links.length && !loading
    ? {
      type: "status",
      intent: error ? "error" : "muted",
      message: error || "No links created yet"
    }
    : null;

  return (
    <section className="dashboard-section">
      <header className="section-header">
        <p className="section-eyebrow">Tinylink</p>
        <h1 className="section-title">Dashboard</h1>
        <p className="section-subtitle">Create short links and keep an eye on their performance.</p>
      </header>

      <div className="card">
        <AddLinkForm onCreated={loadLinks} />
      </div>

      <div className="card card-table">
        <div className="card-heading">
          <h3>Latest Links</h3>
        </div>

        {loading ? (
          <div className="table-placeholder">Loading links…</div>
        ) : (
          <LinksTable items={links} reload={loadLinks} status={statusRow} />
        )}

        {error && (
          <div className="status-banner error">
            {error}
          </div>
        )}
      </div>
    </section>
  );
}
