export default `#version 300 es
#pragma vscode_glsllint_stage: frag

precision mediump float;

in vec4 vIdColor;
layout(location=0) out vec4 fragColor;

void main()
{
    fragColor = vec4(vIdColor.xyz, 1.0);   
}`;
