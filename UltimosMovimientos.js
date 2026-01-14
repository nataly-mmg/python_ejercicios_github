
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

movimientos = [
    {
        tipo: "deposito",
        texto: "Depósito - $50.000"
    },
    {
        tipo: "transferencia_recibida",
        texto: "Transferencia recibida de Erica - $15.000"
    },
    {
        tipo: "compra",
        texto: "Compra en supermercado - $12.000"
    }
];

const saldoNav = document.getElementById("saldoNav");
const listaMov = document.getElementById("listaMovimientos");



// +++++


// function agregarMovimiento(texto) {
//     const sinMov = document.getElementById("sinMovimientos");
//     if (sinMov) sinMov.remove();

//     const li = document.createElement("li");
//     li.className = "list-group-item";
//     li.textContent = texto;

//     // Insertar al inicio 
//     listaMov.insertBefore(li, listaMov.firstChild);
// }

// +++++


function renderSaldo() {
    saldoNav.textContent = formatoDinero(saldo);
}

renderSaldo();


  // NUEVO: traducir tipo a texto
  function getTipoTransaccion(tipo) {
    switch (tipo) {
      case "deposito": return "Depósito";
      case "transferencia_recibida": return "Transferencia recibida";
      case "compra": return "Compra";
      default: return "Movimiento";
    }
  }

  // NUEVO: mostrar últimos movimientos según filtro
  function mostrarUltimosMovimientos(filtro) {
    // limpiar lista
    $("#listaMovimientos").empty();

    // filtrar
    let filtrados = movimientos;

    if (filtro && filtro !== "todos") {
      filtrados = movimientos.filter(m => m.tipo === filtro);
    }

    // si no hay movimientos para mostrar
    if (filtrados.length === 0) {
      $("#listaMovimientos").append(`
        <li class="list-group-item text-center text-secondary" id="sinMovimientos">
          Aún no tienes movimientos aquí
        </li>
      `);
      return;
    }

    // mostrar (ya están guardados en orden: últimos primero)
    filtrados.forEach(m => {
      $("#listaMovimientos").append(`
        <li class="list-group-item">
          <strong>${getTipoTransaccion(m.tipo)}:</strong> ${m.texto}
        </li>
      `);
    });
  }

  // NUEVO: guardar movimiento con tipo
  function agregarMovimiento(tipo, texto) {
    // insertar al inicio (últimos primero)
    movimientos.unshift({ tipo, texto });

    // render según filtro actual seleccionado
    const filtroActual = $("#filtroMovimientos").val() || "todos";
    mostrarUltimosMovimientos(filtroActual);
  }

  // Render inicial (sin movimientos)
  mostrarUltimosMovimientos("todos");




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

// Confirmar modalTransferencia

  $("#btnConfirmarTransferencia").on("click", function () {
    const destino = $("#destinoTransferencia").val().trim();
    const monto = parseInt($("#montoTransferencia").val());
    $("#errorTransferencia").text("");

    if (!destino) {
      $("#errorTransferencia").text("Ingresa el nombre del destinatario.");
      return;
    }
    if (isNaN(monto) || monto <= 0) {
      $("#errorTransferencia").text("Ingresa un monto válido.");
      return;
    }
    if (monto > saldo) {
      $("#errorTransferencia").text("Saldo insuficiente.");
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


// Filtro de movimientos

  $("#filtroMovimientos").on("change", function () {
    const filtro = $(this).val();
    mostrarUltimosMovimientos(filtro);
  });


