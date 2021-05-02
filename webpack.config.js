const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const fs = require('fs')




const isProd = process.env.NODE_ENV === "production"


const entrys = {}
const htmlWebpacks = []
const copyPlugins = []

function findExperiment(dir) {
    const result = []
    fs.readdirSync(dir).forEach(file => {

        const filePath = path.join(dir, file)
        if (!fs.statSync(filePath).isDirectory()) return

        const srcPath = `./${filePath}/`
        if (!fs.existsSync(srcPath + `config.js`)) return
        const config = require(srcPath + `config.js`)
        if (isProd && config.public == false) return

        // create chunk
        const outPath = srcPath.replace("/src", "").replace(/\\/g, '/') // windows backslash replace
        entrys[outPath] = srcPath + config.entry
        config.urlPath = outPath + "index.html"
        result.push(config)

        // setup chunk injection
        htmlWebpacks.push(new HtmlWebpackPlugin({
            filename: outPath + '/index.html',
            chunks: [outPath],
            template: config.html ? srcPath + config.html : './src/experiment.html',
            inject: 'body',
            templateParameters: {
                config // geht in die template html mit rein
            }
        }))

        // copy local assets 
        copyPlugins.push({
            from: srcPath.slice(0, -1).substring(2), // letzten backslash entfernen und ./ am anfang entfernen
            to: outPath,
            ignore: ['*.js', '*.ts', '*.css', "*.html"],
        })
    });
    return result.sort((a, b) => { a.title === b.title ? 0 : a.title < b.title ? -1 : 1; })
}

const webglExperiments = findExperiment("./src/webgl/")
const threeExperiments = findExperiment("./src/three/")




module.exports = {
    mode: isProd ? "production" : "development",
    entry: entrys,
    plugins: [
        new CleanWebpackPlugin(),
        new CopyPlugin([
            { from: 'assets', to: '' },
        ].concat(copyPlugins)),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: 'index.html',
            templateParameters: {
                isProd,
                experimentsCategories: { "WebGL": webglExperiments, "Three.js": threeExperiments }
            },
            chunks: []
        })
    ].concat(htmlWebpacks),
    output: {
        // wird für jedes HtmlWebpackPlugin durchgeführt
        path: __dirname + '/dist',
        filename: '[name].js',
    },
    devServer: {
        //host: '0.0.0.0',
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