import * as firebase from 'firebase';

var firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: "i-tracker-project.firebaseapp.com",
    databaseURL: "https://i-tracker-project.firebaseio.com",
    projectId: "i-tracker-project",
    storageBucket: "i-tracker-project.appspot.com",
    messagingSenderId: "295419222593",
    appId: "1:295419222593:web:7a69fa91530401264904c0"
};
// Initialize Firebase
//firebase.initializeApp(firebaseConfig);

export default !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();