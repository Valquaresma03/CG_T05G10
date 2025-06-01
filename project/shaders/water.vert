attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;
uniform float timeFactor;
uniform sampler2D uWaterMap;
uniform float uHeightScale;
varying vec2 vTextureCoord;

uniform sampler2D uSampler2;
uniform float waterTexSpeed; // Speed for the water map movement


void main() {
    float height = texture2D(uWaterMap, aTextureCoord).r;
    
    vec3 displacedPosition = aVertexPosition + aVertexNormal * height * uHeightScale;
    
    // Compute a phase offset that depends on the vertex's x and y positions
    // This ensures that vertices don't all oscillate at the same time.
    float phase = timeFactor - (aVertexPosition.x + aVertexPosition.y) * 20.0;
    
    vec3 offset = vec3(0.0, 0.0, 0.005 * sin(phase));
    gl_Position = uPMatrix * uMVMatrix * vec4(displacedPosition + offset, 1.0);
        vTextureCoord  = aTextureCoord + vec2(0.0, timeFactor * waterTexSpeed);

}
