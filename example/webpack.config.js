/* eslint-disable */
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const path = require('path');

module.exports = (env) => {
  const config = {
    mode: 'production',
    //devtool: 'inline-source-map',
    output: {
      path: path.resolve(__dirname, 'dist'),
      clean: true,
      //libraryTarget: "this",
      library: {
        type: 'var',
        name: 'yoha',
      },
      chunkFormat: 'commonjs',
      scriptType: 'text/javascript',
    },
    resolve: {
      extensions: ['.js'],
    },
    plugins: [
      new HtmlWebpackPlugin({
        filename: 'index.html',
        chunks: ['example'],
      }),
      new CopyWebpackPlugin({
        patterns: [
          {from: 'node_modules/@tensorflow/tfjs-backend-wasm/dist/*.wasm'},
          {from: 'node_modules/@handtracking.io/yoha/models/', to: './'},
        ]
      })
    ],
    entry: {
      example: {
        import: './src/entry.js',
        filename: 'yoha.js',
      },
    },
    optimization: {
      minimize: true,
    }
  };

  return [config];
}
