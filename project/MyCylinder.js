import { CGFobject } from '../lib/CGF.js';

export class MyCylinder extends CGFobject {
    constructor(scene, slices, stacks) {
        super(scene);
        this.slices = slices; // Number of sides
        this.stacks = stacks; // Number of floors
        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];


        const radius = 1; // Radius of the cylinder
        const height = 1; // Height of the prism
        const alphaAng = (2 * Math.PI) / this.slices; // Angle increment between slices
        const stackHeight = 1.0 / this.stacks;

        // Generate vertices and normals
        for (let stack = 0; stack <= this.stacks; stack++) {
            const z = -0.5 + stack * stackHeight;
                for (let slice = 0; slice < this.slices; slice++) {
                var angle = slice * alphaAng; // Current angle
                var x = radius * Math.cos(angle);
                var y = radius * Math.sin(angle);

                // Add vertex
                this.vertices.push(x, y, z);

                // Normalize the normal vector
                const normal = [x, y, 0];
                const length = Math.sqrt(normal[0] * normal[0] + normal[1] * normal[1]);
                normal[0] /= length; 
                normal[1] /= length; 
                this.normals.push(...normal); 

                        // Texture coords: u = slice/slices, v = stack/stacks
                this.texCoords.push(slice / this.slices, stack / this.stacks);
            }
        }

    // Bottom center (z = 0)
    this.vertices.push(0, 0, 0);
    this.normals.push(0, 0, -1); // Normal points down (-Z)

    // Top center (z = height)
    this.vertices.push(0, 0,  height);
    this.normals.push(0, 0, 1); // Normal points up (+Z)

        // Generate indices for triangles
        for (let stack = 0; stack < this.stacks; stack++) {
            for (let slice = 0; slice < this.slices; slice++) {
                var nextSlice = (slice + 1) % this.slices;

                // Indices for current stack and next stack
                var current = stack * this.slices + slice; //stack * slices: Skips all vertices in previous stacks + slice: adds the specific slice of a vertex
                var next = stack * this.slices + nextSlice;
                var belowCurrent = (stack + 1) * this.slices + slice;
                var belowNext = (stack + 1) * this.slices + nextSlice;

                // First triangle (current -> next -> belowNext)
                this.indices.push(current, next, belowNext);
                // Second triangle (current -> belowNext -> belowCurrent)
                this.indices.push(current, belowNext, belowCurrent);
            }
        }

        // Indices for the bottom cap
        const bottomCenterIndex = (this.stacks + 1) * this.slices; // Index of bottom center
        /*
        for (let slice = 0; slice < this.slices; slice++) {
            const nextSlice = (slice + 1) % this.slices;

            const current = slice; // Perimeter vertex at stack 0
            const next = nextSlice;

            // Triangle: center -> next -> current (order ensures correct normal direction)
            this.indices.push(bottomCenterIndex, next, current);
            
        }*/

        // Indices for the top cap
        const topCenterIndex = bottomCenterIndex + 1; // Index of top center
        for (let slice = 0; slice < this.slices; slice++) {
            const nextSlice = (slice + 1) % this.slices;

            const current = this.stacks * this.slices + slice; // Perimeter vertex at top stack
            const next = this.stacks * this.slices + nextSlice;

            // Triangle: center -> current -> next (order ensures correct normal direction)
            this.indices.push(topCenterIndex, current, next);
        }

        // Set primitive type
        this.primitiveType = this.scene.gl.TRIANGLES;

        // Initialize buffers
        this.initGLBuffers();
    }

    /**
     * Called when user interacts with GUI to change object's complexity.
     * @param {integer} complexity - changes number of slices
     */
    updateBuffers(slicesComplexity, stacksValue) {
        // Update slices based on complexity (0-1)
        this.slices = 3 + Math.round(9 * slicesComplexity);
        // Update stacks directly (1-10)
        this.stacks = stacksValue;
        this.initBuffers();
        this.initNormalVizBuffers();
    }
}