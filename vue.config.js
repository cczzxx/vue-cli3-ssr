const VueSSRServerPlugin = require("vue-server-renderer/server-plugin");
const VueSSRClientPlugin = require("vue-server-renderer/client-plugin");
const nodeExternals = require("webpack-node-externals");
const merge = require("lodash.merge");
const TARGET_NODE = process.env.WEBPACK_TARGET === "node";//build:server指令会将WEBPACK_TARGET设置为node
const target = TARGET_NODE ? "server" : "client";

// 生成Server Bundle和Client Bundle，
// 前者会运行在服务器上通过node生成预渲染的HTML字符串，发送到我们的客户端以便完成初始化渲染
// 而客户端bundle就自由了，初始化渲染完全不依赖它了。
// 客户端拿到服务端返回的HTML字符串后，会去“激活”这些静态HTML，是其变成由Vue动态管理的DOM，以便响应后续数据的变化

module.exports = {
  css: {
    extract: false
  },
  configureWebpack: () => ({
    // 将 entry 指向应用程序的 server / client 文件
    entry: `./src/entry-${target}.js`,

    // 对 bundle renderer 提供 source map 支持
    devtool: 'source-map',

    target: TARGET_NODE ? "node" : "web",//打包的目标环境

    node: TARGET_NODE ? undefined : false,

    output: {
      libraryTarget: TARGET_NODE ? "commonjs2" : undefined
    },

    // https://webpack.js.org/configuration/externals/#function
    // https://github.com/liady/webpack-node-externals
    // 外置化应用程序依赖模块。可以使服务器构建速度更快，
    // 并生成较小的 bundle 文件。
    externals: TARGET_NODE ? nodeExternals({
      // 不要外置化 webpack 需要处理的依赖模块。
      // 你可以在这里添加更多的文件类型。例如，未处理 *.vue 原始文件，
      // 你还应该将修改 `global`（例如 polyfill）的依赖模块列入白名单
      whitelist: [/\.css$/]
    }) : undefined,

    optimization: {
      splitChunks: undefined
    },

    //TARGET_NODE是否为node
    plugins: [TARGET_NODE ? new VueSSRServerPlugin() : new VueSSRClientPlugin()]
  }),

  chainWebpack: config => {
    config.module
      .rule("vue")
      .use("vue-loader")
      .tap(options => {
        merge(options, {
          optimizeSSR: false
        });
      });
  }
};
