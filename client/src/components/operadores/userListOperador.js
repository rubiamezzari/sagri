import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5050";

const btnEditar = {
  backgroundColor: "#1c3d21",
  color: "#fff",
  padding: "5px 12px",
  borderRadius: "4px",
  fontSize: "0.75rem",
  border: "none",
  cursor: "pointer",
  fontWeight: "500",
  textDecoration: "none",
  marginRight: "8px",
};

const btnExcluir = {
  backgroundColor: "#daf4d0", // mesma cor do botão editar
  color: "#fff",
  padding: "5px 12px",
  borderRadius: "4px",
  fontSize: "0.75rem",
  border: "none", 
  cursor: "pointer",
  fontWeight: "500",
   color: "#86a479",
};

export default function ListOperadores() {
  const [operadores, setOperadores] = useState([]);
  const [busca, setBusca] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    buscarOperadores();
  }, []);

  async function buscarOperadores() {
    try {
      const response = await fetch(`${API_URL}/operadores`);
      if (!response.ok) throw new Error("Erro ao buscar operadores");
      const data = await response.json();
      setOperadores(data);
    } catch (error) {
      alert("Erro ao buscar operadores: " + error.message);
    }
  }

  async function handleDelete(id) {
    const confirmar = window.confirm("Tem certeza que deseja excluir este operador?");
    if (!confirmar) return;

    try {
      const response = await fetch(`${API_URL}/operadores/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Erro ao excluir operador");
      alert("Operador excluído com sucesso!");
      buscarOperadores();
    } catch (error) {
      alert("Erro ao excluir operador: " + error.message);
    }
  }

  const operadoresFiltrados = operadores.filter((op) =>
    [op.nome, op.telefone, op.cpf, op.usuario, op.email].some((campo) =>
      campo?.toLowerCase().includes(busca.toLowerCase())
    )
  );

  return (
    <div style={{ width: "100%", backgroundColor: "#fff", padding: "20px", borderRadius: "5px" }}>
      <input
        type="text"
        placeholder="Pesquisar operador..."
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          borderRadius: "5px",
          border: "1px solid #ccc",
          outlineColor: "#1c3d21",
          fontSize: "0.85rem",
          marginBottom: "15px",
        }}
      />

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: "0.85rem",
          textAlign: "center",
        }}
      >
        <thead style={{ backgroundColor: "#f8f8f8", fontWeight: "600" }}>
          <tr style={{ borderBottom: "1px solid #ccc" }}>
            <th style={{ padding: "12px 0" }}>#</th>
            <th style={{ padding: "12px 0" }}>Nome</th>
            <th style={{ padding: "12px 0" }}>Usuário</th>
            <th style={{ padding: "12px 0" }}>E-mail</th>
            <th style={{ padding: "12px 0" }}>Telefone</th>
            <th style={{ padding: "12px 0" }}>CPF</th>
            <th style={{ padding: "12px 0" }}></th>
          </tr>
        </thead>
        <tbody>
          {operadoresFiltrados.length === 0 ? (
            <tr>
              <td colSpan={7} style={{ padding: "12px 0" }}>
                Nenhum operador encontrado.
              </td>
            </tr>
          ) : (
            operadoresFiltrados.map((op, idx) => (
              <tr key={op._id} style={{ borderBottom: "1px solid #ccc" }}>
                <td style={{ padding: "12px 8px" }}>{idx + 1}</td>
                <td style={{ padding: "12px 8px" }}>{op.nome?.toUpperCase() || "—"}</td>
                <td style={{ padding: "12px 8px" }}>{op.usuario?.toUpperCase() || "—"}</td>
                <td style={{ padding: "12px 8px" }}>{op.email?.toUpperCase() || "—"}</td>
                <td style={{ padding: "12px 8px" }}>{op.telefone?.toUpperCase() || "—"}</td>
                <td style={{ padding: "12px 8px" }}>{op.cpf?.toUpperCase() || "—"}</td>
                <td style={{ textAlign: "center", padding: "12px 8px" }}>
                  <Link to={`/operadores/edit/${op._id}`} style={btnEditar}>
                    Editar
                  </Link>
                  <button onClick={() => handleDelete(op._id)} style={btnExcluir}>
                    Excluir
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
