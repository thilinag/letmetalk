import React  from 'react';

import { useTimer} from './hooks/useTimer';
import classes from './Timer.module.css'

const Timer = props => {
    const {
        secondsElapsed
    } = useTimer(props);
    
    if(secondsElapsed <= 0) {
        return null;
    }

    return (
        <div className={classes.Timer}>
            {secondsElapsed}
        </div>
    )
}

export default Timer;
