import React, { useEffect, useState } from "react";
import type { userType } from "./App";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "./config/micrsoft";
import axios from "axios";

function MicrosoftSection({
  user,
  setUser,
}: {
  user: userType;
  setUser: React.Dispatch<React.SetStateAction<userType | null>>;
}) {
  const { instance, accounts } = useMsal();
  const [status, setStatus] = useState("");
  const [recipient, setRecipient] = useState("arslaanansari7861@gmail.com");
  const [subject, setSubject] = useState("Test Email from Graph API");
  const [body, setBody] = useState(
    "This is a test email sent via Microsoft Graph API"
  );
  useEffect(() => {
    (async () => {
      const account = instance.getActiveAccount();
      const tokenResponse = await instance.acquireTokenSilent({
        ...loginRequest,
        account: account!,
        forceRefresh: true,
      });
      console.log({ token: tokenResponse });
      const resp = await axios.post(
        "http://localhost:4000/auth/microsoft/refreshtoken",
        {
          token: tokenResponse.accessToken,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      console.log("Success:", resp.data);
      localStorage.setItem("token", resp.data.token);
      setUser(resp.data.data);
    })();
  }, [instance, accounts]);

  const login = async () => {
    try {
      setStatus("Logging in...");
      const res = await instance.loginPopup(loginRequest);
      instance.setActiveAccount(res.account);
    } catch (error: any) {
      console.error("Login error:", error);
      setStatus("Login failed: " + error.message);
    }
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
  const logout = () => {
    instance.logoutPopup().then(() => {
      sessionStorage.clear();
      setStatus("Logged out successfully");
    });
  };
  return (
    <>
      {status && <p className="text-red-500 text-sm text-center">{status}</p>}
      {!user.connectedMicrosoft ? (
        <button
          onClick={login}
          className="text-lg font-extrabold text-white px-3 bg-rose-500 rounded-md shadow py-2"
        >
          Click to connect micrsoft mailbox
        </button>
      ) : (
        <></>
        // <>
        //   <section className="flex flex-col">
        //     <label htmlFor="email">Enter email</label>
        //     <input
        //       value={loginUser.email}
        //       onChange={(e) =>
        //         setLoginUser({ ...loginUser, email: e.target.value })
        //       }
        //       id="email"
        //       type="text"
        //       className="border px-3 py-2 outline-none rounded-md border-gray-500"
        //       placeholder="Enter your email"
        //     />
        //   </section>{" "}
        //   <section className="flex flex-col">
        //     <label htmlFor="password">Enter password</label>
        //     <input
        //       value={loginUser.password}
        //       onChange={(e) =>
        //         setLoginUser({ ...loginUser, password: e.target.value })
        //       }
        //       id="password"
        //       type="text"
        //       className="border px-3 py-2 outline-none rounded-md border-gray-500"
        //       placeholder="Enter password"
        //     />
        //   </section>
        //   <button
        //     onClick={register}
        //     className="text-lg font-extrabold text-white px-3 bg-rose-500 rounded-md shadow py-2"
        //   >
        //     Login
        //   </button>
        // </>
      )}
    </>
  );
}

export default MicrosoftSection;
