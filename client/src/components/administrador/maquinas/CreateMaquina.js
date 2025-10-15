import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const REACT_APP_YOUR_HOSTNAME = "http://localhost:5050";

export default function CreateMaquina() {
  const [form, setForm] = useState({
    tipo: "",
    marca: "",
    modelo: "",
    potencia: "",
    n_serie: "",
    observacao: "",
  });

  const [tipos, setTipos] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [focusField, setFocusField] = useState(null);
  const navigate = useNavigate();

  // Carrega tipos e marcas do backend
  useEffect(() => {
    fetch(`${REACT_APP_YOUR_HOSTNAME}/tipos?categoria=maquina`)
      .then((res) => res.json())
      .then((data) => setTipos(data))
      .catch(console.error);

    fetch(`${REACT_APP_YOUR_HOSTNAME}/marcas`)
      .then((res) => res.json())
      .then((data) => setMarcas(data))
      .catch(console.error);
  }, []);

  function updateForm(value) {
    setForm((prev) => ({ ...prev, ...value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    try {
      const response = await fetch(`${REACT_APP_YOUR_HOSTNAME}/maquinas/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const errorText = await response.text();
        alert("Erro ao cadastrar máquina: " + errorText);
        return;
      }

      const data = await response.json();
      alert(data.message || "Máquina cadastrada com sucesso!");
      setForm({ tipo: "", marca: "", modelo: "", potencia: "", n_serie: "", observacao: "" });
      navigate("/maquinas");
    } catch (error) {
      alert("Erro na comunicação com o servidor.");
      console.error(error);
    }
  }

  // SVG Icons
  const SettingsIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 1v6m0 6v6m0-18a9 9 0 1 1 0 18 9 9 0 0 1 0-18Z" />
      <path d="M19.07 4.93A10 10 0 0 0 4.93 19.07M4.93 4.93A10 10 0 0 1 19.07 19.07" />
    </svg>
  );

  const TruckIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 3h15v13H1z" />
      <path d="M16 8h4l3 3v5h-7V8z" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  );

  const CheckIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        background: "linear-gradient(135deg, #F5F1E8 0%, #E8E4D8 100%)",
      }}
    >
      <div style={{ width: "100%", maxWidth: "640px" }}>
        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: "12px",
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
            overflow: "hidden",
          }}
        >
          {/* Header with Icon */}
          

          <div style={{ padding: "28px" }}>
            <form onSubmit={onSubmit}>
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                {/* Tipo e Marca */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "16px" }}>
                  <div>
                    <label
                      htmlFor="tipo"
                      style={{
                        display: "block",
                        marginBottom: "6px",
                        color: "#1B4D3E",
                        fontSize: "13px",
                        fontWeight: "500",
                      }}
                    >
                      Tipo *
                    </label>
                    <select
                      id="tipo"
                      value={form.tipo}
                      onChange={(e) => updateForm({ tipo: e.target.value })}
                      onFocus={() => setFocusField("tipo")}
                      onBlur={() => setFocusField(null)}
                      required
                      style={{
                        width: "100%",
                        height: "42px",
                        padding: "0 12px",
                        border: "2px solid",
                        borderColor: focusField === "tipo" ? "#1B4D3E" : "#D4E7D7",
                        borderRadius: "8px",
                        backgroundColor: "#FEFDFB",
                        fontSize: "14px",
                        outline: "none",
                        transition: "all 0.3s",
                        boxSizing: "border-box",
                        cursor: "pointer",
                      }}
                    >
                      <option value="">Selecione um tipo</option>
                      {tipos.map((t) => (
                        <option key={t._id} value={t.tipo}>
                          {t.tipo}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="marca"
                      style={{
                        display: "block",
                        marginBottom: "6px",
                        color: "#1B4D3E",
                        fontSize: "13px",
                        fontWeight: "500",
                      }}
                    >
                      Marca *
                    </label>
                    <select
                      id="marca"
                      value={form.marca}
                      onChange={(e) => updateForm({ marca: e.target.value })}
                      onFocus={() => setFocusField("marca")}
                      onBlur={() => setFocusField(null)}
                      required
                      style={{
                        width: "100%",
                        height: "42px",
                        padding: "0 12px",
                        border: "2px solid",
                        borderColor: focusField === "marca" ? "#1B4D3E" : "#D4E7D7",
                        borderRadius: "8px",
                        backgroundColor: "#FEFDFB",
                        fontSize: "14px",
                        outline: "none",
                        transition: "all 0.3s",
                        boxSizing: "border-box",
                        cursor: "pointer",
                      }}
                    >
                      <option value="">Selecione uma marca</option>
                      {marcas.map((m) => (
                        <option key={m._id} value={m.nome}>
                          {m.nome}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Modelo e Potência */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "16px" }}>
                  <div>
                    <label
                      htmlFor="modelo"
                      style={{
                        display: "block",
                        marginBottom: "6px",
                        color: "#1B4D3E",
                        fontSize: "13px",
                        fontWeight: "500",
                      }}
                    >
                      Modelo
                    </label>
                    <input
                      id="modelo"
                      type="text"
                      value={form.modelo}
                      onChange={(e) => updateForm({ modelo: e.target.value })}
                      onFocus={() => setFocusField("modelo")}
                      onBlur={() => setFocusField(null)}
                      placeholder="Ex: TX68"
                      style={{
                        width: "100%",
                        height: "42px",
                        padding: "0 12px",
                        border: "2px solid",
                        borderColor: focusField === "modelo" ? "#1B4D3E" : "#D4E7D7",
                        borderRadius: "8px",
                        backgroundColor: "#FEFDFB",
                        fontSize: "14px",
                        outline: "none",
                        transition: "all 0.3s",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="potencia"
                      style={{
                        display: "block",
                        marginBottom: "6px",
                        color: "#1B4D3E",
                        fontSize: "13px",
                        fontWeight: "500",
                      }}
                    >
                      Potência
                    </label>
                    <input
                      id="potencia"
                      type="text"
                      value={form.potencia}
                      onChange={(e) => updateForm({ potencia: e.target.value })}
                      onFocus={() => setFocusField("potencia")}
                      onBlur={() => setFocusField(null)}
                      placeholder="Ex: 180 cv"
                      style={{
                        width: "100%",
                        height: "42px",
                        padding: "0 12px",
                        border: "2px solid",
                        borderColor: focusField === "potencia" ? "#1B4D3E" : "#D4E7D7",
                        borderRadius: "8px",
                        backgroundColor: "#FEFDFB",
                        fontSize: "14px",
                        outline: "none",
                        transition: "all 0.3s",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>
                </div>

                {/* Número de Série */}
                <div>
                  <label
                    htmlFor="n_serie"
                    style={{
                      display: "block",
                      marginBottom: "6px",
                      color: "#1B4D3E",
                      fontSize: "13px",
                      fontWeight: "500",
                    }}
                  >
                    Número de Série
                  </label>
                  <input
                    id="n_serie"
                    type="text"
                    value={form.n_serie}
                    onChange={(e) => updateForm({ n_serie: e.target.value })}
                    onFocus={() => setFocusField("n_serie")}
                    onBlur={() => setFocusField(null)}
                    placeholder="Digite o número de série"
                    style={{
                      width: "100%",
                      height: "42px",
                      padding: "0 12px",
                      border: "2px solid",
                      borderColor: focusField === "n_serie" ? "#1B4D3E" : "#D4E7D7",
                      borderRadius: "8px",
                      backgroundColor: "#FEFDFB",
                      fontSize: "14px",
                      outline: "none",
                      transition: "all 0.3s",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                {/* Observação */}
                <div>
                  <label
                    htmlFor="observacao"
                    style={{
                      display: "block",
                      marginBottom: "6px",
                      color: "#1B4D3E",
                      fontSize: "13px",
                      fontWeight: "500",
                    }}
                  >
                    Observação
                  </label>
                  <textarea
                    id="observacao"
                    value={form.observacao}
                    onChange={(e) => updateForm({ observacao: e.target.value })}
                    onFocus={() => setFocusField("observacao")}
                    onBlur={() => setFocusField(null)}
                    placeholder="Informações adicionais sobre a máquina..."
                    rows={4}
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: "2px solid",
                      borderColor: focusField === "observacao" ? "#1B4D3E" : "#D4E7D7",
                      borderRadius: "8px",
                      backgroundColor: "#FEFDFB",
                      fontSize: "14px",
                      outline: "none",
                      transition: "all 0.3s",
                      boxSizing: "border-box",
                      resize: "vertical",
                      fontFamily: "inherit",
                    }}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "10px",
                  marginTop: "28px",
                  paddingTop: "20px",
                  borderTop: "1px solid #E5E7EB",
                }}
              >
                <button
                  type="button"
                  onClick={() => navigate("/maquinas")}
                  style={{
                    padding: "10px 20px",
                    border: "2px solid #9CA3AF",
                    borderRadius: "8px",
                    backgroundColor: "transparent",
                    color: "#6B7280",
                    fontWeight: "500",
                    cursor: "pointer",
                    transition: "all 0.3s",
                    fontSize: "14px",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#F3F4F6";
                    e.currentTarget.style.borderColor = "#6B7280";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.borderColor = "#9CA3AF";
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "10px 28px",
                    border: "none",
                    borderRadius: "8px",
                    backgroundColor: "#1B4D3E",
                    color: "#F5F1E8",
                    fontWeight: "500",
                    cursor: "pointer",
                    transition: "all 0.3s",
                    fontSize: "14px",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(27, 77, 62, 0.25)";
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.backgroundColor = "#153d31";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.backgroundColor = "#1B4D3E";
                  }}
                >
                  <CheckIcon />
                  Cadastrar
                </button>
              </div>
            </form>
          </div>
        </motion.div>

        {/* Info Card */}
       
      </div>
    </div>
  );
}
