import "../../UI/filtersAndProduct/productsv2.css";
import AllCategories from "../../UI/category/allCategories/AllCategories";
import RatingSideBarFilter from "../../UI/sideBarFilters/ratingFilter/RatingSideBarFilter";
import AvailabilityFilter from "../../UI/sideBarFilters/availabilityFilter/AvailabilityFilter";
import StorageFilter from "../../UI/sideBarFilters/storageFilter/StorageFilter";
import RamFilter from "../../UI/sideBarFilters/ramFilter/RamFilter";

const FilterContent = ({ filters, hideBrand = false }) => {
  const {
    singleProductData, model, setModel, brand, setBrand,
    setPage, setLimit, checked, setChecked, setSort, rating, setRating,
    availability, setAvailability, stocare, setStocare, ram, setRam,
  } = filters;

  return (
    <>
      <div className="filters-v2-container">
        <AllCategories
          data={singleProductData}
          model={model}
          setModel={setModel}
          brand={brand}
          setBrand={setBrand}
          setPage={setPage}
          setLimit={setLimit}
          checked={checked}
          setChecked={setChecked}
          setSort={setSort}
          rating={rating}
          setRating={setRating}
          hideBrand={hideBrand}
        />
      </div>
      <AvailabilityFilter availability={availability} setAvailability={setAvailability} />
      <StorageFilter stocare={stocare} setStocare={setStocare} />
      <RamFilter ram={ram} setRam={setRam} />
      <div className="container-brand-filter">
        <div className="brand-filter-body">
          <div className="sidebar-filter-rating-container">
            <RatingSideBarFilter
              rating={rating}
              setRating={setRating}
              setLimit={setLimit}
              brand={brand}
              queryProduct={singleProductData?.queryProducts}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterContent;
