# PathMentor AI - System Flow Diagram

## 🎯 Complete User Journey

```
┌─────────────────────────────────────────────────────────────────────┐
│                         PATHMENTOR AI                               │
│                    E-Learning Platform Flow                         │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                      1. USER REGISTRATION                           │
└─────────────────────────────────────────────────────────────────────┘

    [Landing Page]
         │
         ├─→ Click "Get Started"
         │
    [Auth Page]
         │
         ├─→ Fill Form:
         │   • Name
         │   • Email
         │   • Password
         │   • Role: Student/Mentor
         │
         ├─→ Click "Create Account"
         │
    [Backend: POST /api/auth/register]
         │
         ├─→ Validate input
         ├─→ Hash password
         ├─→ Create user in DB
         ├─→ Generate JWT token
         │
         └─→ Redirect to Onboarding

┌─────────────────────────────────────────────────────────────────────┐
│                      2. ONBOARDING FLOW                             │
└─────────────────────────────────────────────────────────────────────┘

    [Register Page - Step 1]
         │
         ├─→ Select Skill Track
         │   Options:
         │   • AI and Machine Learning
         │   • Web Development
         │   • Data Science
         │   • Mobile Development
         │   • Cloud Computing
         │
    [Step 2]
         │
         ├─→ Select Experience Level
         │   • Beginner
         │   • Intermediate
         │   • Advanced
         │
    [Step 3]
         │
         ├─→ Select Commitment Time
         │   • 30 min/day
         │   • 1-2 hours/day
         │   • 3+ hours/day
         │
    [Step 4]
         │
         ├─→ Select Learning Style
         │   • Visual
         │   • Auditory
         │   • Reading/Writing
         │   • Kinesthetic
         │
    [Step 5]
         │
         ├─→ Select Learning Goal
         │   • Career Change
         │   • Skill Enhancement
         │   • Academic
         │   • Personal Interest
         │
    [Step 6]
         │
         ├─→ Write Personal Goal
         │   (Free text input)
         │
    [Step 7]
         │
         ├─→ AI Generates Persona
         │   • Analyzes all inputs
         │   • Creates personalized profile
         │   • Shows strengths
         │   • Provides recommendations
         │
         └─→ Click "Complete Profile"

┌─────────────────────────────────────────────────────────────────────┐
│                   3. AUTO-COURSE ASSIGNMENT                         │
└─────────────────────────────────────────────────────────────────────┘

    [Backend: POST /api/users/onboarding]
         │
         ├─→ Receive onboarding data
         │
         ├─→ Search for matching course:
         │   
         │   const course = await Course.findOne({
         │     $or: [
         │       { title: /AI and Machine Learning/i },
         │       { category: /AI and Machine Learning/i }
         │     ]
         │   });
         │
         ├─→ If course found:
         │   │
         │   ├─→ Assign to user profile:
         │   │   user.learningProfile.course = {
         │   │     id: course._id,
         │   │     title: course.title
         │   │   }
         │   │
         │   ├─→ Create Progress record:
         │   │   await Progress.create({
         │   │     user: user._id,
         │   │     course: course._id,
         │   │     levelsProgress: [],
         │   │     xpEarned: 0
         │   │   })
         │   │
         │   └─→ Assign mentor:
         │       await assignMentor(user)
         │
         ├─→ If no course found:
         │   └─→ User can browse manually later
         │
         └─→ Return success response

┌─────────────────────────────────────────────────────────────────────┐
│                      4. DASHBOARD VIEW                              │
└─────────────────────────────────────────────────────────────────────┘

    [Dashboard Page]
         │
         ├─→ Fetch user profile:
         │   GET /api/users/profile
         │
         ├─→ Display components:
         │   
         │   ┌─────────────────────────────────────┐
         │   │ Welcome Section                     │
         │   │ "Welcome back, Jane!"               │
         │   └─────────────────────────────────────┘
         │   
         │   ┌─────────────────────────────────────┐
         │   │ Smart Reminder                      │
         │   │ "Continue your learning streak!"    │
         │   └─────────────────────────────────────┘
         │   
         │   ┌─────────────────────────────────────┐
         │   │ Stats Grid                          │
         │   │ In Progress | Completed | Daily Goal│
         │   └─────────────────────────────────────┘
         │   
         │   ┌─────────────────────────────────────┐
         │   │ Progress Hero Card                  │
         │   │                                     │
         │   │    ┌─────┐                          │
         │   │    │ 70% │  Current Stage           │
         │   │    └─────┘  Beginner                │
         │   │                                     │
         │   │    5 Completed | 20 Remaining       │
         │   │                                     │
         │   │    ┌─────────────────────┐          │
         │   │    │ ▶ Start Learning    │ ← KEY!  │
         │   │    └─────────────────────┘          │
         │   └─────────────────────────────────────┘
         │   
         │   ┌─────────────────────────────────────┐
         │   │ Assigned Mentor Card                │
         │   │ John Mentor | AI & ML Specialist    │
         │   │ [Book Session] [Message]            │
         │   └─────────────────────────────────────┘
         │
         └─→ User clicks "Start Learning"

┌─────────────────────────────────────────────────────────────────────┐
│                   5. SMART NAVIGATION                               │
└─────────────────────────────────────────────────────────────────────┘

    [Start Learning Button Clicked]
         │
         ├─→ Check if enrolled:
         │   
         │   if (user.learningProfile.course.id) {
         │     navigate("/lessons");  ← Has course
         │   } else {
         │     navigate("/courses");  ← No course
         │   }
         │
         ├─→ SCENARIO A: Has Course
         │   └─→ Go to Lessons Page
         │
         └─→ SCENARIO B: No Course
             └─→ Go to Browse Courses Page

┌─────────────────────────────────────────────────────────────────────┐
│                   6A. LESSONS PAGE (Enrolled)                       │
└─────────────────────────────────────────────────────────────────────┘

    [Lessons Page]
         │
         ├─→ Fetch course roadmap:
         │   GET /api/courses/:id/roadmap
         │
         ├─→ Display course structure:
         │   
         │   ┌─────────────────────────────────────┐
         │   │ AI and Machine Learning             │
         │   │ 7 levels from Awareness to Mastery  │
         │   └─────────────────────────────────────┘
         │   
         │   ┌─────────────────────────────────────┐
         │   │ Level 1: Awareness      [UNLOCKED]  │
         │   │ Progress: ████████░░░░░░ 40%        │
         │   │ ┌─────────────────────────────────┐ │
         │   │ │ ▶ Lesson 1: Intro to AI         │ │
         │   │ │ ▶ Lesson 2: History of AI       │ │
         │   │ │ ✓ Lesson 3: AI Applications     │ │
         │   │ └─────────────────────────────────┘ │
         │   └─────────────────────────────────────┘
         │   
         │   ┌─────────────────────────────────────┐
         │   │ Level 2: Beginner       [LOCKED]    │
         │   │ 🔒 Complete Level 1 to unlock       │
         │   └─────────────────────────────────────┘
         │   
         │   ... (Levels 3-7)
         │
         └─→ User clicks on a lesson

┌─────────────────────────────────────────────────────────────────────┐
│                   7. LESSON DETAIL VIEW                             │
└─────────────────────────────────────────────────────────────────────┘

    [Lesson Detail Page]
         │
         ├─→ Display lesson content:
         │   
         │   ┌─────────────────────────────────────┐
         │   │ Introduction to AI                  │
         │   │ [Mark Complete]                     │
         │   └─────────────────────────────────────┘
         │   
         │   ┌─────────────────────────────────────┐
         │   │ Video Player                        │
         │   │ [YouTube Embed]                     │
         │   └─────────────────────────────────────┘
         │   
         │   ┌─────────────────────────────────────┐
         │   │ Text Content                        │
         │   │ (HTML formatted)                    │
         │   └─────────────────────────────────────┘
         │   
         │   ┌─────────────────────────────────────┐
         │   │ Lesson Quiz                         │
         │   │ [Start Quiz]                        │
         │   └─────────────────────────────────────┘
         │
         ├─→ User completes lesson:
         │   POST /api/progress/lesson/:id/complete
         │
         ├─→ User takes quiz:
         │   │
         │   ├─→ Answer questions
         │   ├─→ Submit quiz
         │   ├─→ Calculate score
         │   │
         │   └─→ If score ≥ 80%:
         │       └─→ Unlock next level
         │
         └─→ Return to lessons list

┌─────────────────────────────────────────────────────────────────────┐
│                6B. BROWSE COURSES (No Auto-Match)                   │
└─────────────────────────────────────────────────────────────────────┘

    [Browse Courses Page]
         │
         ├─→ Fetch all courses:
         │   GET /api/courses
         │
         ├─→ Display course catalog:
         │   
         │   ┌─────────────────────────────────────┐
         │   │ 🔍 Search courses...                │
         │   │ [All] [AI] [Web] [Data Science]    │
         │   └─────────────────────────────────────┘
         │   
         │   ┌───────────┐ ┌───────────┐ ┌───────────┐
         │   │ AI & ML   │ │ Web Dev   │ │ Data Sci  │
         │   │ 25 lessons│ │ 30 lessons│ │ 20 lessons│
         │   │ [Enroll]  │ │ [Enroll]  │ │ [Enroll]  │
         │   └───────────┘ └───────────┘ └───────────┘
         │
         ├─→ User clicks "Enroll":
         │   POST /api/courses/:id/enroll
         │   
         │   ├─→ Update user profile
         │   ├─→ Create progress record
         │   └─→ Show success message
         │
         └─→ User clicks "Start Learning":
             └─→ Navigate to /lessons

┌─────────────────────────────────────────────────────────────────────┐
│                   8. PROGRESS TRACKING                              │
└─────────────────────────────────────────────────────────────────────┘

    [Progress System]
         │
         ├─→ Lesson Completion:
         │   │
         │   ├─→ Mark lesson complete
         │   ├─→ Update progress record
         │   ├─→ Increment completed count
         │   └─→ Update dashboard stats
         │
         ├─→ Quiz Completion:
         │   │
         │   ├─→ Submit quiz answers
         │   ├─→ Calculate score
         │   ├─→ Store score in progress
         │   │
         │   └─→ If score ≥ 80%:
         │       ├─→ Unlock next level
         │       └─→ Award XP
         │
         ├─→ Level Progression:
         │   │
         │   ├─→ Level 1 (Awareness) - Always unlocked
         │   ├─→ Level 2 (Beginner) - Unlock after Level 1 quiz
         │   ├─→ Level 3 (Fundamental) - Unlock after Level 2 quiz
         │   ├─→ ... and so on
         │   └─→ Level 7 (Mastery) - Final level
         │
         └─→ Dashboard Updates:
             ├─→ Progress percentage
             ├─→ Completed lessons count
             ├─→ Remaining lessons count
             └─→ Current stage

┌─────────────────────────────────────────────────────────────────────┐
│                   9. MENTOR INTERACTION                             │
└─────────────────────────────────────────────────────────────────────┘

    [Student Dashboard]
         │
         ├─→ View assigned mentor
         │
         ├─→ Click "Book Session":
         │   └─→ Navigate to /sessions
         │       └─→ Schedule 1-on-1 session
         │
         ├─→ Click "Message":
         │   └─→ Navigate to /chat
         │       └─→ Send direct message
         │
         └─→ Mentor can:
             ├─→ View student progress
             ├─→ Assign projects
             ├─→ Provide feedback
             └─→ Grade assignments

┌─────────────────────────────────────────────────────────────────────┐
│                   10. COMPLETE CYCLE                                │
└─────────────────────────────────────────────────────────────────────┘

    [Student Journey Summary]
         │
         ├─→ Register (1 min)
         ├─→ Complete Onboarding (5 min)
         ├─→ Auto-enrolled in Course (instant)
         ├─→ Click "Start Learning" (1 click)
         ├─→ Access Lessons (instant)
         ├─→ Complete Lessons (ongoing)
         ├─→ Take Quizzes (per level)
         ├─→ Unlock Levels (progressive)
         ├─→ Track Progress (real-time)
         └─→ Achieve Mastery (goal)

    Total Time to Start Learning: < 10 minutes! 🎉
```

