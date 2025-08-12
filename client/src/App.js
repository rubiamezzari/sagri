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
import ListAgendamentos from "./components/administrador/agendamentos/ListAgendamentos";
import DetalhesSolicitacao from "./components/administrador/agendamentos/ListAgendamentos";
import Agendamentos from "./components/administrador/agendamentos/Agendamentos";
import HomeAdmin from "./components/Home";

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
  const [token, setToken] = useState(localStorage.getItem("token"));
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

  const renderNavbar = () => {
    if (isLoginPage) return null;

    const tipoUsuario = localStorage.getItem("tipoUsuario");

    switch (tipoUsuario) {
      case "administrador":
        return <NavbarAdmin />;
      case "associado":
        return <NavbarAssociado />;
      case "operador":
        return <NavbarOperador />;
      default:
        return null;
    }
  };

  // Seleciona qual home exibir com base no tipo de usuário
  const HomeSelector = () => {
    const tipoUsuario = localStorage.getItem("tipoUsuario");

    if (!token) return <Navigate to="/login" replace />;

    switch (tipoUsuario) {
      case "associado":
        return <HomeAssociado />;
      case "operador":
        return <div>Home Operador</div>; // substitua pelo seu componente
      case "administrador":
      default:
        return <HomeAdmin />;
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
            element={
              <Login
                onLogin={(newToken) => {
                  localStorage.setItem("token", newToken);
                  setToken(newToken);
                }}
              />
            }
          />

          {/* Página inicial - decide automaticamente */}
          <Route path="/" element={<HomeSelector />} />

          {/* Associado */}
          <Route path="/associado" element={token ? <HomeAssociado /> : <Navigate to="/login" replace />} />
          <Route path="/solicitações/create" element={token ? <CreateSolicitacao /> : <Navigate to="/login" replace />} />
          <Route path="/solicitações/list" element={token ? <ListSolicitacao /> : <Navigate to="/login" replace />} />

          {/* Agendamentos */}
          <Route path="/agendamentos/list" element={token ? <ListAgendamentos /> : <Navigate to="/login" replace />} />
          <Route path="/agendamentos/:id" element={token ? <DetalhesSolicitacao /> : <Navigate to="/login" replace />} />
          <Route path="/agendamentos" element={token ? <Agendamentos /> : <Navigate to="/login" replace />} />

          {/* Serviços */}
          <Route path="/servicos" element={token ? <Servicos /> : <Navigate to="/login" replace />} />
          <Route path="/servicos/create" element={token ? <CreateServico /> : <Navigate to="/login" replace />} />
          <Route path="/servicos/list" element={token ? <ListServicos /> : <Navigate to="/login" replace />} />
          <Route path="/servicos/:id" element={token ? <DetalhesServico /> : <Navigate to="/login" replace />} />

          {/* Associados */}
          <Route path="/associados" element={token ? <Associados /> : <Navigate to="/login" replace />} />
          <Route path="/associados/create" element={token ? <CreateAssociado /> : <Navigate to="/login" replace />} />
          <Route path="/associados/edit/:id" element={token ? <EditAssociado /> : <Navigate to="/login" replace />} />
          <Route path="/associados/list" element={token ? <UserListAssociado /> : <Navigate to="/login" replace />} />
          <Route path="/associados/:id" element={token ? <DetalhesAssociado /> : <Navigate to="/login" replace />} />

          {/* Implementos */}
          <Route path="/implementos" element={token ? <Implementos /> : <Navigate to="/login" replace />} />
          <Route path="/implementos/create" element={token ? <CreateImplemento /> : <Navigate to="/login" replace />} />
          <Route path="/implementos/edit/:id" element={token ? <EditImplemento /> : <Navigate to="/login" replace />} />
          <Route path="/implementos/list" element={token ? <ListImplemento /> : <Navigate to="/login" replace />} />
          <Route path="/implementos/:id" element={token ? <DetalhesImplemento /> : <Navigate to="/login" replace />} />

          {/* Máquinas */}
          <Route path="/maquinas" element={token ? <Maquinas /> : <Navigate to="/login" replace />} />
          <Route path="/maquinas/create" element={token ? <CreateMaquina /> : <Navigate to="/login" replace />} />
          <Route path="/maquinas/edit/:id" element={token ? <EditMaquina /> : <Navigate to="/login" replace />} />
          <Route path="/maquinas/list" element={token ? <ListMaquinas /> : <Navigate to="/login" replace />} />
          <Route path="/maquinas/:id" element={token ? <DetalhesMaquina /> : <Navigate to="/login" replace />} />

          {/* Operadores */}
          <Route path="/operadores" element={token ? <Operadores /> : <Navigate to="/login" replace />} />
          <Route path="/operadores/create" element={token ? <CreateOperador /> : <Navigate to="/login" replace />} />
          <Route path="/operadores/edit/:id" element={token ? <EditOperador /> : <Navigate to="/login" replace />} />
          <Route path="/operadores/list" element={token ? <UserListOperador /> : <Navigate to="/login" replace />} />

          {/* Redirecionamento padrão */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {!isLoginPage && <Footer />}
    </div>
  );
};

export default App;
