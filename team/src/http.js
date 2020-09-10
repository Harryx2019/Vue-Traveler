import axios from 'axios'

const http = axios.create({
    baseURL: 'http://localhost:3000/team/api',
    withCredentials: true
})

export default http