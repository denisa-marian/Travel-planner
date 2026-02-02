from pydantic import BaseModel, EmailStr, ConfigDict
from datetime import date, datetime

class ExcursionBase(BaseModel):
    name: str
    price: float
    duration: float
    guide: bool
    latitude: float
    longitude: float
    description: str | None = None
    rating: float | None = None
    reviews_count: int | None = None
    recommended: bool | None = None

class ExcursionCreate(BaseModel):
    name: str
    price: float
    duration: float
    guide: bool
    latitude: float
    longitude: float
    description: str | None = None

class ExcursionUpdate(BaseModel):
    name: str
    price: float
    duration: float
    guide: bool
    latitude: float
    longitude: float
    description: str | None = None

class Excursion(ExcursionBase):
    id: int
    model_config = ConfigDict(from_attributes=True)


class UserCreate(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    password: str

class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    email: EmailStr
    role: str
    first_name: str
    last_name: str

class LoginIn(BaseModel):
    email: EmailStr
    password: str

class LoginOut(BaseModel):
    user_id: int
    role: str


class FavoriteOut(BaseModel):
    id: int
    user_id: int
    excursion: Excursion
    class Config:
        from_attributes = True

class ReservationCreate(BaseModel):
    user_id: int
    excursion_id: int
    date: date
    persons: int = 1

class ReservationOut(BaseModel):
    id: int
    user_id: int
    excursion_id: int
    date: date
    persons: int
    status: str
    created_at: datetime
    excursion: Excursion

    class Config:
        from_attributes = True
