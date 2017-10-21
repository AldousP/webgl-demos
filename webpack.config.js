const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: [
    'webpack/hot/only-dev-server',
    './src/'
  ],
  output: {
    path: __dirname,
    filename: 'app.js'
  },
  resolve: {
    extensions: [ '.js', '.ts', '.glsl' ],
    alias: {
      static: path.join( __dirname, 'static'),
      app: path.join( __dirname, 'src')
    }
  },
  module: {
    rules: [
      {
        test: /\.glsl$/,
        use: 'webpack-glsl-loader'
      },
      {
        test: [ /\.ts$/ ],
        exclude: /node_modules/,
        use: 'ts-loader'
      },
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      },
      {
        test: /\.(jpe?g$|gif|png|eot|woff|ttf|svg)/,
        use: [ 'url-loader' ]
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new HtmlWebpackPlugin({
      template: 'static/index.html'
    })
  ],

  devServer: {
    host: 'localhost',
    port: 8080,
    inline: true,
    historyApiFallback: true,
    hot: true
  }
};