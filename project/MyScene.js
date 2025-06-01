import { CGFscene, CGFcamera, CGFaxis, CGFappearance, CGFtexture, CGFshader } from "../lib/CGF.js";
import { MyPlane } from "./MyPlane.js";
import { MySphere } from "./MySphere.js";
import { MyPanorama } from "./MyPanorama.js";
import { MyBuilding } from "./MyBulding.js";
import { MyTree } from "./MyTree.js";
import { MyForest } from './MyForest.js';
import { MyHeli } from './MyHeli.js';
import { MyHelix } from "./MyHelix.js";
import { MyLandingGear } from "./MyLandingGear.js";
import { MyBucket } from "./MyBucket.js";
import { MyFire } from "./MyFire.js";
import { MyLake } from "./MyLake.js";


/**
 * MyScene
 * @constructor
 */
export class MyScene extends CGFscene {
  constructor() {
    super();
    this.userIsDraggingCamera = false;
  }

  deg2rad(deg){
    return deg * Math.PI / 180;
  }

  init(application) {
    super.init(application);

    this.initCameras();
    this.initLights();

    this.speedFactor = 1; 

    //Background color
    this.gl.clearColor(0, 0, 0, 1.0);

    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);

    this.enableTextures(true);

    this.setUpdatePeriod(50);

    this.fireShader = new CGFshader(this.gl, "shaders/fire.vert", "shaders/fire.frag");
    this.fireShader.setUniformsValues({
			uSampler2: 0,       // fire texture on texture unit 0
			uWaterMap: 1,       // fire map on texture unit 1
			timeFactor: 0,      // initial time factor
			waterTexSpeed: 0.02,  // control the fire texture animation speed
		});

    this.waterShader = new CGFshader(this.gl, "shaders/water.vert", "shaders/water.frag");
    this.waterShader.setUniformsValues({
			uSampler2: 0,       // water texture on texture unit 0
			uWaterMap: 1,       // water map on texture unit 1
			timeFactor: 0,      // initial time factor
			waterTexSpeed: 0.01,  // control the water texture animation speed
		});


this.leavesTexture = new CGFtexture(this, "textures/folhas.png");
this.trunkTexture = new CGFtexture(this, "textures/tronco.png");
this.fireTexture = new CGFtexture(this, "textures/fire.png");
this.lakeTexture = new CGFtexture(this, "textures/lake.png");


this.treeParams = {
  inclination: 0,
  axis: 'X',
  trunkRadius: 0.5,
  height: 7.5,
  trunkTexture: this.trunkTexture,
  leavesTexture: this.leavesTexture
};

  this.forestParams = {
    rows: 5,
    cols: 7
  };
  this.updateForest = () => {
    this.forest = new MyForest(
      this,
      this.forestParams.rows,
      this.forestParams.cols,
      80,
      80,
      this.trunkTexture,
      this.leavesTexture
    );
  };

    //Initialize scene objects
    this.axis = new CGFaxis(this, 20, 1);
    this.plane = new MyPlane(this, 64, 0, 1, 0, 1);
    this.lakePlane = new MyPlane(this, 32); // attachToCamera = false por defeito

    this.drawnTiles = new Set(); // para guardar “x,z” de cada tile desenhado


    this.sphere = new MySphere(this, 15, 10, 15);
      this.tree = new MyTree(
        this,
        this.treeParams.inclination,
        this.treeParams.axis,
        this.treeParams.trunkRadius,
        this.treeParams.height,
        this.trunkTexture,
        this.leavesTexture
      );
      this.forest = new MyForest(this, 5, 4, 80, 80, this.trunkTexture, this.leavesTexture);

      this.updateForest();
      this.burningTrees = [this.forest.trees[0]];
      for (const bt of this.burningTrees) {
        bt.fire = new MyFire(this, 10, this.fireTexture, this.fireShader, bt.x, 0, bt.z);
      }
      //this.fire = new MyFire(this, 10, this.fireTexture, this.fireShader);

      this.lake = new MyLake(this, 75, this.lakeTexture, this.waterShader);


