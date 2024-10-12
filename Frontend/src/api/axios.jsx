import axios from "axios";
const BASE_URL ='https://kura-fashion-server.vercel.app/'

export default axios.create({
    baseURL: BASE_URL
});

export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    headers: {'Content-Type': 'application/json'},
    withCredentials:true
});