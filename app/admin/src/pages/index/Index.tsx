import { Navigate } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { selectCurrentUser } from "../../features/auth/AuthSlice";
import { AdminRoles } from "../../features/auth/user-role.enum";
import Landing from "./Landing";
import Login from "../auth/Login";

export default function Index() {
    const currentUser = useAppSelector(selectCurrentUser);
    if (currentUser && AdminRoles.includes(currentUser.role)) {
        return <Navigate to='admin' replace />;
    }

    return <Login />;
}
