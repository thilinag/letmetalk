import firebase from 'firebase';

const firebaseConfig = {
    //firebase config
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const database = firebaseApp.firestore();

export default database;
