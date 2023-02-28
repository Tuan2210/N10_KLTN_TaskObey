//link prj firebase: https://console.firebase.google.com/u/0/project/n10-taskobey/overview
//link doc: https://firebase.google.com/docs/auth/web/google-signin?hl=en&authuser=0
//link yt login fb firebase: https://www.youtube.com/watch?v=SDOJo8m9DNY
//npm i firebase@9.6.11

import firebase from 'firebase/compat/app';
import "firebase/compat/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD9GgT0fhV9saOg1pnj1OXa9r28my43SrM",
  authDomain: "n10-taskobey.firebaseapp.com",
  projectId: "n10-taskobey",
  storageBucket: "n10-taskobey.appspot.com",
  messagingSenderId: "879854924600",
  appId: "1:879854924600:web:69ec19ce76f3e6088fc7cd",
  measurementId: "G-0FC3QPZKMQ",
};

if(!firebase.apps.length) {  
    firebase.initializeApp(firebaseConfig);
    // export const ggFirebaseAuth = firebase.auth(app);
    // export const ggFirebaseProvider = new firebase.auth.GoogleAuthProvider(app);
}

export { firebase };

//how to create keystore not follow way in yt, follow this link: https://docs.expo.dev/app-signing/app-credentials/
//eas credentials (first) or expo credentials:manager or expo fetch:android:hashes