    this.planeMaterial = new CGFappearance(this);
    this.planeMaterial.setAmbient(0.1, 0.1, 0.1, 1);
    this.planeMaterial.setDiffuse(0.9, 0.9, 0.9, 1);
    this.planeMaterial.setSpecular(0.1, 0.1, 0.1, 1);
    this.planeMaterial.setShininess(10.0);
    this.planeMaterial.loadTexture('textures/grass.png');
    this.planeMaterial.setTextureWrap('REPEAT', 'REPEAT');  
    

    // Create material for the sphere (earth texture)
    this.earthMaterial = new CGFappearance(this);
    // Increase ambient and specular components to brighten up the sphere
    this.earthMaterial.setAmbient(0.4, 0.4, 0.4, 1);
    this.earthMaterial.setDiffuse(1.0, 1.0, 1.0, 1);
    this.earthMaterial.setSpecular(0.2, 0.2, 0.2, 1);
    this.earthMaterial.setShininess(20.0);
    this.earthMaterial.loadTexture('textures/earth.png');
    this.earthMaterial.setTextureWrap('REPEAT', 'REPEAT');


    // Assuming your panorama image is in "textures/panorama.jpg"
    this.panoramaTexture = new CGFtexture(this, 'textures/panorama4.jpg');

    this.panorama = new MyPanorama(this, this.panoramaTexture);

    this.windowTexture = new CGFtexture(this, 'textures/window.jpg');

        
    this.customMaterialValues = {
      'Ambient': '#ffffff',
      'Diffuse': '#ffffff',
      'Specular': '#ffffff',
      'Shininess': 10
  }
  this.customMaterial = new CGFappearance(this);

    this.building = new MyBuilding(this, 
      200,         // totalWidth (adjust as needed)
      3,          // lateral modules: 5 floors
      4,          // 3 windows per floor
      this.windowTexture,
      [255,255,255]);  // building color (white)


    this.building.wallAppearance = this.customMaterial;


      const centralHeight = this.building.centralFloors * this.building.floorHeight;
      const heliportX = -this.building.totalWidth / 2 - this.building.wl  + 8;
      const heliportY = centralHeight + 7;
      const heliportZ = this.building.wl;

      this.heli = new MyHeli(this, [heliportX, heliportY, heliportZ]);


      this.heli.speedFactor = this.speedFactor;




    this.displayAxis = false;
    this.displayPlane = true ;
    this.displaySphere = false;
    this.displayPanorama = true;
    this.displayBuilding = true;
    this.displayTree = false;
    this.displayForest = true;
    this.displayHeli = true;

    this.infinitePanorama = false;



    this.wasOverLake = false;

    this.ambientLigth = 0.3; 

    this.updateTree = () => {
      if (this.tree) delete this.tree;
      this.tree = new MyTree(
        this,
        this.treeParams.inclination,
        this.treeParams.axis,
        this.treeParams.trunkRadius,
        this.treeParams.height,
        this.trunkTexture,
        this.leavesTexture
            );
    };
    
    // Criação inicial
    this.updateTree();
    
  this.updateCustomMaterial();

    this.cameraFollowingHeli = false;

    // Save initial camera setup
    this.initialCameraPosition = vec3.clone(this.camera.position);
    this.initialCameraTarget = vec3.clone(this.camera.target);

  }

  
  initLights() {
    this.lights[0].setPosition(200, 200, 200, 1);
    this.lights[0].setDiffuse(1.0, 1.0, 1.0, 1.0);
    this.lights[0].enable();
    this.lights[0].update();
  }

  initCameras() {
    this.camera = new CGFcamera(
      1.0,
      0.1,
      100000,
      vec3.fromValues(-210, 75, 90),  // posição (um pouco acima e atrás)
      vec3.fromValues(0, 0, 0)
    );
  }

