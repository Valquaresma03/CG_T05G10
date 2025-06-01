// MyBucket.js
import { CGFobject } from '../lib/CGF.js';
import { MyCylinder } from './MyCylinder.js';

export class MyBucket extends CGFobject {
    constructor(scene) {
        super(scene);
        this.bucketBody = new MyCylinder(scene, 20, 5);
    }

    display() {
        this.scene.pushMatrix();
        this.scene.scale(0.3, 0.3, 0.5);
        this.bucketBody.display();
        this.scene.popMatrix();
    }
}
