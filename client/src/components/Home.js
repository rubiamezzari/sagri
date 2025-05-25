import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const containerStyle = {
  backgroundColor: "#eeffe7",
  padding: "30px 20px",
  borderRadius: "10px",
  maxWidth: "1000px",
  margin: "10px auto",
  fontFamily: "'Segoe UI', sans-serif",
  color: "#000",
};

const section = {
  backgroundColor: "#ffffff",
  borderRadius: "10px",
  padding: "20px",
  marginBottom: "20px",
};

const heading = {
  fontSize: "1.3rem",
  marginBottom: "8px",
  fontWeight: "600",
  color: "#000",
};

const linkBox = {
  padding: "8px 16px",
  backgroundColor: "#ccedbf",
  borderRadius: "6px",
  textDecoration: "none",
  color: "#000",
  fontWeight: "500",
  marginTop: "12px",
  display: "inline-block",
};

const itemBox = {
  backgroundColor: "#f6fff6",
  padding: "12px 16px",
  borderRadius: "8px",
  marginBottom: "8px",
  fontSize: "0.95rem",
  color: "#000",
};

const titleStyle = {
  fontSize: "2rem",
  fontWeight: "700",
  textAlign: "center",
  color: "#000",
  marginBottom: "5px",
};

const subtitleStyle = {
  fontSize: "1rem",
  textAlign: "center",
  color: "#000",
  marginBottom: "30px",
};

const sectionFooter = {
  display: "flex",
  justifyContent: "flex-end",
  marginTop: "10px",
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
// escrever alguma coisa depois
  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}></h2>
      <p style={subtitleStyle}>
       
      </p>

      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", marginBottom: "20px" }}>
        <div style={{ ...section, flex: "1", minWidth: "250px" }}>
          <h3 style={heading}>Total de Associados</h3>
          <p style={{ fontSize: "2rem", fontWeight: "bold" }}>{totalAssociados}</p>
          <div style={sectionFooter}>
            <Link to="/associados/list" style={linkBox}>Ver associados</Link>
          </div>
        </div>

        <div style={{ ...section, flex: "2", minWidth: "250px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <h3 style={heading}>Solicitações</h3>
          {solicitacoes.length === 0 ? (
            <p>Nenhuma solicitação pendente.</p>
          ) : (
            solicitacoes.slice(0, 5).map(item => (
              <div key={item.id} style={itemBox}>
                <strong>{item.nome}</strong> solicitou agendamento para <strong>{item.data}</strong>
              </div>
            ))
          )}
          <div style={sectionFooter}>
            <Link to="/agendamentos/list" style={linkBox}>Ver todos os agendamentos</Link>
          </div>
        </div>

        <div style={{ ...section, flex: "1", minWidth: "250px" }}>
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
