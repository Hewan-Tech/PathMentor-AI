# PathMentor AI - Quick Test Checklist

## ⚡ 5-Minute Quick Test

This checklist helps you verify the core functionality in under 5 minutes.

---

## ✅ Pre-Test Setup (One-Time)

### 1. Start Backend
```bash
cd backend
npm start
# Should see: "Server running on port 5001"
# Should see: "MongoDB connected"
```

### 2. Start Frontend
```bash
cd frontend
npm run dev
# Should see: "Local: http://localhost:8081"
```

### 3. Create Test Mentor (One-Time)
```
1. Go to http://localhost:8081/auth
2. Register as "mentor@test.com" / "Test@1234" / Role: Mentor
3. Login as admin and approve mentor
4. Login as mentor
5. Create course: "AI and Machine Learning"
6. Add 2-3 lessons to Level 1
```

---

## 🎯 Core Flow Test (3 Minutes)

### Test 1: Student Registration ✓
```
□ Go to http://localhost:8081/auth
□ Click "Sign Up"
□ Fill form:
  - Name: "Test Student"
  - Email: "student@test.com"
  - Password: "Test@1234"
  - Role: "Student"
□ Click "Create Account"
□ Should redirect to onboarding
```

### Test 2: Onboarding ✓
```
□ Step 1: Select "AI and Machine Learning"
□ Step 2: Select "Beginner"
□ Step 3: Select "1-2 hours/day"
□ Step 4: Select "Visual"
□ Step 5: Select "Career Change"
□ Step 6: Type "I want to learn AI"
□ Step 7: Wait for persona (5-10 seconds)
□ Click "Complete Profile"
□ Should redirect to dashboard
```

### Test 3: Dashboard ✓
```
□ Welcome message shows "Test Student"
□ Progress Hero Card visible
□ Shows "Current Stage: Beginner"
□ Shows "0% Complete"
□ Shows "0 Completed | X Remaining"
□ "Start Learning" button visible
□ Button has glow effect
□ Assigned Mentor card shows mentor info
```

### Test 4: Start Learning ✓
```
□ Click "Start Learning" button
□ Should navigate to /lessons
□ URL: http://localhost:8081/lessons
□ Shows "AI and Machine Learning" title
□ Shows 7 levels
□ Level 1 (Awareness) is unlocked
□ Levels 2-7 are locked
```

### Test 5: Open Lesson ✓
```
□ Click on Level 1 to expand
□ Shows list of lessons
□ Click on first lesson
□ Lesson detail view opens
□ Shows lesson title
□ Shows content/video
□ "Mark Complete" button visible
```

### Test 6: Complete Lesson ✓
```
□ Click "Mark Complete"
□ Button changes to "Completed" with checkmark
□ Button is disabled
□ Go back to dashboard
□ Progress percentage increased
□ Completed count increased
```

---

## 🔍 Quick Verification Checklist

### Visual Checks
```
□ No console errors in browser
□ All animations smooth
□ Buttons have hover effects
□ Progress circle animates
□ Glass-morphism effects visible
□ Mobile responsive (resize browser)
```

### Functional Checks
```
□ Can register new student
□ Onboarding completes successfully
□ Course auto-assigned
□ Dashboard loads correctly
□ "Start Learning" navigates correctly
□ Lessons page shows course
□ Can open and complete lessons
□ Progress updates in real-time
```

### Database Checks (Optional)
```javascript
// Check user profile
db.users.findOne({ email: "student@test.com" })
// Should have: learningProfile.course.id

// Check progress record
db.progresses.findOne({ user: ObjectId("...") })
// Should exist with course ID
```

---

## 🐛 Common Issues Quick Fix

### Issue: "Start Learning" button not showing
```
Fix: Check Dashboard.tsx line ~183
Ensure onStartLearning prop is passed to ProgressHeroCard
```

### Issue: Course not auto-assigned
```
Fix: Ensure course title matches skillTrack exactly
Course title: "AI and Machine Learning"
Student skillTrack: "AI and Machine Learning"
```

### Issue: Lessons page empty
```
Fix: Ensure mentor uploaded lessons to the course
Go to mentor dashboard → select course → add lessons
```

