import {CGFobject} from '../lib/CGF.js';
/**
* MyPlane
* @constructor
 * @param scene - Reference to MyScene object
 * @param nDivs - number of divisions in both directions of the surface
 * @param minS - minimum texture coordinate in S
 * @param maxS - maximum texture coordinate in S
 * @param minT - minimum texture coordinate in T
 * @param maxT - maximum texture coordinate in T
*/
export class MyPlane extends CGFobject {
constructor(scene, nrDivs, minS, maxS, minT, maxT, coords) {
		super(scene);
		// nrDivs = 1 if not provided
		nrDivs = typeof nrDivs !== 'undefined' ? nrDivs : 1;
		this.nrDivs = nrDivs;
		this.patchLength = 1.0 / nrDivs;
		this.minS = minS || 0;
		this.maxS = maxS || 1;
		this.minT = minT || 0;
		this.maxT = maxT || 1;
		this.q = (this.maxS - this.minS) / this.nrDivs;
		this.w = (this.maxT - this.minT) / this.nrDivs;


		this.initBuffers();
		if (coords != undefined)
			this.updateTexCoords(coords);
		
	}
	initBuffers() {
		this.vertices = [];
		this.normals = [];
		this.texCoords = [];
		this.indices = [];

		// ───────────── Parte superior ─────────────
		for (let j = 0; j <= this.nrDivs; j++) {
			let y = 0.5 - j * this.patchLength;
			for (let i = 0; i <= this.nrDivs; i++) {
				let x = -0.5 + i * this.patchLength;

				// Vertex e normal para cima
				this.vertices.push(x, y, 0);
				this.normals.push(0, 0, 1);
				this.texCoords.push(this.minS + i * this.q, this.minT + j * this.w);
			}
		}

		for (let j = 0; j < this.nrDivs; j++) {
			for (let i = 0; i < this.nrDivs; i++) {
				let a = j * (this.nrDivs + 1) + i;
				let b = a + 1;
				let c = a + this.nrDivs + 1;
				let d = c + 1;

				this.indices.push(a, c, b); // Triângulo 1
				this.indices.push(b, c, d); // Triângulo 2
			}
		}

		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	}

	setFillMode() { 
		this.primitiveType=this.scene.gl.TRIANGLE_STRIP;
	}

	setLineMode() 
	{ 
		this.primitiveType=this.scene.gl.LINES;
	};
	/**
	 * @method updateTexCoords
	 * Updates the list of texture coordinates of the quad
	 * @param {Array} coords - Array of texture coordinates
	 */
	updateTexCoords(coords) {
		this.texCoords = [...coords];
		this.updateTexCoordsGLBuffers();
	}

	display() {
	this.scene.pushMatrix();
	super.display();
	this.scene.popMatrix();
	}


}


