/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-var */
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  target: 'es5',
  entry: path.resolve(__dirname, 'src/index.tsx'),
  output: {
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
  },
  devtool: 'source-map',
  devServer: {
    // external 0.0.0.0
    host: 'localhost',
    allowedHosts: ['.lululala.co.kr'],
    port: 3000,
    historyApiFallback: true,
  },
  module: {
    rules: [
      {
        include: path.resolve(__dirname, 'src'),
        test: /\.(ts|tsx)/,
        exclude: /node_modules/,
        use: 'ts-loader',
      },
      {
        include: [path.resolve(__dirname, 'src')],
        test: /\.css$/,
        exclude: /node_modules/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'public/index.html'),
    }),
  ],
};
