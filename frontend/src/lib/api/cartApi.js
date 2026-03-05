import { axiosInstance } from "../axios"

const addItemInCart = async (data)=>{
    
    const result = await axiosInstance.post('/cart-Item',{item_id:data});
    return result
}

const getAllItemInCart = async ()=>{
    const result = await axiosInstance.get('/cart-Item');
    return result
}
const decreaseItemInCart = async (id)=>{
    const result = await axiosInstance.delete(`/cart-Item/${id}`);
    return result
}

const deleteAllItemInCart = async ()=>{
    const result = await axiosInstance.delete('/cart-Item');
    return result
}

export {
    addItemInCart,
    getAllItemInCart,
    decreaseItemInCart,
    deleteAllItemInCart
}