import React, { useState } from "react";
import DetalhesAssociado from "./DetalhesAssociado";

export default function UserListAssociado({ associados }) {
  const [busca, setBusca] = useState("");
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [associadoSelecionado, setAssociadoSelecionado] = useState(null);

  const tipoUsuario = localStorage.getItem("tipoUsuario");
  const usuarioId = localStorage.getItem("usuarioId");
  let associadosVisiveis = associados;

  if (tipoUsuario === "associado") {
    associadosVisiveis = associados.filter((a) => a._id === usuarioId);
  }

  const associadosFiltrados = associadosVisiveis
    .filter(
      (associado) =>
        associado.nome?.toLowerCase().includes(busca.toLowerCase()) ||
        associado.telefone?.toLowerCase().includes(busca.toLowerCase()) ||
        associado.cpf?.toLowerCase().includes(busca.toLowerCase()) ||
        associado.endereco?.bairro?.toLowerCase().includes(busca.toLowerCase())
    )
    .reverse();

  const itensPorPagina = 5;
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

  const abrirModal = (associado) => {
    setAssociadoSelecionado(associado);
  };

  const fecharModal = () => {
    setAssociadoSelecionado(null);
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "1000px",
        margin: "0 auto",
        padding: "32px 20px",
      }}
    >
      {/* Header Section */}
     

      {/* Search Bar */}
      <div style={{ marginBottom: "24px", position: "relative" }}>
        <svg
          style={{
            position: "absolute",
            left: "14px",
            top: "50%",
            transform: "translateY(-50%)",
            width: "18px",
            height: "18px",
            color: "#9CA3AF",
          }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          placeholder="Pesquisar por nome, telefone, CPF ou bairro..."
          value={busca}
          onChange={(e) => {
            setBusca(e.target.value);
            setPaginaAtual(1);
          }}
          style={{
            width: "100%",
            padding: "12px 14px 12px 44px",
            borderRadius: "12px",
            border: "1px solid #E5E7EB",
            backgroundColor: "#fff",
            fontSize: "14px",
            outline: "none",
            transition: "all 0.2s ease",
            boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "#1B4D3E";
            e.target.style.boxShadow = "0 0 0 3px rgba(27, 77, 62, 0.1)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "#E5E7EB";
            e.target.style.boxShadow = "0 1px 2px rgba(0, 0, 0, 0.05)";
          }}
        />
      </div>

      {/* Cards Grid */}
      <div
        style={{
          display: "grid",
          gap: "16px",
          marginBottom: "32px",
        }}
      >
        {associadosPaginados.length === 0 ? (
          <div
            style={{
              padding: "64px 20px",
              textAlign: "center",
              backgroundColor: "#fff",
              borderRadius: "16px",
              border: "1px solid #E5E7EB",
            }}
          >
            <svg
              style={{
                width: "48px",
                height: "48px",
                color: "#D1D5DB",
                margin: "0 auto 16px",
              }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            
          </div>
        ) : (
          associadosPaginados.map((associado, index) => (
            <div
              key={associado._id}
              onClick={() => abrirModal(associado)}
              style={{
                backgroundColor: "#fff",
                padding: "20px 24px",
                borderRadius: "16px",
                border: "1px solid #E5E7EB",
                cursor: "pointer",
                transition: "all 0.2s ease",
                boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#FAFAF9";
                e.currentTarget.style.borderColor = "#1B4D3E";
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.07)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#fff";
                e.currentTarget.style.borderColor = "#E5E7EB";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 1px 2px rgba(0, 0, 0, 0.05)";
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "16px",
                }}
              >
                {/* Left side - Avatar and info */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    flex: 1,
                    minWidth: 0,
                  }}
                >
                  {/* Avatar */}
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "50%",
                      backgroundColor: "#1B4D3E",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "18px",
                      fontWeight: "600",
                      flexShrink: 0,
                    }}
                  >
                    {associado.nome
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")
                      .substring(0, 2)
                      .toUpperCase()}
                  </div>

                  {/* Info Grid */}
                  <div
                    style={{
                      flex: 1,
                      minWidth: 0,
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                      gap: "12px 24px",
                    }}
                  >
                    {/* Name */}
                    <div>
                      <div
                        style={{
                          fontSize: "16px",
                          fontWeight: "500",
                          color: "#1F2937",
                          marginBottom: "4px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {associado.nome}
                      </div>
                      <div
                        style={{
                          fontSize: "13px",
                          color: "#9CA3AF",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <span style={{ fontWeight: "500" }}>CPF:</span>
                        <span>{associado.cpf}</span>
                      </div>
                    </div>

                    {/* Contact */}
                    <div>
                      <div
                        style={{
                          fontSize: "13px",
                          color: "#6B7280",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          marginBottom: "4px",
                        }}
                      >
                        <svg
                          style={{ width: "14px", height: "14px", flexShrink: 0 }}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                        {associado.telefone}
                      </div>
                      {associado.endereco?.bairro && (
                        <div
                          style={{
                            fontSize: "13px",
                            color: "#6B7280",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                          }}
                        >
                          <svg
                            style={{ width: "14px", height: "14px", flexShrink: 0 }}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          {associado.endereco.bairro}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right side - Arrow */}
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    backgroundColor: "#F3F4F6",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#1B4D3E";
                    e.currentTarget.style.color = "#fff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#F3F4F6";
                    e.currentTarget.style.color = "#6B7280";
                  }}
                >
                  <svg
                    style={{ width: "16px", height: "16px" }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPaginas > 1 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <button
            onClick={() => mudarPagina(paginaAtual - 1)}
            disabled={paginaAtual === 1}
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "8px",
              backgroundColor: paginaAtual === 1 ? "#F3F4F6" : "#fff",
              border: "1px solid #E5E7EB",
              cursor: paginaAtual === 1 ? "not-allowed" : "pointer",
              opacity: paginaAtual === 1 ? 0.5 : 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s ease",
              color: "#1B4D3E",
            }}
            onMouseEnter={(e) => {
              if (paginaAtual !== 1) {
                e.currentTarget.style.backgroundColor = "#F9FAFB";
                e.currentTarget.style.borderColor = "#1B4D3E";
              }
            }}
            onMouseLeave={(e) => {
              if (paginaAtual !== 1) {
                e.currentTarget.style.backgroundColor = "#fff";
                e.currentTarget.style.borderColor = "#E5E7EB";
              }
            }}
          >
            <svg
              style={{ width: "16px", height: "16px" }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <span
            style={{
              color: "#6B7280",
              fontSize: "14px",
              fontWeight: "500",
              minWidth: "120px",
              textAlign: "center",
            }}
          >
            Página {paginaAtual} de {totalPaginas}
          </span>

          <button
            onClick={() => mudarPagina(paginaAtual + 1)}
            disabled={paginaAtual === totalPaginas}
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "8px",
              backgroundColor: paginaAtual === totalPaginas ? "#F3F4F6" : "#fff",
              border: "1px solid #E5E7EB",
              cursor: paginaAtual === totalPaginas ? "not-allowed" : "pointer",
              opacity: paginaAtual === totalPaginas ? 0.5 : 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s ease",
              color: "#1B4D3E",
            }}
            onMouseEnter={(e) => {
              if (paginaAtual !== totalPaginas) {
                e.currentTarget.style.backgroundColor = "#F9FAFB";
                e.currentTarget.style.borderColor = "#1B4D3E";
              }
            }}
            onMouseLeave={(e) => {
              if (paginaAtual !== totalPaginas) {
                e.currentTarget.style.backgroundColor = "#fff";
                e.currentTarget.style.borderColor = "#E5E7EB";
              }
            }}
          >
            <svg
              style={{ width: "16px", height: "16px" }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      )}

      {/* Modal */}
      {associadoSelecionado && (
        <DetalhesAssociado
          associado={associadoSelecionado}
          onClose={fecharModal}
          onDeleted={fecharModal}
        />
      )}
    </div>
  );
}
