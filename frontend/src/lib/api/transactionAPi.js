import { axiosInstance } from "../axios"

const topUpApi = async (data)=>{
    
    const result = await axiosInstance.post('/transaction',data);
    return result
}
const getTransactionsApi = async ()=>{
    
    const result = await axiosInstance.get('/transaction');
    return result
}

export {getTransactionsApi,topUpApi}