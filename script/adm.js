document.getElementById("acessarCaixaButton").addEventListener("click", function() {
    window.location.href = "caixa.html";
});

document.getElementById("acessarGarcomButton").addEventListener("click", function() {
    window.location.href = "garcom.html";
});

document.getElementById("acessarCozinhaButton").addEventListener("click", function() {
    window.location.href = "cozinha.html";
});

function sair() {
    window.location.href = "index.html";
}
;


document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault(); 


    const loginUsuario = document.getElementById('nome').value;
    const senhaUsuario = document.getElementById('senha').value;
    const tipoUsuario = document.getElementById('tipo').value;

    
    fetch('...', {  
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({login: loginUsuario, senha: senhaUsuario, tipo: tipoUsuario}),
    })
    .then(response => response.json()) 
    .then(data => {
        console.log('Sucesso:', data);
        Swal.fire({
            icon: 'success',
            title: 'Cadastro realizado com sucesso!',
            showConfirmButton: false,
            timer: 1500
        });
    })
    .catch(error => {
        console.error('Erro:', error);
        Swal.fire({
            icon: 'error',
            title: 'Erro ao realizar o cadastro!',
            text: 'Ocorreu um erro, tente novamente.',
            confirmButtonText: 'Fechar'
        });
    });
});
