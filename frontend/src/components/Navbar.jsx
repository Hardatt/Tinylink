import React from "react";
import { NavLink } from "react-router-dom";

const navLinks = [
  { label: "Redirect", href: "/" },
  { label: "Healthcheck", href: "/healthz" }
];

export default function Navbar(){
  return (
    <header className="navbar">
      <div className="navbar-content">
        <span className="nav-brand">Tinylink</span>
        <nav className="nav-links">
          {navLinks.map(link => (
            <NavLink
              key={link.href}
              to={link.href}
              className={({ isActive }) => isActive ? "active" : undefined}
              end={link.href === "/"}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
