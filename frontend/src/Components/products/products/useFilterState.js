import { useState } from "react";
import { useSelector } from "react-redux";

export const useFilterState = ({ initialBrand = [] } = {}) => {
  const [limit,        setLimit]        = useState(30);
  const [page,         setPage]         = useState(1);
  const [sort,         setSort]         = useState("Newest");
  const [brand,        setBrand]        = useState(initialBrand);
  const [rating,       setRating]       = useState([]);
  const [model,        setModel]        = useState([]);
  const [checked,      setChecked]      = useState(false);
  const [availability, setAvailability] = useState([]);
  const [stocare,      setStocare]      = useState([]);
  const [ram,          setRam]          = useState([]);
  const [culoare,      setCuloare]      = useState([]);

  const cardViewListClass = useSelector((s) => s.cardsView.cardViewListClassName);
  const cardViewGridClass = useSelector((s) => s.cardsView.cardViewGridClassName);

  return {
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
