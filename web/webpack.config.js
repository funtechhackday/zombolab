const path = require('path');
const webpack = require('webpack');
const CompressionPlugin = require('compression-webpack-plugin');

const NODE_ENV = process.env.NODE_ENV || 'development'; // production | development

module.exports = {
    entry: './src/static/app.js',
    output: {
        filename: '[name].js?ver=[chunkhash]',
        path: path.resolve(__dirname, 'public/js/webpack/'),
        publicPath: "/js/webpack/",
    },

    externals: {
        'vue': 'Vue',
        'vue-router': 'VueRouter',
        'vuex': 'Vuex'
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: [{
                    loader: 'babel-loader',
                    options: {
                        presets: [['es2016']],
                        plugins: [
                            'syntax-dynamic-import',
                        ]
                    }
                }]
            },
            {
                test: /\.css$/,
                use: [
                    {loader: "css-loader"},
                ]
            },
            {
                test: /\.less/,
                use: [
                    {loader: "style-loader"},
                    {loader: "css-loader"},
                    {loader: "less-loader"},
                ]
            }
        ]
    },

    plugins: [
        new webpack.optimize.ModuleConcatenationPlugin(),
        new CompressionPlugin({
            asset: "[path].gz?ver=[chunkhash]",
        }),
    ],

    watch: false,
    devtool: 'source-map'
};
