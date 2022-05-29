import { Navigate } from "react-router-dom";
import { useGlobalAdminAppContext } from "../context/adminAppContext";

function AdminProtectedRoute({ children }) {
  const { admin } = useGlobalAdminAppContext();

  //   if (!admin) {
  //     return <Navigate to="/" />;
  //   }
  return children;
}

export default AdminProtectedRoute;
