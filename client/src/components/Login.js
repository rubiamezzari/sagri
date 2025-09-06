import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
    <div style={pageStyle}>
      <div style={loginBoxStyle}>
        {/* Lado esquerdo com logo */}
        <div style={leftPanelStyle}>
          <h2 style={{ color: "#fff" }}>SAGRI</h2>
          {/* Aqui pode trocar pelo <img src="logo.png" /> */}
        </div>

        {/* Lado direito com formulário */}
        <div style={rightPanelStyle}>
          <h2 style={titleStyle}>Bem vindo!</h2>
          <form onSubmit={handleLogin}>
            <div style={formGroupStyle}>
              <label style={labelStyle}>CPF</label>
              <input
                type="text"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                required
                style={inputStyle}
              />
            </div>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Senha</label>
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                style={inputStyle}
              />
            </div>
            {erro && <p style={{ color: "red" }}>{erro}</p>}
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
const pageStyle = {
  backgroundColor: "#F0FCEB", // fundo verdinho
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const loginBoxStyle = {
  display: "flex",
  width: "800px",
  borderRadius: "6px",
  overflow: "hidden",
  boxShadow: "0 0 15px rgba(0,0,0,0.1)",
};

const leftPanelStyle = {
  backgroundColor: "#1D3B29", // verde escuro
  flex: 1,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
};

const rightPanelStyle = {
  backgroundColor: "#DDF3D4", // verde clarinho
  flex: 2,
  padding: "40px",
};

const titleStyle = {
  fontSize: "28px",
  fontWeight: "bold",
  color: "#1D3B29",
  marginBottom: "30px",
};

const formGroupStyle = {
  marginBottom: "20px",
  display: "flex",
  flexDirection: "column",
};

const labelStyle = {
  marginBottom: "6px",
  fontSize: "14px",
  color: "#1D3B29",
};

const inputStyle = {
  padding: "12px",
  borderRadius: "4px",
  border: "none",
  backgroundColor: "#CDE7C4",
  outline: "none",
};

const buttonStyle = {
  width: "100%",
  padding: "12px",
  border: "none",
  borderRadius: "4px",
  backgroundColor: "#1D3B29",
  color: "#fff",
  fontSize: "16px",
  cursor: "pointer",
  marginTop: "10px",
};

export default Login;
