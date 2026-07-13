import "../../UI/filtersAndProduct/productsv2.css";
import AllCategories from "../../UI/category/allCategories/AllCategories";
import RatingSideBarFilter from "../../UI/sideBarFilters/ratingFilter/RatingSideBarFilter";
import AvailabilityFilter from "../../UI/sideBarFilters/availabilityFilter/AvailabilityFilter";
import StorageFilter from "../../UI/sideBarFilters/storageFilter/StorageFilter";
import RamFilter from "../../UI/sideBarFilters/ramFilter/RamFilter";
import ColorFilter from "../../UI/sideBarFilters/colorFilter/ColorFilter";

const FilterContent = ({ hideBrand = false }) => (
  <>
    <AvailabilityFilter />
    <AllCategories hideBrand={hideBrand} />
    <StorageFilter />
    <RamFilter />
    <ColorFilter />
    <RatingSideBarFilter />
  </>
);

export default FilterContent;
