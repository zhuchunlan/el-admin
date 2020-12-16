export default {
    login: {
        //登录
        webLogin: {
            method: 'post',
            url: '/auth/login'
        },
        //获取用户信息
        getInfo: {
            url: '/auth/info',
            method: 'get'
        },
        //获取验证码
        getCode: {
            url: '/auth/code',
            method: 'get'
        },
        //退出登录
        logout: {
            url: '/auth/logout',
            method: 'delete'
        }
    }
}