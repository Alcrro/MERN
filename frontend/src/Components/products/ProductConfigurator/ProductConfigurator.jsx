import { useState } from "react";
import { useGetEcosystemQuery, useConfigureEcosystemMutation } from "../../../features/product/rtkProducts";
import Cards from "../cards/Cards";
import "./ProductConfigurator.css";

const ProductConfigurator = ({ tip, brand, model }) => {
  const [selected, setSelected] = useState([]);
  const [freeText, setFreeText] = useState("");
  const [results,  setResults]  = useState(null);

  const { data: eco } = useGetEcosystemQuery(tip, { skip: !tip });
  const [configure, { isLoading }] = useConfigureEcosystemMutation();

  const scenarios = eco?.data?.tasks?.map((t) => ({ id: t.id, label: t.label, icon: t.icon })) ?? [];

  const toggle = (label) =>
    setSelected((prev) =>
      prev.includes(label) ? prev.filter((s) => s !== label) : [...prev, label]
    );

  const handleSubmit = async () => {
    if (!selected.length) return;
    const res = await configure({ tip, brand, model, scenarios: selected, context: freeText });
    if (res.data) setResults(res.data.recommendations);
  };

  if (!tip) return null;

  return (
    <section className="configurator">
      <div className="configurator__inner">
        <h2 className="configurator__title">Configurează-ți setup-ul ideal</h2>
        <p className="configurator__sub">
          {brand && model
            ? `Spune-ne cum vei folosi ${brand} ${model}`
            : "Alege scenariile tale de utilizare"}
        </p>

        <div className="configurator__chips">
          {scenarios.map((s) => (
            <button
              key={s.id}
              type="button"
              className={`configurator__chip${selected.includes(s.label) ? " configurator__chip--on" : ""}`}
              onClick={() => toggle(s.label)}
            >
              {s.icon} {s.label}
            </button>
          ))}
        </div>

        <textarea
          className="configurator__textarea"
          placeholder="Context adițional (opțional): buget, preferințe, situații specifice..."
          value={freeText}
          onChange={(e) => setFreeText(e.target.value)}
          rows={3}
        />

        <button
          type="button"
          className="configurator__btn"
          onClick={handleSubmit}
          disabled={isLoading || !selected.length}
        >
          {isLoading ? "Se generează..." : "✨ Generează recomandări"}
        </button>

        {results && (
          <div className="configurator__results">
            {results.map((rec) => (
              <div key={rec.tip} className="configurator__group">
                <p className="configurator__reason">💡 {rec.reason}</p>
                <div className="configurator__grid">
                  {rec.products.map((item, i) => (
                    <Cards key={i} products={item} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductConfigurator;
