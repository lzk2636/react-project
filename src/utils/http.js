import axios from 'axios'
import store from '../store'

const instance = axios.create({
    baseURL: '/api',
    timeout: 2000,
    headers: {'X-Custom-Header': 'foobar'},
    withCredentials: true, // d
  });

 const oUser= store.getState()
 let local_token =JSON.parse(localStorage.getItem("my_token"))

 if(!oUser.userInfo.token){
   store.dispatch({
     type:"token",
     value:local_token
   })

 }
 console.log(store.getState())



  // Add a request interceptor
instance.interceptors.request.use(function (config) {
  if(store.getState().userInfo!==null) {
    let {token} =store.getState().userInfo
    if(token){
      config.headers.token=token
    }
  }
  

    // Do something before request is sent
    return config;
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  });

// Add a response interceptor
instance.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
  
    return response.data;
  }, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  });
  export default instance