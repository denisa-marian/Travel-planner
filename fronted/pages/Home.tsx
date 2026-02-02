import { useEffect, useMemo, useState } from "react";
import MapView from "../components/MapView";
import ExcursionCard from "../components/ExcursionCard";
import FilterPanel, { Filters } from "../components/FilterPanel";
import api from "../services/api";
import { Excursion } from "../types/Excursion";

export default function Home() {
  const [city, setCity] = useState<string | null>(null);
  const [coords, setCoords] = useState<[number, number] | null>(null);

  const [all, setAll] = useState<Excursion[]>([]);
  const [filters, setFilters] = useState<Filters>({
    search: "",
    maxPrice: 1000,
    guideOnly: null,
    sort: "recommended",
  });

  useEffect(() => {
    const load = async () => {
      const res = await api.get("/excursions");
      setAll(res.data);
    };
    load();
  }, []);

  const visible = useMemo(() => {
    let list = [...all];

    if (coords) {
      list = list.filter((exc) => {
        return (
          Math.abs(exc.latitude - coords[0]) < 0.5 &&
          Math.abs(exc.longitude - coords[1]) < 0.5
        );
      });
    }

    if (filters.search.trim()) {
      const s = filters.search.toLowerCase();
      list = list.filter((e) => e.name.toLowerCase().includes(s));
    }

    list = list.filter((e) => e.price <= filters.maxPrice);

    if (filters.guideOnly !== null) {
      list = list.filter((e) => e.guide === filters.guideOnly);
    }

    if (filters.sort === "recommended") {
      list.sort((a, b) => (b.rating - a.rating) || (b.reviews_count - a.reviews_count));
    } else if (filters.sort === "rating_desc") {
      list.sort((a, b) => b.rating - a.rating);
    } else if (filters.sort === "price_asc") {
      list.sort((a, b) => a.price - b.price);
    } else if (filters.sort === "price_desc") {
      list.sort((a, b) => b.price - a.price);
    }

    return list;
  }, [all, coords, filters]);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Planificator de călătorii</h1>

      <FilterPanel value={filters} onChange={setFilters} />

      <MapView
        onCitySelect={(cityName, locationCoords) => {
          setCity(cityName);
          setCoords(locationCoords);
        }}
      />

      <h2 style={{ marginTop: 25 }}>
        {city ? (
          <>
            Excursii disponibile în <span style={{ color: "#4e75a1" }}>{city}</span>
          </>
        ) : (
          "Recomandate"
        )}
      </h2>

      <div className="exc-grid" style={{ marginTop: 15 }}>
        {visible.length === 0 ? (
          <p><i>Nu am găsit excursii.</i></p>
        ) : (
          visible.map((exc) => <ExcursionCard key={exc.id} excursion={exc} />)
        )}
      </div>
    </div>
  );
}
