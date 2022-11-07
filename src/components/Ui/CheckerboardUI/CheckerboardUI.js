import React, {useCallback} from 'react';
import styles from './CheckerboardUI.module.css'
import {Accordeon} from '../Accordeon';

export const CheckerboardUIActionTypes = {
    GRID_CHANGE: 'GRID_CHANGE'
}

export const DEFAULT_GRID_SIZE_VALUE = 5;

const CheckerboardUI = ({onAction}) => {
    const handleAction = useCallback((action) => {
        onAction?.(action);
    }, [])
    return <Accordeon title={'Checkerboard UI'}>
        <div className={styles.inputContainer}>
            <span>Grid : </span> <input
            onChange={(e) => handleAction({type: CheckerboardUIActionTypes.GRID_CHANGE, payload: e.target.value})}
            defaultValue={DEFAULT_GRID_SIZE_VALUE} type="number" min="2" step="1"></input>
        </div>
    </Accordeon>
}

export {
    CheckerboardUI
}
