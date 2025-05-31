import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const REACT_APP_YOUR_HOSTNAME = "http://localhost:5050";

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
  textAlign: "center",
};

const labelStyle = {
  display: "block",
  marginBottom: "4px",
  fontWeight: "600",
  color: "#100f0d",
  fontSize: "0.8rem",
  textAlign: "left",
  marginTop: "8px",
};

const inputStyle = {
  width: "100%",
  padding: "4px 6px",
  marginBottom: "12px",
  borderRadius: "5px",
  border: "0.1px solid #e8e8e8",
  fontSize: "0.9rem",
  boxSizing: "border-box",
  transition: "border-color 0.3s",
  maxWidth: "100%",
};

const inputFocus = {
  borderColor: "#1c3d21",
  outline: "none",
};

const uploadContainerStyle = {
  backgroundColor: "#eeffe7",
  borderRadius: "8px",
  padding: "8px 10px",
  marginBottom: "10px",
  display: "flex",
  alignItems: "center",
  gap: "12px",
  justifyContent: "flex-start",
};

const uploadLabelStyle = {
  backgroundColor: "#ccedbf",
  padding: "6px 12px",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "0.85rem",
  fontWeight: "500",
  color: "#1c3d21",
  whiteSpace: "nowrap",
};

export default function CreateOperador() {
  const [form, setForm] = useState({
    nome: "",
    email: "",
    telefone: "",
    cpf: "",
    senha: "",
    foto: null,
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

      const formData = new FormData();
      formData.append("nome", form.nome);
      formData.append("email", form.email);
      formData.append("telefone", telefoneFormatado);
      formData.append("cpf", cpfFormatado);
      formData.append("senha", form.senha);

      if (form.foto) {
        formData.append("foto", form.foto);
      }

      const response = await fetch(
        `${REACT_APP_YOUR_HOSTNAME}/operadores/create`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const message = `Erro: ${response.statusText}`;
        window.alert(message);
        return;
      }

      setForm({
        nome: "",
        email: "",
        telefone: "",
        cpf: "",
        senha: "",
        foto: null,
      });

      navigate("/operadores");
    } catch (error) {
      window.alert("Erro no envio: " + error.message);
    }
  }

  function getInputStyle(name) {
    return focusField === name ? { ...inputStyle, ...inputFocus } : inputStyle;
  }

  const getBtnCadastrarStyle = (hover) => ({
    backgroundColor: hover ? "#143018" : "#1c3d21",
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
    backgroundColor: hover ? "#ccedbf" : "#daf4d0",
    color: "#86a479",
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

  return (
    <div style={containerStyle}>
      <form onSubmit={onSubmit}>
        <h5 style={sectionTitle}>DADOS DO OPERADOR</h5>

        <label style={labelStyle} htmlFor="nome">Nome</label>
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

        <label style={labelStyle} htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          style={getInputStyle("email")}
          value={form.email}
          onChange={(e) => updateForm({ email: e.target.value })}
          onFocus={() => setFocusField("email")}
          onBlur={() => setFocusField(null)}
          required
        />

        <label style={labelStyle} htmlFor="telefone">Telefone</label>
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

        <label style={labelStyle} htmlFor="cpf">CPF</label>
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

        <label style={labelStyle} htmlFor="senha">Senha</label>
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

        <h5 style={sectionTitle}>FOTO DO OPERADOR</h5>

        <div style={uploadContainerStyle}>
          <label htmlFor="foto" style={uploadLabelStyle}>
            {form.foto ? "Foto selecionada" : "Selecionar Foto"}
          </label>
          <input
            type="file"
            id="foto"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                updateForm({ foto: file });
              }
            }}
          />
        </div>

        {form.foto && (
          <div style={{ textAlign: "left", marginBottom: "20px" }}>
            <img
              src={URL.createObjectURL(form.foto)}
              alt="Foto selecionada"
              style={{ maxWidth: "200px", borderRadius: "5px" }}
            />
          </div>
        )}

        <div style={{ marginTop: "30px", display: "flex", justifyContent: "center" }}>
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
            style={getBtnCancelarStyle(hoverCancelar)}
            onClick={() => navigate("/operadores")}
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
