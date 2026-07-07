import React, { useState, useMemo } from "react";
import MUIDataTable from "mui-datatables";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const LoginDataTable = () => {
  const [startDate, setStartDate] = useState(new Date("2025-01-01"));
  const [endDate, setEndDate] = useState(new Date("2025-12-10"));
  const [filter, setFilter] = useState("");

  const loginData = [
    {
      id: "U-001",
      clientsName: "Peter Webb",
      time: "02:19:02 PM",
      date: "26 May 2025",
      internalIP: "192.168.1.10",
      externalIP: "103.55.200.12",
      type: "Login",
      success: "True",
    },
    {
      id: "U-002",
      clientsName: "Peter Webb",
      time: "02:19:02 PM",
      date: "20 Jun 2025",
      internalIP: "192.168.1.10",
      externalIP: "103.55.200.12",
      type: "Login",
      success: "True",
    },
    {
      id: "U-003",
      clientsName: "Peter Webb",
      time: "02:19:02 PM",
      date: "06 July 2025",
      internalIP: "192.168.1.10",
      externalIP: "103.55.200.12",
      type: "Login",
      success: "True",
    },
    {
      id: "U-004",
      clientsName: "Eric Sanchez",
      time: "02:19:02 PM",
      date: "16 Aug 2025",
      internalIP: "192.168.1.10",
      externalIP: "103.55.200.12",
      type: "Login",
      success: "True",
    },
    {
      id: "U-005",
      clientsName: "Jay Brown",
      time: "02:19:02 PM",
      date: "12 Sep 2025",
      internalIP: "192.168.1.10",
      externalIP: "103.55.200.12",
      type: "Logout",
      success: "True",
    },
    {
      id: "U-006",
      clientsName: "Jay Brown",
      time: "02:19:02 PM",
      date: "28 Oct 2025",
      internalIP: "192.168.1.10",
      externalIP: "103.55.200.12",
      type: "Logout",
      success: "True",
    },
    {
      id: "U-007",
      clientsName: "Peter Webb",
      time: "02:19:02 PM",
      date: "02 Nov 2025",
      internalIP: "192.168.1.10",
      externalIP: "103.55.200.12",
      type: "Login",
      success: "True",
    },
    {
      id: "U-008",
      clientsName: "Kevin",
      time: "02:19:02 PM",
      date: "10 Jan 2025",
      internalIP: "192.168.1.10",
      externalIP: "103.55.200.12",
      type: "Login",
      success: "True",
    },
    {
      id: "U-009",
      clientsName: "Peter Webb",
      time: "02:19:02 PM",
      date: "18 Dec 2025",
      internalIP: "192.168.1.10",
      externalIP: "103.55.200.12",
      type: "Login",
      success: "True",
    },
    {
      id: "U-010",
      clientsName: "Eric Sanchez",
      time: "02:19:02 PM",
      date: "21 Jan 2025",
      internalIP: "192.168.1.10",
      externalIP: "103.55.200.12",
      type: "Login",
      success: "True",
    },
    {
      id: "U-011",
      clientsName: "Jay Brown",
      time: "02:19:02 PM",
      date: "17 Feb 2025",
      internalIP: "192.168.1.10",
      externalIP: "103.55.200.12",
      type: "Logout",
      success: "True",
    },
    {
      id: "U-012",
      clientsName: "Jay Brown",
      time: "02:19:02 PM",
      date: "08 Jan 2025",
      internalIP: "192.168.1.10",
      externalIP: "103.55.200.12",
      type: "Logout",
      success: "True",
    },
  ];

  const CustomInput = ({ value, onClick }) => (
    <button
      className="btn btn-outline-secondary d-flex align-items-center gap-2"
      onClick={onClick}
    >
      <Icon icon="uil:calender" width="18" />
      <span>{value}</span>
    </button>
  );

  const filteredData = useMemo(() => {
    return loginData.filter((pkg) => {
      const rowDate = new Date(pkg.date);
      const isInDateRange =
        rowDate >= new Date(startDate.setHours(0, 0, 0, 0)) &&
        rowDate <= new Date(endDate.setHours(23, 59, 59, 999));
      const isInTypeFilter = !filter || pkg.clientsName === filter;
      return isInDateRange && isInTypeFilter;
    });
  }, [startDate, endDate, filter]);

  const columns = [
    {
      name: "clientsName",
      label: "Client Name",
      options: {
        customBodyRender: (value) => (
          <span
            className={`col-client-name val-${value
              .toLowerCase()
              .replace(/\s+/g, "-")}`}
          >
            {value}
          </span>
        ),
      },
    },
    {
      name: "time",
      label: "Time",
      options: {
        customBodyRender: (value) => (
          <span className={`col-time val-${value.replace(/:/g, "-")}`}>
            {value}
          </span>
        ),
      },
    },
    {
      name: "internalIP",
      label: "Internal IP",
      options: {
        customBodyRender: (value) => (
          <span className={`col-internal-ip val-${value.replace(/\./g, "-")}`}>
            {value}
          </span>
        ),
      },
    },
    {
      name: "externalIP",
      label: "External IP",
      options: {
        customBodyRender: (value) => (
          <span className={`col-external-ip val-${value.replace(/\./g, "-")}`}>
            {value}
          </span>
        ),
      },
    },
    {
      name: "type",
      label: "Type",
      options: {
        customBodyRender: (value) => {
          const colorClass =
            value === "Login"
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800";

          return (
            <span
              className={`col-type px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}
            >
              {value}
            </span>
          );
        },
      },
    },
    {
      name: "date",
      label: "Date",
      options: {
        customBodyRender: (value) => (
          <span
            className={`col-date val-${value
              .toLowerCase()
              .replace(/\s+/g, "-")}`}
          >
            {value}
          </span>
        ),
      },
    },
    {
      name: "success",
      label: "Success",
      options: {
        customBodyRender: (value) => {
          const colorClass =
            value === "True"
              ? "text-green-600 font-bold"
              : "text-red-600 font-bold";

          return <span className={`col-success ${colorClass}`}>{value}</span>;
        },
      },
    },
  ];

  const options = {
    selectableRows: "none",
    rowsPerPage: 10,
    responsive: "standard",
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
          <h3 className="fs-3 fw-semibold">
            {filter === "all clients" ? "All Invoices" : "Security and Confidentiality Report"}
          </h3>
        </div>
        <div class="filterWrapper">
          <div className="d-flex align-items-center gap-2">
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              customInput={<CustomInput />}
              dateFormat="dd MMM yyyy"
            />
            <span>-</span>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              customInput={<CustomInput />}
              dateFormat="dd MMM yyyy"
            />
          </div>
          {/* <div className="filter-select">
            <select
              className="form-select"
              value={filter}
              id="packageTypeFilter"
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="">All Clients</option>
              <option value="Peter Webb">Peter Webb</option>
              <option value="Eric Sanchez">Eric Sanchez</option>
              <option value="Kevin">Kevin</option>
              <option value="Jay Brown">Jay Brown</option>
            </select>
          </div> */}
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

export default LoginDataTable;
