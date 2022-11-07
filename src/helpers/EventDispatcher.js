class EventDispatcher {
    constructor() {
        this.multipleEventsRegExp = new RegExp(/\s/g);
        this.events = [];
    }

    on(event, callback, id) {
        let _events = event.split(',');
        let iterator = _events.entries();
        for (let obj of iterator) {
            let name = obj[1].replace(this.multipleEventsRegExp, '');
            this._events.push({
                name: name,
                id: id,
                callback: callback
            })
        }
    }

    off(event, callback, id) {
        this._events = this._events.filter((evt, idx) => {
            if (event && callback) {
                return !(evt.name === event && evt.callback === callback);
            }
            if (event && id) {
                return !(evt.name === event && evt.id === id);
            }

            return evt.name !== event;
        })
    }

    once(event, callback, id) {
        let _events = event.split(',');
        let iterator = _events.entries();

        for (let obj of iterator) {
            let name = obj[1].replace(this.multipleEventsRegExp, '');

            let _callback = () => {
                this.off(name, _callback, id);
                return callback();
            }

            this._events.push({
                name: name,
                id: id,
                callback: _callback
            })
        }
    }

    trigger(event, ...data) {
        let iterator = this._events.entries();
        for (let obj of iterator) {
            let evt = obj[1];
            if (evt.name === event) {
                evt.callback(evt, ...data);
            }
        }
    }

    set multipleEventsRegExp(regExp) {
        this._multipleEventsRegExp = regExp;
    }

    get multipleEventsRegExp() {
        return this._multipleEventsRegExp;
    }

    set events(events) {
        this._events = events;
    }

    get events() {
        return this._events;
    }
}

export default EventDispatcher;
