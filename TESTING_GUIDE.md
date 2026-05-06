# PathMentor AI - Complete Testing Guide

## 🎯 Overview

This guide provides step-by-step instructions to test the complete onboarding-based course assignment system.

---

## 📋 Prerequisites

### Backend Setup
```bash
cd backend
npm install
# Ensure MongoDB is running
# Ensure .env file has correct configuration
npm start
# Backend should run on http://localhost:5001
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
# Frontend should run on http://localhost:8081
```

### Test Data Requirements
- At least one **Mentor** account with approved status
- At least one **Course** created by the mentor
- Course should have:
  - Title matching a skill track (e.g., "AI and Machine Learning")
  - At least one level with lessons
  - Lessons with content/video

---

## 🧪 Test Scenarios

### Test 1: Complete New Student Flow (Happy Path)

#### Step 1: Create Mentor and Course (Setup)

**1.1 Register as Mentor**
```
URL: http://localhost:8081/auth
- Click "Sign Up"
- Name: "John Mentor"
- Email: "mentor@test.com"
- Password: "Test@1234"
- Role: "Mentor"
- Click "Create Account"
```

**1.2 Admin Approves Mentor**
```
URL: http://localhost:8081/admin/login
- Login as admin
- Go to "Pending Mentors"
- Approve "John Mentor"
```

**1.3 Mentor Creates Course**
```
URL: http://localhost:8081/mentor/dashboard
- Login as mentor@test.com
- Go to "Courses" section
- Click "Create Course"
- Title: "AI and Machine Learning"
- Description: "Complete AI/ML course from basics to advanced"
- Category: "AI and Machine Learning"
- Click "Create"
```

**1.4 Mentor Uploads Lessons**
```
- Select the created course
- Go to Level 1 (Awareness)
- Click "Add Lesson"
- Title: "Introduction to AI"
- Description: "Learn AI basics"
- Content: Add some text content
- Video URL (optional): Add YouTube embed URL
- Click "Save"
- Repeat for 2-3 more lessons
```

#### Step 2: Student Registration and Onboarding

**2.1 Register New Student**
```
URL: http://localhost:8081/auth
- Click "Sign Up"
- Name: "Jane Student"
- Email: "student@test.com"
- Password: "Test@1234"
- Role: "Student"
- Click "Create Account"
```

**2.2 Complete Onboarding**
```
Step 1 - Skill Track:
  ✓ Select "AI and Machine Learning"
  ✓ Click "Next"

Step 2 - Experience Level:
  ✓ Select "Beginner"
  ✓ Click "Next"

Step 3 - Commitment Time:
  ✓ Select "1-2 hours/day"
  ✓ Click "Next"

Step 4 - Learning Style:
  ✓ Select "Visual"
  ✓ Click "Next"

Step 5 - Learning Goal:
  ✓ Select "Career Change"
  ✓ Click "Next"

Step 6 - Personal Goal:
  ✓ Type: "I want to become an AI engineer"
  ✓ Click "Next"

Step 7 - Persona Reveal:
  ✓ Wait for AI to generate persona
  ✓ Review persona details
  ✓ Click "Complete Profile"
```

#### Step 3: Verify Dashboard

**3.1 Check Dashboard Elements**
```
URL: http://localhost:8081/dashboard

Expected Results:
✅ Welcome message shows "Jane Student"
✅ Progress Hero Card is visible
✅ Current Stage shows "Beginner"
✅ Progress circle shows 0%
✅ Completed: 0 lessons
✅ Remaining: X lessons (based on uploaded lessons)
✅ "Start Learning" button is visible and prominent
✅ Button has glow effect
✅ Assigned Mentor card shows "John Mentor"
```

**3.2 Verify User Profile in Database**
```javascript
// MongoDB query
db.users.findOne({ email: "student@test.com" })

Expected Fields:
{
  learningProfile: {
    skillTrack: "AI and Machine Learning",
    experienceLevel: "Beginner",
    course: {
      id: ObjectId("..."),
      title: "AI and Machine Learning"
    },
    courseLevel: "Beginner"
  },
  onboardingCompleted: true,
  assignedMentor: ObjectId("...")
}
```

