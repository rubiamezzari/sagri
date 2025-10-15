import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Logo from "./components/Logo.png";

export default function NavbarAdminSimple({ children }) {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const SIDEBAR_WIDTH = "240px";
  const SIDEBAR_BG = "#1B4D3E";
  const ACTIVE_BG = "rgba(255,255,255,0.1)";
  const HOVER_BG = "rgba(255,255,255,0.1)";
  const MAIN_BG = "#F5F1E8";

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <>
      <style>{`
        * {margin:0; padding:0; box-sizing:border-box;}
        .top-navbar {height:56px; background-color:${SIDEBAR_BG}; color:white; display:flex; align-items:center; justify-content:space-between; padding:0 16px; position:fixed; top:0; left:0; right:0; z-index:1000;}
        .hamburger {font-size:24px; cursor:pointer;}
        .top-logo {position:absolute; left:50%; transform:translateX(-50%);}
        .top-logo img {height:32px; object-fit:contain;}
        .logout-btn {cursor:pointer; background:none; border:none; color:white; font-weight:500;}
        .sidebar {width:${SIDEBAR_WIDTH}; background-color:${SIDEBAR_BG}; color:white; display:flex; flex-direction:column; position:fixed; left:${sidebarOpen ? "0" : `-${SIDEBAR_WIDTH}`}; top:56px; bottom:0; overflow-y:auto; transition:left 0.3s ease;}
        .sidebar-logo {padding:24px;}
        .logo-container {width:48px; height:48px; display:flex; align-items:center; justify-content:center; background-color:rgba(255,255,255,0.1); border-radius:12px;}
        .logo-container img {height:32px; object-fit:contain;}
        .sidebar-nav {flex:1; padding:0 12px; overflow-y:auto;}
        .nav-list {list-style:none; padding:0; margin:0;}
        .nav-item {margin-bottom:4px;}
        .nav-link {display:flex; align-items:center; gap:12px; padding:10px 12px; border-radius:8px; color:rgba(255,255,255,0.8); text-decoration:none; cursor:pointer; transition: all 0.2s ease; background-color: transparent; width:100%; text-align:left; font-family:inherit;}
        .nav-link:hover {background-color:${HOVER_BG}; color:white;}
        .nav-link.active {background-color:${ACTIVE_BG}; color:white;}
        .nav-link-text {text-transform:uppercase; letter-spacing:0.5px; font-size:12px; font-weight:500;}
        .main-content {margin-left:${sidebarOpen ? SIDEBAR_WIDTH : "0"}; flex:1; min-height:calc(100vh - 56px); background-color:${MAIN_BG}; transition:margin-left 0.3s ease; padding:16px; padding-top:72px;}
      `}</style>

      <div className="top-navbar">
        <span className="hamburger" onClick={toggleSidebar}>&#9776;</span>
        <span className="top-logo"><img src={Logo} alt="Logo" /></span>
        <button className="logout-btn" onClick={handleLogout}>Sair</button>
      </div>

      <div className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-container">
            <img src={Logo} alt="Logo" />
          </div>
        </div>

        <nav className="sidebar-nav">
          <ul className="nav-list">
            <li className="nav-item">
              <NavLink to="/operador" className={({isActive})=>`nav-link ${isActive ? "active" : ""}`}>
                <span className="nav-link-text">Início</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/operador/agendamentos" className={({isActive})=>`nav-link ${isActive ? "active" : ""}`}>
                <span className="nav-link-text">Agendamentos</span>
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>

      <main className="main-content">{children}</main>
    </>
  );
}
