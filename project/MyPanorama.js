import { CGFappearance } from "../lib/CGF.js";
import { MySphere } from "./MySphere.js";

export class MyPanorama {
  /**
   * @constructor
   * @param {CGFscene} scene - The scene.
   * @param {CGFtexture} panoramaTexture - The panorama texture (e.g., an equirectangular image)
   */
  constructor(scene, panoramaTexture) {
    this.scene = scene;
    this.sphere = new MySphere(scene, 50, 25, 300);

    this.appearance = new CGFappearance(scene);
    this.appearance.setAmbient  (0, 0, 0, 1);
    this.appearance.setDiffuse  (0, 0, 0, 1);
    this.appearance.setSpecular (0, 0, 0, 1);
    this.appearance.setEmission(1, 1, 1, 1);

    // Load and set the panorama texture.
    this.appearance.setTexture(panoramaTexture);
    this.appearance.setTextureWrap('REPEAT', 'REPEAT');
  }

  display() {
    this.scene.pushMatrix();
  

    // Apply the panorama appearance (with the emissive texture).
    this.appearance.apply();

        if (this.scene.infinitePanorama)
              {   let p = this.scene.camera.position;
                  this.scene.translate(p[0], p[1], p[2]);
                }

    // Draw the sphere.
    this.sphere.display();

    this.scene.popMatrix();
  }
}
