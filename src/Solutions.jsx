import React, { useState } from "react";

function Solutions({ solutions, onBack }) {
  const [selectedSolution, setSelectedSolution] = useState(null);

  return (
    <div className="solutions-page">

      {/* Header */}
      <div className="solutions-header">

        <button
          className="back-button"
          onClick={onBack}
        >
          ← Back to Dashboard
        </button>

        <p className="small-label">
          CHALLENGECONNECT
        </p>

        <h1>Solutions Dashboard</h1>

        <p>
          Explore solutions submitted by students and teams
          to real-world challenges.
        </p>

      </div>


      {/* Statistics */}
      <div className="solution-stats">

        <div className="solution-stat">
          <strong>{solutions.length}</strong>
          <span>Submitted Solutions</span>
        </div>

        <div className="solution-stat">
          <strong>
            {new Set(
              solutions.map((solution) => solution.teamName)
            ).size}
          </strong>
          <span>Participating Teams</span>
        </div>

        <div className="solution-stat">
          <strong>Open</strong>
          <span>Review Status</span>
        </div>

      </div>


      {/* Solutions */}
      <div className="solutions-title-row">

        <h2>Submitted Solutions</h2>

        <span>
          {solutions.length} solution
          {solutions.length !== 1 ? "s" : ""}
        </span>

      </div>


      {solutions.length === 0 ? (

        <div className="empty-solutions">

          <div className="empty-icon">
            +
          </div>

          <h2>No Solutions Yet</h2>

          <p>
            Submitted solutions will appear here.
          </p>

        </div>

      ) : (

        <div className="solutions-grid">

          {solutions.map((solution) => (

            <div
              className="solution-card"
              key={solution.id}
            >

              <div className="solution-card-top">

                <span className="solution-status">
                  SUBMITTED
                </span>

                <span className="solution-date">
                  {solution.date}
                </span>

              </div>


              <h2>
                {solution.solutionTitle}
              </h2>


              <div className="solution-team">
                👥 {solution.teamName}
              </div>


              <div className="solution-info">

                <div>
                  <span>Technology Used</span>

                  <p>
                    {solution.technology}
                  </p>
                </div>


                <div>
                  <span>Expected Impact</span>

                  <p>
                    {solution.expectedImpact}
                  </p>
                </div>

              </div>


              <div className="solution-challenge">

                <span>Challenge</span>

                <strong>
                  {solution.challengeTitle || "Challenge"}
                </strong>

              </div>


              <button
                className="view-solution-button"
                onClick={() => setSelectedSolution(solution)}
              >
                View Solution →
              </button>


              {/* Complete Solution Details */}
              {selectedSolution?.id === solution.id && (

                <div className="solution-details">

                  <h3>Problem Understanding</h3>

                  <p>
                    {solution.problemUnderstanding}
                  </p>


                  <h3>Proposed Solution</h3>

                  <p>
                    {solution.proposedSolution}
                  </p>


                  <h3>Technology Used</h3>

                  <p>
                    {solution.technology}
                  </p>


                  <h3>Expected Impact</h3>

                  <p>
                    {solution.expectedImpact}
                  </p>


                  <button
                    className="back-button"
                    onClick={() => setSelectedSolution(null)}
                  >
                    Close Details
                  </button>

                </div>

              )}

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

export default Solutions;