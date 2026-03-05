import { Button } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router'

const ErrorPage = () => {
  const navigate= useNavigate()
  return (
    <div className='text-danger'>
      <h2>Error 401</h2>
      <p>Your are trying to access wrong page</p>
      <div className='d-flex justify-content-center gap-1 text-dark'>please login to access<Button onClick={()=> navigate('/login')} color='secondary'  size='small' >Login</Button></div>
    </div>
  )
}

export default ErrorPage