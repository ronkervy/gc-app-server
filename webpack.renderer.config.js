const rules = require('./webpack.rules');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

rules.push(
  {
    test: /\.css$/,
    use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
  },
  {
    test: /\.(png|svg|jpg|jpeg|gif)$/i,
    type: 'asset/resource'
  }
);


module.exports = {
  // Put your normal webpack config below here
  target : "electron-renderer",
  resolve : {
      alias : {
        'Public' : path.resolve(__dirname,'src','public'),
        'Root' : path.resolve(__dirname,'src')
      }
  },
  output : {
      assetModuleFilename : 'main_window/public/img/[name][ext]'
  },
  plugins : [
    new CopyWebpackPlugin({
        patterns : [
          {
            from : "node_modules/cmd-printer/bin/sumatra-pdf-x64.exe",
            to : path.resolve(__dirname,'src','native_modules')
          },
          {
            from : "node_modules/cmd-printer/bin/sumatra-pdf-x86.exe",
            to : path.resolve(__dirname,'src','native_modules')
          },
          {
            from : path.resolve(__dirname,'src','native_modules/PDFtoPrinter.exe'),
            to : path.resolve(__dirname,'.webpack/renderer/main_window','native_modules')
          },
          {
            from : path.resolve(__dirname,'src','public'),
            to : path.resolve(__dirname,'.webpack/renderer/main_window','public')
          },
          {
            from : path.resolve(__dirname,'config'),
            to : path.resolve(__dirname,'.webpack/renderer/main_window/','config')
          }
        ]
    })
  ],
  module: {
    rules,
  },
};