**3.3 Verify Progress Record**
```javascript
// MongoDB query
db.progresses.findOne({ 
  user: ObjectId("student-id"),
  course: ObjectId("course-id")
})

Expected:
{
  user: ObjectId("..."),
  course: ObjectId("..."),
  levelsProgress: [],
  xpEarned: 0,
  createdAt: ISODate("...")
}
```

#### Step 4: Test Start Learning Flow

**4.1 Click Start Learning Button**
```
Action: Click "Start Learning" button on Progress Hero Card

Expected Results:
✅ Navigates to /lessons
✅ URL changes to http://localhost:8081/lessons
✅ Page loads without errors
```

**4.2 Verify Lessons Page**
```
Expected Elements:
✅ Course title: "AI and Machine Learning"
✅ Subtitle: "7 levels from Awareness to Mastery..."
✅ 7 level cards displayed (Awareness → Mastery)
✅ Level 1 (Awareness) is unlocked
✅ Level 1 shows progress bar (0%)
✅ Level 1 is expandable (click to expand)
✅ Levels 2-7 are locked (Lock icon visible)
```

**4.3 Expand Level 1**
```
Action: Click on Level 1 card

Expected Results:
✅ Card expands smoothly
✅ Shows list of lessons uploaded by mentor
✅ Each lesson has:
  - Play icon
  - Lesson title
  - Lesson description
  - "Video" badge if video URL exists
✅ Lessons are clickable
```

**4.4 Open First Lesson**
```
Action: Click on first lesson

Expected Results:
✅ Lesson detail view opens
✅ Shows lesson title and description
✅ Shows video player if video URL exists
✅ Shows text content if available
✅ "Mark Complete" button is visible
✅ "Back to Levels" button is visible
```

**4.5 Complete Lesson**
```
Action: Click "Mark Complete" button

Expected Results:
✅ Button changes to "Completed" with green checkmark
✅ Button is disabled
✅ Lesson is marked as completed in database
```

**4.6 Return to Dashboard**
```
Action: Navigate back to Dashboard

Expected Results:
✅ Progress Hero Card updates
✅ Progress percentage increases
✅ Completed lessons count increases
✅ Remaining lessons count decreases
```

---

### Test 2: No Matching Course (Fallback)

**2.1 Register Student with Different Skill Track**
```
- Register new student: "bob@test.com"
- During onboarding, select "Web Development"
- Complete onboarding
```

**2.2 Verify Dashboard**
```
Expected Results:
✅ Dashboard loads successfully
✅ Progress Hero Card shows default values
✅ "Start Learning" button is visible
```

**2.3 Click Start Learning**
```
Action: Click "Start Learning" button

Expected Results:
✅ Navigates to /courses (Browse Courses page)
✅ Shows all available courses
✅ Shows "No course enrolled" message
✅ Can manually enroll in any course
```

---

### Test 3: Manual Course Enrollment

**3.1 Navigate to Browse Courses**
```
URL: http://localhost:8081/courses

Expected Results:
✅ Shows all available courses
✅ Search bar is functional
✅ Category filters work
✅ Each course card shows:
  - Title
  - Description
  - Category badge
  - Instructor name
  - Lesson count
  - "Enroll Now" button
```

**3.2 Enroll in Course**
```
Action: Click "Enroll Now" on any course

Expected Results:
✅ Button shows "Enrolling..." with spinner
✅ Success message appears
✅ Button changes to "Start Learning"
✅ Banner appears at top: "Currently Enrolled"
✅ Other courses show "Already Enrolled in Another Course"
```

**3.3 Start Learning from Browse Page**
```
Action: Click "Start Learning" on enrolled course

Expected Results:
✅ Navigates to /lessons
✅ Shows enrolled course content
```

---

### Test 4: Multiple Students, Same Course

**4.1 Register Multiple Students**
```
Student 1: alice@test.com - Skill Track: "AI and Machine Learning"
Student 2: charlie@test.com - Skill Track: "AI and Machine Learning"
Student 3: diana@test.com - Skill Track: "AI and Machine Learning"
```

