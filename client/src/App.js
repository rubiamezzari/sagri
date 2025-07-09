import React, { useEffect, useState } from "react";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/footer";
import Home from "./components/Home";
import Login from "./components/Login";
//serviços
import Servicos from "./components/servicos/Servicos";
import CreateServico from "./components/servicos/CreateServico";
import ListServicos from "./components/servicos/ListServicos";


// Associados
import Associados from "./components/associados/Associados";
import CreateAssociado from "./components/associados/CreateAssociado";
import EditAssociado from "./components/associados/EditAssociado";
import UserListAssociado from "./components/associados/userListAssociado";
import DetalhesAssociado from "./components/associados/DetalhesAssociado";

// Implementos
import Implementos from "./components/implementos/implementos";
import CreateImplemento from "./components/implementos/CreateImplemento";
import EditImplemento from "./components/implementos/EditImplemento";
import ListImplemento from "./components/implementos/ListImplemento";
import DetalhesImplemento from "./components/implementos/DetalhesImplemento";

// Máquinas
import Maquinas from "./components/maquinas/maquinas";
import CreateMaquina from "./components/maquinas/CreateMaquina";
import EditMaquina from "./components/maquinas/EditMaquina";
import ListMaquinas from "./components/maquinas/ListMaquinas";
import DetalhesMaquina from "./components/maquinas/DetalhesMaquina";

// Operadores
import Operadores from "./components/operadores/operadores";
import CreateOperador from "./components/operadores/CreateOperador";
import EditOperador from "./components/operadores/EditOperador";
import UserListOperador from "./components/operadores/userListOperador";

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const location = useLocation();

  useEffect(() => {
    document.body.style.backgroundColor = "#F1F9F2";
    document.body.style.fontFamily = "'segoe ui', sans-serif";
    return () => {
      document.body.style.backgroundColor = null;
      document.body.style.fontFamily = null;
    };
  }, []);

  const isLoginPage = location.pathname === "/login";

  return (
    <div className="d-flex flex-column min-vh-100">
      {!isLoginPage && <Navbar />}
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

          {/* Página inicial */}
          <Route path="/" element={token ? <Home /> : <Navigate to="/login" replace />} />

           {/* servicos */}
          <Route path="/servicos" element={token ? <Servicos/> : <Navigate to="/login" replace />} />
          <Route path="/servicos/create" element={token ? <CreateServico/> : <Navigate to="/login" replace />} />
          <Route path="/servicos/list" element={token ? <ListServicos/> : <Navigate to="/login" replace />} />

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

export default App;
