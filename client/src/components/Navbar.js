import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle";
import { NavLink } from "react-router-dom";
import Logo from "./Logo.png";

export default function Navbar() {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const baseStyle = {
        fontFamily: '"Inter", sans-serif',
        fontWeight: 500,
        textTransform: "uppercase",
        letterSpacing: "0.5px",
        fontSize: "13px",
        color: "#fff",
        textDecoration: "none",
        transition: "color 0.3s ease",
    };

    const linkStyle = ({ isActive }) => ({
        ...baseStyle,
        color: isActive ? "#fff" : baseStyle.color,
    });

    const dropdownToggleStyle = {
        ...baseStyle,
        background: "none",
        border: "none",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: "4px",
        padding: "4px 0",
    };

    const dropdownMenuStyle = {
        backgroundColor: "#fff",
        borderRadius: "4px",
        boxShadow: "0 4px 6px rgba(0,0,0,0.08)",
        marginTop: "5px",
        minWidth: "160px",
        padding: "6px 0",
    };

    const dropdownItemStyle = ({ isActive }) => ({
        ...baseStyle,
        padding: "6px 16px",
        color: isActive ? "#2f755e" : "#444",
        backgroundColor: isActive ? "#f1f1f1" : "transparent",
        fontSize: "13px",
        display: "block",
    });

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500&display=swap');

                .dropdown-toggle::after {
                    display: none !important;
                }

                .dropdown-item:hover {
                    background-color: #f5f5f5 !important;
                    color: #2f755e !important;
                }

                .navbar-nav .nav-link {
                    padding: 4px 8px !important;
                }
            `}</style>

            <nav
                className="navbar navbar-expand-lg"
                style={{
                    backgroundColor: "#1B4D3E",
                    padding: "2px 20px",
                    boxShadow: "0 1px 1px rgba(136, 136, 136, 0.2)",
                }}
            >
                <NavLink className="navbar-brand" to="/">
                    <img style={{ width: "45px" }} src={Logo} alt="Logo" />
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
                        style={{ gap: "14px", display: "flex", alignItems: "center" }}
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
                            <button
                                className="nav-link dropdown-toggle"
                                role="button"
                                style={dropdownToggleStyle}
                            >
                                Equipamentos <span style={{ fontSize: "10px" }}>▼</span>
                            </button>
                            <ul
                                className={`dropdown-menu${dropdownOpen ? " show" : ""}`}
                                style={dropdownMenuStyle}
                            >
                                <li>
                                    <NavLink to="/maquinas" className="dropdown-item" style={dropdownItemStyle}>
                                        Máquinas
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/implementos" className="dropdown-item" style={dropdownItemStyle}>
                                        Implementos
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/servicos" className="dropdown-item" style={dropdownItemStyle}>
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
