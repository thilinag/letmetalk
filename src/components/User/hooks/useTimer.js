import { useState, useEffect } from 'react';

export const useTimer = props => {
    const { queuedAt } = props;
    const intialSecondsAgo = Math.floor((new Date().getTime() - new Date(queuedAt.toDate()).getTime())/1000);
    const [ secondsElapsed, setSecondsElapsed ] = useState(intialSecondsAgo);

    useEffect(() => {
        const interval = setInterval(() => {
            setSecondsElapsed(secondsElapsed => secondsElapsed + 1);
        }, 1000);

        return () => {
            clearInterval(interval);
        };
    }, [secondsElapsed]);
    
    return {
        secondsElapsed
    }
}
