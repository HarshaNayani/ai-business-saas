from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import httpx

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

N8N_WEBHOOK_URL = "http://localhost:5678/webhook/ff08d4f8-072d-41e6-8c9b-fa5bdf902e6b"

@app.get("/")
def root():
    return {"status": "AI Business SaaS Running!"}

@app.post("/ask")
async def ask_question(query: str):
    async with httpx.AsyncClient() as client:
        response = await client.get(
            N8N_WEBHOOK_URL,
            params={"query": query},
            timeout=30.0
        )
    return {"answer": response.json()}