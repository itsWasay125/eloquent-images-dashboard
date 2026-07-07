import { Icon } from '@iconify/react/dist/iconify.js'
import DefaultAvatar from '../otherImages/default.png';
import DP1 from '../otherImages/dp-1.png';
import DP2 from '../otherImages/dp-2.png';
import DP3 from '../otherImages/dp-3.png';
import { useNavigate } from 'react-router-dom';
import MUIDataTable from 'mui-datatables';
import Swal from 'sweetalert2';
 
const ClientInvoiceList = () => {
    const navigate = useNavigate();
    const invoiceColumns = [
  {
    name: 'clientName',
    label: 'Client Name',
    options: {
      customBodyRender: (value, tableMeta) => {
        const row = invoiceData[tableMeta.rowIndex];
        return (
          <div className="d-flex align-items-center gap-8">
            <img
              style={{ height: "35px", width: "35px", borderRadius: "50%" }}
              src={row.clientImage || DefaultAvatar}
              alt="clientName"
            />
            {value}
          </div>
        );
      }
    }
  },
  {
    name: 'invoiceNumber',
    label: 'Invoice #'
  },
  {
    name: 'price',
    label: 'Price',
    options: {
        customBodyRender: (value) => {
            const safeVal = value.toFixed(2).replace('.', '-');
            return (
            <span className={`col-price val-${safeVal} font-bold`}>
                ${value.toFixed(2)}
            </span>
            );
        }
        }
  },
  {
    name: 'paymentStatus',
    label: 'Payment Status',
    options: {
      customBodyRender: (value) => {
        const colorClass =
            value === 'Recieved' ? 'bg-green-100 text-green-800' :
            value === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800';
            const safeVal = value.toLowerCase().replace(/\s+/g, '-');
            return (
            <span className={`paymentStatus-cell ${safeVal} px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${colorClass}`}>
                {value}
            </span>
            );
      }
    }
  },
  {
    name: 'dueDate',
    label: 'Due Date'
  },
  {
    name: 'Manage',
    label: 'Manage',
    options: {
      filter: false,
      sort: false,
      customBodyRenderLite: (dataIndex) => {
        const row = invoiceData[dataIndex];
        return (
          <div className="btnDiv">
            <Icon
              onClick={() => handleEditPackage(row)}
              className="editBtn hover: cursor-pointer"
              icon="line-md:edit"
              width="24"
              height="24"
            />
            <Icon
              onClick={() => handleDeletePackage(row)}
              className="deleteBtn hover: cursor-pointer"
              icon="material-symbols:delete-outline"
              width="24"
              height="24"
            />
          </div>
        );
      }
    }
  }
];

    
      // Your data (later can be replaced with API call)
      const invoiceData = [
        {
          id: 'NV-1001',
          clientImage:DP1,
          clientName: 'Juan Neck',
          invoiceNumber: 'NV-1001',
          price: 5750.00,
          paymentStatus: 'RECEIVED',
          dueDate: '12 March'
        },
        {
          id: 'NV-1002',
          clientImage:"",
          clientName: 'Harry Clinton',
          invoiceNumber: 'NV-1002',
          price: 5750.00,
          paymentStatus: 'Cancelled',
          dueDate: '15 March'
        },
        {
          id: 'NV-1003',
          clientImage:DP2,
          clientName: 'Wendor D',
          invoiceNumber: 'NV-1003',
          price: 5720.00,
          paymentStatus: 'PENDING',
          dueDate: '17 March'
        },
        {
          id: 'NV-1004',
          clientImage:DP3,
          clientName: 'Sapphire',
          invoiceNumber: 'NV-1004',
          price: 5750.00,
          paymentStatus: 'RECEIVED',
          dueDate: '12 March'
        }
      ];
    
      const handleEditPackage = () => {
        navigate('/'); 
      };

      const handleDeletePackage = () => {
        Swal.fire({ icon: "success", title: "Deleted successfully" });
      };

        const options = {
    selectableRows: 'none',
    rowsPerPage: 10,
    responsive: 'standard',
    elevation: 0,
    print: false,
    download: false,
    viewColumns: false,
    filter: false,
    search: true,
    // searchOpen: true,
  };


    return (
        <>
        <h2 className='fs-2 mt-40'>Client Invoices List</h2>
        {/* <DynamicTable
        columns={invoiceColumns}
        data={invoiceData}
        keyField="id"
        // onRowClick={handleRowClick}
        className="overflow-hidden "
    /> */}
      <MUIDataTable
          data={invoiceData}
          columns={invoiceColumns}
          options={options}
          className="overflow-hidden packageTable"
        />
    </>
    )
}

export default ClientInvoiceList
