const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TsConfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
require('regenerator-runtime/runtime');

module.exports = {
  entry: [
    'babel-polyfill',
    'webpack/hot/only-dev-server',
    './src/'
  ],
  output: {
    path: __dirname,
    filename: 'app.js'
  },
  resolve: {
    extensions: [ '.js', '.ts', '.tsx', '.glsl', '.obj' ],
    plugins: [
      new webpack.ProvidePlugin({
        'regeneratorRuntime': 'regenerator-runtime/runtime'
      }),
      new TsConfigPathsPlugin({
        configFile: "./tsconfig.json",
        logLevel: "info",
        extensions: [ ".ts", ".tsx"]
      })
    ]
  },
  externals: {
  "window": "window",
  },
  module: {
    rules: [
      {
        test: /\.obj$/,
        use: 'webpack-obj-loader'
      },
      {
        test: /\.glsl$/,
        use: 'webpack-glsl-loader'
      },
      {
        test: [ /\.ts(x?)$/, /\.js$/],
        exclude: /node_modules/,
        use: [ 'ts-loader']
      },
      {
        enforce: "pre",
        test: /\.js$/,
        loader: "source-map-loader"
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true
            }
          },
          {
            loader: 'fast-sass-loader',
            options: {
              sourceMap: true
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      },
      {
        test:/\.(png|jpg|woff|svg|eot|ttf|woff2)$/,
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
    host: '0.0.0.0',
    port: 8080,
    inline: true,
    historyApiFallback: true,
    hot: true
  }
};