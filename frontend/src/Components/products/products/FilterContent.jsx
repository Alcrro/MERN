import AllCategories from "../../UI/category/allCategories/AllCategories";
import SideBarFilters from "../../UI/sideBarFilters/ratingFilter/RatingSideBarFilter";

const FilterContent = ({ filters }) => {
  const {
    singleProductData, model, setModel, brand, setBrand,
    setPage, setLimit, checked, setChecked, setSort, rating, setRating,
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
        />
      </div>
      <div className="container-brand-filter">
        <div className="brand-filter-body">
          <div className="sidebar-filter-rating-container">
            <SideBarFilters
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
