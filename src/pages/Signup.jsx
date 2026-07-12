import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const PS = {
  fontFamily: "'Pin Sans', 'Inter', ui-sans-serif, system-ui, sans-serif",
};

function Field({ label, children, errorKey, errors }) {
  return (
    <div>
      <label
        className="block text-sm font-semibold mb-1.5"
        style={{ color: "#33332e" }}
      >
        {label}
      </label>
      {children}
      {errors[errorKey] && (
        <p className="mt-1 text-xs font-medium" style={{ color: "#e60023" }}>
          {errors[errorKey]}
        </p>
      )}
    </div>
  );
}

export default function Signup() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isAuthenticated) navigate("/", { replace: true });
  }, [isAuthenticated, navigate]);

  const validate = () => {
    const errs = {};
    if (!fullName.trim()) errs.fullName = "Full name is required";
    if (!username.trim()) errs.username = "Username is required";
    else if (username.length < 3)
      errs.username = "Username must be at least 3 characters";
    if (!email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errs.email = "Enter a valid email";
    if (!password) errs.password = "Password is required";
    else if (password.length < 8)
      errs.password = "Password must be at least 8 characters";
    if (!confirmPassword) errs.confirmPassword = "Confirm your password";
    else if (password !== confirmPassword)
      errs.confirmPassword = "Passwords do not match";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      await new Promise((r) => setTimeout(r, 800));

      const mockUser = {
        id: Date.now(),
        fullName,
        username,
        email,
      };

      login(mockUser, "mock-token");
      navigate("/");
    } catch {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (key) => ({
    borderColor: errors[key] ? "#e60023" : "#dadad3",
    backgroundColor: "#ffffff",
  });

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{ backgroundColor: "#f6f6f3", ...PS }}
    >
      <div className="w-full max-w-[480px]">
        <div
          className="bg-red-100 rounded-2xl shadow-sm p-8"
          style={{ border: "1px solid #dadad3" }}
        >
          <h2 className="text-3xl font-bold mb-6">Create account</h2>

          {error && (
            <div className="mb-4 text-sm text-red-600 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Full Name" errorKey="fullName" errors={errors}>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl text-sm border outline-none"
                  style={inputStyle("fullName")}
                />
              </Field>

              <Field label="Username" errorKey="username" errors={errors}>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl text-sm border outline-none"
                  style={inputStyle("username")}
                />
              </Field>
            </div>

            <Field label="Email" errorKey="email" errors={errors}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-sm border outline-none"
                style={inputStyle("email")}
              />
            </Field>

            {/* Password Field */}
            <Field label="Password" errorKey="password" errors={errors}>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-10 rounded-xl text-sm border outline-none"
                  style={inputStyle("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </Field>

            {/* Confirm Password Field */}
            <Field
              label="Confirm Password"
              errorKey="confirmPassword"
              errors={errors}
            >
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-10 rounded-xl text-sm border outline-none"
                  style={inputStyle("confirmPassword")}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </Field>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-sm font-bold text-white"
              style={{ backgroundColor: "#e60023" }}
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="text-sm font-bold text-red-600 hover:underline"
            >
              Already have an account? Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}