import { useEffect, useState } from "react";
import ExcursionCard from "../components/ExcursionCard";
import "./Favorites.css";
import api from "../services/api";
import { getAuth } from "../services/auth";

export default function Favorites() {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const auth = getAuth();

  const loadFavorites = async () => {
    if (!auth) {
      setFavorites([]);
      setLoading(false);
      return;
    }

    try {
      setErr(null);
      setLoading(true);
      const res = await api.get(`/users/${auth.user_id}/favorites`);
      setFavorites((res.data ?? []).map((f: any) => f.excursion));
    } catch (e: any) {
      setErr(e?.response?.data?.detail ?? "Nu am putut încărca favoritele");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  const removeFavorite = async (excursionId: number) => {
    if (!auth) return;

    try {
      await api.delete(`/users/${auth.user_id}/favorites/${excursionId}`);
      setFavorites((prev) => prev.filter((e) => e.id !== excursionId));
    } catch (e: any) {
      alert(e?.response?.data?.detail ?? "Nu am putut elimina din favorite");
    }
  };

  if (!auth) {
    return (
      <div className="fav-page">
        <h1 className="fav-title">Favorite</h1>
        <div className="fav-empty">
          Trebuie să fii logat ca să vezi excursiile favorite.
        </div>
      </div>
    );
  }

  return (
    <div className="fav-page">
      <h1 className="fav-title">Excursiile tale favorite</h1>

      {loading && <div className="fav-empty">Se încarcă...</div>}
      {err && <div className="fav-empty">{err}</div>}

      {!loading && !err && favorites.length === 0 && (
        <div className="fav-empty">
          Nu ai excursii favorite momentan.
        </div>
      )}

      <div className="fav-grid">
        {favorites.map((exc) => (
          <div key={exc.id} className="fav-card-wrap">
            <ExcursionCard excursion={exc} />
            <button
              className="fav-remove"
              onClick={() => removeFavorite(exc.id)}
            >
              Elimină din favorite
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
