export default `#version 300 es
#pragma vscode_glsllint_stage: vert

uniform mat4 uModel;
uniform mat4 uView;
uniform mat4 uProjection;

layout(location=0) in vec4 aPosition;
layout(location=1) in vec4 aUV;
layout(location=3) in vec4 aIdColor;

out vec4 vIdColor;

void main()
{
    vIdColor = aIdColor;
    gl_Position = uProjection * uView * uModel * aPosition;
}`;
