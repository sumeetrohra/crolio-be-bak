import * as functions from "firebase-functions";

import * as admin from "firebase-admin";
admin.initializeApp();

//   Auth signing for vauld apis
//   const jsonToURI = (jsonObj: { [x: string]: string }) => {
//     let output: string = '';
//     const keys = Object.keys(jsonObj);
//     keys.forEach(function (key) {
//       output = output + key + '=' + jsonObj[key] + '&';
//     });
//     return output.slice(0, -1);
//   };

//   const payload = {
//     orgID: '',
//     userID: '',
//   };
//   const secret = ''; // make this your secret!!

//   const URIencodedPayload = jsonToURI(JSON.parse(JSON.stringify(payload)));
//   const hmac = cryptoJS.HmacSHA256(URIencodedPayload, secret);
//   const hash = hmac.toString(cryptoJS.enc.Hex);

//   console.log('hash: ', hash);

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", { structuredData: true });
  response.send("Hello from Firebase!");
});
