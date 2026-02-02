from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from passlib.context import CryptContext
import models, schemas
from database import SessionLocal, engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def require_admin(user_id: int, db: Session):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user or user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin only")

@app.get("/")
def root():
    return {"message": "Travel Planner API running"}

@app.get("/excursions", response_model=list[schemas.Excursion])
def list_excursions(db: Session = Depends(get_db)):
    return (
        db.query(models.Excursion)
        .order_by(
            models.Excursion.recommended.desc(),
            models.Excursion.rating.desc()
        )
        .all()
    )

@app.get("/excursions/{excursion_id}", response_model=schemas.Excursion)
def get_excursion(excursion_id: int, db: Session = Depends(get_db)):
    exc = db.query(models.Excursion).filter(models.Excursion.id == excursion_id).first()
    if not exc:
        raise HTTPException(status_code=404, detail="Excursion not found")
    return exc

@app.post("/excursions", response_model=schemas.Excursion)
def create_excursion(
    payload: schemas.ExcursionCreate,
    db: Session = Depends(get_db)
):
    exc = models.Excursion(**payload.model_dump())
    db.add(exc)
    db.commit()
    db.refresh(exc)
    return exc


@app.put("/excursions/{excursion_id}", response_model=schemas.Excursion)
def update_excursion(
    excursion_id: int,
    payload: schemas.ExcursionUpdate,
    db: Session = Depends(get_db)
):
    exc = db.query(models.Excursion).filter(models.Excursion.id == excursion_id).first()
    if not exc:
        raise HTTPException(status_code=404, detail="Excursie inexistentă")

    for k, v in payload.model_dump().items():
        setattr(exc, k, v)

    db.commit()
    db.refresh(exc)
    return exc


@app.delete("/excursions/{excursion_id}")
def delete_excursion(
    excursion_id: int,
    db: Session = Depends(get_db)
):
    exc = db.query(models.Excursion).filter(models.Excursion.id == excursion_id).first()
    if not exc:
        raise HTTPException(status_code=404, detail="Excursie inexistentă")

    db.query(models.Favorite).filter(
        models.Favorite.excursion_id == excursion_id
    ).delete()

    db.query(models.Reservation).filter(
        models.Reservation.excursion_id == excursion_id
    ).delete()

    db.delete(exc)
    db.commit()

    return {"ok": True}


@app.post("/auth/register")
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    existing = db.query(models.User).filter(models.User.email == user.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email deja folosit")

    password_hash = pwd_context.hash(user.password)

    new_user = models.User(
        first_name=user.first_name,
        last_name=user.last_name,
        email=user.email,
        password_hash=password_hash,
        role="user",
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "created", "user_id": new_user.id}

@app.post("/auth/login", response_model=schemas.LoginOut)
def login(data: schemas.LoginIn, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == data.email).first()
    if not user or not pwd_context.verify(data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"user_id": user.id, "role": user.role}

@app.get("/users/{user_id}/favorites", response_model=List[schemas.FavoriteOut])
def list_favorites(user_id: int, db: Session = Depends(get_db)):
    return (
        db.query(models.Favorite)
        .filter(models.Favorite.user_id == user_id)
        .all()
    )

@app.post("/users/{user_id}/favorites/{excursion_id}")
def add_favorite(user_id: int, excursion_id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    exc = db.query(models.Excursion).filter(models.Excursion.id == excursion_id).first()
    if not exc:
        raise HTTPException(status_code=404, detail="Excursion not found")

    exists = (
        db.query(models.Favorite)
        .filter(
            models.Favorite.user_id == user_id,
            models.Favorite.excursion_id == excursion_id
        )
        .first()
    )
    if exists:
        return {"message": "Already in favorites"}

    fav = models.Favorite(user_id=user_id, excursion_id=excursion_id)
    db.add(fav)
    db.commit()
    return {"message": "Added to favorites"}

@app.delete("/users/{user_id}/favorites/{excursion_id}")
def remove_favorite(user_id: int, excursion_id: int, db: Session = Depends(get_db)):
    fav = (
        db.query(models.Favorite)
        .filter(
            models.Favorite.user_id == user_id,
            models.Favorite.excursion_id == excursion_id
        )
        .first()
    )
    if not fav:
        raise HTTPException(status_code=404, detail="Favorite not found")

    db.delete(fav)
    db.commit()
    return {"message": "Removed from favorites"}

@app.post("/reservations", response_model=schemas.ReservationOut)
def create_reservation(payload: schemas.ReservationCreate, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == payload.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    exc = db.query(models.Excursion).filter(models.Excursion.id == payload.excursion_id).first()
    if not exc:
        raise HTTPException(status_code=404, detail="Excursion not found")

    if payload.persons < 1:
        raise HTTPException(status_code=400, detail="Persons must be >= 1")

    r = models.Reservation(
        user_id=payload.user_id,
        excursion_id=payload.excursion_id,
        date=payload.date,
        persons=payload.persons,
        status="pending",
    )
    db.add(r)
    db.commit()
    db.refresh(r)
    return r

@app.get("/users/{user_id}/reservations", response_model=List[schemas.ReservationOut])
def list_reservations(user_id: int, db: Session = Depends(get_db)):
    return (
        db.query(models.Reservation)
        .filter(models.Reservation.user_id == user_id)
        .order_by(models.Reservation.created_at.desc())
        .all()
    )

@app.patch("/excursions/{excursion_id}/recommended", response_model=schemas.Excursion)
def toggle_recommended(excursion_id: int, db: Session = Depends(get_db)):
    exc = db.query(models.Excursion).filter(models.Excursion.id == excursion_id).first()
    if not exc:
        raise HTTPException(status_code=404, detail="Excursie inexistentă")

    exc.recommended = not exc.recommended
    db.commit()
    db.refresh(exc)
    return exc

