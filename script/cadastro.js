document.getElementById("cadastrarForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Evita o envio do formulário

    const tipo = document.getElementById("tipo").value;
    const nome = document.getElementById("nome").value;

    alert(`Cadastrado com sucesso!\nTipo: ${tipo}\nNome: ${nome}`);
    // Aqui você pode adicionar a lógica para salvar o cadastro
});
