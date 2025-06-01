#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;

uniform sampler2D uWaterMap;
uniform sampler2D uSampler2;
uniform float timeFactor;

void main() {
	vec4 color = texture2D(uSampler2, vTextureCoord+vec2(0.0,timeFactor*.01));
    vec4 texColor = texture2D(uWaterMap, vTextureCoord);

	
    gl_FragColor = mix(color, texColor, 0.2);
}
