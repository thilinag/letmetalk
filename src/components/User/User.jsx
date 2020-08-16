import React  from 'react';

import Timer from './Timer';
import classes from './User.module.css';

const User = props => {
    const {
        user
    } = props;
    
    if (!user) {
        return null;
    }
    
    const {
        name,
        queuedAt
    } = user;

    return (
        <div className={`${classes.User} ${(queuedAt ? classes.UserQueued: '')}`}>
            <span className={classes.name}>{name}</span>
            {queuedAt &&
                <div className={classes.queued}>    
                    <Timer queuedAt={queuedAt} />
                </div>
            }
        </div>
    )
}

export default User;
