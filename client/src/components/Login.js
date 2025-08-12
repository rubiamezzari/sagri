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
      const response = await axios.post(`${API_URL}/login`, {
        cpf,
        senha,
      });

      const { usuario, tipo, token } = response.data;

      // Salva os dados no localStorage
      localStorage.setItem("usuarioLogado", JSON.stringify(usuario));
      localStorage.setItem("tipoUsuario", tipo);
      if (token) {
        localStorage.setItem("token", token);
      }

      // Redireciona conforme o tipo de usuário
      switch (tipo) {
        case "associado":
          navigate("/associado");
          break;
        case "administrador":
          navigate("/");
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
      <h2 style={titleStyle}>Login</h2>
      <form onSubmit={handleLogin}>
        <div style={formGroupStyle}>
          <label>CPF:</label>
          <input
            type="text"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
            required
            style={inputStyle}
          />
        </div>
        <div style={formGroupStyle}>
          <label>Senha:</label>
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            style={inputStyle}
          />
        </div>
        {erro && <p style={{ color: "red" }}>{erro}</p>}
        <button type="submit" style={buttonStyle}>Entrar</button>
      </form>
    </div>
  );
};

const containerStyle = {
  maxWidth: "400px",
  margin: "80px auto",
  padding: "30px",
  backgroundColor: "#ffffff",
  borderRadius: "8px",
  boxShadow: "0 0 10px rgba(0,0,0,0.1)",
  textAlign: "center",
};

const titleStyle = {
  fontSize: "24px",
  marginBottom: "20px",
};

const formGroupStyle = {
  marginBottom: "15px",
  textAlign: "left",
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  borderRadius: "4px",
  border: "1px solid #ccc",
};

const buttonStyle = {
  padding: "10px 20px",
  border: "none",
  backgroundColor: "#4CAF50",
  color: "#fff",
  fontSize: "16px",
  borderRadius: "4px",
  cursor: "pointer",
};

export default Login;
