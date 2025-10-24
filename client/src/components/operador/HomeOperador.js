import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, MapPin, User, CloudSun, Droplets, Wind, AlertCircle, CheckCircle2, ChevronLeft, ChevronRight, Sun, Moon, Cloud, CloudRain, CloudDrizzle, CloudSnow, CloudFog, Cloudy, Zap } from "lucide-react";

const API_URL = "http://localhost:5050";

// TODO: Replace with actual logged-in operator ID
const OPERATOR_ID = "op_123";

// Weather API Configuration
const WEATHER_API_KEY = "ce2c48ee6e71632d82c97b20ae0ec4e5";
const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=-29.1508&lon=-49.5836&appid=${WEATHER_API_KEY}&units=metric&lang=pt_br`;

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
};

export default function OperatorSchedule() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [agendamentos, setAgendamentos] = useState([]);
  const [usuarios, setUsuarios] = useState({});
  const [loading, setLoading] = useState(true);
  const [weatherData, setWeatherData] = useState({
    temp: 28,
    condition: "Carregando...",
    humidity: 65,
    wind: 12,
    rain: 0,
    iconCode: "01d",
    isIdeal: true,
  });
  const [weatherLoading, setWeatherLoading] = useState(true);

  useEffect(() => {
    fetchAgendamentosEUsuarios();
    fetchWeatherData();
  }, []);

  const fetchAgendamentosEUsuarios = async () => {
    try {
      setLoading(true);
      
      // Busca as solicitações
      const responseAgendamentos = await fetch(`${API_URL}/solicitacoes`);
      if (!responseAgendamentos.ok) {
        console.error("Failed to fetch agendamentos. Status:", responseAgendamentos.status);
        setAgendamentos([]);
        return;
      }

      const data = await responseAgendamentos.json();
      const approved = data.filter((ag) => ag.status === "aprovado");

      // Busca todos os usuários/associados
      try {
        const responseUsuarios = await fetch(`${API_URL}/associados`);
        if (responseUsuarios.ok) {
          const usuariosData = await responseUsuarios.json();
          
          // Cria um mapeamento de ID -> nome
          const usuariosMap = {};
          usuariosData.forEach(usuario => {
            usuariosMap[usuario._id] = usuario.nome || "Associado";
          });
          
          setUsuarios(usuariosMap);
        }
      } catch (error) {
        console.error("Erro ao buscar usuários:", error);
      }

      setAgendamentos(approved);
    } catch (error) {
      console.error("Erro ao buscar agendamentos:", error);
      setAgendamentos([]);
    } finally {
      setLoading(false);
    }
  };

  const getNomeUsuario = (usuarioId) => {
    return usuarios[usuarioId] || usuarioId || "Não informado";
  };

  const getWeatherIcon = (weatherCode) => {
    const iconMap = {
      "01d": Sun,
      "01n": Moon,
      "02d": CloudSun,
      "02n": Cloud,
      "03d": Cloud,
      "03n": Cloud,
      "04d": Cloudy,
      "04n": Cloudy,
      "09d": CloudDrizzle,
      "09n": CloudDrizzle,
      "10d": CloudRain,
      "10n": CloudRain,
      "11d": Zap,
      "11n": Zap,
      "13d": CloudSnow,
      "13n": CloudSnow,
      "50d": CloudFog,
      "50n": CloudFog,
    };
    return iconMap[weatherCode] || Cloud;
  };

  const getWeatherIconColor = (weatherCode) => {
    const colorMap = {
      "01d": "#F59E0B",
      "01n": "#6366F1",
      "02d": "#F59E0B",
      "02n": "#6B7280",
      "03d": "#6B7280",
      "03n": "#6B7280",
      "04d": "#6B7280",
      "04n": "#6B7280",
      "09d": "#3B82F6",
      "09n": "#3B82F6",
      "10d": "#3B82F6",
      "10n": "#3B82F6",
      "11d": "#8B5CF6",
      "11n": "#8B5CF6",
      "13d": "#60A5FA",
      "13n": "#60A5FA",
      "50d": "#9CA3AF",
      "50n": "#9CA3AF",
    };
    return colorMap[weatherCode] || "#6B7280";
  };

  const isWeatherIdeal = (temp, wind, rain, clouds) => {
    return temp >= 15 && temp <= 32 && wind < 20 && rain === 0 && clouds < 80;
  };

  const fetchWeatherData = async () => {
    try {
      setWeatherLoading(true);

      const response = await fetch(WEATHER_API_URL);
      if (!response.ok) throw new Error("Falha ao buscar dados climáticos");

      const data = await response.json();

      const forecastForToday = data.list.filter((item) => {
        const itemDate = new Date(item.dt * 1000);
        return isSameDay(itemDate, new Date());
      });

      if (!forecastForToday.length) throw new Error("Nenhuma previsão para hoje");

      const temp = Math.round(forecastForToday.reduce((sum, item) => sum + item.main.temp, 0) / forecastForToday.length);
      const humidity = Math.round(forecastForToday.reduce((sum, item) => sum + item.main.humidity, 0) / forecastForToday.length);
      const windSpeed = (forecastForToday.reduce((sum, item) => sum + item.wind.speed, 0) / forecastForToday.length) * 3.6;

      const rainChance = Math.round(
        (forecastForToday.reduce((sum, item) => {
          return sum + (item.pop ?? 0.05);
        }, 0) / forecastForToday.length) * 100
      );

      const iconCounts = {};
      forecastForToday.forEach(item => {
        const code = item.weather[0].icon;
        iconCounts[code] = (iconCounts[code] || 0) + 1;
      });
      const iconCode = Object.keys(iconCounts).reduce((a, b) => (iconCounts[a] > iconCounts[b] ? a : b));

      const condition = forecastForToday[0].weather[0].description
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      const isIdeal = isWeatherIdeal(temp, windSpeed, rainChance, forecastForToday[0].clouds.all);

      setWeatherData({
        temp,
        condition,
        humidity,
        wind: windSpeed.toFixed(1),
        rain: rainChance,
        iconCode,
        isIdeal,
      });

    } catch (error) {
      console.error("Erro ao buscar dados climáticos:", error);
      setWeatherData({
        temp: 28,
        condition: "Dados indisponíveis",
        humidity: 65,
        wind: 12,
        rain: 0,
        iconCode: "01d",
        isIdeal: false,
      });
    } finally {
      setWeatherLoading(false);
    }
  };

  const calculateEndTime = (startTime, durationString) => {
    if (!startTime || !durationString) return "--:--";

    const [hours, minutes] = startTime.split(":").map(Number);
    let totalMinutes = hours * 60 + minutes;

    let durationMinutes = 0;
    const match = durationString.match(/(\d+)\s*(h|m)/i);

    if (match) {
      const value = parseInt(match[1]);
      const unit = match[2].toLowerCase();
      if (unit === "h") {
        durationMinutes = value * 60;
      } else if (unit === "m") {
        durationMinutes = value;
      }
    }

    totalMinutes += durationMinutes;

    const endHours = Math.floor(totalMinutes / 60) % 24;
    const endMinutes = totalMinutes % 60;

    return `${String(endHours).padStart(2, "0")}:${String(endMinutes).padStart(2, "0")}`;
  };

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
    return agendamentos.filter((ag) => {
      const agDate = new Date(ag.data_servico);
      return isSameDay(agDate, date);
    });
  };

  const selectedDayAppointments = getAppointmentsForDate(selectedDate);

  const formatTime = (timeString) => {
    if (!timeString) return "--:--";
    const parts = timeString.split(":");
    return `${parts[0]}:${parts[1]}`;
  };

  const formatDate = (date) => {
    const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
    return `${date.getDate()} de ${months[date.getMonth()]}`;
  };

  const daysOfWeek = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

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
          background: `linear-gradient(135deg, ${colors.background} 0%, #E8E4D8 100%)`,
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
          <p style={{ color: colors.textSecondary }}>Carregando agendamentos...</p>
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
          style={{ marginBottom: "0px" }}
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
          </h1>
          <p style={{ color: colors.textSecondary, fontSize: "15px", margin: 0 }}>
          </p>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "24px" }}>
          {/* Left Column - Calendar */}
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
                      e.currentTarget.style.color = "#fff";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = colors.accent;
                      e.currentTarget.style.color = colors.primary;
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
                      e.currentTarget.style.color = "#fff";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = colors.accent;
                      e.currentTarget.style.color = colors.primary;
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
                            {dayAppointments.length} {dayAppointments.length === 1 ? "tarefa" : "tarefas"}
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
                    {selectedDayAppointments.length === 1 ? "agendamento" : "agendamentos"}
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <AnimatePresence>
                    {selectedDayAppointments.length > 0 ? (
                      selectedDayAppointments.map((ag, index) => (
                        <motion.div
                          key={ag._id || index}
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
                              backgroundColor: colors.primary,
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
                                  {formatTime(ag.hora)}
                                  {calculateEndTime(ag.hora, ag.tempo_estimado) !== "--:--" &&
                                    ` - ${calculateEndTime(ag.hora, ag.tempo_estimado)}`
                                  }
                                </div>
                                {ag.tempo_estimado && (
                                  <div
                                    style={{
                                      fontSize: "12px",
                                      color: colors.textSecondary,
                                      marginTop: "2px",
                                    }}
                                  >
                                    Duração: {ag.tempo_estimado}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div
                              style={{
                                padding: "6px 14px",
                                borderRadius: "20px",
                                background: colors.accent,
                                fontSize: "12px",
                                fontWeight: "600",
                                color: colors.primary,
                                textTransform: "capitalize",
                              }}
                            >
                              {ag.status}
                            </div>
                          </div>

                          {/* Service Type - Main Title */}
                          {ag.tipoServico && (
                            <div style={{ marginBottom: "16px" }}>
                              <div
                                style={{
                                  fontSize: "20px",
                                  fontWeight: "700",
                                  color: colors.textPrimary,
                                  lineHeight: "1.3",
                                }}
                              >
                                {ag.tipoServico}
                              </div>
                            </div>
                          )}

                          {/* Details Grid */}
                          <div
                            style={{
                              display: "grid",
                              gridTemplateColumns: "1fr",
                              gap: "12px",
                            }}
                          >
                            {/* Operator */}
                            {ag.usuario_id && (
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
                                  <User size={18} color={colors.primary} />
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
                                    Associado
                                  </div>
                                  <div
                                    style={{
                                      fontSize: "14px",
                                      fontWeight: "600",
                                      color: colors.textPrimary,
                                    }}
                                  >
                                    {getNomeUsuario(ag.usuario_id)}
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Observation */}
                            {ag.observacao && (
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
                                  <MapPin size={18} color={colors.primary} />
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
                                    {ag.observacao}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Footer with request date */}
                          {ag.data_solicitacao && (
                            <div
                              style={{
                                marginTop: "16px",
                                paddingTop: "12px",
                                borderTop: `1px solid ${colors.border}`,
                                fontSize: "11px",
                                color: colors.textSecondary,
                              }}
                            >
                              Solicitado em: {new Date(ag.data_solicitacao).toLocaleDateString("pt-BR", {
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
                        <p style={{ margin: 0 }}>Nenhum agendamento para este dia</p>
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {/* Weather Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div
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
                  Condições Climáticas
                </h3>

                <div style={{ textAlign: "center", padding: "20px 0" }}>
                  {weatherLoading ? (
                    <div style={{ padding: "40px 0" }}>
                      <div
                        style={{
                          width: "40px",
                          height: "40px",
                          border: "4px solid #E5E7EB",
                          borderTop: `4px solid ${colors.primary}`,
                          borderRadius: "50%",
                          animation: "spin 1s linear infinite",
                          margin: "0 auto",
                        }}
                      />
                    </div>
                  ) : (
                    <>
                      {(() => {
                        const WeatherIcon = getWeatherIcon(weatherData.iconCode);
                        const iconColor = getWeatherIconColor(weatherData.iconCode);
                        return (
                          <div
                            style={{
                              width: "80px",
                              height: "80px",
                              margin: "0 auto 16px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <WeatherIcon size={80} color={iconColor} strokeWidth={1.5} />
                          </div>
                        );
                      })()}
                      <div
                        style={{
                          fontSize: "48px",
                          fontWeight: "700",
                          color: colors.primary,
                          marginBottom: "8px",
                        }}
                      >
                        {weatherData.temp}°C
                      </div>
                      <div
                        style={{
                          fontSize: "16px",
                          color: colors.textPrimary,
                          marginBottom: "16px",
                        }}
                      >
                        {weatherData.condition}
                      </div>

                      {weatherData.isIdeal ? (
                        <div
                          style={{
                            padding: "8px 20px",
                            backgroundColor: colors.accent,
                            borderRadius: "20px",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <CheckCircle2 size={16} color={colors.accentDark} />
                          <span
                            style={{
                              fontSize: "13px",
                              fontWeight: "600",
                              color: colors.primary,
                            }}
                          >
                            Condições ideais para operação
                          </span>
                        </div>
                      ) : (
                        <div
                          style={{
                            padding: "8px 20px",
                            backgroundColor: "#FEF3C7",
                            borderRadius: "20px",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <AlertCircle size={16} color={colors.warning} />
                          <span
                            style={{
                              fontSize: "13px",
                              fontWeight: "600",
                              color: "#92400E",
                            }}
                          >
                            Atenção às condições climáticas
                          </span>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Weather Details */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    gap: "16px",
                    marginTop: "24px",
                    paddingTop: "20px",
                    borderTop: `1px solid ${colors.border}`,
                  }}
                >
                  <div style={{ textAlign: "center" }}>
                    <Droplets size={20} color={colors.textSecondary} style={{ margin: "0 auto 8px" }} />
                    <div style={{ fontSize: "12px", color: colors.textSecondary, marginBottom: "4px" }}>
                      Umidade
                    </div>
                    <div style={{ fontSize: "18px", fontWeight: "700", color: colors.primary }}>
                      {weatherData.humidity}%
                    </div>
                  </div>

                  <div style={{ textAlign: "center" }}>
                    <Wind size={20} color={colors.textSecondary} style={{ margin: "0 auto 8px" }} />
                    <div style={{ fontSize: "12px", color: colors.textSecondary, marginBottom: "4px" }}>
                      Vento
                    </div>
                    <div style={{ fontSize: "18px", fontWeight: "700", color: colors.primary }}>
                      {weatherData.wind} km/h
                    </div>
                  </div>

                  <div style={{ textAlign: "center" }}>
                    <CloudSun size={20} color={colors.textSecondary} style={{ margin: "0 auto 8px" }} />
                    <div style={{ fontSize: "12px", color: colors.textSecondary, marginBottom: "4px" }}>
                      Chuva
                    </div>
                    <div style={{ fontSize: "18px", fontWeight: "700", color: colors.primary }}>
                      {weatherData.rain}%
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div
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
                  Resumo Semanal
                </h3>

                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
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
                        Total de Tarefas
                      </div>
                      <div
                        style={{
                          fontSize: "28px",
                          fontWeight: "700",
                          color: colors.primary,
                        }}
                      >
                        {agendamentos.length}
                      </div>
                    </div>
                    <Calendar size={32} color={colors.primary} style={{ opacity: 0.5 }} />
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
                    <Clock size={32} color="#92400E" style={{ opacity: 0.5 }} />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
