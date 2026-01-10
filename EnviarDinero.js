$(function () {

  // Saldo en Local Storage
  let saldo = parseInt(localStorage.getItem("saldo")) || 60000;
  localStorage.setItem("saldo", saldo);

  const formatoDinero = (valor) => "$" + Number(valor).toLocaleString("es-CL");
  $("#saldoNav").text(formatoDinero(saldo));

  // Campos obligatorios
  function mostrarAlerta(mensaje, tipo) {
    $("#alert-container").html(`
      <div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
        ${mensaje}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
      </div>
    `);
  }

function mostrarAlertaContacto(mensaje, tipo) {
  $("#alert-contacto").html(`
    <div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
      ${mensaje}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>
  `);
}


  //   formato CBU
  function validarCBU(cbu) {
    return /^[0-9]{6,}$/.test(cbu);
  }

  //  Abrir modal para contacto + bootstrap lo oculta
  const modalContacto = new bootstrap.Modal(document.getElementById("modalContacto"));
  const modalMonto = new bootstrap.Modal(document.getElementById("modalMonto"));

  $("#btnNuevoContacto").on("click", function () {
    $("#alert-container").html("");
    $("#confirmacionEnvio").text("");
      $("#alert-contacto").html("");
    modalContacto.show();
  });

  // ✅ Limpieza garantizada al cerrar el modal (Guardar, Cancelar o X)
  $("#modalContacto").on("hidden.bs.modal", function () {
    $("#contactoNombre").val("");
    $("#contactoCBU").val("");
    $("#contactoAlias").val("");
    $("#contactoBanco").val("");
  });

  // Agrega contacto
  $("#btnGuardarContacto").on("click", function () {
    const nombre = $("#contactoNombre").val().trim();
    const cbu = $("#contactoCBU").val().trim();
    const alias = $("#contactoAlias").val().trim();
    const banco = $("#contactoBanco").val().trim();

    if (!nombre || !cbu || !alias || !banco) {
      mostrarAlertaContacto("Debes completar todos los datos del contacto.", "danger");
      return;
    }

    if (!validarCBU(cbu)) {
    mostrarAlertaContacto("El CBU debe contener solo números y tener al menos 6 dígitos.", "danger");

      return;
    }

    $("#ListaContactos").append(`
      <li class="list-group-item">
        <div class="contact-info">
          <span class="contact-name">${nombre}</span>
          <span class="contact-details">CBU: ${cbu}, Alias: ${alias}, Banco: ${banco}</span>
        </div>
      </li>
    `);

    // Limpiar campos
    $("#contactoNombre").val("");
    $("#contactoCBU").val("");
    $("#contactoAlias").val("");
    $("#contactoBanco").val("");

    mostrarAlerta("Contacto agregado correctamente.", "success");
    modalContacto.hide();
  });

  // agenda
  $("#buscarcontacto").on("input", function () {
    const termino = $(this).val().toLowerCase().trim();

    $("#ListaContactos li").each(function () {
      const nombre = $(this).find(".contact-name").text().toLowerCase();
      const detalles = $(this).find(".contact-details").text().toLowerCase();

      const coincide = nombre.includes(termino) || detalles.includes(termino);
      $(this).toggle(coincide);
    });
  });

  // boton enviar dinero
  let $contactoSeleccionado = null;

  $("#ListaContactos").on("click", "li", function () {
    // desmarcar anterior
    if ($contactoSeleccionado) {
      $contactoSeleccionado.removeClass("border border-primary");
    }

    // marcar actual
    $contactoSeleccionado = $(this);
    $contactoSeleccionado.addClass("border border-primary");

    // mostrar botón Enviar dinero
    $("#btnEnviarDinero").removeClass("d-none");
  });

  $("#btnEnviarDinero").on("click", function () {
    if (!$contactoSeleccionado) {
      mostrarAlerta("Olvidaste seleccionar un contacto.", "danger");
      return;
    }

    $("#montoEnviar").val("");
    $("#errorMonto").text("");
    $("#confirmacionEnvio").text("");
    $("#alert-container").html("");
    modalMonto.show();
  });

  $("#btnConfirmarEnvio").on("click", function () {
    const monto = parseInt($("#montoEnviar").val());
    $("#errorMonto").text("");

    if (isNaN(monto) || monto <= 0) {
      $("#errorMonto").text("Ingresa un monto válido.");
      return;
    }

    if (monto > saldo) {
      $("#errorMonto").text("Saldo insuficiente.");
      return;
    }

    const nombre = $contactoSeleccionado.find(".contact-name").text() || "contacto";

    // descontar y persistir saldo
    saldo -= monto;
    localStorage.setItem("saldo", saldo);
    $("#saldoNav").text(formatoDinero(saldo));

    modalMonto.hide();

    // mensaje de confirmación abajo
    $("#confirmacionEnvio").text(
      `Envío realizado con éxito a ${nombre} por ${formatoDinero(monto)}.`
    );

    // (opcional) 
    mostrarAlerta("Transferencia realizada con éxito.", "success");
  });

});
