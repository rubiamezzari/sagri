import React, { useState, useEffect } from "react";

const API_URL = "http://localhost:5050";

const styles = {
  container: {
    display: "flex",
    gap: 20,
    padding: 20,
    maxWidth: 900,
    margin: "0 auto",
    fontFamily: "Inter, sans-serif",
  },
  section: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2F855A",
    marginBottom: 10,
  },
  form: {
    display: "flex",
    gap: 10,
    marginBottom: 10,
  },
  input: {
    flex: 1,
    padding: 8,
    borderRadius: 6,
    border: "1px solid #CBD5E0",
  },
  button: {
    padding: "8px 12px",
    backgroundColor: "#2F855A",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },
  cardList: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    maxHeight: 250,
    overflowY: "auto",
  },
  card: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#E6FFFA",
    border: "1px solid #2F855A",
  },
  cardName: {
    fontWeight: "500",
  },
  cardButtons: {
    display: "flex",
    gap: 5,
  },
  deleteBtn: {
    backgroundColor: "#E53E3E",
    border: "none",
    color: "#fff",
    padding: "4px 8px",
    borderRadius: 6,
    cursor: "pointer",
    fontSize: 12,
  },
  editBtn: {
    backgroundColor: "#3182CE",
    border: "none",
    color: "#fff",
    padding: "4px 8px",
    borderRadius: 6,
    cursor: "pointer",
    fontSize: 12,
  },
  tabs: {
    display: "flex",
    gap: 10,
    marginBottom: 10,
  },
  tabButton: (active) => ({
    flex: 1,
    padding: 6,
    backgroundColor: active ? "#2F855A" : "#E6FFFA",
    color: active ? "#fff" : "#2F855A",
    border: "1px solid #2F855A",
    borderRadius: 6,
    cursor: "pointer",
  }),
};

const CadastroMarcasNomes = () => {
  const [marca, setMarca] = useState("");
  const [marcas, setMarcas] = useState([]);
  const [tipo, setTipo] = useState("");
  const [tipos, setTipos] = useState([]);
  const [abaTipo, setAbaTipo] = useState("maquina");

  const [editMarcaId, setEditMarcaId] = useState(null);
  const [editTipoId, setEditTipoId] = useState(null);

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
    const res = await fetch(`${API_URL}/tipos?categoria=${categoria}`);
    const data = await res.json();
    setTipos(data);
  };

  // --- SALVAR / EDITAR ---
  const salvarMarca = async (e) => {
    e.preventDefault();
    if (!marca.trim()) return;

    try {
      if (editMarcaId) {
        // editar
        await fetch(`${API_URL}/marcas/${editMarcaId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nome: marca.trim() }),
        });
        setEditMarcaId(null);
      } else {
        // criar
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
          body: JSON.stringify({ tipo: tipo.trim() }),
        });
        setEditTipoId(null);
      } else {
        await fetch(`${API_URL}/tipos`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tipo: tipo.trim(), categoria: abaTipo }),
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
  };

  const excluirTipo = async (id) => {
    await fetch(`${API_URL}/tipos/${id}`, { method: "DELETE" });
    fetchTipos(abaTipo);
  };

  // --- EDITAR ---
  const editarMarca = (m) => {
    setMarca(m.nome);
    setEditMarcaId(m._id || m.id);
  };

  const editarTipo = (t) => {
    setTipo(t.tipo);
    setEditTipoId(t._id || t.id);
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
            <div style={styles.card} key={m._id || m.id}>
              <span style={styles.cardName}>{m.nome}</span>
              <div style={styles.cardButtons}>
                <button style={styles.editBtn} onClick={() => editarMarca(m)}>
                  Editar
                </button>
                <button style={styles.deleteBtn} onClick={() => excluirMarca(m._id || m.id)}>
                  Excluir
                </button>
              </div>
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
            <div style={styles.card} key={t._id || t.id}>
              <span style={styles.cardName}>{t.tipo}</span>
              <div style={styles.cardButtons}>
                <button style={styles.editBtn} onClick={() => editarTipo(t)}>
                  Editar
                </button>
                <button style={styles.deleteBtn} onClick={() => excluirTipo(t._id || t.id)}>
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CadastroMarcasNomes;
