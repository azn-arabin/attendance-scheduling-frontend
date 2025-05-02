import { Navigate, Outlet } from "react-router";
import { useAuth } from "@/components/context/auth-provider.tsx";
import { JSX } from "react";

export const ProtectedRoute = ({
  allowedRoles,
}: {
  allowedRoles: string[];
}) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;
  if (!allowedRoles.includes(user.user.role)) return <Navigate to="/" />;

  return <Outlet />;
};

export const RedirectIfAuthenticated = ({
  children,
}: {
  children: JSX.Element;
}) => {
  const { user } = useAuth();

  if (user) {
    const role = user.user.role;
    return <Navigate to={`/${role}`} />;
  }

  return children;
};
