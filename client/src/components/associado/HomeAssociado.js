import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, Plus, FileText, Info, CheckCircle, AlertCircle, Wrench, ChevronLeft, ChevronRight } from "lucide-react";

const API_URL = "http://localhost:5050";

const colors = {
  primary: "#1B4D3E",
  secondary: "#2a6b54",
  background: "#F5F1E8",
  cardBg: "#FFFFFF",
  accent: "#D1FAE5",
  accentDark: "#10B981",
  border: "#E5E7EB",
  textPrimary: "#1F2937",
  textSecondary: "#6B7280",
  warning: "#F59E0B",
  success: "#10B981",
  approved: "#10B981",
  pending: "#F59E0B",
  completed: "#3B82F6",
};

export default function HomeAssociado() {
  const nomeUsuario = localStorage.getItem("nomeUsuario") ;
  const usuarioId = localStorage.getItem("usuarioId") || null;
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [minhasSolicitacoes, setMinhasSolicitacoes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarSolicitacoes();
  }, [usuarioId]);

  async function carregarSolicitacoes() {
    if (!usuarioId) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/solicitacoes`);
      const data = await res.json();
      const minhas = data.filter((s) => s.usuario_id === usuarioId);
      setMinhasSolicitacoes(minhas);
    } catch (err) {
      console.error("Erro ao carregar solicitações:", err);
    } finally {
      setLoading(false);
    }
  }

  const getWeekDates = () => {
    const dates = [];
    const startOfWeek = new Date(selectedDate);
    startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const weekDates = getWeekDates();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isSameDay = (date1, date2) => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  const getAppointmentsForDate = (date) => {
    return minhasSolicitacoes.filter((sol) => {
      if (sol.data_servico) {
        const data = new Date(sol.data_servico);
        return isSameDay(data, date);
      }
      return false;
    });
  };

  const selectedDayAppointments = getAppointmentsForDate(selectedDate);

  const daysOfWeek = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  const monthNames = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

  const formatTime = (timeString) => {
    if (!timeString) return "--:--";
    const parts = timeString.split(":");
    return `${parts[0]}:${parts[1]}`;
  };

  const formatDate = (date) => {
    return `${date.getDate()} de ${monthNames[date.getMonth()]}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "aprovado":
        return colors.approved;
      case "concluido":
        return colors.completed;
      case "pendente":
        return colors.pending;
      default:
        return colors.textSecondary;
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "aprovado":
        return "Aprovado";
      case "concluido":
        return "Concluído";
      case "pendente":
        return "Pendente";
      default:
        return status;
    }
  };

  const goToPreviousWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() - 7);
    setSelectedDate(newDate);
  };

  const goToNextWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + 7);
    setSelectedDate(newDate);
  };

  const goToToday = () => {
    setSelectedDate(new Date());
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "50px",
              height: "50px",
              border: "4px solid #E5E7EB",
              borderTop: `4px solid ${colors.primary}`,
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 16px",
            }}
          />
          <p style={{ color: colors.textSecondary }}>Carregando solicitações...</p>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "40px 20px",
      }}
    >
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: "40px" }}
        >
          <h1
            style={{
              color: colors.primary,
              fontSize: "36px",
              fontWeight: "700",
              marginBottom: "8px",
              letterSpacing: "-0.02em",
            }}
          >
            Bem-vindo, {nomeUsuario}!
          </h1>
          <p style={{ color: colors.textSecondary, fontSize: "15px", margin: 0 }}>
          </p>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "24px" }}>
          {/* Left Column - Calendar and Appointments */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {/* Calendar Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div
                style={{
                  backgroundColor: colors.cardBg,
                  borderRadius: "16px",
                  padding: "24px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                }}
              >
                {/* Week Navigation */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "24px",
                  }}
                >
                  <button
                    onClick={goToPreviousWeek}
                    style={{
                      padding: "8px",
                      backgroundColor: colors.accent,
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = colors.accentDark;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = colors.accent;
                    }}
                  >
                    <ChevronLeft size={20} color={colors.primary} />
                  </button>

                  <div style={{ textAlign: "center" }}>
                    <h3
                      style={{
                        fontSize: "18px",
                        fontWeight: "700",
                        color: colors.primary,
                        margin: 0,
                      }}
                    >
                      {weekDates[0].toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}
                    </h3>
                    <button
                      onClick={goToToday}
                      style={{
                        marginTop: "4px",
                        padding: "4px 12px",
                        backgroundColor: "transparent",
                        border: `1px solid ${colors.border}`,
                        borderRadius: "6px",
                        fontSize: "12px",
                        color: colors.textSecondary,
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = colors.accent;
                        e.currentTarget.style.borderColor = colors.accentDark;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                        e.currentTarget.style.borderColor = colors.border;
                      }}
                    >
                      Hoje
                    </button>
                  </div>

                  <button
                    onClick={goToNextWeek}
                    style={{
                      padding: "8px",
                      backgroundColor: colors.accent,
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = colors.accentDark;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = colors.accent;
                    }}
                  >
                    <ChevronRight size={20} color={colors.primary} />
                  </button>
                </div>

                {/* Week Days */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(7, 1fr)",
                    gap: "12px",
                  }}
                >
                  {weekDates.map((date, index) => {
                    const isToday = isSameDay(date, today);
                    const isSelected = isSameDay(date, selectedDate);
                    const dayAppointments = getAppointmentsForDate(date);

                    return (
                      <motion.div
                        key={index}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedDate(date)}
                        style={{
                          padding: "16px 8px",
                          backgroundColor: isToday
                            ? colors.primary
                            : isSelected
                            ? colors.accent
                            : colors.cardBg,
                          border: isSelected && !isToday ? `2px solid ${colors.primary}` : `1px solid ${colors.border}`,
                          borderRadius: "12px",
                          cursor: "pointer",
                          textAlign: "center",
                          transition: "all 0.2s",
                          boxShadow: isSelected ? "0 4px 12px rgba(27, 77, 62, 0.15)" : "none",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "11px",
                            color: isToday ? "rgba(255,255,255,0.9)" : colors.textSecondary,
                            marginBottom: "4px",
                            fontWeight: "600",
                          }}
                        >
                          {daysOfWeek[date.getDay()]}
                        </div>
                        <div
                          style={{
                            fontSize: "20px",
                            fontWeight: "700",
                            color: isToday ? "#fff" : colors.textPrimary,
                          }}
                        >
                          {date.getDate()}
                        </div>
                        {dayAppointments.length > 0 && (
                          <div
                            style={{
                              marginTop: "6px",
                              fontSize: "10px",
                              fontWeight: "600",
                              color: isToday ? "#fff" : colors.primary,
                            }}
                          >
                            {dayAppointments.length} {dayAppointments.length === 1 ? "solicitação" : "solicitações"}
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>

            {/* Appointments List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div
                style={{
                  backgroundColor: colors.cardBg,
                  borderRadius: "16px",
                  padding: "24px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "20px",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "20px",
                      fontWeight: "700",
                      color: colors.primary,
                      margin: 0,
                    }}
                  >
                    {formatDate(selectedDate)}
                  </h3>
                  <div
                    style={{
                      backgroundColor: colors.accent,
                      color: colors.primary,
                      border: "none",
                      padding: "4px 12px",
                      borderRadius: "6px",
                      fontSize: "13px",
                      fontWeight: "600",
                    }}
                  >
                    {selectedDayAppointments.length}{" "}
                    {selectedDayAppointments.length === 1 ? "solicitação" : "solicitações"}
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <AnimatePresence>
                    {selectedDayAppointments.length > 0 ? (
                      selectedDayAppointments.map((sol, index) => (
                        <motion.div
                          key={sol._id || index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ scale: 1.01 }}
                          style={{
                            position: "relative",
                            padding: "24px",
                            background: "#FFFFFF",
                            borderRadius: "16px",
                            boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                            border: `1px solid ${colors.border}`,
                            overflow: "hidden",
                            transition: "all 0.2s ease",
                          }}
                        >
                          {/* Colored accent bar */}
                          <div
                            style={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              width: "5px",
                              height: "100%",
                              background: `linear-gradient(180deg, ${getStatusColor(sol.status)} 0%, ${colors.secondary} 100%)`,
                            }}
                          />

                          {/* Header with Time and Status Badge */}
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              marginBottom: "16px",
                              paddingBottom: "12px",
                              borderBottom: `1px solid ${colors.border}`,
                            }}
                          >
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                              <div
                                style={{
                                  width: "40px",
                                  height: "40px",
                                  borderRadius: "12px",
                                  background: `linear-gradient(135deg, ${colors.accent} 0%, ${colors.accentDark}20 100%)`,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <Clock size={20} color={colors.primary} strokeWidth={2.5} />
                              </div>
                              <div>
                                <div
                                  style={{
                                    fontSize: "18px",
                                    fontWeight: "700",
                                    color: colors.primary,
                                    lineHeight: "1.2",
                                  }}
                                >
                                  {formatTime(sol.hora)}
                                </div>
                                {sol.tempo_estimado && (
                                  <div
                                    style={{
                                      fontSize: "12px",
                                      color: colors.textSecondary,
                                      marginTop: "2px",
                                    }}
                                  >
                                    Duração: {sol.tempo_estimado}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div
                              style={{
                                padding: "6px 14px",
                                borderRadius: "20px",
                                background: getStatusColor(sol.status),
                                fontSize: "12px",
                                fontWeight: "600",
                                color: "#FFFFFF",
                                textTransform: "capitalize",
                              }}
                            >
                              {getStatusLabel(sol.status)}
                            </div>
                          </div>

                          {/* Service Type */}
                          {sol.tipoServico && (
                            <div style={{ marginBottom: "16px" }}>
                              <div
                                style={{
                                  fontSize: "20px",
                                  fontWeight: "700",
                                  color: colors.textPrimary,
                                  lineHeight: "1.3",
                                }}
                              >
                                {sol.tipoServico}
                              </div>
                            </div>
                          )}

                          {/* Details */}
                          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "12px" }}>
                            {/* Machine */}
                            {sol.maquina_id && (
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "12px",
                                  padding: "12px",
                                  borderRadius: "10px",
                                  background: colors.background,
                                }}
                              >
                                <div
                                  style={{
                                    width: "36px",
                                    height: "36px",
                                    borderRadius: "10px",
                                    background: "#FFFFFF",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    flexShrink: 0,
                                  }}
                                >
                                  <Wrench size={18} color={colors.primary} />
                                </div>
                                <div style={{ flex: 1 }}>
                                  <div
                                    style={{
                                      fontSize: "11px",
                                      color: colors.textSecondary,
                                      marginBottom: "2px",
                                      textTransform: "uppercase",
                                      letterSpacing: "0.5px",
                                    }}
                                  >
                                    Máquina
                                  </div>
                                  <div
                                    style={{
                                      fontSize: "14px",
                                      fontWeight: "600",
                                      color: colors.textPrimary,
                                    }}
                                  >
                                    {sol.maquina_id}
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Observation */}
                            {sol.observacao && (
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "flex-start",
                                  gap: "12px",
                                  padding: "12px",
                                  borderRadius: "10px",
                                  background: colors.background,
                                }}
                              >
                                <div
                                  style={{
                                    width: "36px",
                                    height: "36px",
                                    borderRadius: "10px",
                                    background: "#FFFFFF",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    flexShrink: 0,
                                  }}
                                >
                                  <Info size={18} color={colors.primary} />
                                </div>
                                <div style={{ flex: 1 }}>
                                  <div
                                    style={{
                                      fontSize: "11px",
                                      color: colors.textSecondary,
                                      marginBottom: "2px",
                                      textTransform: "uppercase",
                                      letterSpacing: "0.5px",
                                    }}
                                  >
                                    Observação
                                  </div>
                                  <div
                                    style={{
                                      fontSize: "14px",
                                      fontWeight: "500",
                                      color: colors.textPrimary,
                                      lineHeight: "1.5",
                                    }}
                                  >
                                    {sol.observacao}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Footer */}
                          {sol.data_solicitacao && (
                            <div
                              style={{
                                marginTop: "16px",
                                paddingTop: "12px",
                                borderTop: `1px solid ${colors.border}`,
                                fontSize: "11px",
                                color: colors.textSecondary,
                              }}
                            >
                              Solicitado em:{" "}
                              {new Date(sol.data_solicitacao).toLocaleDateString("pt-BR", {
                                day: "2-digit",
                                month: "long",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </div>
                          )}
                        </motion.div>
                      ))
                    ) : (
                      <div
                        style={{
                          textAlign: "center",
                          padding: "60px 20px",
                          color: colors.textSecondary,
                        }}
                      >
                        <Calendar size={48} style={{ color: "#D1D5DB", margin: "0 auto 16px" }} />
                        <p style={{ margin: 0 }}>Nenhuma solicitação para este dia</p>
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Action Cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {/* New Request Card */}
            <motion.a
              href="/solicitacoes/create"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.02, y: -4 }}
              style={{
                textDecoration: "none",
                display: "block",
                backgroundColor: colors.cardBg,
                borderRadius: "16px",
                padding: "24px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                border: "2px solid transparent",
                transition: "all 0.3s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = colors.primary;
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(27, 77, 62, 0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "transparent";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)";
              }}
            >
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "14px",
                  background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "16px",
                }}
              >
                <Plus size={28} color="#FFFFFF" strokeWidth={2.5} />
              </div>
              <h3
                style={{
                  fontSize: "20px",
                  fontWeight: "700",
                  color: colors.primary,
                  marginBottom: "8px",
                }}
              >
                Nova Solicitação
              </h3>
              <p
                style={{
                  fontSize: "14px",
                  color: colors.textSecondary,
                  lineHeight: "1.6",
                  margin: 0,
                }}
              >
                Solicite o uso de maquinários agrícolas para suas necessidades
              </p>
            </motion.a>

            {/* My Requests Card */}
            <motion.a
              href="/solicitacoes/list"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.02, y: -4 }}
              style={{
                textDecoration: "none",
                display: "block",
                backgroundColor: colors.cardBg,
                borderRadius: "16px",
                padding: "24px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                border: "2px solid transparent",
                transition: "all 0.3s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = colors.primary;
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(27, 77, 62, 0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "transparent";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)";
              }}
            >
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "14px",
                  background: `linear-gradient(135deg, ${colors.accentDark} 0%, ${colors.primary} 100%)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "16px",
                }}
              >
                <FileText size={28} color="#FFFFFF" strokeWidth={2.5} />
              </div>
              <h3
                style={{
                  fontSize: "20px",
                  fontWeight: "700",
                  color: colors.primary,
                  marginBottom: "8px",
                }}
              >
                Minhas Solicitações
              </h3>
              <p
                style={{
                  fontSize: "14px",
                  color: colors.textSecondary,
                  lineHeight: "1.6",
                  margin: 0,
                }}
              >
                Acompanhe o status e detalhes de todas as suas solicitações
              </p>
            </motion.a>

            {/* Summary Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              style={{
                backgroundColor: colors.cardBg,
                borderRadius: "16px",
                padding: "24px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              }}
            >
              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: "700",
                  color: colors.primary,
                  marginBottom: "20px",
                }}
              >
                Resumo
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div
                  style={{
                    padding: "16px",
                    backgroundColor: colors.accent,
                    borderRadius: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: colors.textSecondary,
                        marginBottom: "4px",
                      }}
                    >
                      Total de Solicitações
                    </div>
                    <div
                      style={{
                        fontSize: "28px",
                        fontWeight: "700",
                        color: colors.primary,
                      }}
                    >
                      {minhasSolicitacoes.length}
                    </div>
                  </div>
                  <FileText size={32} color={colors.primary} style={{ opacity: 0.5 }} />
                </div>

                <div
                  style={{
                    padding: "16px",
                    backgroundColor: "#FEF3C7",
                    borderRadius: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: colors.textSecondary,
                        marginBottom: "4px",
                      }}
                    >
                      Esta Semana
                    </div>
                    <div
                      style={{
                        fontSize: "28px",
                        fontWeight: "700",
                        color: "#92400E",
                      }}
                    >
                      {weekDates.reduce((acc, date) => acc + getAppointmentsForDate(date).length, 0)}
                    </div>
                  </div>
                  <Calendar size={32} color="#92400E" style={{ opacity: 0.5 }} />
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Info Card at Bottom */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          style={{
            marginTop: "24px",
            backgroundColor: colors.cardBg,
            borderRadius: "16px",
            padding: "24px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                background: `linear-gradient(135deg, ${colors.accent} 0%, ${colors.accentDark}20 100%)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Info size={20} color={colors.primary} />
            </div>
            <h3
              style={{
                fontSize: "20px",
                fontWeight: "700",
                color: colors.primary,
                margin: 0,
              }}
            >
              Informações Importantes
            </h3>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "16px" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
              <CheckCircle size={20} color={colors.success} style={{ flexShrink: 0, marginTop: "2px" }} />
              <p style={{ margin: 0, fontSize: "14px", color: colors.textSecondary, lineHeight: "1.6" }}>
                Todas as solicitações passam por análise antes da aprovação
              </p>
            </div>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
              <CheckCircle size={20} color={colors.success} style={{ flexShrink: 0, marginTop: "2px" }} />
              <p style={{ margin: 0, fontSize: "14px", color: colors.textSecondary, lineHeight: "1.6" }}>
                Você será notificado sobre mudanças no status das suas solicitações
              </p>
            </div>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
              <CheckCircle size={20} color={colors.success} style={{ flexShrink: 0, marginTop: "2px" }} />
              <p style={{ margin: 0, fontSize: "14px", color: colors.textSecondary, lineHeight: "1.6" }}>
                É importante especificar corretamente a data e horário desejados
              </p>
            </div>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
              <AlertCircle size={20} color={colors.warning} style={{ flexShrink: 0, marginTop: "2px" }} />
              <p style={{ margin: 0, fontSize: "14px", color: colors.textSecondary, lineHeight: "1.6" }}>
                Em caso de dúvidas, entre em contato com a administração
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
