import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams, useSearchParams } from "react-router-dom";
import { CATEGORY_SLUG_TO_KIND, TIP_SLUG_TO_TIP } from "../../../utils/categorySlugMap";

export const useFilterState = ({ initialBrand = [] } = {}) => {
  const { categorySlug, tipSlug } = useParams();
  const [searchParams] = useSearchParams();

  const kind = CATEGORY_SLUG_TO_KIND[categorySlug] || "";
  const tip  = TIP_SLUG_TO_TIP[tipSlug]            || "";

  const [limit,        setLimit]        = useState(30);
  const [page,         setPage]         = useState(1);
  const [sort,         setSort]         = useState(searchParams.get("sort") || "Newest");
  const [brand,        setBrand]        = useState(initialBrand);
  const [rating,       setRating]       = useState([]);
  const [model,        setModel]        = useState([]);
  const [checked,      setChecked]      = useState(false);
  const [availability, setAvailability] = useState(
    searchParams.get("availability") ? [searchParams.get("availability")] : []
  );
  const [stocare,      setStocare]      = useState([]);
  const [ram,          setRam]          = useState([]);
  const [culoare,      setCuloare]      = useState([]);

  useEffect(() => {
    setSort(searchParams.get("sort") || "Newest");
    setAvailability(searchParams.get("availability") ? [searchParams.get("availability")] : []);
    setPage(1);
  }, [searchParams]);

  const cardViewListClass = useSelector((s) => s.cardsView.cardViewListClassName);
  const cardViewGridClass = useSelector((s) => s.cardsView.cardViewGridClassName);

  return {
    kind, tip,
    limit, setLimit, page, setPage, sort, setSort,
    brand, setBrand, rating, setRating,
    model, setModel, checked, setChecked,
    availability, setAvailability,
    stocare, setStocare,
    ram, setRam,
    culoare, setCuloare,
    cardViewListClass, cardViewGridClass,
  };
};
