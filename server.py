from fastapi import FastAPI
from pydantic import BaseModel
import joblib
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

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

