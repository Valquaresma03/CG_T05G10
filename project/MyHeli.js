import { CGFobject, CGFappearance } from "../lib/CGF.js";
import { MySphere } from "./MySphere.js";
import { MyCylinder } from "./MyCylinder.js";
import { MyHelix } from "./MyHelix.js";
import { MyLandingGear } from "./MyLandingGear.js";
import { MyBucket } from "./MyBucket.js";
import { MyFallingWater } from "./MyFallingWater.js";

export class MyHeli extends CGFobject {
    constructor(scene, defaultPosition = [0, 5.5, 0]) {
        super(scene);
        this.scene = scene;
        this.manualAltitude = false; 

        this.body = new MySphere(scene, 20, 10); // cockpit/head
        this.tail = new MyCylinder(scene, 10, 10); // tail
        this.mainHelix = new MyHelix(scene); // top rotor
        this.backHelix = new MyHelix(scene); // tail rotor
        this.landingGear = new MyLandingGear(scene); // landing gear
        this.bucket = new MyBucket(scene); // water bucket
        this.bucketHasWater = false;
        this.waterAnimationTime = 0;
        this.bucketOpen = false;
        this.waterJet = new MyFallingWater(scene);


        this.helixAngle = 0;

        //this.position = [0, 5.5, 0];
        this.defaultPosition = [...defaultPosition];
        this.position = [...defaultPosition];
        this.altitude = 5.5;
        this.orientation = 0; // Y-axis rotation
        this.velocity = [0, 0, 0];
        this.speed = 0;
        this.speedFactor = 2;
        this.cruiseAltitude = this.defaultPosition[1];
        this.baldeSolto = false;
        this.inclination = 0;

        this.state = "idle"; // idle | ascending | cruising | descending | goingToLake
        this.targetAltitude = 65; // altitude de cruzeiro
        this.ascendSpeed = 1.0;


        // Body material
        this.bodyMat = new CGFappearance(scene);
        this.bodyMat.setAmbient(0.3, 0.0, 0.0, 1);
        this.bodyMat.setDiffuse(0.7, 0.1, 0.1, 1);
        this.bodyMat.setSpecular(0.2, 0.2, 0.2, 1);
        this.bodyMat.setShininess(10.0);

                // Helix material (light gray)
        this.helixMat = new CGFappearance(scene);
        this.helixMat.setAmbient(0.5, 0.5, 0.5, 1);
        this.helixMat.setDiffuse(0.7, 0.7, 0.7, 1);
        this.helixMat.setSpecular(0.8, 0.8, 0.8, 1);
        this.helixMat.setShininess(30);

        this.noseMat = new CGFappearance(scene);
        this.noseMat.loadTexture("textures/nose.png");
        this.noseMat.setTextureWrap('CLAMP_TO_EDGE', 'CLAMP_TO_EDGE');


        this.descendingInitiated = false;
        this.rotating = false;

     }


    accelerate(v) {
        this.speed += v * this.speedFactor;
        if (v > 0) this.inclination = 0.15;
        else if (v < 0) this.inclination = -0.15;
    }

    turn(v) {
        this.orientation += v * this.speedFactor;
    }

    resetToDefault() {
        this.position = [...this.defaultPosition];
        this.velocity = [0, 0, 0];
        this.orientation = 0;
        this.inclination = 0;
        this.speed = 0;
        this.state = "idle";
        this.manualAltitude = false;
        this.baldeSolto = false;
        this.bucketHasWater = false;
        this.descendingInitiated = false;
        this.rotating = false;

    }


