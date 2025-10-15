import React, { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

// Navbar
import NavbarAdmin from "./NavbarAdmin";
import NavbarAssociado from "./NavbarAssociado";
import NavbarOperador from "./NavbarOperador";

// Footer e Login
import Login from "./components/Login";

// Admin
import HomeAdmin from "./components/Home";
import Associados from "./components/administrador/associados/Associados";
import CreateAssociado from "./components/administrador/associados/CreateAssociado";
import EditAssociado from "./components/administrador/associados/EditAssociado";
import UserListAssociado from "./components/administrador/associados/userListAssociado";
import DetalhesAssociado from "./components/administrador/associados/DetalhesAssociado";

import Maquinas from "./components/administrador/maquinas/maquinas";
import CreateMaquina from "./components/administrador/maquinas/CreateMaquina";
import EditMaquina from "./components/administrador/maquinas/EditMaquina";
import ListMaquinas from "./components/administrador/maquinas/ListMaquinas";
import DetalhesMaquina from "./components/administrador/maquinas/DetalhesMaquina";

import Implementos from "./components/administrador/implementos/implementos";
import CreateImplemento from "./components/administrador/implementos/CreateImplemento";
import EditImplemento from "./components/administrador/implementos/EditImplemento";
import ListImplemento from "./components/administrador/implementos/ListImplemento";
import DetalhesImplemento from "./components/administrador/implementos/DetalhesImplemento";

import Servicos from "./components/administrador/servicos/Servicos";
import CreateServico from "./components/administrador/servicos/CreateServico";
import ListServicos from "./components/administrador/servicos/ListServicos";
import DetalhesServico from "./components/administrador/servicos/DetalhesServico";

import ListAgendamentos from "./components/administrador/agendamentos/ListAgendamentos";
import DetalhesSolicitacao from "./components/administrador/agendamentos/ListAgendamentos";
import Agendamentos from "./components/administrador/agendamentos/Agendamentos";
import MarcasNomes from "./components/administrador/CadastroMarcasNomes";

// Associado
import HomeAssociado from "./components/associado/HomeAssociado";
import CreateSolicitacao from "./components/associado/CreateSolicitacao";
import ListSolicitacao from "./components/associado/ListSolicitacao";

// Operador
import HomeOperador from "./components/operador/HomeOperador";
import ListAgendOperador from "./components/operador/ListAgendOperador";
import Horimetro from "./components/operador/Horimetro";

// Operadores Admin
import Operadores from "./components/administrador/operadores/operadores";
import CreateOperador from "./components/administrador/operadores/CreateOperador";
import EditOperador from "./components/administrador/operadores/EditOperador";
import UserListOperador from "./components/administrador/operadores/userListOperador";

const App = () => {
  const location = useLocation();

  useEffect(() => {
    document.body.style.backgroundColor = "#f4ffe3";
    document.body.style.fontFamily = "'Segoe UI', sans-serif";
    return () => {
      document.body.style.backgroundColor = null;
      document.body.style.fontFamily = null;
    };
  }, []);

  const isLoginPage = location.pathname === "/login";
  const isLoggedIn = () => !!localStorage.getItem("tipoUsuario");

  const renderNavbar = (children) => {
    if (isLoginPage) return children;

    const tipoUsuario = localStorage.getItem("tipoUsuario");

    switch (tipoUsuario) {
      case "admin":
        return <NavbarAdmin>{children}</NavbarAdmin>;
      case "associado":
        return <NavbarAssociado>{children}</NavbarAssociado>;
      case "operador":
        return <NavbarOperador>{children}</NavbarOperador>;
      default:
        return children;
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Routes>
        {/* Login */}
        <Route path="/login" element={<Login />} />

        {/* Todas as outras rotas dentro do layout */}
        <Route
          path="/*"
          element={renderNavbar(
            <Routes>
              {/* Página inicial */}
              <Route path="/" element={isLoggedIn() ? <HomeAdmin /> : <Navigate to="/login" replace />} />

              {/* Admin */}
              <Route path="/associados" element={isLoggedIn() ? <Associados /> : <Navigate to="/login" replace />} />
              <Route path="/associados/create" element={isLoggedIn() ? <CreateAssociado /> : <Navigate to="/login" replace />} />
              <Route path="/associados/edit/:id" element={isLoggedIn() ? <EditAssociado /> : <Navigate to="/login" replace />} />
              <Route path="/associados/list" element={isLoggedIn() ? <UserListAssociado /> : <Navigate to="/login" replace />} />
              <Route path="/associados/:id" element={isLoggedIn() ? <DetalhesAssociado /> : <Navigate to="/login" replace />} />

              <Route path="/maquinas" element={isLoggedIn() ? <Maquinas /> : <Navigate to="/login" replace />} />
              <Route path="/maquinas/create" element={isLoggedIn() ? <CreateMaquina /> : <Navigate to="/login" replace />} />
              <Route path="/maquinas/edit/:id" element={isLoggedIn() ? <EditMaquina /> : <Navigate to="/login" replace />} />
              <Route path="/maquinas/list" element={isLoggedIn() ? <ListMaquinas /> : <Navigate to="/login" replace />} />
              <Route path="/maquinas/:id" element={isLoggedIn() ? <DetalhesMaquina /> : <Navigate to="/login" replace />} />

              <Route path="/implementos" element={isLoggedIn() ? <Implementos /> : <Navigate to="/login" replace />} />
              <Route path="/implementos/create" element={isLoggedIn() ? <CreateImplemento /> : <Navigate to="/login" replace />} />
              <Route path="/implementos/edit/:id" element={isLoggedIn() ? <EditImplemento /> : <Navigate to="/login" replace />} />
              <Route path="/implementos/list" element={isLoggedIn() ? <ListImplemento /> : <Navigate to="/login" replace />} />
              <Route path="/implementos/:id" element={isLoggedIn() ? <DetalhesImplemento /> : <Navigate to="/login" replace />} />

              <Route path="/servicos" element={isLoggedIn() ? <Servicos /> : <Navigate to="/login" replace />} />
              <Route path="/servicos/create" element={isLoggedIn() ? <CreateServico /> : <Navigate to="/login" replace />} />
              <Route path="/servicos/list" element={isLoggedIn() ? <ListServicos /> : <Navigate to="/login" replace />} />
              <Route path="/servicos/:id" element={isLoggedIn() ? <DetalhesServico /> : <Navigate to="/login" replace />} />

              <Route path="/agendamentos/list" element={isLoggedIn() ? <ListAgendamentos /> : <Navigate to="/login" replace />} />
              <Route path="/agendamentos/:id" element={isLoggedIn() ? <DetalhesSolicitacao /> : <Navigate to="/login" replace />} />
              <Route path="/agendamentos" element={isLoggedIn() ? <Agendamentos /> : <Navigate to="/login" replace />} />

              <Route path="/marcas" element={isLoggedIn() ? <MarcasNomes /> : <Navigate to="/login" replace />} />

              {/* Associado */}
              <Route path="/associado" element={isLoggedIn() ? <HomeAssociado /> : <Navigate to="/login" replace />} />
              <Route path="/solicitacoes/create" element={isLoggedIn() ? <CreateSolicitacao /> : <Navigate to="/login" replace />} />
              <Route path="/solicitacoes/list" element={isLoggedIn() ? <ListSolicitacao /> : <Navigate to="/login" replace />} />

              {/* Operador */}
              <Route path="/operador" element={isLoggedIn() ? <HomeOperador /> : <Navigate to="/login" replace />} />
              <Route path="/operador/agendamentos" element={isLoggedIn() ? <ListAgendOperador /> : <Navigate to="/login" replace />} />
              <Route path="/operador/horimetro" element={isLoggedIn() ? <Horimetro /> : <Navigate to="/login" replace />} />

              {/* Operadores Admin */}
              <Route path="/operadores" element={isLoggedIn() ? <Operadores /> : <Navigate to="/login" replace />} />
              <Route path="/operadores/create" element={isLoggedIn() ? <CreateOperador /> : <Navigate to="/login" replace />} />
              <Route path="/operadores/edit/:id" element={isLoggedIn() ? <EditOperador /> : <Navigate to="/login" replace />} />
              <Route path="/operadores/list" element={isLoggedIn() ? <UserListOperador /> : <Navigate to="/login" replace />} />

              {/* Redirecionamento padrão */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          )}
        />
      </Routes>
      {!isLoginPage }
    </div>
  );
};

export default App;
