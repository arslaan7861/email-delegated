import axios from "axios";
import React, { useState } from "react";
import type { userType } from "./App";

function LoginPage({
  setRegister,
  setUser,
}: {
  setRegister: React.Dispatch<React.SetStateAction<boolean>>;
  setUser: React.Dispatch<React.SetStateAction<userType | null>>;
}) {
  const [loginUser, setLoginUser] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  async function register() {
    try {
      const resp = await axios.post(
        "http://localhost:4000/auth/login",
        loginUser
      );
      console.log("Success:", resp.data);
      localStorage.setItem("token", resp.data.token);
      setUser(resp.data.data);
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        if (err.response) {
          console.error("Server Error:", err.response.data);
          console.error("Status:", err.response.status);
          setError(err.response.data?.message || "Server returned an error");
        }
      } else {
        console.error("Unknown Error:", err);
        alert("Something went wrong.");
        setError(err.message);
      }
    }
  }

  return (
    <div className="grid shadow-md p-6 bg-white rounded-xl gap-4 container w-2xl">
      <h2 className="text-2xl font-extrabold">Log in</h2>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <section className="flex flex-col">
        <label htmlFor="email">Enter email</label>
        <input
          value={loginUser.email}
          onChange={(e) =>
            setLoginUser({ ...loginUser, email: e.target.value })
          }
          id="email"
          type="text"
          className="border px-3 py-2 outline-none rounded-md border-gray-500"
          placeholder="Enter your email"
        />
      </section>{" "}
      <section className="flex flex-col">
        <label htmlFor="password">Enter password</label>
        <input
          value={loginUser.password}
          onChange={(e) =>
            setLoginUser({ ...loginUser, password: e.target.value })
          }
          id="password"
          type="text"
          className="border px-3 py-2 outline-none rounded-md border-gray-500"
          placeholder="Enter password"
        />
      </section>
      <button
        onClick={register}
        className="text-lg font-extrabold text-white px-3 bg-rose-500 rounded-md shadow py-2"
      >
        Login
      </button>
      <p className="text-center text-gray-500">
        Dont have an account ?{" "}
        <span
          onClick={() => setRegister(true)}
          className="text-rose-500 font-extrabold"
        >
          Register
        </span>
      </p>
    </div>
  );
}

export default LoginPage;
