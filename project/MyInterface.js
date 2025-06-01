import { CGFinterface, dat } from '../lib/CGF.js';

/**
* MyInterface
* @constructor
*/
export class MyInterface extends CGFinterface {
    constructor() {
        super();
        this.userIsDraggingCamera = false;
    }

    init(application) {
        // call CGFinterface init
        super.init(application);

        // init GUI. For more information on the methods, check:
        // https://github.com/dataarts/dat.gui/blob/master/API.md
        this.gui = new dat.GUI();


        
        this.gui.add(this.scene, 'displayAxis').name("Display axis");
        this.gui.add(this.scene, 'displayPlane').name('Display Plane');
        this.gui.add(this.scene, 'displaySphere').name('Sphere');
        this.gui.add(this.scene, 'displayPanorama').name('Panorama');
        this.gui.add(this.scene, 'displayBuilding').name('Display Building');
        this.gui.add(this.scene, 'displayTree').name("Display Tree");
        this.gui.add(this.scene, 'displayForest').name('Display Forest');
        this.gui.add(this.scene, 'displayHeli').name('Display Helicopter');
        this.gui.add(this.scene, 'infinitePanorama').name('Inf Panorama');
        
        
        this.gui.add(this.scene, 'speedFactor', 0.1, 3).name('Speed Factor').onChange((value) => {
        this.scene.heli.speedFactor = value; });

        const canvas = application.gl ? application.gl.canvas : this.scene.gl.canvas;
        canvas.addEventListener('mousedown', (e) => {
            if (e.button === 0) this.scene.userIsDraggingCamera = true;
        });
        canvas.addEventListener('mouseup', (e) => {
            if (e.button === 0) this.scene.userIsDraggingCamera = false;
        });
        

        // Anothe forlder for grouping the custom material's parameters
        var f2 = this.gui.addFolder('Custom Material');
        
        f2.addColor(this.scene.customMaterialValues,'Ambient').onChange(this.scene.updateCustomMaterial.bind(this.scene));
        f2.addColor(this.scene.customMaterialValues,'Diffuse').onChange(this.scene.updateCustomMaterial.bind(this.scene));
        f2.addColor(this.scene.customMaterialValues,'Specular').onChange(this.scene.updateCustomMaterial.bind(this.scene));
        f2.add(this.scene.customMaterialValues,'Shininess', 0, 100).onChange(this.scene.updateCustomMaterial.bind(this.scene));

        var treeFolder = this.gui.addFolder('Tree Parameters');
        //treeFolder.add(this.scene.treeParams, 'inclination', -45, 45).name('Inclinação (°)').onChange(this.scene.updateTree);
        //treeFolder.add(this.scene.treeParams, 'axis', ['X', 'Z']).name('Eixo').onChange(this.scene.updateTree);
        //treeFolder.add(this.scene.treeParams, 'trunkRadius', 0.1, 5).name('Raio Tronco').onChange(this.scene.updateTree);
        //treeFolder.add(this.scene.treeParams, 'height', 5, 50).name('Altura').onChange(this.scene.updateTree);
       // treeFolder.addColor(this.scene.treeColorValues,'Ambient').onChange(this.scene.updateTreeColor.bind(this.scene));
        //treeFolder.addColor(this.scene.treeColorValues,'Diffuse').onChange(this.scene.updateTreeColor.bind(this.scene));
        //treeFolder.addColor(this.scene.treeColorValues,'Specular').onChange(this.scene.updateTreeColor.bind(this.scene));
        //treeFolder.add(this.scene.treeColorValues,'Shininess', 0, 100).onChange(this.scene.updateTreeColor.bind(this.scene));
        treeFolder.add(this.scene.forestParams, 'rows', 2, 10, 2).name("Linhas Floresta").onChange(this.scene.updateForest);
        treeFolder.add(this.scene.forestParams, 'cols', 2, 10, 2).name("Colunas Floresta").onChange(this.scene.updateForest);


        this.initKeys();

        return true;
    }

    initKeys() {
        // create reference from the scene to the GUI
        this.scene.gui = this;

        // disable the processKeyboard function
        this.processKeyboard = function () { };

        // create a named array to store which keys are being pressed
        this.activeKeys = {};
    }
    processKeyDown(event) {
        // called when a key is pressed down
        // mark it as active in the array
        this.activeKeys[event.code] = true;
    };

    processKeyUp(event) {
        // called when a key is released, mark it as inactive in the array
        this.activeKeys[event.code] = false;
    };

    isKeyPressed(keyCode) {
        // returns true if a key is marked as pressed, false otherwise
        return this.activeKeys[keyCode] || false;
    }

}