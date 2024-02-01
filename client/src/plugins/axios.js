// import dev from '../script/dev'
import axios from 'axios'
import store from '../store/index';

const BASE_URL = import.meta.env.VITE_API_DEV === 'true' ? 'http://localhost:3000' : 'http://omenmc.hopto.org:3000';

const axiosInstance = axios.create({
    baseURL: `${BASE_URL}/api/`,
    timeout: 2000
})

const getAxios = () => {
    axiosInstance.defaults.headers.Authorization = `Bearer ${store.getters.token}`
    return axiosInstance
}

export default getAxios;