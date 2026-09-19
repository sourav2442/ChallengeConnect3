import React, { useState } from "react";
import { supabase } from "./supabase";

function Login({ onBack, onLogin }) {
  const [isRegister, setIsRegister] = useState(false);

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");
    setLoading(true);

    const cleanUsername = username.trim().toLowerCase();

    // Username is converted into an internal email
    const email = `${cleanUsername}@gmail.com`;

    try {
      if (isRegister) {
        // Create new user
        if (!name.trim()) {
          setError("Please enter your name.");
          setLoading(false);
          return;
        }

        const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
        data: {
        full_name: name.trim(),
        username: cleanUsername,
        },
        },
        });

        if (error) {
          setError(error.message);
          setLoading(false);
          return;
        }

        if (data.user) {
  // Save name and username in profiles table
        const { error: profileError } = await supabase
  .from("profiles")
  .insert({
    id: data.user.id,
    full_name: name.trim(),
    username: cleanUsername,
    role: "challenger",
  });

  if (profileError) {
    console.error("Profile error:", profileError);

    setError(
      "Account created, but profile could not be saved: " +
    profileError.message
    );

    setLoading(false);
    return;
    }

    setMessage("Account created successfully!");

    setName("");
    setUsername("");
    setPassword("");

    setIsRegister(false);
    }
      } else {
        // Login existing user
        const { data, error } =
          await supabase.auth.signInWithPassword({
            email: email,
            password: password,
          });

        if (error) {
          setError("Invalid username or password.");
          setLoading(false);
          return;
        }

        if (data.user) {
             const { data: profile, error: profileError } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", data.user.id)
                .single();

            if (profileError) {
                console.error("Profile fetch error:", profileError);
                setError("Could not load your profile.");
                setLoading(false);
                return;
            }

            onLogin({
                ...data.user,
                profile,
            });
        }
      }
    } catch (err) {
      console.error("Authentication error:", err);
      setError("Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="login-page">

      <div className="login-card">

        <button
          className="login-back-button"
          onClick={onBack}
        >
          ← Back
        </button>

        <div className="login-logo">
          Challenge<span>Connect</span>
        </div>

        <p className="login-label">
          CHALLENGECONNECT
        </p>

        <h1>
          {isRegister ? "Create Account" : "Welcome Back"}
        </h1>

        <p className="login-description">
          {isRegister
            ? "Create your ChallengeConnect account."
            : "Login to continue to ChallengeConnect."}
        </p>

        {message && (
          <div className="login-success">
            {message}
          </div>
        )}

        {error && (
          <div className="login-error">
            {error}
          </div>
        )}

        <form
          className="login-form"
          onSubmit={handleSubmit}
        >

          {isRegister && (
            <div className="login-form-group">

              <label htmlFor="name">
                Full Name
              </label>

              <input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

            </div>
          )}

          <div className="login-form-group">

            <label htmlFor="username">
              Username
            </label>

            <input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

          </div>

          <div className="login-form-group">

            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength="6"
              required
            />

          </div>

          <button
            type="submit"
            className="login-submit-button"
            disabled={loading}
          >
            {loading
              ? "Please wait..."
              : isRegister
              ? "Create Account"
              : "Login"}
          </button>

        </form>

        <div className="login-switch">

          {isRegister
            ? "Already have an account?"
            : "Don't have an account?"}

          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setError("");
              setMessage("");
            }}
          >
            {isRegister ? "Login" : "Create Account"}
          </button>

        </div>

      </div>

    </div>
  );
}

export default Login;