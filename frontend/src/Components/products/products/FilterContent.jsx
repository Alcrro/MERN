import "../../UI/filtersAndProduct/productsv2.css";
import AllCategories from "../../UI/category/allCategories/AllCategories";
import RatingSideBarFilter from "../../UI/sideBarFilters/ratingFilter/RatingSideBarFilter";
import AvailabilityFilter from "../../UI/sideBarFilters/availabilityFilter/AvailabilityFilter";
import StorageFilter from "../../UI/sideBarFilters/storageFilter/StorageFilter";
import RamFilter from "../../UI/sideBarFilters/ramFilter/RamFilter";
import ColorFilter from "../../UI/sideBarFilters/colorFilter/ColorFilter";
const FilterContent = ({ filters, hideBrand = false }) => {
  const {
    model, setModel, brand, setBrand,
    setPage, setLimit, checked, setChecked, setSort, rating, setRating,
    availability, setAvailability, stocare, setStocare, ram, setRam,
    culoare, setCuloare,
    brandContext, modelContext,
    availabilityContext, stocareContext, ramContext, culoareContext, ratingContext,
  } = filters;

  return (
    <>
      <AvailabilityFilter
        availability={availability} setAvailability={setAvailability}
        contextProducts={availabilityContext}
      />
      <AllCategories
        brandContext={brandContext}
        modelContext={modelContext}
        model={model} setModel={setModel}
        brand={brand} setBrand={setBrand}
        setPage={setPage} setLimit={setLimit}
        checked={checked} setChecked={setChecked}
        setSort={setSort} rating={rating} setRating={setRating}
        hideBrand={hideBrand}
      />
      <StorageFilter
        stocare={stocare} setStocare={setStocare}
        contextProducts={stocareContext}
      />
      <RamFilter
        ram={ram} setRam={setRam}
        contextProducts={ramContext}
      />
      <ColorFilter
        culoare={culoare} setCuloare={setCuloare}
        contextProducts={culoareContext}
      />
      <RatingSideBarFilter rating={rating} setRating={setRating} contextProducts={ratingContext} />
    </>
  );
};

export default FilterContent;
