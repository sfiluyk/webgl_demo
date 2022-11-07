import React, {useEffect, useCallback, useState} from 'react'
import {CheckerboardUI} from './CheckerboardUI'
import {RotatingUI} from './RotatingUI'
import styles from './Ui.module.css';

const Ui = ({frameDispatcher, onAction}) => {
    const [fps, setFps] = useState(0);

    const handleAction = useCallback((action)=>{
        onAction?.(action)
    },[])

    const handleFpsChange = useCallback((e, data) => {
        setFps(data.value);
    }, [])
    useEffect(() => {
        frameDispatcher.on('fps_update', handleFpsChange)
    }, [])

    return (<div className={styles.container}>
        <div className={styles.fps}>FPS: {fps}</div>
        <div className={styles.main}>
            <CheckerboardUI onAction={handleAction}/>
            <RotatingUI onAction={handleAction}/>
        </div>
    </div>);
}

export {
    Ui
}
