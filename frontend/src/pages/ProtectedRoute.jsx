import React from 'react'
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router';
import Unauthorized from './Unauthorized';

const ProtectedRoute = ({ allowedRoles, children }) => {
 const  role  = useSelector((state) => state?.users?.user?.role);
 const  loading  = useSelector((state) => state?.users?.loading);
 const token = localStorage.getItem("Bearer")?.trim();
 const hasToken = Boolean(token && token !== "null" && token !== "undefined");

    if (!hasToken) return <Navigate to="/login" replace />;
    if(loading || !role) return <div>loading..</div>
    if (role && !allowedRoles.includes(role)) return <Unauthorized />;
    
    return children;
}

export default ProtectedRoute
