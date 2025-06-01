// MyLandingGear.js
import { CGFobject } from '../lib/CGF.js';
import { MyCylinder } from './MyCylinder.js';

export class MyLandingGear extends CGFobject {
    constructor(scene) {
        super(scene);
        this.leg = new MyCylinder(scene, 10, 1);
        this.crossbar = new MyCylinder(scene, 10, 1);
    }

    display() {
        this.scene.pushMatrix();
        this.scene.translate(-0.5, -0.5, 0);
        this.scene.scale(0.05, 0.05, 1);
        this.leg.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0.5, -0.5, 0);
        this.scene.scale(0.05, 0.05, 1);
        this.leg.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0, -0.5, 0);
        this.scene.scale(1, 0.05, 0.05);
        this.crossbar.display();
        this.scene.popMatrix();
    }
}
