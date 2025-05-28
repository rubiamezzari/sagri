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

const btnCancelar = {
  backgroundColor: "#daf4d0",
  color: "#86a479",
  padding: "8px 10px",
  borderRadius: "5px",
  border: "none",
  cursor: "pointer",
  fontWeight: "500",
  fontSize: "1.1rem",
  width: "30%",
  marginTop: "10px",
  marginLeft: "20px",
  transition: "background-color 0.3s",
};

export default function CreateAssociado() {
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
      anuidade: null,
      caf: null,
    },
  });

  const [focusField, setFocusField] = useState(null);

  const navigate = useNavigate();

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

    try {
      const formData = new FormData();

      // O resto dos dados (menos arquivos) vira JSON e vai como string no campo 'data'
      const formCopy = { ...form, documentos: { anuidade: null, caf: null } };
      // tirando arquivos do JSON porque vão separados

      formData.append("dados", JSON.stringify(formCopy));

      // Se tiver arquivos, adiciona no formData com os nomes dos campos
      if (form.documentos.anuidade) {
        formData.append("anuidade", form.documentos.anuidade);
      }
      if (form.documentos.caf) {
        formData.append("caf", form.documentos.caf);
      }

      const response = await fetch(
        `${REACT_APP_YOUR_HOSTNAME}/associados/create`,
        {
          method: "POST",
          body: formData, // multipart/form-data automático com FormData
        }
      );

      if (!response.ok) {
        const message = `Erro: ${response.statusText}`;
        window.alert(message);
        return;
      }

      // limpa form após sucesso
      setForm({
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
          anuidade: null,
          caf: null,
        },
      });

      navigate("/associados");
    } catch (error) {
      window.alert("Erro no envio: " + error.message);
    }
  }

  function getInputStyle(name) {
    return focusField === name ? { ...inputStyle, ...inputFocus } : inputStyle;
  }

  // Estilo para o "container" dos uploads, igual ao que você enviou
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

  const fileNameStyle = {
    fontSize: "0.85rem",
    color: "#000",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  };

  return (
    <div style={containerStyle}>
      <form onSubmit={onSubmit}>
        <h5 style={sectionTitle}>DADOS PESSOAIS</h5>

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
          required
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

        <label style={labelStyle} htmlFor="data_associacao">
          Data de Associação
        </label>
        <input
          id="data_associacao"
          type="date"
          style={getInputStyle("data_associacao")}
          value={form.data_associacao}
          onChange={(e) => updateForm({ data_associacao: e.target.value })}
          onFocus={() => setFocusField("data_associacao")}
          onBlur={() => setFocusField(null)}
          required
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
        <input
          id="uf"
          type="text"
          style={getInputStyle("uf")}
          value={form.endereco.uf}
          onChange={(e) => updateEndereco({ uf: e.target.value })}
          onFocus={() => setFocusField("uf")}
          onBlur={() => setFocusField(null)}
          required
        />

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

        <label style={labelStyle} htmlFor="anuidade">
          Anuidade (PDF ou imagem)
        </label>
        <div style={uploadContainerStyle}>
          <label htmlFor="anuidade" style={uploadLabelStyle}>
            Selecionar arquivo
          </label>
          <input
            id="anuidade"
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            style={{ display: "none" }}
            onChange={(e) =>
              updateDocumentos({ anuidade: e.target.files[0] || null })
            }
          />
          <span style={fileNameStyle}>
            {form.documentos.anuidade
              ? form.documentos.anuidade.name
              : "Nenhum arquivo selecionado"}
          </span>
        </div>

        <label style={labelStyle} htmlFor="caf">
          CAF (PDF ou imagem)
        </label>
        <div style={uploadContainerStyle}>
          <label htmlFor="caf" style={uploadLabelStyle}>
            Selecionar arquivo
          </label>
          <input
            id="caf"
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            style={{ display: "none" }}
            onChange={(e) => updateDocumentos({ caf: e.target.files[0] || null })}
          />
          <span style={fileNameStyle}>
            {form.documentos.caf ? form.documentos.caf.name : "Nenhum arquivo selecionado"}
          </span>
        </div>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <button type="submit" style={btnCadastrar}>
            Cadastrar
          </button>
          <button
            type="button"
            style={btnCancelar}
            onClick={() => navigate("/associados")}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
