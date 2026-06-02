const API_KEY = "Tu_API_KEY_AQUI"; // Reemplaza con tu propia API key de OpenWeatherMap
const URL_BASE = `https://api.openweathermap.org/data/2.5/weather?appid=${API_KEY}&units=metric&lang=es`;

const inputCiudad = document.getElementById("inputCiudad");
const btnBuscar = document.getElementById("btnBuscar");
const btnUbicacion = document.getElementById("btnUbicacion");
const tarjeta = document.getElementById("tarjeta");
const climaDiv = document.getElementById("clima");
const errorP = document.getElementById("error");
const ciudadSpan = document.getElementById("ciudad");
const paisSpan = document.getElementById("pais");
const iconoClima = document.getElementById("iconoClima");
const tempSpan = document.getElementById("temp");
const descripcionP = document.getElementById("descripcion");
const humedadSpan = document.getElementById("humedad");
const vientoSpan = document.getElementById("viento");
const visibilidadSpan = document.getElementById("visibilidad");

async function obtenerClimaPorCiudad(ciudad) {
  try {
    mostrarCargando();
    const response = await fetch(`${URL_BASE}&q=${encodeURIComponent(ciudad)}`);
    if (!response.ok) throw new Error("Ciudad no encontrada");
    const datos = await response.json();
    mostrarClima(datos);
    inputCiudad.value = "";
  } catch (error) {
    mostrarError();
  }
}

async function obtenerClimaPorUbicacion(lat, lon) {
  try {
    mostrarCargando();
    const response = await fetch(`${URL_BASE}&lat=${lat}&lon=${lon}`);
    if (!response.ok)
      throw new Error("No se pudo obtener el clima por ubicación");
    const datos = await response.json();
    mostrarClima(datos);
  } catch (error) {
    mostrarError();
  }
}

function mostrarClima(datos) {
  errorP.classList.add("oculto");
  ciudadSpan.textContent = datos.name;
  paisSpan.textContent = datos.sys?.country || "";
  tempSpan.textContent = Math.round(datos.main.temp);
  descripcionP.textContent = datos.weather[0].description;
  iconoClima.src = `https://openweathermap.org/img/wn/${datos.weather[0].icon}@2x.png`;
  iconoClima.alt = datos.weather[0].description || "Icono clima";
  humedadSpan.textContent = `${datos.main.humidity}%`;
  vientoSpan.textContent = `${Math.round(datos.wind.speed * 3.6)} km/h`;
  visibilidadSpan.textContent = `${(datos.visibility / 1000).toFixed(1)} km`;
  climaDiv.classList.remove("oculto");
  cambiarFondo(datos);
}

function cambiarFondo(datos) {
  const condicion = datos.weather[0].main;
  const icono = datos.weather[0].icon;
  const esNoche = icono.endsWith("n");

  tarjeta.classList.remove("soleado", "nublado", "lluvia", "noche", "nieve");

  if (esNoche) {
    tarjeta.classList.add("noche");
    return;
  }

  if (condicion === "Clear") {
    tarjeta.classList.add("soleado");
  } else if (condicion === "Clouds") {
    tarjeta.classList.add("nublado");
  } else if (condicion === "Rain" || condicion === "Drizzle") {
    tarjeta.classList.add("lluvia");
  } else if (condicion === "Snow") {
    tarjeta.classList.add("nieve");
  } else {
    tarjeta.classList.add("nublado");
  }
}

function mostrarCargando() {
  errorP.classList.add("oculto");
  climaDiv.classList.add("oculto");
}

function mostrarError() {
  climaDiv.classList.add("oculto");
  errorP.classList.remove("oculto");
}

function detectarUbicacion() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        obtenerClimaPorUbicacion(lat, lon);
      },
      () => {
        mostrarError();
      },
    );
  } else {
    mostrarError();
  }
}

btnBuscar.addEventListener("click", () => {
  const ciudad = inputCiudad.value.trim();
  if (ciudad) obtenerClimaPorCiudad(ciudad);
});

inputCiudad.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const ciudad = inputCiudad.value.trim();
    if (ciudad) {
      obtenerClimaPorCiudad(ciudad);
    }
  }
});

btnUbicacion.addEventListener("click", detectarUbicacion);

document.addEventListener("DOMContentLoaded", () => {
  
   detectarUbicacion();
});
