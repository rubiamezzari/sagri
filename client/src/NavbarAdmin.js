import React, { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import Logo from "./components/Logo.png";

// Ícones reutilizáveis
const SVG_ICONS = {
  Home: (props) => (
    <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
    </svg>
  ),
  Users: (props) => (
    <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
    </svg>
  ),
  UserTie: (props) => (
    <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
    </svg>
  ),
  Settings: (props) => (
    <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
    </svg>
  ),
  Calendar: (props) => (
    <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
    </svg>
  ),
  Tag: (props) => (
    <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
    </svg>
  ),
  Wrench: (props) => (
    <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
    </svg>
  )
};

export default function NavbarAdmin({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const SIDEBAR_WIDTH = "256px";
  const SIDEBAR_BG = "#1B4D3E";
  const ACTIVE_BG = "rgba(255, 255, 255, 0.1)";
  const HOVER_BG = "rgba(255, 255, 255, 0.1)";
  const MAIN_BG = "#F5F1E8";

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const closeSidebar = () => sidebarOpen && setSidebarOpen(false);

  const NavLinkItem = ({ to, children, Icon }) => {
    const isActive = location.pathname === to;
    return (
      <li className="nav-item">
        <NavLink
          to={to}
          className={`nav-link ${isActive ? "active" : ""}`}
          onClick={closeSidebar}
        >
          {Icon && <Icon />}
          <span className="nav-link-text">{children}</span>
        </NavLink>
      </li>
    );
  };

  return (
    <>
      <style>{`
        * {margin:0; padding:0; box-sizing:border-box;}
        .top-navbar {
          height: 56px; 
          background-color:${SIDEBAR_BG}; 
          color:white; 
          display:flex; 
          align-items:center; 
          justify-content:space-between; 
          padding:0 16px;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
        }
        .hamburger {font-size:24px; cursor:pointer;}
        .top-logo {position:absolute; left:50%; transform:translateX(-50%);}
        .top-logo img {height:48px; width: 48px; object-fit:contain;}
        .logout-btn {cursor:pointer; background:none; border:none; color:white; font-weight:500;}
        .sidebar {width:${SIDEBAR_WIDTH}; background-color:${SIDEBAR_BG}; color:white; display:flex; flex-direction:column; position:fixed; left:${sidebarOpen ? "0" : `-${SIDEBAR_WIDTH}`}; top:56px; bottom:0; overflow-y:auto; transition:left 0.3s ease;}
        .sidebar-logo {padding:24px;}
        .logo-container {width:48px; height:48px; display:flex; align-items:center; justify-content:center; background-color:rgba(255,255,255,0.1); border-radius:12px;}
        .logo-container img {height:32px; object-fit:contain;}
        .sidebar-nav {flex:1; padding:0 12px; overflow-y:auto;}
        .nav-list {list-style:none; padding:0; margin:0;}
        .nav-item {margin-bottom:4px;}
        .nav-link {display:flex; align-items:center; gap:12px; padding:10px 12px; border-radius:8px; color:rgba(255,255,255,0.8); text-decoration:none; cursor:pointer; transition: all 0.2s ease;}
        .nav-link:hover {background-color:${HOVER_BG}; color:white;}
        .nav-link.active {background-color:${ACTIVE_BG}; color:white;}
        .nav-link-text {text-transform:uppercase; letter-spacing:0.5px; font-size:12px; font-weight:500;}
        .sidebar-footer {padding:12px; border-top:1px solid rgba(255,255,255,0.1);}
        .footer-content {padding:8px 12px; color:rgba(255,255,255,0.6); font-size:12px;}
        .main-content {margin-left:${sidebarOpen ? SIDEBAR_WIDTH : "0"}; flex:1; min-height:calc(100vh - 56px); background-color:${MAIN_BG}; transition:margin-left 0.3s ease; padding:16px;  padding-top:72px;}
        .icon {width:20px; height:20px; flex-shrink:0;}
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
            <NavLinkItem to="/" Icon={SVG_ICONS.Home}>Início</NavLinkItem>
            <NavLinkItem to="/associados" Icon={SVG_ICONS.Users}>Associados</NavLinkItem>
            <NavLinkItem to="/operadores" Icon={SVG_ICONS.UserTie}>Operadores</NavLinkItem>
            <NavLinkItem to="/maquinas" Icon={SVG_ICONS.Settings}>Máquinas</NavLinkItem>
            <NavLinkItem to="/servicos" Icon={SVG_ICONS.Wrench}>Serviços</NavLinkItem>
            <NavLinkItem to="/agendamentos" Icon={SVG_ICONS.Calendar}>Agendamentos</NavLinkItem>
            <NavLinkItem to="/marcas" Icon={SVG_ICONS.Tag}>Marcas</NavLinkItem>
          </ul>
        </nav>

        <div className="sidebar-footer">
          <div className="footer-content"><p>Sistema de Agendamento de Maquinário Agrícola</p></div>
        </div>
      </div>

      <main className="main-content">{children}</main>
    </>
  );
}
