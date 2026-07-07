import React from "react";
import MasterLayout from "../otherImages/MasterLayout";
import LoginDataTable from "../components/LoginDataTable";
import DefaultTopBar from "../components/DefaultTopBar";

const LoginHistoryPage = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout> 

        <DefaultTopBar
            title="Login History"
            desc="Monitor login attempts and track account access history."
        />

        {/* TableDataLayer */}
        <LoginDataTable />

      </MasterLayout>

    </>
  );
};

export default LoginHistoryPage; 
