from fastapi import FastAPI
from pydantic import BaseModel
import joblib

from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

app = FastAPI()

# Servir carpeta ADD (frontend)
app.mount("/ADD", StaticFiles(directory="ADD"), name="ADD")

@app.get("/")
def home():
    return FileResponse("ADD/index.html")

# Cargar modelo
model = joblib.load("modelo_biodegradacion.pkl")

# Input correcto (coincide con dataset_final y tu modelo ML)
class InputData(BaseModel):
    temperatura: float
    humedad: float
    metano: float
    peso: float
    movimiento: float
    tiempo_horas: float   # IMPORTANTE para la degradación

@app.post("/predict")
def predict(data: InputData):

    entrada = [[
        data.temperatura,
        data.humedad,
        data.metano,
        data.peso,
        data.movimiento,
        data.tiempo_horas
    ]]

    pred = model.predict(entrada)[0]
    return {"nivel_degradacion": float(pred)}
