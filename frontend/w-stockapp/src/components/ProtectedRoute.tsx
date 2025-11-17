import {Navigate} from "react-router-dom"

interface ProtectedRouteProps{
    children: JSX.Element;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";


    if(!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
}; 

export default ProtectedRoute;