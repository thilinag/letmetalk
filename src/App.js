import React from 'react';

import User from "./components/User";

import classes from './App.module.css';
import { useApp} from "./hooks/useApp";


const App = () => {
    
    const {
        user,
        queue,
        queuedToTalk,
        handleWantToTalk,
        handleJoin,
        handleLeave,
        buttonRef
    } = useApp();
    
    return (
        <div className={classes.App}>
            {user && queue.length === 0 &&
                <p className={classes.message}>No one is waiting to talk at the moment.</p>
            }
            <div className={classes.queue}>
                {queue.map(user => (
                    <User user={user} key={user.id} />
                ))}
            </div>

            <div className={classes.footer}>
                {user && 
                    <>
                        <button
                            ref={buttonRef}
                            autoFocus={true} 
                            className={`${classes.cta} ${(queuedToTalk ? classes.ctaActive : '')}`} 
                            type="button" onClick={handleWantToTalk}>
                            {!queuedToTalk ?  '✋ Let me talk!' : '👉 Leave Queue'} 
                        </button>
                        <small>Tip: Use spacebar to toggle.</small>
                    </>
                }
                {!user &&
                    <button 
                        className={classes.cta}
                        type="button"
                        onClick={handleJoin}>
                        Join
                    </button>
                        
                }
            </div>
            {user &&
            <button
                className={classes.leave}
                type="button"
                onClick={handleLeave}>
                Leave
            </button>   
            }
        </div>
    );
}

export default App;
