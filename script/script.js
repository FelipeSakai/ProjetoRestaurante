document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Evita o envio do formulário

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Lógica de autenticação básica
    let userRole;
    if (username === "caixa" && password === "senha") {
        userRole = "caixa";
    } else if (username === "garcom" && password === "senha") {
        userRole = "garcom";
    } else if (username === "cozinha" && password === "senha") {
        userRole = "cozinha";
    }

    if (userRole) {
        alert(`Login bem-sucedido! Você está logado como: ${userRole}`);
        // Redirecionar para a página correspondente
        window.location.href = `${userRole}.html`; // Exemplo de redirecionamento
    } else {
        document.getElementById("errorMessage").innerText = "Usuário ou senha inválidos.";
    }
});
