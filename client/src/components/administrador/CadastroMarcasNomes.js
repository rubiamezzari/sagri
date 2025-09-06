import React, { useState, useEffect } from "react";

const API_URL = "http://localhost:5050";

// --- Botões baseados no estilo que você mandou ---
const btnBase = {
  padding: "6px 14px",
  borderRadius: "20px",
  fontWeight: 500,
  fontSize: "0.85rem",
  border: "1px solid #99c9a0",
  cursor: "pointer",
  transition: "all 0.2s ease",
  marginLeft: "8px",
};

const btnEditar = {
  ...btnBase,
  backgroundColor: "#e6f4ea",
  color: "#386641",
};

const btnSalvar = {
  ...btnBase,
  backgroundColor: "#e6f4ea",
  color: "#386641",
};

const btnExcluir = {
  ...btnBase,
  backgroundColor: "transparent",
  color: "#88a88c",
  border: "1px solid #d0e7d3",
};

const closeBtnStyle = {
  position: "absolute",
  top: "12px",
  right: "12px",
  background: "none",
  border: "none",
  fontSize: "1.4rem",
  cursor: "pointer",
  color: "#666",
};

// --- Estilos gerais ---
const styles = {
  container: {
    display: "flex",
    gap: 24,
    padding: 24,
    maxWidth: 1100,
    margin: "0 auto",
    fontFamily: "Inter, sans-serif",
  },
  section: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: 16,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: "16px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
    border: "1px solid #E2E8F0",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#2F855A",
    borderBottom: "2px solid #E6FFFA",
    paddingBottom: 6,
  },
  form: {
    display: "flex",
    gap: 10,
  },
  input: {
    flex: 1,
    padding: "8px 10px",
    borderRadius: 10,
    border: "1px solid #CBD5E0",
    outline: "none",
    fontSize: 14,
    transition: "all 0.2s ease",
  },
  inputHover: {
    border: "1px solid #2F855A",
  },
  button: {
    ...btnSalvar,
  },
  buttonHover: {
    backgroundColor: "#4cae4c",
  },
  cardList: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    maxHeight: 250,
    overflowY: "auto",
  },
  card: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 12px",
    borderRadius: 12,
    backgroundColor: "#F9FAFB",
    border: "1px solid #E2E8F0",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  cardHover: {
    backgroundColor: "#edfdfd",
  },
  cardName: {
    fontWeight: "500",
    fontSize: 15,
    color: "#2D3748",
  },
  tabs: {
    display: "flex",
    gap: 10,
  },
  tabButton: (active) => ({
    flex: 1,
    padding: "8px 12px",
    backgroundColor: active ? "#2F855A" : "#EDFDFD",
    color: active ? "#fff" : "#2F855A",
    border: "1px solid #2F855A",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: "500",
    transition: "all 0.2s ease",
  }),
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background: "rgba(0,0,0,0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modalContent: {
    position: "relative",
    background: "#fff",
    padding: 24,
    borderRadius: 16,
    width: "300px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
    textAlign: "center",
  },
};

