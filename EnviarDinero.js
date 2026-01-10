

$(function () {

// Saldo en Local Storage

let saldo = parseInt(localStorage.getItem("saldo")) || 60000;
  localStorage.setItem("saldo", saldo);

  const formatoDinero = (valor) => "$" + Number(valor).toLocaleString("es-CL");
  $("#saldoNav").text(formatoDinero(saldo));


//  Abrir modal para contacto + bootstrap lo oculta
  const modalContacto = new bootstrap.Modal(document.getElementById("modalContacto"));
  const modalMonto = new bootstrap.Modal(document.getElementById("modalMonto"));

  $("#btnNuevoContacto").on("click", function () {
    $("#alert-container").html("");
    $("#confirmacionEnvio").text("");
    modalContacto.show();

  });

  });





//  Guardar contacto (agregar a la lista)
const btnGuardarContacto = document.getElementById("btnGuardarContacto");
const lista = document.getElementById("ListaContactos");

btnGuardarContacto.addEventListener("click", () => {
    const nombre = document.getElementById("contactoNombre").value.trim();
    const cbu = document.getElementById("contactoCBU").value.trim();
    const alias = document.getElementById("contactoAlias").value.trim();
    const banco = document.getElementById("contactoBanco").value.trim();

    if (!nombre || !cbu || !alias || !banco) {
        alert("Debes completar todos los datos del contacto");
        return;
    }

    const li = document.createElement("li");
    li.className = "list-group-item";
    li.innerHTML = `

      <div class="contact-info">
        <span class="contact-name">${nombre}</span>
        <span class="contact-details">CBU: ${cbu}, Alias: ${alias}, Banco: ${banco}</span>
      </div>
    `;

    lista.appendChild(li);

    // limpiar campos
    document.getElementById("contactoNombre").value = "";
    document.getElementById("contactoCBU").value = "";
    document.getElementById("contactoAlias").value = "";
    document.getElementById("contactoBanco").value = "";

    modal.hide();
});

//  Seleccionar contacto (click en li)
let contactoSeleccionado = null;

lista.addEventListener("click", (e) => {
    const li = e.target.closest("li");
    if (!li) return;

    // desmarcar anterior
    if (contactoSeleccionado) {
        contactoSeleccionado.classList.remove("border", "border-primary");
    }

    contactoSeleccionado = li;
    contactoSeleccionado.classList.add("border", "border-primary");
});

// Enviar dinero (confirmación)
const btnEnviarDinero = document.getElementById("btnEnviarDinero");

btnEnviarDinero.addEventListener("click", () => {
    if (!contactoSeleccionado) {
        alert("Olvidaste seleccionar tu contacto");
        return;
    }

    document.getElementById("montoEnviar").value = "";
    document.getElementById("errorMonto").textContent = "";
    modalMonto.show();
});





const btnConfirmarEnvio = document.getElementById("btnConfirmarEnvio");

btnConfirmarEnvio.addEventListener("click", () => {
    const inputMonto = document.getElementById("montoEnviar");
    const errorMonto = document.getElementById("errorMonto");

    const monto = parseInt(inputMonto.value);

    // Validaciones
    if (isNaN(monto) || monto <= 0) {
        errorMonto.textContent = "Ingresa un monto válido.";
        return;
    }

    if (monto > saldo) {
        errorMonto.textContent = "Saldo insuficiente.";
        return;
    }

    // Obtener nombre del contacto seleccionado
    const nombre = contactoSeleccionado.querySelector(".contact-name")?.textContent || "contacto";

    // Descontar saldo (porque es ENVIAR dinero)
    saldo = saldo - monto;

    // Actualizar NAV con formato
    if (saldoNav) saldoNav.textContent = formatoDinero(saldo);

    // Cerrar modal
    modalMonto.hide();

    // Confirmación
    alert("Transferencia enviada a " + nombre + " por " + formatoDinero(monto));
});


