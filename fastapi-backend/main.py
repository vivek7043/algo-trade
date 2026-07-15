import os
from fastapi import FastAPI
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from database.mongodb import MongoDB
from routes.user_routes import router as user_router
from routes.kotak_routes import router as kotak_router
from routes.auth_routes import router as auth_router
from routes.telegram import router as telegram_router
from routes.order_split import router as split_order
from routes.configration import router as config_router
from routes.telegram import router as telegram_router, set_webhook
from routes.admin_routes import router as admin_router



load_dotenv()

app = FastAPI()

app.state.kotak_client = None

# Get CORS origin from environment
frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[frontend_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    MongoDB.connect()

@app.on_event("shutdown")
async def shutdown_event():
    MongoDB.close()

# Routes List
app.include_router(auth_router)
app.include_router(kotak_router)
app.include_router(user_router)
app.include_router(telegram_router)

@app.on_event("startup")
async def startup_event():
    set_webhook()

@app.get("/")
def root():
    return {"status": "OK"}

app.include_router(split_order)

app.include_router(config_router)
app.include_router(admin_router)
