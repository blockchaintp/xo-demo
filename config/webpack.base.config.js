const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, '..', 'dist'),
    filename: 'index.js',
    publicPath: '/',
  },
  devtool: 'inline-module-source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
    ]
  },
  devServer: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8008',
        pathRewrite: {'^/api' : ''}
      },
    }
  },
  plugins: [
    new HtmlWebpackPlugin({ 
      template: './src/index.html', 
      filename: './index.html',
      hash: true,
    }),
    new CopyWebpackPlugin([{
      from: 'src/assets',
      to: '',
    }]),
  ]
}