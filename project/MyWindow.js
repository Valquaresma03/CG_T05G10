import { CGFobject, CGFappearance } from '../lib/CGF.js';

export class MyWindow extends CGFobject {

    /**
     * @constructor
     * @param {CGFscene} scene - Reference to the scene
     * @param {number} width - Window width (default 1)
     * @param {number} height - Window height (default 1)
     * @param {CGFtexture} texture - The texture for this window
     */
    constructor(scene, width, height, texture) {
        super(scene);
        this.width = width;
        this.height = height;
        this.texture =texture;
        this.initBuffers();
        this.initAppearance();
    }

    initBuffers() {
        // Define a quad for the window
        this.vertices = [
            0,      0, 0,
            this.width, 0, 0,
            this.width, this.height, 0,
            0,      this.height, 0
        ];
        this.indices = [
            0, 1, 2,
            0, 2, 3
        ];
        // All normals point out of the front face.
        this.normals = [
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
            0, 0, 1
        ];
        // Map the texture to cover the whole window
        this.texCoords = [
            0, 1,
            1, 1,
            1, 0,
            0, 0
        ];
        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
    
    initAppearance() {
        this.appearance = new CGFappearance(this.scene);
        this.appearance.setAmbient(0.2, 0.2, 0.2, 1.0);
        this.appearance.setDiffuse(0.8, 0.8, 0.8, 1.0);
        this.appearance.setSpecular(0.0, 0.0, 0.0, 1.0);
        this.appearance.setShininess(10.0);
        this.appearance.setTexture(this.texture);
        this.appearance.setTextureWrap('CLAMP_TO_EDGE', 'CLAMP_TO_EDGE');
    }
    
    display() {
        this.appearance.apply();
        super.display();
    }

}