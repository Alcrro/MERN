import { useState } from "react";
import { useSelector } from "react-redux";
import { useGetAllProductsQuery, useGetProductsQuery } from "../../../features/product/rtkProducts";

export const useProductFilters = () => {
  const [limit,   setLimit]   = useState(30);
  const [page,    setPage]    = useState(1);
  const [sort,    setSort]    = useState("Newest");
  const [brand,   setBrand]   = useState([]);
  const [rating,  setRating]  = useState([]);
  const [model,   setModel]   = useState([]);
  const [checked, setChecked] = useState(false);

  const cardViewListClass = useSelector((s) => s.cardsView.cardViewListClassName);
  const cardViewGridClass = useSelector((s) => s.cardsView.cardViewGridClassName);

  const { data: allProductsData }   = useGetAllProductsQuery();
  const { data: singleProductData } = useGetProductsQuery({ limit, page, sort, brand, rating, model });

  const activeFilterCount  = brand.length + rating.length + model.length;
  const displayAllProducts = allProductsData?.totalProducts ?? [];

  const totalPages    = allProductsData?.numberOfPages ?? 0;
  const filteredPages = Math.ceil((singleProductData?.queryProducts?.length ?? 0) / limit);

  const pagesArray       = Array.from({ length: totalPages },    (_, i) => i + 1);
  const pagesFilterArray = Array.from({ length: filteredPages }, (_, i) => i + 1);

  return {
    limit, setLimit, page, setPage, sort, setSort,
    brand, setBrand, rating, setRating,
    model, setModel, checked, setChecked,
    activeFilterCount, displayAllProducts,
    pagesArray, pagesFilterArray,
    singleProductData,
    cardViewListClass, cardViewGridClass,
  };
};
