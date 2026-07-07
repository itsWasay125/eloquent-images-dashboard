import React from 'react'
import { Icon } from '@iconify/react';
import downArrow from "../otherImages/ArrowDown.svg"
import riseArrow from "../otherImages/ArrowRise.svg"
import thirdcard from "../otherImages/vector.svg"
import reverseIcon from "../otherImages/reverseIcon.png"
const UnitCountOne = () => {
    return (
        <>
        <h2 className='fs-2 mb-20   '>Overview</h2>
        <div className="row row-cols-lg-4 row-cols-sm-2 row-cols-1 gy-4">
            <div className="col">
                
                <div className="card shadow-none h-100 card-1">
                    <div className="card-body p-20">
                        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                            <div>
                                <p className="fw-medium blackColor mb-1 ">Invoices - This Month</p>
                                
                            </div>
                            <div className="w-40-px h-40-px bg-custom rounded-3 d-flex justify-content-center align-items-center">
                                <Icon
                                    icon="akar-icons:clipboard"
                                    className="text-white fs-4 mb-0"
                                />
                            </div>
                        </div>
                        <h6 className="mb-0 fs-2 blackColor">14 <span className="fs-4 fw-normal blackColor">Invoices</span></h6>
                        <div className="d-flex gap-0">
                        <p className="grey pe-10 border-right fw-normal text-lg mt-12 mb-0 d-flex align-items-center gap-2">                       
                           Paid: 7
                        </p>
                        <p className="grey ps-10 fw-normal text-lg mt-12 mb-0 d-flex align-items-center gap-2">                       
                           Overdue: 8
                        </p>
                        </div>
                    </div>
                </div>
                {/* card end */}
            </div>
            <div className="col">
            <div className="card shadow-none h-100 card-2">
                    <div className="card-body p-20">
                        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                            <div>
                                <p className="fw-medium mb-1 blackColor">Invoices - All Time</p>
                                
                            </div>
                            <div className="w-40-px h-40-px bg-custom-2 rounded-3 d-flex justify-content-center align-items-center">
                                <Icon
                                    icon="akar-icons:clipboard"
                                    className="text-white fs-4 mb-0"
                                />
                            </div>
                        </div>
                        <h6 className="mb-0 fs-2 blackColor">514 <span className="fs-4 fw-normal">Invoices</span></h6>
                        <div className="d-flex gap-0">
                        <p className="grey pe-10 fw-normal text-lg mt-12 mb-0 d-flex align-items-center gap-2">                       
                            Top Client: Harry
                        </p>
                        </div>
                    </div>
                </div>
                {/* card end */}
            </div>
            <div className="col">
            <div className="card shadow-none h-100 card-1">
                    <div className="card-body p-20">
                        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                            <div>
                                <p className="fw-medium blackColor mb-1">Clients - This Month</p>
                                
                            </div>
                            <div className="w-40-px h-40-px bg-custom-3 rounded-3 d-flex justify-content-center align-items-center">
                                <img src={thirdcard} style={{ width: '20px', height: '20px',}}/>
                            </div>
                        </div>
                        <h6 className="mb-0 fs-2 blackColor">10 <span className="fs-4 fw-normal">Clients</span></h6>
                        <div className="d-flex gap-0">
                        <p className="grey pe-10 fw-normal text-lg mt-12 mb-0 d-flex align-items-center gap-2 ">                       
                        <img src={downArrow} style={{ width: '25px', height: '25px',}} />+5 from last month
                        </p>
                        </div>
                    </div>
                </div>
                {/* card end */}
            </div>
            <div className="col">
            <div className="card shadow-none h-100 card-2">
                    <div className="card-body p-20">
                        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                            <div>
                                <p className="fw-medium blackColor mb-1">Clients - All Time</p>
                                
                            </div>
                            <div className="w-40-px h-40-px bg-custom-3 rounded-3 d-flex justify-content-center align-items-center">
                                <img src={thirdcard} style={{ width: '20px', height: '20px',}}/>
                            </div>
                        </div>
                        <h6 className="mb-0 fs-2 blackColor">714 <span className="fs-4 fw-normal">Clients</span></h6>
                        <div className="d-flex gap-0">
                        <p className="grey pe-10 fw-normal text-lg mt-12 mb-0 d-flex align-items-center gap-2">                       
                        <Icon icon="carbon:ibm-cloud-backup-and-recovery" width="20" height="20" />33% Repeat Clients
                        </p>
                        </div>
                    </div>
                </div>
                {/* card end */}
            </div> 
        </div>
        </>
    )
}

export default UnitCountOne