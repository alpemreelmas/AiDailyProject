// Import the functions you need from the SDKs you need
import * as admin from 'firebase-admin';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCOaNMd1Rnv1rS9qGteQgbvt8iTELOjFgs',
  authDomain: 'aidaily-f2dea.firebaseapp.com',
  projectId: 'aidaily-f2dea',
  storageBucket: 'aidaily-f2dea.appspot.com',
  messagingSenderId: '250681143549',
  appId: '1:250681143549:web:8ca9a9b4d440b65c0d0e94',
};

// Initialize Firebase
export const fcmAdmin = admin.initializeApp({
  credential: admin.credential.cert(firebaseConfig),
});
