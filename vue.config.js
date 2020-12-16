/**
 * 模块化用commonjs的语法，因为所有的构建工具都是基于nodejs平台运行的
 */
/**
 * 环境变量的理解
 * 当通过npm run执行scripts脚本里面的某个变量去运行项目或者打包项目的时候，实际是通过@vue/cli-service插件提供的vue-cli-service方法去运行或者打包项目
 * 运行还是打包主要看vue-cli-service后面是serve还是build，在打包的时候再通过--mode会自动去项目的根目录下找对应的环境变量文件，我已经测试了一下
 * process.env.NODE_ENV的值取决于环境变量文件.env后面的那个关键字，但是
 * 只有以VUE_APP_开头的变量才会被webpack.DefinePlugin静态嵌入到客户端测包中，我对这句话的理解就是只有以这个变量开头的才可以在代码运行过程中被访问到
 * 所以虽然NODE_ENV可以区别环境变量，但是只局限于本地开发打包的时候，如果想要在线上代码跑的时候也能访问当前环境变量就需要使用VUE_APP_，
 * 但是开发习惯我们还是给对应的环境变量文件里面加上NODE_ENV加以区分。
 * 访问：应用代码任何地方都可以通过process.env.变量名访问
 * BASE_URL：这个变量我们可以用来动态改变项目包的基本url
 * BASE_URL:/ ->部署到根目录
 * BASE_URL:/a/ ->部署到根目录下的a文件夹中
 * 
 */
const CompressionWebpackPlugin = require('compression-webpack-plugin')//项目采用gzip打包的插件
const TerserPlugin = require('terser-webpack-plugin')//移除项目中所有console的插件.压缩代码
const path = require('path')

function resolve(dir) {
    return path.join(__dirname, dir)
}

//定义一个配置参数变量
const buildConfig = {
    publicPath: process.env.BASE_URL,
    port: 8080,//本地项目跑的端口号
    env: process.env.VUE_APP_TITLE,//自定义的环境变量，全局的
    outputDir: 'build',//项目打包输出的文件名
    sourcemapUpload: false,//是否上传sourcemap到sentry,以加速生产环境构建
    productionGzipExtensions: ['js', 'css'],//指定哪些文件需要通过gzip压缩
    productionGzip: true,////是否启用Gzip打包
    closeConsole: false,
    cdnFlag: false,//是否启用cdn加载，采用cdn加载第三方框架，可以有效的减少包的体积
    externals: {//key:依赖包的名字，value:依赖包导出的名字
        'vue': 'Vue',
        'vue-router': 'VueRouter',
        'vuex': 'Vuex',
        'axios': 'axios'
    }
}
const cdn = {
    dev: {
        css: [],
        js: [
            'https://cdn.bootcss.com/vue/2.6.10/vue.min.js',
            'https://cdn.bootcss.com/vuex/3.1.2/vuex.min.js',
            'https://cdn.bootcss.com/vue-router/3.1.3/vue-router.min.js',
        ]
    },
    prod: {
        css: [],
        js: [
            'https://cdn.bootcss.com/vue/2.6.10/vue.min.js',
            'https://cdn.bootcss.com/vuex/3.1.2/vuex.min.js',
            'https://cdn.bootcss.com/vue-router/3.1.3/vue-router.min.js',
        ]
    }
}
module.exports = {
    //如果项目部署到根路径，直接'/'，如果部署到子路径'/son/
    publicPath: buildConfig.publicPath,
    outputDir: buildConfig.outputDir,
    // 是否在开发环境下通过eslint-loader在每次保存代码时lint检测代码
    //设置成true或者waringeslint-loader会将lint错误输出为编译警告，不会使得编译失败
    lintOnSave: buildConfig.env !== 'production',
    //productionSourceMap设置成false，打包之后就不会生成map文件，map文件的作用在于：
    //项目打包之后，代码都是经过压缩加密的，如果运行时报错，输出的错误信息无法准确得知是哪里的代码报错
    //也就是说map文件相当于是查看源码的一个东西，如果不需要定位问题，并且不想被看到源码，就设置成false,
    //既可以减少包的大小，还可以加密源码。
    productionSourceMap: buildConfig.sourcemapUpload,
    configureWebpack: (config) => {
        //~0=-1,~-1=0,也就是加一再变成负号,Boolean(-1)是true
        if (~['analyz', 'production'].indexOf(buildConfig.env)) {
            buildConfig.productionGzip && config.plugins.push(
                new CompressionWebpackPlugin({
                    // filename: '[path].gz[query]',
                    test: new RegExp('\\.(' + buildConfig.productionGzipExtensions.join('|') + ')$'),
                    threshold: 8192,// 只有大小大于该值的资源会被处理 10240
                    minRatio: 0.8 // 只有压缩率小于这个值的资源才会被处理
                })
            )
            buildConfig.closeConsole && config.plugins.push(
                new TerserPlugin({
                    terserOptions: {
                        warnings: false,
                        compress: {
                            drop_console: true,//true就是干掉所有的console.*这些函数的调用
                            drop_debugger: true,//干掉那些debugger
                            pure_funcs: ['console.log']// 如果你要干掉特定的函数比如console.info ，又想删掉后保留其参数中的副作用，那用pure_funcs来处理
                        }
                    }
                })
            )
        }
    },
    chainWebpack: (config) => {
        if (~['analyz', 'production'].indexOf(buildConfig.env) && buildConfig.cdnFlag) {
            config.externals(buildConfig.externals)//用于排除一些引入的模块，不进行打包，引用外部的模块。
        }
        //开启CDN加速(建议选配，CDN虽然速度快，但没有本地打包稳定)
        config.plugin('html').tap(args => {//配置插件: 修改参数
            args[0].title = buildConfig.title//设置html的title，但是我们在进行路由切换得时候会通过路由钩子函数动态修改title
            if (buildConfig.cdnFlag) {//在开启cdn加载的情况下，如果是生产环境就加载prod的cdn。否则...
                if (~['analyz', 'production'].indexOf(buildConfig.env)) {
                    args[0].cdn = cdn.prod
                } else {
                    args[0].cdn = cdn.dev
                }
            }
            return args
        })
        //svg在vue中的使用设置
        //第一步，让其他svg loader不要对src/assets/icons下的svg进行操作
        config.module
            .rule('svg')
            .exclude.add(resolve('src/assets/icons'))
            .end();
        //第二步，使用svg-sprite-loader对src/assets/icons下的svg进行操作
        config.module
            .rule('icons')
            .test(/.svg$/)
            .include.add(resolve('src/assets/icons'))
            .end()
            .use('svg-sprite-loader')
            .loader('svg-sprite-loader')
            //定义规则 使用时<svg class="icon"> <use xlink:href="#icon-svg文件名"></use>  </svg>
            .options({
                symbolId: 'icon-[name]'
            })
            .end()
    },
    devServer: {
        open: false,//不打开浏览器
        port: buildConfig.port,
        proxy: {
            '/api': {
                target: 'https://el-admin.xin',
                changeOrigin: true,
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    },
    pluginOptions: {
        webpackBundleAnalyzer: {
            openAnalyzer: buildConfig.env === 'analyz',
            analyzerMode: buildConfig.env === 'analyz' ? 'server' : 'disabled'
        }
    }
}