import fragmentShaderSrc from '../shaders/fs/cube'
import vertexShaderSrc from '../shaders/vs/cube'

class DrawCubeProgram {
    constructor(gl) {
        this.init(gl);
    }

    init(gl) {
        this.gl = gl;
        const program = gl.createProgram();
        const vertexShader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vertexShader, vertexShaderSrc);
        gl.compileShader(vertexShader);
        gl.attachShader(program, vertexShader);

        const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragmentShader, fragmentShaderSrc);
        gl.compileShader(fragmentShader);
        gl.attachShader(program, fragmentShader);

        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.log(gl.getShaderInfoLog(vertexShader));
            console.log(gl.getShaderInfoLog(fragmentShader));
        }

        this.program = program;
    }

    use() {
        this.gl.useProgram(this.program);
    }

    set program(program) {
        this._program = program
    }

    get program() {
        return this._program
    }

}

export default DrawCubeProgram;
