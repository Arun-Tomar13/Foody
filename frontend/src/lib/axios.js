import axios from "axios";
// const Bearer = JSON.parse(localStorage.getItem('Bearer')) || {}

export const axiosInstance = axios.create({
    baseURL:'http://localhost:8000/api',
    headers:{
        Authorization:JSON.parse(localStorage.getItem('Bearer')) || null,
    }
})