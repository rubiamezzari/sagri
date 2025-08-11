import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_URL = "http://localhost:5050";

const btnEditar = {
  backgroundColor: "#1A381F",
  color: "#fff",
  padding: "5px 12px",
  borderRadius: "4px",
  fontSize: "0.75rem",
  border: "none",
  cursor: "pointer",
  fontWeight: "500",
  textDecoration: "none",
  marginRight: "5px",
};

const btnExcluir = {
  backgroundColor: "#daf4d0",
  color: "#143018",
  padding: "5px 12px",
  borderRadius: "4px",
  fontSize: "0.75rem",
  border: "none",
  cursor: "pointer",
  fontWeight: "500",
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
    <div style={{ width: "100%", backgroundColor: "#fff", padding: "20px", borderRadius: "5px" }}>
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
          borderRadius: "5px",
          border: "1px solid #ccc",
          outlineColor: "#1A381F",
          fontSize: "0.85rem",
          marginBottom: "15px",
        }}
      />

      <table style={{
        width: "100%",
        borderCollapse: "collapse",
        fontSize: "0.85rem",
        textAlign: "center"
      }}>
        <thead style={{
          backgroundColor: "#f8f8f8",
          fontWeight: "600"
        }}>
          <tr style={{ borderBottom: "1px solid #ccc" }}>
            <th style={{ padding: "12px 0" }}>#</th>
            <th style={{ padding: "12px 0" }}>Nome</th>
            <th style={{ padding: "12px 0" }}>Telefone</th>
            <th style={{ padding: "12px 0" }}>CPF</th>
            <th style={{ padding: "12px 0" }}>Email</th>
            <th style={{ padding: "12px 0" }}></th>
          </tr>
        </thead>
        <tbody>
          {operadoresPaginados.length === 0 ? (
            <tr>
              <td colSpan={6} style={{ padding: "12px 0" }}>
                Nenhum operador encontrado.
              </td>
            </tr>
          ) : (
            operadoresPaginados.map((op, index) => (
              <tr key={op._id} style={{ borderBottom: "1px solid #ccc" }}>
                <td style={{ padding: "12px 8px" }}>
                  {(paginaAtual - 1) * itensPorPagina + index + 1}
                </td>
                <td style={{ padding: "12px 8px" }}>{op.nome?.toUpperCase()}</td>
                <td style={{ padding: "12px 8px" }}>{op.telefone}</td>
                <td style={{ padding: "12px 8px" }}>{op.cpf}</td>
                <td style={{ padding: "12px 8px" }}>{op.email || "—"}</td>
                <td style={{ padding: "12px 8px" }}>
                  <Link to={`/operadores/edit/${op._id}`} style={btnEditar}>Editar</Link>
                  <button onClick={() => excluirOperador(op._id)} style={btnExcluir}>Excluir</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Paginação com setas */}
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
              color: "#1A381F",
            }}
          >
            ←
          </button>

          <span style={{ color: "#1A381F" }}>
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
              color: "#1A381F",
            }}
          >
            →
          </button>
        </div>
      )}
    </div>
  );
}
