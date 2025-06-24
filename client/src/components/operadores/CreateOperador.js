import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5050";

const containerStyle = {
  maxWidth: "800px",
  margin: "40px auto",
  padding: "30px 40px",
  backgroundColor: "#ffffff",
  borderRadius: "5px",
  textAlign: "center",
};

const sectionTitle = {
  color: "#100f0d",
  marginBottom: "16px",
  fontWeight: "500",
  fontSize: "1rem",
  borderBottom: "0.5px solid rgb(131, 148, 131)",
  paddingBottom: "6px",
};

const labelStyle = {
  display: "block",
  marginBottom: "6px",
  fontWeight: "600",
  color: "#100f0d",
  fontSize: "0.8rem",
  textAlign: "left",
};

const inputStyle = {
  width: "100%",
  padding: "5px 6px",
  marginBottom: "10px",
  borderRadius: "5px",
  border: "0.1px solid #e8e8e8",
  fontSize: "1rem",
  boxSizing: "border-box",
  transition: "border-color 0.3s",
  maxWidth: "100%",
};

const inputFocus = {
  borderColor: "#1A381F",
  outline: "none",
};

const getBtnCadastrarStyle = (hover) => ({
  backgroundColor: hover ? "#143018" : "#1A381F",
  color: "#daf4d0",
  padding: "8px 10px",
  borderRadius: "5px",
  border: "none",
  cursor: "pointer",
  fontWeight: "500",
  fontSize: "1.1rem",
  width: "30%",
  transition: "background-color 0.3s",
});

const getBtnCancelarStyle = (hover) => ({
  backgroundColor: hover ? "#c7e5cc" : "#daf4d0",
  color: "#143018",
  padding: "8px 10px",
  borderRadius: "5px",
  border: "none",
  cursor: "pointer",
  fontWeight: "500",
  fontSize: "1.1rem",
  width: "30%",
  marginLeft: "20px",
  transition: "background-color 0.3s",
});

export default function CreateOperador() {
  const [form, setForm] = useState({
    nome: "",
    email: "",
    telefone: "",
    cpf: "",
    senha: "",
  });

  const [focusField, setFocusField] = useState(null);
  const [hoverCadastrar, setHoverCadastrar] = useState(false);
  const [hoverCancelar, setHoverCancelar] = useState(false);
  const navigate = useNavigate();

  function updateForm(value) {
    setForm((prev) => ({ ...prev, ...value }));
  }

  function formatarTelefone(telefone) {
    const numeros = telefone.replace(/\D/g, "");
    if (numeros.length === 11) {
      return numeros.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    }
    return telefone;
  }

  function formatarCPF(cpf) {
    const numeros = cpf.replace(/\D/g, "");
    if (numeros.length === 11) {
      return numeros.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    }
    return cpf;
  }

  async function onSubmit(e) {
    e.preventDefault();

    try {
      const telefoneFormatado = formatarTelefone(form.telefone);
      const cpfFormatado = formatarCPF(form.cpf);
      const response = await fetch(`${API_URL}/operadores/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          telefone: telefoneFormatado,
          cpf: cpfFormatado,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        alert("Erro ao cadastrar operador: " + errorText);
        return;
      }

      alert("Operador cadastrado com sucesso!");

      setForm({
        nome: "",
        email: "",
        telefone: "",
        cpf: "",
        senha: "",
      });

      navigate("/operadores", { replace: true });
    } catch (error) {
      alert("Erro na comunicação com o servidor.");
    }
  }

  function getInputStyle(name) {
    return focusField === name ? { ...inputStyle, ...inputFocus } : inputStyle;
  }

  return (
    <div style={containerStyle}>
      <form onSubmit={onSubmit}>
        <h5 style={sectionTitle}>DADOS DO OPERADOR</h5>

        <label style={labelStyle} htmlFor="nome">
          Nome
        </label>
        <input
          id="nome"
          type="text"
          style={getInputStyle("nome")}
          value={form.nome}
          onChange={(e) => updateForm({ nome: e.target.value })}
          onFocus={() => setFocusField("nome")}
          onBlur={() => setFocusField(null)}
          required
        />

        <label style={labelStyle} htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          style={getInputStyle("email")}
          value={form.email}
          onChange={(e) => updateForm({ email: e.target.value })}
          onFocus={() => setFocusField("email")}
          onBlur={() => setFocusField(null)}
        />

        <label style={labelStyle} htmlFor="telefone">
          Telefone
        </label>
        <input
          id="telefone"
          type="text"
          style={getInputStyle("telefone")}
          value={form.telefone}
          onChange={(e) => updateForm({ telefone: e.target.value })}
          onFocus={() => setFocusField("telefone")}
          onBlur={() => setFocusField(null)}
          required
        />

        <label style={labelStyle} htmlFor="cpf">
          CPF
        </label>
        <input
          id="cpf"
          type="text"
          style={getInputStyle("cpf")}
          value={form.cpf}
          onChange={(e) => updateForm({ cpf: e.target.value })}
          onFocus={() => setFocusField("cpf")}
          onBlur={() => setFocusField(null)}
          required
        />

        <label style={labelStyle} htmlFor="senha">
          Senha
        </label>
        <input
          id="senha"
          type="password"
          style={getInputStyle("senha")}
          value={form.senha}
          onChange={(e) => updateForm({ senha: e.target.value })}
          onFocus={() => setFocusField("senha")}
          onBlur={() => setFocusField(null)}
          required
        />

        <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
          <button
            type="submit"
            style={getBtnCadastrarStyle(hoverCadastrar)}
            onMouseEnter={() => setHoverCadastrar(true)}
            onMouseLeave={() => setHoverCadastrar(false)}
          >
            Cadastrar
          </button>
          <button
            type="button"
            onClick={() => navigate("/operadores")}
            style={getBtnCancelarStyle(hoverCancelar)}
            onMouseEnter={() => setHoverCancelar(true)}
            onMouseLeave={() => setHoverCancelar(false)}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
