import axios from 'axios'
import config from '../config/index'

axios.defaults.baseURL = `${config.host}${config.port}${config.baseUrl}`
axios.defaults.headers.post['Content-Type'] = 'application/json'
axios.defaults.headers.get['Accept'] = 'application/json'
axios.defaults.timeout = 20000
axios.defaults.wiCredentials = true

//2.axios的拦截器 发送拦截
axios.interceptors.request.use(config => {
  return config
}, err => {
  return err
})
//2.axios的拦截器 响应拦截
axios.interceptors.response.use(res => {
  return res.data //一般返回data
}, err => {
  return err
})

export default function(options){
  let params={
    method:options.method,
    url:options.url,
    data:options.params,
    ...options.other
  }
  //axios请求配置
  // `data` 是作为请求主体被发送的数据
  // 只适用于这些请求方法 'PUT', 'POST', 和 'PATCH'
  //'params'用于'GET'
  if(options.method.toLowerCase() == 'get'){
    params.params = params.data
    delete params.data
  }
  return axios(params)
}