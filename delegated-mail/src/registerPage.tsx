import axios from "axios";
import React, { useState } from "react";
import type { userType } from "./App";

function RegisterPage({
  setRegister,
  setUser,
}: {
  setRegister: React.Dispatch<React.SetStateAction<boolean>>;
  setUser: React.Dispatch<React.SetStateAction<userType | null>>;
}) {
  const [registerUser, setRegisterUser] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  async function register() {
    try {
      console.log(registerUser);

      const resp = await axios.post(
        "http://localhost:4000/auth/register",
        registerUser
      );
      console.log("Success:", resp.data);
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
      <h2 className="text-2xl font-extrabold">Register</h2>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <section className="flex flex-col">
        <label htmlFor="name">Enter name</label>
        <input
          value={registerUser.name}
          onChange={(e) =>
            setRegisterUser({ ...registerUser, name: e.target.value })
          }
          id="name"
          type="text"
          className="border px-3 py-2 outline-none rounded-md border-gray-500"
          placeholder="Enter your name"
        />
      </section>
      <section className="flex flex-col">
        <label htmlFor="email">Enter email</label>
        <input
          value={registerUser.email}
          onChange={(e) =>
            setRegisterUser({ ...registerUser, email: e.target.value })
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
          value={registerUser.password}
          onChange={(e) =>
            setRegisterUser({ ...registerUser, password: e.target.value })
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
        Register
      </button>
      <p className="text-center text-gray-500">
        Already logged in ?{" "}
        <span
          onClick={() => setRegister(false)}
          className="text-rose-500 font-extrabold"
        >
          Log in
        </span>
      </p>
    </div>
  );
}

export default RegisterPage;
