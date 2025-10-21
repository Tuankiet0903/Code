import { useState } from "react";
import { login } from "../../services/api.js";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("user0@example.com");
  const [password, setPassword] = useState("password123");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-purple-200 via-purple-300 to-indigo-400 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Mountain silhouettes */}
        <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-indigo-900 via-indigo-800 to-transparent opacity-40" />
        <div className="absolute bottom-20 left-0 w-full h-40 bg-gradient-to-t from-purple-900 via-purple-800 to-transparent opacity-30" />

        {/* Decorative shapes */}
        <div className="absolute top-10 right-20 w-32 h-32 bg-white rounded-full opacity-10 blur-3xl" />
        <div className="absolute bottom-40 left-10 w-40 h-40 bg-white rounded-full opacity-5 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md text-black  min-h-[calc(100vh-30rem)]">
        <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-3xl shadow-2xl p-8 md:p-10">
          <h1 className="text-4xl font-bold text-center mb-8 drop-shadow-lg">
            Login
          </h1>

          <form onSubmit={submit} className="space-y-5">
            {/* Email Input */}
            <div className="relative">
              <div className="flex items-center bg-white/10 border border-white/30 rounded-full px-5 py-3 focus-within:bg-white/20 focus-within:border-white/50 transition-all duration-200">
                <Mail className="w-5 h-5  flex-shrink-0" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email ID"
                  className="w-full bg-transparent placeholder-white/50 ml-3 focus:outline-none"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="relative">
              <div className="flex items-center bg-white/10 border border-white/30 rounded-full px-5 py-3 focus-within:bg-white/20 focus-within:border-white/50 transition-all duration-200">
                <Lock className="w-5 h-5 flex-shrink-0" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full bg-transparent placeholder-white/50 ml-3 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className=" hover:text-white transition-colors flex-shrink-0"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {err && (
              <div className="bg-red-500/20 border border-red-400/50 text-red-100 text-sm rounded-lg px-4 py-2 backdrop-blur-sm">
                {err}
              </div>
            )}

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-white/30 bg-white/10 text-white accent-white"
                />
                <span className=" group-hover:text-white transition-colors">
                  Remember me
                </span>
              </label>
              <a
                href="#"
                className=" hover:text-white transition-colors font-medium"
              >
                Forgot Password?
              </a>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-indigo-600 font-bold py-3 rounded-full hover:bg-white/90 disabled:opacity-70 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
            >
              {loading ? "Signing in..." : "Login"}
            </button>
          </form>

          {/* Register Link */}
          <div className="text-center mt-6text-sm">
            Don't have an account?{" "}
            <a href="#" className=" font-bold hover:underline">
              Register
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
