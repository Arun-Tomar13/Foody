import { Button } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router'

const Unauthorized = () => {
  const navigate= useNavigate()
  return (
    <div className='text-danger'>
      <h2>Error 401</h2>
      <p>Your are trying to access Unauthorized page</p>
      <div className='d-flex justify-content-center gap-1 text-dark'>go to home page<Button onClick={()=> navigate('/')} color='secondary'  size='small' >Home</Button></div>
    </div>
  )
}

export default Unauthorized