document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;


    let userRole;
    if (username === "caixa" && password === "senha") {
        userRole = "caixa";
    } else if (username === "garcom" && password === "senha") {
        userRole = "garcom";
    } else if (username === "cozinha" && password === "senha") {
        userRole = "cozinha";
    }else if (username === "adm" && password === "senha"){
        userRole ="adm";
    }

    if (userRole) {
        Swal.fire({
            title: "Acesso Autorizado!",
            text: `Você entrou como ${userRole}`,
            icon: "success"
          });
          setTimeout(function() { window.location.href = `${userRole}.html`; }, 1500);
    } else {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Usuario ou Senha Invalido",
          });
    }
});