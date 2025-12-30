import { useEffect, useState } from "react";
import RegisterPage from "./registerPage";
import LoginPage from "./loginPage";
import axios from "axios";
import MicrosoftSection from "./microsoftSection";
export interface userType {
  name: string;
  email: string;
  role: string;
  connectedMicrosoft?: boolean;
  id: number;
}
export default function App() {
  const [register, setRegister] = useState(true);
  const [user, setUser] = useState<userType | null>(null);
  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return setUser(null);
        const resp = await axios.get("http://localhost:4000/auth/getuser", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Success:", resp.data);
        setUser(resp.data.data);
      } catch (err: any) {
        setUser(null);
        console.log(err);
      }
    })();
  }, []);

  return (
    <main className="w-screen h-svh bg-gray-100 grid items-center justify-center">
      {user ? (
        <div className="grid shadow-md p-6 bg-white rounded-xl gap-4 container w-2xl">
          <h2 className="font-extrabold text-xl">Microsoft mail service</h2>
          <p className="w-full flex justify-between">
            Name:<b className="ml-auto">{user.name}</b>
          </p>
          <p className="w-full flex justify-between">
            Email: <b>{user.email}</b>
          </p>
          <p className="w-full flex justify-between">
            Role: <b>{user.role}</b>
          </p>
          <p className="w-full flex justify-between">
            MicroSoft connected:{" "}
            <b>
              {user.connectedMicrosoft ? (
                <span className="text-green-500">Connected</span>
              ) : (
                <span className="text-red-500">Not connected</span>
              )}
            </b>
          </p>
          <MicrosoftSection setUser={setUser} user={user} />
        </div>
      ) : (
        <>
          {register ? (
            <RegisterPage setUser={setUser} setRegister={setRegister} />
          ) : (
            <LoginPage setRegister={setRegister} setUser={setUser} />
          )}
        </>
      )}
    </main>
  );
}
