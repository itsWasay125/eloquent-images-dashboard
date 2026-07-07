import React from 'react'
import SalesStatisticOne from '../components/SalesStatisticOne';
import UsersOverviewOne from '../components/UsersOverviewOne';
import ClientInvoiceList from '../components/ClientInvoiceList';
import UnitCountOne from '../components/UnitCountOne';
import UsersOverviewTwo from '../components/UsersOverviewTwo';

const DashBoardLayerOne = () => {

    return (
        <>
            {/* UnitCountOne */}
            <UnitCountOne />

            <section className="row gy-4 mt-1">

                {/* SalesStatisticOne */}
                <SalesStatisticOne />

                {/* UsersOverviewOne */}
                <UsersOverviewOne />

                <UsersOverviewTwo />

                {/* LatestRegisteredOne */}
                <ClientInvoiceList/>

            </section>
        </>


    )
}

export default DashBoardLayerOne