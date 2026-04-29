# Install requirements.txt before start
python -m pip install -r requirements.txt

# Run project using UV
python -m uvicorn main:app --reload

# OpenAPI Docs
http://127.0.0.1:8000/docs

# API Endpoints Docs
http://127.0.0.1:8000


# telegram message api
https://api.telegram.org/bot8553406095:AAGa8N04Lyxtw0X3VsiYfWUl4jAXr-uRcFQ/setWebhook?url=https://brainy-pediatric-ruthann.ngrok-free.dev/telegram/webhook

# telegram port start
ngrok http 8000