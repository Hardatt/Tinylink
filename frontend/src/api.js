const envUrl = import.meta.env.VITE_BACKEND_URL?.trim();

export const API = envUrl?.replace(/\/$/, "") || window.location.origin;
