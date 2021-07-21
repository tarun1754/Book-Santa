import firebase from  'firebase';
require('@firebase/firestore')

   var firebaseConfig = {
    apiKey: "AIzaSyDqXgdXjGeIfxHHvWiuOMEQN7zyuuhe40s",
    authDomain: "book-santa-841e7.firebaseapp.com",
    databaseURL:'https://book-santa-841e7.firebaseapp.com',
    projectId: "book-santa-841e7",
    storageBucket: "book-santa-841e7.appspot.com",
    messagingSenderId: "917004898035",
    appId: "1:917004898035:web:9327049e1e6e966c403186",
    measurementId: "G-GEE9SYD7E1"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  export default firebase.firestore();