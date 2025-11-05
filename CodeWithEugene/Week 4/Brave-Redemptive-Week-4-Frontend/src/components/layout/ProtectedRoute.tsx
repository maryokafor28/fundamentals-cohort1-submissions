import type { PropsWithChildren, ReactElement } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { PageLoader } from "../common/PageLoader";

interface ProtectedRouteProps {
  redirectPath?: string;
}

export function ProtectedRoute({
  redirectPath = "/login",
  children
}: PropsWithChildren<ProtectedRouteProps>): ReactElement {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <PageLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}
