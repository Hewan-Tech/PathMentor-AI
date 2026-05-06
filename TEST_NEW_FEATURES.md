# Testing New Student Features

## Quick Test Guide

### 1. Start the Backend
```bash
cd backend
node server.js
```

Backend should start on port **5001**.

### 2. Start the Frontend
```bash
cd frontend
npm run dev
```

Frontend should start on port **8081**.

---

## Test Scenarios

### ✅ Test 1: Roadmap Page (Real Data)
1. Login as a student
2. Navigate to `/roadmap` or click "View full roadmap" from dashboard
3. **Expected**:
   - See 7 levels with real titles (Awareness, Beginner, Fundamental, etc.)
   - Progress bars show actual completion percentage
   - Locked levels are grayed out
   - Current level is highlighted
   - Click to expand and see lessons
   - Overall progress bar at top

### ✅ Test 2: RoadmapSnapshot (Real Level Names)
1. Go to `/dashboard`
2. Scroll to "Your Roadmap" section
3. **Expected**:
   - 7 stages with real level names from database
   - Completed stages show green checkmark
   - Current stage shows play icon
   - Locked stages show lock icon
   - Progress bar reflects actual stage

### ✅ Test 3: Daily Motivation Engine
1. Go to `/dashboard`
2. Look for "Daily Motivation" card
3. **Expected**:
   - Shows personalized message based on your streak/XP
   - Displays current streak, total XP, total lessons
   - Color changes based on message type (yellow=positive, orange=warning)
   - Examples:
     - "🔥 Amazing! 7-day streak! You're on fire!" (if streak >= 7)
     - "⚠️ Your streak is at risk!" (if streak = 0 but had streak before)

### ✅ Test 4: Weekly Growth Report
1. Go to `/dashboard`
2. Look for "Weekly Growth Report" card
3. **Expected**:
   - Shows 4 stats in 2x2 grid:
     - Hours Studied (estimated)
     - Topics Mastered (completed levels)
     - XP Earned
     - Achievements (badges earned this week)
   - Celebration message if lessons completed > 0

### ✅ Test 5: Smart Reminder System
1. Go to `/dashboard`
2. Look for banner at top (only shows if applicable)
3. **Expected**:
   - Shows reminder if:
     - Streak at risk (20+ hours inactive, has streak) → RED banner
     - Inactive 2+ days → ORANGE banner
     - Inactive 1 day → BLUE banner
   - Can dismiss with X button
   - Examples:
     - "⚠️ Your 5-day streak is at risk! Study today to keep it alive."
     - "You haven't studied in 2 days. Let's get back on track!"

---

## API Endpoint Tests

You can test the new endpoints directly using curl or Postman:

### Get Daily Motivation
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:5001/api/progress/motivation
```

**Expected Response**:
```json
{
  "success": true,
  "motivation": {
    "message": "🔥 Amazing! 7-day streak! You're on fire!",
    "type": "positive",
    "streak": 7,
    "totalXP": 250,
    "totalLessons": 15
  }
}
```

### Get Weekly Report
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:5001/api/progress/weekly-report
```

**Expected Response**:
```json
{
  "success": true,
  "report": {
    "hoursStudied": 7.5,
    "topicsMastered": 3,
    "xpEarned": 250,
    "lessonsCompleted": 15,
    "achievementsEarned": 2,
    "weekStart": "2026-04-30T...",
    "weekEnd": "2026-05-07T..."
  }
}
```

### Get Smart Reminder
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:5001/api/progress/reminder
```

**Expected Response** (if reminder applicable):
```json
{
  "success": true,
  "reminder": {
    "type": "streak_risk",
    "message": "⚠️ Your 5-day streak is at risk! Study today to keep it alive.",
    "urgency": "high"
  }
}
```

**Expected Response** (if no reminder):
```json
{
  "success": true,
  "reminder": null
}
```

---

## Troubleshooting

### Issue: Roadmap shows no data
**Solution**: Make sure the student has completed onboarding and is enrolled in a course.

### Issue: Motivation/Report shows loading forever
**Solution**: Check browser console for API errors. Verify backend is running on port 5001.

### Issue: Smart Reminder doesn't appear
**Solution**: This is normal! Reminder only shows if you're inactive or streak is at risk. To test:
1. Manually update your user's `updatedAt` field to 2 days ago in MongoDB
2. Refresh dashboard

### Issue: RoadmapSnapshot shows default stages
**Solution**: Check that `/courses/{courseId}/roadmap` endpoint returns data. Verify course has levels created.

---

## Success Criteria

✅ All pages load without errors  
✅ Roadmap shows real levels from database  
✅ RoadmapSnapshot uses real level titles  
✅ Daily Motivation displays personalized message  
✅ Weekly Growth Report shows real stats  
✅ Smart Reminder appears when applicable  
✅ All widgets are responsive on mobile  
✅ No console errors in browser  
✅ Backend endpoints return correct data  

---

## Files Changed

### Frontend
- `frontend/src/pages/Roadmap.tsx` — Connected to real API
- `frontend/src/components/dashboard/RoadmapSnapshot.tsx` — Uses real levels
- `frontend/src/components/dashboard/DailyMotivation.tsx` — NEW
- `frontend/src/components/dashboard/WeeklyGrowthReport.tsx` — NEW
- `frontend/src/components/dashboard/SmartReminder.tsx` — NEW
- `frontend/src/pages/Dashboard.tsx` — Integrated new widgets
- `frontend/src/lib/navHelper.ts` — Added roadmap route

### Backend
- `backend/controllers/progressController.js` — Added 3 new functions
- `backend/routes/progressRoutes.js` — Added 3 new routes

---

**Status**: Ready for testing! 🚀