const CadastroMarcasNomes = () => {
  const [marca, setMarca] = useState("");
  const [marcas, setMarcas] = useState([]);
  const [tipo, setTipo] = useState("");
  const [tipos, setTipos] = useState([]);
  const [abaTipo, setAbaTipo] = useState("maquina");

  const [editMarcaId, setEditMarcaId] = useState(null);
  const [editTipoId, setEditTipoId] = useState(null);

  const [modalItem, setModalItem] = useState(null); // item selecionado no modal
  const [modalTipo, setModalTipo] = useState(""); // "marca" ou "tipo"

  useEffect(() => {
    fetchMarcas();
    fetchTipos(abaTipo);
  }, [abaTipo]);

  // --- FETCH ---
  const fetchMarcas = async () => {
    const res = await fetch(`${API_URL}/marcas`);
    const data = await res.json();
    setMarcas(data);
  };

  const fetchTipos = async (categoria) => {
    try {
      const res = await fetch(`${API_URL}/tipos?categoria=${categoria}`);
      const data = await res.json();
      // caso a API não filtre, garante no front
      const filtrados = data.filter((t) => t.categoria === categoria);
      setTipos(filtrados);
    } catch (err) {
      console.error("Erro ao carregar tipos:", err);
    }
  };

  // --- SALVAR / EDITAR ---
  const salvarMarca = async (e) => {
    e.preventDefault();
    if (!marca.trim()) return;

    try {
      if (editMarcaId) {
        await fetch(`${API_URL}/marcas/${editMarcaId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nome: marca.trim() }),
        });
        setEditMarcaId(null);
      } else {
        await fetch(`${API_URL}/marcas`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nome: marca.trim() }),
        });
      }
      setMarca("");
      fetchMarcas();
    } catch (err) {
      console.error(err);
    }
  };

  const salvarTipo = async (e) => {
    e.preventDefault();
    if (!tipo.trim()) return;

    try {
      if (editTipoId) {
        await fetch(`${API_URL}/tipos/${editTipoId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            tipo: tipo.trim(), 
            categoria: abaTipo 
          }),
        });
        setEditTipoId(null);
      } else {
        await fetch(`${API_URL}/tipos`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            tipo: tipo.trim(), 
            categoria: abaTipo 
          }),
        });
      }
      setTipo("");
      fetchTipos(abaTipo);
    } catch (err) {
      console.error(err);
    }
  };

  // --- EXCLUIR ---
  const excluirMarca = async (id) => {
    await fetch(`${API_URL}/marcas/${id}`, { method: "DELETE" });
    fetchMarcas();
    setModalItem(null);
  };

  const excluirTipo = async (id) => {
    await fetch(`${API_URL}/tipos/${id}`, { method: "DELETE" });
    fetchTipos(abaTipo);
    setModalItem(null);
  };

  return (
    <div style={styles.container}>
      {/* MARCAS */}
      <div style={styles.section}>
        <h3 style={styles.title}>Marcas</h3>
        <form style={styles.form} onSubmit={salvarMarca}>
          <input
            style={styles.input}
            type="text"
            placeholder="Digite a marca"
            value={marca}
            onChange={(e) => setMarca(e.target.value)}
          />
          <button style={styles.button} type="submit">
            {editMarcaId ? "Atualizar" : "Salvar"}
          </button>
        </form>
        <div style={styles.cardList}>
          {marcas.map((m) => (
            <div
              style={styles.card}
              key={m._id || m.id}
              onClick={() => {
                setModalItem(m);
                setModalTipo("marca");
              }}
            >
              <span style={styles.cardName}>{m.nome}</span>
            </div>
          ))}
        </div>
      </div>

      {/* TIPOS */}
      <div style={styles.section}>
        <h3 style={styles.title}>Tipos</h3>
        <div style={styles.tabs}>
          <button
            style={styles.tabButton(abaTipo === "maquina")}
            onClick={() => setAbaTipo("maquina")}
          >
            Máquinas
          </button>
          <button
            style={styles.tabButton(abaTipo === "implemento")}
            onClick={() => setAbaTipo("implemento")}
          >
            Implementos
          </button>
        </div>
        <form style={styles.form} onSubmit={salvarTipo}>
          <input
            style={styles.input}
            type="text"
            placeholder={`Digite o tipo de ${abaTipo}`}
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
          />
          <button style={styles.button} type="submit">
            {editTipoId ? "Atualizar" : "Salvar"}
          </button>
        </form>
        <div style={styles.cardList}>
          {tipos.map((t) => (
            <div
              style={styles.card}
              key={t._id || t.id}
              onClick={() => {
                setModalItem(t);
                setModalTipo("tipo");
              }}
            >
              <span style={styles.cardName}>{t.tipo}</span>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL */}
      {modalItem && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <button style={closeBtnStyle} onClick={() => setModalItem(null)}>
              ✕
            </button>
            <h3>{modalTipo === "marca" ? modalItem.nome : modalItem.tipo}</h3>
            <div style={{ marginTop: 20 }}>
              <button
                style={btnEditar}
                onClick={() => {
                  if (modalTipo === "marca") {
                    setMarca(modalItem.nome);
                    setEditMarcaId(modalItem._id || modalItem.id);
                  } else {
                    setTipo(modalItem.tipo);
                    setEditTipoId(modalItem._id || modalItem.id);
                  }
                  setModalItem(null);
                }}
              >
                Editar
              </button>
              <button
                style={btnExcluir}
                onClick={() => {
                  modalTipo === "marca"
                    ? excluirMarca(modalItem._id || modalItem.id)
                    : excluirTipo(modalItem._id || modalItem.id);
                }}
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CadastroMarcasNomes;
