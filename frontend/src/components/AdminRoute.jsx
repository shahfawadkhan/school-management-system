import React, { Children } from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
const AdminRoute = ({children}) => {
    const {user} = useSelector((state)=>state.auth)
    return user.role === "admin" ? children : <Navigate to={"/dashboard"}/>
}

export default AdminRoute