import { useState, useEffect } from "react";
import { useGetVendorMeQuery, useUpdateVendorProfileMutation } from "../../../../features/vendor/rtkVendor";

const EMPTY = {
  cui: "", denumireFirma: "", tipEntitate: "",
  orasDepozit: "", zileLivrare: { min: "", max: "" },
  returZile: "30", telefon: "", emailContact: "",
};

const useVendorProfileForm = () => {
  const { data: vendorMe, isLoading: loadingMe } = useGetVendorMeQuery();
  const [updateProfile, { isLoading, error }] = useUpdateVendorProfileMutation();
  const [form, setForm] = useState(EMPTY);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const vp = vendorMe?.user?.vendorProfile;
    if (!vp) return;
    setForm({
      cui:           vp.cui           ?? "",
      denumireFirma: vp.denumireFirma ?? "",
      tipEntitate:   vp.tipEntitate   ?? "",
      orasDepozit:   vp.orasDepozit   ?? "",
      zileLivrare: {
        min: vp.zileLivrare?.min ?? "",
        max: vp.zileLivrare?.max ?? "",
      },
      returZile:    vp.returZile    ?? 30,
      telefon:      vp.telefon      ?? "",
      emailContact: vp.emailContact ?? "",
    });
  }, [vendorMe]);

  const handleChange = (field) => (e) => {
    const val = e.target.value;
    if (field === "zileLivrare.min") {
      return setForm(f => ({ ...f, zileLivrare: { ...f.zileLivrare, min: val } }));
    }
    if (field === "zileLivrare.max") {
      return setForm(f => ({ ...f, zileLivrare: { ...f.zileLivrare, max: val } }));
    }
    setForm(f => ({ ...f, [field]: val }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);
    try {
      await updateProfile(form).unwrap();
      setSuccess(true);
    } catch (_) {}
  };

  return { form, handleChange, handleSubmit, isLoading, loadingMe, error, success };
};

export default useVendorProfileForm;
