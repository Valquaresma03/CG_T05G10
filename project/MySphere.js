import { CGFobject } from '../lib/CGF.js';

export class MySphere extends CGFobject {
    constructor(scene, slices, stacks, radius = 1, coords) {
        super(scene);
        this.slices = slices;
        this.stacks = stacks;
        this.radius = radius;
        this.initBuffers();
        if (coords != undefined)
			this.updateTexCoords(coords);
    }

    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        const deltaPhi = 2 * Math.PI / this.slices;
        const deltaTheta = Math.PI / (2 * this.stacks); // stacks per hemisphere

        for (let stack = 0; stack <= 2 * this.stacks; stack++) {
            const theta = -Math.PI / 2 + stack * deltaTheta; // from -π/2 to π/2
            const cosTheta = Math.cos(theta);
            const sinTheta = Math.sin(theta);

            for (let slice = 0; slice <= this.slices; slice++) {
                const phi = slice * deltaPhi;
                const cosPhi = Math.cos(phi);
                const sinPhi = Math.sin(phi);

                const x = this.radius * cosTheta * sinPhi;
                const y = this.radius * sinTheta;
                const z = this.radius * cosTheta * cosPhi;

                this.vertices.push(x, y, z);

                // Normalized normal
                const length = Math.sqrt(x * x + y * y + z * z);
                this.normals.push(x / length, y / length, z / length);

                // Texture coordinates
                this.texCoords.push(slice / this.slices, 1 - stack / (2 * this.stacks));
            }
        }

        // Generate indices
        for (let stack = 0; stack < 2 * this.stacks; stack++) {
            for (let slice = 0; slice < this.slices; slice++) {
                const first = stack * (this.slices + 1) + slice;
                const second = first + this.slices + 1;

                if (stack == 0) {
                    // South pole
                    this.indices.push(first, second, second + 1);
                } else if (stack == 2 * this.stacks - 1) {
                    // North pole
                    this.indices.push(first, second, first + 1);
                } else {
                    // Quad split into two triangles
                    this.indices.push(first, second, first + 1);
                    this.indices.push(first + 1, second, second + 1);
                }
            }
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

    updateBuffers(slicesComplexity, stacksValue) {
        this.slices = 3 + Math.round(9 * slicesComplexity);
        this.stacks = stacksValue;
        this.initBuffers();
        this.initNormalVizBuffers();
    }

    updateTexCoords(coords) {
		this.texCoords = [...coords];
		this.updateTexCoordsGLBuffers();
	}
}
