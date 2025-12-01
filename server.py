from fastapi import FastAPI
from pydantic import BaseModel
import joblib

model = joblib.load("modelo_biodegradacion.pkl")

app = FastAPI()

class InputData(BaseModel):
    Temperatura: float
    Humedad: float
    Metano: float
    Peso: float
    Distancia: float

@app.get("/")
def root():
    return {"status": "API funcionando correctamente"}

@app.post("/predict")
def predict(data: InputData):
    entrada = [[
        data.Temperatura,
        data.Humedad,
        data.Metano,
        data.Peso,
        data.Distancia
    ]]
    pred = model.predict(entrada)[0]
    return {"nivel_degradacion": float(pred)}
