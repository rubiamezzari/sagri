import React, { useState } from "react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";

const containerStyle = {
  maxWidth: "800px",
  margin: "60px auto",
  backgroundColor: "#ffffff",
  padding: "40px",
  borderRadius: "2px",
  boxShadow: "0 5px 10px rgba(0,0,0,0.05)",
};

const titleStyle = {
  fontSize: "1.8rem",
  fontWeight: "500",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
  fontFamily: '"Inter", sans-serif',
  color: "#1B4D3E",
  textAlign: "center",
  marginBottom: "30px",
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

const label = {
  fontSize: "0.9rem",
  fontWeight: "600",
  color: "#1a381f",
  marginBottom: "4px",
  fontFamily: '"Inter", sans-serif',
};

const input = {
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid #c3dec1",
  backgroundColor: "#f0f8f0",
  fontSize: "1rem",
  width: "100%",
  boxSizing: "border-box",
  outline: "none",
  transition: "border-color 0.3s",
};

const inputFocus = {
  borderColor: "#88b04b",
  boxShadow: "0 0 5px #88b04b",
};

const inputSelect = {
  ...input,
  appearance: "none",
  WebkitAppearance: "none",
  MozAppearance: "none",
  backgroundImage:
    "url('data:image/svg+xml;utf8,<svg fill=\"%231a381f\" height=\"24\" viewBox=\"0 0 24 24\" width=\"24\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M7 10l5 5 5-5z\"/></svg>')",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 12px center",
  backgroundSize: "16px 16px",
  paddingRight: "40px",
  cursor: "pointer",
};

const btnContainer = {
  display: "flex",
  justifyContent: "center",
  gap: "20px",
  marginTop: "30px",
};

const btn = (bg, color) => ({
  backgroundColor: bg,
  color: color,
  border: "none",
  padding: "12px 20px",
  borderRadius: "6px",
  fontWeight: "600",
  cursor: "pointer",
  transition: "background-color 0.3s",
});

export default function Agendamento() {
  const [etapa, setEtapa] = useState(1);
  const [dataSelecionada, setDataSelecionada] = useState(null);
  const [mesAtual, setMesAtual] = useState(new Date());
  const [form, setForm] = useState({
    tipoServico: "",
    hora: "",
    tempo: "",
    observacao: "",
  });
  const [selectFocus, setSelectFocus] = useState(false);
  const [inputFocusState, setInputFocusState] = useState({});

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

  function handleFocus(e) {
    setInputFocusState((prev) => ({ ...prev, [e.target.name]: true }));
  }

  function handleBlur(e) {
    setInputFocusState((prev) => ({ ...prev, [e.target.name]: false }));
  }

  function enviarFormulario() {
    alert("Solicitação enviada com sucesso!");
  }

  const dias = diasDoCalendario(mesAtual);

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>Solicitar novo agendamento</h2>

      {etapa === 1 && (
        <>
          <div style={calendarHeader}>
            <button style={monthNavBtn} onClick={() => setMesAtual(subMonths(mesAtual, 1))}>←</button>
            <h3 style={{ color: "#1a381f", margin: 0, fontWeight: "500", fontFamily: '"Inter", sans-serif' }}>
              {format(mesAtual, "MMMM yyyy", { locale: ptBR })}
            </h3>
            <button style={monthNavBtn} onClick={() => setMesAtual(addMonths(mesAtual, 1))}>→</button>
          </div>

          <div style={grid}>
            {nomesDias.map((dia) => (
              <div key={dia} style={dayNameStyle}>{dia}</div>
            ))}
            {dias.map((dia, index) => (
              <div
                key={index}
                style={dayStyle(true)}
                onClick={() => selecionarData(dia)}
              >
                {dia.getMonth() === mesAtual.getMonth() ? dia.getDate() : ""}
              </div>
            ))}
          </div>
        </>
      )}

      {etapa === 2 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <p style={{ color: "#1a381f", fontWeight: "600", fontFamily: '"Inter", sans-serif' }}>
            Data selecionada: {format(dataSelecionada, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
          </p>

          <div>
            <label style={label}>Tipo de serviço</label>
            <select
              name="tipoServico"
              style={selectFocus ? { ...inputSelect, ...inputFocus } : inputSelect}
              value={form.tipoServico}
              onChange={handleInput}
              onFocus={() => setSelectFocus(true)}
              onBlur={() => setSelectFocus(false)}
            >
              <option value="">Selecione...</option>
              <option value="Arar">Arar</option>
              <option value="Gradear">Gradear</option>
              <option value="Plantar">Plantar</option>
              <option value="Colher">Colher</option>
            </select>
          </div>

          <div>
            <label style={label}>Hora</label>
            <input
              name="hora"
              type="time"
              style={inputFocusState["hora"] ? { ...input, ...inputFocus } : input}
              value={form.hora}
              onChange={handleInput}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </div>

          <div>
            <label style={label}>Tempo estimado</label>
            <input
              name="tempo"
              type="text"
              style={inputFocusState["tempo"] ? { ...input, ...inputFocus } : input}
              value={form.tempo}
              onChange={handleInput}
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholder="Ex: 2h"
            />
          </div>

          <div>
            <label style={label}>Observação</label>
            <textarea
              name="observacao"
              style={inputFocusState["observacao"] ? { ...input, ...inputFocus, height: "80px", resize: "none" } : { ...input, height: "80px", resize: "none" }}
              value={form.observacao}
              onChange={handleInput}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </div>

          <div style={btnContainer}>
            <button
              style={{ ...btn("#d2efc8", "#1a381f") }}
              onClick={() => setEtapa(1)}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#b7d7a8")}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#d2efc8")}
            >
              Voltar
            </button>
            <button
              style={{ ...btn("#1a381f", "#ffffff") }}
              onClick={enviarFormulario}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#153313")}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#1a381f")}
            >
              Enviar Solicitação
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
