import { useRef, useState, useCallback, useEffect } from "react";

const NAV_OFFSET = 34 + 66 + 44 + 8;

export const useScrollSpy = (keys) => {
  const navRef      = useRef(null);
  const [activeTab, setActiveTab] = useState(keys[0]);
  const sectionRefs = useRef(
    Object.fromEntries(keys.map((k) => [k, { current: null }]))
  ).current;

  const handleScroll = useCallback(() => {
    const base = (navRef.current?.offsetHeight ?? 48) + NAV_OFFSET;
    let current = keys[0];
    for (const key of keys) {
      const el = sectionRefs[key].current;
      if (el && el.getBoundingClientRect().top <= base) current = key;
    }
    setActiveTab(current);
  }, [keys, sectionRefs]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const scrollTo = (key) => {
    const el = sectionRefs[key].current;
    if (!el) return;
    const base = (navRef.current?.offsetHeight ?? 48) + NAV_OFFSET;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - base, behavior: "smooth" });
    setActiveTab(key);
  };

  return { navRef, sectionRefs, activeTab, scrollTo };
};
