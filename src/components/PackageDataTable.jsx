import React, { useState, useMemo } from 'react';
import MUIDataTable from 'mui-datatables';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import DefaultAvatar from '../otherImages/default.png';
import Swal from 'sweetalert2';
import DP1 from '../otherImages/dp-1.png';
import DP2 from '../otherImages/dp-2.png';
import DP3 from '../otherImages/dp-3.png';
import DP4 from '../otherImages/dp-4.png';
import DP5 from '../otherImages/dp-5.png';
import DP6 from '../otherImages/dp-6.png';
 
    const PackageDataTable = () => {
    const [startDate, setStartDate] = useState(new Date('2025-01-01'));
    const [endDate, setEndDate] = useState(new Date('2025-12-10'));
    const [filter, setFilter] = useState('');
    const navigate = useNavigate();

    const handleEditPackage = (rowData) => {
        navigate('/edit-package', { state: { package: rowData } });
      };

    const handleDeletePackage = () => {
        Swal.fire({ icon: "success", title: "Deleted successfully" });
    };

    const packageData = [
        { id: 'PKG-001', packageName: 'Website Development - Basic', packageImage: DP1, date: '26 May 2025', description: 'Lorem details about what the package includes', price: 750.00, packageType: 'WEBSITE' },
        { id: 'PKG-002', packageName: 'Website Development - Basic', packageImage: DP2, date: '20 Jun 2025', description: 'Lorem details about what the package includes', price: 750.00, packageType: 'App' },
        { id: 'PKG-003', packageName: 'Website Development - Basic', packageImage: DP3, date: '06 July 2025', description: 'Lorem details about what the package includes', price: 750.00, packageType: 'WEBSITE' },
        { id: 'PKG-004', packageName: 'Social Media Package', packageImage: DP4, date: '16 Aug 2025', description: 'Lorem details about what the package includes', price: 500.00, packageType: 'SOCIAL MEDIA' },
        { id: 'PKG-005', packageName: 'Mobile App Development', packageImage: DP5, date: '12 Sep 2025', description: 'Lorem details about what the package includes', price: 1200.00, packageType: 'SEO' },
        { id: 'PKG-006', packageName: 'Mobile App Development', packageImage: DP6, date: '28 Oct 2025', description: 'Lorem details about what the package includes', price: 5000.00, packageType: 'App' },
        { id: 'PKG-007', packageName: 'Website Development - Basic', packageImage: DP1, date: '02 Nov 2025', description: 'Lorem details about what the package includes', price: 750.00, packageType: 'WEBSITE' },
        { id: 'PKG-008', packageName: 'Website Development - Basic', packageImage: DP2, date: '10 Jan 2025', description: 'Lorem details about what the package includes', price: 750.00, packageType: 'App' },
        { id: 'PKG-009', packageName: 'Website Development - Basic', packageImage: DP3, date: '18 Dec 2025', description: 'Lorem details about what the package includes', price: 750.00, packageType: 'WEBSITE' },
        { id: 'PKG-010', packageName: 'Social Media Package', packageImage: DP4, date: '21 Jan 2025', description: 'Lorem details about what the package includes', price: 500.00, packageType: 'SOCIAL MEDIA' },
        { id: 'PKG-011', packageName: 'Mobile App Development', packageImage: DP5, date: '17 Feb 2025', description: 'Lorem details about what the package includes', price: 1200.00, packageType: 'SEO' },
        { id: 'PKG-012', packageName: 'Mobile App Development', packageImage: DP6, date: '08 Jan 2025', description: 'Lorem details about what the package includes', price: 5000.00, packageType: 'App' },
    ];

    const CustomInput = ({ value, onClick }) => (
        <button className="btn btn-outline-secondary d-flex align-items-center gap-2" onClick={onClick}>
        <Icon icon="uil:calender" width="18" />
        <span>{value}</span>
        </button>
    );

    const filteredData = useMemo(() => {
        return packageData.filter(pkg => {
        const rowDate = new Date(pkg.date);
        const isInDateRange = rowDate >= new Date(startDate.setHours(0, 0, 0, 0)) &&
                                rowDate <= new Date(endDate.setHours(23, 59, 59, 999));
        const isInTypeFilter = !filter || pkg.packageType === filter;
        return isInDateRange && isInTypeFilter;
        });
    }, [startDate, endDate, filter]);

    const columns = [
    {
        name: 'packageName',
        label: 'Package Name',
        options: {
        customBodyRender: (value, tableMeta) => {
            const safeVal = value.toLowerCase().replace(/\s+/g, '_');
            return (
            <div className={`col-packageName val-${safeVal} d-flex align-items-center gap-8`}>
                <img
                style={{ height: "35px", width: "35px", borderRadius: "50%" }}
                src={filteredData[tableMeta.rowIndex].packageImage || DefaultAvatar}
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
        name: 'description',
        label: 'Description',
        options: {
        customBodyRender: (value) => {
            const safeVal = value.toLowerCase().replace(/\s+/g, '-');
            return (
            <span className={`col-description val-${safeVal}`}>
                {value}
            </span>
            );
        }
        }
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
        name: 'packageType',
        label: 'Package Type',
        options: {
        customBodyRender: (value) => {
            const colorClass =
            value === 'WEBSITE' ? 'bg-blue-100 text-blue-800' :
            value === 'SOCIAL MEDIA' ? 'bg-purple-100 text-purple-800' :
            'bg-green-100 text-green-800';
            const safeVal = value.toLowerCase().replace(/\s+/g, '-');
            return (
            <span className={`col-packageType ${safeVal} px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
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
      const rowData = filteredData[dataIndex]; // Or use original data if needed

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
}
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
            <div className="d-flex align-items-center gap-2">
            <DatePicker
                selected={startDate}
                onChange={date => setStartDate(date)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                customInput={<CustomInput />}
                dateFormat="dd MMM yyyy"
            />
            <span>-</span>
            <DatePicker
                selected={endDate}
                onChange={date => setEndDate(date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                customInput={<CustomInput />}
                dateFormat="dd MMM yyyy"
            />
            </div>
            <div className="filter-select">
            <select
                className="form-select"
                value={filter}
                id="packageTypeFilter"
                onChange={(e) => setFilter(e.target.value)}
            >
                <option value="">All Type</option>
                <option value="WEBSITE">Website</option>
                <option value="App">App</option>
                <option value="SEO">SEO</option>
                <option value="SOCIAL MEDIA">Social Media</option>
            </select>
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

    export default PackageDataTable;
