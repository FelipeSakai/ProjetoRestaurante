const BASE_URL = "http://localhost:3333";

async function carregarCategorias() {
    try {
        const response = await fetch(`${BASE_URL}/category/list`);
        if (!response.ok) throw new Error("Erro ao buscar categorias");

        const categorias = await response.json();
        console.log("Categorias carregadas:", categorias);

        const secaoProduto = document.getElementById("secaoProduto");

        secaoProduto.innerHTML = '<option value="" disabled selected>Selecione uma Categoria</option>';
        categorias.forEach(categoria => {
            const option = document.createElement("option");
            option.value = categoria.id_categoria_produto;
            option.textContent = categoria.categoria;
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
        const responseProdutos = await fetch(`${BASE_URL}/product/list`);
        const produtos = await responseProdutos.json();

        if (!responseProdutos.ok) {
            throw new Error("Erro ao listar produtos");
        }

        const responseCategorias = await fetch(`${BASE_URL}/category/list`);
        const categorias = await responseCategorias.json();

        if (!responseCategorias.ok) {
            throw new Error("Erro ao listar categorias");
        }

        const categoriaMap = categorias.reduce((map, categoria) => {
            map[categoria.id_categoria_produto] = categoria.categoria;
            return map;
        }, {});

        const listaProdutos = document.getElementById("listaProdutos");
        listaProdutos.innerHTML = "";

        produtos.forEach((produto) => {
            const categoriaNome = categoriaMap[produto.id_categoria_produto] || "Categoria desconhecida";

            const produtoItem = document.createElement("div");
            produtoItem.classList.add("produto-item");
            produtoItem.innerHTML = `
                <p><strong>Nome:</strong> ${produto.nome_produto}</p>
                <p><strong>Categoria:</strong> ${categoriaNome}</p>
                <p><strong>Preço:</strong> R$ ${produto.preco.toFixed(2)}</p>
                <button class="editButton" data-id="${produto.id_produto}">Editar</button>
                <button class="deleteButton" data-id="${produto.id_produto}">Excluir</button>
            `;
            listaProdutos.appendChild(produtoItem);
        });

        document.querySelectorAll(".deleteButton").forEach((button) =>
            button.addEventListener("click", (event) => {
                const idProduto = event.target.getAttribute("data-id");
                deletarProduto(idProduto);
            })
        );
    } catch (error) {
        console.error(error.message);
    }
}


async function listarCategorias() {
    try {
        const response = await fetch(`${BASE_URL}/category/list`);
        const categorias = await response.json();

        if (!response.ok) {
            throw new Error("Erro ao listar categorias");
        }

        const listaCategorias = document.getElementById("listaCategorias");
        listaCategorias.innerHTML = "";

        categorias.forEach((categoria) => {
            const categoriaItem = document.createElement("div");
            categoriaItem.classList.add("categoria-item");
            categoriaItem.innerHTML = `
                <p><strong>Nome da Categoria:</strong> ${categoria.categoria}</p>
                <button class="editButton" data-id="${categoria.id_categoria_produto}">Editar</button>
                <button class="deleteButton" data-id="${categoria.id_categoria_produto}">Excluir</button>
            `;
            listaCategorias.appendChild(categoriaItem);
        });

        document.querySelectorAll(".editButton").forEach((button) =>
            button.addEventListener("click", () => editarCategoria(button.dataset.id))
        );
        document.querySelectorAll(".deleteButton").forEach((button) =>
            button.addEventListener("click", () => deletarCategoria(button.dataset.id))
        );
    } catch (error) {
        console.error("Erro ao listar categorias:", error);
        Swal.fire({
            icon: "error",
            title: "Erro",
            text: "Não foi possível listar as categorias.",
        });
    }
}


async function deletarProduto(id) {
    try {
        const response = await fetch(`${BASE_URL}/product/delete/${id}`, {
            method: "DELETE",
        });

        if (response.ok) {
            Swal.fire({
                icon: "success",
                title: "Produto Deletado",
                text: "Produto excluído com sucesso!",
                timer: 1500,
            });
            listarProdutos();
        } else {
            const data = await response.json();
            Swal.fire({
                icon: "error",
                title: "Erro",
                text: data.message || "Não foi possível excluir o produto.",
            });
        }
    } catch (error) {
        console.error("Erro ao excluir produto:", error);
    }
}

function sair() {
    window.location.href = "caixa.html";
}

carregarCategorias();
listarProdutos();
