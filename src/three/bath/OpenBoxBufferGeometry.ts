import { BufferGeometry } from "three";
import THREE = require("three");



export default class OpenBoxBufferGeometry extends BufferGeometry{

    constructor(){
        super()

        const vertices = [
            // front
            { pos: [-1, -1, 1], norm: [0, 0, 1], uv: [0, 0], },
            { pos: [1, -1, 1], norm: [0, 0, 1], uv: [1, 0], },
            { pos: [-1, 1, 1], norm: [0, 0, 1], uv: [0, 1], },

            { pos: [-1, 1, 1], norm: [0, 0, 1], uv: [0, 1], },
            { pos: [1, -1, 1], norm: [0, 0, 1], uv: [1, 0], },
            { pos: [1, 1, 1], norm: [0, 0, 1], uv: [1, 1], },
            // right
            { pos: [1, -1, 1], norm: [1, 0, 0], uv: [0, 0], },
            { pos: [1, -1, -1], norm: [1, 0, 0], uv: [1, 0], },
            { pos: [1, 1, 1], norm: [1, 0, 0], uv: [0, 1], },

            { pos: [1, 1, 1], norm: [1, 0, 0], uv: [0, 1], },
            { pos: [1, -1, -1], norm: [1, 0, 0], uv: [1, 0], },
            { pos: [1, 1, -1], norm: [1, 0, 0], uv: [1, 1], },
            // back
            { pos: [1, -1, -1], norm: [0, 0, -1], uv: [0, 0], },
            { pos: [-1, -1, -1], norm: [0, 0, -1], uv: [1, 0], },
            { pos: [1, 1, -1], norm: [0, 0, -1], uv: [0, 1], },

            { pos: [1, 1, -1], norm: [0, 0, -1], uv: [0, 1], },
            { pos: [-1, -1, -1], norm: [0, 0, -1], uv: [1, 0], },
            { pos: [-1, 1, -1], norm: [0, 0, -1], uv: [1, 1], },
            // left
            { pos: [-1, -1, -1], norm: [-1, 0, 0], uv: [0, 0], },
            { pos: [-1, -1, 1], norm: [-1, 0, 0], uv: [1, 0], },
            { pos: [-1, 1, -1], norm: [-1, 0, 0], uv: [0, 1], },

            { pos: [-1, 1, -1], norm: [-1, 0, 0], uv: [0, 1], },
            { pos: [-1, -1, 1], norm: [-1, 0, 0], uv: [1, 0], },
            { pos: [-1, 1, 1], norm: [-1, 0, 0], uv: [1, 1], },
            // top
            /*{ pos: [1, 1, -1], norm: [0, 1, 0], uv: [0, 0], },
            { pos: [-1, 1, -1], norm: [0, 1, 0], uv: [1, 0], },
            { pos: [1, 1, 1], norm: [0, 1, 0], uv: [0, 1], },

            { pos: [1, 1, 1], norm: [0, 1, 0], uv: [0, 1], },
            { pos: [-1, 1, -1], norm: [0, 1, 0], uv: [1, 0], },
            { pos: [-1, 1, 1], norm: [0, 1, 0], uv: [1, 1], },*/
            // bottom
            { pos: [1, -1, 1], norm: [0, -1, 0], uv: [0, 0], },
            { pos: [-1, -1, 1], norm: [0, -1, 0], uv: [1, 0], },
            { pos: [1, -1, -1], norm: [0, -1, 0], uv: [0, 1], },

            { pos: [1, -1, -1], norm: [0, -1, 0], uv: [0, 1], },
            { pos: [-1, -1, 1], norm: [0, -1, 0], uv: [1, 0], },
            { pos: [-1, -1, -1], norm: [0, -1, 0], uv: [1, 1], },
        ];

        const positions = [];
        const normals = [];
        const uvs = [];

        for (const vertex of vertices) {
            positions.push(...vertex.pos);
            normals.push(...vertex.norm);
            uvs.push(...vertex.uv);
        }

        const positionNumComponents = 3;
        const normalNumComponents = 3;
        const uvNumComponents = 2;
        this.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), positionNumComponents));
        this.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(normals), normalNumComponents));
        this.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(uvs), uvNumComponents));
    }
}