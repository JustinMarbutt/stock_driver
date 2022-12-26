const path = require('path')

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
    }
}
