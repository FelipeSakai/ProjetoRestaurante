document.getElementById("cadastrarUsuarioProduto").addEventListener("click", function () {
    window.location.href = "cadastrar.html";
});
async function listarMesas() {
    try {

        const mesasResponse = await fetch("http://localhost:3333/mesa/list");
        if (!mesasResponse.ok) {
            throw new Error("Erro ao listar mesas.");
        }
        const mesas = await mesasResponse.json();

        const pedidosResponse = await fetch("http://localhost:3333/pedido/list");
        if (!pedidosResponse.ok) {
            throw new Error("Erro ao listar pedidos.");
        }
        const pedidos = await pedidosResponse.json();

        const mesaList = document.getElementById("mesaList");
        mesaList.innerHTML = "";

        for (const mesa of mesas) {
            const pedidoAberto = pedidos.find(pedido => pedido.id_mesa === mesa.id_mesa);

            if (pedidoAberto) {
                const produtos = await listarProdutosDoPedido(pedidoAberto.id_pedido);
                const valorTotal = await obterValorTotalPedido(pedidoAberto.id_pedido);
                criarElementoMesa(mesa.id_mesa, mesa.numero_mesa, pedidoAberto.id_pedido, produtos, valorTotal);
            } else {
                criarElementoMesa(mesa.id_mesa, mesa.numero_mesa, null, [], null);
            }
        }
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
            const response = await fetch("http://localhost:3333/mesa/create", {
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

async function listarProdutosDoPedido(idPedido) {
    try {
        const response = await fetch(`http://localhost:3333/item-pedido/list/${idPedido}`);
        if (!response.ok) {
            throw new Error("Erro ao listar produtos do pedido.");
        }
        return await response.json();
    } catch (error) {
        console.error("Erro ao listar produtos do pedido:", error);
        return [];
    }
}

async function obterValorTotalPedido(idPedido) {
    try {
        const response = await fetch(`http://localhost:3333/pedido/pedido/${idPedido}`);
        if (!response.ok) {
            throw new Error("Erro ao obter valor total do pedido.");
        }
        const pedido = await response.json();
        return pedido.valorTotal || 0;
    } catch (error) {
        console.error("Erro ao obter valor total do pedido:", error);
        return 0;
    }
}

function criarElementoMesa(id, numeroMesa, pedidoId, produtos, valorTotal) {
    const divMesa = document.createElement("div");
    divMesa.classList.add("mesa-item");

    const mesaTitulo = document.createElement("h3");
    mesaTitulo.textContent = `Mesa ${numeroMesa}`;

    const mesaInfo = document.createElement("div");
    mesaInfo.classList.add("mesa-info");
    mesaInfo.style.display = "none";

    if (pedidoId) {
        const valorTotalElement = document.createElement("p");
        valorTotalElement.textContent = `Valor Total: R$ ${valorTotal.toFixed(2)}`;
        mesaInfo.appendChild(valorTotalElement);

        const produtosList = document.createElement("ul");
        produtosList.classList.add("produtos-list");
        produtos.forEach(produto => {
            const produtoItem = document.createElement("li");
            produtoItem.textContent = `${produto.produto.nome_produto} - Quantidade: ${produto.quantidade}` + 
                (produto.observacoes ? ` (Obs: ${produto.observacoes})` : "");
            produtosList.appendChild(produtoItem);
        });
        mesaInfo.appendChild(produtosList);
    } else {
        mesaInfo.textContent = "Nenhum pedido associado a esta mesa.";
    }

    const closeButton = document.createElement("button");
    closeButton.textContent = "Fechar Mesa";
    closeButton.classList.add("close-button");
    closeButton.disabled = !pedidoId;
    closeButton.addEventListener("click", async function (event) {
        event.stopPropagation();
        const { isConfirmed } = await Swal.fire({
            title: `Tem certeza que deseja fechar a mesa número ${numeroMesa}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sim, fechar!",
            cancelButtonText: "Cancelar",
        });

        if (isConfirmed && pedidoId) {
            try {
                const response = await fetch(`http://localhost:3333/pedido/close/${pedidoId}`, {
                    method: "PATCH",
                });
                if (!response.ok) {
                    throw new Error("Erro ao fechar a mesa.");
                }
                Swal.fire("Fechada!", `Mesa número ${numeroMesa} foi fechada.`, "success");
                listarMesas();
            } catch (error) {
                console.error("Erro ao fechar mesa:", error);
                Swal.fire("Erro", "Não foi possível fechar a mesa.", "error");
            }
        }
    });

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
                const response = await fetch(`http://localhost:3333/mesa/delete/${id}`, {
                    method: "DELETE",
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
    divMesa.appendChild(closeButton);
    divMesa.appendChild(deleteButton);

    divMesa.addEventListener("click", function () {
        mesaInfo.style.display = mesaInfo.style.display === "none" ? "block" : "none";
    });

    document.getElementById("mesaList").appendChild(divMesa);
}

function sair() {
    window.location.href = "index.html";
}

document.addEventListener("DOMContentLoaded", listarMesas);
