const path = require('path');
module.exports = [
  // Add support for native node modules
  {
    test: /\.node$/,
    use: 'node-loader',
  },
  // {
  //   test: /\.(m?js|node|exe)$/,
  //   parser: { amd: false },
  //   use: {
  //     loader: '@marshallofsound/webpack-asset-relocator-loader',
  //     options: {
  //       outputAssetBase: 'native_modules'
  //     },
  //   },
  // },
  {
    test : /\.js?$/,
    use : {
        loader : 'babel-loader',
        options : {
            exclude : /node_modules/,
            presets : ['@babel/preset-react']
        }
    }
  },
  {
    test: /\.(js|json|msi)$/,
    exclude: [
      path.resolve(__dirname,'converter'),
      path.resolve(__dirname,'msi')
    ]
  }
  // Put your webpack loader rules in this array.  This is where you would put
  // your ts-loader configuration for instance:
  /**
   * Typescript Example:
   *
   * {
   *   test: /\.tsx?$/,
   *   exclude: /(node_modules|.webpack)/,
   *   loaders: [{
   *     loader: 'ts-loader',
   *     options: {
   *       transpileOnly: true
   *     }
   *   }]
   * }
   */
];
