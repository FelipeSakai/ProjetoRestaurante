document.getElementById("loginForm").addEventListener("submit", async function (e) {
    e.preventDefault(); 


    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("http://localhost:3333/user/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, password }) 
        });

        const data = await response.json();

        if (response.ok) {
            const userType = data.userType; 

            
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
                    window.location.href = "garcom.hmtl";
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
