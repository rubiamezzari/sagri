import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

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
  borderColor: "#e8e8e8",
  outline: "none",
};

const btnCadastrar = {
  backgroundColor: "#1c3d21",
  color: "#daf4d0",
  padding: "8px 10px",
  borderRadius: "5px",
  border: "none",
  cursor: "pointer",
  fontWeight: "500",
  fontSize: "1.1rem",
  width: "30%",
  marginTop: "10px",
  transition: "background-color 0.3s",
};

const uploadContainerStyle = {
  backgroundColor: "#eeffe7",
  borderRadius: "8px",
  padding: "8px 10px",
  marginBottom: "10px",
  display: "flex",
  alignItems: "center",
  gap: "12px",
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


export default function EditAssociado() {
  const [form, setForm] = useState({
    nome: "",
    email: "",
    telefone: "",
    cpf: "",
    senha: "",
    data_associacao: "",
    endereco: {
      rua: "",
      numero: "",
      complemento: "",
      bairro: "",
      cidade: "",
      uf: "",
      cep: "",
    },
    documentos: {
      anuidade: "",
      caf: "",
    },
  });

  const [focusField, setFocusField] = useState(null);

  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(`${REACT_APP_YOUR_HOSTNAME}/associados/${params.id}`);
      if (!response.ok) {
        window.alert("Erro ao buscar associado.");
        navigate("/associados");
        return;
      }
      const associado = await response.json();
      setForm(associado);
    }

    fetchData();
  }, [params.id, navigate]);

  function updateForm(value) {
    setForm((prev) => ({ ...prev, ...value }));
  }

  function updateEndereco(value) {
    setForm((prev) => ({
      ...prev,
      endereco: { ...prev.endereco, ...value },
    }));
  }

  function updateDocumentos(value) {
    setForm((prev) => ({
      ...prev,
      documentos: { ...prev.documentos, ...value },
    }));
  }


  async function onSubmit(e) {
    e.preventDefault();
    const response = await fetch(`${REACT_APP_YOUR_HOSTNAME}/associados/update/${params.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!response.ok) {
      console.log(response.ok)
      window.alert("Erro ao atualizar associado.");
      return;
    }

    navigate("/associados");
  }

  function getInputStyle(name) {
    return focusField === name ? { ...inputStyle, ...inputFocus } : inputStyle;
  }

  return (
    <div style={containerStyle}>
      <form onSubmit={onSubmit}>
        <h5 style={sectionTitle}>DADOS DO ASSOCIADO</h5>

        <label style={labelStyle}>Nome</label>
        <input
          type="text"
          style={getInputStyle("nome")}
          value={form.nome}
          onChange={(e) => updateForm({ nome: e.target.value })}
          onFocus={() => setFocusField("nome")}
          onBlur={() => setFocusField(null)}
        />

        <label style={labelStyle}>Email</label>
        <input
          type="email"
          style={getInputStyle("email")}
          value={form.email}
          onChange={(e) => updateForm({ email: e.target.value })}
          onFocus={() => setFocusField("email")}
          onBlur={() => setFocusField(null)}
        />

        <label style={labelStyle}>telefone</label>
        <input
          type="text"
          style={getInputStyle("telefone")}
          value={form.telefone}
          onChange={(e) => updateForm({ telefone: e.target.value })}
          onFocus={() => setFocusField("telefone")}
          onBlur={() => setFocusField(null)}
        />

        <label style={labelStyle}>CPF</label>
        <input
          type="text"
          style={getInputStyle("cpf")}
          value={form.cpf}
          onChange={(e) => updateForm({ cpf: e.target.value })}
          onFocus={() => setFocusField("cpf")}
          onBlur={() => setFocusField(null)}
        />

        <label style={labelStyle}>Senha</label>
        <input
          type="password"
          style={getInputStyle("senha")}
          value={form.senha}
          onChange={(e) => updateForm({ senha: e.target.value })}
          onFocus={() => setFocusField("senha")}
          onBlur={() => setFocusField(null)}
        />

        <label style={labelStyle}>Data de Associação</label>
        <input
          type="date"
          style={getInputStyle("data_associacao")}
          value={form.data_associacao}
          onChange={(e) => updateForm({ data_associacao: e.target.value })}
          onFocus={() => setFocusField("data_associacao")}
          onBlur={() => setFocusField(null)}
        />

        <h5 style={sectionTitle}>ENDEREÇO</h5>

        <label style={labelStyle} htmlFor="rua">
          Rua
        </label>
        <input
          id="rua"
          type="text"
          style={getInputStyle("rua")}
          value={form.endereco.rua}
          onChange={(e) => updateEndereco({ rua: e.target.value })}
          onFocus={() => setFocusField("rua")}
          onBlur={() => setFocusField(null)}
          required
        />

        <label style={labelStyle} htmlFor="numero">
          Número
        </label>
        <input
          id="numero"
          type="text"
          style={getInputStyle("numero")}
          value={form.endereco.numero}
          onChange={(e) => updateEndereco({ numero: e.target.value })}
          onFocus={() => setFocusField("numero")}
          onBlur={() => setFocusField(null)}
          required
        />

        <label style={labelStyle} htmlFor="complemento">
          Complemento
        </label>
        <input
          id="complemento"
          type="text"
          style={getInputStyle("complemento")}
          value={form.endereco.complemento}
          onChange={(e) => updateEndereco({ complemento: e.target.value })}
          onFocus={() => setFocusField("complemento")}
          onBlur={() => setFocusField(null)}
        />

        <label style={labelStyle} htmlFor="bairro">
          Bairro
        </label>
        <input
          id="bairro"
          type="text"
          style={getInputStyle("bairro")}
          value={form.endereco.bairro}
          onChange={(e) => updateEndereco({ bairro: e.target.value })}
          onFocus={() => setFocusField("bairro")}
          onBlur={() => setFocusField(null)}
          required
        />

        <label style={labelStyle} htmlFor="cidade">
          Cidade
        </label>
        <input
          id="cidade"
          type="text"
          style={getInputStyle("cidade")}
          value={form.endereco.cidade}
          onChange={(e) => updateEndereco({ cidade: e.target.value })}
          onFocus={() => setFocusField("cidade")}
          onBlur={() => setFocusField(null)}
          required
        />

        <label style={labelStyle} htmlFor="uf">
          UF
        </label>
        <select
          id="uf"
          style={getInputStyle("uf")}
          value={form.endereco.uf}
          onChange={(e) => updateEndereco({ uf: e.target.value })}
          onFocus={() => setFocusField("uf")}
          onBlur={() => setFocusField(null)}
          required
        >
          <option value=""></option>
          <option value="PR">PR</option>
          <option value="RS">RS</option>
          <option value="SC">SC</option>

        </select>

        <label style={labelStyle} htmlFor="cep">
          CEP
        </label>
        <input
          id="cep"
          type="text"
          style={getInputStyle("cep")}
          value={form.endereco.cep}
          onChange={(e) => updateEndereco({ cep: e.target.value })}
          onFocus={() => setFocusField("cep")}
          onBlur={() => setFocusField(null)}
          required
        />



        <h5 style={sectionTitle}>DOCUMENTOS</h5>

        <div style={uploadContainerStyle}>
          <label htmlFor="anuidade" style={uploadLabelStyle}>
            {form.documentos.anuidade
              ? "Anuidade: " + form.documentos.anuidade.name
              : "Selecionar Anuidade"}
          </label>
          <input
            type="file"
            id="anuidade"
            accept=".pdf,image/*"
            style={{ display: "none" }}
            onChange={(e) =>
              updateDocumentos({ anuidade: e.target.files[0] || null })
            }
          />
        </div>

        <div style={uploadContainerStyle}>
          <label htmlFor="caf" style={uploadLabelStyle}>
            {form.documentos.caf
              ? "CAF: " + form.documentos.caf
              : "Selecionar CAF"}
          </label>
          <input
            type="file"
            id="caf"
            accept=".pdf,image/*"
            style={{ display: "none" }}
            onChange={(e) => updateDocumentos({ caf: e.target.files[0] || null })}
          />
        </div>
        <button type="submit" style={btnCadastrar}>
          Salvar
        </button>
        <button
          type="button"
          onClick={() => navigate("/associados")}
          style={{ ...btnCadastrar, backgroundColor: "#daf4d0", marginLeft: "10px", color: "#86a479" }}
        >
          Cancelar
        </button>
      </form>
    </div>
  );
}