    goUp() {
        this.manualAltitude = true;
        this.rotating = true;


        // Apenas iniciar subida se estiver abaixo da altitude alvo
        if (this.position[1] < this.targetAltitude - 0.1) {
            this.velocity[1] = 2 * this.speedFactor;

            if (this.state === "idle" || this.state === "descending") {
                this.state = "ascending";
            }
        } else {
            this.velocity[1] = 0; // Não sobe mais se já está a altitude de cruzeiro
        }

        if (this.state === "atLake") {
        this.state = "ascending";
        this.manualAltitude = true;
        this.velocity[1] = 2 * this.speedFactor;
        this.baldeSolto = true;   
    }

    }
goDown() {
    // Se balde tiver água, não desce
    if (this.bucketHasWater) return;
    this.rotating = true;

    this.manualAltitude = true;

    if (this.isOverLake(this.scene.lake)) {
        const lakeY = this.scene.lake.getBounds().y;
        if (this.position[1] > lakeY + this.bucket.length + 0.5) {
            this.velocity[1] = -5 * this.speedFactor;
            this.state = "descendingToLake";
        }
    } else if (this.isOverHeliport(this.scene.building)) {
        const heliY = this.defaultPosition[1];
        if (this.position[1] > heliY + 0.5) {
            this.velocity[1] = -5 * this.speedFactor;
            this.state = "descendingToHeliport";
        }
    }
    else {
        // Not over lake or heliport: go back to heliport smoothly
        this.targetPosition = [...this.defaultPosition];
        this.returning = true;
        this.rotating = true;

        this.manualAltitude = true;
        this.baldeSolto = false;
        console.log("Outside target zones: returning to heliport...");
    }
}


