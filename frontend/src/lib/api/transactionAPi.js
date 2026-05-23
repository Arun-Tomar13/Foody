import { axiosInstance } from "../axios"

const topUpApi = async (data)=>{
    const result = await axiosInstance.post('/transaction',data);
    return result
}
const getTransactionsApi = async ()=>{
    const result = await axiosInstance.get('/transaction');
    return result
}
const createRazorpayOrderApi = async (data) => {
    const result = await axiosInstance.post('/transaction/create-razorpay-order', data);
    return result;
}
const verifyRazorpayPaymentApi = async (data) => {
    const result = await axiosInstance.post('/transaction/verify-razorpay-payment', data);
    return result;
}

export {getTransactionsApi,topUpApi, createRazorpayOrderApi, verifyRazorpayPaymentApi}