checkKeys() {
  if (!this.heli) return;

  this.heli.speedFactor = this.speedFactor;

  if (this.gui.isKeyPressed("KeyW")) {
    this.heli.accelerate(0.07);
  }
  if (this.gui.isKeyPressed("KeyS")) {
    this.heli.accelerate(-0.07);
  }
  if (this.gui.isKeyPressed("KeyA")) {
    this.heli.turn(0.04);
  }
  if (this.gui.isKeyPressed("KeyD")) {
    this.heli.turn(-0.04);
  }
  if (this.gui.isKeyPressed("KeyR")) {
    this.heli.resetToDefault();
  }

  if (this.gui.isKeyPressed("KeyP")) {

        this.heli.goUp();
  }

if (this.gui.isKeyPressed("KeyL") && !this.heli.descendingInitiated) {
  const overLake = this.heli.isOverLake(this.lake);
  const overHeliport = this.heli.isOverHeliport(this.building);

  if (overLake && !this.heli.bucketHasWater) {
    console.log("Sobre o lago - a descer para encher balde.");
    this.heli.state = "descendingToLake";
    this.heli.descendingInitiated = true;
  } else if (overHeliport && !this.heli.bucketHasWater) {
    console.log("Sobre o heliporto - a descer para aterrar.");
    this.heli.state = "descendingToHeliport";
    this.heli.descendingInitiated = true;
  }
  else if (!overLake && !overHeliport && !this.heli.bucketHasWater) {
    console.log("Fora das zonas válidas - a regressar suavemente ao heliporto.");
    this.heli.targetPosition = [...this.heli.defaultPosition];
    this.heli.returning = true;
    this.heli.manualAltitude = true;
    this.heli.state = "descendingToHeliport";
    this.heli.descendingInitiated = true;
  }


}

if (this.gui.isKeyPressed("KeyO")) {
    if (this.heli.bucketHasWater && !this.heli.bucketOpen) {
        const anyFires = this.burningTrees && this.burningTrees.length > 0;

        if (!anyFires) {
            console.log("Sem fogos ativos - água descartada.");
            this.heli.dropWater();
        } else {
            let dropped = false;
            for (const bt of this.burningTrees) {
                if (this.heli.isOverFire([{ x: bt.x, z: bt.z }])) {
                    this.heli.dropWater();
                    bt.fire.extinguish();
                    dropped = true;
                }
            }

            if (!dropped) {
                console.log("Não sobre nenhum fogo - água não usada.");
            }
        }
    }
}


}


 

  update(t) {
    this.checkKeys();
    this.fireShader.setUniformsValues({ timeFactor: t / 100 % 100 });
    this.waterShader.setUniformsValues({ timeFactor: t / 100 % 100 });

    if (this.camera.position[1] < 0.5) {
      this.camera.position[1] = 0.5;
  }
  this.heli.update(t);

  const currentlyOverLake = this.heli.isOverLake(this.lake);
  if (currentlyOverLake && !this.wasOverLake) {
    console.log("O helicóptero entrou na área do lago.");
  }
  this.wasOverLake = currentlyOverLake;


    if (this.cameraFollowingHeli && !this.userIsDraggingCamera) {
        this.updateCameraFollow();
    }

    if (this.gui.isKeyPressed("KeyP")) {
        this.cameraFollowingHeli = true;
    }

    if (this.gui.isKeyPressed("KeyR")) {
        this.resetCameraToStart();
        this.cameraFollowingHeli = false;
    }

  //console.log(this.camera.position[0], this.camera.position[1], this.camera.position[2]);
  }
  
  updateCameraFollow() {
      const distance = 110;
      const height = 50;

      const heli = this.heli;
      const [hx, hy, hz] = heli.position;
      const angle = heli.orientation;

      const camX = hx - Math.sin(angle) * distance;
      const camZ = hz - Math.cos(angle) * distance;
      const camY = hy + height;

      this.camera.setPosition(vec3.fromValues(camX, camY, camZ));
      this.camera.setTarget(vec3.fromValues(hx-5, hy + 25, hz-5));
  }

  resetCameraToStart() {
      this.camera.setPosition(this.initialCameraPosition);
      this.camera.setTarget(this.initialCameraTarget);
  }


  setDefaultAppearance() {
    this.setAmbient(0.5, 0.5, 0.5, 1.0);
    this.setDiffuse(0.5, 0.5, 0.5, 1.0);
    this.setSpecular(0.5, 0.5, 0.5, 1.0);
    this.setShininess(10.0);
  }

  hexToRgbA(hex)
  {
      var ret;
      //either we receive a html/css color or a RGB vector
      if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
          ret=[
              parseInt(hex.substring(1,3),16).toPrecision()/255.0,
              parseInt(hex.substring(3,5),16).toPrecision()/255.0,
              parseInt(hex.substring(5,7),16).toPrecision()/255.0,
              1.0
          ];
      }
      else
          ret=[
              hex[0].toPrecision()/255.0,
              hex[1].toPrecision()/255.0,
              hex[2].toPrecision()/255.0,
              1.0
          ];
      return ret;
  }

  updateCustomMaterial() {
      this.customMaterial.setAmbient(...this.hexToRgbA(this.customMaterialValues['Ambient']));
      this.customMaterial.setDiffuse(...this.hexToRgbA(this.customMaterialValues['Diffuse']));
      this.customMaterial.setSpecular(...this.hexToRgbA(this.customMaterialValues['Specular']));

      this.customMaterial.setShininess(this.customMaterialValues['Shininess']);

  };

  display() {
    // ---- BEGIN Background, camera and axis setup
    // Clear image and depth buffer everytime we update the scene
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    // Initialize Model-View matrix as identity (no transformation
    this.updateProjectionMatrix();
    this.loadIdentity();
    // Apply transformations corresponding to the camera position relative to the origin
    this.applyViewMatrix();

          
    // Draw axis
    if(this.displayAxis)
      this.axis.display();

    this.setDefaultAppearance();

    if(this.displayBuilding){
      this.pushMatrix()
      this.translate(-150,0,25);
      this.rotate(this.deg2rad(90),0,1,0);
      this.customMaterial.apply();

      this.building.display();
      this.popMatrix();
    }

    if (this.displayPlane) {
      this.planeMaterial.apply();

      const unitSize = 100;
      const range = 10; // metade do raio de visão
      const camX = this.camera.position[0];
      const camZ = this.camera.position[2];

      const centerX = Math.round(camX / unitSize);
      const centerZ = Math.round(camZ / unitSize);

      for (let i = -range; i <= range; i++) {
        for (let j = -range; j <= range; j++) {
          const tileX = centerX + i;
          const tileZ = centerZ + j;
          const key = `${tileX},${tileZ}`;

          // desenhar apenas se ainda não foi desenhado
          if (!this.drawnTiles.has(key)) {
            this.drawnTiles.add(key);

            this.pushMatrix();
            this.translate(tileX * unitSize, 0, tileZ * unitSize);
            this.scale(unitSize, 1, unitSize);
            this.rotate(-Math.PI / 2, 1, 0, 0);
            this.plane.display();
            this.popMatrix();
          }
        }
      }

      // redesenha os já existentes
      for (const key of this.drawnTiles) {
        const [tileX, tileZ] = key.split(",").map(Number);

        this.pushMatrix();
        this.translate(tileX * unitSize, 0, tileZ * unitSize);
        this.scale(unitSize, 1, unitSize);
        this.rotate(-Math.PI / 2, 1, 0, 0);
        this.plane.display();
        this.popMatrix();
      }
    }


    if (this.displaySphere) {
      this.pushMatrix();
      // The sphere is centered at the origin; adjust transformations here if needed
      this.earthMaterial.apply();
      this.sphere.display();
      this.popMatrix();
    }

    if (this.displayTree) {
      this.pushMatrix();
      this.translate(0, 0, 0);
      this.tree.display();
      this.popMatrix();
    }

    if (this.displayForest) {
      this.pushMatrix();
        this.translate(10,0,-65);
        this.scale(2.5,2.5,2.5);
        this.forest.display();
      this.popMatrix();
    }

    this.pushMatrix();
        this.translate(175, 1, 75);
        this.lake.display();
    this.popMatrix();

    this.pushMatrix();
      this.translate(10,0,-65);
              this.scale(2.5,2.5,2.5);

      if (this.burningTrees && this.burningTrees.length > 0){
      for (const bt of this.burningTrees) {  
        bt.fire.display();
      }}
      this.setActiveShader(this.defaultShader);

    this.popMatrix();

    if (this.displayHeli) {
      //this.heli.update(t);
      this.heli.display();
    }


    if (this.displayPanorama)
      this.panorama.display();

    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);

  }
}


