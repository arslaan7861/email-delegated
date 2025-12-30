import React, { useState } from "react";
import type { userType } from "./App";
import axios from "axios";

function MicrosoftSection({
  user,
  setUser,
}: {
  user: userType;
  setUser: React.Dispatch<React.SetStateAction<userType | null>>;
}) {
  const [status, setStatus] = useState("");
  const [recipient, setRecipient] = useState("arslaanansari7861@gmail.com");
  const [subject, setSubject] = useState("Test Email from Graph API");
  const [body, setBody] = useState(
    "This is a test email sent via Microsoft Graph API"
  );
  // useEffect(() => {
  //   (async () => {
  //     const account = instance.getActiveAccount();
  //     const tokenResponse = await instance.acquireTokenSilent({
  //       ...loginRequest,
  //       account: account!,
  //       forceRefresh: true,
  //     });
  //     console.log({ token: tokenResponse });
  //     const resp = await axios.post(
  //       "http://localhost:4000/auth/microsoft/refreshtoken",
  //       {
  //         token: tokenResponse.accessToken,
  //       },
  //       {
  //         headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  //       }
  //     );
  //     console.log("Success:", resp.data);
  //     localStorage.setItem("token", resp.data.token);
  //     setUser(resp.data.data);
  //   })();
  // }, [instance, accounts]);

  // const login = async () => {
  //   try {
  //     setStatus("Logging in...");
  //     const res = await instance.loginPopup(loginRequest);
  //     instance.setActiveAccount(res.account);
  //   } catch (error: any) {
  //     console.error("Login error:", error);
  //     setStatus("Login failed: " + error.message);
  //   }
  // };
  // const sendMail = async () => {
  //   const account = instance.getActiveAccount();
  //   if (!account) {
  //     setStatus("Please login first!");
  //     return;
  //   }

  //   try {
  //     const tokenResponse = await instance.acquireTokenSilent({
  //       ...loginRequest,
  //       account,
  //       forceRefresh: true,
  //     });

  //     const response = await fetch("http://localhost:4000/send-mail", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${tokenResponse.accessToken}`,
  //       },
  //       body: JSON.stringify({
  //         to: recipient,
  //         subject: subject,
  //         body: body,
  //       }),
  //     });

  //     const data = await response.text();
  //     console.log(data);
  //   } catch (error) {
  //     console.error("Send mail error:", error);
  //   }
  // };
  // const logout = () => {
  //   instance.logoutPopup().then(() => {
  //     sessionStorage.clear();
  //     setStatus("Logged out successfully");
  //   });
  // };

  const connect = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get(
      `${"http://localhost:4000"}/microsoft/connect`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    window.open(
      res.data.authUrl,
      "_blank",
      "width=500,height=600,left=200,top=100,noopener,noreferrer"
    );
  };

  const sendMail = async () => {
    const token = localStorage.getItem("token");
    console.log(token);

    const res = await axios.post(
      `${"http://localhost:4000"}/microsoft/sendmail`,
      { recipient, subject, body },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    console.log(res.data);
    setStatus(res.data.message);
  };

  return (
    <>
      {status && <p className="text-red-500 text-sm text-center">{status}</p>}
      {!user.connectedMicrosoft ? (
        <button
          onClick={connect}
          className="text-lg font-extrabold text-white px-3 bg-blue-500 rounded-md shadow py-2"
        >
          Click to connect micrsoft mailbox
        </button>
      ) : (
        <form
          className="w-full grid gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            sendMail();
          }}
        >
          <section className="flex flex-col">
            <label htmlFor="email">Enter Recipent email</label>
            <input
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              type="email"
              className="border px-3 py-2 outline-none rounded-md border-gray-500"
              placeholder="Recipent email"
            />
          </section>
          <section className="flex flex-col">
            <label htmlFor="email">Enter Subject</label>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              id="email"
              type="text"
              className="border px-3 py-2 outline-none rounded-md border-gray-500"
              placeholder="Enter your email"
            />
          </section>
          <section className="flex flex-col">
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              id="password"
              className="border px-3 py-2 outline-none rounded-md border-gray-500"
              placeholder="Enter password"
            />
          </section>
          <button className="text-lg font-extrabold text-white px-3 bg-blue-500 rounded-md shadow py-2">
            Send
          </button>
        </form>
      )}
    </>
  );
}

export default MicrosoftSection;
