import EventDispatcher from './EventDispatcher';

class FrameDispatcher extends EventDispatcher {
    constructor(callback = () => {
    }) {
        super();
        this.callback = callback;
        this.loop = this.create();
        this.id = null;
        this.fps = {
            timer: 0,
            counter: 0,
            value: 0,
            updateTime: 1000
        }
    }

    create() {
        let _loop = () => {
            this.timer = new Date() - this.startTime;
            if (performance.now() - this.fps.timer > this.fps.updateTime) {
                this.fps.value = this.fps.counter;
                this.fps.counter = 0;
                this.fps.timer = performance.now();
                this.trigger('fps_update', {...this.fps})
            }
            this.callback();
            this.fps.counter += 1;
            if (this.reset) {
                this.timer = 0;
                cancelAnimationFrame(this.id)
                this.id = null;
                this.reset = false;
                this.fps.counter = 0;
                this.fps.timer = 0;
                this.fps.value = 0;
            } else {
                this.id = requestAnimationFrame(_loop)
            }
        };

        return _loop;
    }

    stop() {
        this.reset = true;
    }

    set timer(time) {
        this._timer = time;
    }

    get timer() {
        return this._timer;
    }

    set startTime(time) {
        this._startTime = time;
    }

    get startTime() {
        return this._startTime;
    }

    set reset(reset) {
        this._reset = reset;
    }

    get reset() {
        return this._reset;
    }

    start() {
        this.startTime = new Date();
        this.fps.timer = performance.now();
        this.loop = this.create();
        this.loop();
    }

    set callback(callback) {
        this._callback = callback;
    }

    get callback() {
        return this._callback;
    }

    set loop(loop) {
        this._loop = loop;
    }

    get loop() {
        return this._loop;
    }

    set id(id) {
        this._id = id;
    }

    get id() {
        return this._id;
    }

    set fps(fps) {
        this._fps = fps;
    }

    get fps() {
        return this._fps;
    }
}

export default FrameDispatcher;
