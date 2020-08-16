import {useEffect, useState, useCallback, useRef } from 'react';
import firebase from 'firebase';
import database from '../firebase';

export const useApp = () => {
    const [user, setUser] = useState(null);
    const [queuedToTalk, setQueuedToTalk] = useState(false);
    const [queue, setQueue] = useState([]);
    //const queueRef = database.collection('queue');
    const buttonRef = useRef();
    
    useEffect(() => {
        database.collection('queue').orderBy('queuedAt').onSnapshot(snapshot=> (
            setQueue(
                snapshot.docs.map(doc => ({
                    id: doc.id,
                    name: doc.data().name,
                    queuedAt: doc.data().queuedAt,
                }))
            )
        ));
    }, [setQueue]);
    
    useEffect(() => {
        if(queue) {
            const userWantsToTalk = queue.find((queueUser) => queueUser.name === user );
            if(userWantsToTalk && userWantsToTalk.queuedAt) {
                setQueuedToTalk(true);
            };
        }
    }, [user, queue]);

    const handleUserKeyPress = useCallback(event => {
        const { keyCode } = event;

        if (keyCode === 32) {
            console.log(document.activeElement !== buttonRef.current);
            if(document.activeElement !== buttonRef.current) {
                buttonRef.current.click();
            }
        }
    }, []);
    
    const handleJoin = useCallback(() => {
        let name = localStorage.getItem('name');
        if(!name) {
            name = prompt('Who dis?');
        }

        if(name) {
            localStorage.setItem('name', name);
            database.collection('queue').doc(name).get()
                .then((doc) => {
                    if (!doc.exists) {
                        database.collection('queue').doc(name).set({
                            name: name,
                            queuedAt: ''
                        });
                    }
                    setUser(name);
                });
        }
    }, [setUser]);
    
    const handleLeave = useCallback(() => {
        if(!user) {
            return;
        }
        
        database.collection('queue').doc(user).delete().then(() => {
            localStorage.removeItem('name');
            setUser('');
        }).catch(function(error) {
            console.error("Error removing document: ", error);
        });
        
    }, [user])

    const handleWantToTalk = useCallback(() => {
        console.log(user, queuedToTalk);
        if(!user) {
            return;
        }
        //
        const payload = {
            name: user,
            queuedAt: !queuedToTalk ? firebase.firestore.FieldValue.serverTimestamp() : ''
        }
        console.log(payload);
        setQueuedToTalk(!queuedToTalk);
        database.collection('queue').doc(user).set({...payload});
    }, [user, queuedToTalk, setQueuedToTalk]);

    useEffect(() => {
        window.addEventListener('keydown', handleUserKeyPress);
        handleJoin();
    }, [handleUserKeyPress, handleJoin]);
    
    return {
        user,
        queue,
        queuedToTalk,
        handleWantToTalk,
        handleJoin,
        handleLeave,
        buttonRef
    }
}
