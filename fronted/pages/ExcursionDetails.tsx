import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";
import { getAuth } from "../services/auth";
import "./ExcursionDetails.css";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { Icon, LatLngExpression } from "leaflet";
import ReservationModal from "../components/ReservationModal";
import {
  Clock,
  UserCheck,
  UserX,
  BadgeEuro,
  Heart,
  MapPin,
  Star,
  CalendarCheck,
} from "lucide-react";

export default function ExcursionDetails() {
  const { id } = useParams();
  const [excursion, setExcursion] = useState<any>(null);
  const [openReserve, setOpenReserve] = useState(false);

  useEffect(() => {
    const load = async () => {
      const res = await api.get(`/excursions/${id}`);
      setExcursion(res.data);
    };
    load();
  }, [id]);

  const addToFavorites = async () => {
    const auth = getAuth();
    if (!auth) return alert("Trebuie să fii logat");

    try {
      await api.post(`/users/${auth.user_id}/favorites/${excursion.id}`);
      alert("Adăugat la favorite!");
    } catch (e: any) {
      alert(e?.response?.data?.detail ?? "Eroare la adăugare favorite");
    }
  };

  const scrollToMap = () => {
    document.getElementById("details-map")?.scrollIntoView({ behavior: "smooth" });
  };

  const locationIcon = new Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/854/854866.png",
    iconSize: [28, 28],
  });

  if (!excursion) {
    return <p className="details-loading">Se încarcă detaliile excursiei...</p>;
  }

  const rating = typeof excursion.rating === "number" ? excursion.rating : null;
  const reviewsCount =
    typeof excursion.reviews_count === "number" ? excursion.reviews_count : null;

  return (
    <div className="details-container">
      <div className="details-card">
        <div className="details-hero">
          <div className="details-topbar">
            <div className="details-price-pill">
              <BadgeEuro />
              <span>{excursion.price} Euro</span>
            </div>

            <div className="details-top-actions">
              <button
                className="details-icon-btn"
                onClick={scrollToMap}
                title="Vezi pe hartă"
              >
                <MapPin />
              </button>
            </div>
          </div>
        </div>

        <div className="details-body">
          <h1 className="details-title">{excursion.name}</h1>

          <div className="details-chips">
            <span className="details-chip">
              <Clock /> {excursion.duration} h
            </span>

            <span className="details-chip">
              {excursion.guide ? <UserCheck /> : <UserX />}
              {excursion.guide ? "Cu ghid" : "Fără ghid"}
            </span>

            {rating !== null && (
              <span className="details-chip">
                <Star />
                {rating.toFixed(1)}
                {reviewsCount !== null ? ` (${reviewsCount})` : ""}
              </span>
            )}
          </div>

          <h2 className="details-h2">Despre excursie</h2>
          <p className="details-description">
            {excursion.description || "Nu există o descriere disponibilă."}
          </p>

          <h2 className="details-h2" id="details-map">
            Locația pe hartă
          </h2>

          <div className="details-map-wrap">
            <MapContainer
              center={[excursion.latitude, excursion.longitude] as LatLngExpression}
              zoom={14}
              className="details-map"
            >
              <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png" />
              <Marker
                position={[excursion.latitude, excursion.longitude] as LatLngExpression}
                icon={locationIcon}
              />
            </MapContainer>
          </div>

          <h2 className="details-h2">Excursii similare</h2>

          {excursion.similar && excursion.similar.length > 0 ? (
            <div className="related-grid">
              {excursion.similar.slice(0, 6).map((ex: any) => (
                <Link
                  to={`/excursion/${ex.id}`}
                  key={ex.id}
                  className="related-card"
                >
                  <div className="related-top">
                    <span className="related-price">{ex.price} RON</span>
                  </div>

                  <h3 className="related-title">{ex.name}</h3>

                  <div className="related-meta">
                    <span>
                      <Clock /> {ex.duration} h
                    </span>
                    <span>{ex.guide ? "Cu ghid" : "Fără ghid"}</span>
                    <span>
                      <Star /> {ex.rating ?? "—"}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <span>🌍</span>
              <p>Nu există excursii similare momentan.</p>
            </div>
          )}

          <div className="details-buttons">
            <button
              className="details-btn details-btn-primary"
              onClick={() => setOpenReserve(true)}
            >
              <CalendarCheck />
              Rezervă acum
            </button>

            <button className="details-btn" onClick={addToFavorites}>
              <Heart />
              Favorite
            </button>
          </div>
        </div>
      </div>

      <ReservationModal
        open={openReserve}
        onClose={() => setOpenReserve(false)}
        excursion={excursion}
        onConfirm={async ({ date, persons }) => {
          const auth = getAuth();
          if (!auth) return alert("Trebuie să fii logat");

          try {
            await api.post("/reservations", {
              user_id: auth.user_id,
              excursion_id: excursion.id,
              date,
              persons,
            });
            setOpenReserve(false);
            alert("Rezervare creată!");
          } catch (e: any) {
            alert(e?.response?.data?.detail ?? "Eroare la rezervare");
          }
        }}
      />
    </div>
  );
}
