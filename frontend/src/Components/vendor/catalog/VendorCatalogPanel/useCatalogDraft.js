import { useState } from "react";
import { useCreateVendorProductMutation } from "../../../../features/vendor/rtkVendor";
import { DEFAULT_STOCK } from "../../../../utils/constants";

const initVariant = () => ({
  price: "", stock: { ...DEFAULT_STOCK },
  publishing: false, published: false, error: null,
});

const initDraft = (colors) => ({
  variants: Object.fromEntries((colors ?? []).map((c) => [c, initVariant()])),
  sizes: [],
});

const useCatalogDraft = () => {
  const [drafts, setDrafts] = useState({});
  const [create] = useCreateVendorProductMutation();

  const getDraft = (entry) => drafts[entry._id] ?? initDraft(entry.culoare);

  const patchVariant = (entryId, color, patch) =>
    setDrafts((prev) => {
      const old = prev[entryId] ?? initDraft([]);
      return {
        ...prev,
        [entryId]: {
          ...old,
          variants: { ...old.variants, [color]: { ...(old.variants[color] ?? initVariant()), ...patch } },
        },
      };
    });

  const setSizes = (entryId, sizes) =>
    setDrafts((prev) => ({ ...prev, [entryId]: { ...(prev[entryId] ?? initDraft([])), sizes } }));

  const publishColor = async (entry, color) => {
    const variant = getDraft(entry).variants[color] ?? initVariant();

    if (!variant.price) {
      patchVariant(entry._id, color, { error: "Introduceți prețul" });
      return;
    }

    patchVariant(entry._id, color, { error: null, publishing: true });

    const draft = getDraft(entry);
    const res = await create({
      kind: entry.kind, brand: entry.brand, ...entry.specs,
      culoare: [color],
      ...(entry.kind === "Clothing" && { size: draft.sizes }),
      price:  Number(variant.price),
      stock:  variant.stock,
      images: entry.images ?? [],
    });

    patchVariant(entry._id, color, {
      publishing: false,
      ...(res.error
        ? { error: res.error?.data?.message || "Eroare la publicare." }
        : { published: true }),
    });
  };

  return { getDraft, patchVariant, setSizes, publishColor };
};

export default useCatalogDraft;
