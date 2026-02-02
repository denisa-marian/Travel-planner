import { useEffect, useMemo, useRef, useState } from "react";
import {
  Search,
  UserCheck,
  UserX,
  Users,
  Wallet,
  ArrowUpDown,
  ChevronDown,
} from "lucide-react";

export type Filters = {
  search: string;
  maxPrice: number;
  guideOnly: boolean | null;
  sort: "recommended" | "price_asc" | "price_desc" | "rating_desc";
};

type Option<T extends string> = {
  value: T;
  label: string;
};

function Dropdown<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: Option<T>[];
  onChange: (v: T) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  const selected = useMemo(
    () => options.find((o) => o.value === value)?.label ?? "",
    [options, value]
  );

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  return (
    <div className="dd" ref={ref}>
      <button
        type="button"
        className="dd-btn"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span className="dd-btn-text">{selected}</span>
        <ChevronDown className="dd-chevron" width={18} height={18} />
      </button>

      {open && (
        <div className="dd-menu">
          {options.map((o) => (
            <button
              key={o.value}
              type="button"
              className={`dd-item${o.value === value ? " dd-item-active" : ""}`}
              onClick={() => {
                onChange(o.value);
                setOpen(false);
              }}
            >
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function FilterPanel({
  value,
  onChange,
}: {
  value: Filters;
  onChange: (f: Filters) => void;
}) {
  const [local, setLocal] = useState<Filters>(value);

  useEffect(() => setLocal(value), [value]);

  const commit = (patch: Partial<Filters>) => {
    const next = { ...local, ...patch };
    setLocal(next);
    onChange(next);
  };

  const guideValue = (local.guideOnly === null
    ? "all"
    : local.guideOnly
    ? "yes"
    : "no") as "all" | "yes" | "no";

  const guideOptions: Option<"all" | "yes" | "no">[] = [
    { value: "all", label: "Cu / fără ghid" },
    { value: "yes", label: "Doar cu ghid" },
    { value: "no", label: "Fără ghid" },
  ];

  const sortOptions: Option<Filters["sort"]>[] = [
    { value: "recommended", label: "Recomandate" },
    { value: "rating_desc", label: "Rating desc" },
    { value: "price_asc", label: "Preț cresc" },
    { value: "price_desc", label: "Preț desc" },
  ];

  return (
    <div className="filter-bar">
      <div className="filter-row">
        <div className="filter-field filter-search">
          <Search className="filter-icon" />
          <input
            className="filter-input"
            placeholder="Caută excursie"
            value={local.search}
            onChange={(e) => commit({ search: e.target.value })}
          />
        </div>

        <div className="filter-field filter-compact">
          {guideValue === "yes" ? (
            <UserCheck className="filter-icon" />
          ) : guideValue === "no" ? (
            <UserX className="filter-icon" />
          ) : (
            <Users className="filter-icon" />
          )}

          <Dropdown
            value={guideValue}
            options={guideOptions}
            onChange={(v) => commit({ guideOnly: v === "all" ? null : v === "yes" })}
          />
        </div>

        <div className="filter-budget">
          <div className="filter-budget-top">
            <div className="filter-budget-label">
              <Wallet className="filter-icon" />
              <span>Buget max</span>
            </div>
            <div className="filter-pill">{local.maxPrice} Euro</div>
          </div>

          <input
            className="filter-range"
            type="range"
            min={50}
            max={1000}
            step={10}
            value={local.maxPrice}
            onChange={(e) => commit({ maxPrice: Number(e.target.value) })}
          />
        </div>

        <div className="filter-field filter-compact">
          <ArrowUpDown className="filter-icon" />
          <Dropdown
            value={local.sort}
            options={sortOptions}
            onChange={(v) => commit({ sort: v })}
          />
        </div>
      </div>
    </div>
  );
}
