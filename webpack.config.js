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
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  module: {
    rules: [{
        test: /\.[tj]sx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: [
            '@babel/preset-env',
            '@babel/preset-typescript',
            '@babel/preset-react'
          ]
        }
    }]
  },
}