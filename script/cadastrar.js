document.getElementById("cadastrarUsuarioButton").addEventListener("click", function() {
    document.getElementById("cadastroUsuario").style.display = "block";
    document.getElementById("cadastroProduto").style.display = "none";
});

document.getElementById("cadastrarProdutoButton").addEventListener("click", function() {
    document.getElementById("cadastroProduto").style.display = "block";
    document.getElementById("cadastroUsuario").style.display = "none";
});

document.getElementById("usuarioForm").addEventListener("submit", function(event) {
    event.preventDefault();
    
    const nomeUsuario = document.getElementById("nomeUsuario").value;
    const emailUsuario = document.getElementById("senhaUsuario").value;
    
    alert(`Usuário ${nomeUsuario} cadastrado com sucesso!`);
    
    document.getElementById("usuarioForm").reset();
});

document.getElementById("produtoForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const secaoProduto = document.getElementById("secaoProduto").value;
    const nomeProduto = document.getElementById("nomeProduto").value;
    const precoProduto = document.getElementById("precoProduto").value;

    alert(`Produto ${nomeProduto} na seção ${secaoProduto} cadastrado com sucesso!`);
    
    document.getElementById("produtoForm").reset();
});

document.getElementById("sairButton").addEventListener("click", function() {
    window.location.href = "caixa.html";
});
