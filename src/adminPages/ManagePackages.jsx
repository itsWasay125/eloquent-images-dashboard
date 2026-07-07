import React from "react";
import MasterLayout from "../otherImages/MasterLayout";
import PackageDataTable from "../components/PackageDataTable";
import DefaultTopBar from "../components/DefaultTopBar";

const ManagePackages = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout> 

        <DefaultTopBar
            title="Manage Packages"
            desc="View, create, edit, and manage client accounts efficiently."
            btnText="Add New Package"
            btnLink="/add-package" 
        />

        {/* TableDataLayer */}
        <PackageDataTable />

      </MasterLayout>

    </>
  );
};

export default ManagePackages; 
