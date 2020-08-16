import firebase from 'firebase/app';
import 'firebase/firestore';

const firebaseConfig = {
    //firebase config
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const database = firebaseApp.firestore();

export default database;
