import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Logo from "./Logo.png"; // 

const API_URL = "http://localhost:5050";

const Login = () => {
  const navigate = useNavigate();
  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${API_URL}/login`, { cpf, senha });
      const usuario = response.data;
      const tipo = usuario.tipo;

      if (!tipo) {
        setErro("Tipo de usuário não reconhecido.");
        return;
      }

      localStorage.setItem("usuarioLogado", JSON.stringify(usuario));
      localStorage.setItem("tipoUsuario", tipo);

      switch (tipo) {
        case "associado":
          navigate("/associado");
          break;
        case "admin":
          navigate("/admin");
          break;
        case "operador":
          navigate("/operador");
          break;
        default:
          setErro("Tipo de usuário não reconhecido.");
      }
    } catch (error) {
      setErro(error.response?.data?.mensagem || "Erro ao fazer login");
    }
  };

  return (
    <div style={containerStyle}>
      <div style={loginBoxStyle}>
        {/* Lado esquerdo - logo */}
        <div style={leftPanelStyle}>
          <img src={Logo} alt="Logo SAGRI" style={logoStyle} />
        </div>

        {/* Lado direito - formulário */}
        <div style={rightPanelStyle}>
          <h2 style={titleStyle}>Bem vindo!</h2>

          <form onSubmit={handleLogin} style={formStyle}>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>CPF</label>
              <input
                type="text"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                required
                style={inputStyle}
              />
            </div>

            <div style={inputGroupStyle}>
              <label style={labelStyle}>SENHA</label>
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                style={inputStyle}
              />
            </div>

            {erro && <p style={errorStyle}>{erro}</p>}

            <button type="submit" style={buttonStyle}>
              Entrar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

/* --- ESTILOS --- */
const containerStyle = {
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#E9F8E3",
  fontFamily: "Inter, sans-serif",
};

const loginBoxStyle = {
  display: "flex",
  width: "720px",
  height: "380px",
  borderRadius: "8px",
  overflow: "hidden",
  boxShadow: "0 0 10px rgba(0,0,0,0.1)",
};

const leftPanelStyle = {
  flex: 1,
  backgroundColor: "#1D3B29",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
};

const logoStyle = {
  width: "90px",
  height: "auto",
  filter: "brightness(0) invert(1)", // deixa o logo branco, igual ao da navbar
};

const rightPanelStyle = {
  flex: 1.8,
  backgroundColor: "#DDF3D4",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  padding: "0 40px",
};

const titleStyle = {
  color: "#1D3B29",
  fontWeight: "700",
  fontSize: "24px",
  marginBottom: "25px",
  textAlign: "center",
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "15px",
};

const inputGroupStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "4px",
};

const labelStyle = {
  fontSize: "12px",
  color: "#1D3B29",
  fontWeight: "600",
};

const inputStyle = {
  backgroundColor: "#CDE7C4",
  border: "none",
  borderRadius: "4px",
  padding: "10px",
  outline: "none",
  fontSize: "14px",
};

const buttonStyle = {
  marginTop: "10px",
  backgroundColor: "#1D3B29",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  padding: "10px",
  fontWeight: "bold",
  cursor: "pointer",
  transition: "background 0.3s",
};

const errorStyle = {
  color: "red",
  fontSize: "13px",
  textAlign: "center",
};

export default Login;
