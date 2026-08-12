import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { clearAuthSession, getAuthSession, isAdminSession } from "../api/eloquentApi";

function hasAdminAccess() {
  const session = getAuthSession();
  return Boolean(session?.token && isAdminSession(session));
}

const ProtectedRoute = ({ element: Component }) => {
  const navigate = useNavigate();
  const [authed, setAuthed] = useState(hasAdminAccess);

  useEffect(() => {
    const check = () => {
      if (!hasAdminAccess()) {
        clearAuthSession();
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
