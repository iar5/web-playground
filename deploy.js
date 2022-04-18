// https://www.npmjs.com/package/ftp-deploy

var FtpDeploy = require('ftp-deploy');
var ftpDeploy = new FtpDeploy();
 
var config = {
    user: "tom",                   
    password: "d4X5vic3%IFsrptj",                       // optional, prompted if none given
    host: "tomwendland.de",
    port: 21,
    localRoot: __dirname + '/dist',
    remoteRoot: '/experiments.tomwendland.de',
    include: ['*', '**/*'],      // this would upload everything except dot files
    //exclude: ['programs/**'],                 // e.g. exclude sourcemaps ['dist/**/*.map'] - ** exclude: [] if nothing to exclude **
    deleteRemote: false,              // delete ALL existing files at destination before uploading, if true
    forcePasv: true                 // Passive mode is forced (EPSV command is not sent)
}
 
// use with promises
ftpDeploy.deploy(config)
    .then(res => console.log('finished:', res))
    .catch(err => console.log(err))
    
