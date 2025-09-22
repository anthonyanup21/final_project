import axios from "axios"

const BASE_URL=import.meta.env.ENV=="production"?"/api":"http://localhost:3000/api"
export const axiosInstance = axios.create({
    baseURL: BASE_URL,//if its in the development the url will be http://localhost:3000/api or else it will be "/api"
    withCredentials: true
})