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

//1000000002
//1000000001 
//const url = "https://www.genka.mx/main.php";

async function getDataFromAPI(numerosGuia) {
  const url = "https://www.genka.mx/main.php";

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      numeroGuia: numerosGuia
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
  }

  let responseText = await response.text();
  let allData = JSON.parse(responseText);

  // Verificamos si allData es una matriz y, si no, la convertimos en una
  if (!Array.isArray(allData)) {
    allData = [allData];
  }

  // Convertimos cada cadena JSON en un objeto JSON
  allData = allData.map(dataItem => JSON.parse(dataItem));

  return allData;
}

moment.locale('es');

function showTrackingData(guiaData) {
  console.log("showTrackingData called with", guiaData);

  const guiaShowDiv = document.getElementById("guia-show");
  guiaShowDiv.innerHTML = "";

  guiaData.forEach((dataArray, arrayIndex) => {
    dataArray.forEach((data, dataIndex) => {
      // Comprueba si los datos son válidos
      if (!data || !data.movimientos) {
        console.warn('Invalid data encountered', data);
        return;
      }

      const resultWrapper = document.createElement("div");
      resultWrapper.classList.add("rastreo-resultado-wrapper");

      const guiaNumber = document.createElement("h5");
      guiaNumber.textContent = `Número de guía: ${data.numeroGuia}`;

      guiaShowDiv.appendChild(guiaNumber);
      guiaShowDiv.appendChild(resultWrapper);

      data.movimientos.forEach(movimiento => {
        const statusInfoWrapper = document.createElement("div");
        statusInfoWrapper.classList.add("status-info-wrapper");

        const statusWrapper = document.createElement("div");
        statusWrapper.classList.add("status-wrapper");

        const situationImage = document.createElement("img");
        const situationText = document.createElement("h5");
        switch (movimiento.situacion) {
          case 'EMBARCADO':
            situationImage.src = 'https://www.genka.mx/wp-content/uploads/2023/06/origen.jpg';
            break;
          case 'NO ENTREGADO':
            situationImage.src = 'https://www.genka.mx/wp-content/uploads/2023/06/origen.jpg';
            break;
          case 'PREDOCUMENTADO':
            situationImage.src = 'https://www.genka.mx/wp-content/uploads/2023/06/transito.jpg';
            break;
          case 'DOCUMENTADO':
            situationImage.src = 'https://www.genka.mx/wp-content/uploads/2023/06/transito.jpg';
            break;
          case 'ENTREGADO':
            situationImage.src = 'https://www.genka.mx/wp-content/uploads/2023/06/destino.jpg';
            break;
          default:
            situationImage.src = '';
        }
        situationImage.alt = movimiento.situacion;
        situationText.textContent = movimiento.situacion;

        statusWrapper.appendChild(situationText);
        statusWrapper.appendChild(situationImage);
        statusInfoWrapper.appendChild(statusWrapper);

        const infoWrapper = document.createElement("div");
        infoWrapper.classList.add("info-wrapper");

        const dateText = document.createElement("p");
        const dateMoment = moment(movimiento.fechaMovimiento, 'YYYY/MM/DD HH:mm');
        dateText.textContent = dateMoment.format('DD-MMMM-YYYY');

        const timeLocationText = document.createElement("p");
        timeLocationText.textContent = `${dateMoment.format('HH:mm')} - ${movimiento.localizacion}`;

        infoWrapper.appendChild(dateText);
        infoWrapper.appendChild(situationText);
        infoWrapper.appendChild(timeLocationText);

        statusInfoWrapper.appendChild(infoWrapper);
        resultWrapper.appendChild(statusInfoWrapper);
      });

      // Solo agregamos un hr si no es el último elemento en el array
      if (arrayIndex < guiaData.length - 1 || dataIndex < dataArray.length - 1) {
        const divider = document.createElement("hr");
        guiaShowDiv.appendChild(divider);
      }
    });
  });
}


async function handleButtonClick() {
  console.log('handleButtonClick called');
  const textarea = document.getElementById("trackTextArea");
  const trackButton = document.getElementById("trackButton");

  trackButton.addEventListener("click", async function () {
    const numerosGuia = textarea.value.split(",").map(num => num.trim());

    if (numerosGuia.length > 25) {
      alert("Solo puedes introducir hasta 25 números de guía.");
      return;
    }

    const guiaDataPromises = numerosGuia.map(numeroGuia => getDataFromAPI(numeroGuia));

    const guiaData = await Promise.all(guiaDataPromises);

    showTrackingData(guiaData);
  });
}
window.onload = handleButtonClick;