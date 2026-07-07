import React from "react";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";

const DefaultTopBar = ({ title, desc, btnText, btnLink, btnOnClick }) => {
  return (
    <div className='d-flex flex-wrap align-items-center justify-content-between gap-3 mb-24'>
      <div>
        <h2 className='fw-bold mb-10 fs-2'>{title}</h2>
        <p>{desc}</p>
      </div> 
      {btnLink ?
      <div className="buttonDiv d-flex gap-10">
        {btnLink ? (
          <Link to={btnLink} className="btn bg-secondary d-flex gap-10">
            <Icon icon="akar-icons:plus" className="fs-4 mb-0" />
            {btnText}
          </Link>
        ) : (
          <button 
            onClick={btnOnClick} 
            className="btn bg-secondary d-flex gap-10"
          >
            <Icon icon="akar-icons:plus" className="fs-4 mb-0" />
            {btnText}
          </button>
        )}
      </div>
      : <div></div>}
    </div>
  );
};

export default DefaultTopBar;