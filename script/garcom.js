document.addEventListener("DOMContentLoaded", listarComandas);

let comandaSelecionada = null;

async function listarComandas() {
    try {
        const response = await fetch("http://localhost:3333/pedido/list");
        if (!response.ok) throw new Error("Erro ao listar comandas.");

        const comandas = await response.json();
        const comandaGrid = document.getElementById("comandaGrid");
        comandaGrid.innerHTML = "";

        comandas.forEach((comanda) => {
            const comandaDiv = document.createElement("div");
            comandaDiv.classList.add("comanda-item");
            comandaDiv.textContent = `Mesa #${comanda.mesa.numero_mesa}`;
            comandaDiv.dataset.id = comanda.id_pedido;

            comandaDiv.addEventListener("click", () => abrirProdutosDaComanda(comanda.id_pedido));
            comandaGrid.appendChild(comandaDiv);
        });
    } catch (error) {
        console.error("Erro ao listar comandas:", error);
        Swal.fire("Erro", "Não foi possível carregar as comandas.", "error");
    }
}

document.getElementById("cadastrarComanda").addEventListener("click", async () => {
    try {
        const mesasResponse = await fetch("http://localhost:3333/mesa/list");
        const garconsResponse = await fetch("http://localhost:3333/garcom/list");
        if (!mesasResponse.ok || !garconsResponse.ok) throw new Error("Erro ao listar mesas ou garçons.");

        const mesas = await mesasResponse.json();
        const garcons = await garconsResponse.json();

        const { value: formValues } = await Swal.fire({
            title: "Cadastrar Comanda",
            html: `
                <select id="mesaSelect" class="swal2-input">
                    ${mesas.map((mesa) => `<option value="${mesa.id_mesa}">Mesa #${mesa.numero_mesa}</option>`).join("")}
                </select>
                <select id="garcomSelect" class="swal2-input">
                    ${garcons.map((garcom) => `<option value="${garcom.id_garcom}">${garcom.nome}</option>`).join("")}
                </select>
            `,
            focusConfirm: false,
            preConfirm: () => ({
                id_mesa: document.getElementById("mesaSelect").value,
                id_garcom: document.getElementById("garcomSelect").value,
            }),
        });

        if (!formValues) return;
        const response = await fetch("http://localhost:3333/pedido/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formValues),
        });

        if (!response.ok) throw new Error("Erro ao criar a comanda.");

        Swal.fire("Sucesso", "Comanda criada com sucesso!", "success");
        listarComandas();
    } catch (error) {
        console.error("Erro ao cadastrar comanda:", error);
        Swal.fire("Erro", "Não foi possível cadastrar a comanda.", "error");
    }
});

async function abrirProdutosDaComanda(idComanda) {
    comandaSelecionada = idComanda;
    try {
        const response = await fetch(`http://localhost:3333/item-pedido/list/${idComanda}`);
        if (!response.ok) throw new Error("Erro ao listar produtos da comanda.");

        const produtos = await response.json();
        const produtoGrid = document.getElementById("produtoGrid");
        produtoGrid.innerHTML = "";

        produtos.forEach((produto) => {
            const produtoDiv = document.createElement("div");
            produtoDiv.classList.add("produto-item");
            produtoDiv.innerHTML = `
                <p><strong>${produto.produto.nome_produto}</strong></p>
                <p>Quantidade: ${produto.quantidade}</p>
                <p>Observações: ${produto.observacoes || "Nenhuma"}</p>
            `;
            produtoGrid.appendChild(produtoDiv);
        });

        document.getElementById("adicionarProdutoButton").style.display = "block";
    } catch (error) {
        console.error("Erro ao listar produtos da comanda:", error);
        Swal.fire("Erro", "Não foi possível carregar os produtos.", "error");
    }
}

document.getElementById("adicionarProdutoButton").addEventListener("click", async () => {
    try {
        const produtosResponse = await fetch("http://localhost:3333/product/list");
        if (!produtosResponse.ok) throw new Error("Erro ao listar produtos.");

        const produtos = await produtosResponse.json();

        const { value: formValues } = await Swal.fire({
            title: "Adicionar Produto",
            html: `
                <select id="produtoSelect" class="swal2-input">
                    ${produtos.map((produto) => 
                        `<option value="${produto.id_produto}">${produto.nome_produto} - R$ ${produto.preco}</option>`
                    ).join("")}
                </select>
                <input id="quantidadeProduto" type="number" class="swal2-input" placeholder="Quantidade" min="1">
                <textarea id="observacoesProduto" class="swal2-textarea" placeholder="Observações"></textarea>
            `,
            focusConfirm: false,
            preConfirm: () => ({
                id_produto: document.getElementById("produtoSelect").value,
                quantidade: parseInt(document.getElementById("quantidadeProduto").value),
                observacoes: document.getElementById("observacoesProduto").value,
            }),
        });

        if (!formValues) return;

        const response = await fetch("http://localhost:3333/item-pedido/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id_pedido: comandaSelecionada,
                ...formValues,
            }),
        });

        if (!response.ok) throw new Error("Erro ao adicionar produto.");

        Swal.fire("Sucesso", "Produto adicionado à comanda!", "success");
        abrirProdutosDaComanda(comandaSelecionada);
    } catch (error) {
        console.error("Erro ao adicionar produto:", error);
        Swal.fire("Erro", "Não foi possível adicionar o produto.", "error");
    }
});
