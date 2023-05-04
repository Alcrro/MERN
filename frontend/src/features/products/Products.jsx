import TestFilterV2 from "../../Components/UI/sideBarFilters/testFilter/TestFilterV2";
import { useGetAllProductsQuery, useGetProductsQuery } from "../../features/product/rtkProducts";

const Products = () => {
  const { data: apiProducts } = useGetAllProductsQuery();
  // console.log(apiProducts);

  const allProducts = apiProducts?.totalProducts;
  console.log(allProducts);

  const excludeColumns = ["_id", "description", "createdAt", "__v", "slug"];

  let columnArray = [];

  // create an array of column names and exclude some columns

  allProducts?.map((item) => {
    Object.keys(item).map((key) => {
      if (!excludeColumns.includes(key)) {
        columnArray.push(key);
      }
    });
  });

  // remove duplicate column names
  let uniqueColumnArray = columnArray.filter((item, index) => columnArray.indexOf(item) === index);
  console.log(uniqueColumnArray);

  return (
    <div>
      <TestFilterV2 products={allProducts} columns={uniqueColumnArray} />
    </div>
  );
};

export default Products;
