import { useMsal } from "@azure/msal-react";
import { loginRequest } from "./config/authconfig";
import { useState } from "react";

export default function App() {
  const { instance, accounts } = useMsal();
  const [status, setStatus] = useState("");
  const [recipient, setRecipient] = useState("arslaanansari7861@gmail.com");
  const [subject, setSubject] = useState("Test Email from Graph API");
  const [body, setBody] = useState(
    "This is a test email sent via Microsoft Graph API"
  );

  const login = async () => {
    try {
      setStatus("Logging in...");
      const res = await instance.loginPopup(loginRequest);
      instance.setActiveAccount(res.account);
      setStatus("Login successful!");
    } catch (error) {
      console.error("Login error:", error);
      setStatus("Login failed: " + error.message);
    }
  };

  const logout = () => {
    instance.logoutPopup().then(() => {
      sessionStorage.clear();
      setStatus("Logged out successfully");
    });
  };

  const sendMail = async () => {
    const account = instance.getActiveAccount();
    if (!account) {
      setStatus("Please login first!");
      return;
    }

    try {
      const tokenResponse = await instance.acquireTokenSilent({
        ...loginRequest,
        account,
        forceRefresh: true,
      });

      const response = await fetch("http://localhost:4000/send-mail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenResponse.accessToken}`,
        },
        body: JSON.stringify({
          to: recipient,
          subject: subject,
          body: body,
        }),
      });

      const data = await response.text();
      console.log(data);
    } catch (error) {
      console.error("Send mail error:", error);
    }
  };

  return (
    <div className="w-screen h-svh ">
      {!accounts.length ? (
        <div>
          <p>Sign in with your Microsoft account to send emails.</p>
          <button onClick={login}>Login with Microsoft</button>
        </div>
      ) : (
        <div>
          <p>Signed in as:</p> {accounts[0].username}
          <button onClick={sendMail}>Send Email</button>
        </div>
      )}

      {status && (
        <div>
          <strong>Status:</strong> {status}
        </div>
      )}
    </div>
  );
}

export const msalConfig = {
  auth: {
    clientId: "09bb7e16-9a90-4ade-a82d-5461b29aa09a", // Replace with your Application (client) ID
    authority: "https://login.microsoftonline.com/common",
    redirectUri: "http://localhost:5173",
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
  },
};

export const loginRequest = {
  scopes: ["Mail.Send"],
};

import React from "react";
import ReactDOM from "react-dom/client";
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import App from "./App.jsx";
import { msalConfig } from "./config/authconfig.js";
import "./index.css";

const msalInstance = new PublicClientApplication(msalConfig);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode></React.StrictMode>
);
