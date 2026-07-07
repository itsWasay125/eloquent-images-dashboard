import MasterLayout from "../otherImages/MasterLayout";
import DefaultTopBar from "../components/DefaultTopBar";
import InvoiceDataTable from "../components/InvoiceDataTable";

const ManageInvoices = () => {
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        <DefaultTopBar
            title="Manage Invoices"
            desc="View, create, edit, and manage client accounts efficiently."
            btnText="Add New Link"
            btnLink="/create-invoice" 
        />

        {/* TableDataLayer */}
        <InvoiceDataTable />

      </MasterLayout>

    </>
  );
};

export default ManageInvoices; 
