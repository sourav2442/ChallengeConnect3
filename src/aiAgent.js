const CATEGORY_KEYWORDS = {
  Agriculture: ["agriculture","agricultural","farmer","farming","crop","crops","irrigation","soil","harvest","fertilizer","pesticide","livestock","farm"],
  Environment: ["environment","waste","garbage","recycling","pollution","plastic","climate","carbon","sustainability","conservation"],
  Healthcare: ["health","healthcare","hospital","doctor","patient","medical","disease","medicine","diagnosis","mental health"],
  Education: ["education","school","student","teacher","learning","college","university","classroom","exam","training","literacy"],
  Energy: ["energy","electricity","solar","power","renewable","battery","electric vehicle","ev","grid","consumption"],
  Transportation: ["traffic","transport","transportation","vehicle","road","bus","railway","metro","mobility","parking","congestion"],
  Technology: ["software","website","web","app","application","artificial intelligence","ai","machine learning","blockchain","cybersecurity","iot","cloud","database","robot","automation"]
};

const SKILLS = {
  AI: ["ai","artificial intelligence","machine learning"],
  IoT: ["iot","internet of things","sensor"],
  "Data Science": ["data science","analytics","data"],
  "Web Development": ["website","web","frontend","backend","react"],
  "Mobile Development": ["mobile","android","ios"],
  "Computer Vision": ["image","computer vision","camera","drone"],
  Electronics: ["electronics","hardware","circuit"],
  Robotics: ["robot","robotics","automation"],
  "Cloud Computing": ["cloud","aws","azure"],
  Cybersecurity: ["security","cybersecurity","cyber"]
};

const normalize = (value) => String(value || "").toLowerCase().replace(/[^\w\s-]/g, " ");

export function categorizeChallenge({ title = "", description = "", skills = "" }) {
  const text = normalize(`${title} ${description} ${skills}`);
  const scores = Object.fromEntries(Object.keys(CATEGORY_KEYWORDS).map((category) => [category, 0]));

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    for (const keyword of keywords) {
      if (text.includes(keyword)) scores[category] += keyword.split(" ").length * 2;
    }
  }

  const ranked = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const [category, score] = ranked[0];
  if (!score) return { category: "Other", confidence: 0.35 };
  const second = ranked[1]?.[1] || 0;
  const confidence = score >= second + 4 ? 0.9 : score > second ? 0.78 : 0.65;
  return { category, confidence };
}

export function suggestSkills({ title = "", description = "", skills = "" }) {
  const text = normalize(`${title} ${description} ${skills}`);
  return Object.entries(SKILLS)
    .filter(([, keywords]) => keywords.some((keyword) => text.includes(keyword)))
    .map(([skill]) => skill);
}

export default categorizeChallenge;
