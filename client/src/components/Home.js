import React from "react";
import { Bell, Settings, User, Tractor, Calendar, Users, AlertTriangle, Plus, Wrench, Clock, Layers } from "lucide-react";

const colors = {
  primary: "#2d5f2e",
  background: "#F5F1E8",
  card: "#ffffff",
  muted: "#E8DCC4",
  mutedForeground: "#5a6d5a",
  border: "rgba(45, 95, 46, 0.2)",
  accent: "#3d7c3f",
};

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.card,
    borderBottom: `1px solid ${colors.border}`,
    position: "sticky" ,
    top: 0,
    zIndex: 10,
  },
  headerContent: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 24px",
  },
  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  logo: {
    width: "40px",
    height: "40px",
    backgroundColor: colors.primary,
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    margin: 0,
    color: colors.primary,
    fontSize: "1.5rem",
    fontWeight: "600",
  },
  logoSubtext: {
    fontSize: "12px",
    color: colors.mutedForeground,
    margin: 0,
  },
  headerRight: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  iconButton: {
    width: "40px",
    height: "40px",
    border: "none",
    background: "transparent",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "6px",
    position: "relative" ,
  },
  notificationDot: {
    position: "absolute" ,
    top: "6px",
    right: "6px",
    width: "8px",
    height: "8px",
    backgroundColor: "#c53030",
    borderRadius: "50%",
  },
  userSection: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    paddingLeft: "12px",
    borderLeft: `1px solid ${colors.border}`,
  },
  avatar: {
    width: "32px",
    height: "32px",
    backgroundColor: colors.primary,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: colors.background,
  },
  userInfo: {
    fontSize: "14px",
  },
  userEmail: {
    fontSize: "12px",
    color: colors.mutedForeground,
    margin: 0,
  },
  main: {
    padding: "32px",
    maxWidth: "1600px",
    marginBottom: "60px",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "20px",
    marginBottom: "32px",
  },
  "@media (max-width: 1200px)": {
    statsGrid: {
      gridTemplateColumns: "repeat(2, 1fr)",
    },
  },
  "@media (max-width: 768px)": {
    statsGrid: {
      gridTemplateColumns: "1fr",
    },
  },
  statsCard: {
    margintop: "60px",
    backgroundColor: colors.card,
    border: `1px solid ${colors.border}`,
    borderRadius: "12px",
    padding: "28px 24px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
    transition: "box-shadow 0.2s, transform 0.2s",
  },
  statsContent: {
    display: "flex",
    alignItems: "start",
    justifyContent: "space-between",
  },
  statsLeft: {
    flex: 1,
  },
  statsTitle: {
    fontSize: "14px",
    color: colors.mutedForeground,
    margin: 0,
    marginBottom: "8px",
  },
  statsValue: {
    fontSize: "2.5rem",
    fontWeight: "700",
    color: colors.primary,
    margin: 0,
    marginBottom: "8px",
    lineHeight: "1",
  },
  statsChange: {
    fontSize: "14px",
    margin: 0,
  },
  statsIcon: {
    backgroundColor: `${colors.primary}1a`,
    padding: "12px",
    borderRadius: "8px",
  },
  contentGrid: {
    display: "grid",
    gridTemplateColumns: "1.4fr 1fr",
    gap: "24px",
  },
  leftColumn: {
    display: "flex",
    flexDirection: "column" ,
    gap: "24px",
  },
  rightColumn: {
    display: "flex",
    flexDirection: "column" ,
    gap: "24px",
  },
  card: {
    backgroundColor: colors.card,
    border: `1px solid ${colors.border}`,
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
    height: "100%",
  },
  cardHeader: {
    padding: "20px 24px",
    borderBottom: `1px solid ${colors.border}`,
  },
  cardTitle: {
    fontSize: "1.25rem",
    fontWeight: "600",
    color: colors.primary,
    margin: 0,
  },
  cardContent: {
    padding: "24px",
  },
  cardContentCompact: {
    padding: "20px",
  },
  scheduleItem: {
    padding: "20px",
    borderRadius: "10px",
    border: `1px solid ${colors.border}`,
    backgroundColor: `${colors.muted}30`,
    marginBottom: "12px",
    transition: "background-color 0.2s",
    cursor: "pointer",
  },
  scheduleHeader: {
    display: "flex",
    alignItems: "start",
    justifyContent: "space-between",
    marginBottom: "10px",
    gap: "12px",
  },
  scheduleMachine: {
    fontSize: "1rem",
    fontWeight: "600",
    color: colors.primary,
    margin: 0,
  },
  badge: {
    padding: "4px 12px",
    borderRadius: "6px",
    fontSize: "12px",
    border: "1px solid",
  },
  badgeHigh: {
    backgroundColor: "#fee2e2",
    color: "#991b1b",
    borderColor: "#fecaca",
  },
  badgeMedium: {
    backgroundColor: "#fef3c7",
    color: "#92400e",
    borderColor: "#fde68a",
  },
  badgeLow: {
    backgroundColor: "#dbeafe",
    color: "#1e40af",
    borderColor: "#bfdbfe",
  },
  scheduleOperator: {
    fontSize: "14px",
    color: colors.mutedForeground,
    margin: "0 0 12px 0",
  },
  scheduleDetails: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    fontSize: "14px",
    flexWrap: "wrap" ,
  },
  scheduleDetail: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    color: colors.mutedForeground,
  },
  activityItem: {
    display: "flex",
    alignItems: "start",
    justifyContent: "space-between",
    gap: "12px",
    paddingBottom: "12px",
    borderBottom: `1px solid ${colors.border}`,
    marginBottom: "1px",
  },
  activityLeft: {
    flex: 1,
  },
  activityText: {
    fontSize: "14px",
    margin: 0,
  },
  activityTime: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    fontSize: "12px",
    color: colors.mutedForeground,
    marginTop: "4px",
  },
  badgeCompleted: {
    backgroundColor: "#dcfce7",
    color: "#166534",
    borderColor: "#bbf7d0",
  },
  badgePending: {
    backgroundColor: "#fef3c7",
    color: "#92400e",
    borderColor: "#fde68a",
  },
  badgeCancelled: {
    backgroundColor: "#fee2e2",
    color: "#991b1b",
    borderColor: "#fecaca",
  },
  quickActionsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
  },
  actionButton: {
    height: "auto",
    padding: "16px",
    border: `1px solid ${colors.border}`,
    borderRadius: "8px",
    backgroundColor: colors.card,
    cursor: "pointer",
    display: "flex",
    flexDirection: "column" ,
    alignItems: "flex-start",
    gap: "8px",
    transition: "all 0.2s",
    textDecoration: "none",
    color: "inherit",
  },
  actionIcon: {
    color: colors.primary,
  },
  actionLabel: {
    fontSize: "14px",
    fontWeight: "500",
    margin: 0,
    color: colors.primary,
    textAlign: "left" ,
  },
  actionDescription: {
    fontSize: "12px",
    color: colors.mutedForeground,
    margin: 0,
    textAlign: "left" ,
  },
};

