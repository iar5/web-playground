const webpack = require('webpack')
const path = require('path')
const HtmlPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");


const IS_PROUCTION = process.env.NODE_ENV === 'production'

/* Export configuration */
module.exports = {
    mode: IS_PROUCTION ? 'production' : 'development',
    entry: { 
        game: './src/game/main.ts',
        admin: './src/admin/main.js'
    },
    plugins: [
        new HtmlPlugin({
            template: __dirname + '/src/game/index.html',
            filename: 'index.html',
            inject: 'body',
            chunks: ["game"]
        }),
        new HtmlPlugin({
            template: __dirname + '/src/admin/index.html',
            filename: 'admin/index.html',
            inject: 'body',
            chunks: ["admin"]
        }),
        new CopyPlugin([
            { from: 'public', to: '' },
        ]),
        new webpack.DefinePlugin({
            'process.env': {
                isProduction: process.env.NODE_ENV === 'production',
            }
        }),
    ],
    optimization: IS_PROUCTION ? {
        removeAvailableModules: false,
        minimize: true,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    format: {
                        comments: false,
                    },
                },
                extractComments: false,
            })
        ],
    } : {},
    output: {
        filename: '[name]/[name].js',
        path: __dirname + '/dist',
    },
    devServer: { 
        contentBase: "./dist",
        hot: true,
        inline: true,
        host: '0.0.0.0',
        disableHostCheck: true,
        // https: true,
        stats: {
            cached: false,
            cachedAssets: false,
            chunks: false,
            chunkModules: false,
            chunkOrigins: false,
            modules: false
        }
    },
    devtool: IS_PROUCTION ? false : "source-map",
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
            }, {
                test: /\.css$/,
                exclude: /[\/\\]src[\/\\]/,
                use: [
                    {
                        loader: 'style-loader',
                        options: {
                            sourceMap: true
                        }
                    },
                    { loader: 'css-loader' }
                ]
            }, {
                test: /\.css$/,
                exclude: /[\/\\](node_modules|bower_components|public)[\/\\]/,
                use: [
                    {
                        loader: 'style-loader',
                        options: {
                            sourceMap: true
                        }
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true,
                            importLoaders: 1,
                            localIdentName: '[path]___[name]__[local]___[hash:base64:5]'
                        }
                    }
                ]
            }, {
                test: /\.s[ac]ss$/i,
                use: [
                    // Creates `style` nodes from JS strings
                    "style-loader",
                    // Translates CSS into CommonJS
                    "css-loader",
                    // Compiles Sass to CSS
                    "sass-loader",
                ],
            }, {
                test: /\.(png|svg|jpg)$/,
                use: [
                    'file-loader',
                ],
            },
        ]
    },
    resolve: {
        extensions: [".web.ts", ".web.js", ".ts", ".js"]
    },
}