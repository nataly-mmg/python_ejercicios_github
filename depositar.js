  
  // mostrar el saldoactual (Local Storage + jquery)

$(function () {
  let saldo = parseInt(localStorage.getItem("saldo")) || 60000;
  localStorage.setItem("saldo", saldo);
  $('#saldoNav').text('$' + saldo);



});





  const btnDeposito = document.getElementById("btnDeposito");
  const inputMonto = document.getElementById("depositAmount");
  const saldoNav = document.getElementById("saldoNav");

  let saldo = 60000; 

  btnDeposito.addEventListener("click", (e) => {
    e.preventDefault();

    const monto = parseInt(inputMonto.value);

    if (isNaN(monto) || monto <= 0) {
      alert("Ingresa un monto válido");
      return;
    }

    // saldo = saldo + monto;
    // saldoNav.textContent = "$" + saldo;

    inputMonto.value = "";
  });