interface Activity {
  id: number;
  user: string;
  action: string;
  machine: string;
  time: string;
  status: "completed" | "pending" | "cancelled";
}

interface Schedule {
  id: number;
  machine: string;
  operator: string;
  location: string;
  date: string;
  time: string;
  priority: "high" | "medium" | "low";
}

const activities: Activity[] = [
  {
    id: 1,
    user: "John Smith",
    action: "Scheduled",
    machine: "Combine Harvester CH-301",
    time: "2 hours ago",
    status: "completed"
  },
  {
    id: 2,
    user: "Maria Garcia",
    action: "Requested",
    machine: "Tractor TR-205",
    time: "3 hours ago",
    status: "pending"
  },
  {
    id: 3,
    user: "David Chen",
    action: "Completed",
    machine: "Planter PL-112",
    time: "5 hours ago",
    status: "completed"
  },
  {
    id: 4,
    user: "Sarah Johnson",
    action: "Cancelled",
    machine: "Sprayer SP-089",
    time: "6 hours ago",
    status: "cancelled"
  },
  {
    id: 5,
    user: "Michael Brown",
    action: "Scheduled",
    machine: "Tractor TR-187",
    time: "8 hours ago",
    status: "completed"
  }
];

const schedules: Schedule[] = [
  {
    id: 1,
    machine: "Combine Harvester CH-301",
    operator: "Tom Wilson",
    location: "North Field - Section A",
    date: "Oct 11, 2025",
    time: "06:00 AM",
    priority: "high"
  },
  {
    id: 2,
    machine: "Tractor TR-205",
    operator: "Lisa Anderson",
    location: "West Field - Section B",
    date: "Oct 11, 2025",
    time: "08:30 AM",
    priority: "medium"
  },
  {
    id: 3,
    machine: "Sprayer SP-089",
    operator: "Robert Lee",
    location: "East Field - Section C",
    date: "Oct 12, 2025",
    time: "07:00 AM",
    priority: "high"
  },
  {
    id: 4,
    machine: "Planter PL-112",
    operator: "Emma Davis",
    location: "South Field - Section D",
    date: "Oct 12, 2025",
    time: "09:00 AM",
    priority: "low"
  }
];

