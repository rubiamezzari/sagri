import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const containerStyle = {
  maxWidth: "800px",
  margin: "40px auto",
  padding: "30px 40px",
  backgroundColor: "#ffffff",
  borderRadius: "5px",
};

const sectionTitle = {
  color: "#100f0d",
  marginBottom: "16px",
  fontWeight: "600",
  fontSize: "1.2rem",
  borderBottom: "0.5px solid rgb(131, 148, 131)",
  paddingBottom: "10px",
};

const labelStyle = {
  fontWeight: "600",
  color: "#100f0d",
  marginTop: "10px",
};

const valueStyle = {
  marginLeft: "10px",
  fontWeight: "400",
};

const btnVoltar = {
  marginTop: "20px",
  padding: "8px 14px",
  backgroundColor: "#ccedbf",
  border: "1px solid #1c3d21",
  borderRadius: "5px",
  cursor: "pointer",
  fontWeight: "600",
  color: "#000",
};

export default function DetalhesMaquina() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [maquina, setMaquina] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchMaquina() {
      try {
        const res = await fetch(`http://localhost:5050/maquinas/${id}`);
        if (!res.ok) {
          throw new Error("Erro ao buscar máquina");
        }
        const data = await res.json();
        setMaquina(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchMaquina();
  }, [id]);

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>{error}</p>;
  if (!maquina) return <p>Máquina não encontrada</p>;

  return (
    <div style={containerStyle}>
      <h2 style={sectionTitle}>Detalhes da Máquina</h2>

      <div>
        <strong style={labelStyle}>Tipo:</strong>
        <span style={valueStyle}>{maquina.tipo || maquina.nome}</span>
      </div>

      <div>
        <strong style={labelStyle}>Marca:</strong>
        <span style={valueStyle}>{maquina.marca}</span>
      </div>

      <div>
        <strong style={labelStyle}>Modelo:</strong>
        <span style={valueStyle}>{maquina.modelo}</span>
      </div>

      <div>
        <strong style={labelStyle}>Potência:</strong>
        <span style={valueStyle}>{maquina.potencia || "N/A"}</span>
      </div>

      <div>
        <strong style={labelStyle}>Número de Série:</strong>
        <span style={valueStyle}>{maquina.n_serie || "N/A"}</span>
      </div>

      <div>
        <strong style={labelStyle}>Status:</strong>
        <span style={valueStyle}>{maquina.status || "N/A"}</span>
      </div>

      <div>
        <strong style={labelStyle}>Observação:</strong>
        <p style={{ marginLeft: "10px" }}>{maquina.observacao || "Sem observações"}</p>
      </div>

      {maquina.foto && (
        <div style={{ marginTop: "20px" }}>
          <img
            src={maquina.foto}
            alt="Foto da máquina"
            style={{ maxWidth: "100%", borderRadius: "8px" }}
          />
        </div>
      )}

      <button style={btnVoltar} onClick={() => navigate(-1)}>
        Voltar
      </button>
    </div>
  );
}
