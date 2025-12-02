/* =========================================================
   DELETE THIS FILE COMPLETELY
   File: src/auth/keycloak.js
   (No longer needed after switching to AWS Cognito)
   =========================================================
*/
// ❌ Delete src/auth/keycloak.js


/* =========================================================
   UPDATE THIS FILE
   File: src/index.js
   REMOVE Keycloak code & ADD AWS config import
   =========================================================
*/

// ❌ REMOVE THIS OLD KEYCLOAK CODE (IF EXISTS)
// import Keycloak from "keycloak-js";
// const keycloak = new Keycloak({
//   url: process.env.REACT_APP_KEYCLOAK_URL,
//   realm: process.env.REACT_APP_KEYCLOAK_REALM,
//   clientId: process.env.REACT_APP_KEYCLOAK_CLIENT,
// });
// keycloak.init({ onLoad: "login-required" }).then(() => {
//   ReactDOM.render(<App />, document.getElementById("root"));
// });

// ✅ ADD THIS CLEAN AWS STARTUP
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./auth/awsConfig"; // ⬅ AWS Cognito Config Imported Once

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);


/* =========================================================
   ADD THIS NEW FILE
   File: src/auth/awsConfig.js
   AWS Cognito Authentication Configuration
   =========================================================
*/

import { Auth } from "aws-amplify";

Auth.configure({
  region: "ap-south-1",                // ⭐ Replace with your AWS region
  userPoolId: "ap-south-1_XXXXXX",     // ⭐ Replace with your User Pool ID
  userPoolWebClientId: "XXXXXXXXXX",   // ⭐ Replace with your App Client ID

  oauth: {
    domain: "your-domain.auth.ap-south-1.amazoncognito.com", // ⭐ Replace
    redirectSignIn: "http://localhost:3000/",                // ⭐ Replace with your UI URL
    redirectSignOut: "http://localhost:3000/",               // ⭐ Replace with your UI URL
    responseType: "code",                                    // Required for SSO
  },
});


/* =========================================================
   UPDATE THIS FILE
   File: src/App.js
   REPLACE Keycloak actions with AWS Cognito actions
   =========================================================
*/

import React from "react";
import { Auth } from "aws-amplify";

function App() {
  // ✅ Login (SSO via AWS Hosted UI)
  const login = () => {
    Auth.federatedSignIn();
  };

  // ✅ Logout
  const logout = () => {
    Auth.signOut();
  };

  // ✅ Get JWT Token for API calls
  const getToken = async () => {
    try {
      const session = await Auth.currentSession();
      const token = session.getIdToken().getJwtToken();
      console.log("JWT TOKEN:", token);
      return token;
    } catch (err) {
      console.error("No session found:", err);
    }
  };

  return (
    <div>
      <h2>AWS Cognito SSO Integrated UI</h2>

      <button onClick={login}>Login</button>
      <button onClick={logout}>Logout</button>
      <button onClick={getToken}>Get Token</button>
    </div>
  );
}

export default App;


/* =========================================================
   UPDATE THIS FILE
   File: .env
   REMOVE Keycloak env vars & ADD AWS env vars
   =========================================================
*/

//
// ❌ REMOVE OLD KEYCLOAK VALUES
// REACT_APP_KEYCLOAK_URL=
// REACT_APP_KEYCLOAK_REALM=
// REACT_APP_KEYCLOAK_CLIENT=

//
// ✅ ADD AWS COGNITO VALUES
REACT_APP_COGNITO_REGION=ap-south-1
// REACT_APP_COGNITO_POOL_ID=ap-south-1_XXXXXX //it is given Eslint error so i commented , we need to uncomment and use it in .env
REACT_APP_COGNITO_CLIENT_ID=XXXXXXXXXX
