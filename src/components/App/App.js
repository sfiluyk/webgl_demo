import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import WebGlCube from '../../webgl/scenes/WebGlCube';
import {useWebGl} from "../hooks/useWebGl";
import debounce from 'lodash/debounce'

export const App = () => {
    const {gl, resize, canvas, viewport} = useWebGl();
    const [scenes, setScenes] = useState([]);

    useEffect(() => {
        try {
            if (gl) {
                const cubeScene = new WebGlCube(gl, viewport());
                cubeScene.start();
                setScenes([cubeScene])
            }
        } catch (e) {
            console.log(e)
        }
    }, [gl, viewport])

    const handleWindowResize = useCallback(debounce(() => {
        if (!gl) return;
        scenes.forEach(scene => scene.viewport = resize());
    }, 50), [scenes, gl, resize])

    useEffect(() => {
        window.addEventListener('resize', handleWindowResize, false);
        return () => {
            window.removeEventListener('resize', handleWindowResize, false)
        }
    }, [handleWindowResize])

    return [canvas];
}
