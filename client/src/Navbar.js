import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle";
import { NavLink } from "react-router-dom";
import Logo from "./Logo.png";
import { FaUserCircle, FaBell } from "react-icons/fa";

export default function Navbar() { 
    const linkStyle = ({ isActive }) => ({
        color: "white",
        borderBottom: isActive ? "3px solid #66bb6a" : "none",
        paddingBottom: "2px",
        transition: "border-bottom 0.3s",
    });

    return (
        <div>
            <nav
                className="navbar navbar-expand-lg"
                style={{
                    backgroundColor: "#1c3d21", 
                    padding: "0px 20px",   
                    boxShadow: "0 2px 5px rgba(0,0,0,0.4)",
                }}
            >
                <NavLink className="navbar-brand" to="/">
                    <img
                        style={{ width: "55px" }} 
                        src={Logo}
                        alt="Logo do IFC"
                    />
                </NavLink>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div
                    className="collapse navbar-collapse"
                    id="navbarSupportedContent"
                >
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
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

                        <li className="nav-item">
                            <NavLink className="nav-link" to="/maquinas" style={linkStyle}>
                                Máquinas
                            </NavLink>
                        </li>

                        <li className="nav-item">
                            <NavLink className="nav-link" to="/implementos" style={linkStyle}>
                                Implementos
                            </NavLink>
                        </li>

                        <li className="nav-item">
                            <NavLink className="nav-link" to="/agendamentos" style={linkStyle}>
                                Agendamentos
                            </NavLink>
                        </li>
                    </ul>

                    <div className="d-flex">
                        <NavLink
                            className="nav-link"
                            to="/notificacoes"
                            style={{ color: "white", marginRight: "1rem" }}
                        >
                            <FaBell size={18} />
                        </NavLink>

                        <NavLink
                            className="nav-link"
                            to="/perfil"
                            style={{ color: "white" }}
                        >
                            <FaUserCircle size={20} />
                        </NavLink>
                    </div>
                </div>
            </nav>
        </div>
    );
}
