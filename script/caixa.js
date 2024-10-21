document.getElementById("cadastrarMesa").addEventListener("click", async function () {
    const ipAPI = "//api.ipify.org?format=json";
    const response = await fetch(ipAPI);
    const data = await response.json();
    const inputValue = data.mesa;

    const { value: mesaNome } = await Swal.fire({
        title: "Cadastre a mesa",
        input: "text",
        inputLabel: "Número da mesa",
        inputValue,
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


        divMesa.addEventListener("click", function () {
            if (mesaInfo.style.display === "none") {
                mesaInfo.style.display = "block";
            } else {
                mesaInfo.style.display = "none";
            }
        });


        divMesa.appendChild(mesaTitulo);
        divMesa.appendChild(mesaInfo);


        document.getElementById("mesaList").appendChild(divMesa);
    }
});

document.getElementById("cadastrarUsuarioProduto").addEventListener("click", function () {
    window.location.href = "cadastrar.html";
});
