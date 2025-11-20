# 🔗 TinyLink — URL Shortener (Full-Stack Project)

TinyLink is a full-stack URL shortening service built with **Node.js**, **Express**, **Neon Postgres**, **React**, **Vite**, and **Tailwind CSS**.  
It allows users to generate short links, track clicks, view analytics, and delete links.  
This project follows the full assignment specs from the TinyLink Take-Home Challenge.

---

## 🚀 Live Demo

### 🔹 Frontend (Vercel)  
👉 https://tinylink-six-self.vercel.app/

### 🔹 Backend (Render)  
👉 https://tinylink-8qmy.onrender.com

### 🔹 Healthcheck  
👉 https://tinylink-8qmy.onrender.com/healthz  
Returns:
```json
{ "ok": true, "version": "1.0" }

*** example .env

(frontend)
VITE_BACKEND_URL= www.exampleurlofbackend.com

(backend)
DATABASE_URL= www.postgresaqlneondbconnectionstring.com
PORT= 5000