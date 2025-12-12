const URL_API = "https://biodegradacion-api.onrender.com/predict";

// Valores iniciales (los reales vendrán de Adafruit en el futuro)
let tempActual = 20;
let humActual = 95;
let metanoActual = 700;
let pesoActual = 14;
let distActual = 0;

// Esto debes calcularlo: horas transcurridas desde inicio del experimento.
// Por ahora podemos usar un timer interno:
let tiempoInicio = Date.now();

function obtenerHoras() {
    return (Date.now() - tiempoInicio) / 3600000;
}

let degradacionActual = 0;

async function obtenerDatosReales() {
    try {

        const r = await fetch(URL_API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                Temperatura: tempActual,
                Humedad: humActual,
                Metano: metanoActual,
                Peso: pesoActual,
                Movimiento: distActual,
                Tiempo_horas: obtenerHoras()
            })
        });

        const data = await r.json();

        degradacionActual = data.nivel_degradacion;

        actualizarCards();
    } catch (e) {
        console.error("Error al obtener datos reales:", e);
    }
}

function actualizarCards() {
    document.getElementById("temp_val").textContent = tempActual.toFixed(2) + " °C";
    document.getElementById("hum_val").textContent = humActual.toFixed(1) + " %";
    document.getElementById("metano_val").textContent = metanoActual.toFixed(1) + " ppm";
    document.getElementById("peso_val").textContent = pesoActual.toFixed(1) + " g";
    document.getElementById("dist_val").textContent = distActual ? "Detectado" : "No detectado";

    document.getElementById("degradacion_val").textContent =
        degradacionActual.toFixed(2) + " %";
}
