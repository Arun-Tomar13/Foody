import { axiosInstance } from "../axios"

const addOrderApi = async (data)=>{
    const result = await axiosInstance.post('/order',{address:data});
    return result
}

const getAllOrdersApi = async ()=>{
    const result = await axiosInstance.get('/order');
    return result
}

const getOrderItemByIdApi = async (id)=>{
    
    const result = await axiosInstance.get(`/order/${id}`);
    return result
}

const generateOrdersCSVApi = async ()=>{
    
    const result = await axiosInstance.get(`/order/csv`);
    return result
}

export {
   addOrderApi,
   getAllOrdersApi,
   getOrderItemByIdApi,
   generateOrdersCSVApi
}