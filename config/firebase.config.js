const Firebase = require('firebase-app');
const serviceAccount = require('../drive-dc70a-firebase-adminsdk-fbsvc-1feca4eb44.json')

const firebase = Firebase.initializeApp({
    credential: Firebase.credential.cert(serviceAccount),
    storageBucket: 'drive-dc70a.appspot.com'

})