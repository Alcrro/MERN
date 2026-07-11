import { CLOTHING_SIZES } from "../../../../utils/constants";
import ColorSwatches from "../../shared/ColorSwatches";
import "./CategoryFields.css";

const F = ({ id, label, fields, k, onChange, type = "text" }) => (
  <div className="vf-field">
    <label className="vf-label" htmlFor={id}>{label}</label>
    <input id={id} type={type} className="vf-input" value={fields[k] ?? ""} onChange={(e) => onChange({ ...fields, [k]: e.target.value })} />
  </div>
);

const CategoryFields = ({ kind, fields, onChange }) => {
  const set = (k) => (e) => onChange({ ...fields, [k]: e.target.value });
  const toggleArr = (k, v) => {
    const arr = fields[k] ?? [];
    onChange({ ...fields, [k]: arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v] });
  };

  if (kind === "Electronics") return (
    <div className="cf-grid">
      <F id="model"    label="Model *"          fields={fields} k="model"    onChange={onChange} />
      <F id="tip"      label="Tip"              fields={fields} k="tip"      onChange={onChange} />
      <F id="stocare"  label="Stocare"          fields={fields} k="stocare"  onChange={onChange} />
      <F id="ram"      label="RAM"              fields={fields} k="RAM"      onChange={onChange} />
      <F id="procesor" label="Procesor"         fields={fields} k="procesor" onChange={onChange} />
      <F id="display"  label="Display"          fields={fields} k="display"  onChange={onChange} />
      <F id="camera"   label="Cameră"           fields={fields} k="camera"   onChange={onChange} />
      <F id="baterie"  label="Baterie"          fields={fields} k="baterie"  onChange={onChange} />
      <F id="os"       label="Sistem de operare" fields={fields} k="OS"      onChange={onChange} />
      <ColorSwatches selected={fields.culoare ?? []} onToggle={(c) => toggleArr("culoare", c)} />
    </div>
  );

  if (kind === "Clothing") return (
    <div className="cf-grid">
      <F id="name"     label="Denumire produs *" fields={fields} k="name"     onChange={onChange} />
      <F id="material" label="Material"          fields={fields} k="material" onChange={onChange} />
      <div className="vf-field">
        <label className="vf-label">Gen</label>
        <select className="vf-input" value={fields.gender ?? ""} onChange={set("gender")}>
          <option value="">— selectează —</option>
          {["Barbati", "Femei", "Unisex", "Copii"].map((g) => <option key={g}>{g}</option>)}
        </select>
      </div>
      <div className="vf-field cf-full">
        <label className="vf-label">Mărimi disponibile</label>
        <div className="cf-chips">
          {CLOTHING_SIZES.map((s) => (
            <button key={s} type="button" className={`cf-chip${(fields.size ?? []).includes(s) ? " cf-chip--on" : ""}`} onClick={() => toggleArr("size", s)}>{s}</button>
          ))}
        </div>
      </div>
      <ColorSwatches selected={fields.culoare ?? []} onToggle={(c) => toggleArr("culoare", c)} />
    </div>
  );

  if (kind === "Furniture") return (
    <div className="cf-grid">
      <F id="name"       label="Denumire produs *" fields={fields} k="name"       onChange={onChange} />
      <F id="material"   label="Material"          fields={fields} k="material"   onChange={onChange} />
      <F id="dimensiuni" label="Dimensiuni"        fields={fields} k="dimensiuni" onChange={onChange} />
      <F id="stil"       label="Stil"              fields={fields} k="stil"       onChange={onChange} />
      <F id="nrLocuri"   label="Nr. locuri"        fields={fields} k="nrLocuri"   onChange={onChange} type="number" />
      <F id="culoare"    label="Culoare"           fields={fields} k="culoare"    onChange={onChange} />
    </div>
  );

  if (kind === "HomeGarden") return (
    <div className="cf-grid">
      <F id="name"       label="Denumire produs *" fields={fields} k="name"       onChange={onChange} />
      <F id="material"   label="Material"          fields={fields} k="material"   onChange={onChange} />
      <F id="dimensiuni" label="Dimensiuni"        fields={fields} k="dimensiuni" onChange={onChange} />
      <F id="tip"        label="Tip"               fields={fields} k="tip"        onChange={onChange} />
      <F id="culoare"    label="Culoare"           fields={fields} k="culoare"    onChange={onChange} />
    </div>
  );

  if (kind === "Books") return (
    <div className="cf-grid">
      <F id="title"     label="Titlu *"      fields={fields} k="title"     onChange={onChange} />
      <F id="author"    label="Autor *"      fields={fields} k="author"    onChange={onChange} />
      <F id="isbn"      label="ISBN"         fields={fields} k="isbn"      onChange={onChange} />
      <F id="publisher" label="Editura"      fields={fields} k="publisher" onChange={onChange} />
      <F id="genre"     label="Gen literar"  fields={fields} k="genre"     onChange={onChange} />
      <div className="vf-field">
        <label className="vf-label">Format</label>
        <select className="vf-input" value={fields.format ?? ""} onChange={set("format")}>
          <option value="">— selectează —</option>
          {["Fizic", "Digital", "Audio"].map((f) => <option key={f}>{f}</option>)}
        </select>
      </div>
      <F id="language" label="Limbă"  fields={fields} k="language" onChange={onChange} />
      <F id="pages"    label="Pagini" fields={fields} k="pages"    onChange={onChange} type="number" />
    </div>
  );

  return null;
};

export default CategoryFields;
