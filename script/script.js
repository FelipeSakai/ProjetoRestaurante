document.getElementById("loginForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const login = document.getElementById("username").value.trim();
    const senha = document.getElementById("password").value.trim();

    if (!login || !senha) {
        showError("Preencha todos os campos antes de continuar.");
        return;
    }

    try {
        const response = await fetch("http://localhost:3333/user/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ login, senha })
        });

        const data = await response.json();
        console.log(data);

        if (response.ok) {
            const userType = data.user.tipo;

            switch (userType) {
                case "A":
                    window.location.href = "adm.html";
                    break;
                case "C":
                    window.location.href = "caixa.html";
                    break;
                case "O":
                    window.location.href = "cozinha.html";
                    break;
                case "G":
                    window.location.href = "garcom.html"; 
                    break;
                default:
                    throw new Error("Tipo de usuário inválido");
            }
        } else {
            const errorMessage = data.message || "Erro ao fazer login. Verifique suas credenciais.";
            showError(errorMessage);
        }
    } catch (error) {
        console.error("Erro ao tentar fazer login:", error);
        showError("Ocorreu um erro inesperado. Tente novamente mais tarde.");
    }
});

function showError(message) {
    Swal.fire({
        icon: "error",
        title: "Erro",
        text: message
    });
}
