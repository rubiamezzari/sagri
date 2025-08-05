import React, { useEffect, useState } from "react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
} from "date-fns";
import ptBR from "date-fns/locale/pt-BR";

const API_URL = "http://localhost:5050";

// Estilos reutilizados do CreateImplemento
const containerStyle = {
  maxWidth: "800px",
  margin: "60px auto",
  backgroundColor: "#ffffff",
  padding: "40px",
  borderRadius: "5px",
  boxShadow: "0 5px 10px rgba(0,0,0,0.05)",
};

const calendarHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "20px",
};

const monthNavBtn = {
  background: "none",
  border: "none",
  fontSize: "1.5rem",
  cursor: "pointer",
  color: "#1a381f",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(7, 1fr)",
  gap: "10px",
};

const dayNameStyle = {
  fontWeight: "600",
  fontSize: "0.85rem",
  color: "#1a381f",
  textAlign: "center",
};

const dayStyle = (disponivel) => ({
  backgroundColor: disponivel ? "#d2efc8" : "#1a381f",
  color: disponivel ? "#1a381f" : "#ffffff",
  padding: "18px 0",
  textAlign: "center",
  borderRadius: "6px",
  cursor: disponivel ? "pointer" : "not-allowed",
  fontWeight: "500",
  minHeight: "45px",
});

const sectionTitle = {
  color: "#100f0d",
  marginBottom: "16px",
  fontWeight: "500",
  fontSize: "1.2rem",
  borderBottom: "0.5px solid rgb(131, 148, 131)",
  paddingBottom: "6px",
  textAlign: "center",
};

const labelStyle = {
  display: "block",
  marginBottom: "6px",
  fontWeight: "600",
  color: "#100f0d",
  fontSize: "0.8rem",
  textAlign: "left",
};

const inputStyle = {
  width: "100%",
  padding: "5px 6px",
  marginBottom: "10px",
  borderRadius: "5px",
  border: "0.1px solid #e8e8e8",
  fontSize: "1rem",
  boxSizing: "border-box",
  transition: "border-color 0.3s",
  maxWidth: "100%",
};

const inputFocus = {
  borderColor: "#e8e8e8",
  outline: "none",
};

const getBtnCadastrarStyle = (hover) => ({
  backgroundColor: hover ? "#174436ff" : "#1B4D3E",
  color: "#daf4d0",
  padding: "8px 10px",
  borderRadius: "5px",
  border: "none",
  cursor: "pointer",
  fontWeight: "500",
  fontSize: "1.1rem",
  width: "30%",
  transition: "background-color 0.3s",
});

const getBtnCancelarStyle = (hover) => ({
  backgroundColor: hover ? "#ccedbf" : "#daf4d0",
  color: "#1B4D3E",
  padding: "8px 10px",
  borderRadius: "5px",
  border: "none",
  cursor: "pointer",
  fontWeight: "500",
  fontSize: "1.1rem",
  width: "30%",
  marginLeft: "20px",
  transition: "background-color 0.3s",
});

