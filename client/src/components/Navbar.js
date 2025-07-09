import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle";
import { NavLink } from "react-router-dom";
import Logo from "./Logo.png";

export default function Navbar() {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const linkStyle = ({ isActive }) => ({
        color: "white",
        borderBottom: isActive ? "3px solid #81c58d" : "none",
        paddingBottom: "2px",
        transition: "border-bottom 0.3s",
    });

    const dropdownToggleStyle = {
        backgroundColor: "#1A381F",
        color: "white",
        borderRadius: "5px",
        padding: "8px 12px",
        cursor: "pointer",
        fontWeight: "normal",
        border: "none",
        userSelect: "none",
        display: "flex",
        alignItems: "center",      
        lineHeight: "1.5",   
    };

    const dropdownMenuStyle = {
        backgroundColor: dropdownOpen ? "#FFF" : "#daf4d0",
        borderRadius: "3px",
        marginTop: "0",
        minWidth: "160px",
    };

    const dropdownItemStyle = ({ isActive }) => ({
        color: isActive ? "#1A381F" : "#000",
        backgroundColor: isActive ? "#daf4d0" : "transparent",
        padding: "10px 20px",
        textDecoration: "none",
        transition: "background-color 0.3s, color 0.3s",
    });

    return (
        <>
            <style>{`
        .dropdown-toggle::after {
          display: none !important;
        }
        .dropdown-item:hover {
          background-color: #daf4d0 !important;
        }
      `}</style>

            <nav
                className="navbar navbar-expand-lg"
                style={{
                    backgroundColor: "#1A381F",
                    padding: "0 20px",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.4)",
                }}
            >
                <NavLink className="navbar-brand" to="/">
                    <img style={{ width: "55px" }} src={Logo} alt="Logo do IFC" />
                </NavLink>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent"
                    aria-controls="navbarSupportedContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul
                        className="navbar-nav me-auto mb-2 mb-lg-0"
                        style={{ gap: "8px", display: "flex" }}
                    >
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/" style={linkStyle}>
                                Início
                            </NavLink>
                        </li>

                        <li className="nav-item">
                            <NavLink className="nav-link" to="/associados" style={linkStyle}>
                                Associados
                            </NavLink>
                        </li>

                        <li className="nav-item">
                            <NavLink className="nav-link" to="/operadores" style={linkStyle}>
                                Operadores
                            </NavLink>
                        </li>

                        <li
                            className={`nav-item dropdown${dropdownOpen ? " show" : ""}`}
                            onMouseEnter={() => setDropdownOpen(true)}
                            onMouseLeave={() => setDropdownOpen(false)}
                        >
                            <span
                                className="nav-link dropdown-toggle"
                                role="button"
                                data-bs-toggle="dropdown"
                                aria-expanded={dropdownOpen}
                                style={dropdownToggleStyle}
                            >
                                Equipamentos
                            </span>
                            <ul
                                className={`dropdown-menu${dropdownOpen ? " show" : ""}`}
                                style={dropdownMenuStyle}
                            >
                                <li>
                                    <NavLink
                                        to="/maquinas"
                                        className="dropdown-item"
                                        style={dropdownItemStyle}
                                    >
                                        Máquinas
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        to="/implementos"
                                        className="dropdown-item"
                                        style={dropdownItemStyle}
                                    >
                                        Implementos
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        to="/servicos"
                                        className="dropdown-item"
                                        style={dropdownItemStyle}
                                    >
                                        Serviços
                                    </NavLink>
                                </li>
                            </ul>
                        </li>

                        <li className="nav-item">
                            <NavLink className="nav-link" to="/agendamentos" style={linkStyle}>
                                Agendamentos
                            </NavLink>
                        </li>

                    </ul>
                </div>
            </nav>
        </>
    );
}
