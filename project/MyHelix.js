// MyHelix.js
import { CGFobject } from '../lib/CGF.js';

export class MyHelix extends CGFobject {
    constructor(scene) {
        super(scene);
        this.bladeLength = 3;
        this.bladeWidth = 0.2;
        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        // Two perpendicular blades (like an X)
        const l = this.bladeLength;
        const w = this.bladeWidth;

        // First blade
        this.vertices.push(-l, -w, 0,  l, -w, 0,  l, w, 0,  -l, w, 0);
        this.normals.push(0, 0, 1,  0, 0, 1,  0, 0, 1,  0, 0, 1);
        this.texCoords.push(0, 0, 1, 0, 1, 1, 0, 1);
        this.indices.push(0, 1, 2, 0, 2, 3);

                // First blade (bottom face)
        this.vertices.push(-l, -w, 0,  -l, w, 0,  l, w, 0,  l, -w, 0);
        this.normals.push(0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1);
        this.texCoords.push(0, 0, 1, 0, 1, 1, 0, 1);
        this.indices.push(4, 5, 6, 4, 6, 7);


        // Second blade (rotated 90 degrees)
        this.vertices.push(-w, -l, 0,  w, -l, 0,  w, l, 0,  -w, l, 0);
        this.normals.push(0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1);
        this.texCoords.push(0, 0, 1, 0, 1, 1, 0, 1);
        this.indices.push(8, 9,10,8,10,11);

        // Second blade (bottom face)
        this.vertices.push(-w, -l, 0,  -w, l, 0,  w, l, 0,  w, -l, 0);
        this.normals.push(0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1);
        this.texCoords.push(0, 0, 1, 0, 1, 1, 0, 1);
        this.indices.push(12, 13, 14, 12, 14, 15);

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}
