const StringReplacePlugin = require("string-replace-webpack-plugin");
const nodeExternals = require('webpack-node-externals');
const rules = require('./webpack.rules');
const path = require('path');

rules.push(
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
);

module.exports = {
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  entry: './src/main.js',
  externalsPresets: { node: true },
  externals : [nodeExternals()],
  // Put your normal webpack config below here
  resolve: {
        alias: {
          'unicode-properties': 'unicode-properties/unicode-properties.cjs.js',
          'pdfmake': 'pdfmake/build/pdfmake.js',
        }
  },
  plugins : [new StringReplacePlugin()],
  module: {
    rules,
  }  
};
