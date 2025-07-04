import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "./Logo.png";

const containerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "100vh",
  backgroundColor: "#ffffff",
};

const cardStyle = {
  display: "flex",
  width: "700px",
  height: "400px",
  boxShadow: "0 0 10px rgba(0,0,0,0.1)",
  borderRadius: "8px",
  overflow: "hidden",
};

const leftStyle = {
  backgroundColor: "#1c3d21",
  width: "40%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "20px",
};

const logoStyle = {
  maxWidth: "100%",
  maxHeight: "120px",
};

const rightStyle = {
  backgroundColor: "#DFF2E0",
  width: "60%",
  padding: "30px 40px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
};

const titleStyle = {
  marginBottom: "20px",
  color: "#1c3d21",
  fontWeight: "bold",
  fontSize: "1.4rem",
};

const labelStyle = {
  display: "block",
  marginBottom: "6px",
  fontWeight: "600",
  color: "#1c3d21",
  fontSize: "0.85rem",
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  borderRadius: "5px",
  border: "1px solid #ccc",
  backgroundColor: "#E7F6E8",
  marginBottom: "15px",
  fontSize: "1rem",
};

const getBtnStyle = (hover) => ({
  width: "100%",
  padding: "10px",
  backgroundColor: hover ? "#143018" : "#1A381F",
  color: "#fff",
  border: "none",
  borderRadius: "5px",
  fontWeight: "600",
  fontSize: "1rem",
  cursor: "pointer",
  transition: "background-color 0.3s",
});

const API_URL = "http://localhost:5050";

export default function Login({ onLogin }) {
  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const [hover, setHover] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cpf, senha }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.mensagem || "Erro no login");
        return;
      }

      // Aqui salvamos só tipo e id, sem token
      localStorage.setItem("tipo", data.tipo);
      localStorage.setItem("id", data.id);

      onLogin(data.tipo);

      if (data.tipo === "administrador") {
        navigate("/");
      } else if (data.tipo === "operador") {
        navigate("/operadores");
      } else {
        navigate("/associados");
      }
    } catch (error) {
      setError("Erro na conexão com o servidor");
    }
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={leftStyle}>
          <img src={Logo} alt="Logo" style={logoStyle} />
        </div>
        <div style={rightStyle}>
          <h2 style={titleStyle}>Bem vindo!</h2>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <form onSubmit={handleSubmit}>
            <label style={labelStyle}>CPF</label>
            <input
              type="text"
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
              required
              style={inputStyle}
            />

            <label style={labelStyle}>SENHA</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              style={inputStyle}
            />

            <button
              type="submit"
              style={getBtnStyle(hover)}
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
            >
              Entrar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
