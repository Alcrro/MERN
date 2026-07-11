import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useCreateVendorProductMutation,
  useUpdateVendorProductMutation,
  useGetVendorProductsQuery,
} from "../../../../features/vendor/rtkVendor";
import { DEFAULT_STOCK } from "../../../../utils/constants";

const useVendorProductForm = (isEdit) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [kind,      setKind]      = useState("Electronics");
  const [form,      setForm]      = useState({ brand: "", price: "", description: "" });
  const [stock,     setStock]     = useState(DEFAULT_STOCK);
  const [images,    setImages]    = useState([]);
  const [catFields, setCatFields] = useState({});
  const [warned,    setWarned]    = useState(false);

  const { data: productsData } = useGetVendorProductsQuery({}, { skip: !isEdit });
  const [create, { isLoading: creating, error: createErr }] = useCreateVendorProductMutation();
  const [update, { isLoading: updating, error: updateErr }] = useUpdateVendorProductMutation();

  const isLoading = creating || updating;
  const error     = createErr || updateErr;

  useEffect(() => {
    if (!isEdit || !productsData) return;
    const product = productsData.products?.find((p) => p._id === id);
    if (!product) return;
    const { brand, price, description, kind: k, images: imgs, stock: s, ...rest } = product;
    setKind(k || "Electronics");
    setForm({ brand: brand || "", price: price || "", description: description || "" });
    setStock(s || DEFAULT_STOCK);
    setImages(imgs || []);
    setCatFields(rest);
  }, [isEdit, id, productsData]);

  const handleChange = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target.value }));

  const handleKindChange = (k) => { setKind(k); setCatFields({}); };

  const handleCatalogSelect = (entry) => {
    if (!entry) return;
    setForm((prev) => ({ ...prev, brand: entry.brand }));
    setCatFields(entry.specs || {});
    if (entry.images?.length) {
      setImages((prev) => {
        const existing = new Set(prev);
        const toAdd = entry.images.filter((url) => !existing.has(url));
        return toAdd.length
          ? [...entry.images, ...prev.filter((u) => !entry.images.includes(u))]
          : prev;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEdit && !warned) { setWarned(true); return; }
    const payload = { kind, ...form, price: Number(form.price), stock, images, ...catFields };
    const res = isEdit ? await update({ id, ...payload }) : await create(payload);
    if (!res.error) navigate("/vendor/dashboard/products");
  };

  return {
    kind, form, stock, images, catFields, warned,
    isLoading, error,
    setStock, setImages, setCatFields,
    handleChange, handleKindChange, handleCatalogSelect, handleSubmit,
  };
};

export default useVendorProductForm;
