import { CGFobject, CGFappearance } from "../lib/CGF.js";
import { MyQuad } from "./MyQuad.js"; // Se tiveres um quad reutilizável

export class MyLake extends CGFobject {
  /**
   * @param {CGFscene} scene - A cena
   * @param {number} size - Lado do quadrado do lago
   * @param {CGFtexture} texture - Textura da água
   */
  constructor(scene, size, texture, shader = null) {
    super(scene);
    this.size = size;
    this.texture = texture;
    this.quad = new MyQuad(scene);
    this.shader = shader;

    this.material = new CGFappearance(scene);
    this.material.setAmbient(0.2, 0.4, 0.8, 1);
    this.material.setDiffuse(0.2, 0.6, 1.0, 1);
    this.material.setSpecular(0.1, 0.1, 0.1, 1);
    this.material.setShininess(20);
    this.material.setTexture(texture);
    this.material.setTextureWrap('REPEAT', 'REPEAT');
  }

getBounds() {
  const lakeCenterX = 175;
  const lakeCenterZ = 75;
  const lakeRadius =this.size;

  return {
    xMin: lakeCenterX - lakeRadius,
    xMax: lakeCenterX + lakeRadius,
    zMin: lakeCenterZ - lakeRadius,
    zMax: lakeCenterZ + lakeRadius,
    y: 1 // altura do lago para verificar o nível
  };
}

  display() {
          if (this.shader) {
    this.scene.setActiveShader(this.shader);
    this.shader.setUniformsValues({
      uTime: performance.now() / 1000.0,
      uSampler: 0
    });
  }

    this.material.apply();
    this.scene.pushMatrix();

    // posicionar o lago
    this.scene.translate(0, 0.01, 0); // ligeiramente acima do plano de chão
    this.scene.scale(this.size, 1, this.size);
    this.scene.rotate(-Math.PI / 2, 1, 0, 0); // colocar o quad na horizontal

    this.quad.display();
    this.scene.popMatrix();
  }
}
