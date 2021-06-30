const StringReplacePlugin = require("string-replace-webpack-plugin");
const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  entry: './src/main.js',
  externals : [nodeExternals()],
  // Put your normal webpack config below here
  resolve: {
        alias: {
          'unicode-properties': 'unicode-properties/unicode-properties.cjs.js',
          'pdfmake': 'pdfmake/build/pdfmake.js',
          'framer-motion' : path.resolve(__dirname,'./node_modules/framer-motion'),
          'material-ui' : path.resolve(__dirname,'./node_modules/@material-ui'),
          'express' : 'express/lib/express.js'
        }
  },
  plugins : [new StringReplacePlugin()],
  module: {
    rules: [
      ...require('./webpack.rules'),
      {
        enforce: 'pre',
        test: /unicode-properties[\/\\]unicode-properties/,
        use : {
          options : {
            loader: StringReplacePlugin.replace({
              replacements: [
                {
                  pattern: "var fs = _interopDefault(require('fs'));",
                  replacement: function () {
                    return "var fs = require('fs');";
                  }
                }
              ]
            })
          }
        }
      },
      {
        test: /unicode-properties[\/\\]unicode-properties/, 
        use : {
          options : {
            loader: "transform-loader?brfs"
          }
        }
      },
      {
        test: /pdfmake[/\\]js[/\\]/, 
        use : {
          options : {
            loader: "transform-loader?brfs"
          }
        }
      },
      {
        test: /fontkit[\/\\]index.js$/, 
        use : {
          options : {
            loader: "transform-loader?brfs"
          }
        }
      },
      {
        test: /linebreak[\/\\]src[\/\\]linebreaker.js/, 
        use : {
          options : {
            loader: "transform-loader?brfs"
          }
        }
      }
    ],
  }  
};
