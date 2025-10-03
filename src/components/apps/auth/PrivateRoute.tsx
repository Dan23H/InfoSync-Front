import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

interface PrivateRouteProps {
    children: ReactNode;
    allowedRoles?: string[];
}

export default function PrivateRoute({ children, allowedRoles }: PrivateRouteProps) {
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Cargando sesión...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/student" replace />;
    }

    return <>{children}</>;
}
