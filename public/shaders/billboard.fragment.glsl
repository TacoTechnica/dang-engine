precision highp float;

// Varying
varying vec2 uvV;

uniform sampler2D textureSampler;

// Standard fragment shader
void main(void) {
    vec3 color = texture2D( textureSampler, uvV ).rgb;
    gl_FragColor = vec4(color, 1.);
}