**4.2 Verify Auto-Assignment**
```
Expected Results:
✅ All 3 students auto-assigned to same course
✅ Each has separate Progress record
✅ Each can learn independently
✅ Progress doesn't interfere with each other
```

**4.3 Verify Mentor Assignment**
```
Expected Results:
✅ All 3 students assigned to "John Mentor"
✅ Mentor's studentCount increases to 3
✅ Mentor can see all 3 students in dashboard
```

---

### Test 5: Course Matching Algorithm

**5.1 Test Exact Title Match**
```
Course Title: "AI and Machine Learning"
Student Skill Track: "AI and Machine Learning"
Expected: ✅ Match
```

**5.2 Test Partial Title Match**
```
Course Title: "Machine Learning Fundamentals"
Student Skill Track: "Machine Learning"
Expected: ✅ Match
```

**5.3 Test Category Match**
```
Course Title: "Introduction to AI"
Course Category: "AI and Machine Learning"
Student Skill Track: "AI and Machine Learning"
Expected: ✅ Match
```

**5.4 Test No Match**
```
Course Title: "Web Development Bootcamp"
Course Category: "Web Development"
Student Skill Track: "AI and Machine Learning"
Expected: ❌ No Match (fallback to browse)
```

---

### Test 6: Edge Cases

**6.1 Student Completes Onboarding Before Course Exists**
```
Scenario:
1. Student completes onboarding
2. No matching course exists
3. Mentor creates course later

Expected Results:
✅ Student can browse and manually enroll
✅ No errors on dashboard
✅ "Start Learning" navigates to /courses
```

**6.2 Course Has No Lessons**
```
Scenario:
1. Mentor creates course
2. Doesn't upload any lessons
3. Student auto-enrolls

Expected Results:
✅ Dashboard shows 0 lessons
✅ Lessons page shows "No lessons added yet"
✅ No errors or crashes
```

**6.3 Student Changes Skill Track**
```
Scenario:
1. Student enrolled in "AI and ML" course
2. Admin/Student updates skillTrack to "Web Development"

Expected Results:
✅ Student remains enrolled in original course
✅ Can manually switch courses from /courses
```

---

## 🔍 Database Verification Queries

### Check User Profile
```javascript
db.users.findOne(
  { email: "student@test.com" },
  { 
    learningProfile: 1, 
    onboardingCompleted: 1, 
    assignedMentor: 1 
  }
)
```

### Check Progress Record
```javascript
db.progresses.find({ 
  user: ObjectId("student-id") 
}).pretty()
```

### Check Course Assignment
```javascript
db.users.aggregate([
  { $match: { role: "student" } },
  { $project: {
      name: 1,
      email: 1,
      "learningProfile.skillTrack": 1,
      "learningProfile.course.title": 1
  }}
])
```

### Check Mentor Student Count
```javascript
db.users.findOne(
  { email: "mentor@test.com" },
  { name: 1, studentCount: 1 }
)
```

---

## 🐛 Common Issues and Solutions

### Issue 1: "Start Learning" Button Not Showing

**Symptoms:**
- Progress Hero Card visible
- But no "Start Learning" button

**Possible Causes:**
1. `onStartLearning` prop not passed to component
2. Component not updated
3. User data not loaded

**Solution:**
```typescript
// Check Dashboard.tsx
<ProgressHeroCard 
  onStartLearning={() => {
    if (user?.learningProfile?.course?.id) {
      navigate("/lessons");
    } else {
      navigate("/courses");
    }
  }}
/>
```

### Issue 2: Course Not Auto-Assigned

**Symptoms:**
- Student completes onboarding
- No course in learningProfile
- Dashboard shows 0 lessons

**Possible Causes:**
1. No course matches skillTrack
2. Course title/category doesn't match
3. Backend error during assignment

**Debug Steps:**
```javascript
// 1. Check if course exists
db.courses.find({ 
  $or: [
    { title: /AI and Machine Learning/i },
    { category: /AI and Machine Learning/i }
  ]
})

// 2. Check backend logs
// Look for errors in completeProfile function

// 3. Check user profile
db.users.findOne({ email: "student@test.com" })
```

**Solution:**
- Ensure course title matches skillTrack exactly
- Or create course with matching category
- Or student can manually enroll from /courses

