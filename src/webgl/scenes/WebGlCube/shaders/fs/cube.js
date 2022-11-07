export default `#version 300 es
#pragma vscode_glsllint_stage: frag

precision mediump float;

uniform vec4 uMouseOverColorId;
uniform float uGirdSize;

in vec4 vColor;
in vec2 vUV;
in vec4 vIdColor;

out vec4 fragColor;

float findRowColNumber(float a){  
    float step = 1.0/uGirdSize;
    float x1 = 0.0;
    float x2 = step;
    float col = 1.0;
    float colIndex = 0.0;
    int size = int(uGirdSize);
    
    for(int i=0; i < size; i++){
        colIndex+=1.0;
        if(a > x1 && a < x2){
           col = colIndex;
        }
        x1+=step;
        x2+=step;
    }
    
    return col;
}

vec4 checkerBoardColor(vec2 uv){
    vec4 color;
    float col = findRowColNumber(uv.x);
    float row = findRowColNumber(uv.y);

    float colorX = mod(col, 2.0) > 0.0 ? 1.0 : 0.0;
    float colorY = mod(row, 2.0) > 0.0 ? 1.0 : 0.0;

    color = vec4(colorX, colorX, colorX, 1.0);
    
    if(colorY == 1.0 && colorX == 0.0){
       color = vec4(colorY, colorY, colorY, 1.0);
    }
    
    if(mod(col, 2.0) != 0.0 && mod(row, 2.0) != 0.0){
        color = vec4(0.0, 0.0, 0.0, 1.0);
    }
    
    return color;
}

void main()
{
    float whiteBoardOpacity = uMouseOverColorId.xyz != vIdColor.xyz ? .8 : 1.0;
    float blackBoardOpacity = uMouseOverColorId.xyz != vIdColor.xyz ? .2 : .4;
    float checkerColor = checkerBoardColor(vUV).x;

     // colors variant 1
    // fragColor.a = checkerColor == 1.0 ? whiteBoardOpacity : blackBoardOpacity;
    // fragColor.xyz = checkerColor == 1.0 ? vec3(checkerColor,checkerColor,checkerColor) : vColor.xyz;
    
    // colors variant 2
    vec4 color = vec4(checkerColor,checkerColor,checkerColor, checkerColor == 1.0 ? whiteBoardOpacity : blackBoardOpacity);
    fragColor = mix(color,vec4(vColor.xyz, 1.0),1.0 - color.a);
}`;
