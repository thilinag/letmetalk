import {useEffect, useState, useCallback, useRef } from 'react';
import firebase from 'firebase/app';
import database from '../firebase';

export const useApp = () => {
    const [user, setUser] = useState(null);
    const [queuedToTalk, setQueuedToTalk] = useState(false);
    const [queue, setQueue] = useState([]);
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
    
    const handleLeave = useCallback((removeLocalStorage = true) => {
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
        if(!user) {
            return;
        }

        const payload = {
            name: user,
            queuedAt: !queuedToTalk ? firebase.firestore.FieldValue.serverTimestamp() : ''
        }

        setQueuedToTalk(!queuedToTalk);
        database.collection('queue').doc(user).set({...payload});
    }, [user, queuedToTalk, setQueuedToTalk]);

    const handleUserKeyPress = useCallback(event => {
        const { keyCode } = event;

        if (keyCode === 32) {
            if(document.activeElement !== buttonRef.current) {
                handleWantToTalk()
            }
        }
    }, [handleWantToTalk]);

    const handleWindowUnload = useCallback((e) => {
        e.preventDefault();
        if (user) {
            database.collection('queue').doc(user).delete()
        }
    }, [user]);

    useEffect(() => {
        window.addEventListener('keydown', handleUserKeyPress);
        window.addEventListener('beforeunload', handleWindowUnload);
        handleJoin();
    }, [handleUserKeyPress, handleWindowUnload, handleJoin]);
    
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
