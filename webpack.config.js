const path = require('path');

module.exports = {
  entry: {
    app: [
      path.resolve(__dirname, 'src') + '/checkers.js',
    ],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'checkers.bundle.js',
  },
  module: {
    rules: [{
        test: /\.js?$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
    }]
  }
}