import EcosystemItem from "./EcosystemItem";

const VARIANT_LABELS = {
  critical:    "Esențiale",
  recommended: "Recomandate",
};

const EcosystemLevel = ({ variant, items = [] }) => {
  if (!items.length) return null;

  return (
    <div className={`ecosystem-level ecosystem-level--${variant}`}>
      <p className="ecosystem-level__title">{VARIANT_LABELS[variant]}</p>
      <div className="ecosystem-level__list">
        {items.map((item) => (
          <EcosystemItem key={item.label} {...item} />
        ))}
      </div>
    </div>
  );
};

export default EcosystemLevel;
