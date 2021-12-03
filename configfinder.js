const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const fs = require('fs')
const isProd = process.env.NODE_ENV === "production"


const entrys = {}
const htmlWebpacks = []
const copyPlugins = []

const devSingleProjectModeProjectName = undefined // "island"


function findExperiment(dir) {
    const result = []
    fs.readdirSync(dir).forEach(file => {

        const filePath = path.join(dir, file)
        if (!isProd && devSingleProjectModeProjectName && !filePath.includes(devSingleProjectModeProjectName)) return;
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
            },
            meta: {
                viewport: "width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0",
                description: config.description,
                keywords: config.tags.join(", ")
            },
            title: config.title,
            favicon: "public/favicon.png"
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


exports.entrys = entrys
exports.htmlWebpacks = htmlWebpacks
exports.copyPlugins = copyPlugins
exports.findExperiment = findExperiment