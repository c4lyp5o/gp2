import { Navigate } from "react-router-dom";
import { useGlobalAdminAppContext } from "../context/adminAppContext";

function AdminProtectedRoute({ children, token }) {
  // const { admin } = useGlobalAdminAppContext();
  // const { admin } = token;

  if (!token) {
    return <Navigate to="/" />;
  }
  return children;
}

export default AdminProtectedRoute;
