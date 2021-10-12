const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')

module.exports = {
  entry: {
    background: './src/background/background.js',
    content: './src/content/content.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    publicPath: '/',
    filename: (pathData) => {
      if (pathData.chunk.name === 'background') {
        return '[name].js'
      }
      if (pathData.chunk.name === 'content') {
        return '[name].js'
      }
      return '[name].bundle.js'
    },
  },
  mode: 'development',
  devServer: {
    contentBase: './dist',
    writeToDisk: true,
  },
  plugins: [
    new CopyPlugin({
      patterns: [{ from: 'public', to: '' }],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        resourceQuery: { not: [/raw/] },
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
      {
        resourceQuery: /raw/,
        type: 'asset/source',
      },
    ],
  },
}
