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
            from : path.resolve(__dirname,'src','public'),
            to : path.resolve(__dirname,'.webpack/renderer/main_window','public')
          }
        ]
    })
  ],
  module: {
    rules,
  },
};
