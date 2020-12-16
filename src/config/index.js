const env = process.env

let config = {
  host: "",
  port: "",
  baseUrl: "",
  type: env.VUE_APP_TITLE,
  /**
 * @description token key
 */
  // TokenKey: 'EL-ADMIN-TOEKN',
  /**
 * @description 记住密码状态下的token在Cookie中存储的天数，默认1天
 */
  tokenCookieExpires: 1,
}


if (config.type === 'development') {
  config.port = ''
  // config.baseUrl = '/api'
  config.host = 'https://el-admin.xin'
} else if (config.type === 'production') {
  config.port = ''
  // config.baseUrl = '/api'
  config.host = 'https://el-admin.xin'
} else if (config.type === 'test') {
  config.port = ''
  // config.baseUrl = '/api'
  config.host = 'https://el-admin.xin'
}

export default config