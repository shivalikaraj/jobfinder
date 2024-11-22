/* eslint-disable react/prop-types */
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children, type }) => {
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { company } = useSelector((state) => state.company);

  //Restricting routes as per logged in user type
  useEffect(() => {
    if (type === "user" && company) {
      navigate("/");
    } else if (type === "company" && user) {
      navigate("/");
    }
  }, [type, user, company, navigate]);

  return <>{children}</>;
};

export default ProtectedRoute