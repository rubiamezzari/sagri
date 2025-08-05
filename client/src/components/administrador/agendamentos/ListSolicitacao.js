import React, { useState, useEffect } from 'react';
import DetalhesSolicitacao from './DetalhesSolicitacao';

export default function ListSolicitacao() {
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [selecionada, setSelecionada] = useState(null);

  useEffect(() => {
    async function carregarSolicitacoes() {
      try {
        const res = await fetch("http://localhost:5050/solicitacoes");
        const data = await res.json();
        setSolicitacoes(data);
      } catch (err) {
        console.error("Erro ao buscar solicitações:", err);
      }
    }

    carregarSolicitacoes();
  }, []);

  const abrirDetalhes = (solicitacao) => {
    setSelecionada(solicitacao);
  };

  const fecharDetalhes = () => {
    setSelecionada(null);
  };

  const atualizarStatus = async (id, novoStatus) => {
    try {
      await fetch(`http://localhost:5050/solicitacoes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: novoStatus }),
      });

      const res = await fetch("http://localhost:5050/solicitacoes");
      const data = await res.json();
      setSolicitacoes(data);
      fecharDetalhes();
    } catch (err) {
      console.error("Erro ao atualizar status:", err);
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '900px', margin: 'auto', fontFamily: 'Inter, sans-serif' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px', fontWeight: '600', fontSize: '24px', color: '#1B4D3E' }}>
        Solicitações de Viagem
      </h2>

      {solicitacoes.length === 0 ? (
        <p style={{ textAlign: "center", color: '#666' }}>Nenhuma solicitação encontrada.</p>
      ) : (
        solicitacoes.map((sol) => (
          <div
            key={sol._id}
            style={{
              background: '#ffffff',
              borderRadius: '14px',
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.08)',
              padding: '25px',
              marginBottom: '20px',
              cursor: 'pointer',
              transition: 'transform 0.2s ease',
            }}
            onClick={() => abrirDetalhes(sol)}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.01)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <h4 style={{ marginBottom: '10px', color: '#1B4D3E' }}>{sol.nome || "Solicitante"}</h4>
            <p style={{ margin: 0, fontSize: '14px', color: '#333' }}>
              Data: {new Date(sol.data_servico).toLocaleDateString()} | Status: <strong>{sol.status}</strong>
            </p>
          </div>
        ))
      )}

      {selecionada && (
        <DetalhesSolicitacao
          solicitacao={selecionada}
          onClose={fecharDetalhes}
          onAtualizarStatus={atualizarStatus}
        />
      )}
    </div>
  );
}
