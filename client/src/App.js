import React, { useEffect, useState } from "react";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";

// Importa os três navbars
import NavbarAdmin from "./NavbarAdmin";
import NavbarAssociado from "./NavbarAssociado";
import NavbarOperador from "./NavbarOperador";

import Footer from "./components/footer";
import Login from "./components/Login";

// Associado
import CreateSolicitacao from "./components/associado/CreateSolicitacao";
import ListSolicitacao from "./components/associado/ListSolicitacao";
import HomeAssociado from "./components/associado/HomeAssociado";

// Admin

//agendamentos
import ListAgendamentos from "./components/administrador/agendamentos/ListAgendamentos";
import DetalhesSolicitacao from "./components/administrador/agendamentos/ListAgendamentos";
import Agendamentos from "./components/administrador/agendamentos/Agendamentos";
import HomeAdmin from "./components/Home";
 
//marcas e tipos
import MarcasNomes from "./components/administrador/CadastroMarcasNomes";

// Serviços
import Servicos from "./components/administrador/servicos/Servicos";
import CreateServico from "./components/administrador/servicos/CreateServico";
import ListServicos from "./components/administrador/servicos/ListServicos";
import DetalhesServico from "./components/administrador/servicos/DetalhesServico";

// Associados
import Associados from "./components/administrador/associados/Associados";
import CreateAssociado from "./components/administrador/associados/CreateAssociado";
import EditAssociado from "./components/administrador/associados/EditAssociado";
import UserListAssociado from "./components/administrador/associados/userListAssociado";
import DetalhesAssociado from "./components/administrador/associados/DetalhesAssociado";

// Implementos
import Implementos from "./components/administrador/implementos/implementos";
import CreateImplemento from "./components/administrador/implementos/CreateImplemento";
import EditImplemento from "./components/administrador/implementos/EditImplemento";
import ListImplemento from "./components/administrador/implementos/ListImplemento";
import DetalhesImplemento from "./components/administrador/implementos/DetalhesImplemento";

// Máquinas
import Maquinas from "./components/administrador/maquinas/maquinas";
import CreateMaquina from "./components/administrador/maquinas/CreateMaquina";
import EditMaquina from "./components/administrador/maquinas/EditMaquina";
import ListMaquinas from "./components/administrador/maquinas/ListMaquinas";
import DetalhesMaquina from "./components/administrador/maquinas/DetalhesMaquina";

// Operadores
import Operadores from "./components/administrador/operadores/operadores";
import CreateOperador from "./components/administrador/operadores/CreateOperador";
import EditOperador from "./components/administrador/operadores/EditOperador";
import UserListOperador from "./components/administrador/operadores/userListOperador";

