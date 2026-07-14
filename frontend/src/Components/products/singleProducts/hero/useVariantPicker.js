import { useState, useEffect, useCallback } from "react";

const getAttrs = (variant) => {
  const a = variant?.attributes;
  if (!a) return {};
  if (a instanceof Map) return Object.fromEntries(a);
  return a;
};

const useVariantPicker = (variants = []) => {
  const [selected, setSelected] = useState({});

  const attrKeys = variants.reduce((keys, v) => {
    Object.keys(getAttrs(v)).forEach((k) => {
      if (!keys.includes(k)) keys.push(k);
    });
    return keys;
  }, []).sort((a, b) => (a === "Culoare" ? 1 : b === "Culoare" ? -1 : 0));

  const options = attrKeys.reduce((acc, key) => {
    acc[key] = [...new Set(variants.map((v) => getAttrs(v)[key]).filter(Boolean))];
    return acc;
  }, {});

  useEffect(() => {
    if (!attrKeys.length) return;
    const auto = {};
    attrKeys.forEach((key) => {
      if (options[key]?.length === 1) auto[key] = options[key][0];
    });
    if (Object.keys(auto).length) setSelected((prev) => ({ ...auto, ...prev }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variants.length]);

  const isValid = useCallback((key, val) =>
    variants.some((v) => {
      const attrs = getAttrs(v);
      return attrKeys.every((k) => {
        if (k === key) return attrs[k] === val;
        if (!selected[k]) return true;
        return attrs[k] === selected[k];
      });
    }),
  [variants, selected, attrKeys]);

  const select = useCallback((key, val) => {
    setSelected((prev) => ({ ...prev, [key]: val }));
  }, []);

  const allSelected = attrKeys.length > 0 && attrKeys.every((k) => selected[k]);
  const noAttrs     = attrKeys.length === 0 && variants.length === 1;

  const selectedVariant = noAttrs
    ? variants[0]
    : allSelected
      ? variants.find((v) => {
          const attrs = getAttrs(v);
          return attrKeys.every((k) => attrs[k] === selected[k]);
        }) ?? null
      : null;

  const selectedKeys = Object.keys(selected);
  const partialMatch = !selectedVariant && selectedKeys.length > 0
    ? variants.find((v) => {
        const attrs = getAttrs(v);
        return selectedKeys.every((k) => attrs[k] === selected[k]);
      }) ?? null
    : null;

  const activeVariant = selectedVariant ?? partialMatch ?? variants[0] ?? null;

  return { attrKeys, options, selected, selectedVariant, activeVariant, isValid, select };
};

export default useVariantPicker;
