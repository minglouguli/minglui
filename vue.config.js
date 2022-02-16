const path = require('path');
function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  productionSourceMap: process.env.NODE_ENV === 'production' ? false : true,
  css: {
    sourceMap: process.env.NODE_ENV === 'production' ? false : true,
    loaderOptions: {}
  },
  filenameHashing: false,
  pages: {
    index: {
      entry: './test/main.js',
      template: './test/index.html'
    }
  },
  transpileDependencies: [/[/\\]node_modules[/\\]minglui*/],
  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('src'))
      .set('@com', resolve('src/components'));
  },
  devServer: {
    // port: '8080', // 设置端口号
    proxy: {
      '/api': {
        target: 'http://localhost:5000', //代理接口
        changeOrigin: true,
        pathRewrite: {
          // '^/api': '/api' //代理的路径
        }
      }
    }
  }
};
