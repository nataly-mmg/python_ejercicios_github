
 const alertPlaceholder = document.getElementById('liveAlertPlaceholder')
 const appendAlert = (message, type) => {
   const wrapper = document.createElement('div')
   wrapper.innerHTML = [
     `<div class="mt-4 alert alert-${type} alert-dismissible fade show"  role="alert">`,
     `   <div>${message}</div>`,
     '   <button id="cerrar-alert" type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
    '</div>'
  ].join('')

   alertPlaceholder.append(wrapper)
 }




// Para Login

const alertTrigger = document.getElementById('liveAlertBtn')


alertTrigger.addEventListener('click', (e) => {
  e.preventDefault()

  const email = document.getElementById("email").value
  const password = document.getElementById("inputPassword").value

  if (email === "admin@correo.cl" && password === "1234") {
    alert("Inicio de sesión exitoso")
    window.location.href = "menu.html"
  } else {
    alert("Correo o contraseña incorrectos")
  }
})



