import axios from './axios.js'
let query_header = {
  'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
}
let json_headers = {
  'Content-Type': 'application/json'
}
const api = {
  //登录
  getLogin(params){
    return axios({
      url:'/answersystem/systemLogin',
      method: 'PUT',
      data:params,
      headers:json_headers
    })
  },
  //课程列表
  lessonList(params){
      return axios.get('/problems/lessonList/'+params.userId);
  },
  //课时考题
  lessonQuestion(params){
    return axios.get('/problems/lesson/'+params.id);
  },
  //个人中心
  myInfo(params){
    return axios.get('/problems/center/'+params.userId,{params});
  },
  //试题结果提交
  getResult(params){
    return axios({
      url:'/problems/commitment',
      method: 'PUT',
      data:params,
      headers:json_headers
    })
  }
}
export default api