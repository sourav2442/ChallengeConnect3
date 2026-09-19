import React, { useEffect, useState } from "react";
import { supabase } from "./supabase"; // keep the import path that is already working

function GovernmentDashboard({ user, onLogout }) {
  const [stats, setStats] = useState({
    challenges: 0,
    solutions: 0,
    assigned: 0,
    inProgress: 0,
  });

  const [challenges, setChallenges] = useState([]);
  const [showChallenges, setShowChallenges] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [solutions, setSolutions] = useState([]);
  const [showSolutions, setShowSolutions] = useState(false);
  const [solutionSearch, setSolutionSearch] = useState("");
  const [solutionLoading, setSolutionLoading] = useState(false);

  const [loading, setLoading] = useState(true);
  const [challengeLoading, setChallengeLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError("");

    try {
      // Get total challenges
      const {
        count: challengeCount,
        error: challengeCountError,
      } = await supabase
        .from("Challenges")
        .select("*", { count: "exact", head: true });

      if (challengeCountError) {
        throw challengeCountError;
      }

      // Get total solutions
      const {
        count: solutionCount,
        error: solutionCountError,
      } = await supabase
        .from("Solution")
        .select("*", { count: "exact", head: true });

      if (solutionCountError) {
        throw solutionCountError;
      }

      setStats({
        challenges: challengeCount || 0,
        solutions: solutionCount || 0,
        assigned: 0,
        inProgress: 0,
      });
    } catch (err) {
      console.error("Dashboard error:", err);
      setError(err.message || "Unable to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  const fetchChallenges = async () => {
    setChallengeLoading(true);
    setError("");

    try {
      const { data, error } = await supabase
        .from("Challenges")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      setChallenges(data || []);
      setShowChallenges(true);
    } catch (err) {
      console.error("Challenge loading error:", err);
      setError(err.message || "Unable to load challenges.");
    } finally {
      setChallengeLoading(false);
    }
  };
  const fetchSolutions = async () => {
  setSolutionLoading(true);
  setError("");

  try {
    const { data, error } = await supabase
      .from("Solution")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    setSolutions(data || []);
    setShowSolutions(true);
  } catch (err) {
    console.error("Solution loading error:", err);
    setError(err.message || "Unable to load solutions.");
  } finally {
    setSolutionLoading(false);
  }
};

const handleViewSolutions = () => {
  if (showSolutions) {
    setShowSolutions(false);
  } else {
    fetchSolutions();
  }
};

  const handleViewChallenges = () => {
    if (showChallenges) {
      setShowChallenges(false);
    } else {
      fetchChallenges();
    }
  };

  const filteredChallenges = challenges.filter((challenge) => {
    const search = searchTerm.toLowerCase();

    return (
      (challenge.title || "").toLowerCase().includes(search) ||
      (challenge.organization || "").toLowerCase().includes(search) ||
      (challenge.category || "").toLowerCase().includes(search) ||
      (challenge.skills || "").toLowerCase().includes(search) ||
      (challenge.difficulty || "").toLowerCase().includes(search)
    );
  });
  const filteredSolutions = solutions.filter((solution) => {
  const search = solutionSearch.toLowerCase();

  return (
    (solution.team_name || "").toLowerCase().includes(search) ||
    (solution.solution_title || "").toLowerCase().includes(search) ||
    (solution.technology_used || "").toLowerCase().includes(search) ||
    (solution.expected_impact || "").toLowerCase().includes(search)
  );
});

  return (
    <div className="role-dashboard">

      {/* NAVBAR */}
      <nav className="dashboard-navbar">

        <div className="logo">
          Challenge<span>Connect</span>
        </div>

        <div className="dashboard-nav-right">
          <span>
            {user?.profile?.full_name || "Government User"}
          </span>

          <button onClick={onLogout}>
            Logout
          </button>
        </div>

      </nav>


      {/* MAIN */}
      <main className="dashboard-content">

        <p className="dashboard-label">
          GOVERNMENT PORTAL
        </p>

        <h1>
          Government Dashboard
        </h1>

        <p className="dashboard-description">
          Monitor challenges, submitted solutions,
          assigned problems and their progress.
        </p>


        {/* ERROR */}
        {error && (
          <div className="dashboard-error">
            {error}
          </div>
        )}


        {/* STATISTICS */}
        <div className="dashboard-stats">

          <div className="stat-card">
            <div className="stat-icon">📋</div>

            <div>
              <p className="stat-title">
                Total Challenges
              </p>

              <h2>
                {loading ? "..." : stats.challenges}
              </h2>

              <span className="stat-description">
                Challenge entries
              </span>
            </div>
          </div>


          <div className="stat-card">
            <div className="stat-icon">💡</div>

            <div>
              <p className="stat-title">
                Submitted Solutions
              </p>

              <h2>
                {loading ? "..." : stats.solutions}
              </h2>

              <span className="stat-description">
                Solutions received
              </span>
            </div>
          </div>


          <div className="stat-card">
            <div className="stat-icon">🎯</div>

            <div>
              <p className="stat-title">
                Assigned Problems
              </p>

              <h2>0</h2>

              <span className="stat-description">
                Problems assigned
              </span>
            </div>
          </div>


          <div className="stat-card">
            <div className="stat-icon">📈</div>

            <div>
              <p className="stat-title">
                In Progress
              </p>

              <h2>0</h2>

              <span className="stat-description">
                Active assignments
              </span>
            </div>
          </div>

        </div>


        {/* CHALLENGE MANAGEMENT */}
        <div className="dashboard-section">

          <div>
            <p className="section-label">
              CHALLENGE MANAGEMENT
            </p>

            <h2>
              Challenge Entries
            </h2>

            <p>
              View and monitor challenges submitted
              through the ChallengeConnect platform.
            </p>
          </div>

          <button
            className="section-button"
            onClick={handleViewChallenges}
          >
            {challengeLoading
              ? "Loading..."
              : showChallenges
              ? "Hide Challenges"
              : "View Challenges"}
          </button>

        </div>


        {/* CHALLENGE TABLE */}
        {showChallenges && (
          <div className="challenge-table-container">

            <div className="challenge-table-header">

              <div>
                <h2>
                  All Challenge Entries
                </h2>

                <p>
                  {filteredChallenges.length} challenge
                  {filteredChallenges.length !== 1 ? "s" : ""} found
                </p>
              </div>

              <input
                type="text"
                placeholder="Search challenges..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="challenge-search"
              />

            </div>


            {filteredChallenges.length === 0 ? (

              <div className="empty-state">
                <div>📋</div>

                <h3>
                  No challenges found
                </h3>

                <p>
                  Try changing your search.
                </p>
              </div>

            ) : (

              <div className="challenge-list">

                {filteredChallenges.map((challenge) => (

                  <div
                    className="challenge-item"
                    key={challenge.id}
                  >

                    <div className="challenge-main">

                      <h3>
                        {challenge.title || "Untitled Challenge"}
                      </h3>

                      <p className="challenge-description">
                        {challenge.description ||
                          "No description available."}
                      </p>

                    </div>


                    <div className="challenge-details">

                      <div>
                        <span>Organization</span>
                        <strong>
                          {challenge.organization || "N/A"}
                        </strong>
                      </div>

                      <div>
                        <span>Category</span>
                        <strong>
                          {challenge.category || "N/A"}
                        </strong>
                      </div>

                      <div>
                        <span>Difficulty</span>
                        <strong>
                          {challenge.difficulty || "N/A"}
                        </strong>
                      </div>

                      <div>
                        <span>Skills</span>
                        <strong>
                          {challenge.skills || "N/A"}
                        </strong>
                      </div>

                      <div>
                        <span>Participants</span>
                        <strong>
                          {challenge.participants ?? 0}
                        </strong>
                      </div>

                      <div>
                        <span>Created</span>
                        <strong>
                          {challenge.created_at
                            ? new Date(
                                challenge.created_at
                              ).toLocaleDateString()
                            : "N/A"}
                        </strong>
                      </div>

                    </div>

                  </div>

                ))}

              </div>

            )}

          </div>
        )}


        {/* SOLUTIONS */}
        <div className="dashboard-section">

          <div>
            <p className="section-label">
              SOLUTION MANAGEMENT
            </p>

            <h2>
              Submitted Solutions
            </h2>

            <p>
              Review solutions submitted by teams
              and collaborators.
            </p>
          </div>

          <button
            className="section-button"
            onClick={handleViewSolutions}
          >
            {solutionLoading
            ? "Loading..."
            : showSolutions
            ? "Hide Solutions"
            : "View Solutions"}
          </button>

        </div>


        {/* ASSIGNMENTS */}
        <div className="dashboard-section">

          <div>
            <p className="section-label">
              ASSIGNMENTS
            </p>

            <h2>
              Assigned Problems
            </h2>

            <p>
              Assign challenges to universities
              and other collaborators.
            </p>
          </div>

          <button
            className="section-button"
            disabled
          >
            Coming Soon
          </button>

        </div>

      </main>

    </div>
  );
}

export default GovernmentDashboard;