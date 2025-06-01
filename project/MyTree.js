import { CGFobject, CGFappearance } from '../lib/CGF.js';
import { MyCylinder } from './MyCylinder.js';
import { MyPyramid } from './MyPyramid.js';

export class MyTree extends CGFobject {
    
  deg2rad(deg){
    return deg * Math.PI / 180;
  }

      /**
   * @param {CGFscene} scene
   * @param {number} inclinationDeg - Inclinação da árvore em graus
   * @param {'X'or'Z'} axis - Eixo de inclinação
   * @param {number} trunkRadius - Raio da base do tronco
   * @param {number} height - Altura total da árvore
   * @param {Array} foliageColor - Array [r, g, b] para a copa (valores entre 0 e 1)
   */

      constructor(scene, inclinationDeg, axis, trunkRadius, height, trunkTexture, canopyTexture) {
        super(scene);

        this.axis = axis;
        this.inclination = this.deg2rad(inclinationDeg);

        this.trunkRadius = trunkRadius;
        this.height = height;

        this.trunkHeight = height * 0.2;
        this.canopyHeight = height * 0.8;

        this.numCanopyLayers = Math.max(1, Math.floor(this.canopyHeight / 4));
        
        this.canopyRadius = trunkRadius * 5;

        this.trunk = new MyCylinder(scene, 20, 10);
        this.canopy = new MyPyramid(scene, 6 , 10); // pirâmide com base hexagonal

        this.trunkMaterial = new CGFappearance(scene);
        this.trunkMaterial.setAmbient(0.4, 0.2, 0.05, 1);
        this.trunkMaterial.setDiffuse(0.6, 0.3, 0.1, 1);
        this.trunkMaterial.setSpecular(0.1, 0.1, 0.1, 1);
        this.trunkMaterial.setShininess(5.0);
        this.trunkMaterial.setTexture(trunkTexture);

        //this.canopyMaterial = canopyMaterial;
        this.canopyMaterial = new CGFappearance(scene);
        this.canopyMaterial.setAmbient(0.2, 0.5, 0.2, 1);
        this.canopyMaterial.setDiffuse(0.4, 0.8, 0.4, 1);
        this.canopyMaterial.setSpecular(0.1, 0.2, 0.1, 1);
        this.canopyMaterial.setShininess(5.0);
        this.canopyMaterial.setTexture(canopyTexture);

  }

  display() {
    this.scene.pushMatrix();

        // Aplicar inclinação
        if (this.axis === 'X' || this.axis === 'x') {
            this.scene.rotate(this.inclination, 0, 0, 1);
          } else if (this.axis === 'Z' || this.axis === 'z') {
            this.scene.rotate(this.inclination, 1, 0, 0);
          }

    // ── Tronco ──
    this.scene.pushMatrix();
        this.trunkMaterial.apply();
        this.scene.translate(0, this.trunkHeight / 2, 0); // levanta a base para Y = 0
        this.scene.rotate(-Math.PI / 2, 1, 0, 0);         // roda para eixo Y
        this.scene.scale(this.trunkRadius, this.trunkRadius, this.trunkHeight); 
        this.trunk.display();
    this.scene.popMatrix();

      let currentY = this.trunkHeight;
  const layerHeight = this.canopyHeight / this.numCanopyLayers;

  for (let i = 0; i < this.numCanopyLayers; i++) {
      const scale = 1 - i * 0.075;
      const baseRadius = this.canopyRadius * scale;


      this.scene.pushMatrix();
      this.canopyMaterial.apply();
      this.scene.translate(0, currentY, 0);
      const safeHeight = Math.max(layerHeight, 0.01); // evitar valores negativos ou 0
      this.scene.scale(baseRadius, safeHeight, baseRadius);      
      this.canopy.display();
      this.scene.popMatrix();

      currentY += (layerHeight/3);
    }

    this.scene.popMatrix();
  }
}
