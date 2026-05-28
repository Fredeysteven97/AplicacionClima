const API_KEY = 'your_api_key_here';
const URL_BASE = `https://api.openweathermap.org/data/2.5/weather?appid=${API_KEY}&units=metric&lang=es`;

const inputCiudad = document.getElementById('InputCiudad');
const btnBuscar = document.getElementById('BtnBuscar');
const btnUbicacion = document.getElementById('BtnUbicacion');
const tarjeta = document.getElementById('Tarjeta');
const climaDiv = document.getElementById('Clima');
const errorP = document.getElementById('Error');
const cuidadSpan = document.getElementById('Ciudad');
const iconoClima = document.getElementById('IconoClima');
const tempSpan = document.getElementById('Temp');
const descripcionP = document.getElementById('Descripcion');
const humedadSpan = document.getElementById('Humedad');
const vientoSpan = document.getElementById('Viento');
const visibilidadSpan = document.getElementById('Visibilidad');

async function obtenerClimaPorCuidad(ciudad) {
    try {
      mostarCargando();
      const response = await fetch(`${URL_BASE}&q=${ciudad}`);
      if (!response.ok) throw new Error('Ciudad no encontrada');
      const datos = await response.json();
      mostrarClima(datos)
    } catch (error) {
      mostrarError();
    }
}

function mostrarClima(datos) {
    errorP.classList.add('oculto');
    cuidadSpan.textContent = datos.name;
    paisSpan.textContent = datos.sys.country;
    tempSpan.textContent = Math.round(datos.main.temp);
    descripcionP.textContent = datos.weather[0].description;
    icononClima.src = `https://openweathermap.org/img/wn/${datos.weather[0].icon}@"2x.png`;
    humedadSpan.textContent = `Humedad: ${datos.main.humidity}%`;
    vientoSpan.textContent= `{math.round(datos.wind.speed * 3.6)} km/h`;
    visibilidadSpan.textContent =| `${(datos.visibility / 1000).toFixed(1)} km`;
    climaDiv.classList.remove('oculto');
    
    cambiarFondo(datos);
}

function cambiarFondo(datos) {
    const condicion = datos.weather[0].main;
    const icono = datos.weather[0].icon;
    const esNoche = icono.endsWith('n');

    tarjeta.classList.remove('soleado', 'nublado', 'lluvioso', 'noche', 'nieve');

    if(esNoche){
        tarjeta.classList.add('noche'); 
        return;
    }

    if (condicion === 'Clear') {
        tarjeta.classList.add('soleado');
    } else if (condicion === 'Clouds') {
        tarjeta.classList.add('nublado');
    } else if (condicion === 'Rain' || condicion === 'Drizzle') {
        tarjeta.classList.add('lluvioso');
    } else if (condicion === 'Snow') {
        tarjeta.classList.add('nieve');
    } else {
        tarjeta.classList.add('nublado');
    }
}

function mostrarCargando() {
    errorP.classList.add('oculto');
    climaDiv.classList.add('oculto');
}

function mostrarError() {
    climaDiv.classList.add('oculto');
    errorP.classList.remove('oculto');
}

function detectarUbicacion() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            try {
                mostarCargando();
                const response = await fetch(`${URL_BASE}&lat=${latitude}&lon=${longitude}`);
                if (!response.ok) throw new Error('Ubicación no encontrada');
                const datos = await response.json();
                mostrarClima(datos);
            } catch (error) {
                mostrarError();
            }
        }, () => {
            mostrarError();
        });
    } else {
        mostrarError();
    }
}