"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Tractor,
  Calendar,
  Users,
  AlertTriangle,
  Clock,
  Activity,
  UserPlus,
  Trash2,
  CheckCircle,
  XCircle,
} from "lucide-react"

const API_URL = "http://localhost:5050"

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
}

const SimplePieChart = ({ data }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0)

  if (total === 0) {
    return (
      <div style={{ textAlign: "center", padding: "60px 20px" }}>
        <Activity size={48} style={{ color: "#D1D5DB", margin: "0 auto 16px" }} />
        <p style={{ color: colors.textSecondary, margin: 0 }}>Nenhum dado disponível</p>
      </div>
    )
  }

  let currentAngle = -90
  const centerX = 225
  const centerY = 225
  const radius = 150

  const createPieSlice = (percentage, color, startAngle) => {
    const angle = (percentage / 100) * 360
    const endAngle = startAngle + angle

    const startX = centerX + radius * Math.cos((Math.PI * startAngle) / 180)
    const startY = centerY + radius * Math.sin((Math.PI * startAngle) / 180)
    const endX = centerX + radius * Math.cos((Math.PI * endAngle) / 180)
    const endY = centerY + radius * Math.sin((Math.PI * endAngle) / 180)

    const largeArc = angle > 180 ? 1 : 0

    const pathData = [
      `M ${centerX} ${centerY}`,
      `L ${startX} ${startY}`,
      `A ${radius} ${radius} 0 ${largeArc} 1 ${endX} ${endY}`,
      `Z`,
    ].join(" ")

    return pathData
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "24px" }}>
      <svg width="450" height="450" viewBox="0 0 450 450" style={{ margin: "0 auto" }}>
        {data.map((item, index) => {
          const percentage = (item.value / total) * 100
          if (percentage === 0) return null

          const pathData = createPieSlice(percentage, item.color, currentAngle)
          const labelAngle = currentAngle + ((percentage / 100) * 360) / 2
          const labelX = centerX + 105 * Math.cos((Math.PI * labelAngle) / 180)
          const labelY = centerY + 105 * Math.sin((Math.PI * labelAngle) / 180)

          currentAngle += (percentage / 100) * 360

          return (
            <g key={index}>
              <path
                d={pathData}
                fill={item.color}
                stroke="#fff"
                strokeWidth="4"
                style={{
                  filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
                  transition: "all 0.3s ease",
                }}
              />
              {percentage > 5 && (
                <text
                  x={labelX}
                  y={labelY}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="#fff"
                  fontSize="20"
                  fontWeight="700"
                  style={{ textShadow: "0 1px 2px rgba(0,0,0,0.3)" }}
                >
                  {Math.round(percentage)}%
                </text>
              )}
            </g>
          )
        })}
      </svg>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", justifyContent: "center" }}>
        {data.map((item) => (
          <div
            key={item.name}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "8px 16px",
              borderRadius: "10px",
              background: colors.background,
            }}
          >
            <div
              style={{
                width: "16px",
                height: "16px",
                borderRadius: "4px",
                backgroundColor: item.color,
              }}
            />
            <span style={{ fontSize: "14px", color: colors.textPrimary, fontWeight: "500" }}>
              {item.name}: <span style={{ fontWeight: "700" }}>{item.value}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalMaquinas: 0,
    agendamentosAtivos: 0,
    totalAssociados: 0,
    alertasManutencao: 0,
  })
  const [appointmentData, setAppointmentData] = useState([
    { name: "Pendente", value: 0, color: "#6EE7B7" },
    { name: "Aprovado", value: 0, color: "#1B4D3E" },
    { name: "Recusado", value: 0, color: "#065F46" },
  ])
  const [activities, setActivities] = useState([])

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)

      const [associadosRes, maquinasRes, solicitacoesRes, ] = await Promise.all([
        fetch(`${API_URL}/associados`),
        fetch(`${API_URL}/maquinas`),
        fetch(`${API_URL}/solicitacoes`),
        fetch(`${API_URL}/associados`),
      ])

      const associados = associadosRes.ok ? await associadosRes.json() : []
      const maquinas = maquinasRes.ok ? await maquinasRes.json() : []
      const solicitacoes = solicitacoesRes.ok ? await solicitacoesRes.json() : []

      const pendente = solicitacoes.filter((s) => s.status === "pendente").length
      const aprovado = solicitacoes.filter((s) => s.status === "aprovado").length
      const recusado = solicitacoes.filter((s) => s.status === "recusado").length

      setStats({
        totalMaquinas: maquinas.length,
        agendamentosAtivos: solicitacoes.length,
        totalAssociados: associados.length,
        alertasManutencao: pendente,
      })

      setAppointmentData([
        { name: "Pendente", value: pendente, color: "#6EE7B7" },
        { name: "Aprovado", value: aprovado, color: "#1B4D3E" },
        { name: "Recusado", value: recusado, color: "#065F46" },
      ])

      const allActivities = []

      // Add recent associados
      associados.slice(-3).forEach((a) => {
        allActivities.push({
          id: `associado-${a._id}`,
          type: "associado_cadastrado",
          user: a.nome || "Associado",
          action: "foi cadastrado no sistema",
          time: formatTimeAgo(a.createdAt || a.data_cadastro),
          icon: "UserPlus",
          link: "/associados",
          color: colors.success,
        })
      })

      // Add recent solicitacoes
      solicitacoes.slice(-3).forEach((s) => {
        const actionMap = {
          aprovado: { text: "foi aprovada", icon: "CheckCircle", color: colors.success },
          recusado: { text: "foi recusada", icon: "XCircle", color: "#EF4444" },
          pendente: { text: "foi criada", icon: "Clock", color: colors.warning },
        }
        const actionInfo = actionMap[s.status] || actionMap.pendente

        allActivities.push({
          id: `solicitacao-${s._id}`,
          type: "solicitacao",
          user: `Solicitação de ${s.associado?.nome || "Associado"}`,
          action: actionInfo.text,
          time: formatTimeAgo(s.createdAt || s.data_solicitacao),
          icon: actionInfo.icon,
          link: "/agendamentos",
          color: actionInfo.color,
        })
      })

      // Add recent associados
      associados.slice(-2).forEach((o) => {
        allActivities.push({
          id: `operador-${o._id}`,
          type: "operador_cadastrado",
          user: o.nome || "Operador",
          action: "foi cadastrado como operador",
          time: formatTimeAgo(o.createdAt || o.data_cadastro),
          icon: "UserPlus",
          link: "/associados",
          color: colors.primary,
        })
      })

      // Sort by most recent and take top 6
      allActivities.sort((a, b) => {
        // This is a simple sort, in production you'd use actual timestamps
        return 0
      })

      setActivities(allActivities.slice(0, 6))
    } catch (error) {
      console.error("Erro ao buscar dados:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatTimeAgo = (date) => {
    if (!date) return "recentemente"
    const now = new Date()
    const past = new Date(date)
    const diffMs = now.getTime() - past.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays > 0) return `há ${diffDays} ${diffDays === 1 ? "dia" : "dias"}`
    if (diffHours > 0) return `há ${diffHours} ${diffHours === 1 ? "hora" : "horas"}`
    return "há poucos minutos"
  }

  const getActivityIcon = (iconName) => {
    const iconProps = { width: "16px", height: "16px", strokeWidth: 2 }
    switch (iconName) {
      case "UserPlus":
        return <UserPlus {...iconProps} />
      case "Trash2":
        return <Trash2 {...iconProps} />
      case "CheckCircle":
        return <CheckCircle {...iconProps} />
      case "XCircle":
        return <XCircle {...iconProps} />
      case "Clock":
        return <Clock {...iconProps} />
      default:
        return <Activity {...iconProps} />
    }
  }

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: colors.background,
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
          <p style={{ color: colors.textSecondary }}>Carregando dashboard...</p>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "40px 20px",
        background: colors.background,
      }}
    >
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        {/* Stats Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "20px",
            marginBottom: "32px",
          }}
        >
          {/* Total Máquinas */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => (window.location.href = "/maquinas")}
            style={{
              backgroundColor: colors.cardBg,
              padding: "24px",
              borderRadius: "16px",
              border: `1px solid ${colors.border}`,
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
              transition: "all 0.2s ease",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
              <div>
                <p
                  style={{
                    fontSize: "11px",
                    color: colors.textSecondary,
                    margin: "0 0 12px 0",
                    fontWeight: "600",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Total de Máquinas
                </p>
                <h3
                  style={{
                    fontSize: "42px",
                    fontWeight: "700",
                    color: colors.primary,
                    margin: "0 0 8px 0",
                    lineHeight: "1",
                  }}
                >
                  {stats.totalMaquinas}
                </h3>
                <p style={{ fontSize: "13px", color: colors.textSecondary, margin: 0, fontWeight: "500" }}>
                  Cadastradas no sistema
                </p>
              </div>
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "14px",
                  background: colors.accent,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Tractor style={{ width: "28px", height: "28px", color: colors.primary, strokeWidth: 2 }} />
              </div>
            </div>
          </motion.div>

          {/* Total Solicitações */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => (window.location.href = "/agendamentos")}
            style={{
              backgroundColor: colors.cardBg,
              padding: "24px",
              borderRadius: "16px",
              border: `1px solid ${colors.border}`,
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
              transition: "all 0.2s ease",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
              <div>
                <p
                  style={{
                    fontSize: "11px",
                    color: colors.textSecondary,
                    margin: "0 0 12px 0",
                    fontWeight: "600",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Total de Solicitações
                </p>
                <h3
                  style={{
                    fontSize: "42px",
                    fontWeight: "700",
                    color: colors.primary,
                    margin: "0 0 8px 0",
                    lineHeight: "1",
                  }}
                >
                  {stats.agendamentosAtivos}
                </h3>
                <p style={{ fontSize: "13px", color: colors.textSecondary, margin: 0, fontWeight: "500" }}>
                  No sistema
                </p>
              </div>
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "14px",
                  background: colors.accent,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Calendar style={{ width: "28px", height: "28px", color: colors.primary, strokeWidth: 2 }} />
              </div>
            </div>
          </motion.div>

          {/* Total Operadores */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => (window.location.href = "/associados")}
            style={{
              backgroundColor: colors.cardBg,
              padding: "24px",
              borderRadius: "16px",
              border: `1px solid ${colors.border}`,
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
              transition: "all 0.2s ease",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
              <div>
                <p
                  style={{
                    fontSize: "11px",
                    color: colors.textSecondary,
                    margin: "0 0 12px 0",
                    fontWeight: "600",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Total de Associados
                </p>
                <h3
                  style={{
                    fontSize: "42px",
                    fontWeight: "700",
                    color: colors.primary,
                    margin: "0 0 8px 0",
                    lineHeight: "1",
                  }}
                >
                  {stats.totalAssociados}
                </h3>
                <p style={{ fontSize: "13px", color: colors.textSecondary, margin: 0, fontWeight: "500" }}>
                  Cadastrados
                </p>
              </div>
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "14px",
                  background: colors.accent,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Users style={{ width: "28px", height: "28px", color: colors.primary, strokeWidth: 2 }} />
              </div>
            </div>
          </motion.div>

          {/* Pendentes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => (window.location.href = "/agendamentos")}
            style={{
              backgroundColor: colors.cardBg,
              padding: "24px",
              borderRadius: "16px",
              border: `1px solid ${colors.border}`,
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
              transition: "all 0.2s ease",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
              <div>
                <p
                  style={{
                    fontSize: "11px",
                    color: colors.textSecondary,
                    margin: "0 0 12px 0",
                    fontWeight: "600",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Pendentes
                </p>
                <h3
                  style={{
                    fontSize: "42px",
                    fontWeight: "700",
                    color: colors.warning,
                    margin: "0 0 8px 0",
                    lineHeight: "1",
                  }}
                >
                  {appointmentData.find((d) => d.name === "Pendente")?.value || 0}
                </h3>
                <p style={{ fontSize: "13px", color: colors.warning, margin: 0, fontWeight: "500" }}>
                  Aguardando aprovação
                </p>
              </div>
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "14px",
                  background: "rgba(245, 158, 11, 0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <AlertTriangle style={{ width: "28px", height: "28px", color: colors.warning, strokeWidth: 2 }} />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Content Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "24px",
          }}
        >
          {/* Chart Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            style={{
              backgroundColor: colors.cardBg,
              borderRadius: "16px",
              border: `1px solid ${colors.border}`,
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "24px",
                borderBottom: `1px solid ${colors.border}`,
              }}
            >
              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: "700",
                  color: colors.primary,
                  margin: 0,
                }}
              >
                Status das Solicitações
              </h3>
            </div>
            <div style={{ padding: "32px 24px" }}>
              <SimplePieChart data={appointmentData} />
            </div>
          </motion.div>

          {/* Recent Activity Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            style={{
              backgroundColor: colors.cardBg,
              borderRadius: "16px",
              border: `1px solid ${colors.border}`,
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "24px",
                borderBottom: `1px solid ${colors.border}`,
              }}
            >
              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: "700",
                  color: colors.primary,
                  margin: 0,
                }}
              >
                Atividades Recentes
              </h3>
            </div>
            <div style={{ padding: "24px", maxHeight: "500px", overflowY: "auto" }}>
              {activities.length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px 20px" }}>
                  <Activity size={48} style={{ color: "#D1D5DB", margin: "0 auto 16px" }} />
                  <p style={{ color: colors.textSecondary, margin: 0 }}>Nenhuma atividade recente</p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <AnimatePresence>
                    {activities.map((activity, index) => (
                      <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ scale: 1.02, backgroundColor: colors.background }}
                        onClick={() => (window.location.href = activity.link)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: "12px",
                          padding: "16px",
                          borderRadius: "10px",
                          background: "transparent",
                          borderBottom: index === activities.length - 1 ? "none" : `1px solid ${colors.border}`,
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1 }}>
                          <div
                            style={{
                              width: "36px",
                              height: "36px",
                              borderRadius: "8px",
                              background: `${activity.color}20`,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: activity.color,
                            }}
                          >
                            {getActivityIcon(activity.icon)}
                          </div>
                          <div style={{ flex: 1 }}>
                            <p
                              style={{
                                fontSize: "14px",
                                margin: "0 0 4px 0",
                                color: colors.textPrimary,
                                fontWeight: "500",
                              }}
                            >
                              <span style={{ fontWeight: "600" }}>{activity.user}</span> {activity.action}
                            </p>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "4px",
                                fontSize: "12px",
                                color: colors.textSecondary,
                              }}
                            >
                              <Clock style={{ width: "12px", height: "12px" }} />
                              {activity.time}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
