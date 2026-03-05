import { axiosInstance } from "../axios"

const addAddressApi = async (data)=>{
    
    const result = await axiosInstance.post('/address',data);
    return result
}
const getAddressByUserIdApi = async ()=>{
    
    const result = await axiosInstance.get('/address');
    return result
}
const removeAddressByIdApi = async (id)=>{
    const result = await axiosInstance.delete(`/address/${id}`);
    return result
}

export {addAddressApi,getAddressByUserIdApi,removeAddressByIdApi}