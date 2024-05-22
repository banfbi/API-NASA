/*=======================================================
Copyright (c) 2024. Alejandro Alberto Jiménez Brundin
=======================================================*/
let apiKey = "ck7OdzlDG22BBDcQFirPqN7MSc9H7CMi7NdwpUto";
let apiUrl = "https://api.nasa.gov/";

  // Esta función es para hacer una llamada a la API de la NASA y mostrar los resultados de ella
  async function fetchData(endpoint, queryParams = {}) {
    let url = new URL(apiUrl + endpoint);
    url.searchParams.set("api_key", apiKey);
    for (let key in queryParams) {
      url.searchParams.append(key, queryParams[key]);
    }

    try {
      let response = await fetch(url);
      return await response.json();
    } catch (error) {
      console.error("Error al obtener datos: ", error);
      return null;
    }
  }

  function displayResultado(resultado) {
    let resultadoDiv = document.getElementById("resultado");
    resultadoDiv.innerHTML = "";
    if (resultado.media_type === "image") {
      let img = document.createElement("img");
      img.src = resultado.url;
      resultadoDiv.appendChild(img);
    } else {
      resultadoDiv.textContent = resultado.explanation;
    }
  }

  document.getElementById("botonImagenDia").addEventListener("click", async function() {
      let data = await fetchData("planetary/apod");
      if (data) {
        displayResultado(data);
      }
    });

  document.getElementById("botonRobot").addEventListener("click", async function() {
      this.disabled = true;

      let data = await fetchData("mars-photos/api/v1/rovers/curiosity/photos", {
        sol: 1000,
        camera: "FHAZ",
        page: 1
      });
      if (data && data.photos.length > 0) {
        let resultadoDiv = document.getElementById("resultado");
        resultadoDiv.innerHTML = "";

        let img = document.createElement("img");
        img.src = data.photos[0].img_src;
        resultadoDiv.appendChild(img);
      }
      this.disabled = false;
    });

    document.getElementById("botonTierra").addEventListener("click", function() {
        let recogerDatos = document.getElementById("recogerDatos");
        recogerDatos.style.display = "inline";
    });
    
    document.getElementById("recogerDatos").addEventListener("change", async function() {
        let fechaSeleccionada = this.value;
        try {
            let datosImagen = await fetchDatosImagen(fechaSeleccionada);
            displayImagen(datosImagen);
        } catch (error) {
            console.error("Error al obtener la imagen:", error);
        }
        this.style.display = "none";
    });
    
    async function fetchDatosImagen(fechaSeleccionada) {
        let response = await fetch(`https://epic.gsfc.nasa.gov/api/enhanced/date/${fechaSeleccionada}`);
        let data = await response.json();
        if (data && data.length > 0) {
            let datosImagen = data[0];
            let imageDate = datosImagen.date.split(' ')[0];
            return { date: imageDate, image: datosImagen.image };
        } else {
            throw new Error("No se encontraron imágenes para la fecha seleccionada.");
        }
    }
    
    function displayImagen(datosImagen) {
        let contenedorImagen = document.getElementById("resultado");
        let { date, image } = datosImagen;
        let urlImagen = `https://epic.gsfc.nasa.gov/archive/enhanced/${date.substring(0, 4)}/${date.substring(5, 7)}/${date.substring(8, 10)}/thumbs/${image}.jpg`;
        contenedorImagen.innerHTML = `<img src="${urlImagen}">`;
    }
/*=======================================================
Copyright (c) 2024. Alejandro Alberto Jiménez Brundin
=======================================================*/
