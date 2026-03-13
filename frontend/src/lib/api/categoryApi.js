import { axiosInstance } from "../axios"

const addCategoryApi = async (data)=>{
    const result = await axiosInstance.post(`/category${data.id ? `?restaurant_id=${data.id}` : ''}`,data.inputData);
    return result
}
const bulkUploadApi = async (data)=>{
    const result = await axiosInstance.post(`/category/bulk-upload${data.restaurant_id ? `?restaurant_id=${data.restaurant_id}` : ''}`,data.file);
    return result
}
const deleteCategoryApi = async (categoryid)=>{
    const result = await axiosInstance.delete(`/category/${categoryid}`);
    return result
}
const getCategoryByIdApi = async (categoryid)=>{
    const result = await axiosInstance.get(`/category/${categoryid}`);
    return result
}
const getCategoriesApi = async (restaurantId)=>{  
    const result = await axiosInstance.post('/category/id',{id:restaurantId});
    return result
}

const updateCategoryApi = async (data)=>{
    const result = await axiosInstance.patch('/category',data.inputData);
    return result
}

const getAllCategoriesByRestroIdApi = async (data)=>{
    console.log("dd",data);
    
    const result = await axiosInstance.get(`/category/restaurant${data.id ? `?id=${data.id}` : ''}`)
    return result
}

export  {addCategoryApi,deleteCategoryApi,getCategoriesApi,updateCategoryApi,getCategoryByIdApi,getAllCategoriesByRestroIdApi,bulkUploadApi}