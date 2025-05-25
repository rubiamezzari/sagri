import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const REACT_APP_YOUR_HOSTNAME = 'http://localhost:5050';

export default function CreateOperador() {
    const [form, setForm] = useState({
        nome: "",
        email: "",
        telefone: "",
        cpf: "",
        senha: ""
    });

    const navigate = useNavigate();

    function updateForm(value) {
        setForm((prev) => ({ ...prev, ...value }));
    }

    async function onSubmit(e) {
        e.preventDefault();

        const newOperador = { ...form };
        const response = await fetch(`${REACT_APP_YOUR_HOSTNAME}/operadores/add`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newOperador)
        });

        if (!response.ok) {
            const message = `An error occurred: ${response.statusText}`;
            window.alert(message);
            return;
        }

        setForm({});
        navigate("/operadores");
    }

    return (
        <div>
            <h3>Cadastrar novo Operador</h3>
            <form onSubmit={onSubmit}>

                <div className="mb-3">
                    <input
                        type="text"
                        placeholder="Nome"
                        className="form-control mb-2"
                        value={form.nome}
                        onChange={(e) => updateForm({ nome: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Email"
                        className="form-control mb-2"
                        value={form.email}
                        onChange={(e) => updateForm({ email: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Telefone"
                        className="form-control mb-2"
                        value={form.telefone}
                        onChange={(e) => updateForm({ telefone: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="CPF"
                        className="form-control mb-2"
                        value={form.cpf}
                        onChange={(e) => updateForm({ cpf: e.target.value })}
                    />
                    <input
                        type="password"
                        placeholder="Senha"
                        className="form-control mb-2"
                        value={form.senha}
                        onChange={(e) => updateForm({ senha: e.target.value })}
                    />
                </div>

                <div className="mb-3">
                    <input type="submit" value="Cadastrar" className="btn btn-success" />
                </div>
            </form>
        </div>
    );
}
