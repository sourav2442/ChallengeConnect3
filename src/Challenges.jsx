import React, { useState } from "react";

function Challenges({ challenges, onBack, onViewDetails }) {
  const [search, setSearch] = useState("");

 

  const filteredChallenges = challenges.filter((challenge) =>
    `${challenge.title} ${challenge.category} ${challenge.organization}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="challenges-page">

      {/* Header */}
      <div className="challenges-header">
        <button className="back-button" onClick={onBack}>
          ← Back to Dashboard
        </button>

        <div>
          <p className="small-label">CHALLENGECONNECT</p>
          <h1>Explore Challenges</h1>
          <p>
            Find real-world problems and turn your ideas into meaningful
            solutions.
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="challenge-search">
        <input
          type="text"
          placeholder="Search challenges, categories or organizations..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Results */}
      <div className="challenge-result-header">
        <h2>Open Challenges</h2>
        <span>{filteredChallenges.length} challenges found</span>
      </div>

      {/* Cards */}
      <div className="challenge-grid">
        {filteredChallenges.map((challenge) => (
          <div className="challenge-card" key={challenge.id}>

            <div className="challenge-top">
              <span className="category-badge">
                {challenge.category}
              </span>

              <span className="difficulty">
                {challenge.difficulty}
              </span>
            </div>

            <h3>{challenge.title}</h3>

            <p className="organization">
              🏢 {challenge.organization}
            </p>

            <p className="challenge-description">
              {challenge.description}
            </p>

            <div className="skills">
              <strong>Skills:</strong> {challenge.skills}
            </div>

            <button
            className="details-button"
            onClick={() => onViewDetails(challenge)}
            >
            View Challenge →
            </button>

          </div>
        ))}
      </div>

      {filteredChallenges.length === 0 && (
        <div className="no-results">
          <h3>No challenges found</h3>
          <p>Try searching for another keyword.</p>
        </div>
      )}

    </div>
  );
}

export default Challenges;