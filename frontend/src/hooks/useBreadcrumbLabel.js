import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setLastLabel, clearLastLabel } from "../features/ui/breadcrumbSlice";

export const useBreadcrumbLabel = (label) => {
  const dispatch = useDispatch();
  useEffect(() => {
    if (label) dispatch(setLastLabel(label));
    return () => dispatch(clearLastLabel());
  }, [label, dispatch]);
};
