const path = require('path')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const bundleOutputDir = './wwwroot/dist'
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = (env) => {
  const isDevBuild = !(env && env.prod)

  console.log('Building for "%s"', isDevBuild ? 'development' : 'production')

  return [{
    mode: isDevBuild ? 'development' : 'production',
    stats: { modules: false },
    entry: { 'main': './ClientApp/boot-app.js' },
    resolve: {
      extensions: ['.js', '.vue'],
      alias: {
        'vue$': 'vue/dist/vue.esm.js',
        'components': path.resolve(__dirname, './ClientApp/components'),
        'views': path.resolve(__dirname, './ClientApp/views'),
        'utils': path.resolve(__dirname, './ClientApp/utils'),
        'api': path.resolve(__dirname, './ClientApp/store/api'),
        services: path.resolve(__dirname, './ClientApp/services'),
        '@': path.resolve(__dirname, './ClientApp')
      }
    },
    output: {
      path: path.join(__dirname, bundleOutputDir),
      filename: '[name].js',
      publicPath: '/dist/'
    },
    module: {
      rules: [
        { test: /\.vue$/, include: /ClientApp/, use: 'vue-loader' },
        {
          test: /\.scss$/,
          use: [
            'vue-style-loader',
            'css-loader',
            'sass-loader'
          ]
        },
        { test: /\.js$/, include: /ClientApp/, use: 'babel-loader' },
        { test: /\.css$/, use: isDevBuild ? ['style-loader', 'css-loader'] : [MiniCssExtractPlugin.loader, 'css-loader'] },
        { test: /\.(png|jpg|jpeg|gif|svg)$/, use: 'url-loader?limit=25000' }
      ]
    },
    devtool: isDevBuild ? false : 'source-map',
    plugins: [
      new VueLoaderPlugin(),
      new webpack.DllReferencePlugin({
        context: __dirname,
        manifest: require('./wwwroot/dist/vendor-manifest.json')
      }),
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery'
      })
    ].concat(isDevBuild ? [
      // Plugins that apply in development builds only
      new webpack.SourceMapDevToolPlugin({
        filename: '[file].map', // Remove this line if you prefer inline source maps
        moduleFilenameTemplate: path.relative(bundleOutputDir, '[resourcePath]') // Point sourcemap entries to the original file locations on disk
      })
    ] : [
      new MiniCssExtractPlugin({
        filename: 'site.css'
      }),
      // Compress extracted CSS.
      new OptimizeCSSPlugin({
        cssProcessorOptions: {
          safe: true
        }
      })
    ]),
    node: {
      fs: 'empty'
    }
  }]
}
