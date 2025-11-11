import React, { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import Logo from "./components/Logo.png";

// Ícones reutilizáveis
const SVG_ICONS = {
  Home: (props) => (
    <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
    </svg>
  ),
  FileText: (props) => (
    <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
    </svg>
  ),
  ChevronDown: (props) => (
    <svg
      className={`chevron ${props.className || ""}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      width={12}
      height={12}
      {...props}
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 9l-7 7-7-7"/>
    </svg>
  )
};

export default function NavbarAssociado({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  const [dropdownOpen, setDropdownOpen] = useState(false);
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

  // Mantém o dropdown aberto se a rota for de solicitações
  useEffect(() => {
    const path = location.pathname;
    const isSolicitacoesPath = path.startsWith("/solicitacoes");
    setDropdownOpen(isSolicitacoesPath);
  }, [location.pathname]);

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

  const DropdownLinkItem = ({ to, children }) => {
    const isActive = location.pathname === to;
    return (
      <NavLink
        to={to}
        className={`dropdown-item ${isActive ? "active" : ""}`}
        onClick={closeSidebar}
      >
        <span className="dropdown-item-text">{children}</span>
      </NavLink>
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
        .nav-link, .nav-item button.dropdown-button {display:flex; align-items:center; gap:12px; padding:10px 12px; border-radius:8px; color:rgba(255,255,255,0.8); text-decoration:none; cursor:pointer; transition: all 0.2s ease; background-color: transparent; border:none; width:100%; text-align:left; font-family:inherit;}
        .nav-link:hover, .nav-item button.dropdown-button:hover {background-color:${HOVER_BG}; color:white;}
        .nav-link.active {background-color:${ACTIVE_BG}; color:white;}
        .nav-item button.dropdown-button.active {background-color:${ACTIVE_BG}; color:white;}
        .nav-link-text {text-transform:uppercase; letter-spacing:0.5px; font-size:12px; font-weight:500;}
        .dropdown-button {justify-content:space-between;}
        .dropdown-button-content {display:flex; align-items:center; gap:12px;}
        .dropdown-menu {margin-top:4px; margin-left:16px; padding-left:16px; border-left:2px solid rgba(255,255,255,0.1);}
        .dropdown-item {display:flex; align-items:center; gap:12px; padding:8px 12px; border-radius:6px; color:rgba(255,255,255,0.7); text-decoration:none; cursor:pointer; transition: all 0.2s ease; background-color: transparent; border:none; width:100%; text-align:left; font-family:inherit; margin-bottom:4px;}
        .dropdown-item:hover {background-color:rgba(255,255,255,0.05); color:white;}
        .dropdown-item.active {background-color:${ACTIVE_BG}; color:white;}
        .dropdown-item-text {text-transform:uppercase; letter-spacing:0.5px; font-size:12px; font-weight:500;}
        .chevron {width:16px; height:16px; transition: transform 0.3s ease;}
        .chevron.open {transform:rotate(180deg);}
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
            <NavLinkItem to="/associado" Icon={SVG_ICONS.Home}>Início</NavLinkItem>

            {/* Dropdown Solicitações */}
            <li className="nav-item">
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)} 
                className={`dropdown-button ${dropdownOpen ? "active" : ""}`}
              >
                <div className="dropdown-button-content">
                  <SVG_ICONS.FileText />
                  <span className="nav-link-text">Solicitações</span>
                </div>
                <SVG_ICONS.ChevronDown className={`${dropdownOpen ? "open" : ""}`} />
              </button>

              {dropdownOpen && (
                <div className="dropdown-menu">
                  <DropdownLinkItem to="/solicitacoes/list">Listar Solicitações</DropdownLinkItem>
                  <DropdownLinkItem to="/solicitacoes/create">Criar Solicitação</DropdownLinkItem>
                </div>
              )}
            </li>
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
