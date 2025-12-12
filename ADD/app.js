const URL_API = "https://biodegradacion-api.onrender.com/predict";

// Valores iniciales (placeholder)
let tempActual = 20;
let humActual = 95;
let metanoActual = 700;
let pesoActual = 14;
let distActual = 0;

let degradacionActual = 0;

// --- ACTUALIZAR TARJETAS ---
function actualizarCards() {
    document.getElementById("temp_val").textContent = tempActual.toFixed(2) + " °C";
    document.getElementById("hum_val").textContent = humActual.toFixed(1) + " %";
    document.getElementById("metano_val").textContent = metanoActual.toFixed(1) + " ppm";
    document.getElementById("peso_val").textContent = pesoActual.toFixed(1) + " g";
    document.getElementById("dist_val").textContent = distActual ? "Detectado" : "No detectado";

    document.getElementById("degradacion_val").textContent =
        degradacionActual.toFixed(2) + " %";
}

// --- PETICIÓN AL MODELO ---
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
        console.error("Error al obtener predicción:", e);
    }
}

// --- GRÁFICAS ---
const maxPuntos = 20;

let graficaTemp = new Chart(document.getElementById("graf_temp"), {
    type: "line",
    data: {
        labels: [],
        datasets: [{
            label: "Temperatura (°C)",
            data: [],
            borderColor: "rgba(50, 100, 200, 1)",
            borderWidth: 2
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false
    }
});

let graficaHum = new Chart(document.getElementById("graf_hum"), {
    type: "line",
    data: {
        labels: [],
        datasets: [{
            label: "Humedad (%)",
            data: [],
            borderColor: "rgba(0, 150, 150, 1)",
            borderWidth: 2
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false
    }
});

let graficaPeso = new Chart(document.getElementById("graf_peso"), {
    type: "line",
    data: {
        labels: [],
        datasets: [{
            label: "Peso (g)",
            data: [],
            borderColor: "rgba(200, 100, 50, 1)",
            borderWidth: 2
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false
    }
});

let graficaMetano = new Chart(document.getElementById("graf_metano"), {
    type: "line",
    data: {
        labels: [],
        datasets: [{
            label: "Metano (ppm)",
            data: [],
            borderColor: "rgba(150, 0, 150, 1)",
            borderWidth: 2
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false
    }
});

// --- ACTUALIZAR GRÁFICAS ---
function actualizarGraficas() {
    const t = new Date().toLocaleTimeString().slice(0, 5);

    function pushData(chart, value) {
        chart.data.labels.push(t);
        chart.data.datasets[0].data.push(value);

        if (chart.data.labels.length > maxPuntos) {
            chart.data.labels.shift();
            chart.data.datasets[0].data.shift();
        }

        chart.update();
    }

    pushData(graficaTemp, tempActual);
    pushData(graficaHum, humActual);
    pushData(graficaPeso, pesoActual);
    pushData(graficaMetano, metanoActual);
}

// --- LOOP CADA 3 SEGUNDOS ---
setInterval(() => {
    obtenerDatosReales();   // hace predicción
    actualizarGraficas();   // refresca las gráficas
}, 3000);

// Inicializar tarjetas
actualizarCards();