    update(t) {
        if (!this.lastUpdateTime) this.lastUpdateTime = t;
        const delta_t = (t - this.lastUpdateTime) / 1000.0; // seconds
        this.lastUpdateTime = t;
    this.waterJet.update(delta_t);

if (this.returning && this.targetPosition) {
    this.rotating = true;

    const [tx, ty, tz] = this.targetPosition;
    const deltaX = tx - this.position[0];
    const deltaZ = tz - this.position[2];
    const distXZ = Math.sqrt(deltaX * deltaX + deltaZ * deltaZ);

    const moveSpeed = 10 * this.speedFactor;
    const step = moveSpeed * delta_t;

    if (distXZ > 0.2) {
        // Continua a mover-se horizontalmente até estar em cima do heliporto
        this.position[0] += (deltaX / distXZ) * Math.min(step, Math.abs(deltaX));
        this.position[2] += (deltaZ / distXZ) * Math.min(step, Math.abs(deltaZ));
    }

    // Agora verifica altura
    const heliportY = this.defaultPosition[1];
    const verticalDist = this.position[1] - heliportY;

    if (distXZ < 0.2) {
        // Só desce quando já estiver por cima
        if (verticalDist > 5) {
            this.velocity[1] = -5 * this.speedFactor;
        } else if (verticalDist > 0.5) {
            this.velocity[1] = -1.2 * this.speedFactor;
            this.baldeSolto = false;
        } else {
            // Chegou ao heliporto
            this.velocity[1] = 0;
            this.position[1] = heliportY;
            this.returning = false;
            this.state = "idle";
            this.manualAltitude = false;
            this.speed = 0;
            this.descendingInitiated = false;
            this.orientation = 0;
            this.scene.cameraFollowingHeli = false;
            this.rotating = false;
        }

        // Aplica descida
        this.position[1] += this.velocity[1] * delta_t;
    }

    return;
}


        // Update velocity based on speed and orientation
        this.velocity[0] = this.speed * Math.sin(this.orientation);
        this.velocity[2] = this.speed * Math.cos(this.orientation);

        // Update position
        this.position[0] += this.velocity[0] * delta_t * this.speedFactor * 5;
        this.position[1] += this.velocity[1] * delta_t * this.speedFactor * 2;
        this.position[2] += this.velocity[2] * delta_t * this.speedFactor * 5;




        
        // Gradually reduce vertical speed if not pressing P or L
        if (!this.scene.gui.isKeyPressed("KeyP") && !this.scene.gui.isKeyPressed("KeyL")) {
            this.velocity[1] *= 0.95; // decay factor, adjust as needed
            if (Math.abs(this.velocity[1]) < 0.01) this.velocity[1] = 0;
        }



        // Smoothly return inclination to zero if not accelerating
        if (!this.scene.gui.isKeyPressed("KeyW") && !this.scene.gui.isKeyPressed("KeyS")) {
            this.inclination *= 0.85; // decay factor, adjust for speed of return
            if (Math.abs(this.inclination) < 0.01) this.inclination = 0;
        }

        // Altitude fixa em voo
        //this.position[1] = this.cruiseAltitude;

        if (!this.manualAltitude) {
            this.position[1] = this.cruiseAltitude;
        }
        if (this.state === "ascending") {
            if (this.position[1] < this.targetAltitude) {
                this.position[1] += this.ascendSpeed;
                if (this.position[1] > this.targetAltitude)
                    this.position[1] = this.targetAltitude;
            } else {
                this.state = "cruising";
                this.baldeSolto = true;
            }
        }


    
        if (this.state === "descendingToLake") {
            this.lowerBucketToWater();
            return;
        }


        if (this.state === "descendingToHeliport") {
            this.lowerToHeliport();
            return;

        }

    if (this.rotating) {
                this.helixAngle = (t / 1000) % (2 * Math.PI);
            }
       
if (this.bucketOpen) {
    this.waterAnimationTime += delta_t;
    if (this.waterAnimationTime > 5) { // aumenta um pouco
        this.bucketOpen = false;
        this.waterAnimationTime = 0;
        this.descendingInitiated = false;
    }
}


        }


    

isOverLake(lake) {
  const bounds = lake.getBounds();
  const [hx, , hz] = this.position;

  return (
    hx >= bounds.xMin && hx <= bounds.xMax &&
    hz >= bounds.zMin && hz <= bounds.zMax
  );
}


isOverHeliport(building) {
    const heliportX = -building.totalWidth / 2 - building.wl + 8;
    const heliportZ = building.wl;
    const radius = 10;

    return (
        Math.abs(this.position[0] - heliportX) < radius &&
        Math.abs(this.position[2] - heliportZ) < radius
    );
}

lowerToHeliport() {
    this.rotating = true;
        this.manualAltitude = true;
    const heliportY = this.defaultPosition[1];
    if (this.position[1] > heliportY+5) {
            this.speed = 0;
            this.velocity[0] = 0;
            this.velocity[2] = 0;
            this.inclination = 0;
        this.velocity[1] = -5 * this.speedFactor;

    } else   if (this.position[1] > heliportY) {
                    this.speed = 0;
            this.velocity[0] = 0;
            this.velocity[2] = 0;
            this.inclination = 0;
        this.velocity[1] = -1.2 * this.speedFactor;
        this.baldeSolto = false;
    } 
    else {
        this.velocity[1] = 0;
        this.manualAltitude = false;
        this.state = "idle";
        this.descendingInitiated = false; 
        this.scene.cameraFollowingHeli = false;
        this.rotating = false;


    }
}



lowerBucketToWater() {
    this.rotating=true;
    const lakeY = 1.1;
    const bucketBottom = this.position[1] - 4;

    if (bucketBottom > lakeY + 0.5) {
            this.speed = 0;
            this.velocity[0] = 0;
            this.velocity[2] = 0;
            this.inclination = 0;
        this.velocity[1] = -3.5 * this.speedFactor;
    } else {
        this.bucketHasWater = true;
        this.velocity[1] = 0;
        this.manualAltitude = true;
        this.state = "idle";
        this.descendingInitiated = false; 
        this.rotating = false;
        console.log("Balde cheio com água.");
    }
    
}


isOverFire(fires) {
    const [hx, , hz] = this.position;

    // Ajustes de transformação aplicados na cena
    const offsetX = 10;
    const offsetZ = -65;
    const scale = 2.5; // aplica o mesmo scale que usas na floresta e no fogo

    return fires.some(fire => {
        const fx = offsetX + fire.x * scale;
        const fz = offsetZ + fire.z * scale;
        return (
            Math.abs(hx - fx) < 15 &&
            Math.abs(hz - fz) < 15
        );
    });
}


dropWater() {
  if (!this.bucketHasWater || this.bucketOpen) return;

  this.bucketHasWater = false;
  this.bucketOpen = true;
  this.waterAnimationTime = 0;
  this.descendingInitiated = false;
  this.waterJet.start();  // ← inicia animação da água
  console.log("Água despejada sobre o fogo!");
}



