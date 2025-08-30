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
  isToday,
} from "date-fns";
import ptBR from "date-fns/locale/pt-BR";

const API_URL = "http://localhost:5050";

const containerStyle = {
  maxWidth: "800px",
  margin: "40px auto",
  padding: "30px 40px",
  backgroundColor: "#fff",
  boxShadow: "0 15px 30px rgba(0,0,0,0.05)",
  borderRadius: "5px",
  fontFamily: "Inter, sans-serif",
};

const sectionTitle = {
  color: "#1B4D3E",
  marginBottom: "16px",
  fontWeight: "500",
  fontSize: "1rem",
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
};

const inputFocus = {
  borderColor: "#1B4D3E",
  outline: "none",
};

const getBtnCadastrarStyle = (hover) => ({
  backgroundColor: hover ? "#143018" : "#1B4D3E",
  color: "#D2EFE6",
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
  backgroundColor: hover ? "#c7e5cc" : "#D2EFE6",
  color: "#143018",
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

const calendarHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "20px",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(7, 1fr)",
  gap: "8px",
};

const dayNameStyle = {
  fontWeight: "600",
  fontSize: "0.75rem",
  color: "#1B4D3E",
  textAlign: "center",
};

const dayStyle = (disponivel, isHoje) => ({
  backgroundColor: disponivel ? "#D2EFE6" : "#f1f1f1",
  color: disponivel ? "#143018" : "#888",
  padding: "16px 0",
  textAlign: "center",
  borderRadius: "6px",
  cursor: disponivel ? "pointer" : "not-allowed",
  fontWeight: "500",
  border: isHoje ? "2px solid #1B4D3E" : "none",
  transition: "transform 0.1s",
});

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
    const usuarioLogadoString = localStorage.getItem("usuarioLogado");

    if (!usuarioLogadoString) {
      alert("Erro: nenhum usuário logado encontrado.");
      return;
    }

    let usuarioLogado;
    try {
      usuarioLogado = JSON.parse(usuarioLogadoString);
    } catch {
      alert("Erro: dados de usuário inválidos.");
      return;
    }

    if (!usuarioLogado._id) {
      alert("Erro: ID do usuário não encontrado.");
      return;
    }

    const novaSolicitacao = {
      usuario_id: usuarioLogado._id,
      data: dataSelecionada,
      tipoServico: form.tipoServico,
      hora: form.hora,
      tempo: form.tempo,
      observacao: form.observacao,
    };

    fetch(`${API_URL}/solicitacoes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(novaSolicitacao),
    })
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "Erro ao criar solicitação");
        }
        return res.json();
      })
      .then((data) => {
        alert("Solicitação enviada com sucesso!");
        setForm({ tipoServico: "", hora: "", tempo: "", observacao: "" });
        setEtapa(1);
      })
      .catch((err) => {
        console.error(err);
        alert("Erro ao enviar solicitação. Veja o console para detalhes.");
      });
  }

  const dias = diasDoCalendario(mesAtual);

  return (
    <div style={containerStyle}>
      {etapa === 1 && (
        <>
          <div style={calendarHeader}>
            <button style={getBtnCancelarStyle(false)} onClick={() => setMesAtual(subMonths(mesAtual, 1))}>←</button>
            <h3 style={{ margin: 0, color: "#1B4D3E" }}>{format(mesAtual, "MMMM yyyy", { locale: ptBR })}</h3>
            <button style={getBtnCancelarStyle(false)} onClick={() => setMesAtual(addMonths(mesAtual, 1))}>→</button>
          </div>
          <div style={grid}>
            {nomesDias.map((dia) => (<div key={dia} style={dayNameStyle}>{dia}</div>))}
            {dias.map((dia, index) => (
              <div
                key={index}
                style={dayStyle(true, isToday(dia))}
                onClick={() => selecionarData(dia)}
              >
                {dia.getMonth() === mesAtual.getMonth() ? dia.getDate() : ""}
              </div>
            ))}
          </div>
        </>
      )}

      {etapa === 2 && (
        <form onSubmit={(e) => { e.preventDefault(); enviarFormulario(); }}>
          <h5 style={sectionTitle}>DADOS DO AGENDAMENTO</h5>
          <p style={{ marginBottom: "20px", color: "#143018", fontWeight: "600", textAlign: "center", fontSize: "0.9rem" }}>
            {format(dataSelecionada, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
          </p>

          <label style={labelStyle}>Tipo de serviço</label>
          <select
            name="tipoServico"
            value={form.tipoServico}
            onChange={handleInput}
            onFocus={() => setFocusField("tipoServico")}
            onBlur={() => setFocusField(null)}
            style={focusField === "tipoServico" ? { ...inputStyle, ...inputFocus } : inputStyle}
            required
          >
            <option value="">Selecione...</option>
            {servicosDisponiveis.map((s) => (
              <option key={s._id} value={s.nome}>{s.nome}</option>
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
            style={focusField === "observacao" ? { ...inputStyle, ...inputFocus, height: "80px" } : { ...inputStyle, height: "80px" }}
          />

          <div style={{ marginTop: "30px", display: "flex", justifyContent: "center" }}>
            <button type="submit" style={getBtnCadastrarStyle(hoverCadastrar)} onMouseEnter={() => setHoverCadastrar(true)} onMouseLeave={() => setHoverCadastrar(false)}>Enviar</button>
            <button type="button" style={getBtnCancelarStyle(hoverCancelar)} onMouseEnter={() => setHoverCancelar(true)} onMouseLeave={() => setHoverCancelar(false)} onClick={() => setEtapa(1)}>Cancelar</button>
          </div>
        </form>
      )}
    </div>
  );
}