const App = () => {
  const location = useLocation();

  useEffect(() => {
    document.body.style.backgroundColor = "#F0FAF7";
    document.body.style.fontFamily = "'segoe ui', sans-serif";
    return () => {
      document.body.style.backgroundColor = null;
      document.body.style.fontFamily = null;
    };
  }, []);

  const isLoginPage = location.pathname === "/login";

  const isLoggedIn = () => !!localStorage.getItem("tipoUsuario");

  const renderNavbar = () => {
    if (isLoginPage) return null;

    const tipoUsuario = localStorage.getItem("tipoUsuario");

    switch (tipoUsuario) {
      case "admin":
        return <NavbarAdmin />;
      case "associado":
        return <NavbarAssociado />;
      case "operador":
        return <NavbarOperador />;
      default:
        return null;
    }
  };

  const HomeSelector = () => {
    const tipoUsuario = localStorage.getItem("tipoUsuario");

    if (!tipoUsuario) return <Navigate to="/login" replace />;

    switch (tipoUsuario) {
      case "associado":
        return <HomeAssociado />;
      case "operador":
        return <div>Home Operador</div>;
      case "admin":
        return <HomeAdmin />;
      default:
        return <Navigate to="/login" replace />;
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      {renderNavbar()}
      <main className={isLoginPage ? "" : "flex-fill container my-4"}>
        <Routes>
          {/* Login */}
          <Route
            path="/login"
            element={<Login />}
          />

          {/* Página inicial */}
          <Route path="/" element={<HomeSelector />} />

          {/* Associado */}
          <Route path="/associado" element={isLoggedIn() ? <HomeAssociado /> : <Navigate to="/login" replace />} />
          <Route path="/solicitacoes/create" element={isLoggedIn() ? <CreateSolicitacao /> : <Navigate to="/login" replace />} />
          <Route path="/solicitacoes/list" element={isLoggedIn() ? <ListSolicitacao /> : <Navigate to="/login" replace />} />

          {/* Agendamentos */}
          <Route path="/agendamentos/list" element={isLoggedIn() ? <ListAgendamentos /> : <Navigate to="/login" replace />} />
          <Route path="/agendamentos/:id" element={isLoggedIn() ? <DetalhesSolicitacao /> : <Navigate to="/login" replace />} />
          <Route path="/agendamentos" element={isLoggedIn() ? <Agendamentos /> : <Navigate to="/login" replace />} />
          
          <Route path="/marcas" element={isLoggedIn() ? <MarcasNomes /> : <Navigate to="/login" replace />} />

          {/* Serviços */}
          <Route path="/servicos" element={isLoggedIn() ? <Servicos /> : <Navigate to="/login" replace />} />
          <Route path="/servicos/create" element={isLoggedIn() ? <CreateServico /> : <Navigate to="/login" replace />} />
          <Route path="/servicos/list" element={isLoggedIn() ? <ListServicos /> : <Navigate to="/login" replace />} />
          <Route path="/servicos/:id" element={isLoggedIn() ? <DetalhesServico /> : <Navigate to="/login" replace />} />

          {/* Associados */}
          <Route path="/associados" element={isLoggedIn() ? <Associados /> : <Navigate to="/login" replace />} />
          <Route path="/associados/create" element={isLoggedIn() ? <CreateAssociado /> : <Navigate to="/login" replace />} />
          <Route path="/associados/edit/:id" element={isLoggedIn() ? <EditAssociado /> : <Navigate to="/login" replace />} />
          <Route path="/associados/list" element={isLoggedIn() ? <UserListAssociado /> : <Navigate to="/login" replace />} />
          <Route path="/associados/:id" element={isLoggedIn() ? <DetalhesAssociado /> : <Navigate to="/login" replace />} />

          {/* Implementos */}
          <Route path="/implementos" element={isLoggedIn() ? <Implementos /> : <Navigate to="/login" replace />} />
          <Route path="/implementos/create" element={isLoggedIn() ? <CreateImplemento /> : <Navigate to="/login" replace />} />
          <Route path="/implementos/edit/:id" element={isLoggedIn() ? <EditImplemento /> : <Navigate to="/login" replace />} />
          <Route path="/implementos/list" element={isLoggedIn() ? <ListImplemento /> : <Navigate to="/login" replace />} />
          <Route path="/implementos/:id" element={isLoggedIn() ? <DetalhesImplemento /> : <Navigate to="/login" replace />} />

          {/* Máquinas */}
          <Route path="/maquinas" element={isLoggedIn() ? <Maquinas /> : <Navigate to="/login" replace />} />
          <Route path="/maquinas/create" element={isLoggedIn() ? <CreateMaquina /> : <Navigate to="/login" replace />} />
          <Route path="/maquinas/edit/:id" element={isLoggedIn() ? <EditMaquina /> : <Navigate to="/login" replace />} />
          <Route path="/maquinas/list" element={isLoggedIn() ? <ListMaquinas /> : <Navigate to="/login" replace />} />
          <Route path="/maquinas/:id" element={isLoggedIn() ? <DetalhesMaquina /> : <Navigate to="/login" replace />} />

          {/* Operadores */}
          <Route path="/operadores" element={isLoggedIn() ? <Operadores /> : <Navigate to="/login" replace />} />
          <Route path="/operadores/create" element={isLoggedIn() ? <CreateOperador /> : <Navigate to="/login" replace />} />
          <Route path="/operadores/edit/:id" element={isLoggedIn() ? <EditOperador /> : <Navigate to="/login" replace />} />
          <Route path="/operadores/list" element={isLoggedIn() ? <UserListOperador /> : <Navigate to="/login" replace />} />

          {/* Redirecionamento padrão */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {!isLoginPage && <Footer />}
    </div>
  );
};

export default App;
