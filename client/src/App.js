import React from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./components/Home";

// Associados
import Associados from "./components/associados/Associados";
import CreateAssociado from "./components/associados/CreateAssociado";
import EditAssociado from "./components/associados/EditAssociado";

// Operadores
import Operadores from "./components/operadores/operadores";
import CreateOperador from "./components/operadores/CreateOperador";
import EditOperador from "./components/operadores/EditOperador";

// Máquinas
import Maquinas from "./components/maquinas/maquinas";
import CreateMaquina from "./components/maquinas/CreateMaquina";
import EditMaquina from "./components/maquinas/EditMaquina";

// Implementos
import Implementos from "./components/implementos/implementos";
import CreateImplemento from "./components/implementos/CreateImplemento";
import EditImplemento from "./components/implementos/EditImplemento";


export default function App() {
    return (
        <>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />

                {/* Associados */}
                <Route path="/associados" element={<Associados />} />
                <Route path="/associados/create" element={<CreateAssociado />} />
                <Route path="/associados/edit/:id" element={<EditAssociado />} />

                {/* Operadores */}
                <Route path="/operadores" element={<Operadores />} />
                <Route path="/operadores/create" element={<CreateOperador />} />
                <Route path="/operadores/edit/:id" element={<EditOperador />} />

                {/* Máquinas */}
                <Route path="/maquinas" element={<Maquinas />} />
                <Route path="/maquinas/create" element={<CreateMaquina />} />
                <Route path="/maquinas/edit/:id" element={<EditMaquina />} />

                {/* Implementos */}
                <Route path="/implementos" element={<Implementos />} />
                <Route path="/implementos/create" element={<CreateImplemento />} />
                <Route path="/implementos/edit/:id" element={<EditImplemento />} />

            </Routes>
        </>
    );
}
