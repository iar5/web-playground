const webpack = require('webpack')
const path = require('path')
const fs = require('fs')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const isProd = process.env.NODE_ENV === "production"
const configfinder = require('./configfinder');

const otherExperiments = configfinder.findExperiment("./src/other/")
const webglExperiments = configfinder.findExperiment("./src/webgl/")
const threeExperiments = configfinder.findExperiment("./src/three/")
const githubExperiments = [
    {
        title: "SPH fluid siimulation",
        urlPath: "https://github.com/iar5/webgl-sph-water",
        tags: ["WebGL", "Simulation", "Physics"],
        public: true,
    },{
        title: "webgl-heightfield-water",
        urlPath: "https://github.com/iar5/webgl-heightfield-water",
        tags: ["WebGL", "Simulation", "Realtime"],
        public: true,
    }
]

const entrys = configfinder.entrys
const htmlWebpacks = configfinder.htmlWebpacks
const copyPlugins = configfinder.copyPlugins

module.exports = {
    mode: isProd ? "production" : "development",
    entry: entrys,
    plugins: [
        new CleanWebpackPlugin(),
        new CopyPlugin([
            { from: 'public', to: '' },
        ].concat(copyPlugins)),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: 'index.html',
            templateParameters: {
                isProd,
                experimentsCategories: { 
                    "WebGL native": webglExperiments, 
                    "Three.js": threeExperiments, 
                    "Other": otherExperiments,
                    "GitHub": githubExperiments 
                }
            },
            chunks: []
        })
    ].concat(htmlWebpacks),
    output: {
        // wird für jedes HtmlWebpackPlugin durchgeführt
        path: __dirname + '/dist',
        filename: '[name]main.js',
    },
    devServer: {
        host: '0.0.0.0',
        //https: true,
        contentBase: "./dist",
        hot: true,
        inline: true,
        disableHostCheck: true,
        stats: {
            cached: false,
            cachedAssets: false,
            chunks: false,
            chunkModules: false,
            chunkOrigins: false,
            modules: false
        }
    },
    devtool: "source-map",
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
                test: /\.(png|svg|jpe?g)$/,
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