### Issue: Console errors
```
Fix: Check backend is running on port 5001
Check MongoDB is connected
Check .env files are configured
```

---

## 📊 Expected Results Summary

### After Registration
```
✓ User created in database
✓ JWT token generated
✓ Redirected to onboarding
```

### After Onboarding
```
✓ learningProfile populated
✓ course auto-assigned
✓ Progress record created
✓ Mentor assigned
✓ Redirected to dashboard
```

### On Dashboard
```
✓ User data loaded
✓ Progress Hero Card shows stats
✓ "Start Learning" button visible
✓ Mentor card shows assigned mentor
```

### On Lessons Page
```
✓ Course title displayed
✓ 7 levels shown
✓ Level 1 unlocked
✓ Lessons expandable
✓ Can complete lessons
```

---

## ⏱️ Performance Benchmarks

```
□ Dashboard loads in < 2 seconds
□ Lessons page loads in < 2 seconds
□ Lesson completion < 500ms
□ No lag when clicking buttons
□ Smooth animations (60fps)
```

---

## 🎉 Success Criteria

### Minimum Viable Test (Must Pass)
```
□ Student can register
□ Onboarding completes
□ Course auto-assigned
□ Dashboard shows "Start Learning"
□ Button navigates to lessons
□ Lessons page shows course
□ Can complete a lesson
```

### Full Feature Test (Should Pass)
```
□ All 7 steps of onboarding work
□ Progress Hero Card displays correctly
□ All animations smooth
□ Mobile responsive
□ No console errors
□ Progress updates correctly
□ Quiz system works
□ Level unlock works
```

---

## 📝 Test Report Template

```
Date: _______________
Tester: _______________
Environment: Local / Staging / Production

Core Flow Test:
□ PASS / □ FAIL - Registration
□ PASS / □ FAIL - Onboarding
□ PASS / □ FAIL - Dashboard
□ PASS / □ FAIL - Start Learning
□ PASS / □ FAIL - Lessons Page
□ PASS / □ FAIL - Complete Lesson

Issues Found:
1. _______________
2. _______________
3. _______________

Overall Status: □ PASS / □ FAIL

Notes:
_______________________________________________
_______________________________________________
```

---

## 🚀 Next Steps After Testing

### If All Tests Pass ✅
```
1. Mark feature as complete
2. Deploy to staging
3. Run full regression tests
4. Get stakeholder approval
5. Deploy to production
```

### If Tests Fail ❌
```
1. Document failing tests
2. Check TESTING_GUIDE.md for troubleshooting
3. Review implementation files
4. Fix issues
5. Re-run tests
```

---

## 📞 Quick Help

### Need More Details?
- **Full Testing**: See `TESTING_GUIDE.md`
- **Implementation**: See `IMPLEMENTATION_SUMMARY.md`
- **Flow Diagrams**: See `SYSTEM_FLOW_DIAGRAM.md`
- **Original Docs**: See `ONBOARDING_COURSE_ASSIGNMENT_COMPLETE.md`

### Key Files to Check
```
Backend:  backend/controllers/userController.js (line 90-150)
Frontend: frontend/src/components/dashboard/ProgressHeroCard.tsx
          frontend/src/pages/Dashboard.tsx (line 183)
          frontend/src/pages/Lessons.tsx
```

### Database Queries
```javascript
// Check user
db.users.findOne({ email: "student@test.com" })

// Check progress
db.progresses.find({ user: ObjectId("...") })

// Check course
db.courses.findOne({ title: "AI and Machine Learning" })
```

---

## ⚡ Ultra-Quick Test (1 Minute)

For experienced testers who just need to verify core functionality:

```
1. Register student with "AI and Machine Learning" skillTrack
2. Complete onboarding
3. Check dashboard has "Start Learning" button
4. Click button → should go to /lessons
5. Should see course with 7 levels
6. Done! ✅
```

---

**Last Updated**: May 7, 2026  
**Version**: 1.0  
**Status**: Ready for Testing

---

## 🎯 Remember

The goal is to verify that a student can:
1. Register in < 1 minute
2. Complete onboarding in < 5 minutes
3. Get auto-enrolled in a course
4. Click "Start Learning" and immediately access lessons
5. Start learning without any friction

**Total time from registration to learning: < 10 minutes!** 🎉
