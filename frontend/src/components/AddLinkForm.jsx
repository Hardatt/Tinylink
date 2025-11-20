import React, { useState } from "react";
import { API } from "../api";

export default function AddLinkForm({ onCreated }){
  const [url, setUrl] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState("");

  const submit = async (e) => {
    e?.preventDefault();
    setErr("");
    if (!url.trim()) return setErr("Long URL is required");

    setLoading(true);
    try {
      const res = await fetch(`${API}/api/links`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, code })
      });
      if (res.status === 409) {
        setErr("Short code already exists");
        return;
      }
      if (!res.ok) {
        const body = await res.json().catch(()=>({}));
        setErr(body?.error || "Failed to create link");
        return;
      }
      setUrl("");
      setCode("");
      setSuccess("Short link created!");
      onCreated?.();
      setTimeout(() => setSuccess(""), 2500);
    } catch {
      setErr("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="form-stack">
      <h3 className="card-title">Create New Short Link</h3>

      <div className="input-group">
        <label htmlFor="long-url">Long URL</label>
        <input
          id="long-url"
          placeholder="Enter long URL"
          value={url}
          onChange={e=>setUrl(e.target.value)}
          className="input-control"
        />
      </div>

      <div className="input-group">
        <label htmlFor="short-code">Custom short code (optional)</label>
        <input
          id="short-code"
          placeholder="Choose something memorable"
          value={code}
          onChange={e=>setCode(e.target.value)}
          className="input-control"
        />
      </div>

      {err && <div className="form-error">{err}</div>}
      {success && <div className="form-success">{success}</div>}

      <div className="form-actions">
        <button
          type="submit"
          disabled={loading}
          className="btn-primary"
        >
          {loading ? "Creating…" : "Create Link"}
        </button>
      </div>
    </form>
  );
}
