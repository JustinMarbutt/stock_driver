const path = require('path');
var webpack = require("webpack");
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: path.resolve(__dirname, 'app/js/index.js'),
    output: {
        path: path.resolve(__dirname, 'bin/'),
        filename: 'bundle.js',
        clean: true
    },
    devtool: 'source-map',
    module: {
        rules: [{
            test: /\.scss$/,
            use: ['style-loader', 'css-loader', 'sass-loader'],
        },{
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
          }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Fake Market',
            filename: path.resolve(__dirname, 'bin/index.html'),
            template: path.resolve(__dirname, 'app/template.html')
        }),
        new webpack.ProvidePlugin({
            $: require.resolve('jquery'),
            jQuery: require.resolve('jquery')
        }),
    ]
}
