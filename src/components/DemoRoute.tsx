import { Navigate } from "react-router-dom";
import { isDemoAuthenticated } from "@/lib/demo";

const DemoRoute = ({ children }: { children: React.ReactNode }) =>
  isDemoAuthenticated() ? children : <Navigate to="/auth" replace />;

export default DemoRoute;
