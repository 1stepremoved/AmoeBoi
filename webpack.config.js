var path = require('path');

module.exports = {
  entry: './lib/main2.js',
  output: {
    filename: './bundle.js',
  },
  module: {
    loaders: [
      {
        exclude: /(node_modules)/
      }
    ]
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.js', '*']
  }
};
