from fastapi import FastAPI
from pydantic import BaseModel
import joblib
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os
import requests

app = FastAPI()

# Servir carpeta ADD
app.mount("/ADD", StaticFiles(directory="ADD"), name="ADD")

# Servir index.html en raíz
@app.get("/")
def home():
    return FileResponse("ADD/index.html")

# Cargar modelo ML
model = joblib.load("modelo_biodegradacion.pkl")

class InputData(BaseModel):
    Temperatura: float
    Humedad: float
    Metano: float
    Peso: float
    Distancia: float

@app.post("/predict")
def predict(data: InputData):

    entrada = [[
        data.temperatura,
        data.humedad,
        data.metano,
        data.peso,
        data.movimiento
    ]]

    pred = model.predict(entrada)[0]

    return {"nivel_degradacion": float(pred)}

# CONSULTA A ADAFRUIT IO
AIO_USER = os.getenv("AIO_USER")
AIO_KEY = os.getenv("AIO_KEY")

BASE_URL = f"https://io.adafruit.com/api/v2/{AIO_USER}/feeds"

def leer_feed(feed):
    r = requests.get(f"{BASE_URL}/{feed}/data/last",
                     headers={"X-AIO-Key": AIO_KEY})

    if r.status_code != 200:
        return None

    return float(r.json()["value"])


@app.get("/adafruit")
def get_adafruit_data():

    temperatura = leer_feed("temperatura")
    humedad = leer_feed("humedad")
    metano = leer_feed("metano")
    peso = leer_feed("peso")
    movimiento = leer_feed("movimiento")

    return {
        "temperatura": temperatura,
        "humedad": humedad,
        "metano": metano,
        "peso": peso,
        "movimiento": movimiento
    }