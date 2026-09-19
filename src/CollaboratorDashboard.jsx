import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "./supabase";

const seedCollaborators = [
  { id: 1, name: "Aarav Mehta", role: "Project Lead", org: "Innovation Lab", status: "Online", initials: "AM" },
  { id: 2, name: "Priya Sharma", role: "Product Designer", org: "Design Hub", status: "Online", initials: "PS" },
  { id: 3, name: "Rohan Singh", role: "Technical Mentor", org: "Tech University", status: "Away", initials: "RS" },
];

const seedActivity = [
  { icon: "💡", title: "New challenge matched", text: "Smart Waste Management matches your interests.", time: "Today" },
  { icon: "🤝", title: "Team activity", text: "Priya Sharma joined your collaboration workspace.", time: "Yesterday" },
  { icon: "📤", title: "Solution submitted", text: "Your team submitted a solution for Campus Energy Saving.", time: "2 days ago" },
];

function CollaboratorDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [challenges, setChallenges] = useState([]);
  const [solutions, setSolutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [collaborators, setCollaborators] = useState(() => {
    try { return JSON.parse(localStorage.getItem("cc_collaborators")) || seedCollaborators; }
    catch { return seedCollaborators; }
  });
  const [notes, setNotes] = useState(() => {
    try { return JSON.parse(localStorage.getItem("cc_notes")) || []; }
    catch { return []; }
  });
  const [newNote, setNewNote] = useState("");
  const [toast, setToast] = useState("");

  const displayName = user?.profile?.full_name || "Collaborator";
  const organization = user?.profile?.organization || user?.profile?.company || "Your Organization";

  useEffect(() => {
    localStorage.setItem("cc_collaborators", JSON.stringify(collaborators));
  }, [collaborators]);

  useEffect(() => {
    localStorage.setItem("cc_notes", JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [challengeResult, solutionResult] = await Promise.all([
      supabase.from("Challenges").select("*").order("id", { ascending: false }),
      supabase.from("Solution").select("*").order("id", { ascending: false }),
    ]);

    if (!challengeResult.error) setChallenges(challengeResult.data || []);
    if (!solutionResult.error) setSolutions(solutionResult.data || []);
    setLoading(false);
  };

  const filteredChallenges = useMemo(() => {
    const q = search.toLowerCase();
    return challenges.filter((c) =>
      `${c.title || ""} ${c.category || ""} ${c.organization || ""} ${c.skills || ""}`.toLowerCase().includes(q)
    );
  }, [challenges, search]);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(""), 2500);
  };

  const addNote = () => {
    if (!newNote.trim()) return;
    setNotes((prev) => [
      { id: Date.now(), author: displayName, text: newNote.trim(), time: new Date().toLocaleString() },
      ...prev,
    ]);
    setNewNote("");
    showToast("Shared note added");
  };

  const inviteCollaborator = (e) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    const name = inviteEmail.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, (x) => x.toUpperCase());
    setCollaborators((prev) => [...prev, {
      id: Date.now(), name, role: "New Collaborator", org: organization, status: "Invited", initials: name.split(" ").map((x) => x[0]).join("").slice(0, 2),
    }]);
    setInviteEmail("");
    setShowInvite(false);
    showToast("Collaboration invitation created");
  };

  const claimChallenge = async (challenge) => {
    if (!user?.id) { showToast("Please login again before claiming a challenge."); return; }
    try {
      const { data, error } = await supabase.rpc("claim_challenge", {
        p_challenge_id: challenge.id,
        p_collaborator_id: user.id,
      });
      if (error) { console.error(error); showToast(error.message); return; }
      if (data?.success) {
        showToast(data.already_claimed ? "You already claimed this challenge." : "🎉 Challenge claimed successfully!");
        setChallenges(prev => prev.map(item => item.id === challenge.id ? { ...item, claimed_by: user.id, claim_status: "claimed", claimed_at: new Date().toISOString(), participants: Number(item.participants || 0) + (data.already_claimed ? 0 : 1) } : item));
        setSelectedChallenge(null);
      } else showToast(data?.message || "This challenge has already been claimed.");
    } catch (err) { console.error(err); showToast("Unable to claim challenge."); }
  };

  const tabs = [
    ["overview", "▦", "Overview"],
    ["challenges", "◎", "Challenges"],
    ["collaboration", "♧", "Collaboration"],
    ["solutions", "✓", "Solutions"],
  ];

  return (
    <div className="collab-dashboard">
      <nav className="collab-navbar">
        <div className="logo">Challenge<span>Connect</span></div>
        <div className="collab-nav-user">
          <div className="collab-avatar small">{displayName.slice(0, 2).toUpperCase()}</div>
          <div className="collab-user-name"><strong>{displayName}</strong><span>Collaborator</span></div>
          <button onClick={onLogout}>Logout</button>
        </div>
      </nav>

      <div className="collab-layout">
        <aside className="collab-sidebar">
          <div className="collab-profile-mini">
            <div className="collab-avatar">{displayName.slice(0, 2).toUpperCase()}</div>
            <strong>{displayName}</strong>
            <span>{organization}</span>
          </div>
          <div className="collab-menu">
            {tabs.map(([id, icon, label]) => (
              <button key={id} className={activeTab === id ? "active" : ""} onClick={() => setActiveTab(id)}>
                <span>{icon}</span>{label}
              </button>
            ))}
          </div>
          <div className="collab-sidebar-bottom">
            <div className="collab-tip"><span>✨</span><div><strong>Collaborate better</strong><p>Share notes and invite teammates to keep everyone aligned.</p></div></div>
          </div>
        </aside>

        <main className="collab-main">
          <header className="collab-heading">
            <div><p className="dashboard-label">COLLABORATOR WORKSPACE</p><h1>Good to see you, {displayName.split(" ")[0]}.</h1><p>Discover challenges, work with your team, and turn ideas into real-world solutions.</p></div>
            <button className="collab-primary" onClick={() => setShowInvite(true)}>＋ Invite collaborator</button>
          </header>

          <div className="ai-agent-card"><div className="ai-agent-icon">🤖</div><div><span>AI AGENT</span><h3>Smart Challenge Routing</h3><p>AI automatically categorizes challenges so collaborators can quickly find relevant opportunities.</p></div><div className="ai-status">● ACTIVE</div></div>

          {activeTab === "overview" && (
            <>
              <section className="collab-stats">
                <Stat icon="◎" value={challenges.length} label="Available challenges" hint="Live from platform" />
                <Stat icon="🤝" value={collaborators.length} label="Team members" hint="Your workspace" />
                <Stat icon="✓" value={solutions.length} label="Solutions" hint="Submitted on platform" />
                <Stat icon="✦" value={Math.min(challenges.length, 3)} label="Recommended" hint="Based on challenge data" />
              </section>

              <div className="collab-grid-two">
                <section className="collab-panel">
                  <PanelHeader title="Recommended challenges" subtitle="Explore opportunities that could fit your team." action="View all" onClick={() => setActiveTab("challenges")} />
                  {loading ? <Loading /> : challenges.slice(0, 3).map((c) => <ChallengeRow key={c.id} challenge={c} onClick={() => setSelectedChallenge(c)} />)}
                  {!loading && !challenges.length && <Empty text="No challenges available yet." />}
                </section>
                <section className="collab-panel">
                  <PanelHeader title="Recent activity" subtitle="What is happening in your workspace." />
                  {seedActivity.map((a, i) => <div className="activity-row" key={i}><div className="activity-icon">{a.icon}</div><div><strong>{a.title}</strong><p>{a.text}</p><small>{a.time}</small></div></div>)}
                </section>
              </div>

              <section className="collab-panel notes-panel">
                <PanelHeader title="Shared team notes" subtitle="Keep important observations visible to your collaborators." />
                <div className="note-composer"><textarea value={newNote} onChange={(e) => setNewNote(e.target.value)} placeholder="Write an update for your team..." /><button className="collab-primary" onClick={addNote}>Add note</button></div>
                {notes.length ? notes.slice(0, 3).map((n) => <div className="shared-note" key={n.id}><div className="collab-avatar tiny">{n.author.slice(0, 2).toUpperCase()}</div><div><strong>{n.author}</strong><small>{n.time}</small><p>{n.text}</p></div></div>) : <Empty text="No shared notes yet. Add the first team update." />}
              </section>
            </>
          )}

          {activeTab === "challenges" && (
            <section className="collab-panel full-panel">
              <PanelHeader title="Challenge discovery" subtitle={`${filteredChallenges.length} challenge${filteredChallenges.length === 1 ? "" : "s"} available`} />
              <div className="collab-search"><span>⌕</span><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by title, category, organization or skill..." /></div>
              <div className="collab-challenge-grid">
                {filteredChallenges.map((c) => <ChallengeCard key={c.id} challenge={c} onClick={() => setSelectedChallenge(c)} />)}
              </div>
              {!filteredChallenges.length && <Empty text="No matching challenges found." />}
            </section>
          )}

          {activeTab === "collaboration" && (
            <section className="collab-panel full-panel">
              <PanelHeader title="Your collaboration team" subtitle="Manage the people working with you on ChallengeConnect." action="＋ Add member" onClick={() => setShowInvite(true)} />
              <div className="member-grid">{collaborators.map((c) => <div className="member-card" key={c.id}><div className="collab-avatar">{c.initials}</div><div className="member-info"><strong>{c.name}</strong><span>{c.role}</span><small>{c.org}</small></div><span className={`status ${c.status.toLowerCase()}`}>● {c.status}</span></div>)}</div>
              <div className="collab-collab-banner"><div><span>🤝</span><div><h3>One workspace, shared progress</h3><p>Use shared notes and activity updates to coordinate your next solution.</p></div></div><button className="collab-secondary" onClick={() => setActiveTab("overview")}>Back to overview</button></div>
            </section>
          )}

          {activeTab === "solutions" && (
            <section className="collab-panel full-panel">
              <PanelHeader title="Submitted solutions" subtitle={`${solutions.length} solution${solutions.length === 1 ? "" : "s"} found in the platform database.`} />
              {solutions.length ? <div className="solution-list">{solutions.map((s) => <div className="solution-row" key={s.id}><div className="solution-icon">✓</div><div><strong>{s.solution_title || "Untitled solution"}</strong><p>{s.team_name || "Team"} · {s.technology_used || "Technology not specified"}</p></div><span className="status submitted">Submitted</span></div>)}</div> : <Empty text="No solutions have been submitted yet." />}
            </section>
          )}
        </main>
      </div>

      {showInvite && <div className="modal-backdrop" onClick={() => setShowInvite(false)}><div className="collab-modal" onClick={(e) => e.stopPropagation()}><button className="modal-close" onClick={() => setShowInvite(false)}>×</button><p className="dashboard-label">TEAM MANAGEMENT</p><h2>Invite a collaborator</h2><p>Add a teammate to your ChallengeConnect workspace.</p><form onSubmit={inviteCollaborator}><label>Email address</label><input autoFocus type="email" required value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} placeholder="teammate@example.com" /><div className="modal-actions"><button type="button" className="collab-secondary" onClick={() => setShowInvite(false)}>Cancel</button><button className="collab-primary" type="submit">Send invite</button></div></form></div></div>}

      {selectedChallenge && <div className="modal-backdrop" onClick={() => setSelectedChallenge(null)}><div className="collab-modal challenge-modal" onClick={(e) => e.stopPropagation()}><button className="modal-close" onClick={() => setSelectedChallenge(null)}>×</button><span className="category-badge">{selectedChallenge.category || "Challenge"}</span><h2>{selectedChallenge.title || "Untitled challenge"}</h2><p className="modal-org">🏢 {selectedChallenge.organization || "Organization"}</p><p>{selectedChallenge.description || "No description available."}</p><div className="modal-details"><span><b>Difficulty</b>{selectedChallenge.difficulty || "Not specified"}</span><span><b>Skills</b>{Array.isArray(selectedChallenge.skills) ? selectedChallenge.skills.join(", ") : selectedChallenge.skills || "Not specified"}</span><span><b>Participants</b>{selectedChallenge.participants ?? 0}</span></div>{selectedChallenge.claimed_by ? (
          <div className="claimed-banner">🔒 This challenge has already been claimed.</div>
        ) : (
          <button className="collab-primary full-btn" onClick={() => claimChallenge(selectedChallenge)}>
            🚀 Claim Challenge — First Come, First Served
          </button>
        )}</div></div>}
      {toast && <div className="collab-toast">✓ {toast}</div>}
    </div>
  );
}

