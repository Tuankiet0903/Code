import { useState } from "react";
import { login } from "../../services/api.js";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("user0@example.com");
  const [password, setPassword] = useState("password123");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErr("");
    try {
      const data = await login(email, password);
      localStorage.setItem("token", data.token);
      onLogin(data.token);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="login" className="bg-white p-6 rounded shadow">
      <h3 className="text-lg font-semibold mb-4">Login</h3>
      <form onSubmit={submit} className="space-y-3">
        <div>
          <label className="block text-sm">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        {err && <div className="text-red-600">{err}</div>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 rounded"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}
