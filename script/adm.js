document.getElementById("cadastrarUsuarioButton").addEventListener("click", function() {
    document.getElementById("mainOptions").style.display = "none";
    document.getElementById("cadastroUsuario").style.display = "block";
    document.getElementById("usuariosCadastrados").style.display = "none";
});


document.getElementById("listarUsuariosButton").addEventListener("click", function() {
    document.getElementById("mainOptions").style.display = "none";
    document.getElementById("cadastroUsuario").style.display = "none";
    document.getElementById("usuariosCadastrados").style.display = "block";
    
    fetch('http://localhost:3333/user/list') 
        .then(response => response.json())
        .then(data => {
            const usuariosList = document.getElementById("usuariosList");
            usuariosList.innerHTML = ''; 
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


document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const loginUsuario = document.getElementById('login').value;
    const senhaUsuario = document.getElementById('senha').value;
    const tipoUsuario = document.getElementById('tipo').value;

    fetch('http://localhost:3333/user/user', { 
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

document.getElementById("cadastrarUsuarioButton").addEventListener("click", function() {
    document.getElementById("mainOptions").style.display = "none";
    document.getElementById("cadastroUsuario").style.display = "block";
    document.getElementById("cadastroGarcom").style.display = "none";
    document.getElementById("usuariosCadastrados").style.display = "none";
});

document.getElementById("cadastrarGarcomButton").addEventListener("click", function() {
    document.getElementById("mainOptions").style.display = "none";
    document.getElementById("cadastroUsuario").style.display = "none";
    document.getElementById("cadastroGarcom").style.display = "block";
    document.getElementById("usuariosCadastrados").style.display = "none";

    preencherSelectUsuarios();
});

document.getElementById("listarUsuariosButton").addEventListener("click", function() {
    document.getElementById("mainOptions").style.display = "none";
    document.getElementById("cadastroUsuario").style.display = "none";
    document.getElementById("cadastroGarcom").style.display = "none";
    document.getElementById("usuariosCadastrados").style.display = "block";

    fetch('http://localhost:3333/user/list')
        .then(response => response.json())
        .then(data => {
            const usuariosList = document.getElementById("usuariosList");
            usuariosList.innerHTML = '';
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
                text: 'Tente novamente.',
                confirmButtonText: 'Fechar'
            });
        });
});


document.querySelectorAll(".voltar-button").forEach(button => {
    button.addEventListener("click", function() {
        document.getElementById("mainOptions").style.display = "block";
        document.getElementById("cadastroUsuario").style.display = "none";
        document.getElementById("cadastroGarcom").style.display = "none";
        document.getElementById("usuariosCadastrados").style.display = "none";
    });
});


document.getElementById("garcomForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const nome = document.getElementById("nomeGarcom").value;
    const telefone = document.getElementById("telefoneGarcom").value;
    const id_user = document.getElementById("idUser").value;

    fetch('http://localhost:3333/user/list')
        .then(response => response.json())
        .then(data => {
            const idUserSelect = document.getElementById("idUser");
            idUserSelect.innerHTML = '<option value="">Selecione um usuário</option>';
            data.forEach(usuario => {
                const option = document.createElement("option");
                option.value = usuario.id;
                option.textContent = usuario.login;
                idUserSelect.appendChild(option);
            });
        })
        .catch(error => {
            Swal.fire({
                icon: 'error',
                title: 'Erro ao carregar usuários',
                text: 'Não foi possível carregar os usuários, tente novamente.',
                confirmButtonText: 'Fechar'
            });
        });
});

document.getElementById("garcomForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const nome = document.getElementById("nomeGarcom").value;
    const telefone = document.getElementById("telefoneGarcom").value;
    const id_user = document.getElementById("idUser").value;

    if (!id_user) {
        Swal.fire({
            icon: 'warning',
            title: 'Selecione um usuário!',
            confirmButtonText: 'Fechar'
        });
        return;
    }

    fetch('http://localhost:3333/garcom/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nome, telefone, id_user }),
    })
    .then(response => response.json())
    .then(data => {
        Swal.fire({
            icon: 'success',
            title: 'Garçom cadastrado com sucesso!',
            timer: 1500,
            showConfirmButton: false
        });
        document.getElementById("garcomForm").reset();
        document.getElementById("mainOptions").style.display = "block";
        document.getElementById("cadastroGarcom").style.display = "none";
    })
    .catch(error => {
        Swal.fire({
            icon: 'error',
            title: 'Erro ao cadastrar garçom!',
            text: 'Tente novamente.',
            confirmButtonText: 'Fechar'
        });
    });
});

function preencherSelectUsuarios() {
    fetch('http://localhost:3333/user/list')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao buscar usuários');
            }
            return response.json();
        })
        .then(data => {
            const idUserSelect = document.getElementById("idUser");
            idUserSelect.innerHTML = '<option value="">Selecione um usuário</option>';

            data.forEach(usuario => {
                const option = document.createElement("option");
                option.value = usuario.id_user; 
                option.textContent = usuario.login;
                idUserSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Erro ao carregar usuários:', error);
            Swal.fire({
                icon: 'error',
                title: 'Erro ao carregar usuários',
                text: 'Não foi possível carregar os usuários. Tente novamente.',
                confirmButtonText: 'Fechar'
            });
        });
}

document.addEventListener("DOMContentLoaded", function () {
    preencherSelectUsuarios();
});


function sair() {
    window.location.href = "index.html";
}
function sairCaixa() {
    window.location.href = "caixa.html";
}
function sairGarcom() {
    window.location.href = "garcom.html";
}
function sairCozinha() {
    window.location.href = "cozinha.html";
}
