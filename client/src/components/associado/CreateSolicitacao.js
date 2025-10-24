import React, { useEffect, useState } from "react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isToday,
  isSameDay,
  isWeekend,
  isBefore,
  startOfDay,
} from "date-fns";
import ptBR from "date-fns/locale/pt-BR";

const API_URL = "http://localhost:5050";

export default function CreateSolicitacao() {
  const [etapa, setEtapa] = useState(1);
  const [dataSelecionada, setDataSelecionada] = useState(null);
  const [mesAtual, setMesAtual] = useState(new Date());
  const [servicosDisponiveis, setServicosDisponiveis] = useState([]);
  const [agendamentosAprovados, setAgendamentosAprovados] = useState([]);
  const [form, setForm] = useState({
    tipoServico: "",
    hora: "",
    tempo: "",
    observacao: "",
  });

  const [focusField, setFocusField] = useState(null);

  const fetchAgendamentosAprovados = () => {
    fetch(`${API_URL}/solicitacoes?status=aprovado`)
      .then((res) => res.json())
      .then((data) => {
        setAgendamentosAprovados(
          data.map((item) => new Date(item.data_servico))
        );
      })
      .catch((err) =>
        console.error("Erro ao buscar agendamentos aprovados:", err)
      );
  };

  useEffect(() => {
    fetch(`${API_URL}/servicos`)
      .then((res) => res.json())
      .then((data) => setServicosDisponiveis(data))
      .catch((err) => console.error("Erro ao buscar serviços:", err));
    fetchAgendamentosAprovados();
  }, []);

  const nomesDias = ["Seg", "Ter", "Qua", "Qui", "Sex"];

  function diasDoCalendario(mes) {
    const inicio = startOfWeek(startOfMonth(mes), { weekStartsOn: 1 });
    const fim = endOfWeek(endOfMonth(mes), { weekStartsOn: 1 });
    const dias = eachDayOfInterval({ start: inicio, end: fim });

    return dias.filter((day) => !isWeekend(day));
  }

  function selecionarData(dia) {
    setDataSelecionada(dia);
    setEtapa(2);
  }

  function handleInput(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function enviarFormulario() {
    const usuarioLogadoString = localStorage.getItem("usuarioLogado");

    if (!usuarioLogadoString) {
      alert("Erro: nenhum usuário logado encontrado.");
      return;
    }

    let usuarioLogado;
    try {
      usuarioLogado = JSON.parse(usuarioLogadoString);
    } catch {
      alert("Erro: dados de usuário inválidos.");
      return;
    }

    if (!usuarioLogado._id) {
      alert("Erro: ID do usuário não encontrado.");
      return;
    }

    const novaSolicitacao = {
      usuario_id: usuarioLogado._id,
      data: dataSelecionada,
      tipoServico: form.tipoServico,
      hora: form.hora,
      tempo: form.tempo,
      observacao: form.observacao,
    };

    fetch(`${API_URL}/solicitacoes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(novaSolicitacao),
    })
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "Erro ao criar solicitação");
        }
        return res.json();
      })
      .then((data) => {
        alert("Solicitação enviada com sucesso!");
        setForm({ tipoServico: "", hora: "", tempo: "", observacao: "" });
        setEtapa(1);
        setDataSelecionada(null);
        fetchAgendamentosAprovados();
      })
      .catch((err) => {
        console.error(err);
        alert("Erro ao enviar solicitação. Veja o console para detalhes.");
      });
  }

  const dias = diasDoCalendario(mesAtual);

  const isDayAprovado = (day) => {
    return agendamentosAprovados.some((aprovadoDate) =>
      isSameDay(day, aprovadoDate)
    );
  };

  const isDayInCurrentMonth = (day) => {
    return day.getMonth() === mesAtual.getMonth();
  };

  const isPastDate = (day) => {
    return isBefore(startOfDay(day), startOfDay(new Date()));
  };

  const canGoToPreviousMonth = () => {
    const currentMonth = startOfMonth(new Date());
    const displayedMonth = startOfMonth(mesAtual);
    return !isBefore(displayedMonth, currentMonth);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "24px 16px",
      }}
    >
      <div
        style={{
          maxWidth: "640px",
          margin: "0 auto",
        }}
      >
        {/* Header Section with Step Indicator */}
        <div style={{ marginBottom: "24px" }}>
          {/* Step Progress */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              marginBottom: "20px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  backgroundColor: etapa >= 1 ? "#1B4D3E" : "#E5E7EB",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "700",
                  fontSize: "14px",
                  transition: "all 0.3s ease",
                  boxShadow:
                    etapa >= 1 ? "0 2px 8px rgba(27, 77, 62, 0.3)" : "none",
                }}
              >
                {etapa > 1 ? (
                  <svg
                    style={{ width: "16px", height: "16px" }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  "1"
                )}
              </div>
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: "600",
                  color: etapa >= 1 ? "#1B4D3E" : "#9CA3AF",
                }}
              >
                Escolha a Data
              </span>
            </div>

            <div
              style={{
                width: "60px",
                height: "2px",
                backgroundColor: etapa >= 2 ? "#1B4D3E" : "#E5E7EB",
                borderRadius: "2px",
                transition: "all 0.3s ease",
              }}
            />

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  backgroundColor: etapa >= 2 ? "#1B4D3E" : "#E5E7EB",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "700",
                  fontSize: "14px",
                  transition: "all 0.3s ease",
                  boxShadow:
                    etapa >= 2 ? "0 2px 8px rgba(27, 77, 62, 0.3)" : "none",
                }}
              >
                2
              </div>
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: "600",
                  color: etapa >= 2 ? "#1B4D3E" : "#9CA3AF",
                }}
              >
                Preencha os Detalhes
              </span>
            </div>
          </div>

          {/* Title and Description */}
          <div style={{ textAlign: "center" }}>
            <h1
              style={{
                fontSize: "28px",
                fontWeight: "700",
                color: "#1B4D3E",
                marginBottom: "8px",
                letterSpacing: "-0.02em",
              }}
            >
              {etapa === 1 ? " " : "   "}
            </h1>
            <p
              style={{
                color: "#6B7280",
                fontSize: "13px",
                maxWidth: "480px",
                margin: "0 auto",
                lineHeight: "1.5",
              }}
            >
              {etapa === 1
                ? ""
                : ""}
            </p>
          </div>
        </div>

        {/* Etapa 1: Calendário */}
        {etapa === 1 && (
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: "16px",
              padding: "20px",
              boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
              border: "1px solid rgba(27, 77, 62, 0.1)",
            }}
          >
            {/* Calendar Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "24px",
                padding: "0 4px",
              }}
            >
              <button
                onClick={() => canGoToPreviousMonth() && setMesAtual(subMonths(mesAtual, 1))}
                disabled={!canGoToPreviousMonth()}
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "8px",
                  border: "2px solid #E5E7EB",
                  backgroundColor: canGoToPreviousMonth() ? "#fff" : "#F3F4F6",
                  color: canGoToPreviousMonth() ? "#1B4D3E" : "#D1D5DB",
                  fontSize: "18px",
                  fontWeight: "600",
                  cursor: canGoToPreviousMonth() ? "pointer" : "not-allowed",
                  transition: "all 0.3s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: canGoToPreviousMonth() ? 1 : 0.5,
                }}
                onMouseEnter={(e) => {
                  if (canGoToPreviousMonth()) {
                    e.currentTarget.style.backgroundColor = "#1B4D3E";
                    e.currentTarget.style.color = "#fff";
                    e.currentTarget.style.borderColor = "#1B4D3E";
                    e.currentTarget.style.transform = "scale(1.05)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (canGoToPreviousMonth()) {
                    e.currentTarget.style.backgroundColor = "#fff";
                    e.currentTarget.style.color = "#1B4D3E";
                    e.currentTarget.style.borderColor = "#E5E7EB";
                    e.currentTarget.style.transform = "scale(1)";
                  }
                }}
              >
                <svg
                  style={{ width: "18px", height: "18px" }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              <div style={{ textAlign: "center" }}>
                <h3
                  style={{
                    margin: 0,
                    color: "#1B4D3E",
                    fontSize: "18px",
                    fontWeight: "700",
                    textTransform: "capitalize",
                  }}
                >
                  {format(mesAtual, "MMMM yyyy", { locale: ptBR })}
                </h3>
              </div>

              <button
                onClick={() => setMesAtual(addMonths(mesAtual, 1))}
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "8px",
                  border: "2px solid #E5E7EB",
                  backgroundColor: "#fff",
                  color: "#1B4D3E",
                  fontSize: "18px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#1B4D3E";
                  e.currentTarget.style.color = "#fff";
                  e.currentTarget.style.borderColor = "#1B4D3E";
                  e.currentTarget.style.transform = "scale(1.05)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#fff";
                  e.currentTarget.style.color = "#1B4D3E";
                  e.currentTarget.style.borderColor = "#E5E7EB";
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                <svg
                  style={{ width: "18px", height: "18px" }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>

            {/* Calendar Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(5, 1fr)",
                gap: "10px",
              }}
            >
              {/* Day Names */}
              {nomesDias.map((dia) => (
                <div
                  key={dia}
                  style={{
                    fontWeight: "700",
                    fontSize: "11px",
                    color: "#1B4D3E",
                    textAlign: "center",
                    paddingBottom: "10px",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  {dia}
                </div>
              ))}

              {/* Days */}
              {dias.map((dia, index) => {
                const inMonth = isDayInCurrentMonth(dia);
                const isPast = isPastDate(dia);
                const isAprovado = inMonth && isDayAprovado(dia);
                const isClickable = inMonth && !isAprovado && !isPast;
                const isHoje = isToday(dia);

                return (
                  <div
                    key={index}
                    onClick={() => isClickable && selecionarData(dia)}
                    style={{
                      minHeight: "56px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "12px",
                      cursor: isClickable ? "pointer" : "not-allowed",
                      fontWeight: "700",
                      fontSize: "14px",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      border: isHoje
                        ? "2px solid #1B4D3E"
                        : "2px solid transparent",
                      backgroundColor: isAprovado
                        ? "#1B4D3E"
                        : isClickable
                        ? "#F0FDF4"
                        : inMonth && isPast
                        ?  "rgba(218, 218, 218, 0.25)"
                        : inMonth
                        ? "#F3F4F6"
                        : "transparent",
                      color: isAprovado
                        ? "#fff"
                        : isClickable
                        ? "#065F46"
                        : inMonth && isPast
                        ? "#3a3a3a"
                        : inMonth
                        ? "#D1D5DB"
                        : "transparent",
                      boxShadow: isClickable
                        ? "0 1px 4px rgba(0, 0, 0, 0.06)"
                        : isAprovado
                        ? "0 2px 8px rgba(27, 77, 62, 0.3)"
                        : "none",
                      position: "relative",
                    }}
                    onMouseEnter={(e) => {
                      if (isClickable) {
                        e.currentTarget.style.transform =
                          "translateY(-4px) scale(1.05)";
                        e.currentTarget.style.boxShadow =
                          "0 8px 16px rgba(27, 77, 62, 0.15)";
                        e.currentTarget.style.backgroundColor = "#DCFCE7";
                        e.currentTarget.style.borderColor = "#10B981";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (isClickable) {
                        e.currentTarget.style.transform =
                          "translateY(0) scale(1)";
                        e.currentTarget.style.boxShadow =
                          "0 1px 4px rgba(0, 0, 0, 0.06)";
                        e.currentTarget.style.backgroundColor = "#F0FDF4";
                        e.currentTarget.style.borderColor = "transparent";
                      }
                    }}
                  >
                    {inMonth && (
                      <>
                        <span>{dia.getDate()}</span>
                        {isAprovado && (
                          <div
                            style={{
                              fontSize: "8px",
                              marginTop: "2px",
                              opacity: 0.9,
                              fontWeight: "600",
                            }}
                          >
                            Ocupado
                          </div>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div
              style={{
                marginTop: "24px",
                padding: "16px",
                backgroundColor: "#F9FAFB",
                borderRadius: "12px",
                display: "flex",
                justifyContent: "center",
                gap: "20px",
                flexWrap: "wrap",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <div
                  style={{
                    width: "18px",
                    height: "18px",
                    borderRadius: "6px",
                    backgroundColor: "#F0FDF4",
                    border: "2px solid #10B981",
                  }}
                />
                <span
                  style={{ fontSize: "12px", color: "#374151", fontWeight: "600" }}
                >
                  Disponível
                </span>
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <div
                  style={{
                    width: "18px",
                    height: "18px",
                    borderRadius: "6px",
                    backgroundColor: "#1B4D3E",
                  }}
                />
                <span
                  style={{ fontSize: "12px", color: "#374151", fontWeight: "600" }}
                >
                  Agendado
                </span>
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <div
                  style={{
                    width: "18px",
                    height: "18px",
                    borderRadius: "6px",
                    backgroundColor: "#F3F4F6",
                  }}
                />
                <span
                  style={{ fontSize: "12px", color: "#374151", fontWeight: "600" }}
                >
                  Indisponível
                </span>
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <div
                  style={{
                    width: "18px",
                    height: "18px",
                    borderRadius: "6px",
                    backgroundColor:  "#dadada",
                    border:"#3a3a3a",
                  }}
                />
                <span
                  style={{ fontSize: "12px", color: "#374151", fontWeight: "600" }}
                >
                  Data Passada
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Etapa 2: Formulário */}
        {etapa === 2 && (
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: "16px",
              padding: "24px",
              boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
              border: "1px solid rgba(27, 77, 62, 0.1)",
            }}
          >
            {/* Selected Date Display */}
            <div
              style={{
                textAlign: "center",
                padding: "18px",
                background: "linear-gradient(135deg, #1B4D3E 0%, #0F3A2D 100%)",
                borderRadius: "12px",
                marginBottom: "24px",
                boxShadow: "0 2px 12px rgba(27, 77, 62, 0.2)",
              }}
            >
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  marginBottom: "6px",
                }}
              >
                <svg
                  style={{ width: "16px", height: "16px", color: "#D1FAE5" }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <div
                  style={{
                    fontSize: "11px",
                    color: "#D1FAE5",
                    fontWeight: "600",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Data Selecionada
                </div>
              </div>
              <div
                style={{
                  fontSize: "18px",
                  fontWeight: "700",
                  color: "#fff",
                  textTransform: "capitalize",
                }}
              >
                {format(dataSelecionada, "dd 'de' MMMM 'de' yyyy", {
                  locale: ptBR,
                })}
              </div>
            </div>

            {/* Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                enviarFormulario();
              }}
            >
              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    marginBottom: "8px",
                    fontWeight: "600",
                    color: "#1F2937",
                    fontSize: "13px",
                  }}
                >
                  <svg
                    style={{ width: "16px", height: "16px", color: "#1B4D3E" }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  Tipo de Serviço
                </label>
                <select
                  name="tipoServico"
                  value={form.tipoServico}
                  onChange={handleInput}
                  onFocus={() => setFocusField("tipoServico")}
                  onBlur={() => setFocusField(null)}
                  required
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "10px",
                    border: "2px solid #E5E7EB",
                    fontSize: "13px",
                    outline: "none",
                    transition: "all 0.3s ease",
                    boxSizing: "border-box",
                    backgroundColor: "#fff",
                    color: "#1F2937",
                    borderColor:
                      focusField === "tipoServico" ? "#1B4D3E" : "#E5E7EB",
                    boxShadow:
                      focusField === "tipoServico"
                        ? "0 0 0 3px rgba(27, 77, 62, 0.1)"
                        : "none",
                  }}
                >
                  <option value="">Selecione um serviço...</option>
                  {servicosDisponiveis.map((s) => (
                    <option key={s._id} value={s.nome}>
                      {s.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                  gap: "16px",
                  marginBottom: "20px",
                }}
              >
                <div>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      marginBottom: "8px",
                      fontWeight: "600",
                      color: "#1F2937",
                      fontSize: "13px",
                    }}
                  >
                    <svg
                      style={{ width: "16px", height: "16px", color: "#1B4D3E" }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Horário de Início
                  </label>
                  <input
                    name="hora"
                    type="time"
                    min="07:00"
                    max="17:00"
                    value={form.hora}
                    onChange={handleInput}
                    onFocus={() => setFocusField("hora")}
                    onBlur={() => setFocusField(null)}
                    required
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: "10px",
                      border: "2px solid #E5E7EB",
                      fontSize: "13px",
                      outline: "none",
                      transition: "all 0.3s ease",
                      boxSizing: "border-box",
                      borderColor: focusField === "hora" ? "#1B4D3E" : "#E5E7EB",
                      boxShadow:
                        focusField === "hora"
                          ? "0 0 0 3px rgba(27, 77, 62, 0.1)"
                          : "none",
                    }}
                  />
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#9CA3AF",
                      marginTop: "4px",
                    }}
                  >
                    Disponível das 07:00 às 17:00
                  </div>
                </div>

                <div>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      marginBottom: "8px",
                      fontWeight: "600",
                      color: "#1F2937",
                      fontSize: "13px",
                    }}
                  >
                    <svg
                      style={{ width: "16px", height: "16px", color: "#1B4D3E" }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                    Duração Estimada
                  </label>
                  <select
                    name="tempo"
                    value={form.tempo}
                    onChange={handleInput}
                    onFocus={() => setFocusField("tempo")}
                    onBlur={() => setFocusField(null)}
                    required
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: "10px",
                      border: "2px solid #E5E7EB",
                      fontSize: "13px",
                      outline: "none",
                      transition: "all 0.3s ease",
                      boxSizing: "border-box",
                      backgroundColor: "#fff",
                      color: "#1F2937",
                      borderColor: focusField === "tempo" ? "#1B4D3E" : "#E5E7EB",
                      boxShadow:
                        focusField === "tempo"
                          ? "0 0 0 3px rgba(27, 77, 62, 0.1)"
                          : "none",
                    }}
                  >
                    <option value="">Selecione a duração...</option>
                    <option value="1 hora">1 hora</option>
                    <option value="2 horas">2 horas</option>
                    <option value="3 horas">3 horas</option>
                    <option value="4 horas">4 horas</option>
                    <option value="5 horas">5 horas</option>
                    <option value="6 horas">6 horas</option>
                    <option value="7 horas">7 horas</option>
                    <option value="8 horas">8 horas</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: "24px" }}>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    marginBottom: "8px",
                    fontWeight: "600",
                    color: "#1F2937",
                    fontSize: "13px",
                  }}
                >
                  <svg
                    style={{ width: "16px", height: "16px", color: "#1B4D3E" }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Observações{" "}
                  <span style={{ color: "#9CA3AF", fontWeight: "400" }}>
                    (opcional)
                  </span>
                </label>
                <textarea
                  name="observacao"
                  placeholder="Adicione informações adicionais sobre o agendamento..."
                  value={form.observacao}
                  onChange={handleInput}
                  onFocus={() => setFocusField("observacao")}
                  onBlur={() => setFocusField(null)}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "10px",
                    border: "2px solid #E5E7EB",
                    fontSize: "13px",
                    outline: "none",
                    transition: "all 0.3s ease",
                    boxSizing: "border-box",
                    minHeight: "100px",
                    resize: "vertical",
                    fontFamily: "'Segoe UI', sans-serif",
                    borderColor:
                      focusField === "observacao" ? "#1B4D3E" : "#E5E7EB",
                    boxShadow:
                      focusField === "observacao"
                        ? "0 0 0 3px rgba(27, 77, 62, 0.1)"
                        : "none",
                  }}
                />
              </div>

              {/* Form Actions */}
              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  justifyContent: "flex-end",
                  paddingTop: "16px",
                  borderTop: "1px solid #E5E7EB",
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    setEtapa(1);
                    setDataSelecionada(null);
                    setForm({
                      tipoServico: "",
                      hora: "",
                      tempo: "",
                      observacao: "",
                    });
                  }}
                  style={{
                    padding: "10px 20px",
                    borderRadius: "10px",
                    border: "2px solid #E5E7EB",
                    backgroundColor: "#fff",
                    color: "#6B7280",
                    fontSize: "13px",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#F9FAFB";
                    e.currentTarget.style.borderColor = "#D1D5DB";
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#fff";
                    e.currentTarget.style.borderColor = "#E5E7EB";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  ← Voltar
                </button>

                <button
                  type="submit"
                  style={{
                    padding: "10px 28px",
                    borderRadius: "10px",
                    border: "none",
                    background: "linear-gradient(135deg, #1B4D3E 0%, #0F3A2D 100%)",
                    color: "#fff",
                    fontSize: "13px",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    boxShadow: "0 2px 12px rgba(27, 77, 62, 0.3)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-1px)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 16px rgba(27, 77, 62, 0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 2px 12px rgba(27, 77, 62, 0.3)";
                  }}
                >
                  Enviar Solicitação →
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