---

## 🔄 Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                      DATABASE RELATIONSHIPS                         │
└─────────────────────────────────────────────────────────────────────┘

    ┌─────────────┐
    │    User     │
    │─────────────│
    │ _id         │◄─────────┐
    │ name        │          │
    │ email       │          │
    │ role        │          │
    │ learning    │          │
    │  Profile:   │          │
    │   course: { │          │
    │     id ─────┼──┐       │
    │     title   │  │       │
    │   }         │  │       │
    │ assigned    │  │       │
    │  Mentor ────┼──┼───┐   │
    └─────────────┘  │   │   │
                     │   │   │
    ┌────────────────▼───┐   │
    │     Course         │   │
    │────────────────────│   │
    │ _id                │   │
    │ title              │   │
    │ description        │   │
    │ category           │   │
    │ instructor ────────┼───┘
    │ createdBy          │
    └────────────────────┘
            │
            │ has many
            ▼
    ┌────────────────────┐
    │      Level         │
    │────────────────────│
    │ _id                │
    │ title              │
    │ order (1-7)        │
    │ course ────────────┼──┐
    └────────────────────┘  │
            │               │
            │ has many      │
            ▼               │
    ┌────────────────────┐  │
    │     Lesson         │  │
    │────────────────────│  │
    │ _id                │  │
    │ title              │  │
    │ content            │  │
    │ videoUrl           │  │
    │ level              │  │
    │ course ────────────┼──┘
    └────────────────────┘
            │
            │ has one
            ▼
    ┌────────────────────┐
    │      Quiz          │
    │────────────────────│
    │ _id                │
    │ questions[]        │
    │ lesson             │
    └────────────────────┘

    ┌─────────────┐
    │  Progress   │
    │─────────────│
    │ _id         │
    │ user ───────┼──┐
    │ course ─────┼──┼──┐
    │ levels      │  │  │
    │  Progress[] │  │  │
    │ xpEarned    │  │  │
    └─────────────┘  │  │
         │           │  │
         └───────────┘  │
                        │
         ┌──────────────┘
         │
    ┌────▼────────────┐
    │    Course       │
    └─────────────────┘
