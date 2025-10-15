import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Logo from "./Logo.png";

const API_URL = "http://localhost:5050";

export default function Login({ onLoginSuccess }) {
  const navigate = useNavigate();
  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusField, setFocusField] = useState(null);

  const formatCPF = (value) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 11) {
      return numbers
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    }
    return value;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErro("");

    try {
      const cleanCpf = cpf.replace(/\D/g, "");

      const response = await axios.post(`${API_URL}/login`, {
        cpf: cleanCpf,
        senha,
      });

      const usuario = response.data;
      const tipo = usuario.tipo;

      if (!tipo) {
        setErro("Tipo de usuário não reconhecido.");
        setLoading(false);
        return;
      }

      localStorage.setItem("usuarioLogado", JSON.stringify(usuario));
      localStorage.setItem("tipoUsuario", tipo);

      if (typeof onLoginSuccess === "function") {
        onLoginSuccess(tipo);
      } else {
        // fallback de navegação
        if (tipo === "associado") navigate("/associado");
        else if (tipo === "admin") navigate("/admin");
        else if (tipo === "operador") navigate("/operador");
        else navigate("/");
      }
    } catch (error) {
      setErro(error.response?.data?.mensagem || "Erro ao fazer login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={loginBoxStyle}>
        {/* Lado esquerdo - logo e branding */}
        <div style={leftPanelStyle}>
          <div style={logoContainerStyle}>
            <div style={logoWrapperStyle}>
              <img
                src={Logo}
                alt="Logo SAGRI"
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            </div>
            <h2 style={brandTitleStyle}></h2>
            <p style={brandSubtitleStyle}></p>
          </div>
        </div>

        {/* Lado direito - formulário */}
        <div style={rightPanelStyle}>
          <div style={formContainerStyle}>
            <div style={headerStyle}>
              <h2 style={titleStyle}>Bem-vindo de volta!</h2>
              <p style={subtitleStyle}></p>
            </div>

            <form onSubmit={handleLogin} style={formStyle}>
              {/* CPF Input */}
              <div style={inputGroupStyle}>
                <label style={labelStyle}>CPF</label>
                <div
                  style={{
                    ...inputWrapperStyle,
                    borderColor: focusField === "cpf" ? "#1B4D3E" : "#D1D5DB",
                    boxShadow:
                      focusField === "cpf"
                        ? "0 0 0 4px rgba(27, 77, 62, 0.1)"
                        : "none",
                  }}
                >
                  <svg
                    style={iconStyle}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                    />
                  </svg>
                  <input
                    type="text"
                    value={cpf}
                    onChange={(e) => setCpf(formatCPF(e.target.value))}
                    onFocus={() => setFocusField("cpf")}
                    onBlur={() => setFocusField(null)}
                    placeholder="000.000.000-00"
                    required
                    maxLength={14}
                    style={inputStyle}
                  />
                </div>
              </div>

              {/* Senha Input */}
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Senha</label>
                <div
                  style={{
                    ...inputWrapperStyle,
                    borderColor: focusField === "senha" ? "#1B4D3E" : "#D1D5DB",
                    boxShadow:
                      focusField === "senha"
                        ? "0 0 0 4px rgba(27, 77, 62, 0.1)"
                        : "none",
                    position: "relative",
                  }}
                >
                  <svg
                    style={iconStyle}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    onFocus={() => setFocusField("senha")}
                    onBlur={() => setFocusField(null)}
                    placeholder="Digite sua senha"
                    required
                    style={{ ...inputStyle, paddingRight: 48 }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      right: 10,
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#6B7280",
                      padding: 6,
                    }}
                    aria-label={showPassword ? "Esconder senha" : "Mostrar senha"}
                  >
                    {showPassword ? (
                      <svg style={{ width: 20, height: 20 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243" />
                      </svg>
                    ) : (
                      <svg style={{ width: 20, height: 20 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {erro && (
                <div style={errorContainerStyle}>
                  <svg style={{ width: 18, height: 18, flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p style={errorStyle}>{erro}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  ...buttonStyle,
                  opacity: loading ? 0.7 : 1,
                  cursor: loading ? "not-allowed" : "pointer",
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 8px 24px rgba(27, 77, 62, 0.3)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(27, 77, 62, 0.2)";
                }}
              >
                {loading ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={spinnerStyle}></div>
                    <span>Entrando...</span>
                  </div>
                ) : (
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span>Entrar no Sistema</span>
                    <svg style={{ width: 20, height: 20 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                )}
              </button>
            </form>

           
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

/* --- ESTILOS (mesmos do seu arquivo original grande) --- */
const containerStyle = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 50%, #A5D6A7 100%)",
  fontFamily: "'Inter', 'Segoe UI', sans-serif",
  padding: "20px",
  position: "relative",
  overflow: "hidden",
};

const backgroundCircle1 = {
  position: "absolute",
  width: "400px",
  height: "400px",
  borderRadius: "50%",
  background: "rgba(27, 77, 62, 0.05)",
  top: "-200px",
  right: "-100px",
  animation: "float 6s ease-in-out infinite",
};

const backgroundCircle2 = {
  position: "absolute",
  width: "250px",
  height: "250px",
  borderRadius: "50%",
  background: "rgba(27, 77, 62, 0.08)",
  bottom: "-125px",
  left: "-50px",
};

const backgroundCircle3 = {
  position: "absolute",
  width: "150px",
  height: "150px",
  borderRadius: "50%",
  background: "rgba(255, 255, 255, 0.3)",
  top: "50%",
  left: "10%",
  animation: "float 7s ease-in-out infinite",
};

const loginBoxStyle = {
  display: "flex",
  width: "100%",
  maxWidth: "850px",
  minHeight: "520px",
  borderRadius: "20px",
  overflow: "hidden",
  boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15)",
  backgroundColor: "#fff",
  position: "relative",
  zIndex: 1,
};

const leftPanelStyle = {
  flex: 0.9,
  background: "linear-gradient(135deg, #1B4D3E 0%, #0F3A2D 100%)",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  padding: "50px 30px",
  position: "relative",
  overflow: "hidden",
};

const logoContainerStyle = {
  textAlign: "center",
  zIndex: 2,
  position: "relative",
};

const logoWrapperStyle = {
  width: "160px",
  height: "160px",
  margin: "0 auto 20px",
  borderRadius: "20px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backdropFilter: "blur(10px)",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
  padding: "18px",
};

const brandTitleStyle = {
  color: "#fff",
  fontSize: "28px",
  fontWeight: "700",
  marginBottom: "10px",
  letterSpacing: "2px",
};

const brandSubtitleStyle = {
  color: "rgba(255, 255, 255, 0.8)",
  fontSize: "13px",
  lineHeight: "1.6",
  maxWidth: "250px",
  margin: "0 auto",
};

const rightPanelStyle = {
  flex: 1.3,
  backgroundColor: "#fff",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  padding: "50px 40px",
};

const formContainerStyle = {
  maxWidth: "380px",
  width: "100%",
  margin: "0 auto",
};

const headerStyle = {
  marginBottom: "32px",
  textAlign: "center",
};

const titleStyle = {
  color: "#1F2937",
  fontWeight: "700",
  fontSize: "28px",
  marginBottom: "10px",
  letterSpacing: "-0.02em",
};

const subtitleStyle = {
  color: "#6B7280",
  fontSize: "14px",
  lineHeight: "1.6",
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "20px",
};

const inputGroupStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "8px",
};

const labelStyle = {
  fontSize: "14px",
  color: "#374151",
  fontWeight: "600",
};

const inputWrapperStyle = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  backgroundColor: "#F9FAFB",
  border: "2px solid #D1D5DB",
  borderRadius: "12px",
  padding: "12px 16px",
  transition: "all 0.3s ease",
  position: "relative",
};

const iconStyle = {
  width: "20px",
  height: "20px",
  color: "#6B7280",
  flexShrink: 0,
};

const inputStyle = {
  flex: 1,
  backgroundColor: "transparent",
  border: "none",
  outline: "none",
  fontSize: "15px",
  color: "#1F2937",
  fontFamily: "'Inter', 'Segoe UI', sans-serif",
};

const eyeButtonStyle = {
  background: "none",
  border: "none",
  cursor: "pointer",
  padding: "4px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#6B7280",
  transition: "color 0.2s ease",
};

const errorContainerStyle = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  padding: "12px 16px",
  backgroundColor: "#FEE2E2",
  border: "1px solid #FCA5A5",
  borderRadius: "12px",
};

const errorStyle = {
  color: "#991B1B",
  fontSize: "14px",
  margin: 0,
  lineHeight: "1.5",
};

const buttonStyle = {
  marginTop: "8px",
  background: "linear-gradient(135deg, #1B4D3E 0%, #0F3A2D 100%)",
  color: "#fff",
  border: "none",
  borderRadius: "12px",
  padding: "14px 20px",
  fontWeight: "600",
  fontSize: "14px",
  cursor: "pointer",
  transition: "all 0.3s ease",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 4px 12px rgba(27, 77, 62, 0.2)",
};

const spinnerStyle = {
  width: "18px",
  height: "18px",
  border: "2px solid rgba(255, 255, 255, 0.3)",
  borderTop: "2px solid #fff",
  borderRadius: "50%",
  animation: "spin 0.8s linear infinite",
};

const footerStyle = {
  marginTop: "28px",
  textAlign: "center",
};

const footerTextStyle = {
  color: "#6B7280",
  fontSize: "14px",
  margin: 0,
};

const linkStyle = {
  color: "#1B4D3E",
  fontWeight: "600",
  textDecoration: "none",
  transition: "color 0.2s ease",
};
