document.getElementById("sairButton").addEventListener("click", function () {
    window.location.href = "index.html";
});

document.getElementById("cadastrarUsuarioProduto").addEventListener("click", function () {
    window.location.href = "cadastrar.html";
});

async function listarMesas() {
    try {
        const response = await fetch("/mesa/list");
        if (!response.ok) {
            throw new Error("Erro ao listar mesas.");
        }
        const mesas = await response.json();
        const mesaList = document.getElementById("mesaList");
        mesaList.innerHTML = "";

        mesas.forEach(mesa => {
            criarElementoMesa(mesa.id, mesa.numero_mesa);
        });
    } catch (error) {
        console.error("Erro ao listar mesas:", error);
        Swal.fire("Erro", "Não foi possível carregar as mesas.", "error");
    }
}

document.getElementById("cadastrarMesa").addEventListener("click", async function () {
    const { value: numeroMesa } = await Swal.fire({
        title: "Cadastre a mesa",
        input: "text",
        inputLabel: "Número da mesa",
        showCancelButton: true,
        inputValidator: (value) => {
            if (!value) {
                return "Digite algo!";
            }
        }
    });

    if (numeroMesa) {
        try {
            const response = await fetch("/mesa/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ numero_mesa: parseInt(numeroMesa) }) 
            });
            if (!response.ok) {
                throw new Error("Erro ao criar a mesa.");
            }
            const mesa = await response.json();
            criarElementoMesa(mesa.id, mesa.numero_mesa); 
            Swal.fire(`Você cadastrou a mesa número ${mesa.numero_mesa}`);
        } catch (error) {
            console.error("Erro ao criar mesa:", error);
            Swal.fire("Erro", "Não foi possível criar a mesa.", "error");
        }
    }
});

function criarElementoMesa(id, numeroMesa) {
    const divMesa = document.createElement("div");
    divMesa.classList.add("mesa-item");

    const mesaTitulo = document.createElement("h3");
    mesaTitulo.textContent = `Mesa ${numeroMesa}`;

    const mesaInfo = document.createElement("div");
    mesaInfo.classList.add("mesa-info");
    mesaInfo.textContent = `Informações da Mesa ${numeroMesa}`;
    mesaInfo.style.display = "none";

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Excluir Mesa";
    deleteButton.classList.add("delete-button");
    deleteButton.addEventListener("click", async function (event) {
        event.stopPropagation();
        const { isConfirmed } = await Swal.fire({
            title: `Tem certeza que deseja excluir a mesa número ${numeroMesa}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sim, excluir!",
            cancelButtonText: "Cancelar",
        });
        if (isConfirmed) {
            try {
                const response = await fetch(`/mesa/delete/${id}`, {
                    method: "DELETE"
                });
                if (!response.ok) {
                    throw new Error("Erro ao excluir a mesa.");
                }
                divMesa.remove();
                Swal.fire("Excluída!", `Mesa número ${numeroMesa} foi excluída.`, "success");
            } catch (error) {
                console.error("Erro ao excluir mesa:", error);
                Swal.fire("Erro", "Não foi possível excluir a mesa.", "error");
            }
        }
    });

    divMesa.appendChild(mesaTitulo);
    divMesa.appendChild(mesaInfo);
    divMesa.appendChild(deleteButton);

    divMesa.addEventListener("click", function () {
        mesaInfo.style.display = mesaInfo.style.display === "none" ? "block" : "none";
    });

    document.getElementById("mesaList").appendChild(divMesa);
}

document.addEventListener("DOMContentLoaded", listarMesas);
