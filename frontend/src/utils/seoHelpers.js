export const buildProductSeo = (brand, model, path) => {
  const hasBrand = brand.length > 0;
  const hasModel = model.length > 0;

  if (hasBrand && hasModel) {
    const brandStr = brand.join(", ");
    const modelStr = model.join(", ");
    return {
      title: `${brandStr} ${modelStr}`,
      description: `Cumpără ${modelStr} de la ${brandStr} la prețuri competitive. Produse verificate, livrare rapidă în România.`,
      path,
    };
  }
  if (hasBrand) {
    const brandStr = brand.join(", ");
    return {
      title: `Telefoane ${brandStr}`,
      description: `Descoperă telefoane ${brandStr} la prețuri imbatabile. Produse verificate, livrare rapidă în toată România.`,
      path,
    };
  }
  return {
    title: "Telefoane și Accesorii",
    description: "Cumpără telefoane și accesorii premium la prețuri competitive. Produse verificate, livrare rapidă în toată România.",
    path,
  };
};
