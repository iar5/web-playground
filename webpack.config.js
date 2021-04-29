const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");
const fs = require('fs')


const entrys = {}
const experiments = []
const htmlWebpacks = []
const copyPlugins = []

function findExperiment(dir){
    fs.readdirSync(dir).forEach(file => {

        const filePath = path.join(dir, file);
        if (!fs.statSync(filePath).isDirectory()) return

        const p = `./${filePath}/`
        if (!fs.existsSync(p + `config.js`)) return
        const config = require(p + `config.js`)
        
        entrys[file] = p + config.entry
        config._path = file 
        experiments.push(config)

        htmlWebpacks.push(new HtmlWebpackPlugin({
            template: config.html ? p + config.html : '/src/experiment.html',
            filename: file + '/index.html',
            inject: 'body',
            chunks: [file],
            templateParameters: {
                config
            }
        }))

        if (config.copy){
            config.copy.forEach(copy=>{
                copyPlugins.push(new CopyPlugin([
                    { from: filePath + "/" + copy, to: file+"/"+copy },
                ]))
            })
        }
    });
}
findExperiment("./src/webgl/")
findExperiment("./src/three/")





module.exports = {
    entry: entrys,
    plugins: [
        new CopyPlugin([
            { from: 'assets', to: '' },
        ]),
        new HtmlWebpackPlugin({
            template: '/src/index.html',
            filename: 'index.html',
            templateParameters: {
                experiments
            },
            chunks: []
        })
    ].concat(htmlWebpacks).concat(copyPlugins),
    output: {
        filename: '[name]/[name].js',
        path: __dirname + '/dist',
    },
    devServer: {
        //host: '0.0.0.0',
        // https: true,
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