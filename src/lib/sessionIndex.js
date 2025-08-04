// functions/index.js
const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

exports.validateAdminAccess = functions.https.onCall(async (data, context) => {
  const { password } = data;
  const ADMIN_PASSWORD = functions.config().admin.password;
  
  if (password === ADMIN_PASSWORD) {
    return { 
      isValid: true, 
      token: 'admin-session-token' 
    };
  }
  
  return { isValid: false };
});