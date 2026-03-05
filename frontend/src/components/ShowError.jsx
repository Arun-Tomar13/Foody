import React from 'react'

const ShowError = ({message}) => {
  return (
    <span className='text-danger'>{message}</span>
  )
}

export default ShowError