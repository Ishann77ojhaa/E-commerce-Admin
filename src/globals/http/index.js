import axios from 'axios'

const API = axios.create({
    baseURL : "http://localhost:2000/api",

    headers :{
        'Content-Type' : 'application/json',
        Accept : 'application/json'
    },
});

const APIAuthenticated  = axios.create({
    baseURL : "http://localhost:2000/api",

    headers :{
        'Content-Type' : 'application/json',
        Accept : 'application/json',
        // 'Authorization' : `${localStorage.getItem('token')}`
    },
});

// Runs before EVERY request
APIAuthenticated.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = token;
  }

  return config;
},
(error)=>{
    return Promise.reject(error);
});


export {API, APIAuthenticated}