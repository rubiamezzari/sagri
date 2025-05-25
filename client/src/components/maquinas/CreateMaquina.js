import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const REACT_APP_YOUR_HOSTNAME = 'http://localhost:5050';

export default function CreateMaquina() {
    const [form, setForm] = useState({
        tipo: "",
        marca: "",
        modelo: "",
        capacidade: "",
        cor: "",
        status: "",
        foto: "",
        n_serie: "",
        observacao: ""
    });

    const navigate = useNavigate();

    function updateForm(value) {
        setForm((prev) => ({ ...prev, ...value }));
    }

    async function onSubmit(e) {
        e.preventDefault();

        const newMaquina = { ...form };
        const response = await fetch(`${REACT_APP_YOUR_HOSTNAME}/maquinas/add`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newMaquina)
        });

        if (!response.ok) {
            const message = `An error occurred: ${response.statusText}`;
            window.alert(message);
            return;
        }

        setForm({});
        navigate("/maquinas");
    }

    return (
        <div>
            <h3>Cadastrar nova Máquina</h3>
            <form onSubmit={onSubmit}>

                <div className="mb-3">
                    <input
                        type="text"
                        placeholder="Tipo"
                        className="form-control mb-2"
                        value={form.tipo}
                        onChange={(e) => updateForm({ tipo: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Marca"
                        className="form-control mb-2"
                        value={form.marca}
                        onChange={(e) => updateForm({ marca: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Modelo"
                        className="form-control mb-2"
                        value={form.modelo}
                        onChange={(e) => updateForm({ modelo: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Capacidade"
                        className="form-control mb-2"
                        value={form.capacidade}
                        onChange={(e) => updateForm({ capacidade: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Cor"
                        className="form-control mb-2"
                        value={form.cor}
                        onChange={(e) => updateForm({ cor: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Status"
                        className="form-control mb-2"
                        value={form.status}
                        onChange={(e) => updateForm({ status: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Foto (nome do arquivo)"
                        className="form-control mb-2"
                        value={form.foto}
                        onChange={(e) => updateForm({ foto: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Número de Série"
                        className="form-control mb-2"
                        value={form.n_serie}
                        onChange={(e) => updateForm({ n_serie: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Observações"
                        className="form-control mb-2"
                        value={form.observacao}
                        onChange={(e) => updateForm({ observacao: e.target.value })}
                    />
                </div>

                <div className="mb-3">
                    <input type="submit" value="Cadastrar" className="btn btn-success" />
                </div>
            </form>
        </div>
    );
}
