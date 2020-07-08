const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
    mode: 'production',
    entry: './index.js',
    output: {
        filename: '[name].js',
        path: __dirname + '/dist'
    },
    module: {
        rules: [{
            test: /pro-cfg.js$/,
            use: {
                loader: path.resolve('./loaders/config.loader.js')
            }
        }]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './index.ejs'
        }),
    ],
    performance: {
        hints: false
    },
    devtool: "cheap-module-eval-source-map",
    devServer: {
        port: 8096,
        disableHostCheck: true,
        proxy: {
            '/getOldHtml': {
                target: 'http://localhost:8080',
                pathRewrite: {
                    '^/getOldHtml': ''
                }
            }
        }
    }
};