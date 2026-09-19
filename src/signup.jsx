import React, { useState } from "react";
import { supabase } from "./supabase";

function Signup({ onBack, onLogin }) {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      // Create user in Supabase Authentication
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      if (!data.user) {
        setError("Account could not be created.");
        setLoading(false);
        return;
      }

      // Save user's name and username in profiles table
      const { error: profileError } = await supabase
        .from("profiles")
        .insert([
          {
            id: data.user.id,
            full_name: formData.name,
            username: formData.username,
            role: "challenger",
        },
        ]);

      if (profileError) {
        console.error("Profile error:", profileError);
        setError(profileError.message);
        setLoading(false);
        return;
      }

      setSuccess(
        "Account created successfully! You can now log in."
      );

      setFormData({
        name: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      setLoading(false);

    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-card">

        <button
          className="back-button"
          onClick={onBack}
        >
          ← Back
        </button>

        <p className="small-label">
          CHALLENGECONNECT
        </p>

        <h1>Create Account</h1>

        <p className="auth-subtitle">
          Create your ChallengeConnect account.
        </p>

        <form onSubmit={handleSignup}>

          {/* Name */}

          <div className="auth-form-group">
            <label htmlFor="name">
              Full Name
            </label>

            <input
              id="name"
              name="name"
              type="text"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>


          {/* Username */}

          <div className="auth-form-group">
            <label htmlFor="username">
              Username
            </label>

            <input
              id="username"
              name="username"
              type="text"
              placeholder="Choose a username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>


          {/* Email */}

          <div className="auth-form-group">
            <label htmlFor="email">
              Email
            </label>

            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>


          {/* Password */}

          <div className="auth-form-group">
            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              name="password"
              type="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>


          {/* Confirm Password */}

          <div className="auth-form-group">
            <label htmlFor="confirmPassword">
              Confirm Password
            </label>

            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>


          {/* Error */}

          {error && (
            <p className="auth-error">
              {error}
            </p>
          )}


          {/* Success */}

          {success && (
            <p className="auth-success">
              {success}
            </p>
          )}


          {/* Button */}

          <button
            type="submit"
            className="auth-submit-button"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account →"}
          </button>

        </form>


        <p className="auth-bottom-text">
          Already have an account?
        </p>

        <button
          className="auth-link-button"
          onClick={onLogin}
        >
          Login
        </button>

      </div>

    </div>
  );
}

export default Signup;