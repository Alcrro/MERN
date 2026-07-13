import { useRef, useState, useEffect } from "react";

const useModalAlign = (modalWidth) => {
  const ref = useRef(null);
  const [align, setAlign] = useState("center");

  useEffect(() => {
    const el = ref.current?.closest(".cart-wrapper");
    if (!el) return;
    const check = () => {
      const rect   = el.getBoundingClientRect();
      const center = rect.left + rect.width / 2;
      const vw     = window.innerWidth;
      if (center - modalWidth / 2 < 8)           setAlign("right");
      else if (center + modalWidth / 2 > vw - 8) setAlign("left");
      else                                        setAlign("center");
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [modalWidth]);

  return { ref, align };
};

export default useModalAlign;
