precision highp float;

// Attributes
attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;

// Uniforms

// If cylindrical our billboard will stand up straight
uniform bool cylindrical;

// Auto passed in by babylon
uniform mat4 worldView;
uniform mat4 projection;

// Varying
varying vec2 uvV;

// Flatten out the model view which will flatten it with respect to camera
void main(void) {
    mat4 modelView = worldView;
    modelView[0][0] = 1.0;
    modelView[0][1] = 0.0;
    modelView[0][2] = 0.0;

    if (!cylindrical) {
        modelView[1][0] = 0.0;
        modelView[1][1] = 1.0;
        modelView[1][2] = 0.0;
    }

    modelView[2][0] = 0.0;
    modelView[2][1] = 0.0;
    modelView[2][2] = 1.0;

    // projection view world
    // projection modelView
    mat4 wmp_mat = projection * modelView;
    vec4 regularPosition = wmp_mat * vec4(position, 1.0);
    gl_Position = regularPosition;


    uvV = uv;
}