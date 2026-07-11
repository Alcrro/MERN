import { useRef, useEffect, useState } from "react";
import { COLOR_MAP, COLOR_MAP_KEYS } from "../../../../utils/constants";
import { isLightHex } from "../../../../utils/colorUtils";
import "./ColorSwatches.css";

const ColorSwatches = ({ selected, onToggle }) => {
  const inputRef = useRef(null);
  const [pool, setPool] = useState(() => {
    const saved = JSON.parse(localStorage.getItem("vendor_custom_colors") ?? "[]");
    const fromSelected = selected.filter((c) => !COLOR_MAP_KEYS.has(c));
    const merged = [...saved];
    for (const c of fromSelected) if (!merged.includes(c)) merged.push(c);
    return merged;
  });

  useEffect(() => {
    localStorage.setItem("vendor_custom_colors", JSON.stringify(pool));
  }, [pool]);

  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;
    const handler = (e) => {
      const hex = e.target.value;
      setPool((prev) => prev.includes(hex) ? prev : [...prev, hex]);
      if (!selected.includes(hex)) onToggle(hex);
    };
    input.addEventListener("change", handler);
    return () => input.removeEventListener("change", handler);
  }, [selected, onToggle]);

  return (
    <div className="vf-field cf-full">
      <label className="vf-label">Culori disponibile</label>
      <div className="cs-swatches">
        {Object.entries(COLOR_MAP).map(([name, hex]) => (
          <button
            key={name}
            type="button"
            title={name}
            aria-label={name}
            aria-pressed={selected.includes(name)}
            className={`cs-swatch${selected.includes(name) ? " cs-swatch--on" : ""}`}
            style={{ background: hex }}
            onClick={() => onToggle(name)}
          />
        ))}

        {pool.map((hex) => (
          <button
            key={hex}
            type="button"
            title={hex}
            aria-label={hex}
            aria-pressed={selected.includes(hex)}
            className={`cs-swatch${selected.includes(hex) ? " cs-swatch--on" : ""}${isLightHex(hex) ? " cs-swatch--light" : ""}`}
            style={{ background: hex }}
            onClick={() => onToggle(hex)}
          />
        ))}

        <button
          type="button"
          className="cs-swatch cs-swatch--add"
          title="Culoare personalizată"
          aria-label="Adaugă culoare personalizată"
          onClick={() => inputRef.current?.click()}
        >+</button>
        <input
          ref={inputRef}
          type="color"
          className="cs-color-input"
          tabIndex={-1}
        />
      </div>
    </div>
  );
};

export default ColorSwatches;
