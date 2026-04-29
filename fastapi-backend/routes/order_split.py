# routes/split_order.py

from fastapi import APIRouter

router = APIRouter(
    prefix="/split",
    tags=["Split Order"]
)

@router.post("/")
def split_order(data: dict):
    print("Received split data:", data)
    return {"status": "ok", "data": data}
