import { CGFobject, CGFappearance } from "../lib/CGF.js";
import { MyTriangle } from "../tp4/MyTriangle.js";

export class MyFire extends CGFobject {
constructor(scene, numFlames, texture, shader = null, x = 0, y = 0, z = 0)
{   super(scene);
    this.scene = scene;
    this.numFlames = numFlames;
    this.texture = texture;
    this.shader = shader;

    this.x = x;
    this.y = y;
    this.z = z;
    this.active = true;


    this.material = new CGFappearance(scene);
    this.material.setAmbient(1.0, 0.2, 0.0, 1);
    this.material.setDiffuse(1.0, 0.5, 0.0, 1);
    this.material.setSpecular(0.1, 0.1, 0.1, 1);
    this.material.setShininess(10);
    this.material.setTexture(this.texture);
    this.material.setTextureWrap("REPEAT", "REPEAT");

    this.triangle = new MyTriangle(scene);

    this.flames = [];
    this.generateFlames();
  }


    generateFlames() {
    for (let i = 0; i < this.numFlames; i++) {


      const rotation = Math.random() * 5 * Math.PI;
      const scale = 0.3 + Math.random() * 8;

      // 
      // Guardar parâmetros de transformação
      this.flames.push({rotation, scale });
    }
  }

  extinguish() {
    console.log("Fire extinguished at", this.x, this.z);
    this.active = false;
  }

  display() {
    if (!this.active) return;

    if (this.shader) {
      this.scene.setActiveShader(this.shader);
      this.shader.setUniformsValues({
        uTime: performance.now() / 1000.0,
        uSampler: 0
      });
    }
    this.material.apply();
    this.scene.pushMatrix();
    this.scene.translate(this.x, this.y, this.z); // Position the fire in the world

    for (const flame of this.flames) {
      const { rotation, scale } = flame;
      this.scene.pushMatrix();
      this.scene.translate(0, scale, 0);
      this.scene.scale(scale, scale, scale);
      this.scene.rotate(rotation, 0, 1, 0);
      this.triangle.display();
      this.scene.popMatrix();
    }

    this.scene.popMatrix();
    if (this.shader) this.scene.setActiveShader(this.scene.defaultShader);

    }
}
