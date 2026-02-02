import { useEffect, useMemo, useState } from "react";
import "./ReservationModal.css";

export default function ReservationModal({
  open,
  onClose,
  onConfirm,
  excursion,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: (payload: {
    date: string;
    persons: number;
    fullName: string;
    phone: string;
    payment: string;
  }) => void;
  excursion: any;
}) {
  const [date, setDate] = useState("");
  const [persons, setPersons] = useState(2);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [payment, setPayment] = useState("Card");

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    setDate("");
    setPersons(2);
    setFullName("");
    setPhone("");
    setPayment("Card");
  }, [open]);

  const total = useMemo(() => {
    return Number(excursion?.price ?? 0) * persons;
  }, [excursion, persons]);

  const phoneOk = phone.replace(/\s+/g, "").length >= 8;
  const canSubmit =
    date && persons >= 1 && fullName.trim() && phoneOk;

  if (!open) return null;

  return (
    <div className="rm-overlay" onMouseDown={onClose}>
      <div className="rm-modal" onMouseDown={(e) => e.stopPropagation()}>
        <div className="rm-header">
          <div>
            <h3 className="rm-title">Finalizează rezervarea</h3>
            <p className="rm-subtitle">
              Completează detaliile pentru a-ți asigura locurile
            </p>
          </div>
          <button className="rm-close" onClick={onClose}>✕</button>
        </div>

        <div className="rm-excursion">
          <div className="rm-exc-icon">📍</div>
          <div>
            <div className="rm-exc-name">{excursion?.name}</div>
            <div className="rm-exc-meta">
              ⏱ {excursion?.duration} h • {excursion?.price} Euro / pers
            </div>
          </div>
        </div>

        <div className="rm-grid">
          <div className="rm-field">
            <label>Data</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>

          <div className="rm-field">
            <label>Persoane</label>
            <input
              type="number"
              min={1}
              max={20}
              value={persons}
              onChange={(e) => setPersons(Math.max(1, Number(e.target.value) || 1))}
            />
          </div>
        </div>

        <div className="rm-total">
          <span>Total</span>
          <strong>{total.toFixed(2)} Euro</strong>
        </div>

        <div className="rm-field">
          <label>Nume complet</label>
          <input value={fullName} onChange={(e) => setFullName(e.target.value)} />
        </div>

        <div className="rm-field">
          <label>Telefon</label>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>

        <div className="rm-field">
          <label>Plată</label>
          <select value={payment} onChange={(e) => setPayment(e.target.value)}>
            <option>Card</option>
            <option>Cash</option>
            <option>Transfer</option>
          </select>
        </div>

        <div className="rm-actions">
          <button
            className="rm-primary"
            disabled={!canSubmit}
            onClick={() =>
              onConfirm({ date, persons, fullName, phone, payment })
            }
          >
            Confirmă rezervarea
          </button>
          <button className="rm-secondary" onClick={onClose}>
            Renunță
          </button>
        </div>
      </div>
    </div>
  );
}
