import { Link } from "react-router-dom";
import { Clock, Star, UserCheck, UserX, Heart, BadgeEuro } from "lucide-react";
import { useState } from "react";
import api from "../services/api";
import { getAuth } from "../services/auth";
import { Excursion } from "../types/Excursion";
import "./ExcursionCard.css";

export default function ExcursionCard({ excursion }: { excursion: Excursion }) {
  const [favLoading, setFavLoading] = useState(false);

  const isRecommended = !!excursion.recommended;

  const addToFavorites = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const auth = getAuth();
    if (!auth) return alert("Trebuie să fii logat ca să adaugi la favorite.");

    if (favLoading) return;
    setFavLoading(true);

    try {
      await api.post(`/users/${auth.user_id}/favorites/${excursion.id}`);
      alert("Adăugat la favorite!");
    } catch (err: any) {
      alert(err?.response?.data?.detail ?? "Nu am putut adăuga la favorite.");
    } finally {
      setFavLoading(false);
    }
  };

  return (
    <Link to={`/excursion/${excursion.id}`} className="exc-card">
      <div className="exc-topbar">
        <div className="exc-price">
          <BadgeEuro />
          <span>{excursion.price} Euro</span>
        </div>

        <div className="exc-actions">
          <button
            type="button"
            className="exc-fav-btn"
            onClick={addToFavorites}
            aria-label="Adaugă la favorite"
            disabled={favLoading}
          >
            <Heart />
          </button>
        </div>
      </div>

      <div className="exc-body">
        {isRecommended && <span className="exc-badge">Recomandat</span>}

        <h3 className="exc-title">{excursion.name}</h3>

        <div className="exc-meta">
          <span className="exc-pill">
            <Clock /> {excursion.duration} h
          </span>

          <span className="exc-pill">
            {excursion.guide ? <UserCheck /> : <UserX />}
            {excursion.guide ? "Cu ghid" : "Fără ghid"}
          </span>
        </div>

        {typeof excursion.rating === "number" && (
          <div className="exc-rating">
            <Star />
            <span className="exc-rating-val">
              {excursion.rating.toFixed(1)}
            </span>
            {typeof excursion.reviews_count === "number" && (
              <span className="exc-reviews">
                ({excursion.reviews_count})
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
