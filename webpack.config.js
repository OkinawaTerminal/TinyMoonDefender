const path = require('path')
const webpack = require('webpack')

module.exports = {
  entry: './src/main.js',
  output: {
    path: path.resolve('./'),
    filename: 'game.js',
    library: 'game'
  },
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader', query: { presets: [['es2015', { modules: false }]] } }
    ]
  }
}
