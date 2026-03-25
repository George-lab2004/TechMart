import type { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export default function AdminRoutes() {
    const { userInfo } = useSelector((state: RootState) => state.auth);
    return userInfo && userInfo.isAdmin ? <Outlet /> : <Navigate to="/login" replace />;
}