import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

const REACT_APP_YOUR_HOSTNAME = "http://localhost:5050";

const linha = {
    padding: "6px 0",
    display: "flex",
    gap: "8px",
    fontSize: "0.95rem",
    borderBottom: "1px solid #d5ecd0",
};

const campoLabel = {
    minWidth: "160px",
    fontWeight: "bold",
};

const tituloNome = {
    fontSize: "1.25rem",
    fontWeight: "bold",
    textTransform: "uppercase",
    paddingBottom: "10px",
    marginBottom: "20px",
    borderBottom: "2px solid #a5d6a7",
    color: "#1a3c1a",
};

const btnBase = {
    padding: "5px 18px",
    borderRadius: "5px",
    fontWeight: "500",
    fontSize: "1rem",
    border: "none",
    cursor: "pointer",
    transition: "all 0.3s ease",
    marginRight: "15px",
    marginTop: "20px",
    color: "#fff",
    textDecoration: "none",
    display: "inline-block",
};

const btnEditar = {
    ...btnBase,
    backgroundColor: "#1c3d21",
};

const btnExcluir = {
    ...btnBase,
    backgroundColor: "#daf4d0",
    color: "#86a479",
};

export default function DetalhesAssociado() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [associado, setAssociado] = useState(null);

    useEffect(() => {
        async function fetchData() {
            const response = await fetch(`${REACT_APP_YOUR_HOSTNAME}/associados/${id}`);
            if (!response.ok) {
                const message = `Ocorreu um erro: ${response.statusText}`;
                window.alert(message);
                return;
            }
            const associado = await response.json();
            setAssociado(associado);
        }
        fetchData();
    }, [id]);

    async function handleDelete() {
        const confirmar = window.confirm("Tem certeza que deseja excluir este associado?");
        if (!confirmar) return;

        const response = await fetch(`${REACT_APP_YOUR_HOSTNAME}/associados/${id}`, {
            method: "DELETE",
        });

        if (response.ok) {
            alert("Associado excluído com sucesso!");
            navigate("/associados/list");
        } else {
            alert("Erro ao excluir associado.");
        }
    }

    if (!associado) {
        return <div>Carregando...</div>;
    }

    return (
        <div
            style={{
                backgroundColor: "#fff",
                padding: "30px",
                borderRadius: "5px",
                maxWidth: "950px",
                margin: "40px auto",
                fontFamily: "'Segoe UI', sans-serif",
            }}
        >
            <h2 style={tituloNome}>{associado.nome}</h2>

            <div style={linha}>
                <div style={campoLabel}>Usuário:</div> {associado.usuario}
            </div>
            <div style={linha}>
                <div style={campoLabel}>Número:</div> #{associado.numero}
            </div>
            <div style={linha}>
                <div style={campoLabel}>Data de associação:</div> {associado.data_associacao}
            </div>
            <div style={linha}>
                <div style={campoLabel}>CPF:</div> {associado.cpf}
            </div>
            <div style={linha}>
                <div style={campoLabel}>Telefone:</div> {associado.telefone}
            </div>
            <div style={linha}>
                <div style={campoLabel}>E-mail:</div> {associado.email}
            </div>

            <h4 style={{ marginTop: "25px", fontSize: "1.05rem", color: "#1a3c1a" }}>Endereço:</h4>
            <div style={linha}>
                <div style={campoLabel}>Rua:</div> {associado.endereco.rua}
            </div>
            <div style={linha}>
                <div style={campoLabel}>Número:</div> {associado.endereco.numero}
            </div>
            <div style={linha}>
                <div style={campoLabel}>Complemento:</div> {associado.endereco.complemento}
            </div>
            <div style={linha}>
                <div style={campoLabel}>Bairro:</div> {associado.endereco.bairro}
            </div>
            <div style={linha}>
                <div style={campoLabel}>Cidade:</div> {associado.endereco.cidade}
            </div>
            <div style={linha}>
                <div style={campoLabel}>UF:</div> {associado.endereco.uf}
            </div>
            <div style={linha}>
                <div style={campoLabel}>CEP:</div> {associado.endereco.cep}
            </div>

            {associado.documentos && (
                <>
                    {associado.documentos.anuidade && (
                        <>
                            <h4 style={{ marginTop: "25px", fontSize: "1.05rem", color: "#1a3c1a" }}>
                                Comprovante de anuidade:
                            </h4>
                            <a
                                href={`${REACT_APP_YOUR_HOSTNAME}/uploads/anuidade/${associado.documentos.anuidade}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    backgroundColor: "#c8facc",
                                    color: "#1c3d21",
                                    padding: "4px 12px",
                                    borderRadius: "4px",
                                    textDecoration: "none",
                                    display: "inline-block",
                                    marginTop: "5px",
                                    fontWeight: "500",
                                }}
                            >
                                anuidade.pdf
                            </a>
                        </>
                    )}

                    {associado.documentos.caf && (
                        <>
                            <h4 style={{ marginTop: "25px", fontSize: "1.05rem", color: "#1a3c1a" }}>
                                CAF:
                            </h4>
                            <a
                                href={`${REACT_APP_YOUR_HOSTNAME}/uploads/caf/${associado.documentos.caf}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    backgroundColor: "#c8facc",
                                    color: "#1c3d21",
                                    padding: "4px 12px",
                                    borderRadius: "4px",
                                    textDecoration: "none",
                                    display: "inline-block",
                                    marginTop: "5px",
                                    fontWeight: "500",
                                }}
                            >
                                caf.pdf
                            </a>
                        </>
                    )}
                </>
            )}

            <div style={{ marginTop: "30px" }}>
                <Link to={`/associados/edit/${id}`} style={btnEditar}>
                    Editar
                </Link>
                <button onClick={handleDelete} style={btnExcluir}>
                    Excluir
                </button>
            </div>
        </div>
    );
}
