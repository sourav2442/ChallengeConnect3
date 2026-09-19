import React from "react";

function ChallengeDetails({ challenge, onBack, onSubmit }) {

  if (!challenge) {
    return (
      <div className="details-page">
        <button className="back-button" onClick={onBack}>
          ← Back to Challenges
        </button>

        <h1>Challenge Not Found</h1>
        <p>Please select a challenge again.</p>
      </div>
    );
  }

  return (
    <div className="details-page">

      {/* Top */}
      <div className="details-top">
        <button className="back-button" onClick={onBack}>
          ← Back to Challenges
        </button>

        <span className="details-status">
          ● OPEN CHALLENGE
        </span>
      </div>

      {/* Main Content */}
      <div className="details-layout">

        {/* Left Side */}
        <main className="details-main">

          <span className="category-badge">
            {challenge.category}
          </span>

          <h1>{challenge.title}</h1>

          <p className="details-organization">
            🏢 Posted by <strong>{challenge.organization}</strong>
          </p>

          <div className="details-section">
            <h2>Challenge Description</h2>

            <p>{challenge.description}</p>

            <p>
              The organization is looking for innovative and practical
              solutions that can create measurable real-world impact.
              Students, university teams and innovators can submit their
              ideas and proposed implementation.
            </p>
          </div>

          <div className="details-section">
            <h2>What We Are Looking For</h2>

            <ul>
              <li>Practical and innovative solution</li>
              <li>Clear implementation strategy</li>
              <li>Affordable and scalable approach</li>
              <li>Potential real-world impact</li>
            </ul>
          </div>

          <div className="details-section">
            <h2>Expected Skills</h2>

           <div className="skill-list">
            {Array.isArray(challenge.skills)
            ? challenge.skills.map((skill, index) => (
            <span key={index}>{skill}</span>
            ))
            : challenge.skills?.split(",").map((skill, index) => (
            <span key={index}>{skill.trim()}</span>
            ))}
          </div>
          </div>

        </main>


        {/* Right Side */}
        <aside className="details-sidebar">

          <div className="info-card">

            <h3>Challenge Information</h3>

            <div className="info-item">
              <span>Category</span>
              <strong>{challenge.category}</strong>
            </div>

            <div className="info-item">
              <span>Difficulty</span>
              <strong>{challenge.difficulty}</strong>
            </div>

            <div className="info-item">
              <span>Organization</span>
              <strong>{challenge.organization}</strong>
            </div>

            <div className="info-item">
              <span>Status</span>
              <strong className="open-text">Open</strong>
            </div>

            <button
              className="submit-solution-button"
              onClick={onSubmit}
            >
              Submit Your Solution →
            </button>

          </div>


          <div className="team-card">

            <h3>Who Can Participate?</h3>

            <p>🎓 University Students</p>
            <p>👥 Student Teams</p>
            <p>💡 Individual Innovators</p>
            <p>🏫 University Clubs & Labs</p>

          </div>

        </aside>

      </div>

    </div>
  );
}

export default ChallengeDetails;