import React from 'react';
import ReactDOM from 'react-dom/client';
import {mat4} from "gl-matrix";
import DrawCubeProgram from "./programs/DrawCubeProgram";
import FrameDispatcher from "../../../helpers/FrameDispatcher";
import DrawColorsProgram from "./programs/DrawColorsProgram";
import {createOffscreen} from './utils/createOffscreen';
import createCubeMesh from './utils/createCubeMesh';
import sortCubePlanes from './utils/sortCubePlanes';
import {Ui} from '../../../components/Ui'
import {CheckerboardUIActionTypes, DEFAULT_GRID_SIZE_VALUE} from '../../../components/Ui/CheckerboardUI'
import {RotatingUIActionTypes, DEFAULT_ROTATING_SPEED_VALUE} from '../../../components/Ui/RotatingUI'

class WebGlCube {
    constructor(gl, viewport) {
        this.init(gl, viewport);
    }

    init(gl, viewport) {
        const programs = [
            new DrawCubeProgram(gl),
            new DrawColorsProgram(gl)
        ];

        const matrices = {
            model: mat4.create(),
            view: mat4.create(),
            projection: mat4.create()
        }

        mat4.lookAt(matrices.view, [0, 0, -5], [0, 0, 0.1], [0, 1, 0]);
        mat4.perspective(matrices.projection, (45 * Math.PI) / 180, viewport.width / viewport.height, .1, 100);
        mat4.translate(matrices.model, matrices.model, [0, 0, 1]);

        this.gl = gl;
        this.programs = programs;
        this.matrices = matrices;
        this.mouse = {
            position: {
                x: 0,
                y: 0,
            },
            type: 'mousemove',
            callback: (e) => {
                this.mouse.position.x = e.clientX;
                this.mouse.position.y = e.clientY;
                const isOverPlane = this.objects[0].planes.some(plane => plane.colorId.every((value, index) => value * 255 === this.offscreen.mousePositionPixels[index]))
                if (isOverPlane) {
                    document.body.style.cursor = 'pointer'
                } else {
                    document.body.style.cursor = 'auto'
                }
            }

        }
        this.offscreen = createOffscreen(gl, viewport);
        this.viewport = viewport;
        this.frameDispatcher = new FrameDispatcher();
        this.initMouseObserver();
        this.initObjects();
        this.initVBO();
        this.initUI();
    }

    initUI() {
        const onAction = (action) => {
            if (action.type === CheckerboardUIActionTypes.GRID_CHANGE) {
                this.ui.checkerboardUI.gridSize = action.payload;
            }
            if (action.type === RotatingUIActionTypes.ROTATING_SPEED_CHANGE) {
                this.ui.rotatingUI.rotatingSpeed = action.payload;
            }
        }
        this.ui = {
            el: document.querySelector('#ui'),
            checkerboardUI: {
                gridSize: DEFAULT_GRID_SIZE_VALUE
            },
            rotatingUI: {
                rotatingSpeed: DEFAULT_ROTATING_SPEED_VALUE
            }
        }
        ReactDOM.createRoot(this.ui.el).render(<Ui
            frameDispatcher={this.frameDispatcher}
            onAction={onAction}
        />);
    }

    initMouseObserver() {
        window.addEventListener(this.mouse.type, this.mouse.callback, false);
    }

    initObjects() {
        const cube = createCubeMesh();
        const objects = [cube];

        cube.vdSize = 0;
        cube.vd = new Float32Array(cube.planes.reduce((acc, item) => {
            let nextAcc = [...acc];
            for (let i = 0; i < item.vertices.length / 3; i += 1) {
                nextAcc = [
                    ...nextAcc,
                    item.vertices[i * 3],
                    item.vertices[i * 3 + 1],
                    item.vertices[i * 3 + 2],
                    item.uvs[i * 2],
                    item.uvs[i * 2 + 1],
                    ...item.color,
                    ...item.colorId
                ]
                cube.vdSize += 1;
            }
            return nextAcc;
        }, []))
        cube.attributes = {
            aPosition: {
                loc: 0,
                offset: 0,
                size: 3,
            },
            aUV: {
                loc: 1,
                offset: 3 * 4,
                size: 2,
            },
            aColor: {
                loc: 2,
                offset: 5 * 4,
                size: 3,
            },
            aIdColor: {
                loc: 3,
                offset: 8 * 4,
                size: 3,
            }
        }

        this.objects = objects;
    }

