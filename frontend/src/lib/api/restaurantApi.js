import { axiosInstance } from "../axios"

const createRestaurantApi = async (data)=>{
    const result = await axiosInstance.post('/restaurant',data)
    console.log(data);
    
    return result
}
const createRestaurantByAnyoneApi = async (data)=>{
    const result = await axiosInstance.post('/restaurant/createbyany',data)
    return result
}
const updateRestaurantApi = async ({id,name, address, type, openingTime, closingTime})=>{
    const result = await axiosInstance.patch(`/restaurant/${id}`,{name, address, type, openingTime, closingTime})
    return result
}
const toggleAvailabilty = async (id)=>{
    const result = await axiosInstance.patch(`/restaurant/${id}/toggle-availability`)
    return result
}
const removeRestaurantApi = async (data)=>{
    // const result = await axiosInstance.get('/restaurant/delete',data)
    // return result
}
const MenuPerRestaurantApi = async ()=>{
    const result = await axiosInstance.get('/restaurant/menu-count')
    return result
}
const orderAndRevenuePerRestaurantApi = async ()=>{
    const result = await axiosInstance.get('/restaurant/order-revenue')
    return result
}
const revenuePerRestaurantApi = async ()=>{
    const result = await axiosInstance.get('/restaurant/revenue')
    return result
}

const removeRestaurantByIdApi = async (data)=>{   
    const result = await axiosInstance.delete(`/restaurant/${data}`)
    return result
}
const getRestauarntInfoByIdApi = async (data)=>{
    console.log(data);
    
    const result = await axiosInstance.get(`/restaurant${data.id ? `?id=${data.id}` : ''}`)
    return result
}
const getAllRestauarntsApi = async ()=>{
    const result = await axiosInstance.get('/restaurant/all')
    return result
}

export {createRestaurantApi,updateRestaurantApi,MenuPerRestaurantApi,createRestaurantByAnyoneApi,removeRestaurantApi,getRestauarntInfoByIdApi,getAllRestauarntsApi,removeRestaurantByIdApi,orderAndRevenuePerRestaurantApi,revenuePerRestaurantApi,toggleAvailabilty}