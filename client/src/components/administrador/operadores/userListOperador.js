import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_URL = "http://localhost:5050";

// Estilos de botões arredondados e delicados
const btnBase = {
  padding: "8px 18px",
  borderRadius: "20px",
  fontWeight: 500,
  fontSize: "0.9rem",
  border: "1px solid #99c9a0",
  cursor: "pointer",
  transition: "all 0.2s ease",
  marginLeft: "10px",
  textDecoration: "none", // Mantido para o Link
};

const btnEditar = {
  ...btnBase,
  backgroundColor: "#e6f4ea",
  color: "#386641",
};

const btnExcluir = {
  ...btnBase,
  backgroundColor: "transparent",
  color: "#88a88c",
  border: "1px solid #d0e7d3",
};

export default function UserListOperador() {
  const [operadores, setOperadores] = useState([]);
  const [busca, setBusca] = useState("");
  const [paginaAtual, setPaginaAtual] = useState(1);

  useEffect(() => {
    buscarOperadores();
  }, []);

  async function buscarOperadores() {
    try {
      const response = await fetch(`${API_URL}/operadores`);
      if (!response.ok) throw new Error("Erro ao buscar operadores");
      const data = await response.json();
      setOperadores(data);
    } catch (error) {
      alert("Erro ao buscar operadores: " + error.message);
    }
  }

  async function excluirOperador(id) {
    const confirmacao = window.confirm("Tem certeza que deseja excluir este operador?");
    if (!confirmacao) return;

    try {
      const response = await fetch(`${API_URL}/operadores/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Erro ao excluir operador");
      setOperadores(operadores.filter((op) => op._id !== id));
    } catch (error) {
      alert("Erro ao excluir operador: " + error.message);
    }
  }

  const operadoresFiltrados = operadores
    .filter((op) =>
      op.nome?.toLowerCase().includes(busca.toLowerCase()) ||
      op.telefone?.toLowerCase().includes(busca.toLowerCase()) ||
      op.cpf?.toLowerCase().includes(busca.toLowerCase()) ||
      op.email?.toLowerCase().includes(busca.toLowerCase())
    )
    .reverse();

  const itensPorPagina = 10;
  const totalPaginas = Math.ceil(operadoresFiltrados.length / itensPorPagina);

  const operadoresPaginados = operadoresFiltrados.slice(
    (paginaAtual - 1) * itensPorPagina,
    paginaAtual * itensPorPagina
  );

  const mudarPagina = (novaPagina) => {
    if (novaPagina >= 1 && novaPagina <= totalPaginas) {
      setPaginaAtual(novaPagina);
    }
  };

  return (
    <div style={{
      width: "100%",
      backgroundColor: "#fff",
      padding: "20px",
      borderRadius: "16px", // Cantos arredondados
      boxShadow: "0 4px 12px rgba(0,0,0,0.05)" // Sombra sutil
    }}>
      <input
        type="text"
        placeholder="Pesquisar operador..."
        value={busca}
        onChange={(e) => {
          setBusca(e.target.value);
          setPaginaAtual(1);
        }}
        style={{
          width: "100%",
          padding: "10px",
          borderRadius: "8px", // Cantos mais arredondados
          border: "1px solid #d4e3d6", // Borda mais suave
          outlineColor: "#5cb85c", // Cor no foco
          fontSize: "0.85rem",
          marginBottom: "20px", // Aumentei o espaçamento
        }}
      />

      <table style={{
        width: "100%",
        borderCollapse: "separate", // Necessário para border-radius
        borderSpacing: "0 10px", // Espaço entre as linhas
        fontSize: "0.85rem",
        textAlign: "left", // Alinhei o texto à esquerda para um visual mais limpo
      }}>
        <thead style={{
          fontWeight: "600",
          backgroundColor: "#f7fcf8", // Fundo mais claro para o cabeçalho
        }}>
          <tr>
            <th style={{ padding: "12px 10px", borderBottom: "1px solid #e0f2e0" }}>#</th>
            <th style={{ padding: "12px 10px", borderBottom: "1px solid #e0f2e0" }}>Nome</th>
            <th style={{ padding: "12px 10px", borderBottom: "1px solid #e0f2e0" }}>Telefone</th>
            <th style={{ padding: "12px 10px", borderBottom: "1px solid #e0f2e0" }}>CPF</th>
            <th style={{ padding: "12px 10px", borderBottom: "1px solid #e0f2e0" }}>Email</th>
            <th style={{ padding: "12px 10px", borderBottom: "1px solid #e0f2e0" }}></th>
          </tr>
        </thead>
        <tbody>
          {operadoresPaginados.length === 0 ? (
            <tr>
              <td colSpan={6} style={{ padding: "20px 0", textAlign: "center", color: "#666" }}>
                Nenhum operador encontrado.
              </td>
            </tr>
          ) : (
            operadoresPaginados.map((op, index) => (
              <tr key={op._id} style={{
                backgroundColor: "#fff",
                boxShadow: "0 2px 5px rgba(0,0,0,0.03)",
                borderRadius: "8px",
                transition: "transform 0.2s ease",
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.01)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <td style={{ padding: "12px 10px" }}>
                  {(paginaAtual - 1) * itensPorPagina + index + 1}
                </td>
                <td style={{ padding: "12px 10px" }}>{op.nome?.toUpperCase()}</td>
                <td style={{ padding: "12px 10px" }}>{op.telefone}</td>
                <td style={{ padding: "12px 10px" }}>{op.cpf}</td>
                <td style={{ padding: "12px 10px" }}>{op.email || "—"}</td>
                <td style={{ padding: "12px 10px", whiteSpace: "nowrap" }}>
                  <Link to={`/operadores/edit/${op._id}`} style={btnEditar}>
                    Editar
                  </Link>
                  <button onClick={() => excluirOperador(op._id)} style={btnExcluir}>
                    Excluir
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {totalPaginas > 1 && (
        <div style={{
          marginTop: "20px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "20px",
          fontSize: "0.95rem",
        }}>
          <button
            onClick={() => mudarPagina(paginaAtual - 1)}
            disabled={paginaAtual === 1}
            style={{
              fontSize: "1.4rem",
              backgroundColor: "transparent",
              border: "none",
              cursor: paginaAtual === 1 ? "not-allowed" : "pointer",
              opacity: paginaAtual === 1 ? 0.4 : 1,
              color: "#386641",
            }}
          >
            ←
          </button>

          <span style={{ color: "#386641" }}>
            Página {paginaAtual} de {totalPaginas}
          </span>

          <button
            onClick={() => mudarPagina(paginaAtual + 1)}
            disabled={paginaAtual === totalPaginas}
            style={{
              fontSize: "1.4rem",
              backgroundColor: "transparent",
              border: "none",
              cursor: paginaAtual === totalPaginas ? "not-allowed" : "pointer",
              opacity: paginaAtual === totalPaginas ? 0.4 : 1,
              color: "#386641",
            }}
          >
            →
          </button>
        </div>
      )}
    </div>
  );
}