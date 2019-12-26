const HtmlWebPackPlugin = require('html-webpack-plugin');
const path = require("path");
module.exports = {
  mode:"development",
  entry:{
    "index":"./src/index.js",
    "wue":"./src/wue.js"
  } ,
  output: {
    filename: "js/[name].js",
    path:path.resolve(__dirname,"dist")
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
      },
    }],
  },
  devtool: "cheap-module-eval-source-map",
  plugins: [
    new HtmlWebPackPlugin({
      template: './src/index.html',
      filename: './index.html',
    }),
  ],
};
