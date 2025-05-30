import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function EditOperador() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    telefone: "",
    categoria_cnh: "",
    status: "",
    observacao: "",
  });

  useEffect(() => {
    fetch(`http://localhost:5000/operadores/${id}`)
      .then(res => res.json())
      .then(data => setFormData(data))
      .catch(err => console.error("Erro ao buscar operador:", err));
  }, [id]);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:5000/operadores/update/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert("Operador atualizado com sucesso!");
        navigate("/operadores");
      } else {
        alert("Erro ao atualizar operador.");
      }
    } catch (err) {
      console.error("Erro:", err);
    }
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ marginBottom: "20px" }}>Editar Operador</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px", maxWidth: "400px" }}>
        <input name="nome" value={formData.nome} onChange={handleChange} placeholder="Nome" required />
        <input name="cpf" value={formData.cpf} onChange={handleChange} placeholder="CPF" required />
        <input name="telefone" value={formData.telefone} onChange={handleChange} placeholder="Telefone" required />
        <input name="categoria_cnh" value={formData.categoria_cnh} onChange={handleChange} placeholder="Categoria CNH" required />
        <select name="status" value={formData.status} onChange={handleChange} required>
          <option value="">Selecione o status</option>
          <option value="ativo">Ativo</option>
          <option value="inativo">Inativo</option>
        </select>
        <textarea name="observacao" value={formData.observacao} onChange={handleChange} placeholder="Observações" />

        <button type="submit" style={{
          backgroundColor: "#ccedbf",
          color: "#000",
          padding: "8px",
          border: "1px solid #1c3d21",
          borderRadius: "5px",
          fontWeight: "500"
        }}>Salvar</button>
      </form>
    </div>
  );
}
