const BASE_URL = "http://localhost:3333";

async function carregarCategorias() {
    try {
        const response = await fetch(`${BASE_URL}/category/list`);
        if (!response.ok) throw new Error("Erro ao buscar categorias");

        const categorias = await response.json();
        const secaoProduto = document.getElementById("secaoProduto");

        secaoProduto.innerHTML = '<option value="" disabled selected>Selecione uma Categoria</option>';
        categorias.forEach(categoria => {
            const option = document.createElement("option");
            option.value = categoria.id;
            option.textContent = categoria.nome;
            secaoProduto.appendChild(option);
        });
    } catch (error) {
        console.error("Erro ao carregar categorias:", error);
        Swal.fire({
            icon: 'error',
            title: 'Erro',
            text: 'Não foi possível carregar as categorias.',
        });
    }
}

document.getElementById("categoriaForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const nomeCategoria = document.getElementById("nomeCategoria").value;

    if (nomeCategoria) {
        try {
            const response = await fetch(`${BASE_URL}/category/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ categoria: nomeCategoria })
            });

            if (!response.ok) throw new Error("Erro ao cadastrar categoria");

            Swal.fire({
                icon: "success",
                title: "Categoria Cadastrada",
                text: `Categoria ${nomeCategoria} cadastrada com sucesso!`,
                timer: 1500
            });

            document.getElementById("categoriaForm").reset();
            carregarCategorias();
        } catch (error) {
            console.error("Erro ao cadastrar categoria:", error);
            Swal.fire({
                icon: "error",
                title: "Erro",
                text: "Não foi possível cadastrar a categoria."
            });
        }
    } else {
        Swal.fire({
            icon: "error",
            title: "Erro",
            text: "Por favor, preencha o campo de nome da categoria."
        });
    }
});

async function deletarCategoria(id) {
    try {
        const response = await fetch(`${BASE_URL}/category/${id}`, {
            method: "DELETE",
        });

        if (response.ok) {
            Swal.fire({
                icon: "success",
                title: "Categoria Deletada",
                text: "A categoria foi excluída com sucesso!",
                confirmButtonText: "Fechar",
                timer: 1500,
            });

            carregarCategorias();
        } else {
            const data = await response.json();
            Swal.fire({
                icon: "error",
                title: "Erro",
                text: data.message || "Erro ao excluir a categoria.",
                confirmButtonText: "Fechar",
            });
        }
    } catch (error) {
        console.error("Erro ao deletar categoria:", error);
    }
}

document.getElementById("produtoForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const secaoProduto = document.getElementById("secaoProduto").value;
    const nomeProduto = document.getElementById("nomeProduto").value;
    const precoProduto = document.getElementById("precoProduto").value;

    if (secaoProduto && nomeProduto && precoProduto) {
        try {
            const response = await fetch(`${BASE_URL}/product/create`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nome_produto: nomeProduto,
                    preco: parseFloat(precoProduto),
                    id_categoria_produto: secaoProduto,
                }),
            });

            if (!response.ok) throw new Error("Erro ao cadastrar produto");

            Swal.fire({
                icon: "success",
                title: "Produto Cadastrado",
                text: `Produto ${nomeProduto} cadastrado com sucesso!`,
                timer: 1500,
            });

            document.getElementById("produtoForm").reset();
            listarProdutos();
        } catch (error) {
            console.error("Erro ao cadastrar produto:", error);
            Swal.fire({
                icon: "error",
                title: "Erro",
                text: "Não foi possível cadastrar o produto.",
            });
        }
    } else {
        Swal.fire({
            icon: "error",
            title: "Erro",
            text: "Por favor, preencha todos os campos.",
        });
    }
});

async function listarProdutos() {
    try {
        const response = await fetch(`${BASE_URL}/product/list`);
        const produtos = await response.json();

        if (response.ok) {
            const listaProdutos = document.getElementById("listaProdutos");
            listaProdutos.innerHTML = "";

            produtos.forEach((produto) => {
                const produtoItem = document.createElement("div");
                produtoItem.classList.add("produto-item");
                produtoItem.innerHTML = `
                    <p><strong>Nome:</strong> ${produto.nome_produto}</p>
                    <p><strong>Categoria:</strong> ${produto.id_categoria_produto}</p>
                    <p><strong>Preço:</strong> R$ ${produto.preco.toFixed(2)}</p>
                    <button class="editButton" data-id="${produto.id}">Editar</button>
                    <button class="deleteButton" data-id="${produto.id}">Excluir</button>
                `;
                listaProdutos.appendChild(produtoItem);
            });

            document.querySelectorAll(".editButton").forEach((button) =>
                button.addEventListener("click", () => editarProduto(button.dataset.id))
            );
            document.querySelectorAll(".deleteButton").forEach((button) =>
                button.addEventListener("click", () => deletarProduto(button.dataset.id))
            );
        } else {
            console.error("Erro ao listar produtos:", produtos.message);
        }
    } catch (error) {
        console.error("Erro ao buscar produtos:", error);
    }
}


carregarCategorias();
listarProdutos();
