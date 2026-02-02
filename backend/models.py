from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, UniqueConstraint, Date, DateTime
from datetime import datetime
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String(50), nullable=True)
    last_name = Column(String(50), nullable=True)
    email = Column(String(255), nullable=False, unique=True, index=True)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(20), nullable=False, default="user")  # user/admin

    favorites = relationship("Favorite", back_populates="user", cascade="all, delete-orphan")


class Excursion(Base):
    __tablename__ = "excursions"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    price = Column(Float, nullable=False)
    duration = Column(Float, nullable=False)
    guide = Column(Boolean, default=False)
    description = Column(String(2000))
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    rating = Column(Float, nullable=False, default=4.5)
    reviews_count = Column(Integer, nullable=False, default=0)
    favorites = relationship("Favorite", back_populates="excursion", cascade="all, delete-orphan")
    recommended = Column(Boolean, default=False)

class Favorite(Base):
    __tablename__ = "favorites"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    excursion_id = Column(Integer, ForeignKey("excursions.id", ondelete="CASCADE"), nullable=False)

    user = relationship("User", back_populates="favorites")
    excursion = relationship("Excursion", back_populates="favorites")

    __table_args__ = (
        UniqueConstraint("user_id", "excursion_id", name="uq_user_excursion"),
    )

class Reservation(Base):
    __tablename__ = "reservations"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    excursion_id = Column(Integer, ForeignKey("excursions.id", ondelete="CASCADE"), nullable=False)

    date = Column(Date, nullable=False)
    persons = Column(Integer, nullable=False, default=1)
    status = Column(String(20), nullable=False, default="pending")
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)

    user = relationship("User")
    excursion = relationship("Excursion")
