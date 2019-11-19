const path = require('path')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')

module.exports = (env) => {
  const isDevBuild = !(env && env.prod)

  console.log('Building vendor files for "%s"', isDevBuild ? 'development' : 'production')

  const extractCSS = new MiniCssExtractPlugin({
    filename: 'vendor.css'
  })

  return [{
    mode: isDevBuild ? 'development' : 'production',
    stats: { modules: false },
    resolve: {
      extensions: ['.js']
    },
    module: {
      rules: [
        { test: /\.(png|woff|woff2|eot|ttf|svg)(\?|$)/, use: 'url-loader?limit=100000' },
        { test: /\.css(\?|$)/, use: [MiniCssExtractPlugin.loader, 'css-loader'] }
      ]
    },
    entry: {
      vendor: ['bootstrap', 'bootstrap/dist/css/bootstrap.css', 'event-source-polyfill', 'vue', 'vue-router', 'jquery']
    },
    output: {
      path: path.join(__dirname, 'wwwroot', 'dist'),
      publicPath: '/dist/',
      filename: '[name].js',
      library: '[name]_[hash]'
    },
    plugins: [
      extractCSS,
      // Compress extracted CSS.
      new OptimizeCSSPlugin({
        cssProcessorOptions: {
          safe: true
        }
      }),
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        Popper: ['popper.js', 'default']
        /* For modal, you will need to add tether */
      }), // Maps these identifiers to the jQuery package (because Bootstrap expects it to be a global variable)
      new webpack.DllPlugin({
        path: path.join(__dirname, 'wwwroot', 'dist', '[name]-manifest.json'),
        name: '[name]_[hash]'
      })
    ]
  }]
}
