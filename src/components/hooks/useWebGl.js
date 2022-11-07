import React, {useEffect, useRef, useState, useMemo, useCallback} from 'react';

export const useWebGl = () => {
    const ref = useRef(null);
    const [gl, setGl] = useState(null);
    const canvas = useMemo(() => <canvas ref={ref}/>, [])

    const resize = useCallback(() => {
        const devicePixelRatio = window.devicePixelRatio || 1;

        const width = window.innerWidth;
        const height = window.innerHeight;

        ref.current.width = width * devicePixelRatio;
        ref.current.height = height * devicePixelRatio;

        ref.current.style.width = width + "px";
        ref.current.style.height = height + "px"

        return {
            width: width * devicePixelRatio,
            height: height * devicePixelRatio,
            pixelRatio: devicePixelRatio
        }

    }, [ref.current]);

    const viewport = useCallback(() => {
        const devicePixelRatio = window.devicePixelRatio || 1;

        const width = window.innerWidth;
        const height = window.innerHeight;

        return {
            width: width * devicePixelRatio,
            height: height * devicePixelRatio,
            pixelRatio: devicePixelRatio
        }

    }, [ref.current])

    useEffect(() => {
        resize();
        setGl(ref.current ? ref.current.getContext('webgl2', {
            antialias: true
        }) : null);
    }, [ref.current])

    return {
        gl,
        ref,
        resize,
        viewport,
        canvas
    }
}
