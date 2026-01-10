
// FORMATO DE DINERO
function formatoDinero(valor) {
    return "$" + Number(valor).toLocaleString("es-CL");
}

// MENSAJES EN PANTALLA
function mostrarOk(texto) {
    const ok = document.getElementById("mensajeOk");
    const err = document.getElementById("mensajeError");
    err.classList.add("d-none");
    ok.textContent = texto;
    ok.classList.remove("d-none");
}

function ocultarMensajes() {
    document.getElementById("mensajeOk").classList.add("d-none");
    document.getElementById("mensajeError").classList.add("d-none");
    document.getElementById("mensajeOk").textContent = "";
    document.getElementById("mensajeError").textContent = "";
}

// ESTADO 
let saldo = 60000;
let movimientos = [];

const saldoNav = document.getElementById("saldoNav");
const listaMov = document.getElementById("listaMovimientos");

function agregarMovimiento(texto) {
    const sinMov = document.getElementById("sinMovimientos");
    if (sinMov) sinMov.remove();

    const li = document.createElement("li");
    li.className = "list-group-item";
    li.textContent = texto;

    // Insertar al inicio 
    listaMov.insertBefore(li, listaMov.firstChild);
}

function renderSaldo() {
    saldoNav.textContent = formatoDinero(saldo);
}

renderSaldo();

// MODAL
const modalDeposito = new bootstrap.Modal(document.getElementById("modalDeposito"));
const modalTransferencia = new bootstrap.Modal(document.getElementById("modalTransferencia"));

// ABRIR MODAL DEPÓSITO
document.getElementById("btnAbrirDeposito").addEventListener("click", () => {
    ocultarMensajes();
    document.getElementById("montoDeposito").value = "";
    document.getElementById("errorDeposito").textContent = "";
    modalDeposito.show();
});

// ABRIR MODAL TRANSFERENCIA
document.getElementById("btnAbrirTransferencia").addEventListener("click", () => {
    ocultarMensajes();
    document.getElementById("destinoTransferencia").value = "";
    document.getElementById("montoTransferencia").value = "";
    document.getElementById("errorTransferencia").textContent = "";
    modalTransferencia.show();
});

// CONFIRMAR DEPÓSITO
document.getElementById("btnConfirmarDeposito").addEventListener("click", () => {
    const input = document.getElementById("montoDeposito");
    const err = document.getElementById("errorDeposito");
    err.textContent = "";

    const monto = parseInt(input.value);

    if (isNaN(monto) || monto <= 0) {
        err.textContent = "Ingresa un monto válido.";
        return;
    }

    saldo += monto;
    renderSaldo();
    agregarMovimiento("Depósito - " + formatoDinero(monto));

    modalDeposito.hide();
    mostrarOk("Depósito realizado");

    setTimeout(() => {
        ocultarMensajes();
    }, 1000); // 1 segundo
});

// CONFIRMAR TRANSFERENCIA
document.getElementById("btnConfirmarTransferencia").addEventListener("click", () => {
    const destino = document.getElementById("destinoTransferencia").value.trim();
    const inputMonto = document.getElementById("montoTransferencia");
    const err = document.getElementById("errorTransferencia");
    err.textContent = "";

    const monto = parseInt(inputMonto.value);

    if (!destino) {
        err.textContent = "Ingresa el nombre del destinatario.";
        return;
    }
    if (isNaN(monto) || monto <= 0) {
        err.textContent = "Ingresa un monto válido.";
        return;
    }
    if (monto > saldo) {
        err.textContent = "Saldo insuficiente.";
        return;
    }

    saldo -= monto;
    renderSaldo();
    agregarMovimiento("Transferencia a " + destino + " - " + formatoDinero(monto));

    modalTransferencia.hide();
    mostrarOk("Transferencia enviada ");
    setTimeout(() => {
        ocultarMensajes();
    }, 1000); // 1 segundo
});


