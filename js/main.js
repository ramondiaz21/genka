$(function () {
  $(".navbar-nav .nav-item").hover(
    function () {
      $(".navbar-nav").css("background-color", "#ADD46A;");
    },
    function () {
      // on mouseout, reset the background colour
      $(".navbar-nav").css("background-color", "white");
    }
  );
});

// var button = document.querySelector(".btn-link");
// var chevron = document.querySelector(".chevron");

// button.addEventListener("click", function () {
//   chevron.classList.toggle("chevron--flip");
// });

$(".btn-link").click(function () {
  $(".chevron").toggleClass("chevron--flip");
});

function sumarValor() {
  var valorInicial = 10000;
  var hoy = new Date();
  var meses = hoy.getMonth();
  var sumaMensual = 7;
  var total = valorInicial;

  for (var i = 1; i <= meses; i++) {
    total += sumaMensual;
  }

  //$("#empresas").text(total);
  $("#empresas").countTo({
    from: 0, // Valor inicial del contador
    to: total, // Valor final del contador
    speed: 5000, // Duración de la animación en milisegundos
    refreshInterval: 100, // Frecuencia de actualización del número durante la animación
  });
}

function sumarEnvios() {
  var valorInicial = 1000000;
  var hoy = new Date();
  var day = hoy.getDay();
  var sumaDiaria = 89;
  var total = valorInicial;

  for (var i = 1; i <= day; i++) {
    total += sumaDiaria;
  }

  //$("#envios").text(total);
  $("#envios").countTo({
    from: 0, // Valor inicial del contador
    to: total, // Valor final del contador
    speed: 5000, // Duración de la animación en milisegundos
    refreshInterval: 100, // Frecuencia de actualización del número durante la animación
  });
}

$(document).ready(function () {
  // Variable para saber si los números ya han sido animados
  var numerosAnimados = false;

  // Detectar cuando se ha desplazado hasta la sección
  $(window).scroll(function () {
    var scrollTop = $(window).scrollTop();
    var sectionOffset = $("#counter").offset().top;
    var sectionHeight = $("#counter").height();
    var windowHeight = $(window).height();

    // Si se ha desplazado hasta la sección y los números aún no han sido animados, animar los números
    if (
      scrollTop > sectionOffset - windowHeight &&
      scrollTop < sectionOffset + sectionHeight &&
      !numerosAnimados
    ) {
      sumarEnvios();
      sumarValor();
      numerosAnimados = true; // Actualizar la variable para indicar que los números ya han sido animados
    }
  });
});


// Definición de función asíncrona para obtener datos de la API
async function getDataFromAPI(numerosGuia) {
  const url = "https://my-json-server.typicode.com/ramondiaz21/genka-api/guias";
  const response = await fetch(url);
  const allData = await response.json();

  return numerosGuia.map(numeroGuia => allData.find(data => data.numeroGuia === numeroGuia));
}

// Definición de función para mostrar los datos de rastreo en la página
function showTrackingData(guiaData) {
  const guiaShowDiv = document.getElementById("guia-show");
  guiaShowDiv.innerHTML = ""; // limpiando cualquier dato anterior

  guiaData.forEach(data => {
    const guiaNumber = document.createElement("h5");
    guiaNumber.textContent = `Número de guía: ${data.numeroGuia}`;
    const movementsTitle = document.createElement("h5");
    const divider = document.createElement("hr");
    const movements = document.createElement("ul");

    movementsTitle.textContent = `Movimientos: `;

    data.movimientos.forEach(movimiento => {
      const movementItem = document.createElement("li");
      movementItem.textContent = `Fecha: ${movimiento.fechaMovimiento} - Status: ${movimiento.situacion} - Ubicación: ${movimiento.localizacion}`;
      movements.appendChild(movementItem);
    });

    guiaShowDiv.appendChild(guiaNumber);
    guiaShowDiv.appendChild(movementsTitle);
    guiaShowDiv.appendChild(movements);
    guiaShowDiv.appendChild(divider);
  });
}

// Definición de función para manejar el evento de click del botón
function handleButtonClick() {
  const textarea = document.getElementById("trackTextArea");
  const trackButton = document.getElementById("trackButton");

  trackButton.addEventListener("click", async function() {
    const numerosGuia = textarea.value.split(",").map(num => num.trim());

    if (numerosGuia.length > 25) {
      alert("Solo puedes introducir hasta 25 números de guía.");
      return;
    }

    const guiaData = await getDataFromAPI(numerosGuia);
    showTrackingData(guiaData);
  });
}

// Ejecutando la función al cargar la página
window.onload = handleButtonClick;
