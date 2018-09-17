const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: {
    // Global JS
    global: './src/global.js',
    // Page-specific JS
    index: './src/index.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[hash].js',
  },
  module: {
      rules: [
        {
          test: /\.html$/,
          use: {
            loader: 'html-loader',
            options: {
              attrs: [
                'img:src',
                'audio:src',
              ],
            }
          }
        },
        {
          test: /\.(jpe?g|png|mp3|wav)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[path][name].[ext]?[hash:7]',
                context: 'src',
              },
            },
          ],
        },
      ]
  },
  plugins: [
    // Clean dist/ on each build
    new CleanWebpackPlugin(['dist']),
    // Add HtmlWebpackPlugin entries to build individual HTML pages
    new HtmlWebpackPlugin({
      // Input path
      template: 'src/index.html',
      // Output (within dist/)
      filename: 'index.html',
      // Inject compiled JS into <head> (as per A-Frame docs)
      inject: 'head',
      // Specify which JS files, by key in `entry`, should be injected into the page
      chunks: ['global', 'index'],
    }),
  ],
  // Settings for webpack-dev-server
  devServer: {
    clientLogLevel: 'info',
    open: true,
  },
};
