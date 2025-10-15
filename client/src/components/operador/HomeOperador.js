import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// Ações para o operador (simulação)
const OPERATOR_ID = "op_123"; // ID fictício do operador logado

const colors = {
  green: "#2f5e4e", // Verde Escuro Principal
  softGreen: "#d4edda", // Verde Claro Suave para destaque
  lightGray: "#f4f4f4", // Cinza claro para itens da lista
  border: "#c8e6c9", // Borda verde clara
  text: "#333",
  accent: "#a5d6a7", // Destaque mais forte
  warning: "#ffb74d", // Laranja para status em andamento
};

// Estilos adaptados para o foco operacional
const layout = {
  page: {
    backgroundColor: "#F0FAF7",
    padding: "60px 30px",
    maxWidth: "1200px",
    margin: "0 auto",
    fontFamily: "'segoe ui', sans-serif",
  },
  wrapper: {
    display: "flex",
    gap: "40px",
    alignItems: "flex-start", // Alinha ao topo
  },
  sideTitle: {
    minWidth: "300px",
    textAlign: "left",
    paddingTop: "10px",
  },
  heading: {
    fontSize: "2.5rem", // Um pouco menor para operador
    fontWeight: "700",
    color: colors.green,
    margin: 0,
  },
  subheading: {
    fontSize: "1.1rem",
    color: "#555",
    marginTop: "10px",
    fontWeight: "300",
  },
  // NOVO: Card de Destaque para Próximo Agendamento
  nextAppointmentCard: {
    marginTop: "24px",
    backgroundColor: colors.softGreen,
    borderLeft: `5px solid ${colors.green}`,
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  },
  nextTitle: {
    fontSize: "1.2rem",
    color: colors.green,
    fontWeight: "600",
    marginBottom: "8px",
  },
  nextDetail: {
    fontSize: "1rem",
    color: colors.text,
    margin: "4px 0",
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
    backgroundColor: colors.white,
    border: `1px solid ${colors.border}`,
    borderRadius: "14px",
    padding: "26px",
    display: "flex",
    flexDirection: "column",
    gap: "14px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
    transition: "transform 0.2s, box-shadow 0.2s",
    cursor: "pointer",
  },
  cardTitle: {
    fontSize: "1.3rem",
    fontWeight: 700,
    color: colors.green,
    borderBottom: `1px solid ${colors.border}`,
    paddingBottom: "10px",
  },
  listItem: {
    backgroundColor: colors.lightGray,
    padding: "10px 12px",
    borderRadius: "6px",
    fontSize: "0.95rem",
    color: colors.text,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  // NOVO: Botões de Ação Rápida
  actionButton: {
    backgroundColor: colors.green,
    color: colors.white,
    border: "none",
    padding: "12px 20px",
    borderRadius: "8px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background-color 0.2s",
    textDecoration: "none",
    textAlign: "center",
  },
  // Ajuste visual para status
  statusTag: (status) => ({
    padding: "4px 8px",
    borderRadius: "12px",
    fontSize: "0.8rem",
    fontWeight: "600",
    color: status === "Em Operação" ? colors.text : colors.white,
    backgroundColor: status === "Em Operação" ? colors.warning : colors.accent,
  }),
};

// Funções utilitárias (para simular a ordenação por data)
const sortByDate = (a, b) => new Date(a.data) - new Date(b.data);

export default function TelaInicialOperador() {
  const [agendamentos, setAgendamentos] = useState([]);
  const [maquinas, setMaquinas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Simulação: buscar todos os agendamentos
        const resAgend = await fetch("http://localhost:5050/agendamentos");
        const dataAgend = await resAgend.json();
        
        // Filtra APENAS agendamentos confirmados e designados para este operador
        const myConfirmedAgendamentos = dataAgend
          .filter(a => a.status === "confirmado" && a.operadorId === OPERATOR_ID)
          .sort(sortByDate); 

        setAgendamentos(myConfirmedAgendamentos);

        const resMaquinas = await fetch("http://localhost:5050/maquinas");
        setMaquinas(await resMaquinas.json());
      } catch (err) {
        console.error("Erro ao buscar dados:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const proximosAgendamentos = agendamentos.slice(0, 4);
  const proximaTarefa = agendamentos[0];

  const maquinasEmOperacao = maquinas.filter(m => m.status === "em operação");
  const minhasMaquinas = maquinas.filter(m => m.operadorId === OPERATOR_ID); // Máquinas que o operador é responsável

  return (
    <div style={layout.page}>
      <div style={layout.wrapper}>
        
        {/* COLUNA ESQUERDA: Boas-vindas e Próxima Tarefa */}
        <div style={layout.sideTitle}>
          <h1 style={layout.heading}>Bem-vindo, Operador!</h1>
          <p style={layout.subheading}>
            Seu painel de controle e agenda de trabalho.
          </p>

          {proximaTarefa ? (
            <div style={layout.nextAppointmentCard}>
              <div style={layout.nextTitle}>Próxima Missão</div>
              <p style={layout.nextDetail}>
                Máquina: <strong>{proximaTarefa.maquina}</strong>
              </p>
              <p style={layout.nextDetail}>
                Data/Hora: <strong>{proximaTarefa.data}</strong>
              </p>
              <p style={layout.nextDetail}>
                Cliente: {proximaTarefa.nome}
              </p>
              <Link to={`/agendamentos/detalhes/${proximaTarefa.id}`} style={{ ...layout.actionButton, marginTop: "15px", backgroundColor: colors.green }}>
                Visualizar Detalhes
              </Link>
            </div>
          ) : (
            <div style={layout.nextAppointmentCard}>
                <div style={layout.nextTitle}>Agenda Livre</div>
                <p style={layout.nextDetail}>Nenhuma tarefa agendada no momento.</p>
            </div>
          )}
        </div>

        {/* COLUNA DIREITA: Cards de Informação */}
        <section style={layout.cardColumn}>
          
          {/* CARD 1: Minhas Próximas Tarefas */}
          <div style={layout.card}>
            <h3 style={layout.cardTitle}>Minha Agenda ({proximosAgendamentos.length})</h3>
            {loading ? (
                <p style={{ color: colors.text }}>Carregando agenda...</p>
            ) : proximosAgendamentos.length === 0 ? (
              <p style={{ color: "#777", fontSize: "0.95rem" }}>
                Nenhuma tarefa confirmada em sua agenda.
              </p>
            ) : (
              proximosAgendamentos.map(item => (
                <Link key={item.id} to={`/agendamentos/detalhes/${item.id}`} style={{ textDecoration: "none" }}>
                    <div style={{...layout.listItem, backgroundColor: colors.softGreen, borderLeft: `4px solid ${colors.green}`}}>
                        <strong>{item.maquina}</strong> 
                        <span>{item.data}</span>
                    </div>
                </Link>
              ))
            )}
          </div>

          {/* CARD 2: Máquinas Em Operação (Simulando o status de todas as máquinas na fazenda) */}
          <div style={layout.card}>
            <h3 style={layout.cardTitle}>Status de Máquinas ({maquinas.length})</h3>
            
            {minhasMaquinas.length > 0 && (
                <p style={{fontSize: "0.9rem", color: colors.green, fontWeight: "600"}}>
                    Minha Responsabilidade: {minhasMaquinas.length} máquinas
                </p>
            )}

            <div style={{display: "flex", flexDirection: "column", gap: "10px"}}>
                {maquinas.slice(0, 3).map(m => (
                    <div key={m.id} style={layout.listItem}>
                        <span>{m.nome || m.modelo}</span>
                        <span style={layout.statusTag(m.status)}>
                            {m.status === "disponível" ? "Pronta" : m.status === "em operação" ? "Em Operação" : "Ocupada"}
                        </span>
                    </div>
                ))}
                {maquinas.length > 3 && (
                     <Link to="/maquinas/list" style={{...layout.actionButton, backgroundColor: colors.softGreen, color: colors.green, border: `1px solid ${colors.green}`, padding: "8px"}}>
                        Ver todas
                    </Link>
                )}
            </div>
          </div>
          
          {/* CARD 3: Ações Rápidas */}
          <div style={layout.card}>
            <h3 style={layout.cardTitle}>Ações Rápidas</h3>
            <Link to="/relatorios/iniciar" style={layout.actionButton}>
                Iniciar Novo Serviço
            </Link>
            <Link to="/maquinas/manutencao" style={{...layout.actionButton, backgroundColor: colors.accent}}>
                Solicitar Manutenção
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}