# PathMentor AI 🎓

### Integrated E-Learning and Mentorship Platform

PathMentor AI is an integrated e-learning and mentorship platform
designed to help learners progress through structured learning paths
while connecting them with mentors and learning resources.

---

## 🎯 Problem

Many learners struggle to find a clear learning path, track their
progress, practice through real projects, and receive guidance when
they face difficulties.

Learning resources are often scattered across different platforms,
making it difficult for learners to understand what to learn next.

---

## 💡 Solution

PathMentor AI brings structured learning, practical projects,
quizzes, progress tracking, and mentorship into one platform.

The system organizes learning into progressive levels so that
learners can move from basic awareness toward advanced mastery.

---

## ✨ Key Features

### 👨‍🎓 Student

- Structured learning paths
- Courses and lessons
- Video learning resources
- Practical projects
- Quizzes and assessments
- Progress tracking
- XP and learning streaks
- Achievement tracking
- Learning analytics
- Mentor interaction

### 👨‍🏫 Mentor

- Mentor profile
- Student support
- Learning guidance
- Course and learning-content support
- Certificate upload

### 🛡️ Admin

- User management
- Student and mentor management
- Course management
- Learning-content management
- Platform monitoring
- Dashboard and analytics

---

## 🤖 AI Features

PathMentor AI includes AI-assisted features designed to support
the learning experience.

- AI learning chatbot
- Content summarization
- Learning recommendations
- Content-based recommendations
- Rule-based learning guidance

---

## 🏗️ System Architecture

The project follows a client-server architecture.

```text
┌─────────────────────────┐
│       React Frontend    │
│     TypeScript + Vite   │
└────────────┬────────────┘
             │
             │ REST API
             ▼
┌─────────────────────────┐
│      Express Backend    │
│        Node.js          │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│       MongoDB Atlas     │
│         Database        │
└─────────────────────────┘
