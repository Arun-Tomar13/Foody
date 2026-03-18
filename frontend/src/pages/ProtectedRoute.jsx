import React from 'react'
import { useSelector } from 'react-redux';
import { USER_ROLES } from '../constant';
import { Navigate, useNavigate } from 'react-router';
import Unauthorized from './Unauthorized';

const ProtectedRoute = ({ allowedRoles, children }) => {
 const  role  = useSelector((state) => state?.users?.user?.role);
 const  loading  = useSelector((state) => state?.users?.user?.loading);
 const navigate = useNavigate

    if(loading) return <div>loading..</div>
    if (role && !allowedRoles.includes(role)) return <Navigate to='/unauthorized' />;
    
    return children;
}

export default ProtectedRoute