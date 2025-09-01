import React, { useState } from "react";
// Remova o import `useParams` pois ele não é mais necessário
// import { useParams } from "react-router-dom"; 

const API_URL = "http://localhost:5050";

const linha = {
  padding: "6px 0",
  display: "flex",
  gap: "8px",
  fontSize: "0.95rem",
  borderBottom: "1px solid #e0f2e0", // Cor mais suave para a borda
};

const campo = {
  minWidth: "140px",
  fontWeight: "bold",
  color: "#386641", // Tonalidade mais suave de verde escuro
};

const tituloNome = {
  fontSize: "1.25rem",
  fontWeight: "bold",
  textTransform: "uppercase",
  paddingBottom: "10px",
  marginBottom: "16px",
  borderBottom: "2px solid #a8e0a8", // Borda mais suave
  color: "#386641",
};

const closeBtnStyle = {
  position: "absolute",
  top: "12px",
  right: "12px",
  background: "none",
  border: "none",
  fontSize: "1.4rem",
  cursor: "pointer",
  color: "#666", // Cor mais suave para o X
};

const boxStyle = {
  backgroundColor: "#fff",
  padding: "28px", // Um pouco mais de padding para um respiro visual
  borderRadius: "16px", // Cantos mais arredondados
  width: "580px", // Um pouco mais largo
  maxWidth: "95%",
  boxShadow: "0 10px 30px rgba(0,0,0,0.1)", // Sombra mais sutil
  fontFamily: "'Segoe UI', sans-serif",
  maxHeight: "85vh", // Um pouco mais de altura
  overflowY: "auto",
  position: "relative",
};

const modalStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: "rgba(0, 0, 0, 0.3)", // Fundo do modal mais transparente
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const btnBase = {
  padding: "8px 18px", // Mais padding
  borderRadius: "20px", // Cantos bem arredondados para um visual suave
  fontWeight: 500, // Menos bold
  fontSize: "0.9rem",
  border: "1px solid #99c9a0", // Borda sutil
  cursor: "pointer",
  transition: "all 0.2s ease",
  marginLeft: "10px",
};

const btnEditar = {
  ...btnBase,
  backgroundColor: "#e6f4ea", // Fundo mais claro
  color: "#386641", // Texto verde escuro
  "&:hover": {
    backgroundColor: "#d9eadd", // Um pouco mais escuro no hover
  },
};

const btnExcluir = {
  ...btnBase,
  backgroundColor: "transparent", // Fundo transparente para Excluir
  color: "#88a88c", // Texto cinza esverdeado
  border: "1px solid #d0e7d3", // Borda mais clara
  "&:hover": {
    backgroundColor: "#f2fcf3", // Um leve fundo no hover
    color: "#c24747", // Uma cor de alerta suave no hover
  },
};

const navContainer = {
  marginTop: "20px", // Mais espaço acima
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "8px", // Espaçamento entre os dots
};

// Estilo para os "dots" de navegação, mais delicados
const navDot = (active) => ({
  width: "10px",
  height: "10px",
  borderRadius: "50%",
  backgroundColor: active ? "#5cb85c" : "#e0e0e0", // Verde vibrante para ativo, cinza suave para inativo
  cursor: "pointer",
  transition: "background-color 0.2s, transform 0.2s", // Animação suave
  border: `1px solid ${active ? "#4CAF50" : "transparent"}`, // Borda sutil para o ativo
  transform: active ? "scale(1.1)" : "scale(1)", // Leve aumento no ativo
});

