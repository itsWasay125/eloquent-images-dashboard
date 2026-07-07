import React, { useState, useMemo } from 'react';
import MUIDataTable from 'mui-datatables';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import Swal from 'sweetalert2';
import 'react-datepicker/dist/react-datepicker.css';
import DefaultAvatar from '../otherImages/default.png';
import DP1 from '../otherImages/dp-1.png';
import DP2 from '../otherImages/dp-2.png';
import DP3 from '../otherImages/dp-3.png';
import DP4 from '../otherImages/dp-4.png';
import DP5 from '../otherImages/dp-5.png';
import DP6 from '../otherImages/dp-6.png';

const ClientDataTable = () => {
  const [filter, setFilter] = useState('monthly');
  const navigate = useNavigate();

  const handleEditPackage = (rowData) => {
        navigate('/edit-client', { state: { client: rowData } });
      };

  const handleDeletePackage = () => {
    Swal.fire({ icon: "success", title: "Deleted successfully" });
  };

  const clientData = [
    { id: 'CL-001', clientName: 'Pristia Candra', clientImage: DP1, date: '26 May 2025', email: 'lorem@dummy.com', phone: '963258741874',assignedPackages:'Website Development - Basic' },
    { id: 'CL-002', clientName: 'Hanna Baptista', clientImage: DP2, date: '20 May 2025', email: 'lorem@dummy.com', phone: '963258741874', assignedPackages:'Website Development'},
    { id: 'CL-003', clientName: 'Miracle Geidt', clientImage: DP3, date: '06 Jun 2025', email: 'lorem@dummy.com', phone: '963258741874',assignedPackages:'Mobile Application' },
    { id: 'CL-004', clientName: 'Rayna Torff', clientImage: DP4, date: '16 Apr 2025', email: 'lorem@dummy.com', phone: '963258741874',assignedPackages:'Social Media Management' },
    { id: 'CL-005', clientName: 'Giana Lipshutz', clientImage: DP5, date: '12 Oct 2025', email: 'lorem@dummy.com', phone: '963258741874',assignedPackages:'Website Development' },
    { id: 'CL-006', clientName: 'James George', clientImage: DP6, date: '28 Nov 2025', email: 'lorem@dummy.com', phone: '963258741874',assignedPackages:'Website Development - Basic' },
    { id: 'CL-007', clientName: 'Jordyn George', clientImage: DP1, date: '02 Sep 2025', email: 'lorem@dummy.com', phone: '963258741874',assignedPackages:'Website Development ' },
    { id: 'CL-008', clientName: 'Giana Lipshutz', clientImage: DP2, date: '10 May 2025', email: 'lorem@dummy.com', phone: '963258741874',assignedPackages:'Social Media Management' },
    { id: 'CL-009', clientName: 'Pristia Candra', clientImage: DP3, date: '18 Dec 2025', email: 'lorem@dummy.com', phone: '963258741874',assignedPackages:'Mobile Application' },
    { id: 'CL-010', clientName: 'Giana Lipshutz', clientImage: DP4, date: '21 Feb 2025', email: 'lorem@dummy.com', phone: '963258741874',assignedPackages:'Website Development - Basic' },
    { id: 'CL-011', clientName: 'Rayna Torff', clientImage: DP5, date: '17 May 2025', email: 'lorem@dummy.com', phone: '963258741874', assignedPackages:'Social Media Management'},   
    { id: 'CL-012', clientName: 'Jordyn George', clientImage: DP6, date: '08 May 2025', email: 'lorem@dummy.com', phone: '963258741874',assignedPackages:'Website Development' },
  ];


  const filteredData = useMemo(() => {
    if (filter === 'monthly') {
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      return clientData.filter(pkg => {
        const rowDate = new Date(pkg.date);
        return rowDate.getMonth() === currentMonth && rowDate.getFullYear() === currentYear;
      });
    }
    return clientData;
  }, [filter]);

  const columns = [
  {
    name: 'clientName',
    label: 'Client Name',
    options: {
      customBodyRender: (value, tableMeta) => {
        const safeVal = value.toLowerCase().replace(/\s+/g, '_');
        return (
          <div className={`col-clientName val-${safeVal} d-flex align-items-center gap-8`}>
            <img
              style={{ height: "35px", width: "35px", borderRadius: "50%" }}
              src={filteredData[tableMeta.rowIndex].clientImage || DefaultAvatar}
              alt="package"
            />
            {value}
          </div>
        );
      }
    }
  },
  {
    name: 'date',
    label: 'Date',
    options: {
      customBodyRender: (value) => {
        const safeVal = value.toLowerCase().replace(/\s+/g, '-');
        return (
          <span className={`col-date val-${safeVal} text-gray-600`}>
            {value}
          </span>
        );
      }
    }
  },
  {
    name: 'email',
    label: 'Email Address',
    options: {
      customBodyRender: (value) => {
        const safeVal = value.toLowerCase().replace(/\s+/g, '-');
        return (
          <span className={`col-email val-${safeVal}`}>
            {value}
          </span>
        );
      }
    }
  },
  {
    name: 'phone',
    label: 'Phone',
    options: {
      customBodyRender: (value) => {
        const safeVal = value.replace('.', '-');
        return (
          <span className={`col-phone val-${safeVal} font-bold`}>
            {value}
          </span>
        );
      }
    }
  },
  {
    name: 'assignedPackages',
    label: 'Assigned Packages',
    options: {
      customBodyRender: (value) => {
        const safeVal = value.toLowerCase().replace(/\s+/g, '-');
        return (
          <span className={`col-assigned ${safeVal} px-2 py-1 rounded-full font-medium`}>
            {value}
          </span>
        );
      }
    }
  },
 {
   name: 'Manage',
   label: 'Manage',
   options: {
     filter: false,
     sort: false,
     customBodyRenderLite: (dataIndex) => {
       const rowData = filteredData[dataIndex]; 
       return (
         <div>
         <Icon
           onClick={() => handleEditPackage(rowData)}
           className="editBtn hover: cursor-pointer"
           icon="line-md:edit"
           width="24"
           height="24"
         />
         <Icon onClick={handleDeletePackage} className="deleteBtn hover: cursor-pointer" icon="material-symbols:delete-outline" width="24" height="24" />
         </div>
       );
     },
   },
 },
];


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
    <div className="card basic-data-table">
      <div className="card-header d-flex justify-content-between align-items-center">
          <div class="tableHeading">
            <h3 className='fs-3 fw-semibold'>
              {filter === "all"
                ? "All Client Overview"
                : "Monthly Client Overview"}
            </h3>
          </div>
          <div className="custom-toggle">
            <div className="toggle-container">
              <div
                className={`toggle-indicator ${
                  filter === "all" ? "right" : "left"
                }`}
              />
              <div
                className={`toggle-option ${
                  filter === "monthly" ? "active" : ""
                }`}
                onClick={() => setFilter("monthly")}
              >
                <Icon icon="mdi:account" width="22" />
                <span>This Month</span>
              </div>
              <div
                className={`toggle-option ${filter === "all" ? "active" : ""}`}
                onClick={() => setFilter("all")}
              >
                <Icon icon="mdi:account-group" width="25" />
                <span>All Time</span>
              </div>
            </div>
          </div>
      </div>
      <div className="card-body">
        <MUIDataTable
          data={filteredData}
          columns={columns}
          options={options}
          className="overflow-hidden packageTable"
        />
      </div>
    </div>
  );
};

export default ClientDataTable;
