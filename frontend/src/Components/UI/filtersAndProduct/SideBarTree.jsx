import React from "react";

const SideBarTree = () => {
  return (
    <div className="sidebar-container">
      <div className="filters">
        <div className="sidebar-tree-subdepartment">
          <a href="/laptopur-acessory/sd" className="sidebar-tree-head">
            Laptopuri si accesorii <span>(2999)</span>
          </a>
        </div>
        <div className="sidebar-tree-body">
          <div className="sidebar-tree-item">
            Laptopuri <span>(2000)</span>
          </div>
          <div className="sidebar-tree-item">
            Genti Laptop <span>(2000)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideBarTree;
