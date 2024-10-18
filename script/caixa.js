document.getElementById("cadastrarMesa").addEventListener("click", function() {
    const mesaNome = prompt("Digite o nome ou número da mesa:");
    if (mesaNome) {
        const li = document.createElement("li");
        li.textContent = mesaNome;
        document.getElementById("mesaList").appendChild(li);
    }
});

document.getElementById("cadastrarUsuarioProduto").addEventListener("click", function() {
    window.location.href = "cadastrar.html"; 
});
