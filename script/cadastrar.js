document.getElementById("cadastrarUsuarioButton").addEventListener("click", function () {
    document.getElementById("cadastroUsuario").style.display = "block";
    document.getElementById("cadastroProduto").style.display = "none";
});

document.getElementById("cadastrarProdutoButton").addEventListener("click", function () {
    document.getElementById("cadastroUsuario").style.display = "none";
    document.getElementById("cadastroProduto").style.display = "block";
});

/*document.getElementById("usuarioForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const nomeUsuario = document.getElementById("nomeUsuario").value;
    const senhaUsuario = document.getElementById("senhaUsuario").value;

 /*    try {
        const response = await fetch("http://localhost:3333/usuarios", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ nome: nomeUsuario, senha: senhaUsuario }),
        });

        if (response.ok) {
            Swal.fire("Sucesso", "Usuário cadastrado com sucesso!", "success");
            document.getElementById("usuarioForm").reset();
        } else {
            const errorData = await response.json();
            Swal.fire("Erro", `Erro ao cadastrar: ${errorData.message}`, "error");
        }
    } catch (error) {
        console.error("Erro:", error);
        Swal.fire("Erro", "Erro ao conectar ao servidor.", "error");
    }
}); */

document.getElementById("produtoForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const secaoProduto = document.getElementById("secaoProduto").value;
    const nomeProduto = document.getElementById("nomeProduto").value;
    const precoProduto = parseFloat(document.getElementById("precoProduto").value);

    try {
        const response = await fetch("http://localhost:3333/produtos", { // Ta produto aqui ai muda pra item pra testar ou coloca produto com essas info dentro
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                secao: secaoProduto, 
                nome: nomeProduto,
                preco: precoProduto
            }),
        });

        if (response.ok) {
            Swal.fire("Sucesso", "Produto cadastrado com sucesso!", "success");
            document.getElementById("produtoForm").reset(); 
        } else {
            const errorData = await response.json();
            Swal.fire("Erro", `Erro ao cadastrar: ${errorData.message}`, "error");
        }
    } catch (error) {
        console.error("Erro:", error);
        Swal.fire("Erro", "Erro ao conectar ao servidor.", "error");
    }
});
