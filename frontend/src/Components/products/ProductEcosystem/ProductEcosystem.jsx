import { useParams } from "react-router-dom";
import { useGetEcosystemQuery } from "../../../features/product/rtkProducts";
import { TIP_SLUG_TO_TIP } from "../../../utils/categorySlugMap";
import EcosystemLevel from "./EcosystemLevel";
import EcosystemTask from "./EcosystemTask";
import "./ProductEcosystem.css";

const Skeleton = () => (
  <div className="ecosystem-skeleton">
    <div className="ecosystem-skeleton__title eco-pulse" />
    <div className="ecosystem-skeleton__line eco-pulse" />
    <div className="ecosystem-skeleton__line eco-pulse" style={{ width: "75%" }} />
    <div className="ecosystem-skeleton__line eco-pulse" style={{ width: "85%" }} />
  </div>
);

const ProductEcosystem = () => {
  const { tipSlug } = useParams();
  const tip = TIP_SLUG_TO_TIP[tipSlug] || "";

  const { data, isLoading } = useGetEcosystemQuery(tip, { skip: !tip });

  if (!tip) return null;
  if (isLoading) return <Skeleton />;
  if (!data?.data) return null;

  const { critical = [], recommended = [], tasks = [] } = data.data;

  return (
    <div className="ecosystem-wrap">
      <h3 className="ecosystem-heading">Accesorii pentru {tip}</h3>

      <EcosystemLevel variant="critical"    items={critical} />
      <EcosystemLevel variant="recommended" items={recommended} />

      {tasks.length > 0 && (
        <div className="ecosystem-tasks">
          <p className="ecosystem-tasks__label">Depinde ce vrei să faci</p>
          {tasks.map((task) => (
            <EcosystemTask key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductEcosystem;
