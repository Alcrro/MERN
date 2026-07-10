import { useState, useRef } from "react";
import useClickOutside from "../../../../hooks/useClickOutside";

const ChevronDown = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);

const Select = ({ value, options, onChange, prefix }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useClickOutside(ref, () => setOpen(false));

  const current = options.find(o => (o.value ?? o) === value);
  const label = current ? (current.label ?? current) : value;

  return (
    <div className="lp-select" ref={ref}>
      <button
        type="button"
        className={`lp-select__btn${open ? " lp-select__btn--open" : ""}`}
        onClick={() => setOpen(p => !p)}
      >
        {prefix && <span className="lp-select__prefix">{prefix}</span>}
        <span className="lp-select__val">{label}</span>
        <span className="lp-select__arrow"><ChevronDown /></span>
      </button>
      {open && (
        <div className="lp-select__dropdown">
          {options.map(opt => {
            const v = opt.value ?? opt;
            const l = opt.label ?? opt;
            return (
              <button
                key={v}
                type="button"
                className={`lp-select__opt${v === value ? " lp-select__opt--active" : ""}`}
                onClick={() => { onChange(v); setOpen(false); }}
              >
                {l}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Select;
