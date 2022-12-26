const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    mode: 'development',
    entry: path.resolve(__dirname, 'assets/js/index.js'),
    output: {
        path: path.resolve(__dirname, 'bin/assets/js'),
        filename: 'bundle.js',
    },
    module: {
        rules: [{
            test: /\.scss$/,
            use: ['style-loader', 'css-loader', 'sass-loader'],
        }]
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Fake Market',
            filename: path.resolve(__dirname, 'bin/index.html'),
            template: path.resolve(__dirname, 'assets/template.html')
        })
    ]
}
