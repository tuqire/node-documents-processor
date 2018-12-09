const webpack = require('webpack')
const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

const outputPath = path.resolve(__dirname, 'dest')
const isProduction = process.env.NODE_ENV === 'production'

const plugins = [
  new HtmlWebpackPlugin({
    title: 'Node Documents Processor',
    template: './src/html/index.html',
    minify: isProduction && {
      html5: true,
      collapseWhitespace: true,
      caseSensitive: true,
      removeComments: true
    }
  }),

  new MiniCssExtractPlugin({
    chunkFilename: 'css/main.css'
  }),

  new webpack.HashedModuleIdsPlugin()
]

if (isProduction) {
  plugins.push(
    new CleanWebpackPlugin(['dest'])
  )
}

module.exports = env => ({
  devtool: 'source-map',
  entry: './src/js/index.js',
  mode: isProduction ? 'production' : 'development',
  output: {
    filename: 'js/[name].[contenthash].js',
    path: outputPath
  },
  optimization: {
    runtimeChunk: 'single',
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true
      }),
      new OptimizeCSSAssetsPlugin({})
    ],
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    }
  },
  module: {
    rules: [
      {
        test: /\.css|\.scss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          'css-loader'
        ]
      },
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  },
  plugins,
  devServer: {
    contentBase: path.join(__dirname, 'dest'),
    port: 8093
  }
})
