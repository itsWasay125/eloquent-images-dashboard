import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { getAuthSession } from "../api/eloquentApi";

const ProtectedRoute = ({ element: Component }) => {
  const navigate = useNavigate();
  const [authed, setAuthed] = useState(() => Boolean(getAuthSession()?.token));

  useEffect(() => {
    const check = () => {
      if (!getAuthSession()?.token) {
        setAuthed(false);
        navigate("/", { replace: true });
      }
    };

    const intervalId = setInterval(check, 60 * 1000);
    return () => clearInterval(intervalId);
  }, [navigate]);

  if (!authed) {
    return <Navigate to="/" replace />;
  }

  return <Component />;
};

export default ProtectedRoute;
