import { CGFobject } from '../lib/CGF.js';

/**
 * MyTriangleBig
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
export class MyTriangle extends CGFobject {
	constructor(scene, coords) {
        super(scene);

        this.initBuffers();
        if (coords != undefined)
			this.updateTexCoords(coords);
    }
    initBuffers() {
        this.vertices = [
                -2, 0, 0, //esq baixo frente 0
                2, 0, 0, //dir baixo frente 1
                0, 2, 0, //centro cima frente 2

                2,0,0, //esq baixo tras 3
                -2,0,0, // dir baixo tras 4
                0,2,0, //centro cima tras 5
                ];

        this.indices = [
                0, 1, 2,
                3,4,5,
            ];

        this.normals = [
            0,0,1,
            0,0,1,
            0,0,1,

            0,0,-1,
            0,0,-1,
            0,0,-1,
        ]

                        		/*
		Texture coords (s,t)
		+----------> s
        |
        |
		|
		v
        t
        */
        this.texCoords = [
            1, 0,
            0,0,
            0.5, 0.5,

            0, 0,
            1, 0,
            0.5,0.5
        ]

        this.primitiveType=this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
        	/**
	 * @method updateTexCoords
	 * Updates the list of texture coordinates of the quad
	 * @param {Array} coords - Array of texture coordinates
	 */
	updateTexCoords(coords) {
		this.texCoords = [...coords];
		this.updateTexCoordsGLBuffers();
	}
}