export default function DetalhesAssociado({
  associado,
  onClose,
  onDeleted,
}) {
  const [pagina, setPagina] = useState(1);
  const associadoId = associado?.id || associado?._id;

  async function handleExcluir() {
    if (!window.confirm("Tem certeza que deseja excluir este associado?"))
      return;
    try {
      const id = associadoId;
      const resp = await fetch(`${API_URL}/associados/${id}`, {
        method: "DELETE",
      });
      if (resp.ok) {
        alert("Associado excluído com sucesso!");
        onDeleted && onDeleted(id);
        onClose && onClose();
      } else {
        alert("Erro ao excluir associado.");
      }
    } catch (err) {
      alert("Erro: " + err.message);
    }
  }

  const endereco = associado?.endereco || {};
  const docs = associado?.documentos || {};

  const paginas = [
    // Página 1: Dados Pessoais
    <>
      <div style={linha}>
        <div style={campo}>Número:</div>
        <div>{associadoId || "-"}</div>
      </div>
      <div style={linha}>
        <div style={campo}>Nome:</div>
        <div>{associado?.nome || "-"}</div>
      </div>
      <div style={linha}>
        <div style={campo}>Data associação:</div>
        <div>{associado?.data_associacao || "-"}</div>
      </div>
      <div style={linha}>
        <div style={campo}>CPF:</div>
        <div>{associado?.cpf || "-"}</div>
      </div>
      <div style={linha}>
        <div style={campo}>Telefone:</div>
        <div>{associado?.telefone || "-"}</div>
      </div>
      <div style={linha}>
        <div style={campo}>E-mail:</div>
        <div>{associado?.email || "-"}</div>
      </div>
      <div style={linha}>
        <div style={campo}>Documentos:</div>
        {docs.anuidade ? (
          <a
            href={`${API_URL}/uploads/anuidade/${docs.anuidade}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              backgroundColor: "#d4edda", // Fundo mais claro para links
              color: "#386641",
              padding: "4px 9px", // Mais padding
              borderRadius: "15px", // Mais arredondado
              textDecoration: "none",
              display: "inline-block",
              marginTop: "4px",
              fontWeight: 500,
              fontSize: "0.85rem", // Fonte um pouco menor
            }}
          >
            Anuidade
          </a>
        ) : (
          <div style={{ opacity: 0.6, fontSize: "0.85rem" }}>Sem comprovante de anuidade</div>
        )}
        {docs.caf ? (
          <a
            href={`${API_URL}/uploads/caf/${docs.caf}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              backgroundColor: "#d4edda",
              color: "#386641",
              padding: "4px 9px",
              borderRadius: "15px",
              textDecoration: "none",
              display: "inline-block",
              marginTop: "4px",
              marginLeft: "10px",
              fontWeight: 500,
              fontSize: "0.85rem",
            }}
          >
            CAF
          </a>
        ) : (
          <div style={{ opacity: 0.6, marginTop: 8, fontSize: "0.85rem" }}>Sem CAF</div>
        )}
      </div>
    </>,
    // Página 2: Endereço
    <>
      <h4 style={{ marginBottom: "10px", color: "#386641" }}>Endereço:</h4>
      <div style={linha}>
        <div style={campo}>Rua:</div>
        <div>{endereco.rua || "-"}</div>
      </div>
      <div style={linha}>
        <div style={campo}>Número:</div>
        <div>{endereco.numero || "-"}</div>
      </div>
      <div style={linha}>
        <div style={campo}>Complemento:</div>
        <div>{endereco.complemento || "-"}</div>
      </div>
      <div style={linha}>
        <div style={campo}>Bairro:</div>
        <div>{endereco.bairro || "-"}</div>
      </div>
      <div style={linha}>
        <div style={campo}>Cidade:</div>
        <div>{endereco.cidade || "-"}</div>
      </div>
      <div style={linha}>
        <div style={campo}>UF:</div>
        <div>{endereco.uf || "-"}</div>
      </div>
      <div style={linha}>
        <div style={campo}>CEP:</div>
        <div>{endereco.cep || "-"}</div>
      </div>
    </>,
  ];

  if (!associado) return null;

  return (
    <div style={modalStyle} onClick={onClose}>
      <div style={boxStyle} onClick={(e) => e.stopPropagation()}>
        <button style={closeBtnStyle} onClick={onClose} aria-label="Fechar">
          &times;
        </button>

        <h3 style={tituloNome}>{associado?.nome || "Associado"}</h3>

        {/* Conteúdo da página atual */}
        {paginas[pagina - 1]}

        {/* Navegação por "dots" */}
        <div style={navContainer}>
          {paginas.map((_, i) => (
            <div
              key={i}
              style={navDot(pagina === i + 1)}
              onClick={() => setPagina(i + 1)}
            />
          ))}
        </div>

        <div style={{ marginTop: 25, textAlign: "right" }}> {/* Mais espaço acima */}
          <button style={btnEditar} onClick={() => alert("Abrir edição")}>
            Editar
          </button>
          <button style={btnExcluir} onClick={handleExcluir}>
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
}