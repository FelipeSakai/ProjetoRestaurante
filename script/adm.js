// Mostrar ou esconder a tela de cadastro de usuário
document.getElementById("cadastrarUsuarioButton").addEventListener("click", function() {
    document.getElementById("mainOptions").style.display = "none";
    document.getElementById("cadastroUsuario").style.display = "block";
    document.getElementById("usuariosCadastrados").style.display = "none";
});

// Mostrar a lista de usuários cadastrados
document.getElementById("listarUsuariosButton").addEventListener("click", function() {
    document.getElementById("mainOptions").style.display = "none";
    document.getElementById("cadastroUsuario").style.display = "none";
    document.getElementById("usuariosCadastrados").style.display = "block";
    
    // Fazer a requisição GET para buscar os usuários cadastrados
    fetch('http://localhost:3333/users')  // Ajuste o URL conforme seu backend
        .then(response => response.json())
        .then(data => {
            const usuariosList = document.getElementById("usuariosList");
            usuariosList.innerHTML = '';  // Limpar a lista antes de preencher
            data.forEach(usuario => {
                const li = document.createElement("li");
                li.textContent = `Nome: ${usuario.login} - Tipo: ${usuario.tipo}`;
                usuariosList.appendChild(li);
            });
        })
        .catch(error => {
            Swal.fire({
                icon: 'error',
                title: 'Erro ao carregar usuários',
                text: 'Ocorreu um erro ao carregar os usuários, tente novamente.',
                confirmButtonText: 'Fechar'
            });
        });
});

// Lidar com o cadastro de usuário
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const loginUsuario = document.getElementById('login').value;
    const senhaUsuario = document.getElementById('senha').value;
    const tipoUsuario = document.getElementById('tipo').value;

    // Enviar os dados do formulário para o backend
    fetch('http://localhost:3333/user', {  // Ajuste o URL conforme seu backend
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            login: loginUsuario,
            senha: senhaUsuario,
            tipo: tipoUsuario
        }),
    })
    .then(response => response.json())
    .then(data => {
        Swal.fire({
            icon: 'success',
            title: 'Cadastro realizado com sucesso!',
            showConfirmButton: false,
            timer: 1500
        });

        // Resetando o formulário e mostrando novamente os botões
        document.getElementById('loginForm').reset();
        document.getElementById("cadastroUsuario").style.display = "none";
        document.getElementById("mainOptions").style.display = "block";
    })
    .catch(error => {
        Swal.fire({
            icon: 'error',
            title: 'Erro ao cadastrar usuário!',
            text: 'Ocorreu um erro, tente novamente.',
            confirmButtonText: 'Fechar'
        });
    });
});

// Função de sair
function sair() {
    window.location.href = "index.html";
}
