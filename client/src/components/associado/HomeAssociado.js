import React from "react";
import { NavLink } from "react-router-dom";

export default function HomeAssociado() {
    const nomeUsuario = localStorage.getItem("nomeUsuario") || "Associado"; 

    const containerStyle = {
        maxWidth: "900px",
        margin: "40px auto",
        padding: "20px",
        textAlign: "center",
        fontFamily: '"Inter", sans-serif',
    };

    const titleStyle = {
        fontSize: "28px",
        fontWeight: "600",
        marginBottom: "10px",
        color: "#1B4D3E",
    };

    const subtitleStyle = {
        fontSize: "16px",
        color: "#555",
        marginBottom: "30px",
    };

    const cardContainer = {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "20px",
    };

    const cardStyle = {
        padding: "20px",
        backgroundColor: "#fff",
        borderRadius: "10px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        transition: "transform 0.2s ease",
        textDecoration: "none",
        color: "#1B4D3E",
        fontWeight: "500",
    };

    const cardHover = {
        transform: "scale(1.02)",
    };

    return (
        <div style={containerStyle}>
            <h1 style={titleStyle}>Bem-vindo, {nomeUsuario}!</h1>
            <p style={subtitleStyle}>
                Aqui você pode criar novas solicitações e acompanhar o status das suas existentes.
            </p>

            <div style={cardContainer}>
                <NavLink
                    to="/solicitacoes/list"
                    style={({ isActive }) => ({
                        ...cardStyle,
                        ...(isActive ? cardHover : {})
                    })}
                >
                    Minhas Solicitações
                </NavLink>

                <NavLink
                    to="/solicitacoes/create"
                    style={({ isActive }) => ({
                        ...cardStyle,
                        ...(isActive ? cardHover : {})
                    })}
                >
                    + Criar Nova Solicitação
                </NavLink>
            </div>
        </div>
    );
}
