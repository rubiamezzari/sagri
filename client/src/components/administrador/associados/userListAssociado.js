import React, { useState } from "react";
import { Link } from "react-router-dom";

const btnDetalhes = {
  // removi pois não usaremos mais o estilo desse botão
};

export default function UserListAssociado({ associados }) {
  const [busca, setBusca] = useState("");
  const [paginaAtual, setPaginaAtual] = useState(1);

  const associadosFiltrados = associados
    .filter((associado) =>
      associado.nome?.toLowerCase().includes(busca.toLowerCase()) ||
      associado.telefone?.toLowerCase().includes(busca.toLowerCase()) ||
      associado.cpf?.toLowerCase().includes(busca.toLowerCase()) ||
      associado.endereco?.bairro?.toLowerCase().includes(busca.toLowerCase())
    )
    .reverse();

  const itensPorPagina = 10;
  const totalPaginas = Math.ceil(associadosFiltrados.length / itensPorPagina);

  const associadosPaginados = associadosFiltrados.slice(
    (paginaAtual - 1) * itensPorPagina,
    paginaAtual * itensPorPagina
  );

  const mudarPagina = (novaPagina) => {
    if (novaPagina >= 1 && novaPagina <= totalPaginas) {
      setPaginaAtual(novaPagina);
    }
  };

  return (
    <div
      style={{
        width: "100%",
        backgroundColor: "#fff",
        padding: "20px",
        borderRadius: "5px",
      }}
    >
      <input
        type="text"
        placeholder="Pesquisar associado..."
        value={busca}
        onChange={(e) => {
          setBusca(e.target.value);
          setPaginaAtual(1); // reinicia pra página 1 ao buscar
        }}
        style={{
          width: "100%",
          padding: "10px",
          borderRadius: "5px",
          border: "1px solid #ccc",
          outlineColor: "#1B4D3E",
          fontSize: "0.85rem",
          marginBottom: "15px",
        }}
      />

      {/* Tabela */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: "0.85rem",
          textAlign: "center",
        }}
      >
        <thead
          style={{
            backgroundColor: "#f8f8f8",
            fontWeight: "600",
          }}
        >
          <tr style={{ borderBottom: "1px solid #ccc" }}>
            <th style={{ padding: "12px 0" }}>#</th>
            <th style={{ padding: "12px 0" }}>Nome completo</th>
            <th style={{ padding: "12px 0" }}>Telefone</th>
            <th style={{ padding: "12px 0" }}>CPF</th>
            <th style={{ padding: "12px 0" }}>Bairro</th>
            <th style={{ padding: "12px 0" }}>Mais detalhes</th> {/* título adicionado */}
          </tr>
        </thead>
        <tbody>
          {associadosPaginados.length === 0 ? (
            <tr>
              <td colSpan={6} style={{ padding: "12px 0" }}>
                Nenhum associado encontrado.
              </td>
            </tr>
          ) : (
            associadosPaginados.map((associado, index) => (
              <tr
                key={associado._id}
                style={{ borderBottom: "1px solid #ccc" }}
              >
                <td style={{ padding: "12px 8px" }}>
                  {(paginaAtual - 1) * itensPorPagina + index + 1}
                </td>
                <td style={{ padding: "12px 8px" }}>
                  {associado.nome?.toUpperCase()}
                </td>
                <td style={{ padding: "12px 8px" }}>{associado.telefone}</td>
                <td style={{ padding: "12px 8px" }}>{associado.cpf}</td>
                <td style={{ padding: "12px 8px" }}>
                  {associado.endereco?.bairro?.toUpperCase()}
                </td>
                <td style={{ textAlign: "center", padding: "12px 8px" }}>
                  <Link
                    to={`/associados/${associado._id}`}
                    style={{
                      fontSize: "1.4rem",
                      backgroundColor: "transparent",
                      border: "none",
                      cursor: "pointer",
                      color: "#1B4D3E",
                      textDecoration: "none",
                    }}
                    aria-label={`Mais detalhes do associado ${associado.nome}`}
                  >
                    →
                  </Link>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Paginação com setas */}
      {totalPaginas > 1 && (
        <div
          style={{
            marginTop: "20px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "20px",
            fontSize: "0.95rem",
          }}
        >
          <button
            onClick={() => mudarPagina(paginaAtual - 1)}
            disabled={paginaAtual === 1}
            style={{
              fontSize: "1.4rem",
              backgroundColor: "transparent",
              border: "none",
              cursor: paginaAtual === 1 ? "not-allowed" : "pointer",
              opacity: paginaAtual === 1 ? 0.4 : 1,
              color: "#1B4D3E",
            }}
          >
            ←
          </button>

          <span style={{ color: "#1B4D3E" }}>
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
              color: "#1B4D3E",
            }}
          >
            →
          </button>
        </div>
      )}
    </div>
  );
}
