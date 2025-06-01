import { CGFobject } from "../lib/CGF.js";
import { MyTree } from "./MyTree.js";

export class MyForest extends CGFobject {
  constructor(scene, rows, cols, areaWidth, areaDepth, trunkTexture, leavesTexture) {
    super(scene);
    this.trees = [];
    this.scene = scene;
    this.rows = rows;
    this.cols = cols;

    const cellSizeX = areaWidth / cols;
    const cellSizeZ = areaDepth / rows;
    const minCellSize = Math.min(cellSizeX, cellSizeZ);

    const maxCanopyDiameter = minCellSize * 0.9; // espaço máximo por árvore
    const maxTrunkRadius = maxCanopyDiameter / 10;

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const offsetX = 0; // sem deslocamento aleatório horizontal
        const offsetZ = 0;

        const trunkRadius = 0.5 + Math.random() * (maxTrunkRadius - 0.2);
        const height = 10 + Math.random() * (minCellSize );
        const inclination = (Math.random() - 0.5) * 10 * 0.9;
        const axis = Math.random() < 0.5 ? 'X' : 'Z';

        const x = -areaWidth / 2 + j * cellSizeX + cellSizeX / 2 + offsetX;
        const z = -areaDepth / 2 + i * cellSizeZ + cellSizeZ / 2 + offsetZ;

        const tree = new MyTree(
          scene,
          inclination,
          axis,
          trunkRadius,
          height,
          trunkTexture,
          leavesTexture
        );

        this.trees.push({ tree, x, z });
      }
    }
  }

  display() {
    for (const { tree, x, z } of this.trees) {
      this.scene.pushMatrix();
      this.scene.translate(x, 0, z);
      tree.display();
      this.scene.popMatrix();
    }
  }
}
