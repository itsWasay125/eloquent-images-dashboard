import React from "react";
import MasterLayout from "../otherImages/MasterLayout";
import DashBoardLayerOne from "../components/DashBoardLayerOne";
import HomeTopBar from "../components/HomeTopBar";

const HomePageOne = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        <HomeTopBar  
         title="Welcome Back, John Doe!"
         desc="Your recruitment metrics and activities at a glance"
         btnText="Create Client"
         btnLink="/add-client"
         btnText2="Create Invoice"
         btnLink2="/create-invoice"

        />


        {/* DashBoardLayerOne */}
        <DashBoardLayerOne />

      </MasterLayout>
    </>
  );
};

export default HomePageOne;
