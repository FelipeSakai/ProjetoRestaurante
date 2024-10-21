document.getElementById("sairButton").addEventListener("click", function () {
    window.location.href = "index.html";
});

document.getElementById("cadastrarUsuarioProduto").addEventListener("click", function() {
    window.location.href = "cadastrar.html"; 
});

document.getElementById("cadastrarMesa").addEventListener("click", async function () {
    const { value: mesaNome } = await Swal.fire({
        title: "Cadastre a mesa",
        input: "text",
        inputLabel: "Número da mesa",
        showCancelButton: true,
        inputValidator: (value) => {
            if (!value) {
                return "Digite algo!";
            }
        }
    });

    if (mesaNome) {
        Swal.fire(`Você Cadastrou a Mesa ${mesaNome}`);

        const divMesa = document.createElement("div");
        divMesa.classList.add("mesa-item");

        const mesaTitulo = document.createElement("h3");
        mesaTitulo.textContent = `Mesa ${mesaNome}`;

        const mesaInfo = document.createElement("div");
        mesaInfo.classList.add("mesa-info");
        mesaInfo.textContent = `Informações da Mesa ${mesaNome}`;
        mesaInfo.style.display = "none";

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Excluir Mesa";
        deleteButton.classList.add("delete-button");
        deleteButton.addEventListener("click", async function (event) {
            event.stopPropagation();
            const { isConfirmed } = await Swal.fire({
                title: `Tem certeza que deseja excluir a Mesa ${mesaNome}?`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Sim, excluir!",
                cancelButtonText: "Cancelar",
            });
            if (isConfirmed) {
                divMesa.remove();
                Swal.fire("Excluída!", `Mesa ${mesaNome} foi excluída.`, "success");
            }
        });

        divMesa.appendChild(mesaTitulo);
        divMesa.appendChild(mesaInfo);
        divMesa.appendChild(deleteButton);


        divMesa.addEventListener("click", function () {
            mesaInfo.style.display = mesaInfo.style.display === "none" ? "block" : "none";
        });

        document.getElementById("mesaList").appendChild(divMesa);
    }
});
