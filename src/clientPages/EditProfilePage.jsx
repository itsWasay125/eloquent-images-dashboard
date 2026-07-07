import React from "react";
import MasterLayout from "../otherImages/MasterLayout";
import DefaultTopBar from "../components/DefaultTopBar";
import HomeTopBar from "../components/HomeTopBar";
import profilePic from "../otherImages/UserPic.png";
import EmailAvatar from "../otherImages/EmailAvator.png";

const EditProfilePage = () => {
  return (
    <MasterLayout>
      <HomeTopBar
        title="Welcome Back, John Doe!"
        desc="Your recruitment metrics and activities at a glance"
      />
      <DefaultTopBar  
        title="Edit Employee Details"
      />

      <div className="card p-5">
        {/* Top User Profile Info */}
        <div className="d-flex justify-content-between align-items-center flex-wrap mb-4">
          <div className="d-flex align-items-center gap-3">
            <img
              src={profilePic}
              alt="Profile"
              style={{ width: "60px", height: "60px", borderRadius: "50%" }}
            />
            <div>
              <h5 className="mb-0 fw-semibold">Alexa Rawles</h5>
              <span className="text-secondary-light">alexarawles@gmail.com</span>
            </div>
          </div>
        </div>

        {/* Form Fields */}
        <div className="row gy-3 mt-4">
          <div className="col-md-6">
            <label className="form-label fw-medium">Full Name</label>
            <input
              type="text"
              className="form-control p-3 form-control1"
              placeholder="Alexa Rawles"
            />
          </div>
          <div className="col-md-6">
            <label className="form-label fw-medium">Email</label>
            <input
              type="email"
              className="form-control p-3 form-control1"
              placeholder="For eg. alexarawles@gmail.com"
            />
          </div>
          <div className="col-md-6">
            <label className="form-label fw-medium">Phone Number</label>
            <div className="d-flex">
              <input type="text" className="form-control form-control1 p-3" placeholder="+01"/>
            </div>
          </div>
          <div className="col-md-6">
            <label className="form-label fw-medium">Address</label>
            <input type="text" className="form-control1 form-control p-3" />
          </div>
        </div>

        {/* Email Address List */}
        <div className="mt-5">
          <h6 className="fw-bold mb-3">My Email Address</h6>
          <div className="d-flex align-items-center gap-3 mb-3">
            <img
              src={EmailAvatar}
              alt="email avatar"
              style={{ width: "45px", height: "45px", borderRadius: "50%" }}
            />
            <div>
              <p className="mb-0 fw-semibold">alexarawles@gmail.com</p>
              <small className="text-muted">1 month ago</small>
            </div>
          </div>
          <button className="btn bg-gray">+ Add Email Address</button>
        </div>
      </div>
    </MasterLayout>
  );
};

export default EditProfilePage;