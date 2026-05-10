const mongoose = require("mongoose");
require("dotenv").config();

const User = require("./models/User");
const Course = require("./models/Course");
const Level = require("./models/Level");
const Lesson = require("./models/Lesson");
const Quiz = require("./models/Quiz");
const Progress = require("./models/Progress");
const Achievement = require("./models/Achievement");
const Session = require("./models/Session");
const Message = require("./models/Message");
const Match = require("./models/Match");
const Announcement = require("./models/Announcement");

const TARGET_EMAIL = "ermametest@gmail.com";

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ Connected to MongoDB");

  // ── Find target student ──────────────────────────────────────────
  const student = await User.findOne({ email: TARGET_EMAIL });
  if (!student) { console.error("❌ User not found"); process.exit(1); }
  console.log(`✅ Found student: ${student.name} (${student._id})`);

  // ── Find or create a mentor ──────────────────────────────────────
  let mentor = await User.findOne({ role: "mentor", "mentorVerification.status": "approved" });
  if (!mentor) {
    const bcrypt = require("bcryptjs");
    const hash = await bcrypt.hash("Mentor@1234", 10);
    mentor = await User.create({
      name: "Abebe Girma",
      email: "abebe.mentor@pathmentor.et",
      password: hash,
      role: "mentor",
      mentorVerification: { status: "approved" },
      onboardingCompleted: true,
      learningProfile: {
        skillTrack: "full_stack",
        experienceLevel: "mastery",
        persona: "architect",
      },
    });
    console.log("✅ Created mentor: Abebe Girma");
  } else {
    console.log(`✅ Using existing mentor: ${mentor.name}`);
  }

  // ── Find or create admin ─────────────────────────────────────────
  let admin = await User.findOne({ role: "admin" });
  if (!admin) {
    const bcrypt = require("bcryptjs");
    const hash = await bcrypt.hash("Admin@1234", 10);
    admin = await User.create({
      name: "Tigist Admin",
      email: "admin@pathmentor.et",
      password: hash,
      role: "admin",
      onboardingCompleted: true,
    });
    console.log("✅ Created admin: Tigist Admin");
  }

  // ── Clean old seed data for this student ────────────────────────
  await Progress.deleteMany({ user: student._id });
  await Achievement.deleteMany({ user: student._id });
  await Session.deleteMany({ studentId: student._id });
  await Message.deleteMany({ sender: student._id });
  await Match.deleteMany({ student1: student._id });
  console.log("🧹 Cleaned old seed data");

  // ════════════════════════════════════════════════════════════════
  // COURSES — Ethiopia-themed Full Stack curriculum
  // ════════════════════════════════════════════════════════════════
  const courseData = [
    {
      title: "Habesha Full Stack Bootcamp",
      description: "A complete full-stack web development course built for Ethiopian developers. From HTML to deploying on AWS.",
      category: "full_stack",
    },
    {
      title: "Addis Ababa React Mastery",
      description: "Master React.js with real-world Ethiopian business case studies — e-commerce, fintech, and agri-tech apps.",
      category: "full_stack",
    },
    {
      title: "Ethiopian Backend Engineering",
      description: "Node.js, Express, MongoDB backend development with Ethiopian payment gateway integrations.",
      category: "full_stack",
    },
  ];

  const courses = [];
  for (const cd of courseData) {
    let course = await Course.findOne({ title: cd.title });
    if (!course) {
      course = await Course.create({ ...cd, createdBy: mentor._id });
      console.log(`✅ Created course: ${cd.title}`);
    } else {
      console.log(`⏭️  Course exists: ${cd.title}`);
    }
    courses.push(course);
  }

  const mainCourse = courses[0];

  // ════════════════════════════════════════════════════════════════
  // LEVELS — 7 levels per course (Awareness → Mastery)
  // ════════════════════════════════════════════════════════════════
  const levelTitles = ["Awareness", "Beginner", "Fundamental", "Intermediate", "Advanced", "Proficient", "Mastery"];

  const allLevels = [];
  for (const course of courses) {
    const existingLevels = await Level.find({ course: course._id });
    if (existingLevels.length === 7) {
      allLevels.push(...existingLevels);
      console.log(`⏭️  Levels exist for: ${course.title}`);
      continue;
    }
    await Level.deleteMany({ course: course._id });
    const created = await Level.insertMany(
      levelTitles.map((title, i) => ({ title, order: i + 1, course: course._id }))
    );
    allLevels.push(...created);
    console.log(`✅ Created 7 levels for: ${course.title}`);
  }

  // ════════════════════════════════════════════════════════════════
  // LESSONS — Ethiopia-themed lessons per level (main course)
  // ════════════════════════════════════════════════════════════════
  const mainCourseLevels = allLevels.filter(l => l.course.toString() === mainCourse._id.toString());

  const lessonsByLevel = [
    // Awareness
    [
      { title: "What is the Internet? — Yetewasabewe Meret", description: "Understanding how the web works from an Ethiopian context.", content: "The internet connects computers globally. In Ethiopia, Ethio Telecom provides the backbone infrastructure..." },
      { title: "How Websites Work — Ye Website Timhirt", description: "HTML, CSS, JS overview with Amharic analogies.", content: "A website is like a tej bet menu — HTML is the structure, CSS is the decoration, JS is the waiter..." },
      { title: "Setting Up Your Dev Environment", description: "Install VS Code, Node.js, Git on your machine.", content: "Download VS Code from code.visualstudio.com. Install Node.js LTS version..." },
    ],
    // Beginner
    [
      { title: "HTML Fundamentals — Ye HTML Timhirt", description: "Tags, elements, attributes with Ethiopian examples.", content: "Build a simple page about Lalibela rock churches using HTML..." },
      { title: "CSS Styling — Ye CSS Timhirt", description: "Colors, fonts, layout basics.", content: "Style your Lalibela page with Ethiopian flag colors: green, yellow, red..." },
      { title: "JavaScript Basics — Ye JS Timhirt", description: "Variables, functions, loops.", content: "Write a function that counts injera pieces on a plate..." },
      { title: "Git & GitHub for Ethiopian Devs", description: "Version control basics.", content: "git init, git add, git commit — track your code like tracking teff harvest records..." },
    ],
    // Fundamental
    [
      { title: "React Introduction — Ye React Timhirt", description: "Components, JSX, props.", content: "Build a component that displays Ethiopian coffee ceremony steps..." },
      { title: "State Management with useState", description: "Managing component state.", content: "Build a tej counter app using useState hook..." },
      { title: "React Router — Navigation", description: "Multi-page React apps.", content: "Build a navigation for an Ethiopian restaurant app..." },
      { title: "Fetching Data with useEffect", description: "API calls in React.", content: "Fetch Ethiopian coffee prices from a mock API..." },
    ],
    // Intermediate
    [
      { title: "Node.js & Express — Backend Basics", description: "Build REST APIs.", content: "Create an API for an Ethiopian marketplace — list injera sellers..." },
      { title: "MongoDB with Mongoose", description: "NoSQL database design.", content: "Design a schema for Ethiopian farmers market data..." },
      { title: "Authentication — JWT & bcrypt", description: "Secure login systems.", content: "Build login for an Ethiopian fintech app using JWT..." },
      { title: "File Uploads — Multer", description: "Handle file uploads.", content: "Allow Ethiopian merchants to upload product images..." },
    ],
    // Advanced
    [
      { title: "Full Stack Integration", description: "Connect React frontend to Node backend.", content: "Build a full-stack Ethiopian e-commerce app..." },
      { title: "Real-time Chat with Socket.io", description: "WebSocket communication.", content: "Build a real-time chat for Ethiopian developer community..." },
      { title: "Payment Integration — Chapa API", description: "Ethiopian payment gateway.", content: "Integrate Chapa payment gateway for Ethiopian birr transactions..." },
    ],
    // Proficient
    [
      { title: "Deployment on AWS / Render", description: "Deploy your app to production.", content: "Deploy your Ethiopian marketplace app to Render..." },
      { title: "Performance Optimization", description: "Speed up your React app.", content: "Optimize image loading for Ethiopian product photos..." },
      { title: "Testing with Jest", description: "Unit and integration tests.", content: "Write tests for your Ethiopian marketplace API..." },
    ],
    // Mastery
    [
      { title: "System Design — Ethiopian Scale", description: "Design systems for millions of users.", content: "Design a system like Telebirr that handles millions of Ethiopian users..." },
      { title: "Capstone Project — Build for Ethiopia", description: "Build a real product for Ethiopian market.", content: "Build a complete product: Ethiopian job board, agri-tech app, or fintech solution..." },
    ],
  ];

  const allLessons = [];
  for (let i = 0; i < mainCourseLevels.length; i++) {
    const level = mainCourseLevels[i];
    const levelLessons = lessonsByLevel[i] || [];

    const existing = await Lesson.find({ level: level._id });
    if (existing.length > 0) {
      allLessons.push(...existing);
      console.log(`⏭️  Lessons exist for level: ${level.title}`);
      continue;
    }

    const created = await Lesson.insertMany(
      levelLessons.map((l, j) => ({
        ...l,
        level: level._id,
        course: mainCourse._id,
        order: j + 1,
        createdBy: mentor._id,
        videoUrl: `https://www.youtube.com/watch?v=ethiopian_dev_${i}_${j}`,
      }))
    );
    allLessons.push(...created);
    console.log(`✅ Created ${created.length} lessons for level: ${level.title}`);
  }

  // ════════════════════════════════════════════════════════════════
  // QUIZZES — per lesson (first 2 levels)
  // ════════════════════════════════════════════════════════════════
  const quizTemplates = [
    {
      questions: [
        { question: "What does HTML stand for?", options: ["HyperText Markup Language", "High Tech Modern Language", "Habesha Text Markup", "HyperText Modern Layout"], correctAnswer: 0 },
        { question: "Which Ethiopian city is known as the 'Silicon Valley of Africa'?", options: ["Hawassa", "Addis Ababa", "Dire Dawa", "Bahir Dar"], correctAnswer: 1 },
        { question: "What is the purpose of CSS?", options: ["Database management", "Styling web pages", "Server logic", "Version control"], correctAnswer: 1 },
      ],
    },
    {
      questions: [
        { question: "Which hook manages state in React?", options: ["useEffect", "useContext", "useState", "useRef"], correctAnswer: 2 },
        { question: "What is Chapa?", options: ["Ethiopian food", "Ethiopian payment gateway", "A React library", "A database"], correctAnswer: 1 },
        { question: "What does API stand for?", options: ["Application Programming Interface", "Addis Programming Integration", "Automated Process Interface", "Application Process Index"], correctAnswer: 0 },
      ],
    },
  ];

  for (let i = 0; i < Math.min(allLessons.length, 6); i++) {
    const lesson = allLessons[i];
    const existing = await Quiz.findOne({ lesson: lesson._id });
    if (!existing) {
      await Quiz.create({ lesson: lesson._id, questions: quizTemplates[i % 2].questions });
      console.log(`✅ Created quiz for lesson: ${lesson.title}`);
    }
  }

  // ════════════════════════════════════════════════════════════════
  // PROGRESS — student has completed first 2 levels
  // ════════════════════════════════════════════════════════════════
  const awarenessLevel = mainCourseLevels[0];
  const beginnerLevel = mainCourseLevels[1];
  const fundamentalLevel = mainCourseLevels[2];

  const awarenessLessons = allLessons.filter(l => l.level.toString() === awarenessLevel._id.toString());
  const beginnerLessons = allLessons.filter(l => l.level.toString() === beginnerLevel._id.toString());
  const fundamentalLessons = allLessons.filter(l => l.level.toString() === fundamentalLevel._id.toString());

  const progress = await Progress.create({
    user: student._id,
    course: mainCourse._id,
    xpEarned: 285,
    levelsProgress: [
      {
        level: awarenessLevel._id,
        completedLessons: awarenessLessons.map(l => l._id),
        score: 95,
        isCompleted: true,
      },
      {
        level: beginnerLevel._id,
        completedLessons: beginnerLessons.map(l => l._id),
        score: 88,
        isCompleted: true,
      },
      {
        level: fundamentalLevel._id,
        completedLessons: fundamentalLessons.slice(0, 2).map(l => l._id),
        score: 0,
        isCompleted: false,
      },
    ],
  });
  console.log(`✅ Created progress: ${progress.xpEarned} XP, 2 levels completed`);

  // ════════════════════════════════════════════════════════════════
  // ACHIEVEMENTS
  // ════════════════════════════════════════════════════════════════
  const achievementData = [
    { title: "First Step", description: "Completed your first lesson", icon: "🎯" },
    { title: "Fast Learner", description: "Completed 5 lessons", icon: "⚡" },
    { title: "Level Up", description: "Completed your first level", icon: "🏆" },
    { title: "Level Master", description: "Completed 3 levels", icon: "👑" },
    { title: "High Performer", description: "Scored 90% or more in a level", icon: "🌟" },
    { title: "XP Starter", description: "Earned 100 XP", icon: "💎" },
    { title: "Habesha Coder", description: "Joined PathMentor as an Ethiopian developer", icon: "🇪🇹" },
  ];

  await Achievement.insertMany(
    achievementData.map(a => ({ ...a, user: student._id, earnedAt: new Date() }))
  );
  console.log(`✅ Created ${achievementData.length} achievements`);

  // ════════════════════════════════════════════════════════════════
  // SESSIONS — past + upcoming
  // ════════════════════════════════════════════════════════════════
  const sessionData = [
    {
      studentId: student._id,
      mentorId: mentor._id,
      date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      status: "scheduled",
      meetingLink: "https://meet.google.com/eth-dev-session-1",
      summary: null,
      feedback: null,
    },
    {
      studentId: student._id,
      mentorId: mentor._id,
      date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      status: "scheduled",
      meetingLink: "https://meet.google.com/eth-dev-session-2",
      summary: null,
      feedback: null,
    },
    {
      studentId: student._id,
      mentorId: mentor._id,
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      status: "completed",
      meetingLink: "https://meet.google.com/eth-dev-past-1",
      summary: "Reviewed React hooks and state management. Ermias showed great understanding of useEffect. Next session: cover Node.js basics.",
      feedback: "Excellent progress! Keep building small projects daily.",
    },
    {
      studentId: student._id,
      mentorId: mentor._id,
      date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
      status: "completed",
      meetingLink: "https://meet.google.com/eth-dev-past-2",
      summary: "Covered HTML/CSS fundamentals. Built a simple Ethiopian restaurant landing page.",
      feedback: "Good foundation. Focus on CSS flexbox and grid next.",
    },
    {
      studentId: student._id,
      mentorId: mentor._id,
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      status: "cancelled",
      meetingLink: "https://meet.google.com/eth-dev-cancelled",
      summary: null,
      feedback: null,
    },
  ];

  await Session.insertMany(sessionData);
  console.log(`✅ Created ${sessionData.length} sessions`);

  // ════════════════════════════════════════════════════════════════
  // MESSAGES — chat room between student and mentor
  // ════════════════════════════════════════════════════════════════
  const roomId = `room_${student._id}_${mentor._id}`;
  const messageData = [
    { sender: mentor._id, roomId, message: "Selam Ermias! Welcome to PathMentor. I'm Abebe, your mentor for the Full Stack Bootcamp. 🇪🇹" },
    { sender: student._id, roomId, message: "Selam Abebe! Thank you so much. I'm excited to start learning!" },
    { sender: mentor._id, roomId, message: "Great! Start with the Awareness level. It covers internet basics. Let me know if you have questions." },
    { sender: student._id, roomId, message: "I finished the Awareness level! The Lalibela HTML exercise was really fun 😄" },
    { sender: mentor._id, roomId, message: "Excellent work! 🎉 Your score was 95%. Now move to the Beginner level — focus on CSS flexbox." },
    { sender: student._id, roomId, message: "Quick question — how do I center a div in CSS? 😅" },
    { sender: mentor._id, roomId, message: "Classic question! Use: display: flex; justify-content: center; align-items: center; on the parent element." },
    { sender: student._id, roomId, message: "That worked! Thank you Abebe. Ameseginalehu! 🙏" },
    { sender: mentor._id, roomId, message: "Yikerta! Keep going. Our next session is in 2 days — we'll cover React hooks together." },
    { sender: student._id, roomId, message: "Looking forward to it! I'll prepare by reading the React docs first." },
  ];

  await Message.insertMany(messageData);
  console.log(`✅ Created ${messageData.length} messages in room: ${roomId}`);

  // ════════════════════════════════════════════════════════════════
  // MATCH — student matched to mentor
  // ════════════════════════════════════════════════════════════════
  await Match.create({
    student1: student._id,
    student2: mentor._id,
    track: "full_stack",
    level: "beginner",
  });
  console.log(`✅ Created mentor match`);

  // ════════════════════════════════════════════════════════════════
  // ANNOUNCEMENTS
  // ════════════════════════════════════════════════════════════════
  const announcementData = [
    {
      title: "🇪🇹 Ethiopian Developers Hackathon 2025",
      message: "PathMentor is hosting a hackathon for Ethiopian developers! Build a solution for local problems. Prize: 50,000 ETB. Register by May 30.",
      createdBy: admin._id,
      role: "admin",
      course: mainCourse._id,
    },
    {
      title: "New Course: Chapa Payment Integration",
      message: "We've added a new module on integrating Chapa — Ethiopia's leading payment gateway — into your full-stack apps.",
      createdBy: mentor._id,
      role: "mentor",
      course: mainCourse._id,
    },
    {
      title: "Live Session: React with Abebe Girma",
      message: "Join our live coding session this Saturday at 3PM EAT. We'll build a real-time Ethiopian job board using React and Socket.io.",
      createdBy: mentor._id,
      role: "mentor",
      course: mainCourse._id,
    },
    {
      title: "Platform Update — AI Features Live",
      message: "AI-powered skill gap analysis and learning path recommendations are now live! Check your dashboard for personalized insights.",
      createdBy: admin._id,
      role: "admin",
    },
  ];

  for (const a of announcementData) {
    const exists = await Announcement.findOne({ title: a.title });
    if (!exists) {
      await Announcement.create(a);
      console.log(`✅ Created announcement: ${a.title}`);
    }
  }

  // ════════════════════════════════════════════════════════════════
  // UPDATE student learningProfile with course reference
  // ════════════════════════════════════════════════════════════════
  await User.findByIdAndUpdate(student._id, {
    "learningProfile.course": { id: mainCourse._id, title: mainCourse.title },
    "learningProfile.courseLevel": "Fundamental",
    "learningProfile.strengths": ["Problem Solving", "Visual Learning", "Consistency"],
    "learningProfile.recommendation": "Focus on React fundamentals and build 2 small projects before moving to backend. Your visual learning style means video tutorials will accelerate your progress.",
  });
  console.log(`✅ Updated student learningProfile with course reference`);

  // ════════════════════════════════════════════════════════════════
  // SUMMARY
  // ════════════════════════════════════════════════════════════════
  console.log("\n════════════════════════════════════════");
  console.log("🇪🇹 SEED COMPLETE — Ethiopia Looks Data");
  console.log("════════════════════════════════════════");
  console.log(`Student     : ${student.name} (${student.email})`);
  console.log(`Mentor      : ${mentor.name}`);
  console.log(`Courses     : ${courses.length}`);
  console.log(`Levels      : ${allLevels.length}`);
  console.log(`Lessons     : ${allLessons.length}`);
  console.log(`XP Earned   : 285`);
  console.log(`Achievements: ${achievementData.length}`);
  console.log(`Sessions    : ${sessionData.length}`);
  console.log(`Messages    : ${messageData.length}`);
  console.log(`Room ID     : ${roomId}`);
  console.log("════════════════════════════════════════\n");

  await mongoose.disconnect();
}

seed().catch(err => {
  console.error("❌ Seed failed:", err);
  mongoose.disconnect();
  process.exit(1);
});
