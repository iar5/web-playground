

const finder = require('./configfinder');

exports.otherExperiments = finder.findExperiment("./src/other/")
exports.webglExperiments = finder.findExperiment("./src/webgl/")
exports.threeExperiments = finder.findExperiment("./src/three/")
exports.githubExperiments = [
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
    },{
        title: "mandelbulb",
        urlPath: "https://github.com/iar5/mandelbulb",
        tags: ["WebGL", "Simulation", "Realtime", "Fragment Shader"],
        public: true,
    },{
        title: "img-displacement",
        urlPath: "https://github.com/iar5/img-displacement",
        tags: ["WebGL", "Simulation", "Realtime", "Vertex Shader"],
        public: true,
    }
]
console.log(JSON.stringify(exports));

