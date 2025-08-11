import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

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
    backgroundColor: "#F0FAF7",
    padding: "60px 30px",
    maxWidth: "1200px",
    margin: "0 auto",
    fontFamily: "Inter, sans-serif",
  },
  wrapper: {
    display: "flex",
    gap: "60px",
    alignItems: "center",
  },
  sideTitle: {
    minWidth: "300px",
    textAlign: "left",
  },
  heading: {
    fontSize: "2.8rem",
    fontWeight: "700",
    color: colors.green,
    margin: 0,
  },
  subheading: {
    fontSize: "1.1rem",
    color: "#555",
    marginTop: "10px",
  },
  totalAssociados: {
    marginTop: "24px",
    backgroundColor: colors.softGreen,
    border: `1px solid ${colors.border}`,
    padding: "40px 70px",
    borderRadius: "12px",
    display: "inline-block",
    textAlign: "center",
    boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
  },
  totalTitle: {
    fontSize: "1rem",
    color: colors.green,
    fontWeight: "500",
  },
  totalNumber: {
    fontSize: "2rem",
    fontWeight: "700",
    color: colors.green,
    marginTop: "4px",
  },
  cardColumn: {
    display: "flex",
    flexDirection: "column",
    gap: "28px",
    flex: 1,
  },
  cardLink: {
    textDecoration: "none",
  },
  card: {
    backgroundColor: "#fff",
    border: `1px solid ${colors.border}`,
    borderRadius: "14px",
    padding: "26px",
    display: "flex",
    flexDirection: "column",
    gap: "14px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
    transition: "transform 0.2s, box-shadow 0.2s",
    cursor: "pointer",
  },
  cardTitle: {
    fontSize: "1.2rem",
    fontWeight: 600,
    color: colors.green,
  },
  maquinaStatus: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "10px",
    gap: "20px",
  },
  listItem: {
    backgroundColor: colors.lightGray,
    padding: "10px 12px",
    borderRadius: "6px",
    fontSize: "0.95rem",
    color: colors.text,
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
      <div style={layout.wrapper}>
        <div style={layout.sideTitle}>
          <h1 style={layout.heading}>Painel Administrativo</h1>
          <p style={layout.subheading}>
            Visão geral do sistema com dados essenciais
          </p>
          <div style={layout.totalAssociados}>
            <div style={layout.totalTitle}>Total de Associados</div>
            <div style={layout.totalNumber}>{totalAssociados}</div>
          </div>
        </div>

        <section style={layout.cardColumn}>
          <Link to="/agendamentos/list" style={layout.cardLink}>
            <div style={layout.card}>
              <h3 style={layout.cardTitle}>Solicitações Pendentes</h3>
              {solicitacoes.length === 0 ? (
                <p style={{ color: "#777", fontSize: "0.95rem" }}>
                  Nenhuma solicitação pendente.
                </p>
              ) : (
                solicitacoes.slice(0, 4).map(item => (
                  <div key={item.id} style={layout.listItem}>
                    <strong>{item.nome}</strong> - {item.data}
                  </div>
                ))
              )}
            </div>
          </Link>

          <Link to="/maquinas/list" style={layout.cardLink}>
            <div style={layout.card}>
              <h3 style={layout.cardTitle}>Máquinas</h3>
              <div style={layout.maquinaStatus}>
                <p>
                  <strong>Disponíveis:</strong> {maquinasDisponiveis.length}
                </p>
                <p>
                  <strong>Ocupadas:</strong> {maquinasOcupadas.length}
                </p>
              </div>
            </div>
          </Link>

          <div style={layout.card}>
            <h3 style={layout.cardTitle}>Próximos Agendamentos</h3>
            {agendamentos.length === 0 ? (
              <p style={{ color: "#777", fontSize: "0.95rem" }}>
                Nenhum agendamento confirmado.
              </p>
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
    </div>
  );
}
