import { useEffect, useState } from "react";
import api from "../services/api";
import "./AdminPanel.css";

type Excursion = {
  id: number;
  name: string;
  price: number;
  duration: number;
  guide: boolean;
  recommended: boolean;
  latitude: number;
  longitude: number;
  description?: string | null;
};

export default function AdminPanel() {
  const [excursions, setExcursions] = useState<Excursion[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [form, setForm] = useState({
    name: "",
    price: 0,
    duration: 1,
    guide: false,
    latitude: 0,
    longitude: 0,
    description: "",
  });

  const parseError = (e: any, fallback: string) => {
    const detail = e?.response?.data?.detail;
    if (Array.isArray(detail)) return detail.map((d: any) => d.msg).join(", ");
    if (typeof detail === "string") return detail;
    return fallback;
  };

  const onChange = (k: string, v: any) =>
    setForm((p) => ({ ...p, [k]: v }));

  const fetchExcursions = async () => {
    setErr(null);
    setLoading(true);
    try {
      const res = await api.get("/excursions");
      setExcursions(res.data);
    } catch (e: any) {
      setErr(parseError(e, "Nu pot încărca excursiile"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExcursions();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    try {
      const payload = {
        ...form,
        description: form.description.trim() || null,
      };

      if (editingId) {
        await api.put(`/excursions/${editingId}`, payload);
      } else {
        await api.post("/excursions", payload);
      }

      setForm({
        name: "",
        price: 0,
        duration: 1,
        guide: false,
        latitude: 0,
        longitude: 0,
        description: "",
      });

      setEditingId(null);
      fetchExcursions();
    } catch (e: any) {
      setErr(parseError(e, "Eroare la salvare"));
    }
  };

  const edit = (e: Excursion) => {
    setEditingId(e.id);
    setForm({
      name: e.name,
      price: e.price,
      duration: e.duration,
      guide: e.guide,
      latitude: e.latitude,
      longitude: e.longitude,
      description: e.description || "",
    });
  };

  const remove = async (id: number) => {
    if (!window.confirm("Sigur ștergi excursia?")) return;
    setErr(null);
    try {
      await api.delete(`/excursions/${id}`);
      setExcursions((prev) => prev.filter((x) => x.id !== id));
    } catch (e: any) {
      setErr(parseError(e, "Eroare la ștergere"));
    }
  };

  const toggleRecommended = async (exc: Excursion) => {
    setSavingId(exc.id);
    try {
      const res = await api.patch(`/excursions/${exc.id}/recommended`);
      setExcursions((prev) =>
        prev.map((e) => (e.id === exc.id ? res.data : e))
      );
    } catch (e: any) {
      setErr(parseError(e, "Eroare la modificare recomandare"));
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-container">
        <h1 className="admin-title">Admin Panel</h1>

        <form className="admin-form" onSubmit={submit}>
          <div className="field">
            <label>Nume excursie</label>
            <input
              value={form.name}
              onChange={(e) => onChange("name", e.target.value)}
              required
            />
          </div>

          <div className="grid2">
            <div className="field">
              <label>Preț</label>
              <input
                type="number"
                min={0}
                value={form.price}
                onChange={(e) => onChange("price", Number(e.target.value))}
                required
              />
            </div>

            <div className="field">
              <label>Durată (ore)</label>
              <input
                type="number"
                min={0.5}
                step="0.5"
                value={form.duration}
                onChange={(e) => onChange("duration", Number(e.target.value))}
                required
              />
            </div>
          </div>

          <div className="grid2">
            <div className="field">
              <label>Latitudine</label>
              <input
                type="number"
                step="0.0001"
                value={form.latitude}
                onChange={(e) => onChange("latitude", Number(e.target.value))}
                required
              />
            </div>

            <div className="field">
              <label>Longitudine</label>
              <input
                type="number"
                step="0.0001"
                value={form.longitude}
                onChange={(e) => onChange("longitude", Number(e.target.value))}
                required
              />
            </div>
          </div>

          <div className="field checkbox">
            <label>
              <input
                type="checkbox"
                checked={form.guide}
                onChange={(e) => onChange("guide", e.target.checked)}
              />
              Cu ghid
            </label>
          </div>

          <div className="field">
            <label>Descriere</label>
            <textarea
              value={form.description}
              onChange={(e) => onChange("description", e.target.value)}
              rows={4}
            />
          </div>

          {err && <div className="error">{err}</div>}

          <button className="primaryBtn" type="submit">
            {editingId ? "Salvează modificările" : "Adaugă excursie"}
          </button>
        </form>

        {loading && <p>Se încarcă...</p>}

        {!loading && excursions.length === 0 && (
          <div className="empty-state">
            <span>📭</span>
            <p>Nu există excursii încă.</p>
          </div>
        )}

        <div className="excList">
          {excursions.map((e) => (
            <div key={e.id} className="excRow">
              <div className="excMain">
                <div className="excName">
                  {e.name}
                  {e.recommended && (
                    <span className="admin-badge">Recomandat</span>
                  )}
                </div>
                <div className="excMeta">
                  {e.price} Euro • {e.duration} h •{" "}
                  {e.guide ? "Cu ghid" : "Fără ghid"}
                </div>
              </div>

              <label className="admin-switch">
                <input
                  type="checkbox"
                  checked={e.recommended}
                  disabled={savingId === e.id}
                  onChange={() => toggleRecommended(e)}
                />
                <span />
              </label>

              <button
                className="ghostBtn"
                type="button"
                onClick={() => edit(e)}
              >
                Modifică
              </button>

              <button
                className="dangerBtn"
                type="button"
                onClick={() => remove(e.id)}
              >
                Șterge
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
