import React, {useCallback} from 'react';
import styles from './RotatingUI.module.css'
import {Accordeon} from '../Accordeon';

export const RotatingUIActionTypes = {
    ROTATING_SPEED_CHANGE: 'ROTATING_SPEED_CHANGE'
}

export const DEFAULT_ROTATING_SPEED_VALUE = 0.005;

const RotatingUI = ({onAction}) => {
    const handleAction = useCallback((action) => {
        onAction?.(action);
    }, [])
    return <Accordeon title={'Rotating UI'}>
        <div className={styles.inputContainer}>
            <span>Rotate speed : </span> <input
            onChange={(e) => handleAction({type: RotatingUIActionTypes.ROTATING_SPEED_CHANGE, payload: e.target.value})}
            defaultValue={DEFAULT_ROTATING_SPEED_VALUE} type="number" min="0" step="0.001"></input>
        </div>
    </Accordeon>
}

export {
    RotatingUI
}
