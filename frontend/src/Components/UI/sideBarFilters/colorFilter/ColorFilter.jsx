import { useState } from "react";
import { COLOR_MAP } from "../../../../utils/constants";
import "./ColorFilter.css";

const LIGHT_COLORS = new Set(["Alb", "Argintiu", "Bej", "Galben"]);

const CheckIcon = ({ light }) => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <polyline points="2,6 5,9 10,3" stroke={light ? "#333" : "#fff"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ColorFilter = ({ culoare, setCuloare, contextProducts = [] }) => {
  const [open, setOpen] = useState(true);

  const options = [...new Set(contextProducts.flatMap((p) => p.culoare ?? []).filter(Boolean))].sort();

  const visibleOptions = [
    ...options,
    ...culoare.filter((c) => !options.includes(c)),
  ];

  const toggle = (val) =>
    setCuloare((prev) =>
      prev.includes(val) ? prev.filter((c) => c !== val) : [...prev, val]
    );

  if (visibleOptions.length === 0) return null;

  return (
    <div className="filter-v2-container color-filter">
      <button type="button" className="filter-head" onClick={() => setOpen((o) => !o)}>
        <span>Culoare{culoare.length > 0 ? ` (${culoare.length})` : ""}</span>
      </button>
      {open && (
        <div className="color-filter__swatches">
          {visibleOptions.map((name) => {
            const css      = COLOR_MAP[name] ?? "#ccc";
            const selected = culoare.includes(name);
            const isLight  = LIGHT_COLORS.has(name);
            const inactive = !options.includes(name);
            return (
              <button
                key={name}
                type="button"
                className={`color-filter__swatch${isLight ? " color-filter__swatch--light" : ""}${selected ? " color-filter__swatch--selected" : ""}${inactive ? " color-filter__swatch--inactive" : ""}`}
                style={{ background: css }}
                onClick={() => toggle(name)}
                title={name}
                aria-label={`${name}${selected ? " (activ)" : ""}${inactive ? " (indisponibil)" : ""}`}
                aria-pressed={selected}
              >
                {selected && (
                  <span className="color-filter__check">
                    <CheckIcon light={isLight} />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ColorFilter;
