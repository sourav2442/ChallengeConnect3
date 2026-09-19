import GovernmentDashboard from "./GovernmentDashboard";
import CollaboratorDashboard from "./CollaboratorDashboard";
import React, { useState, useEffect } from "react";
import { supabase } from "./supabase";

import Challenges from "./Challenges";
import ChallengeDetails from "./ChallengeDetails";
import SubmitSolution from "./SubmitSolution";
import Solutions from "./Solutions";
import PostChallenge from "./PostChallenge";
import Login from "./Login";

import "./App.css";

function App() {
  const [page, setPage] = useState("home");

const [selectedChallenge, setSelectedChallenge] = useState(null);

const [user, setUser] = useState(null);

  const [solutions, setSolutions] = useState([]);

  const [challenges, setChallenges] = useState([
    {
      id: 1,
      title: "Smart Waste Management",
      category: "Environment",
      organization: "Jaipur Municipal Corporation",
      description:
        "Develop a smart system for monitoring and improving waste collection and management.",
      skills: ["IoT", "AI", "Web Development"],
      difficulty: "Medium",
      participants: 12,
    },
    {
      id: 2,
      title: "Low-Cost Water Purification",
      category: "Environment",
      organization: "Rural Development Foundation",
      description:
        "Create an affordable and sustainable water purification solution for rural communities.",
      skills: ["Engineering", "Chemistry", "IoT"],
      difficulty: "Hard",
      participants: 8,
    },
    {
      id: 3,
      title: "Smart Irrigation System",
      category: "Agriculture",
      organization: "AgriTech Solutions",
      description:
        "Develop an intelligent irrigation system that reduces water usage and improves crop productivity.",
      skills: ["IoT", "Electronics", "AI"],
      difficulty: "Medium",
      participants: 15,
    },
    {
      id: 4,
      title: "Traffic Management System",
      category: "Transportation",
      organization: "Urban Mobility Lab",
      description:
        "Create a smart traffic management solution to reduce congestion and improve urban mobility.",
      skills: ["AI", "Data Science", "IoT"],
      difficulty: "Hard",
      participants: 10,
    },
    {
      id: 5,
      title: "Campus Energy Saving",
      category: "Energy",
      organization: "Green Campus Initiative",
      description:
        "Develop a system that monitors and reduces unnecessary energy consumption on university campuses.",
      skills: ["IoT", "Electronics", "Data Science"],
      difficulty: "Easy",
      participants: 6,
    },
    {
      id: 6,
      title: "Digital Education Platform",
      category: "Education",
      organization: "Education For All",
      description:
        "Build an accessible digital education platform that helps students learn through technology.",
      skills: ["React", "Backend", "UI/UX"],
      difficulty: "Medium",
      participants: 11,
    },
  ]);

  // Load challenges from Supabase
  useEffect(() => {
    const fetchChallenges = async () => {
      const { data, error } = await supabase
        .from("Challenges")
        .select("*")
        .order("id", { ascending: false });

      if (error) {
        console.error("Error fetching challenges:", error);
      } else {
        setChallenges((currentChallenges) => {
          const combinedChallenges = [
            ...data,
            ...currentChallenges.filter(
              (localChallenge) =>
                !data.some(
                  (dbChallenge) =>
                    dbChallenge.title === localChallenge.title
                )
            ),
          ];

          return combinedChallenges;
        });
      }
    };

    fetchChallenges();
  }, []);

  // Load solutions from Supabase after app loads
  useEffect(() => {
    const fetchSolutions = async () => {
      const { data, error } = await supabase
    .from("Solution")
    .select("*")
    .order("id", { ascending: false });
      if (error) {
        console.error("Error fetching solutions:", error);
      } else {
        const formattedSolutions = data.map((solution) => ({
          id: solution.id,
          teamName: solution.team_name,
          solutionTitle: solution.solution_title,
          problemUnderstanding: solution.problem_understanding,
          proposedSolution: solution.proposed_solution,
          technology: solution.technology_used,
          expectedImpact: solution.expected_impact,
          date: solution.created_at
            ? new Date(solution.created_at).toLocaleDateString()
            : "",
        }));

        setSolutions(formattedSolutions);
      }
    };

    fetchSolutions();
  }, []);

  // Open challenge details
  const openChallengeDetails = (challenge) => {
    console.log("Clicked challenge:", challenge);

    setSelectedChallenge(challenge);
    setPage("details");
  };

  // Save submitted solution to Supabase
  const addSolution = async (newSolution) => {
    const { data, error } = await supabase
      .from("Solution")
      .insert([
        {
          team_name: newSolution.teamName,
          solution_title: newSolution.solutionTitle,
          problem_understanding:
            newSolution.problemUnderstanding,
          proposed_solution: newSolution.proposedSolution,
          technology_used: newSolution.technology,
          expected_impact: newSolution.expectedImpact,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error saving solution:", error);

      alert(error.message);

      return false;
    }

    // Convert Supabase data into the format used by Solutions.jsx
    const formattedSolution = {
      id: data.id,
      teamName: data.team_name,
      solutionTitle: data.solution_title,
      problemUnderstanding: data.problem_understanding,
      proposedSolution: data.proposed_solution,
      technology: data.technology_used,
      expectedImpact: data.expected_impact,
      date: data.created_at
        ? new Date(data.created_at).toLocaleDateString()
        : "",
    };

    setSolutions((previousSolutions) => [
      formattedSolution,
      ...previousSolutions,
    ]);

    return true;
  };

  // Add challenge to the current page
  const addChallenge = (newChallenge) => {
    setChallenges((previousChallenges) => [
      newChallenge,
      ...previousChallenges,
    ]);
  };
// Government Dashboard
if (page === "government-dashboard") {
  return (
    <GovernmentDashboard
      user={user}
      onLogout={async () => {
        await supabase.auth.signOut();
        setUser(null);
        setPage("home");
      }}
    />
  );
}

// Collaborator Dashboard
if (page === "collaborator-dashboard") {
  return (
    <CollaboratorDashboard
      user={user}
      onLogout={async () => {
        await supabase.auth.signOut();
        setUser(null);
        setPage("home");
      }}
    />
  );
}
// Login Page
if (page === "login") {
  return (
    <Login
      onBack={() => setPage("home")}
      onLogin={(loggedInUser) => {
        setUser(loggedInUser);
        const role = loggedInUser.profile?.role;
        if (role === "government") {
          setPage("government-dashboard");
        } else if (role === "collaborator") {
          setPage("collaborator-dashboard");
        } else {
          setPage("home");
        }
      }}
    />
  );
}
  // Post Challenge Page
  if (page === "post-challenge") {
    return (
      <PostChallenge
        onBack={() => setPage("home")}
        onPostChallenge={addChallenge}
      />
    );
  }

  // Solutions Dashboard
  if (page === "solutions") {
    return (
      <Solutions
        solutions={solutions}
        onBack={() => setPage("home")}
      />
    );
  }

  // Submit Solution Page
  if (page === "submit") {
    return (
      <SubmitSolution
        challenge={selectedChallenge}
        onBack={() => setPage("details")}
        onSubmitSolution={addSolution}
      />
    );
  }

  // Challenge Details Page
  if (page === "details") {
    return (
      <ChallengeDetails
        challenge={selectedChallenge}
        onBack={() => setPage("challenges")}
        onSubmit={() => setPage("submit")}
      />
    );
  }

  // Challenges Page
  if (page === "challenges") {
    return (
      <Challenges
        challenges={challenges}
        onBack={() => setPage("home")}
        onViewDetails={openChallengeDetails}
      />
    );
  }

  // Home Page
  return (
    <div className="app">
      {/* Navigation */}
      <nav className="navbar">
        <div className="logo">
          Challenge<span>Connect</span>
        </div>

        <div className="nav-links">
          <button onClick={() => setPage("home")}>
            Home
          </button>

          <button onClick={() => setPage("challenges")}>
            Challenges
          </button>

          <button onClick={() => setPage("solutions")}>
            Solutions
          </button>

          <button>
            Dashboard
          </button>

          <button
          className="login-button"
          onClick={() => setPage("login")}
          >
          {user ? "Logged In" : "Login"}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <p className="hero-label">
            SOCIETY × UNIVERSITY × INDUSTRY
          </p>

          <h1>
            Turn Real-World Problems
            <br />
            Into <span>Real Solutions.</span>
          </h1>

          <p className="hero-text">
            ChallengeConnect connects organizations with students,
            universities and innovators to solve meaningful
            real-world challenges.
          </p>

          <div className="hero-buttons">
            <button
              className="primary-button"
              onClick={() => setPage("challenges")}
            >
              Explore Challenges →
            </button>

            <button
              className="secondary-button"
              onClick={() => setPage("post-challenge")}
            >
              + Post a Challenge
            </button>

            <button
              className="secondary-button"
              onClick={() => setPage("solutions")}
            >
              View Solutions
            </button>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="stats">
        <div className="stat-card">
          <h2>{challenges.length}</h2>
          <p>Open Challenges</p>
        </div>

        <div className="stat-card">
          <h2>{solutions.length}</h2>
          <p>Solutions Submitted</p>
        </div>

        <div className="stat-card">
          <h2>18</h2>
          <p>Active Teams</p>
        </div>

        <div className="stat-card">
          <h2>12</h2>
          <p>Partner Organizations</p>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-section">
        <p className="section-label">
          SIMPLE PROCESS
        </p>

        <h2>
          How ChallengeConnect Works
        </h2>

        <div className="steps">
          <div className="step">
            <span>01</span>
            <h3>Post a Challenge</h3>
            <p>
              Organizations publish real-world problems.
            </p>
          </div>

          <div className="step">
            <span>02</span>
            <h3>Explore Challenges</h3>
            <p>
              Students discover problems matching their skills.
            </p>
          </div>

          <div className="step">
            <span>03</span>
            <h3>Submit Solution</h3>
            <p>
              Teams develop and submit their proposed solutions.
            </p>
          </div>

          <div className="step">
            <span>04</span>
            <h3>Create Impact</h3>
            <p>
              Organizations review solutions and collaborate.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;