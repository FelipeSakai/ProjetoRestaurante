const BASE_URL = "http://localhost:3333";

document.getElementById("produtoForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const secaoProduto = document.getElementById("secaoProduto").value;
    const nomeProduto = document.getElementById("nomeProduto").value;
    const precoProduto = document.getElementById("precoProduto").value;

    async function carregarCategorias() {
        try {
            const response = await fetch("http://localhost:3333/product/list");
            if (!response.ok) throw new Error("Erro ao buscar categorias");

            const data = await response.json();
            const secaoProduto = document.getElementById("secaoProduto");

            secaoProduto.innerHTML = '<option value="" disabled selected>Selecione uma Categoria</option>';
            data.categorias.forEach(categoria => {
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

    document.addEventListener("DOMContentLoaded", carregarCategorias);


    if (secaoProduto && nomeProduto && precoProduto) {
        try {
            const response = await fetch("http://localhost:3333/product/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    categoriaId: secaoProduto,
                    nome: nomeProduto,
                    preco: parseFloat(precoProduto),
                }),
            });

            if (!response.ok) throw new Error("Erro ao cadastrar produto");

            Swal.fire({
                icon: 'success',
                title: 'Produto Cadastrado',
                text: `Produto ${nomeProduto} cadastrado com sucesso!`,
                timer: 1500,
            });

            document.getElementById("produtoForm").reset();
        } catch (error) {
            console.error("Erro ao cadastrar produto:", error);
            Swal.fire({
                icon: 'error',
                title: 'Erro',
                text: 'Não foi possível cadastrar o produto.',
            });
        }
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Erro',
            text: 'Por favor, preencha todos os campos.',
        });
    }
});

document.getElementById("sairButton").addEventListener("click", function () {
    console.log("Botão sair clicado!");
    window.location.href = "caixa.html";
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
                    <p><strong>Nome:</strong> ${produto.name}</p>
                    <p><strong>Categoria:</strong> ${produto.category}</p>
                    <p><strong>Preço:</strong> R$ ${produto.price.toFixed(2)}</p>
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

async function editarProduto(id) {
    const novoNome = prompt("Digite o novo nome do produto:");
    const novoPreco = prompt("Digite o novo preço do produto:");

    if (novoNome && novoPreco) {
        try {
            const response = await fetch(`${BASE_URL}/product/update/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: novoNome,
                    price: parseFloat(novoPreco)
                })
            });

            if (response.ok) {
                Swal.fire({
                    icon: "success",
                    title: "Produto Atualizado",
                    text: "O produto foi atualizado com sucesso!",
                    confirmButtonText: "Fechar",
                    timer: 1500
                });

                listarProdutos();
            } else {
                const data = await response.json();
                Swal.fire({
                    icon: "error",
                    title: "Erro",
                    text: data.message || "Erro ao atualizar o produto.",
                    confirmButtonText: "Fechar"
                });
            }
        } catch (error) {
            console.error("Erro ao atualizar o produto:", error);
        }
    }
}

async function deletarProduto(id) {
    try {
        const response = await fetch(`${BASE_URL}/product/delete/${id}`, {
            method: "DELETE"
        });

        if (response.ok) {
            Swal.fire({
                icon: "success",
                title: "Produto Deletado",
                text: "O produto foi excluído com sucesso!",
                confirmButtonText: "Fechar",
                timer: 1500
            });

            listarProdutos();
        } else {
            const data = await response.json();
            Swal.fire({
                icon: "error",
                title: "Erro",
                text: data.message || "Erro ao excluir o produto.",
                confirmButtonText: "Fechar"
            });
        }
    } catch (error) {
        console.error("Erro ao deletar o produto:", error);
    }
}

listarProdutos();

document.getElementById("categoriaForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const nomeCategoria = document.getElementById("nomeCategoria").value;

    if (nomeCategoria) {
        try {
            const response = await fetch(`${BASE_URL}/category/create`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: nomeCategoria })
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

async function listarCategorias() {
    try {
        const response = await fetch(`${BASE_URL}/category/list`);
        const categorias = await response.json();

        if (response.ok) {
            const listaCategorias = document.getElementById("listaCategorias");
            listaCategorias.innerHTML = "";

            categorias.forEach((categoria) => {
                const categoriaItem = document.createElement("div");
                categoriaItem.classList.add("categoria-item");
                categoriaItem.innerHTML = `
                    <p><strong>Nome:</strong> ${categoria.nome}</p>
                    <button class="deleteCategoriaButton" data-id="${categoria.id}">Excluir</button>
                `;
                listaCategorias.appendChild(categoriaItem);
            });

            document.querySelectorAll(".deleteCategoriaButton").forEach((button) =>
                button.addEventListener("click", () => deletarCategoria(button.dataset.id))
            );
        } else {
            console.error("Erro ao listar categorias:", categorias.message);
        }
    } catch (error) {
        console.error("Erro ao buscar categorias:", error);
    }
}

async function deletarCategoria(id) {
    try {
        const response = await fetch(`${BASE_URL}/category/delete/${id}`, {
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

            listarCategorias();
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

listarProdutos();
listarCategorias();
