
var admin = require("firebase-admin");

var serviceAccount = require("./apigen-4d56d-firebase-adminsdk-ras28-d5e0d08180.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


const db = admin.firestore();
module.exports = db;