```

---

## 🎯 Key Decision Points

```
┌─────────────────────────────────────────────────────────────────────┐
│                   COURSE MATCHING LOGIC                             │
└─────────────────────────────────────────────────────────────────────┘

    Student selects: "AI and Machine Learning"
         │
         ├─→ Search courses:
         │   
         │   Priority 1: Exact title match
         │   ┌─────────────────────────────────┐
         │   │ title === "AI and Machine       │
         │   │          Learning"              │
         │   └─────────────────────────────────┘
         │   
         │   Priority 2: Title contains
         │   ┌─────────────────────────────────┐
         │   │ title.includes("AI") ||         │
         │   │ title.includes("Machine         │
         │   │                Learning")       │
         │   └─────────────────────────────────┘
         │   
         │   Priority 3: Category match
         │   ┌─────────────────────────────────┐
         │   │ category === "AI and Machine    │
         │   │              Learning"          │
         │   └─────────────────────────────────┘
         │
         ├─→ If match found:
         │   └─→ Auto-assign course
         │
         └─→ If no match:
             └─→ Fallback to browse page

┌─────────────────────────────────────────────────────────────────────┐
│                   NAVIGATION LOGIC                                  │
└─────────────────────────────────────────────────────────────────────┘

    User clicks "Start Learning"
         │
         ├─→ Check enrollment:
         │   
         │   if (user.learningProfile.course.id) {
         │     // Has course
         │     navigate("/lessons");
         │   } else {
         │     // No course
         │     navigate("/courses");
         │   }
         │
         └─→ Navigate to appropriate page

┌─────────────────────────────────────────────────────────────────────┐
│                   LEVEL UNLOCK LOGIC                                │
└─────────────────────────────────────────────────────────────────────┘

    User completes quiz
         │
         ├─→ Calculate score:
         │   score = (correct / total) * 100
         │
         ├─→ Check threshold:
         │   
         │   if (score >= 80) {
         │     // Unlock next level
         │     unlockLevel(currentLevel + 1);
         │     awardXP(score);
         │   } else {
         │     // Show retry message
         │     showMessage("Need 80% to unlock");
         │   }
         │
         └─→ Update progress record
```

---

## 📊 State Management

```
┌─────────────────────────────────────────────────────────────────────┐
│                   FRONTEND STATE FLOW                               │
└─────────────────────────────────────────────────────────────────────┘

    [App.tsx]
         │
         ├─→ Routes:
         │   /auth          → Auth Page
         │   /register      → Onboarding
         │   /dashboard     → Dashboard
         │   /lessons       → Lessons Page
         │   /courses       → Browse Courses
         │   /profile       → Profile Page
         │   /settings      → Settings
         │   ...
         │
    [Dashboard.tsx]
         │
         ├─→ State:
         │   • user: User | null
         │   • preferences: UserPreferences
         │   • lessons: RecommendedLesson[]
         │   • assignedMentor: Mentor | null
         │   • sidebarOpen: boolean
         │   • activeView: string
         │
         ├─→ Effects:
         │   • Fetch user profile on mount
         │   • Initialize Socket.io
         │   • Fetch assigned mentor
         │
         └─→ Handlers:
             • handleSignOut()
             • handleStartLearning()
             • handleViewChange()

    [Lessons.tsx]
         │
         ├─→ State:
         │   • levels: Level[]
         │   • selectedLesson: Lesson | null
         │   • expandedLevel: string | null
         │   • quiz: Quiz | null
         │   • completedLessons: Set<string>
         │   • loading: boolean
         │
         ├─→ Effects:
         │   • Fetch course roadmap on mount
         │   • Fetch unlock status
         │
         └─→ Handlers:
             • handleOpenLesson()
             • handleCompleteLesson()
             • handleSubmitQuiz()

    [BrowseCourses.tsx]
         │
         ├─→ State:
         │   • courses: Course[]
         │   • filteredCourses: Course[]
         │   • enrolledCourseId: string | null
         │   • searchQuery: string
         │   • categoryFilter: string
         │   • enrolling: string | null
         │
         ├─→ Effects:
         │   • Fetch all courses on mount
         │   • Filter courses on search/category change
         │
         └─→ Handlers:
             • handleEnroll()
             • handleStartLearning()
             • filterCourses()
```

---

## 🔐 Authentication Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                   AUTH & AUTHORIZATION                              │
└─────────────────────────────────────────────────────────────────────┘

    [Client]
         │
         ├─→ Login/Register
         │
    [Backend: POST /api/auth/login]
         │
         ├─→ Validate credentials
         ├─→ Generate JWT token
         │   
         │   token = jwt.sign(
         │     { userId, role },
         │     JWT_SECRET,
         │     { expiresIn: '7d' }
         │   )
         │
         └─→ Return token

    [Client]
         │
         ├─→ Store token:
         │   localStorage.setItem('token', token)
         │
         └─→ Include in requests:
             headers: {
               Authorization: `Bearer ${token}`
             }

    [Backend: authMiddleware]
         │
         ├─→ Extract token from header
         ├─→ Verify token
         ├─→ Decode user info
         ├─→ Attach to req.user
         └─→ Continue to route handler

    [Backend: authorize middleware]
         │
         ├─→ Check user role
         │   
         │   if (req.user.role !== allowedRole) {
         │     return res.status(403).json({
         │       message: "Forbidden"
         │     });
         │   }
         │
         └─→ Continue to route handler
```

---

**End of System Flow Diagram**
