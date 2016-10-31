'use strict'

const CWD = process.cwd()
const ENV = process.env.NODE_ENV || 'development'
const PRODUCTION = ENV === 'production'

const path = require('path')
const src = path.resolve(CWD, 'src')
const webpack = require('webpack')
const WebpackCleanPlugin = require('clean-webpack-plugin')
const WebpackExtractTextPlugin = require('extract-text-webpack-plugin')
const WebpackHtmlWebpackPlugin = require('html-webpack-plugin')
const WebpackProgressBarPlugin = require('progress-bar-webpack-plugin')

let config = {
  context: src,
  cache: true,
  entry: {
    'asset/js/app.js': './js/app.js',
    'asset/css/app.css': './scss/app.scss'
  },
  output: {
    filename: '[name]',
    publicPath: '',
    path: path.resolve(CWD, 'build')
  },
  devtool: 'inline-source-map',
  module: {
    loaders: [{
      test: /\.woff2?/,
      loader: 'url?limit=10000&mimetype=application/font-woff&name=asset/img/[name].[ext]?[hash]'
    }, {
      test: /\.ttf/,
      loader: 'url?limit=10000&mimetype=application/octet-stream&name=asset/img/[name].[ext]?[hash]'
    }, {
      test: /\.eot/,
      loader: 'file?name=asset/img/[name].[ext]?[hash]'
    }, {
      test: /\.svg/,
      loader: 'url?limit=10000&mimetype=image/svg+xml&name=asset/img/[name].[ext]?[hash]'
    }, {
      test: /img\/.+\.(jpe?g|png|gif)$/,
      loader: 'url?limit=1000&name=asset/img/[name].[ext]?[hash]!img?progressive=true'
    }, {
      test: /\.json$/,
      loader: 'json'
    }, {
      test: /\.jsx?$/,
      exclude: [
        /node_modules/
      ],
      loader: 'babel?compact=false'
    }, {
      test: /\.pug$/,
      loader: 'pug'
    }, {
      test: /\.scss$/,
      loader: WebpackExtractTextPlugin.extract('style', 'css!sass')
    }]
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.json', '.jpg', '.jpeg', '.gif', '.png', '.pug'],
    alias: {
      img: `${src}/img/`
    }
  },
  plugins: [
    new WebpackCleanPlugin(['build']),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(ENV)
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.NoErrorsPlugin(),
    new WebpackProgressBarPlugin(),
    new WebpackExtractTextPlugin('[name]', {
      allChunks: true
    }),
    new WebpackHtmlWebpackPlugin({
      template: './pug/index.pug',
      filename: 'index.html',
      inject: false,
      minify: PRODUCTION ? {
        html5: true
      } : false
    })
  ]
}

if (PRODUCTION) {
  config.plugins = config.plugins.concat([
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ])

  config.devtool = null
}

module.exports = config