export default function App() {
  const getStatusBadgeStyle = (status: Activity["status"]) => {
    switch (status) {
      case "completed":
        return styles.badgeCompleted;
      case "pending":
        return styles.badgePending;
      case "cancelled":
        return styles.badgeCancelled;
    }
  };

  const getPriorityBadgeStyle = (priority: Schedule["priority"]) => {
    switch (priority) {
      case "high":
        return styles.badgeHigh;
      case "medium":
        return styles.badgeMedium;
      case "low":
        return styles.badgeLow;
    }
  };

  return (
    <div style={styles.page}>
      {/* Header */}
     

      {/* Main Content */}
      <main style={styles.main}>
        {/* Stats Grid */}
        <div style={styles.statsGrid}>
          <div 
            style={styles.statsCard}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <div style={styles.statsContent}>
              <div style={styles.statsLeft}>
                <p style={styles.statsTitle}>Total Machinery</p>
                <h2 style={styles.statsValue}>24</h2>
                <p style={{ ...styles.statsChange, color: "#16a34a" }}>+2 this month</p>
              </div>
              <div style={styles.statsIcon}>
                <Tractor size={24} color={colors.primary} />
              </div>
            </div>
          </div>

          <div 
            style={styles.statsCard}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <div style={styles.statsContent}>
              <div style={styles.statsLeft}>
                <p style={styles.statsTitle}>Total Implements</p>
                <h2 style={styles.statsValue}>42</h2>
                <p style={{ ...styles.statsChange, color: colors.mutedForeground }}>6 today</p>
              </div>
              <div style={styles.statsIcon}>
                <Calendar size={24} color={colors.primary} />
              </div>
            </div>
          </div>

          <div 
            style={styles.statsCard}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <div style={styles.statsContent}>
              <div style={styles.statsLeft}>
                <p style={styles.statsTitle}>Active Users</p>
                <h2 style={styles.statsValue}>42</h2>
                <p style={{ ...styles.statsChange, color: "#16a34a" }}>+5 this week</p>
              </div>
              <div style={styles.statsIcon}>
                <Users size={24} color={colors.primary} />
              </div>
            </div>
          </div>

          <div 
            style={styles.statsCard}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <div style={styles.statsContent}>
              <div style={styles.statsLeft}>
                <p style={styles.statsTitle}>Pending Requests</p>
                <h2 style={styles.statsValue}>7</h2>
                <p style={{ ...styles.statsChange, color: colors.mutedForeground }}>Needs attention</p>
              </div>
              <div style={styles.statsIcon}>
                <AlertTriangle size={24} color={colors.primary} />
              </div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div style={styles.contentGrid}>
          {/* Left Column */}
          <div style={styles.leftColumn}>
            {/* Upcoming Schedules */}
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <h3 style={styles.cardTitle}>Upcoming Schedules</h3>
              </div>
              <div style={styles.cardContentCompact}>
                {schedules.map((schedule) => (
                  <div
                    key={schedule.id}
                    style={styles.scheduleItem}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = `${colors.muted}50`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = `${colors.muted}30`;
                    }}
                  >
                    <div style={styles.scheduleHeader}>
                      <h4 style={styles.scheduleMachine}>{schedule.machine}</h4>
                      <span style={{ ...styles.badge, ...getPriorityBadgeStyle(schedule.priority) }}>
                        {schedule.priority}
                      </span>
                    </div>
                    <p style={styles.scheduleOperator}>Operator: {schedule.operator}</p>
                    <div style={styles.scheduleDetails}>
                      <div style={styles.scheduleDetail}>
                        <Calendar size={16} />
                        {schedule.date} • {schedule.time}
                      </div>
                      <div style={styles.scheduleDetail}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                        {schedule.location}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div style={styles.rightColumn}>
            {/* Quick Actions */}
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <h3 style={styles.cardTitle}>Quick Actions</h3>
              </div>
              <div style={styles.cardContentCompact}>
                <div style={styles.quickActionsGrid}>
                  <button
                    style={styles.actionButton}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = `${colors.primary}08`;
                      e.currentTarget.style.borderColor = `${colors.primary}4d`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = colors.card;
                      e.currentTarget.style.borderColor = colors.border;
                    }}
                  >
                    <Calendar size={20} style={styles.actionIcon} />
                    <div>
                      <p style={styles.actionLabel}>View Calendar</p>
                      <p style={styles.actionDescription}>See all schedules</p>
                    </div>
                  </button>

                  <button
                    style={styles.actionButton}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = `${colors.primary}08`;
                      e.currentTarget.style.borderColor = `${colors.primary}4d`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = colors.card;
                      e.currentTarget.style.borderColor = colors.border;
                    }}
                  >
                    <Users size={20} style={styles.actionIcon} />
                    <div>
                      <p style={styles.actionLabel}>Manage Users</p>
                      <p style={styles.actionDescription}>Add or edit users</p>
                    </div>
                  </button>

                  <button
                    style={styles.actionButton}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = `${colors.primary}08`;
                      e.currentTarget.style.borderColor = `${colors.primary}4d`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = colors.card;
                      e.currentTarget.style.borderColor = colors.border;
                    }}
                  >
                    <Wrench size={20} style={styles.actionIcon} />
                    <div>
                      <p style={styles.actionLabel}>Equipment Status</p>
                      <p style={styles.actionDescription}>Check machine status</p>
                    </div>
                  </button>

                  <a
                    href="/marcas"
                    style={styles.actionButton}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = `${colors.primary}08`;
                      e.currentTarget.style.borderColor = `${colors.primary}4d`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = colors.card;
                      e.currentTarget.style.borderColor = colors.border;
                    }}
                  >
                    <Plus size={20} style={styles.actionIcon} />
                    <div>
                      <p style={styles.actionLabel}>Marcas</p>
                      <p style={styles.actionDescription}>View all brands</p>
                    </div>
                  </a>

                  <a
                    href="/tipos"
                    style={styles.actionButton}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = `${colors.primary}08`;
                      e.currentTarget.style.borderColor = `${colors.primary}4d`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = colors.card;
                      e.currentTarget.style.borderColor = colors.border;
                    }}
                  >
                    <Layers size={20} style={styles.actionIcon} />
                    <div>
                      <p style={styles.actionLabel}>Tipos de Máquinas</p>
                      <p style={styles.actionDescription}>Máquinas e implementos</p>
                    </div>
                  </a>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <h3 style={styles.cardTitle}>Recent Activity</h3>
              </div>
              <div style={styles.cardContentCompact}>
                {activities.map((activity, index) => (
                  <div
                    key={activity.id}
                    style={{
                      ...styles.activityItem,
                      borderBottom: index === activities.length - 1 ? "none" : styles.activityItem.borderBottom,
                      marginBottom: index === activities.length - 1 ? "0" : styles.activityItem.marginBottom,
                      paddingBottom: index === activities.length - 1 ? "0" : styles.activityItem.paddingBottom,
                    }}
                  >
                    <div style={styles.activityLeft}>
                      <p style={styles.activityText}>
                        <span>{activity.user}</span> {activity.action.toLowerCase()}{" "}
                        <span style={{ color: colors.primary }}>{activity.machine}</span>
                      </p>
                      <div style={styles.activityTime}>
                        <Clock size={12} />
                        {activity.time}
                      </div>
                    </div>
                    <span style={{ ...styles.badge, ...getStatusBadgeStyle(activity.status) }}>
                      {activity.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