function Stat({ icon, value, label, hint }) { return <div className="collab-stat"><div className="stat-icon">{icon}</div><div><strong>{value}</strong><p>{label}</p><small>{hint}</small></div></div>; }
function PanelHeader({ title, subtitle, action, onClick }) { return <div className="collab-panel-header"><div><h2>{title}</h2><p>{subtitle}</p></div>{action && <button className="text-action" onClick={onClick}>{action} →</button>}</div>; }
function ChallengeRow({ challenge, onClick }) { return <button className="challenge-row" onClick={onClick}><div className="challenge-row-icon">◎</div><div><strong>{challenge.title || "Untitled challenge"}</strong><p>{challenge.organization || "Organization"} · {challenge.category || "General"}</p></div><span>→</span></button>; }
function ChallengeCard({ challenge, onClick }) { return <article className="collab-challenge-card"><div className="card-top"><span className="category-badge">{challenge.category || "General"}</span><span>{challenge.difficulty || "Open"}</span></div><h3>{challenge.title || "Untitled challenge"}</h3><p>{challenge.description || "No description available."}</p><div className="card-meta"><span>🏢 {challenge.organization || "Organization"}</span><span>👥 {challenge.participants ?? 0}</span></div>{challenge.claimed_by ? <div className="challenge-claimed">🔒 Already Claimed</div> : <button className="details-button" onClick={onClick}>🚀 View & Claim →</button>}</article>; }
function Loading() { return <div className="collab-loading">Loading live platform data...</div>; }
function Empty({ text }) { return <div className="collab-empty">{text}</div>; }

export default CollaboratorDashboard;
