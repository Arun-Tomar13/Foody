import { axiosInstance } from "../axios"

const addCategoryApi = async (data)=>{
    const result = await axiosInstance.post('/category',data);
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
    const result = await axiosInstance.patch('/category',data);
    return result
}

const getAllCategoriesByRestroIdApi = async (id)=>{
    const result = await axiosInstance.get(`/category/restaurant/${id}`)
    return result
}

export  {addCategoryApi,deleteCategoryApi,getCategoriesApi,updateCategoryApi,getCategoryByIdApi,getAllCategoriesByRestroIdApi,bulkUploadApi}