import React, { useState } from "react";
import { supabase } from "./supabase";
import { categorizeChallenge, suggestSkills } from "./aiAgent";

function PostChallenge({ onBack, onPostChallenge }) {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    organization: "",
    category: "",
    description: "",
    skills: "",
    difficulty: "Medium",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const ai = categorizeChallenge({ title: formData.title, description: formData.description, skills: formData.skills });
    const aiSkills = suggestSkills({ title: formData.title, description: formData.description, skills: formData.skills });

    const newChallenge = {
      title: formData.title,
      category: ai.category,
      organization: formData.organization,
      description: formData.description,
      skills: aiSkills.length ? aiSkills.join(", ") : formData.skills,
      difficulty: formData.difficulty,
      ai_category_confidence: ai.confidence,
      participants: 0,
    };

    const { data, error } = await supabase
      .from("Challenges")
      .insert([newChallenge])
      .select()
      .single();

    if (error) {
      console.error("Error posting challenge:", error);
    setError(error.message);
      return;
    }

    onPostChallenge(data);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="submit-page">
        <div className="success-card">
          <div className="success-icon">✓</div>

          <p className="small-label">CHALLENGECONNECT</p>

          <h1>Challenge Posted!</h1>

          <p>
            Your challenge has been successfully published.
            Students and teams can now discover and work on it.
          </p>

          <button
            className="back-dashboard-button"
            onClick={onBack}
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="post-challenge-page">
      <div className="post-challenge-header">
        <button className="back-button" onClick={onBack}>
          ← Back to Dashboard
        </button>

        <p className="small-label">CHALLENGECONNECT</p>

        <h1>Post a Challenge</h1>

        <p>
          Share a real-world problem and connect with students,
          universities and innovators who can help solve it.
        </p>
      </div>

      <form
        className="challenge-form"
        onSubmit={handleSubmit}
      >
        <div className="form-group">
          <label>Challenge Title</label>

          <input
            type="text"
            name="title"
            placeholder="e.g. Smart Waste Management System"
            value={formData.title}
            onChange={handleChange}
            required
          />

          <span className="field-help">
            Give your challenge a clear and specific title.
          </span>
        </div>

        <div className="form-group">
          <label>Organization</label>

          <input
            type="text"
            name="organization"
            placeholder="e.g. Jaipur Municipal Corporation"
            value={formData.organization}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Category</label>

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="">AI will select category</option>
              <option value="Environment">Environment</option>
              <option value="Agriculture">Agriculture</option>
              <option value="Education">Education</option>
              <option value="Energy">Energy</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Transportation">Transportation</option>
              <option value="Technology">Technology</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Difficulty</label>

            <select
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Challenge Description</label>

          <textarea
            name="description"
            placeholder="Explain the real-world problem..."
            value={formData.description}
            onChange={handleChange}
            rows="7"
            required
          />

          <span className="field-help">
            Explain the problem clearly so teams understand what
            they need to solve.
          </span>
        </div>

        <div className="form-group">
          <label>Required Skills</label>

          <input
            type="text"
            name="skills"
            placeholder="e.g. IoT, AI, React, Data Science"
            value={formData.skills}
            onChange={handleChange}
            required
          />

          <span className="field-help">
            Separate multiple skills using commas.
          </span>
        </div>

        {error && (
          <p style={{ color: "red", marginBottom: "15px" }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          className="final-submit-button"
        >
          Post Challenge →
        </button>
      </form>
    </div>
  );
}

export default PostChallenge;