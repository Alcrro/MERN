import { useNavigate } from "react-router-dom";

export const useHeaderSearch = () => {
  const navigate = useNavigate();

  return (query) => {
    if (query.trim()) {
      navigate(`/products?search=${encodeURIComponent(query.trim())}`);
    }
  };
};
