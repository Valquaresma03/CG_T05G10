import { CGFobject } from '../lib/CGF.js';
import { MyQuad } from './MyQuad.js';

/**
 * MyDiamond
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
export class MyUnitCubeQuad  extends CGFobject {
    constructor(scene) {
        super(scene);
        this.quad = new MyQuad(scene); // Create a unit quad
        
    }

    display() {
        this.scene.pushMatrix();
        this.scene.translate(0, 0.5, 0);

                //face de tras
        this.scene.pushMatrix();
        this.scene.translate(0,0,-0.5);
        this.scene.rotate(this.scene.deg2rad(180),0,1,0);
         this.quad.display();
        this.scene.popMatrix();

        //face da frente
        this.scene.pushMatrix();
        this.scene.translate(0,0,0.5);
        this.quad.display();
        this.scene.popMatrix();

        //face de cima
        this.scene.pushMatrix();
        this.scene.rotate(this.scene.deg2rad(270),1,0,0);
        this.scene.translate(0,0,0.5);
        this.quad.display();
        this.scene.popMatrix();

        //face de baixo
        this.scene.pushMatrix();
        this.scene.rotate(this.scene.deg2rad(90),1,0,0);
        this.scene.translate(0,0,0.5);
        this.quad.display();
        this.scene.popMatrix();

        //face da direita
        this.scene.pushMatrix();
        this.scene.rotate(this.scene.deg2rad(90),0,1,0);
        this.scene.translate(0,0,0.5);
        this.quad.display();
        this.scene.popMatrix();

        //face da esquerda
        this.scene.pushMatrix();
        this.scene.rotate(this.scene.deg2rad(270),0,1,0);
        this.scene.translate(0,0,0.5);
        this.quad.display();
        this.scene.popMatrix();

        this.scene.popMatrix();

    }
}