    initVBO() {
        const cube = this.objects[0];
        cube.vbo = this.gl.createBuffer();

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, cube.vbo);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, cube.vd, this.gl.DYNAMIC_DRAW);
    }

    useProgram(program) {
        this.currentProgram = program;
        program.use();
    }

    useVBO(object) {

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, object.vbo);

        Object.values(object.attributes).forEach(attribute => {
            this.gl.vertexAttribPointer(attribute.loc, attribute.size, this.gl.FLOAT, false, 11 * 4, attribute.offset);
            this.gl.enableVertexAttribArray(attribute.loc);
        })

    }

    useAllUniforms() {
        const projectionLoc = this.gl.getUniformLocation(this.currentProgram.program, 'uProjection');
        const modelLoc = this.gl.getUniformLocation(this.currentProgram.program, 'uModel');
        const viewLoc = this.gl.getUniformLocation(this.currentProgram.program, 'uView');
        const mouseOverColorIdLoc = this.gl.getUniformLocation(this.currentProgram.program, 'uMouseOverColorId');
        const gridSizeLoc = this.gl.getUniformLocation(this.currentProgram.program, 'uGirdSize');

        this.gl.uniformMatrix4fv(viewLoc, false, this.matrices.view);
        this.gl.uniformMatrix4fv(projectionLoc, false, this.matrices.projection);
        this.gl.uniformMatrix4fv(modelLoc, false, this.matrices.model);
        this.gl.uniform4fv(mouseOverColorIdLoc, new Float32Array([...this.offscreen.mousePositionPixels].map(val => Math.round(parseFloat(val / 255) * 10) / 10)));
        this.gl.uniform1fv(gridSizeLoc, new Float32Array([this.ui.checkerboardUI.gridSize]));
    }

    sortCube() {
        const cube = this.objects[0];
        const nextPlanes = sortCubePlanes(cube.planes, this.matrices);
        if (nextPlanes.some((item, index) => item.name !== cube.planes[index].name)) {
            cube.planes = nextPlanes;
            let row = 0;
            const rowLength = 11;

            cube.planes.forEach((item) => {
                for (let i = 0; i < item.vertices.length / 3; i += 1) {
                    cube.vd[row * rowLength] = item.vertices[i * 3];
                    cube.vd[row * rowLength + 1] = item.vertices[i * 3 + 1];
                    cube.vd[row * rowLength + 2] = item.vertices[i * 3 + 2];
                    cube.vd[row * rowLength + 3] = item.uvs[i * 2];
                    cube.vd[row * rowLength + 4] = item.uvs[i * 2 + 1];
                    cube.vd[row * rowLength + 5] = item.color[0];
                    cube.vd[row * rowLength + 6] = item.color[1];
                    cube.vd[row * rowLength + 7] = item.color[2];
                    cube.vd[row * rowLength + 8] = item.colorId[0];
                    cube.vd[row * rowLength + 9] = item.colorId[1];
                    cube.vd[row * rowLength + 10] = item.colorId[2];
                    row += 1;
                }
            }, [])

            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, cube.vbo);
            this.gl.bufferSubData(this.gl.ARRAY_BUFFER, 0, cube.vd);
        }


    }

    rotateCube() {
        mat4.rotate(this.matrices.model, this.matrices.model, this.ui.rotatingUI.rotatingSpeed, [1, 1, 0]);
        this.sortCube();
    }

    start() {
        this.useProgram(this.programs[0]);
        this.useVBO(this.objects[0]);
        this.useAllUniforms();

        this.frameDispatcher.callback = () => {
            this.render();
        }
        this.frameDispatcher.start();
    }

    drawToOffscreen() {
        const object = this.objects[0];

        this.useProgram(this.programs[1]);
        this.useAllUniforms();

        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
        this.gl.viewport(0, 0, this.viewport.width, this.viewport.height);
        this.gl.clearColor(1.0, 1.0, 1.0, 1.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT | this.gl.STENCIL_BUFFER_BIT);
        this.gl.disable(this.gl.BLEND);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.depthMask(true);

        this.gl.drawArrays(this.gl.TRIANGLES, 0, object.vdSize);

        this.gl.readPixels(
            this.mouse.position.x * this.viewport.pixelRatio,
            this.viewport.height - this.mouse.position.y * this.viewport.pixelRatio,
            1, 1, this.gl.RGBA, this.gl.UNSIGNED_BYTE, this.offscreen.mousePositionPixels);

        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);

    }

    draw() {
        const object = this.objects[0];
        this.useProgram(this.programs[0]);
        this.useAllUniforms();

        this.gl.viewport(0, 0, this.viewport.width, this.viewport.height);
        this.gl.clearColor(.3, .3, .3, 1.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT | this.gl.STENCIL_BUFFER_BIT);

        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.depthFunc(this.gl.LEQUAL);
        this.gl.depthMask(false);

        this.gl.enable(this.gl.BLEND);
        this.gl.blendFuncSeparate(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA, this.gl.ONE, this.gl.ONE_MINUS_SRC_ALPHA);
        this.gl.blendEquationSeparate(this.gl.FUNC_ADD, this.gl.FUNC_ADD);

        this.gl.drawArrays(this.gl.TRIANGLES, 0, object.vdSize);
    }

    render() {
        this.rotateCube();
        this.drawToOffscreen();
        this.draw();
    }

    get programs() {
        return this._programs;
    }

    set programs(programs) {
        this._programs = programs;
    }

    get matrices() {
        return this._matrices;
    }

    set matrices(matrices) {
        this._matrices = matrices;
    }

    get viewport() {
        return this._viewport;
    }

    set viewport(viewport) {
        mat4.perspective(this.matrices.projection, (45 * Math.PI) / 180, viewport.width / viewport.height, .1, 100);
        this.offscreen.viewport(viewport);
        this._viewport = viewport;
    }

    set offscreen(offscreen) {
        this._offscreen = offscreen;
    }

    get offscreen() {
        return this._offscreen;
    }

    set gl(gl) {
        this._gl = gl;
    }

    get gl() {
        return this._gl;
    }

    set frameDispatcher(frameDispatcher) {
        this._frameDispatcher = frameDispatcher;
    }

    get frameDispatcher() {
        return this._frameDispatcher;
    }

    set mouse(mouse) {
        this._mouse = mouse;
    }

    get mouse() {
        return this._mouse;
    }

    set objects(objects) {
        this._objects = objects;
    }

    get objects() {
        return this._objects;
    }

    get ui() {
        return this._ui;
    }

    set ui(ui) {
        this._ui = ui;
    }


}

export default WebGlCube;
