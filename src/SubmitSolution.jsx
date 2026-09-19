import React, { useState } from "react";

function SubmitSolution({ challenge, onBack, onSubmitSolution }) {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    teamName: "",
    solutionTitle: "",
    problemUnderstanding: "",
    proposedSolution: "",
    technology: "",
    expectedImpact: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const newSolution = {
      teamName: formData.teamName,
      solutionTitle: formData.solutionTitle,
      problemUnderstanding: formData.problemUnderstanding,
      proposedSolution: formData.proposedSolution,
      technology: formData.technology,
      expectedImpact: formData.expectedImpact,
      challengeTitle: challenge.title,
      organization: challenge.organization,
      date: new Date().toLocaleDateString(),
    };

    const success = await onSubmitSolution(newSolution);

    if (success) {
      setSubmitted(true);
    } else {
      setError("Could not submit your solution. Please try again.");
    }
  };

  // Success screen
  if (submitted) {
    return (
      <div className="submit-page">
        <div className="success-card">
          <div className="success-icon">
            ✓
          </div>

          <h1>Solution Submitted!</h1>

          <p>
            Your solution has been successfully submitted for:
          </p>

          <h2>{challenge.title}</h2>

          <p className="success-message">
            The challenge organization can now review your
            proposed solution.
          </p>

          <button
            className="back-dashboard-button"
            onClick={onBack}
          >
            ← Back to Challenge
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="submit-page">

      {/* Header */}

      <div className="submit-header">
        <button
          className="back-button"
          onClick={onBack}
        >
          ← Back to Challenge
        </button>

        <p className="small-label">
          CHALLENGECONNECT
        </p>

        <h1>Submit Your Solution</h1>

        <p>
          Share your team's idea and explain how it can solve
          the challenge.
        </p>
      </div>


      {/* Challenge Reference */}

      <div className="challenge-reference">
        <span>SUBMITTING FOR</span>

        <h2>{challenge.title}</h2>

        <p>
          🏢 {challenge.organization}
        </p>
      </div>


      {/* Form */}

      <form
        className="solution-form"
        onSubmit={handleSubmit}
      >

        {/* Team Name */}

        <div className="form-group">
          <label htmlFor="teamName">
            Team Name
          </label>

          <input
            id="teamName"
            name="teamName"
            type="text"
            placeholder="Enter your team name"
            value={formData.teamName}
            onChange={handleChange}
            required
          />
        </div>


        {/* Solution Title */}

        <div className="form-group">
          <label htmlFor="solutionTitle">
            Solution Title
          </label>

          <input
            id="solutionTitle"
            name="solutionTitle"
            type="text"
            placeholder="Give your solution a clear title"
            value={formData.solutionTitle}
            onChange={handleChange}
            required
          />
        </div>


        {/* Problem Understanding */}

        <div className="form-group">
          <label htmlFor="problemUnderstanding">
            Problem Understanding
          </label>

          <p className="field-help">
            Explain the problem and why it needs to be solved.
          </p>

          <textarea
            id="problemUnderstanding"
            name="problemUnderstanding"
            placeholder="Describe your understanding of the challenge..."
            value={formData.problemUnderstanding}
            onChange={handleChange}
            rows="5"
            required
          />
        </div>


        {/* Proposed Solution */}

        <div className="form-group">
          <label htmlFor="proposedSolution">
            Proposed Solution
          </label>

          <p className="field-help">
            Explain your idea and how it will solve the problem.
          </p>

          <textarea
            id="proposedSolution"
            name="proposedSolution"
            placeholder="Describe your proposed solution..."
            value={formData.proposedSolution}
            onChange={handleChange}
            rows="7"
            required
          />
        </div>


        {/* Technology */}

        <div className="form-group">
          <label htmlFor="technology">
            Technology Used
          </label>

          <p className="field-help">
            Mention the technologies, tools or methods you plan
            to use.
          </p>

          <input
            id="technology"
            name="technology"
            type="text"
            placeholder="Example: React, IoT, AI, Python..."
            value={formData.technology}
            onChange={handleChange}
            required
          />
        </div>


        {/* Expected Impact */}

        <div className="form-group">
          <label htmlFor="expectedImpact">
            Expected Impact
          </label>

          <p className="field-help">
            Explain the expected benefits and real-world impact.
          </p>

          <textarea
            id="expectedImpact"
            name="expectedImpact"
            placeholder="Describe the expected impact of your solution..."
            value={formData.expectedImpact}
            onChange={handleChange}
            rows="5"
            required
          />
        </div>


        {/* Error Message */}

        {error && (
          <p style={{ color: "red", marginBottom: "15px" }}>
            {error}
          </p>
        )}


        {/* Submit */}

        <div className="form-submit">
          <button
            type="submit"
            className="final-submit-button"
          >
            Submit Solution →
          </button>

          <p>
            Make sure all information is correct before submitting.
          </p>
        </div>

      </form>
    </div>
  );
}

export default SubmitSolution;