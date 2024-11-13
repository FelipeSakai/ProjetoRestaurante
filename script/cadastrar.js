
document.getElementById("produtoForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const secaoProduto = document.getElementById("secaoProduto").value;
    const nomeProduto = document.getElementById("nomeProduto").value;
    const precoProduto = document.getElementById("precoProduto").value;

    if (secaoProduto && nomeProduto && precoProduto) {
        Swal.fire({
            icon: 'success',
            title: 'Produto Cadastrado',
            text: `Produto ${nomeProduto} na seção ${secaoProduto} cadastrado com sucesso!`,
            confirmButtonText: 'Fechar',
            timer: 1500 
        });

        document.getElementById("produtoForm").reset();
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Erro',
            text: 'Por favor, preencha todos os campos.',
            confirmButtonText: 'Fechar'
        });
    }
});


document.getElementById("sairButton").addEventListener("click", function() {
    console.log("Botão sair clicado!");
    window.location.href = "caixa.html"; 
});
