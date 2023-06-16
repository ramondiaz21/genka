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
  const url = "https://my-json-server.typicode.com/ramondiaz21/genka-api2/guias";
  const response = await fetch(url);
  const allData = await response.json();

  return numerosGuia.map(numeroGuia => allData.find(data => data.numeroGuia === numeroGuia));
}

moment.locale('es');

// Definición de función para mostrar los datos de rastreo en la página
function showTrackingData(guiaData) {
  const guiaShowDiv = document.getElementById("guia-show");
  guiaShowDiv.innerHTML = ""; // limpiando cualquier dato anterior

  guiaData.forEach(data => {
    const resultWrapper = document.createElement("div");
    resultWrapper.classList.add("rastreo-resultado-wrapper");

    const guiaNumber = document.createElement("h5");
    guiaNumber.textContent = `Número de guía: ${data.numeroGuia}`;

    data.movimientos.forEach(movimiento => {
      const statusWrapper = document.createElement("div");
      statusWrapper.classList.add("status-wrapper");

      const situationImage = document.createElement("img");
      const situationText = document.createElement("h5");
      switch (movimiento.situacion) {
        case 'ORIGEN':
          situationImage.src = 'https://www.genka.mx/wp-content/uploads/2023/06/origen.jpg';
          break;
        case 'TRANSITO':
          situationImage.src = 'https://www.genka.mx/wp-content/uploads/2023/06/transito.jpg';
          break;
        case 'DESTINO':
          situationImage.src = 'https://www.genka.mx/wp-content/uploads/2023/06/destino.jpg';
          break;
        default:
          situationImage.src = ''; // Default src si ninguna de las situaciones coincide
      }
      situationImage.alt = movimiento.situacion; // Alt text para la imagen
      situationText.textContent = movimiento.situacion;

      statusWrapper.appendChild(situationText);
      statusWrapper.appendChild(situationImage);

      const infoWrapper = document.createElement("div");
      infoWrapper.classList.add("info-wrapper");

      const dateText = document.createElement("p");
      const dateMoment = moment(movimiento.fechaMovimiento, 'YYYY/MM/DD HH:mm');
      dateText.textContent = dateMoment.format('DD-MMMM-YYYY'); // Formato fecha


      const timeLocationText = document.createElement("p");
      timeLocationText.textContent = `${dateMoment.format('HH:mm')} - ${movimiento.localizacion}`; // Formato hora y ubicación

      infoWrapper.appendChild(dateText);
      infoWrapper.appendChild(situationText);
      infoWrapper.appendChild(timeLocationText);

      resultWrapper.appendChild(statusWrapper);
      resultWrapper.appendChild(infoWrapper);

      guiaShowDiv.appendChild(guiaNumber);
      guiaShowDiv.appendChild(resultWrapper);
    });

    const divider = document.createElement("hr");
    guiaShowDiv.appendChild(divider);
  });
}



// Definición de función para manejar el evento de click del botón
function handleButtonClick() {
  const textarea = document.getElementById("trackTextArea");
  const trackButton = document.getElementById("trackButton");

  trackButton.addEventListener("click", async function () {
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