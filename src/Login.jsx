
import React, { useState } from "react";
import "./Login.css";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const correctUsername = "suhaas";
  const correctPassword = "Suhaas@123";

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      username === correctUsername &&
      password === correctPassword
    ) {
      onLogin();
    } else {
      setError("Incorrect username or password!");
    }
  };

  return (
    <div className="login-container">
      <form className="login-box" onSubmit={handleSubmit}>
        <h1>Learning App</h1>
        <p>Please login to continue</p>

        <input
          type="text"
          placeholder="Enter Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        {/* PASSWORD FIELD */}
        <div className="password-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="button"
            className="toggle-password"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? "🙈" : "👁"}
          </button>
        </div>

        {error && (
          <p className="login-error">{error}</p>
        )}

        <button type="submit">LOGIN</button>
      </form>
    </div>
  );
}

export default Login;
