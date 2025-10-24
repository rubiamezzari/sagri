import { useState } from "react";
import { motion } from "framer-motion";

const REACT_APP_YOUR_HOSTNAME = "http://localhost:5050";

export default function CreateAssociado() {
  const [step, setStep] = useState(1);
  const [focusField, setFocusField] = useState(null);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    nome: "",
    email: "",
    telefone: "",
    cpf: "",
    senha: "",
    data_associacao: "",
    endereco: {
      rua: "",
      numero: "",
      complemento: "",
      bairro: "",
      cidade: "",
      uf: "",
      cep: "",
    },
    documentos: {
      anuidade: null,
      caf: null,
    },
  });

  // Funções de máscara
  function maskTelefone(value) {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length <= 10) {
      return cleaned
        .replace(/^(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{4})(\d)/, "$1-$2");
    }
    return cleaned
      .replace(/^(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .slice(0, 15);
  }

  function maskCPF(value) {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
      .slice(0, 14);
  }

  function maskCEP(value) {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .slice(0, 9);
  }

  // Funções de validação
  function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function validateTelefone(telefone) {
    const cleaned = telefone.replace(/\D/g, "");
    return cleaned.length === 10 || cleaned.length === 11;
  }

  function validateCPF(cpf) {
    const cleaned = cpf.replace(/\D/g, "");
    return cleaned.length === 11;
  }

  function validateCEP(cep) {
    if (!cep) return true; // CEP é opcional
    const cleaned = cep.replace(/\D/g, "");
    return cleaned.length === 8;
  }

  function validateStep1() {
    const newErrors = {};

    if (!form.nome.trim()) {
      newErrors.nome = "Nome completo é obrigatório";
    } else if (form.nome.trim().length < 3) {
      newErrors.nome = "Nome deve ter pelo menos 3 caracteres";
    }

    if (form.email && !validateEmail(form.email)) {
      newErrors.email = "Email inválido";
    }

    if (!form.telefone) {
      newErrors.telefone = "Telefone é obrigatório";
    } else if (!validateTelefone(form.telefone)) {
      newErrors.telefone = "Telefone deve ter 10 ou 11 dígitos";
    }

    if (!form.cpf) {
      newErrors.cpf = "CPF é obrigatório";
    } else if (!validateCPF(form.cpf)) {
      newErrors.cpf = "CPF deve ter 11 dígitos";
    }

    if (!form.senha) {
      newErrors.senha = "Senha é obrigatória";
    } else if (form.senha.length < 6) {
      newErrors.senha = "Senha deve ter no mínimo 6 caracteres";
    }

    if (!form.data_associacao) {
      newErrors.data_associacao = "Data de associação é obrigatória";
    }

    return newErrors;
  }

  function validateStep2() {
    const newErrors = {};

    if (form.endereco.cep && !validateCEP(form.endereco.cep)) {
      newErrors.cep = "CEP deve ter 8 dígitos";
    }

    return newErrors;
  }

  function handleNextStep() {
    let newErrors = {};

    if (step === 1) {
      newErrors = validateStep1();
    } else if (step === 2) {
      newErrors = validateStep2();
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setStep(step + 1);
  }

  function updateForm(value) {
    setForm((prev) => ({ ...prev, ...value }));
    // Limpar erro do campo quando ele for modificado
    if (value.nome !== undefined) setErrors((prev) => ({ ...prev, nome: undefined }));
    if (value.email !== undefined) setErrors((prev) => ({ ...prev, email: undefined }));
    if (value.telefone !== undefined) setErrors((prev) => ({ ...prev, telefone: undefined }));
    if (value.cpf !== undefined) setErrors((prev) => ({ ...prev, cpf: undefined }));
    if (value.senha !== undefined) setErrors((prev) => ({ ...prev, senha: undefined }));
    if (value.data_associacao !== undefined) setErrors((prev) => ({ ...prev, data_associacao: undefined }));
  }

  function updateEndereco(value) {
    setForm((prev) => ({
      ...prev,
      endereco: { ...prev.endereco, ...value },
    }));
    // Limpar erro do campo quando ele for modificado
    if (value.cep !== undefined) setErrors((prev) => ({ ...prev, cep: undefined }));
  }

  function updateDocumentos(value) {
    setForm((prev) => ({
      ...prev,
      documentos: { ...prev.documentos, ...value },
    }));
  }

  async function onSubmit(e) {
    e.preventDefault();

    // Validar step final antes de submeter
    const step1Errors = validateStep1();
    const step2Errors = validateStep2();
    const allErrors = { ...step1Errors, ...step2Errors };

    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      alert("Por favor, corrija os erros no formulário antes de cadastrar.");
      return;
    }

    const formData = new FormData();
    formData.append("dados", JSON.stringify(form));

    if (form.documentos.anuidade) formData.append("anuidade", form.documentos.anuidade);
    if (form.documentos.caf) formData.append("caf", form.documentos.caf);

    try {
      const response = await fetch(`${REACT_APP_YOUR_HOSTNAME}/associados/create`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Erro ao cadastrar associado");

      alert("Associado cadastrado com sucesso!");

      // Resetar formulário
      setForm({
        nome: "",
        email: "",
        telefone: "",
        cpf: "",
        senha: "",
        data_associacao: "",
        endereco: {
          rua: "",
          numero: "",
          complemento: "",
          bairro: "",
          cidade: "",
          uf: "",
          cep: "",
        },
        documentos: {
          anuidade: null,
          caf: null,
        },
      });
      setErrors({});
      setStep(1);
    } catch (err) {
      alert("Erro: " + err.message);
    }
  }

  const steps = [
    { number: 1, title: "Dados Pessoais" },
    { number: 2, title: "Endereço" },
    { number: 3, title: "Documentos" },
  ];

  // SVG Icons
  const UserIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );

  const MapPinIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );

  const FileTextIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );

  const UploadIcon = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );

  const CheckIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );

  const ArrowLeftIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );

  const ArrowRightIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );

  const AlertTriangleIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );

  const getStepIcon = (stepNum) => {
    if (stepNum === 1) return <UserIcon />;
    if (stepNum === 2) return <MapPinIcon />;
    return <FileTextIcon />;
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        backgroundColor: "",
        width: "100%", maxWidth: "700px", minWidth: "700px",
      }}
    >
      <div style={{ width: "100%", maxWidth: "700px", minWidth: "700px",}}>
        {/* Form Card */}
      <div
  style={{
    backgroundColor: "#FFFFFF",
    borderRadius: "12px",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
    overflow: "hidden",
    width: "100%",
    maxWidth: "700px",
    minWidth: "700px",
    minHeight: "400px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  }}
>
          <div style={{ padding: "28px" }}>
            {/* Step Progress */}
            <div style={{ marginBottom: "28px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative" }}>
                {/* Progress Line Background */}
                <div
                  style={{
                    position: "absolute",
                    top: "18px",
                    left: "0",
                    width: "100%",
                    height: "3px",
                    backgroundColor: "#E5E7EB",
                    zIndex: 0,
                  }}
                />

                {/* Progress Line Active */}
                <motion.div
                  style={{
                    position: "absolute",
                    top: "18px",
                    left: "0",
                    height: "3px",
                    backgroundColor: "#1B4D3E",
                    zIndex: 1,
                  }}
                  initial={{ width: "0%" }}
                  animate={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
                  transition={{ duration: 0.4 }}
                />

                {/* Step Indicators */}
                {steps.map((s) => {
                  const isCompleted = step > s.number;
                  const isActive = step === s.number;

                  return (
                    <div
                      key={s.number}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        flex: 1,
                        zIndex: 2,
                        position: "relative",
                      }}
                    >
                      <motion.div
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          marginBottom: "10px",
                          backgroundColor: isCompleted || isActive ? "#1B4D3E" : "#FFFFFF",
                          border: "3px solid",
                          borderColor: isCompleted || isActive ? "#1B4D3E" : "#D4D4D4",
                          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.08)",
                        }}
                        initial={false}
                        animate={{
                          scale: isActive ? 1.08 : 1,
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        <div style={{ color: isCompleted || isActive ? "#F5F1E8" : "#9CA3AF" }}>
                          {isCompleted ? <CheckIcon /> : getStepIcon(s.number)}
                        </div>
                      </motion.div>
                      <span
                        style={{
                          fontSize: "12px",
                          textAlign: "center",
                          padding: "0 6px",
                          color: isActive || isCompleted ? "#1B4D3E" : "#9CA3AF",
                          fontWeight: isActive ? "600" : "500",
                        }}
                      >
                        {s.title}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <form onSubmit={onSubmit}>
              {/* STEP 1: Dados Pessoais */}
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2
                    style={{
                      marginBottom: "20px",
                      paddingBottom: "10px",
                      borderBottom: "2px solid #D4E7D7",
                      color: "#1B4D3E",
                      fontSize: "20px",
                      fontWeight: "600",
                    }}
                  >
                    Dados Pessoais
                  </h2>

                  <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "700px", width: "100%"}}>
                    {/* Linha 1 - Nome e Email */}
                    <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: "16px" }}>
                      <div>
                        <label htmlFor="nome" style={{ display: "block", marginBottom: "6px", color: "#1B4D3E", fontSize: "13px", fontWeight: "500" }}>
                          Nome Completo *
                        </label>
                        <input
                          id="nome"
                          type="text"
                          value={form.nome}
                          onChange={(e) => updateForm({ nome: e.target.value })}
                          onFocus={() => setFocusField("nome")}
                          onBlur={() => setFocusField(null)}
                          required
                          style={{
                            width: "100%",
                            height: "40px",
                            padding: "0 12px",
                            border: "2px solid",
                            borderColor: errors.nome ? "#dc2626" : (focusField === "nome" ? "#1B4D3E" : "#D4E7D7"),
                            borderRadius: "8px",
                            backgroundColor: "#FEFDFB",
                            fontSize: "14px",
                            outline: "none",
                            transition: "all 0.3s",
                            boxSizing: "border-box",
                          }}
                        />
                        {errors.nome && (
                          <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "4px", color: "#dc2626", fontSize: "12px" }}>
                            <AlertTriangleIcon />
                            <span>{errors.nome}</span>
                          </div>
                        )}
                      </div>

                      <div>
                        <label htmlFor="email" style={{ display: "block", marginBottom: "6px", color: "#1B4D3E", fontSize: "13px", fontWeight: "500" }}>
                          Email
                        </label>
                        <input
                          id="email"
                          type="email"
                          value={form.email}
                          onChange={(e) => updateForm({ email: e.target.value })}
                          onFocus={() => setFocusField("email")}
                          onBlur={() => setFocusField(null)}
                          style={{
                            width: "100%",
                            height: "40px",
                            padding: "0 12px",
                            border: "2px solid",
                            borderColor: errors.email ? "#dc2626" : (focusField === "email" ? "#1B4D3E" : "#D4E7D7"),
                            borderRadius: "8px",
                            backgroundColor: "#FEFDFB",
                            fontSize: "14px",
                            outline: "none",
                            transition: "all 0.3s",
                            boxSizing: "border-box",
                          }}
                        />
                        {errors.email && (
                          <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "4px", color: "#dc2626", fontSize: "12px" }}>
                            <AlertTriangleIcon />
                            <span>{errors.email}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Linha 2 - Telefone e CPF */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                      <div>
                        <label htmlFor="telefone" style={{ display: "block", marginBottom: "6px", color: "#1B4D3E", fontSize: "13px", fontWeight: "500" }}>
                          Telefone *
                        </label>
                        <input
                          id="telefone"
                          type="text"
                          placeholder="(00) 00000-0000"
                          value={form.telefone}
                          onChange={(e) => updateForm({ telefone: maskTelefone(e.target.value) })}
                          onFocus={() => setFocusField("telefone")}
                          onBlur={() => setFocusField(null)}
                          required
                          style={{
                            width: "100%",
                            height: "40px",
                            padding: "0 12px",
                            border: "2px solid",
                            borderColor: errors.telefone ? "#dc2626" : (focusField === "telefone" ? "#1B4D3E" : "#D4E7D7"),
                            borderRadius: "8px",
                            backgroundColor: "#FEFDFB",
                            fontSize: "14px",
                            outline: "none",
                            transition: "all 0.3s",
                            boxSizing: "border-box",
                          }}
                        />
                        {errors.telefone && (
                          <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "4px", color: "#dc2626", fontSize: "12px" }}>
                            <AlertTriangleIcon />
                            <span>{errors.telefone}</span>
                          </div>
                        )}
                      </div>

                      <div>
                        <label htmlFor="cpf" style={{ display: "block", marginBottom: "6px", color: "#1B4D3E", fontSize: "13px", fontWeight: "500" }}>
                          CPF *
                        </label>
                        <input
                          id="cpf"
                          type="text"
                          placeholder="000.000.000-00"
                          value={form.cpf}
                          onChange={(e) => updateForm({ cpf: maskCPF(e.target.value) })}
                          onFocus={() => setFocusField("cpf")}
                          onBlur={() => setFocusField(null)}
                          required
                          style={{
                            width: "100%",
                            height: "40px",
                            padding: "0 12px",
                            border: "2px solid",
                            borderColor: errors.cpf ? "#dc2626" : (focusField === "cpf" ? "#1B4D3E" : "#D4E7D7"),
                            borderRadius: "8px",
                            backgroundColor: "#FEFDFB",
                            fontSize: "14px",
                            outline: "none",
                            transition: "all 0.3s",
                            boxSizing: "border-box",
                          }}
                        />
                        {errors.cpf && (
                          <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "4px", color: "#dc2626", fontSize: "12px" }}>
                            <AlertTriangleIcon />
                            <span>{errors.cpf}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Linha 3 - Senha e Data de Associação */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                      <div>
                        <label htmlFor="senha" style={{ display: "block", marginBottom: "6px", color: "#1B4D3E", fontSize: "13px", fontWeight: "500" }}>
                          Senha *
                        </label>
                        <input
                          id="senha"
                          type="password"
                          value={form.senha}
                          onChange={(e) => updateForm({ senha: e.target.value })}
                          onFocus={() => setFocusField("senha")}
                          onBlur={() => setFocusField(null)}
                          required
                          style={{
                            width: "100%",
                            height: "40px",
                            padding: "0 12px",
                            border: "2px solid",
                            borderColor: errors.senha ? "#dc2626" : (focusField === "senha" ? "#1B4D3E" : "#D4E7D7"),
                            borderRadius: "8px",
                            backgroundColor: "#FEFDFB",
                            fontSize: "14px",
                            outline: "none",
                            transition: "all 0.3s",
                            boxSizing: "border-box",
                          }}
                        />
                        {errors.senha && (
                          <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "4px", color: "#dc2626", fontSize: "12px" }}>
                            <AlertTriangleIcon />
                            <span>{errors.senha}</span>
                          </div>
                        )}
                      </div>

                      <div>
                        <label htmlFor="data_associacao" style={{ display: "block", marginBottom: "6px", color: "#1B4D3E", fontSize: "13px", fontWeight: "500" }}>
                          Data Associação *
                        </label>
                        <input
                          id="data_associacao"
                          type="date"
                          value={form.data_associacao}
                          onChange={(e) => updateForm({ data_associacao: e.target.value })}
                          onFocus={() => setFocusField("data_associacao")}
                          onBlur={() => setFocusField(null)}
                          required
                          style={{
                            width: "100%",
                            height: "40px",
                            padding: "0 12px",
                            border: "2px solid",
                            borderColor: errors.data_associacao ? "#dc2626" : (focusField === "data_associacao" ? "#1B4D3E" : "#D4E7D7"),
                            borderRadius: "8px",
                            backgroundColor: "#FEFDFB",
                            fontSize: "14px",
                            outline: "none",
                            transition: "all 0.3s",
                            boxSizing: "border-box",
                          }}
                        />
                        {errors.data_associacao && (
                          <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "4px", color: "#dc2626", fontSize: "12px" }}>
                            <AlertTriangleIcon />
                            <span>{errors.data_associacao}</span>
                          </div>
                        )}
                      </div>
                    </div>

                  </div>

                </motion.div>
              )}

              {/* STEP 2: Endereço */}
              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2
                    style={{
                      marginBottom: "20px",
                      paddingBottom: "10px",
                      borderBottom: "2px solid #D4E7D7",
                      color: "#1B4D3E",
                      fontSize: "20px",
                      fontWeight: "600",
                    }}
                  >
                    Endereço
                  </h2>

                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "3fr 1fr", gap: "16px" }}>
                      <div>
                        <label
                          htmlFor="rua"
                          style={{
                            display: "block",
                            marginBottom: "6px",
                            color: "#1B4D3E",
                            fontSize: "13px",
                            fontWeight: "500",
                          }}
                        >
                          Rua
                        </label>
                        <input
                          id="rua"
                          type="text"
                          value={form.endereco.rua}
                          onChange={(e) => updateEndereco({ rua: e.target.value })}
                          onFocus={() => setFocusField("rua")}
                          onBlur={() => setFocusField(null)}
                          style={{
                            width: "100%",
                            height: "40px",
                            padding: "0 12px",
                            border: "2px solid",
                            borderColor: focusField === "rua" ? "#1B4D3E" : "#D4E7D7",
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
                          htmlFor="numero"
                          style={{
                            display: "block",
                            marginBottom: "6px",
                            color: "#1B4D3E",
                            fontSize: "13px",
                            fontWeight: "500",
                          }}
                        >
                          Número
                        </label>
                        <input
                          id="numero"
                          type="text"
                          value={form.endereco.numero}
                          onChange={(e) => updateEndereco({ numero: e.target.value })}
                          onFocus={() => setFocusField("numero")}
                          onBlur={() => setFocusField(null)}
                          style={{
                            width: "100%",
                            height: "40px",
                            padding: "0 12px",
                            border: "2px solid",
                            borderColor: focusField === "numero" ? "#1B4D3E" : "#D4E7D7",
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

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
                      <div>
                        <label
                          htmlFor="complemento"
                          style={{
                            display: "block",
                            marginBottom: "6px",
                            color: "#1B4D3E",
                            fontSize: "13px",
                            fontWeight: "500",
                          }}
                        >
                          Complemento
                        </label>
                        <input
                          id="complemento"
                          type="text"
                          value={form.endereco.complemento}
                          onChange={(e) => updateEndereco({ complemento: e.target.value })}
                          onFocus={() => setFocusField("complemento")}
                          onBlur={() => setFocusField(null)}
                          style={{
                            width: "100%",
                            height: "40px",
                            padding: "0 12px",
                            border: "2px solid",
                            borderColor: focusField === "complemento" ? "#1B4D3E" : "#D4E7D7",
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
                          htmlFor="bairro"
                          style={{
                            display: "block",
                            marginBottom: "6px",
                            color: "#1B4D3E",
                            fontSize: "13px",
                            fontWeight: "500",
                          }}
                        >
                          Bairro
                        </label>
                        <input
                          id="bairro"
                          type="text"
                          value={form.endereco.bairro}
                          onChange={(e) => updateEndereco({ bairro: e.target.value })}
                          onFocus={() => setFocusField("bairro")}
                          onBlur={() => setFocusField(null)}
                          style={{
                            width: "100%",
                            height: "40px",
                            padding: "0 12px",
                            border: "2px solid",
                            borderColor: focusField === "bairro" ? "#1B4D3E" : "#D4E7D7",
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

                    <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "16px" }}>
                      <div>
                        <label
                          htmlFor="cidade"
                          style={{
                            display: "block",
                            marginBottom: "6px",
                            color: "#1B4D3E",
                            fontSize: "13px",
                            fontWeight: "500",
                          }}
                        >
                          Cidade
                        </label>
                        <input
                          id="cidade"
                          type="text"
                          value={form.endereco.cidade}
                          onChange={(e) => updateEndereco({ cidade: e.target.value })}
                          onFocus={() => setFocusField("cidade")}
                          onBlur={() => setFocusField(null)}
                          style={{
                            width: "100%",
                            height: "40px",
                            padding: "0 12px",
                            border: "2px solid",
                            borderColor: focusField === "cidade" ? "#1B4D3E" : "#D4E7D7",
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
                          htmlFor="uf"
                          style={{
                            display: "block",
                            marginBottom: "6px",
                            color: "#1B4D3E",
                            fontSize: "13px",
                            fontWeight: "500",
                          }}
                        >
                          UF
                        </label>
                        <select
                          id="uf"
                          value={form.endereco.uf}
                          onChange={(e) => updateEndereco({ uf: e.target.value })}
                          onFocus={() => setFocusField("uf")}
                          onBlur={() => setFocusField(null)}
                          style={{
                            width: "100%",
                            height: "40px",
                            padding: "0 12px",
                            border: "2px solid",
                            borderColor: focusField === "uf" ? "#1B4D3E" : "#D4E7D7",
                            borderRadius: "8px",
                            backgroundColor: "#FEFDFB",
                            fontSize: "14px",
                            outline: "none",
                            transition: "all 0.3s",
                            boxSizing: "border-box",
                          }}
                        >
                          <option value=""></option>
                          <option value="AC">AC</option>
                          <option value="AL">AL</option>
                          <option value="AP">AP</option>
                          <option value="AM">AM</option>
                          <option value="BA">BA</option>
                          <option value="CE">CE</option>
                          <option value="DF">DF</option>
                          <option value="ES">ES</option>
                          <option value="GO">GO</option>
                          <option value="MA">MA</option>
                          <option value="MT">MT</option>
                          <option value="MS">MS</option>
                          <option value="MG">MG</option>
                          <option value="PA">PA</option>
                          <option value="PB">PB</option>
                          <option value="PR">PR</option>
                          <option value="PE">PE</option>
                          <option value="PI">PI</option>
                          <option value="RJ">RJ</option>
                          <option value="RN">RN</option>
                          <option value="RS">RS</option>
                          <option value="RO">RO</option>
                          <option value="RR">RR</option>
                          <option value="SC">SC</option>
                          <option value="SP">SP</option>
                          <option value="SE">SE</option>
                          <option value="TO">TO</option>
                        </select>
                      </div>

                      <div>
                        <label
                          htmlFor="cep"
                          style={{
                            display: "block",
                            marginBottom: "6px",
                            color: "#1B4D3E",
                            fontSize: "13px",
                            fontWeight: "500",
                          }}
                        >
                          CEP
                        </label>
                        <input
                          id="cep"
                          type="text"
                          placeholder="00000-000"
                          value={form.endereco.cep}
                          onChange={(e) => updateEndereco({ cep: maskCEP(e.target.value) })}
                          onFocus={() => setFocusField("cep")}
                          onBlur={() => setFocusField(null)}
                          style={{
                            width: "100%",
                            height: "40px",
                            padding: "0 12px",
                            border: "2px solid",
                            borderColor: errors.cep ? "#dc2626" : (focusField === "cep" ? "#1B4D3E" : "#D4E7D7"),
                            borderRadius: "8px",
                            backgroundColor: "#FEFDFB",
                            fontSize: "14px",
                            outline: "none",
                            transition: "all 0.3s",
                            boxSizing: "border-box",
                          }}
                        />
                        {errors.cep && (
                          <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "4px", color: "#dc2626", fontSize: "12px" }}>
                            <AlertTriangleIcon />
                            <span>{errors.cep}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: Documentos */}
              {step === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2
                    style={{
                      marginBottom: "20px",
                      paddingBottom: "10px",
                      borderBottom: "2px solid #D4E7D7",
                      color: "#1B4D3E",
                      fontSize: "20px",
                      fontWeight: "600",
                    }}
                  >
                    Documentos
                  </h2>

                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    {/* CAF */}
                    <div
                      style={{
                        border: "2px solid",
                        borderColor: form.documentos.caf ? "#1B4D3E" : "#D4E7D7",
                        borderRadius: "12px",
                        padding: "20px",
                        backgroundColor: "#F5F1E8",
                        transition: "all 0.3s",
                      }}
                      onMouseEnter={(e) => {
                        if (!form.documentos.caf) {
                          e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.08)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "12px" }}>
                        <div
                          style={{
                            width: "52px",
                            height: "52px",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: "#1B4D3E",
                            color: "#F5F1E8",
                          }}
                        >
                          <UploadIcon />
                        </div>

                        <div>
                          <h3 style={{ marginBottom: "4px", color: "#1B4D3E", fontSize: "17px", fontWeight: "600" }}>
                            CAF
                          </h3>
                          <p style={{ fontSize: "12px", color: "#6B7280" }}>
                            {form.documentos.caf ? form.documentos.caf.name : "Selecione um arquivo de imagem ou PDF"}
                          </p>
                        </div>

                        <label
                          htmlFor="caf"
                          style={{
                            padding: "9px 24px",
                            borderRadius: "8px",
                            cursor: "pointer",
                            backgroundColor: "#1B4D3E",
                            color: "#F5F1E8",
                            fontWeight: "500",
                            transition: "all 0.3s",
                            display: "inline-block",
                            fontSize: "13px",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.12)";
                            e.currentTarget.style.transform = "translateY(-2px)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.boxShadow = "none";
                            e.currentTarget.style.transform = "translateY(0)";
                          }}
                        >
                          {form.documentos.caf ? "Alterar Arquivo" : "Escolher Arquivo"}
                        </label>
                        <input
                          type="file"
                          id="caf"
                          accept="image/*,.pdf"
                          style={{ display: "none" }}
                          onChange={(e) => updateDocumentos({ caf: e.target.files?.[0] || null })}
                        />
                      </div>

                      {form.documentos.caf && form.documentos.caf.type.startsWith("image/") && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3 }}
                          style={{ marginTop: "20px", display: "flex", justifyContent: "center" }}
                        >
                          <img
                            src={URL.createObjectURL(form.documentos.caf)}
                            alt="Preview CAF"
                            style={{
                              maxWidth: "100%",
                              maxHeight: "220px",
                              objectFit: "contain",
                              borderRadius: "8px",
                              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                              border: "2px solid #1B4D3E",
                            }}
                          />
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Navigation Buttons */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "28px",
                  paddingTop: "20px",
                  borderTop: "1px solid #E5E7EB",
                }}
              >
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "9px 18px",
                      border: "2px solid #1B4D3E",
                      borderRadius: "8px",
                      backgroundColor: "transparent",
                      color: "#1B4D3E",
                      fontWeight: "500",
                      cursor: "pointer",
                      transition: "all 0.3s",
                      fontSize: "13px",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#F5F1E8";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    <ArrowLeftIcon />
                    Voltar
                  </button>
                ) : (
                  <div />
                )}

                {step < 3 ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "9px 18px",
                      border: "none",
                      borderRadius: "8px",
                      backgroundColor: "#1B4D3E",
                      color: "#F5F1E8",
                      fontWeight: "500",
                      cursor: "pointer",
                      transition: "all 0.3s",
                      marginLeft: "auto",
                      fontSize: "13px",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)";
                      e.currentTarget.style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = "none";
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    Próximo
                    <ArrowRightIcon />
                  </button>
                ) : (
                  <div style={{ display: "flex", gap: "10px", marginLeft: "auto" }}>
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm("Deseja realmente cancelar o cadastro?")) {
                          setForm({
                            nome: "",
                            email: "",
                            telefone: "",
                            cpf: "",
                            senha: "",
                            data_associacao: "",
                            endereco: {
                              rua: "",
                              numero: "",
                              complemento: "",
                              bairro: "",
                              cidade: "",
                              uf: "",
                              cep: "",
                            },
                            documentos: {
                              anuidade: null,
                              caf: null,
                            },
                          });
                          setErrors({});
                          setStep(1);
                        }
                      }}
                      style={{
                        padding: "9px 18px",
                        border: "2px solid #dc2626",
                        borderRadius: "8px",
                        backgroundColor: "transparent",
                        color: "#dc2626",
                        fontWeight: "500",
                        cursor: "pointer",
                        transition: "all 0.3s",
                        fontSize: "13px",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#fef2f2";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "9px 24px",
                        border: "none",
                        borderRadius: "8px",
                        backgroundColor: "#1B4D3E",
                        color: "#F5F1E8",
                        fontWeight: "500",
                        cursor: "pointer",
                        transition: "all 0.3s",
                        fontSize: "13px",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)";
                        e.currentTarget.style.transform = "translateY(-2px)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = "none";
                        e.currentTarget.style.transform = "translateY(0)";
                      }}
                    >
                      <CheckIcon />
                      Cadastrar
                    </button>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
