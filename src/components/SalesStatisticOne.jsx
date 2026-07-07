import { Icon } from '@iconify/react/dist/iconify.js';
import React from 'react';
import ReactApexChart from 'react-apexcharts';

const SalesStatisticOne = () => {
    // let { chartOptions, chartSeries } = useReactApexChart();
    let chartSeries = [
        {
          name: "This month",
          data: [10, 20, 12, 25, 45, 42, 60, 50, 40, 50,],
        },
      ];
    
      let chartOptions = {
        chart: {
          height: 264,
          type: "line",
          toolbar: {
            show: false,
          },
          zoom: {
            enabled: false,
          },
          dropShadow: {
            enabled: false,
            top: 6,
            left: 0,
            blur: 4,
            color: "#000",
            opacity: 0.1,
          },
        },
    
        fill: {
          type: "gradient",
          gradient: {
            shadeIntensity: 1,
            inverseColors: false,
            opacityFrom: 0,
            opacityTo: 0,
            stops: [0, 90, 100],
          },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          curve: "smooth",
          colors: ["#bbb"], // Specify the line color here
          width: 3,
        },
        markers: {
          size: 0,
          strokeWidth: 3,
          hover: {
            size: 8,
          },
        },
        tooltip: {
          enabled: true,
          x: {
            show: true,
          },
          y: {
            show: false,
          },
          z: {
            show: false,
          },
        },
        grid: {
          row: {
            colors: ["transparent", "transparent"], // takes an array which will be repeated on columns
            opacity: 0.5,
          },
          borderColor: "#D1D5DB",
          strokeDashArray: 3,
        },
        yaxis: {
          labels: {
            formatter: function (value) {
              return value;
            },
            style: {
              fontSize: "14px",
            },
          },
        },
        xaxis: {
          categories: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ],
          tooltip: {
            enabled: false,
          },
          labels: {
            formatter: function (value) {
              return value;
            },
            style: {
              fontSize: "14px",
            },
          },
          axisBorder: {
            show: false,
          },
          crosshairs: {
            show: true,
            width: 20,
            stroke: {
              width: 0,
            },
            fill: {
              type: "solid",
              color: "#487FFF40",
            },
          },
        },
      };
    return (
        <div className="col-xxl-6 col-xl-12">
            <div className="card h-100">
                <div className="card-body">
                    <div className="d-flex flex-wrap align-items-center justify-content-start mb-3 mt-20">
                        <h6 className="text-lg mb-0 mt-0">Invoices Growth</h6>
                        <ul className='salesList'>
                          <li className="text-sm fw-semibold">X-axis: Months</li>
                          <li className="text-sm fw-semibold">Y-axis: Number of Invoices</li>
                        </ul>
                    </div>
                    <ReactApexChart options={chartOptions} series={chartSeries} type="area" height={264} />
                </div>
            </div>
        </div>
    );
};

export default SalesStatisticOne;