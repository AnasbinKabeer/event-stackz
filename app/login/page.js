"use client";
import { useState } from "react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(e) {
    e.preventDefault();

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    if (data.success) {
      localStorage.setItem("user", JSON.stringify(data.user));
      window.location.href = "/";
    } else {
      alert(data.error);
    }
  }

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="p-6 bg-white shadow-md rounded w-80 flex flex-col gap-4"
      >
        <h1 className="text-xl font-bold text-center">Login</h1>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded"
        />
        <button className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600" type="submit">
          Login
        </button>
      </form>
    </div>
  );
}
