import { createContext, useContext } from "react";

export const FilterContext = createContext(null);
export const useFilters = () => useContext(FilterContext);