    display() {
        this.scene.pushMatrix();
        this.scene.translate(...this.position);
        this.scene.rotate(this.orientation, 0, 1, 0);
        this.scene.rotate(this.inclination, 1, 0, 0);
        this.scene.scale(2.2, 2.2, 2.5);

        
        // Water animation
        if (this.bucketOpen) {
            this.scene.pushMatrix();
            this.scene.translate(0, -4, 2.5); // ponto de origem da água (ajusta se necessário)
            this.scene.scale(0.3, 1.5, 0.3);  // dimensão da água (ajusta ao visual desejado)
            this.scene.setDefaultAppearance(); // aplica cor padrão
            this.waterJet.display();
            this.scene.popMatrix();
        }

        // Head / cockpit (front)
        this.scene.pushMatrix();
            this.bodyMat.apply();
            this.scene.translate(0, 0, 2.5);
            this.scene.scale(-2.2, 2.2, 2.5);
            this.scene.rotate(Math.PI,0,1,0);
            this.noseMat.apply(); // ellipsoid front
            this.body.display();
        this.scene.popMatrix();

        // Tail
        this.scene.pushMatrix();
            this.scene.translate(0, 0.1, -2.5);
            this.scene.scale(0.4, 0.4, 5);
            this.bodyMat.apply(); // ellipsoid front
            this.tail.display();
        this.scene.popMatrix();

        // Top rotor
        this.scene.pushMatrix();
            this.scene.translate(0, 2.2, 2);
            this.scene.scale(2,1,2);
            this.scene.rotate(-Math.PI/2, 1, 0, 0); 
            this.scene.rotate(this.helixAngle, 0, 0, 1); // ← rotação da hélice

            this.helixMat.apply();
            this.mainHelix.display();
        this.scene.popMatrix();

        // Tail rotor
        this.scene.pushMatrix();
            this.scene.translate(0, 0.3, -5);
            this.scene.rotate(Math.PI / 2, 0, 1, 0);
            this.scene.rotate(Math.PI/3, 0, 0, 1);
            this.scene.rotate(this.helixAngle, 0, 0, 1); // ← rotação da hélice
            this.scene.scale(0.5, 0.5, 0.8);
            this.helixMat.apply();
            this.backHelix.display();
        this.scene.popMatrix();


        // Landing gear
        this.scene.pushMatrix();
            this.scene.translate(0, -1.7, 2);
            this.scene.scale(3,1,3);
            this.helixMat.apply();
            this.landingGear.display();
        this.scene.popMatrix();


        // Hanging bucket
        this.scene.pushMatrix();
        if (this.baldeSolto) {
            this.scene.pushMatrix();
                this.scene.translate(0, -4, 2.5);
                this.scene.scale(2.5,2.5, 2.5);
                this.scene.rotate(Math.PI/2, 1,0,0);
                this.bucket.display();
            this.scene.popMatrix();
            this.scene.pushMatrix();
                this.scene.translate(0, -2.5, 2.5);
                this.scene.scale(0.05,1.2, 0.05);
                this.scene.rotate(Math.PI/2, 1,0,0);                
                this.tail.display();
            this.scene.popMatrix();
        }
        this.scene.popMatrix();




        this.scene.popMatrix();
    }

}
