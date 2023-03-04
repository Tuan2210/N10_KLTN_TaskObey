//link prj firebase: https://console.firebase.google.com/u/0/project/n10-taskobey/overview
//link firebase doc: https://firebase.google.com/docs/auth/web/start; https://firebase.google.com/docs/auth/web/phone-auth
//new link firebase-expo-recaptcha: https://docs.expo.dev/versions/latest/sdk/firebase-recaptcha/
//link yt: https://www.youtube.com/watch?v=ePk0fjrNo6c
//npm i firebase@9.6.11
//npm i expo-firebase-recaptcha react-native-webview

import firebase from 'firebase/compat/app';
import "firebase/compat/auth";

export const firebaseConfig = {
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
}