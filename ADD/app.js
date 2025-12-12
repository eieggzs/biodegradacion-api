// URL de la API en Render
const API_BASE = "https://biodegradacion-api.onrender.com";

// Actualización cada 20 segundos
const INTERVALO_MS = 20000;

// Variables globales
let tempActual = 0;
let humActual = 0;
let metanoActual = 0;
let pesoActual = 0;
let distActual = 0;
let degradacionActual = 0;

// ------------------------------
// 1. Obtener datos desde el backend (Adafruit)
// ------------------------------
async function obtenerSensores() {
    try {
        const res = await fetch(`${API_BASE}/adafruit`);
        return await res.json();
    } catch (e) {
        console.error("Error obteniendo sensores:", e);
        return null;
    }
}

// ------------------------------
// 2. Obtener predicción con ML
// ------------------------------
async function obtenerPrediccion() {
    try {
        const res = await fetch(`${API_BASE}/predict`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                // ⚠ Deben coincidir EXACTAMENTE con el modelo del backend
                Temperatura: tempActual,
                Humedad: humActual,
                Metano: metanoActual,
                Peso: pesoActual,
                Distancia: distActual
            })
        });

        const data = await res.json();

        if (data.nivel_degradacion !== undefined) {
            degradacionActual = data.nivel_degradacion;
        } else {
            console.warn("Predicción inválida:", data);
        }

    } catch (e) {
        console.error("Error obteniendo predicción:", e);
    }
}

// ------------------------------
// 3. Actualizar tarjetas
// ------------------------------
function actualizarCards() {
    document.getElementById("temp_val").textContent = tempActual.toFixed(2) + " °C";
    document.getElementById("hum_val").textContent = humActual.toFixed(2) + " %";
    document.getElementById("metano_val").textContent = metanoActual.toFixed(2) + " ppm";
    document.getElementById("peso_val").textContent = pesoActual.toFixed(2) + " g";
    document.getElementById("dist_val").textContent = distActual ? "Detectado" : "No detectado";
    document.getElementById("degradacion_val").textContent = degradacionActual.toFixed(8) + " %";
}

// ------------------------------
// 4. Gráficas
// ------------------------------
const maxPuntos = 20;

function crearGrafica(ctx, label) {
    return new Chart(ctx, {
        type: "line",
        data: {
            labels: [],
            datasets: [{
                label: label,
                data: [],
                borderColor: "rgba(0,0,0,0.7)",
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

let graficaTemp = crearGrafica(document.getElementById("graf_temp"), "Temperatura (°C)");
let graficaHum = crearGrafica(document.getElementById("graf_hum"), "Humedad (%)");
let graficaPeso = crearGrafica(document.getElementById("graf_peso"), "Peso (g)");
let graficaMetano = crearGrafica(document.getElementById("graf_metano"), "Metano (ppm)");

function actualizarGraficas() {
    const hora = new Date().toLocaleTimeString().slice(0, 5);

    function push(chart, valor) {
        chart.data.labels.push(hora);
        chart.data.datasets[0].data.push(valor);

        if (chart.data.labels.length > maxPuntos) {
            chart.data.labels.shift();
            chart.data.datasets[0].data.shift();
        }

        chart.update();
    }

    push(graficaTemp, tempActual);
    push(graficaHum, humActual);
    push(graficaPeso, pesoActual);
    push(graficaMetano, metanoActual);
}

// ------------------------------
// 5. Ciclo principal
// ------------------------------
async function actualizar() {
    const sensores = await obtenerSensores();

    if (!sensores) {
        console.warn("Sensores no disponibles, usando últimos valores");
    } else {
        tempActual = sensores.temperatura ?? tempActual;
        humActual = sensores.humedad ?? humActual;
        metanoActual = sensores.metano ?? metanoActual;
        pesoActual = sensores.peso ?? pesoActual;
        distActual = sensores.movimiento ?? distActual;
    }

    await obtenerPrediccion();

    actualizarCards();
    actualizarGraficas();
}

// Primera carga
actualizar();

// Cada 20s
setInterval(actualizar, INTERVALO_MS);
