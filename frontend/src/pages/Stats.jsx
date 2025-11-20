import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { API } from "../api";

const formatDate = (value) => {
  if (!value) return "Never";
  const dt = new Date(value);
  if (Number.isNaN(dt.getTime())) return value;
  return dt.toLocaleString();
};

export default function Stats(){
  const { code } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${API}/api/links/${code}`);
        if (res.status === 404) {
          throw new Error("Short link not found.");
        }
        if (!res.ok) {
          throw new Error("Failed to load stats.");
        }
        const json = await res.json();
        if (active) setData(json);
      } catch (err) {
        if (active) setError(err.message || "Something went wrong.");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [code]);

  const shortUrl = `${API}/${code}`;

  return (
    <section className="dashboard-section">
      <header className="section-header">
        <p className="section-eyebrow">Insights</p>
        <h1 className="section-title">Stats Overview</h1>
        <p className="section-subtitle">Usage details for <strong>{code}</strong>.</p>
      </header>

      <div className="card">
        {loading && (
          <div className="table-placeholder">Loading stats…</div>
        )}

        {!loading && error && (
          <div className="empty-state">
            <p>{error}</p>
            <Link to="/" className="btn-primary">Back to dashboard</Link>
          </div>
        )}

        {!loading && !error && data && (
          <div className="stats-content">
            <div className="stat-bar">
              Created <span>{formatDate(data.created_at)}</span>
            </div>

            <div className="stat-block">
              <p className="stat-label">Short URL</p>
              <div className="stat-link-row">
                <a href={shortUrl} target="_blank" rel="noreferrer" className="link-strong">
                  {shortUrl}
                </a>
                <button type="button" className="btn-secondary" onClick={() => navigator.clipboard.writeText(shortUrl)}>
                  Copy
                </button>
              </div>
            </div>

            <div className="stat-block">
              <p className="stat-label">Original URL</p>
              <a href={data.url} target="_blank" rel="noreferrer" className="stat-url">
                {data.url}
              </a>
            </div>

            <div className="stat-grid">
              <StatHighlight label="Total Clicks" value={data.total_clicks} />
              <StatHighlight label="Last Clicked" value={formatDate(data.last_clicked)} />
              <StatHighlight label="Short Code" value={code} />
            </div>

            <div className="stat-actions">
              <Link to="/" className="btn-dark">Back to dashboard</Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function StatHighlight({ label, value }){
  return (
    <div className="stat-card">
      <p className="stat-card-label">{label}</p>
      <p className="stat-card-value">{value}</p>
    </div>
  );
}
