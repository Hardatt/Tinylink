import React, { useEffect, useRef, useState } from "react";
import { API } from "../api";

const formatDate = (value) => {
  if (!value) return "Never";
  const dt = new Date(value);
  if (Number.isNaN(dt.getTime())) return value;
  return dt.toLocaleDateString(undefined, {
    month: "short",
    day: "2-digit",
    year: "numeric"
  });
};

export default function LinksTable({ items = [], reload = ()=>{}, status }){
  const [copiedCode, setCopiedCode] = useState("");
  const [deletingCode, setDeletingCode] = useState("");
  const [deletedCode, setDeletedCode] = useState("");
  const [notice, setNotice] = useState(null);
  const noticeTimer = useRef();

  useEffect(() => {
    return () => {
      clearTimeout(noticeTimer.current);
    };
  }, []);

  const showNotice = (message, intent = "muted") => {
    setNotice({ message, intent });
    if (noticeTimer.current) clearTimeout(noticeTimer.current);
    noticeTimer.current = setTimeout(() => setNotice(null), 2500);
  };

  const handleCopy = async (shortUrl, code) => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(""), 2000);
      showNotice("Short link copied!", "success");
    } catch {
      showNotice("Clipboard not available in this browser.", "error");
    }
  };

  const doDelete = async (code) => {
    if (!confirm(`Delete "${code}"?`)) return;
    setDeletingCode(code);
    try {
      const res = await fetch(`${API}/api/links/${code}`, { method: "DELETE" });
      if (!res.ok) throw new Error("failed");
      await reload();
      setDeletedCode(code);
      setTimeout(() => setDeletedCode(""), 2000);
      showNotice("Link deleted.", "success");
    } catch {
      showNotice("Failed to delete link. Try again.", "error");
    } finally {
      setDeletingCode("");
    }
  };

  const content = items.length ? items : (status ? [status] : []);

  return (
    <div className="table-wrapper">
      <table className="links-table">
        <thead>
          <tr>
            <th>Short URL</th>
            <th>Target URL</th>
            <th>Clicks</th>
            <th>Last Clicked</th>
            <th className="actions-col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {content.map(item => {
            if (item?.type === "status"){
              return (
                <tr key={item.message}>
                  <td colSpan={5} className={`table-status ${item.intent === "error" ? "error" : ""}`}>
                    {item.message}
                  </td>
                </tr>
              );
            }

            const shortUrl = `${API}/${item.code}`;
            return (
              <tr key={item.code}>
                <td>
                  <a href={shortUrl} target="_blank" rel="noreferrer" className="link-strong">
                    {shortUrl}
                  </a>
                </td>
                <td className="table-url">{item.url}</td>
                <td>{item.total_clicks}</td>
                <td>{formatDate(item.last_clicked)}</td>
                <td className="actions-col">
                  <div className="table-actions">
                    <button
                      type="button"
                      onClick={() => handleCopy(shortUrl, item.code)}
                      className="btn-secondary"
                      disabled={copiedCode === item.code}
                    >
                      {copiedCode === item.code ? "Copied!" : "Copy"}
                    </button>
                    <button
                      type="button"
                      onClick={() => doDelete(item.code)}
                      className="btn-danger icon-only"
                      disabled={deletingCode === item.code}
                      title="Delete"
                    >
                      {deletedCode === item.code ? (
                        <span>Deleted</span>
                      ) : deletingCode === item.code ? (
                        <span>Deleting…</span>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M8 6v12a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V6M10 11v6M14 11v6" />
                        </svg>
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {notice && <div className={`table-notice ${notice.intent}`}>{notice.message}</div>}
    </div>
  );
}
