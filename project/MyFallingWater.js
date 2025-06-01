import { CGFobject } from "../lib/CGF.js";
import { MyCylinder } from "./MyCylinder.js";

export class MyFallingWater extends CGFobject {
    constructor(scene) {
        super(scene);
        this.scene = scene;
        this.height = 0;
        this.maxHeight = 5;
        this.speed = 2; // units per second
        this.active = false;

        this.cylinder = new MyCylinder(scene, 10, 5);
    }

    start() {
        this.active = true;
        this.height = 0;
    }

    update(delta_t) {
        if (!this.active) return;

        this.height += this.speed * delta_t;
        if (this.height >= this.maxHeight) {
            this.active = false;
        }
    }

    display() {
        if (!this.active) return;

        this.scene.pushMatrix();
        this.scene.translate(0, -this.height / 2, 0); // move down as water falls
        this.scene.scale(0.9, this.height*2, 0.9);       // scale to simulate fall
        this.scene.setDefaultAppearance();
        this.scene.gl.disable(this.scene.gl.CULL_FACE);
        this.scene.gl.enable(this.scene.gl.BLEND);
        this.scene.gl.blendFunc(this.scene.gl.SRC_ALPHA, this.scene.gl.ONE_MINUS_SRC_ALPHA);
        this.scene.gl.colorMask(true, true, true, true);
        this.scene.gl.clearColor(0.2, 0.4, 1.0, 0.5); // blue semi-transparent
        this.cylinder.display();
        this.scene.gl.disable(this.scene.gl.BLEND);
        this.scene.gl.enable(this.scene.gl.CULL_FACE);
        this.scene.popMatrix();
    }
}
