const URL_API = "https://biodegradacion-api.onrender.com/predict";

// Variables globales reales
let tempActual = 20;
let humActual = 50;
let metanoActual = 200;
let pesoActual = 30;
let distActual = 0;
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
                Distancia: distActual
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

const maxPuntos = 20;

let graficaTemp = new Chart(document.getElementById("graf_temp"), {
    type: "line",
    data: {
        labels: [],
        datasets: [{
            label: "Temperatura (°C)",
            data: [],
            borderColor: "rgba(30,60,150,0.9)",
            borderWidth: 2
        }]
    }
});

function actualizarGraficas() {
    const t = new Date().toLocaleTimeString().slice(0, 5);

    graficaTemp.data.labels.push(t);
    graficaTemp.data.datasets[0].data.push(tempActual);

    if (graficaTemp.data.labels.length > maxPuntos) {
        graficaTemp.data.labels.shift();
        graficaTemp.data.datasets[0].data.shift();
    }

    graficaTemp.update();
}

setInterval(() => {
    obtenerDatosReales();   // lee ESP32 → Adafruit → API ML
    actualizarGraficas();   // actualiza grafica con datos reales
}, 3000);

