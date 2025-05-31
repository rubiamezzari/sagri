import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const containerStyle = {
  backgroundColor: "#d8f0d2",
  padding: "30px 20px",
  borderRadius: "5px",
  maxWidth: "1000px",
  margin: "20px auto",
  color: "#000",
};

const section = {
  backgroundColor: "#fff",
  borderRadius: "5px",
  padding: "20px",
  marginBottom: "20px",
  transition: "0.3s ease",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
};

const heading = {
  fontSize: "1.4rem",
  marginBottom: "12px",
  fontWeight: "600",
  color: "#1a1a1a",
};

const linkBox = {
  padding: "10px 18px",
  backgroundColor: "#bbdeb6",
  borderRadius: "5px",
  textDecoration: "none",
  color: "#000",
  fontWeight: "600",
  marginTop: "14px",
  display: "inline-block",
  transition: "background-color 0.3s",
};

const itemBox = {
  backgroundColor: "#f3fff3",
  padding: "12px 16px",
  borderRadius: "5px",
  marginBottom: "10px",
  fontSize: "0.95rem",
  color: "#1a1a1a",
  border: "1px solid #dbf5db",
};

const titleStyle = {
  fontSize: "2rem",
  fontWeight: "700",
  textAlign: "center",
  color: "#000",
  marginBottom: "10px",
};

const subtitleStyle = {
  fontSize: "1rem",
  textAlign: "center",
  color: "#333",
  marginBottom: "30px",
};

const sectionFooter = {
  display: "flex",
  justifyContent: "flex-start",
  gap: "10px",
  marginTop: "20px",
  alignItems: "center",
};

export default function TelaInicialAdmin() {
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [agendamentos, setAgendamentos] = useState([]);
  const [totalAssociados, setTotalAssociados] = useState(0);
  const [maquinas, setMaquinas] = useState([]);

  useEffect(() => {
    async function fetchDados() {
      try {
        const resAssoc = await fetch("http://localhost:5050/associados");
        const dataAssoc = await resAssoc.json();
        setTotalAssociados(dataAssoc.length);

        const resAgend = await fetch("http://localhost:5050/agendamentos");
        const dataAgend = await resAgend.json();
        setSolicitacoes(dataAgend.filter(a => a.status === "pendente"));
        setAgendamentos(dataAgend.filter(a => a.status === "confirmado"));

        const resMaquinas = await fetch("http://localhost:5050/maquinas");
        const dataMaquinas = await resMaquinas.json();
        setMaquinas(dataMaquinas);
      } catch (err) {
        console.error("Erro ao buscar dados:", err);
      }
    }
    fetchDados();
  }, []);

  const maquinasDisponiveis = maquinas.filter(m => m.status === "disponível");
  const maquinasOcupadas = maquinas.filter(m => m.status === "ocupada");

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>Painel Administrativo</h2>
      <p style={subtitleStyle}>
        Acompanhe os dados principais do sistema
      </p>

      <div
        style={{
          display: "flex",
          gap: "20px",
          flexWrap: "wrap",
          marginBottom: "20px",
          alignItems: "stretch",
        }}
      >
        <div style={{ ...section, flex: "1", minWidth: "260px", minHeight: "250px" }}>
          <h3 style={heading}>Total de Associados</h3>
          <p style={{ fontSize: "2.2rem", fontWeight: "bold" }}>{totalAssociados}</p>
          <div style={sectionFooter}>
            <Link to="/associados/list" style={linkBox}>Ver associados</Link>
          </div>
        </div>

        <div style={{ ...section, flex: "2", minWidth: "260px", minHeight: "250px" }}>
          <h3 style={heading}>Solicitações Pendentes</h3>
          <div style={{ flexGrow: 1 }}>
            {solicitacoes.length === 0 ? (
              <p>Nenhuma solicitação pendente.</p>
            ) : (
              solicitacoes.slice(0, 5).map(item => (
                <div key={item.id} style={itemBox}>
                  <strong>{item.nome}</strong> solicitou para <strong>{item.data}</strong>
                </div>
              ))
            )}
          </div>
          <div style={sectionFooter}>
            <Link to="/agendamentos/list" style={linkBox}>Ver todos os agendamentos</Link>
          </div>
        </div>

        <div style={{ ...section, flex: "1", minWidth: "260px", minHeight: "250px" }}>
          <h3 style={heading}>Máquinas</h3>
          <p><strong>Disponíveis:</strong> {maquinasDisponiveis.length}</p>
          <p><strong>Ocupadas:</strong> {maquinasOcupadas.length}</p>
          <div style={sectionFooter}>
            <Link to="/maquinas/list" style={linkBox}>Ver máquinas</Link>
          </div>
        </div>
      </div>

      <div style={section}>
        <h3 style={heading}>Próximos Agendamentos</h3>
        {agendamentos.length === 0 ? (
          <p>Nenhum agendamento confirmado.</p>
        ) : (
          agendamentos.slice(0, 5).map(item => (
            <div key={item.id} style={itemBox}>
              <strong>{item.nome}</strong> em <strong>{item.data}</strong>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
