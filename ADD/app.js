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
                temperatura: tempActual,
                humedad: humActual,
                metano: metanoActual,
                peso: pesoActual,
                movimiento: distActual,
                tiempo_horas: obtenerHoras()
            })
        });

        const data = await r.json();

        degradacionActual = data.nivel_degradacion;

        actualizarCards();
    } catch (e) {
        console.error("Error al obtener datos reales:", e);
    }
}
