import React from "react";
import MasterLayout from "../otherImages/MasterLayout";
import ClientDataTable from "../components/ClientDataTable";
import DefaultTopBar from "../components/DefaultTopBar";

const ManageClients = () => {
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        <DefaultTopBar
            title="Manage Clients"
            desc="View, create, edit, and manage client accounts efficiently."
            btnText="Add Client"
            btnLink="/add-client" 
        />

        {/* TableDataLayer */}
        <ClientDataTable />

      </MasterLayout>

    </>
  );
};

export default ManageClients; 