// --- Componente ---
export default function CreateSolicitacao() {
  const [etapa, setEtapa] = useState(1);
  const [dataSelecionada, setDataSelecionada] = useState(null);
  const [mesAtual, setMesAtual] = useState(new Date());
  const [servicosDisponiveis, setServicosDisponiveis] = useState([]);
  const [form, setForm] = useState({
    tipoServico: "",
    hora: "",
    tempo: "",
    observacao: "",
  });
  const [hoverCadastrar, setHoverCadastrar] = useState(false);
  const [hoverCancelar, setHoverCancelar] = useState(false);
  const [focusField, setFocusField] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/servicos`)
      .then((res) => res.json())
      .then((data) => setServicosDisponiveis(data))
      .catch((err) => console.error("Erro ao buscar serviços:", err));
  }, []);

  const nomesDias = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  function diasDoCalendario(mes) {
    const inicio = startOfWeek(startOfMonth(mes), { weekStartsOn: 0 });
    const fim = endOfWeek(endOfMonth(mes), { weekStartsOn: 0 });
    return eachDayOfInterval({ start: inicio, end: fim });
  }

  function selecionarData(dia) {
    setDataSelecionada(dia);
    setEtapa(2);
  }

  function handleInput(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function enviarFormulario() {
    // Aqui você pode fazer a chamada para API pra enviar a solicitação real
    alert("Solicitação enviada com sucesso!");
    setForm({
      tipoServico: "",
      hora: "",
      tempo: "",
      observacao: "",
    });
    setDataSelecionada(null);
    setEtapa(1);
  }

  const dias = diasDoCalendario(mesAtual);

  return (
    <div style={containerStyle}>
      {etapa === 1 && (
        <>
          <div style={calendarHeader}>
            <button
              style={monthNavBtn}
              onClick={() => setMesAtual(subMonths(mesAtual, 1))}
            >
              ←
            </button>
            <h3 style={{ color: "#1a381f", margin: 0 }}>
              {format(mesAtual, "MMMM yyyy", { locale: ptBR })}
            </h3>
            <button
              style={monthNavBtn}
              onClick={() => setMesAtual(addMonths(mesAtual, 1))}
            >
              →
            </button>
          </div>

          <div style={grid}>
            {nomesDias.map((dia) => (
              <div key={dia} style={dayNameStyle}>
                {dia}
              </div>
            ))}
            {dias.map((dia, index) => {
              const isMesAtual = dia.getMonth() === mesAtual.getMonth();
              return (
                <div
                  key={index}
                  style={dayStyle(isMesAtual)}
                  onClick={() => isMesAtual && selecionarData(dia)}
                >
                  {isMesAtual ? dia.getDate() : ""}
                </div>
              );
            })}
          </div>
        </>
      )}

      {etapa === 2 && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            enviarFormulario();
          }}
        >
          <h5 style={sectionTitle}>DADOS DO AGENDAMENTO</h5>

          <p
            style={{
              marginBottom: "20px",
              color: "#143018",
              fontWeight: "600",
              textAlign: "center",
              fontSize: "0.9rem",
            }}
          >
            {format(dataSelecionada, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
          </p>

          <label style={labelStyle}>Tipo de serviço</label>
          <select
            name="tipoServico"
            value={form.tipoServico}
            onChange={handleInput}
            onFocus={() => setFocusField("tipoServico")}
            onBlur={() => setFocusField(null)}
            style={
              focusField === "tipoServico"
                ? { ...inputStyle, ...inputFocus }
                : inputStyle
            }
            required
          >
            <option value="" disabled>
              -- Selecione --
            </option>
            {servicosDisponiveis.map((s) => (
              <option key={s._id} value={s._id}>
                {s.nome}
              </option>
            ))}
          </select>

          <label style={labelStyle}>Hora</label>
          <input
            name="hora"
            type="time"
            value={form.hora}
            onChange={handleInput}
            onFocus={() => setFocusField("hora")}
            onBlur={() => setFocusField(null)}
            style={focusField === "hora" ? { ...inputStyle, ...inputFocus } : inputStyle}
            required
          />

          <label style={labelStyle}>Tempo estimado</label>
          <input
            name="tempo"
            type="text"
            value={form.tempo}
            onChange={handleInput}
            onFocus={() => setFocusField("tempo")}
            onBlur={() => setFocusField(null)}
            style={focusField === "tempo" ? { ...inputStyle, ...inputFocus } : inputStyle}
            required
          />

          <label style={labelStyle}>Observação</label>
          <textarea
            name="observacao"
            value={form.observacao}
            onChange={handleInput}
            onFocus={() => setFocusField("observacao")}
            onBlur={() => setFocusField(null)}
            style={
              focusField === "observacao"
                ? { ...inputStyle, ...inputFocus, height: "80px" }
                : { ...inputStyle, height: "80px" }
            }
          />

          <div
            style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}
          >
            <button
              type="button"
              style={getBtnCancelarStyle(hoverCancelar)}
              onMouseEnter={() => setHoverCancelar(true)}
              onMouseLeave={() => setHoverCancelar(false)}
              onClick={() => setEtapa(1)}
            >
              Voltar
            </button>

            <button
              type="submit"
              style={getBtnCadastrarStyle(hoverCadastrar)}
              onMouseEnter={() => setHoverCadastrar(true)}
              onMouseLeave={() => setHoverCadastrar(false)}
            >
              Enviar
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
