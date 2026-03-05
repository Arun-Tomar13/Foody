import { axiosInstance } from "../axios"

const addMenuItemApi = async (data)=>{
    const result = await axiosInstance.post(`/menu/restaurant/${data.id}`,data.formData,{headers: { "Content-Type": "multipart/form-data"}});
    return result
}

const BulkMenuAddApi = async (data)=>{
    console.log('data',data);
    
    const result = await axiosInstance.post(`/menu/bulk${data.restaurant_id ? `?restaurant_id=${data.restaurant_id}` : '' }`,data.formData,{headers: { "Content-Type": "multipart/form-data"}});
    return result
}
const deleteMenuItemApi = async (itemid)=>{
    const result = await axiosInstance.delete(`/menu/${itemid}`);
    return result
}

const updateMenuApi = async ({formData})=>{
    const result = await axiosInstance.patch('/menu',formData,{headers: { "Content-Type": "multipart/form-data"}});
    return result
}

const getMenuByIdApi = async (id)=>{
    console.log(id);
    
    const result = await axiosInstance.get(`/menu/${id}`);
    return result
}

const getAllMenuApi = async (data)=>{
    
    const result = await axiosInstance.get(`menu?${data.restaurantid? `restaurant_id=${data.restaurantid}&` :''}${data.categoryid? `category_id=${data.categoryid}&` :''}${data.searchQuery? `query=${data.searchQuery}&` :''}${data.page? `page=${data.page}&` :''}${data.limit? `limit=${data.limit}` :''}`);
    return result
}

export  {addMenuItemApi,deleteMenuItemApi,getMenuByIdApi,getAllMenuApi,updateMenuApi,BulkMenuAddApi}