### Issue 3: Lessons Page Shows Empty

**Symptoms:**
- Navigate to /lessons
- Shows "No course content yet"
- But course exists and has lessons

**Possible Causes:**
1. Course ID mismatch
2. Lessons not linked to course
3. API error

**Debug Steps:**
```javascript
// 1. Check user's enrolled course
db.users.findOne(
  { email: "student@test.com" },
  { "learningProfile.course": 1 }
)

// 2. Check lessons for that course
db.lessons.find({ course: ObjectId("course-id") })

// 3. Check API response
// Open browser DevTools → Network tab
// Look for /courses/:id/roadmap request
```

### Issue 4: Progress Not Updating

**Symptoms:**
- Mark lesson as complete
- Dashboard still shows 0% progress

**Possible Causes:**
1. Progress record not created
2. API error
3. Frontend not refreshing

**Solution:**
```javascript
// 1. Check progress record exists
db.progresses.findOne({ 
  user: ObjectId("student-id"),
  course: ObjectId("course-id")
})

// 2. Check lesson completion
db.progresses.findOne(
  { user: ObjectId("student-id") },
  { levelsProgress: 1 }
)

// 3. Refresh dashboard page
```

---

## ✅ Success Criteria

### For Auto-Assignment
- [x] Student selects skillTrack during onboarding
- [x] System finds matching course
- [x] Course info saved in learningProfile
- [x] Progress record created
- [x] Mentor assigned

### For Dashboard
- [x] Progress Hero Card displays correctly
- [x] "Start Learning" button visible
- [x] Button has glow effect
- [x] Progress percentage accurate
- [x] Lesson counts correct

### For Lessons Page
- [x] Shows enrolled course title
- [x] Displays all 7 levels
- [x] Level 1 unlocked
- [x] Lessons expandable
- [x] Can open and complete lessons
- [x] Quiz system works

### For Browse Courses
- [x] Shows all available courses
- [x] Search and filter work
- [x] Can enroll manually
- [x] Shows enrolled status
- [x] Prevents multiple enrollments

---

## 📊 Performance Benchmarks

### Page Load Times
- Dashboard: < 2 seconds
- Lessons Page: < 2 seconds
- Browse Courses: < 2 seconds

### API Response Times
- GET /users/profile: < 500ms
- POST /users/onboarding: < 1000ms
- GET /courses/:id/roadmap: < 500ms
- POST /progress/lesson/:id/complete: < 300ms

### Database Queries
- Find matching course: < 100ms
- Create progress record: < 50ms
- Update user profile: < 50ms

---

## 🎉 Final Checklist

Before marking as complete, verify:

- [ ] New student can register
- [ ] Onboarding flow works end-to-end
- [ ] Course auto-assigned based on skillTrack
- [ ] Dashboard shows "Start Learning" button
- [ ] Button navigates to correct page
- [ ] Lessons page shows enrolled course
- [ ] Can complete lessons
- [ ] Progress updates on dashboard
- [ ] Browse courses works as fallback
- [ ] Manual enrollment works
- [ ] Multiple students can enroll
- [ ] No console errors
- [ ] No database errors
- [ ] Mobile responsive
- [ ] All animations smooth

---

## 📝 Test Report Template

```markdown
# Test Report - [Date]

## Tester: [Name]
## Environment: [Local/Staging/Production]

### Test 1: Complete New Student Flow
- [ ] PASS / [ ] FAIL
- Notes: _______________

### Test 2: No Matching Course
- [ ] PASS / [ ] FAIL
- Notes: _______________

### Test 3: Manual Enrollment
- [ ] PASS / [ ] FAIL
- Notes: _______________

### Test 4: Multiple Students
- [ ] PASS / [ ] FAIL
- Notes: _______________

### Test 5: Course Matching
- [ ] PASS / [ ] FAIL
- Notes: _______________

### Test 6: Edge Cases
- [ ] PASS / [ ] FAIL
- Notes: _______________

## Issues Found:
1. _______________
2. _______________

## Overall Status: [ ] PASS / [ ] FAIL
```

---

**Last Updated**: May 7, 2026  
**Status**: Ready for Testing  
**Version**: 1.0
