import { useState, useEffect } from "react";
import { useGetVendorMeQuery, useUpdateVendorProfileMutation } from "../../../../features/vendor/rtkVendor";

const EMPTY_LOCATION = () => ({
  oras: "", adresa: "", telefon: "",
  zileLivrare: { min: "", max: "" },
  orar: { lv: "", sambata: "", duminica: "" },
});

const EMPTY = {
  cui: "", denumireFirma: "", tipEntitate: "",
  returZile: "30", telefon: "", emailContact: "",
  shopDescription: "",
};

const useVendorProfileForm = () => {
  const { data: vendorMe, isLoading: loadingMe } = useGetVendorMeQuery();
  const [updateProfile, { isLoading, error }] = useUpdateVendorProfileMutation();
  const [form, setForm] = useState(EMPTY);
  const [locations, setLocations] = useState([]);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const u = vendorMe?.user;
    if (!u) return;
    const vp = u.profile ?? {};
    setForm({
      cui:             vp.cui             ?? "",
      denumireFirma:   vp.denumireFirma   ?? "",
      tipEntitate:     vp.tipEntitate     ?? "",
      returZile:       vp.returZile       ?? 30,
      telefon:         vp.telefon         ?? "",
      emailContact:    vp.emailContact    ?? "",
      shopDescription: u.shopDescription  ?? "",
    });
    setLocations(
      (u.locations ?? []).map((l) => ({
        oras:        l.oras        ?? "",
        adresa:      l.adresa      ?? "",
        telefon:     l.telefon     ?? "",
        zileLivrare: { min: l.zileLivrare?.min ?? "", max: l.zileLivrare?.max ?? "" },
        orar:        { lv: l.orar?.lv ?? "", sambata: l.orar?.sambata ?? "", duminica: l.orar?.duminica ?? "" },
      }))
    );
  }, [vendorMe]);

  const handleChange = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleLocationChange = (idx, field) => (e) => {
    const val = e.target.value;
    setLocations((prev) => {
      const next = [...prev];
      if (field === "zileLivrare.min") {
        next[idx] = { ...next[idx], zileLivrare: { ...next[idx].zileLivrare, min: val } };
      } else if (field === "zileLivrare.max") {
        next[idx] = { ...next[idx], zileLivrare: { ...next[idx].zileLivrare, max: val } };
      } else if (field.startsWith("orar.")) {
        const key = field.split(".")[1];
        next[idx] = { ...next[idx], orar: { ...next[idx].orar, [key]: val } };
      } else {
        next[idx] = { ...next[idx], [field]: val };
      }
      return next;
    });
  };

  const addLocation = () => setLocations((prev) => [...prev, EMPTY_LOCATION()]);

  const removeLocation = (idx) =>
    setLocations((prev) => prev.filter((_, i) => i !== idx));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);
    const { shopDescription, ...profileFields } = form;
    try {
      await updateProfile({ shopDescription, profile: profileFields, locations }).unwrap();
      setSuccess(true);
    } catch (_) {}
  };

  return {
    form, locations,
    handleChange, handleLocationChange,
    addLocation, removeLocation,
    handleSubmit, isLoading, loadingMe, error, success,
  };
};

export default useVendorProfileForm;
