import { CGFobject, CGFappearance , CGFtexture} from "../lib/CGF.js";
import { MyWindow } from "./MyWindow.js";
import { MyUnitCubeQuad } from "./MyUnitCubeQuad.js";
import { MyQuad } from "./MyQuad.js";

export class MyBuilding extends CGFobject {
    /**
     * @constructor
     * @param {CGFscene} scene - The scene
     * @param {number} totalWidth - Total width of the building (all three modules)
     * @param {number} numFloorsLateral - Number of floors for the lateral modules
     * @param {number} numWindowsPerFloor - Number of windows per floor
     * @param {CGFtexture} windowTexture - Texture to be used for the windows
     * @param {Array} buildingColor - [r, g, b] color of the building (each in 0..1)
     */
    constructor(scene, totalWidth, numFloorsLateral, numWindowsPerFloor, windowTexture, buildingColor) {
        
        super(scene);
        this.totalWidth = totalWidth;
        this.numFloorsLateral = numFloorsLateral;
        this.numWindowsPerFloor = numWindowsPerFloor;
        this.windowTexture = windowTexture;
        // Save buildingColor as a public property so it can be modified via the interface.
        this.buildingColor = buildingColor;
        
        // Use a constant floor height.
        this.floorHeight = 10;
        
        // Define module dimensions.
        // Let the central module have width wc and the lateral modules 75% of wc.
        this.wc = this.totalWidth / 2.5;
        this.wl = 0.75 * this.wc;

        // Similarly for depth.
        this.dc = this.wc;
        this.dl = 0.75 * this.wc;
        
        // The central module has one extra floor than the lateral modules.
        this.centralFloors = numFloorsLateral + 1;
        
        // Create a unit cube for constructing the building's modules.
        this.cube = new MyUnitCubeQuad(scene);
        this.quad = new MyQuad(scene);

        
        // Create a window (a single instance is reused for each window display).
        // Assume standard window dimensions.
        this.window = new MyWindow(scene,5, 5, windowTexture);

        this.doorAppearance = new CGFappearance(scene);
        this.doorAppearance.loadTexture("textures/door.png");
        this.doorAppearance.setTextureWrap('CLAMP_TO_EDGE', 'CLAMP_TO_EDGE');
    
        this.signAppearance = new CGFappearance(scene);
        this.signAppearance.loadTexture("textures/sign_bombeiros.png");
        this.signAppearance.setTextureWrap('REPEAT', 'REPEAT');
    
   
        this.helipadAppearance = new CGFappearance(scene);
        this.helipadAppearance.loadTexture("textures/helipad.png");
        this.helipadAppearance.setTextureWrap('REPEAT', 'REPEAT');    }
    

    // Helper: Draw a cuboid module (using MyUnitCubeQuad scaled to [width, height, depth]).
    drawModule(width, height, depth) {
        this.wallAppearance.apply();
        this.scene.pushMatrix();
        this.scene.scale(width, height, depth);
        this.cube.display();
        this.scene.popMatrix();
    }
    
    // Draw windows on the front facade for a given floor (floorIndex: 0 is ground floor).
    drawWindows(moduleWidth, moduleDepth, floorIndex, isCentral) {
        let margin = 0.2 * moduleWidth;

        let availableWidth = moduleWidth - margin;
        let windowSpacing = availableWidth / this.numWindowsPerFloor;
        let windowScale = 0.8;

        
        // Vertical position for the window on this floor.
        let windowY = (floorIndex +0.5) * this.floorHeight;

        // The front face is at z = moduleDepth/2, offset slightly.
        let zOffset = moduleDepth / 2 + 0.01;
        
        this.scene.pushMatrix();

        // Translate so that the left edge of the module is at x = -moduleWidth/2.
        this.scene.translate(-moduleWidth/1.75, 0, zOffset);
        
        for (let i = 0; i < this.numWindowsPerFloor; i++) {
            this.scene.pushMatrix();
            // Compute x position for this window.
            let xPos = margin / 2 + windowSpacing * i + windowSpacing / 2;
            this.scene.translate(xPos, windowY, 0);
            this.scene.scale(windowScale, windowScale, 1);

            this.window.display();
            this.scene.popMatrix();
        }
        this.scene.popMatrix();
    }



    display() {
        this.wallAppearance.apply();

        this.scene.pushMatrix();

        // Translate building to a corner of the scene.
        this.scene.translate(-this.totalWidth/2, 0, 0);
        
        // Left module.
        this.scene.pushMatrix();

            let leftHeight = this.numFloorsLateral * this.floorHeight;
            this.drawModule(this.wl, leftHeight, this.dl);
            for (let i = 0; i < this.numFloorsLateral; i++) {
                this.drawWindows(this.wl, this.dl, i, false);
            }
        this.scene.popMatrix();
        
        // Central module.
        this.scene.pushMatrix();
            this.scene.translate(this.wl+5, 0, 0);
            
            let centralHeight = this.centralFloors * this.floorHeight;
            this.drawModule(this.wc, centralHeight, this.dc);
            for (let i = 1; i < this.centralFloors; i++) {
                this.drawWindows(this.wc, this.dc, i, true);
            }
 
                // Porta (nível 0)
            this.scene.pushMatrix();
                const doorW = this.wc * 0.5;
                const doorH = this.floorHeight;
                this.scene.translate(0, doorH/2, this.dc/2 + 0.05);
                this.scene.scale(doorW, doorH, 1);

                this.doorAppearance.apply();

                this.quad.display();
            this.scene.popMatrix();

            this.scene.pushMatrix();
                const signW = doorW * 0.6;
                const signH = doorH * 0.2;
                this.scene.translate(0, doorH + signH/2 + 0.1, this.dc/2 + 0.05);
                this.scene.scale(signW, signH, 1);

                this.signAppearance.apply();
                
                this.quad.display();
            this.scene.popMatrix();

            this.scene.pushMatrix();
                this.scene.translate(0, centralHeight+1, 0, this.wc * 0.3);
                this.scene.scale(50,50,50);
                this.scene.rotate(Math.PI/2, -1, 0,0);
                this.helipadAppearance.apply();
                
                this.quad.display();
            this.scene.popMatrix();  

        this.scene.popMatrix();
        
        // Right module.
        this.scene.pushMatrix();
            this.scene.translate(this.wl + 0.9*this.wc, 0, 0);
            let rightHeight = this.numFloorsLateral * this.floorHeight;
            this.drawModule(this.wl, rightHeight, this.dl);
            for (let i = 0; i < this.numFloorsLateral; i++) {
                this.drawWindows(this.wl, this.dl, i, false);
            }
        this.scene.popMatrix();
        
        this.scene.popMatrix();
    }
}
