import os
import openai
from fastapi import FastAPI  # importa fastApi
from decouple import config # importa el funcionamiento de variable entorno
from fastapi.middleware.cors import CORSMiddleware #importa permisos de conexion con el front

app = FastAPI()  # Inicia el servidor de la app


# Da permiso al front para conectarse con el Back y sus configuraciones:
app.add_middleware( 
    CORSMiddleware,
    allow_origins=["*"],  # O reemplaza "*" con la lista de orígenes permitidos.
    allow_methods=["*"],  # O reemplaza "*" con la lista de métodos permitidos (por ejemplo, ["GET", "POST"]).
    allow_headers=["*"],  # O reemplaza "*" con la lista de encabezados permitidos.
    allow_credentials=True,  # Habilita la inclusión de credenciales (cookies, encabezados de autorización, etc.).
    expose_headers=["*"],  # O reemplaza "*" con la lista de encabezados expuestos.
)

@app.get("/")
def root():  # Inicializa todo
    return {"service": "integracion Back OpenIA"}

@app.post("/chat")
def chat(pregunta: dict):

    openai.api_key = config("OPENAI_KEY")  # La llave de conexion con el modelo por medio de variable de entorno
   
    # Crear la configuracion del modelo:
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {
                "role": "user",
                "content": pregunta["pregunta"]
            }
        ],
        temperature=1,
        max_tokens=256,
        top_p=1,
        frequency_penalty=0,
        presence_penalty=0,
    )

    print(response["choices"][0]["message"]["content"])
    return {"respuesta": response["choices"][0]["message"]["content"]} # retorna la respuesta de la pregunta
