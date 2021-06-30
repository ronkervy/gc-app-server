const rules = require('./webpack.rules');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

rules.push({
  test: /\.css$/,
  use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
});


module.exports = {
  // Put your normal webpack config below here
  resolve : {
      alias : {
        'Public' : path.resolve(__dirname,'src','public')
      }
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
