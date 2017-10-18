/**
 * Created by chenlin on 2017/10/18 0018.
 */
const path=require('path');
const webpack=require('webpack');
const merge = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const vueLoaderConfig = require('./vue-loader.conf');
const utils = require('./util');
module.exports=merge(
  {
    module:{
      rules:utils.styleLoaders({
        sourceMap: false,
        extract: true
      })
    },
},
  {
  entry:{
    "index":path.resolve(__dirname,'./src/index')
  },
  output: {
    path:path.resolve(__dirname,'./build'),
    filename: "[name].js",
    library: "VueDaterPicker",
    libraryTarget: "umd"
  },
  module: {
    rules: [
      {
        test:/\.vue$/,
        loader: "vue-loader",
        options:vueLoaderConfig
      },
      {
        test: /\.(js)$/,
        exclude: /(node_modules)/,
        use : {
          loader: 'babel-loader?cacheDirectory',
        }
      },
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV:  JSON.stringify('production')
      }
    }),
    new ExtractTextPlugin('index.css'),
    new OptimizeCssAssetsPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      // 最紧凑的输出
      beautify: false,
      // 删除所有的注释
      comments: false,
      compress: {
        // 在UglifyJs删除没有用到的代码时不输出警告
        warnings: false,
        // 删除所有的 `console` 语句
        // 还可以兼容ie浏览器
        drop_console: true,
        // 内嵌定义了但是只用到一次的变量
        collapse_vars: true,
        // 提取出出现多次但是没有定义成变量去引用的静态值
        reduce_vars: true,
        drop_debugger: true,  // discard “debugger” statements
      },
      output: {
        comments: false,
      },
    })
  ]
})
