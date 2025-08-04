import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// Modern minimal style palette
const colors = {
  green: "#2f5e4e",
  softGreen: "#edf6ef",
  lightGray: "#f4f4f4",
  border: "#e0e0e0",
  text: "#333",
  accent: "#cfe6c9",
};

const layout = {
  page: {
    backgroundColor: colors.softGreen,
    padding: "60px 30px",
    maxWidth: "1200px",
    margin: "0 auto",
    fontFamily: "Inter, sans-serif",
  },
  header: {
    textAlign: "center",
    marginBottom: "40px",
  },
  heading: {
    fontSize: "2.5rem",
    fontWeight: "600",
    color: colors.green,
    margin: 0,
  },
  subheading: {
    fontSize: "1rem",
    color: "#555",
    marginTop: "10px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "32px",
  },
  card: {
    backgroundColor: "#fff",
    border: `1px solid ${colors.border}`,
    borderRadius: "10px",
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    gap: "14px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
  },
  cardTitle: {
    fontSize: "1.1rem",
    fontWeight: 600,
    color: colors.green,
  },
  number: {
    fontSize: "2.2rem",
    fontWeight: "700",
    color: colors.green,
  },
  listItem: {
    backgroundColor: colors.lightGray,
    padding: "10px 12px",
    borderRadius: "6px",
    fontSize: "0.95rem",
    color: colors.text,
  },
  link: {
    marginTop: "10px",
    fontSize: "0.9rem",
    alignSelf: "flex-start",
    textDecoration: "none",
    color: colors.green,
    fontWeight: "500",
    backgroundColor: colors.accent,
    padding: "8px 12px",
    borderRadius: "5px",
    transition: "background-color 0.2s",
  },
};

export default function TelaInicialAdmin() {
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [agendamentos, setAgendamentos] = useState([]);
  const [totalAssociados, setTotalAssociados] = useState(0);
  const [maquinas, setMaquinas] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const resAssoc = await fetch("http://localhost:5050/associados");
        setTotalAssociados((await resAssoc.json()).length);

        const resAgend = await fetch("http://localhost:5050/agendamentos");
        const dataAgend = await resAgend.json();
        setSolicitacoes(dataAgend.filter(a => a.status === "pendente"));
        setAgendamentos(dataAgend.filter(a => a.status === "confirmado"));

        const resMaquinas = await fetch("http://localhost:5050/maquinas");
        setMaquinas(await resMaquinas.json());
      } catch (err) {
        console.error("Erro ao buscar dados:", err);
      }
    }
    fetchData();
  }, []);

  const maquinasDisponiveis = maquinas.filter(m => m.status === "disponível");
  const maquinasOcupadas = maquinas.filter(m => m.status === "ocupada");

  return (
    <div style={layout.page}>
      <header style={layout.header}>
        <h1 style={layout.heading}>Painel Administrativo</h1>
        <p style={layout.subheading}>Visão geral do sistema com dados essenciais</p>
      </header>

      <section style={layout.grid}>
        <div style={layout.card}>
          <h3 style={layout.cardTitle}>Total de Associados</h3>
          <p style={layout.number}>{totalAssociados}</p>
          <Link to="/associados/list" style={layout.link}>Ver associados</Link>
        </div>

        <div style={layout.card}>
          <h3 style={layout.cardTitle}>Solicitações Pendentes</h3>
          {solicitacoes.length === 0 ? (
            <p style={{ color: "#777", fontSize: "0.95rem" }}>Nenhuma solicitação pendente.</p>
          ) : (
            solicitacoes.slice(0, 4).map(item => (
              <div key={item.id} style={layout.listItem}>
                <strong>{item.nome}</strong> - {item.data}
              </div>
            ))
          )}
          <Link to="/agendamentos/list" style={layout.link}>Ver agendamentos</Link>
        </div>

        <div style={layout.card}>
          <h3 style={layout.cardTitle}>Máquinas</h3>
          <p><strong>Disponíveis:</strong> {maquinasDisponiveis.length}</p>
          <p><strong>Ocupadas:</strong> {maquinasOcupadas.length}</p>
          <Link to="/maquinas/list" style={layout.link}>Ver máquinas</Link>
        </div>

        <div style={layout.card}>
          <h3 style={layout.cardTitle}>Próximos Agendamentos</h3>
          {agendamentos.length === 0 ? (
            <p style={{ color: "#777", fontSize: "0.95rem" }}>Nenhum agendamento confirmado.</p>
          ) : (
            agendamentos.slice(0, 4).map(item => (
              <div key={item.id} style={layout.listItem}>
                <strong>{item.nome}</strong> - {item.data}
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
