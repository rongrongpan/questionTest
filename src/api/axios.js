import axios from 'axios';
axios.defaults.timeout =  30000;
// axios.defaults.withCredentials=true;

var instance = axios.create({
  baseURL:'/api/staff',
  // baseURL:'/apis',
  headers: {"Content-Type": "application/x-www-form-urlencoded;charset=utf-8"}
})

instance.interceptors.request.use(function (config) {
  config.params = {
    ...config.params,
  }
  // 在发送请求之前做些什么
  return config
}, function (error) {
// 对请求错误做些什么
  return Promise.reject(error)
})

instance.interceptors.response.use(function (response) {
  return response;
}, function (error) {
  if(error.message.includes('timeout')){
    alert("网络超时");
  }
  // 对响应错误做点什么
  return Promise.reject(error);
});

export default instance

// header: { 'Content-Type': 'application/json' }
// headers: {"Content-Type": "application/x-www-form-urlencoded;charset=utf-8"}
