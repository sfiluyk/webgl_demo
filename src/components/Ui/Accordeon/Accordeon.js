import React, {useCallback, useState} from 'react';
import styles from './Accordeon.module.css';

const Accordeon = ({title, children}) => {
    const [open, setOpen] = useState(true);
    const handleOnClick = useCallback(() => {
        setOpen(state => !state)
    }, [])
    return (<div className={styles.container}>
            <div onClick={handleOnClick} className={styles.title}>
                <div className={`${styles.arrow} ${!open ? styles.down : styles.up}`}/>
                <div>{title}</div>
            </div>
            {
                open && <div className={styles.main}>{children}</div>
            }
        </div>
    )
}

export {
    Accordeon
}
