import { DataGrid } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router';
import { getOrderItemById } from '../store/slices/orderSlice';
import CustomSnackbar from './CustomSnackbar';

const OrderItems = () => {

  
  const location = useLocation()
  const {successful = null} = location.state || {};
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [open, setOpen] = useState(false);
  const {id} = useParams();
  
  const {orderItemList,total,numberOfItems,error} = useSelector((state)=>state.order)

      useEffect(()=>{
        const fatchOrderDetail = async ()=>{
          const result = await dispatch(getOrderItemById(id))
          console.log(result);
        }
        fatchOrderDetail()
      },[])

      useEffect(() => {
      if (error) {
        setOpen(true);
        setTimeout(() => {
          setOpen(false);
        }, 2000);
      }
    }, [error]);

      useEffect(()=>{
        if(successful){
          setTimeout(()=>{
            navigate('/')
          },3000)
        }
      },[])

    const columns = [
        {
      field: "image",
      headerName: "Image",
      sortable: false,
      renderCell: (params) => (
        <div>
          <img
            src={`http://192.168.1.156:8000/${params.row.image}`}
            className="img-fluid "
            alt="food Img"
          />
        </div>
      ),
    },
    {
      field: "name",
      headerName: "Name",
      sortable: false,
    },
    {
      field: "type",
      headerName: "type",
      sortable: false,
    },
    {
      field: "price",
      headerName: "price",
      sortable: false,
    },
    {
      field: "restaurant_name",
      headerName: "restaurant",
      sortable: false,
    },
    {
      field: "quantity",
      headerName: "quantity",
      sortable: false,
    },
    {
      field: "itemTotal",
      headerName: "item total",
      sortable: false,
      width:'100',
      renderCell: (params) => (
        <div>
          {params.row.quantity * params.row.price}
        </div>
      ),
    },
  ];
    
  return (
    <div className='p-2 d-flex flex-column justify-content-center' >
        { orderItemList &&  
        <div className='d-flex flex-column gap-5 align-items-center' >
         { successful 
         ?  
         <div className='d-flex flex-column align-items-center' >
          <video width='310px' src="/Successful.mp4" autoPlay loop  />
          <h2 className='text-success' >Congratulations your order placed successfully 🎉</h2>
         </div>

         : <h2 className='text-primary' >Order History</h2> }
        <div className='d-flex flex-column gap-3' >
        <h4 className='text-secondary' >items you have ordered</h4>
        <DataGrid
                  rows={orderItemList}
                  columns={columns}
                  initialState={{
                    pagination: {
                      paginationModel: {
                        pageSize: 5,
                      },
                    },
                  }}
                  pageSizeOptions={[5]}
                  disableRowSelectionOnClick
                  disableColumnFilter
                  disableColumnMenu
                  disableColumnResize
                />
                <div className='d-flex justify-content-between' ><h4>total items {numberOfItems}</h4> <h3>total ₹{total}</h3></div>
                </div>
                </div>}

                  {/* Error Text */}
            {error && (
              <CustomSnackbar type='error' variant="filled" open={open} message={error.message} />
            )}
    </div>
  )
}

export default OrderItems