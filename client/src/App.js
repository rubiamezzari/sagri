import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/footer";
import Home from "./components/Home";

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


// Maquinas
import Maquinas from "./components/maquinas/maquinas";
import CreateMaquina from "./components/maquinas/CreateMaquina";
import EditMaquina from "./components/maquinas/EditMaquina";
import ListMaquinas from "./components/maquinas/ListMaquinas";
import DetalhesMaquina from "./components/maquinas/DetalhesMaquina";

// Operadores
import Operadores from "./components/operadores/operadores";
import CreateOperador from "./components/operadores/CreateOperador";
import EditOperador from "./components/operadores/EditOperador";
import UserListOperador from "./components/operadores/UserListOperador";
import DetalhesOperador from "./components/operadores/DetalhesOperador";

const App = () => {
  useEffect(() => {
    document.body.style.backgroundColor = "#eeffe7"; 
document.body.style.fontFamily = "'segoe ui', sans-serif"; 
    return () => {
      document.body.style.backgroundColor = null;
      document.body.style.fontFamily = null;
    };
  }, []);

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <main className="flex-fill container my-4">
        <Routes>
          <Route path="/" element={<Home />} />

          {/* Rotas para Associados */}
          <Route path="/associados" element={<Associados />} />
          <Route path="/associados/create" element={<CreateAssociado />} />
          <Route path="/associados/edit/:id" element={<EditAssociado />} />
          <Route path="/associados/list" element={<UserListAssociado />} />
          <Route path="/associados/:id" element={<DetalhesAssociado />} />
 

          {/* Rotas para Implementos */}
          <Route path="/implementos" element={<Implementos />} />
          <Route path="/implementos/create" element={<CreateImplemento />} />
          <Route path="/implementos/edit/:id" element={<EditImplemento />} />
          <Route path="/implementos/list" element={<ListImplemento />} />
          <Route path="/implementos/:id" element={<DetalhesImplemento />} />


          {/* Rotas para Maquinas */}
          <Route path="/maquinas" element={<Maquinas />} />
          <Route path="/maquinas/create" element={<CreateMaquina />} />
          <Route path="/maquinas/edit/:id" element={<EditMaquina />} />
          <Route path="/maquinas/list" element={<ListMaquinas />} />
          <Route path="/maquinas/:id" element={<DetalhesMaquina />} />

          {/* Rotas para Operadores */}
          <Route path="/operadores" element={<Operadores />} />
          <Route path="/operadores/create" element={<CreateOperador />} />
          <Route path="/operadores/edit/:id" element={<EditOperador />} />
          <Route path="/operadores/list" element={<UserListOperador />} />
          <Route path="/operadores/:id" element={<DetalhesOperador />} />
          
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
