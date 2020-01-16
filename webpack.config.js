var path = require('path');

module.exports = {
  entry: './lib/v0/main.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.js', '*']
  }
};
