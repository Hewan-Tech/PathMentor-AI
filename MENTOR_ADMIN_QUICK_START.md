# Mentor & Admin Features - Quick Start Guide

## 🚀 Quick Start

### Prerequisites
- Backend server running on `http://localhost:5001`
- Frontend server running on `http://localhost:8081`
- MongoDB connected
- At least one mentor and one student account created

---

## 👨‍🏫 MENTOR FEATURES

### 1. Access Mentor Dashboard
```
URL: http://localhost:8081/mentor/dashboard
Login: Use mentor credentials
```

### 2. View Notifications
- Look at the top-right corner of the dashboard
- Click the bell icon to see notifications
- Notifications appear in real-time when:
  - A student enrolls in your course
  - A session is booked
  - A project is submitted
  - A student unlocks an achievement

### 3. Chat with Students
**Step 1**: Navigate to Messages
```
Click "Messages" in the sidebar
OR
Go to: http://localhost:8081/mentor/chat
```

**Step 2**: Select a Student
- You'll see a list of your assigned students
- Use the search bar to find specific students
- Click on a student to open the chat

**Step 3**: Send Messages
- Type your message in the input field
- Press Enter or click Send
- Messages appear in real-time
- Student receives notification

**Features**:
- ✅ Real-time messaging
- ✅ Search students
- ✅ See student skill track
- ✅ Message history
- ✅ Online status

---

## 👨‍💼 ADMIN FEATURES

### 1. Access Admin Dashboard
```
URL: http://localhost:8081/admin/dashboard
Login: Use admin credentials
```

### 2. View Notifications
- Bell icon in the top-right header
- Click to see all notifications
- Real-time updates for:
  - New user registrations
  - Mentor applications
  - System alerts
  - Payment transactions

### 3. Chat with Users
**Step 1**: Navigate to User Messages
```
Click "User Messages" in the sidebar under "Chats & Support"
OR
Go to: http://localhost:8081/admin/user-chat
```

**Step 2**: Filter Users
- Click "All" to see everyone
- Click "Student" to see only students
- Click "Mentor" to see only mentors

**Step 3**: Search and Select
- Use the search bar to find users
- Click on a user to open chat
- Role badges show user type (blue=student, purple=mentor)

**Step 4**: Send Messages
- Type and send messages
- Real-time delivery
- User receives notification

**Features**:
- ✅ Chat with any user
- ✅ Role-based filtering
- ✅ Search functionality
- ✅ Real-time messaging
- ✅ Role badges

---

## 🧪 TESTING SCENARIOS

### Scenario 1: Mentor-Student Communication
1. **As Mentor**:
   - Login as mentor
   - Go to Messages
   - Select a student
   - Send: "Hi! How's your progress?"

2. **As Student**:
   - Login as student
   - Check notification bell (should show new message)
   - Go to Study Buddies or check messages
   - Reply to mentor

### Scenario 2: Admin Support
1. **As Admin**:
   - Login as admin
   - Go to User Messages
   - Filter by "Student"
   - Select a student
   - Send: "How can I help you today?"

2. **As Student**:
   - Check notifications
   - See admin message
   - Reply with question

### Scenario 3: Real-Time Notifications
1. **Trigger Event**:
   - Complete a lesson (as student)
   - Book a session (as student)
   - Submit a project (as student)

2. **Check Notifications**:
   - Mentor sees notification about student activity
   - Admin sees system notification
   - Student sees achievement notification

---

## 🔍 TROUBLESHOOTING

### Notifications Not Appearing
**Problem**: Bell icon shows no notifications

**Solutions**:
1. Check Socket.io connection:
   ```javascript
   // Open browser console
   // Look for: "socket connected: [socket-id]"
   ```

2. Verify backend is running:
   ```bash
   # Should see: "Server running on port 5001"
   ```

3. Check user ID in socket auth:
   ```javascript
   // In browser console
   localStorage.getItem("token")
   // Decode JWT to verify userId
   ```

### Chat Messages Not Sending
**Problem**: Messages don't appear in chat

**Solutions**:
1. Check Socket.io connection status
2. Verify room ID format:
   - Mentor-Student: `mentor-{id1}-{id2}`
   - Admin-User: `admin-{id1}-{id2}`
3. Check backend logs for errors
4. Verify MongoDB connection

### Students Not Showing in Mentor Chat
**Problem**: Student list is empty

**Solutions**:
1. Verify students are assigned to mentor:
   ```bash
   # Check in MongoDB
   db.users.find({ assignedMentor: ObjectId("mentor-id") })
   ```

2. Check API endpoint:
   ```bash
   curl http://localhost:5001/api/mentor/my-students \
     -H "Authorization: Bearer YOUR_TOKEN"
   ```

3. Verify mentor verification status is "approved"

### Users Not Showing in Admin Chat
**Problem**: User list is empty

**Solutions**:
1. Check admin permissions
2. Verify API endpoint:
   ```bash
   curl http://localhost:5001/api/admin/users \
     -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
   ```

3. Check role filter (try "All" first)

---

## 📱 MOBILE TESTING

### Responsive Design
All features work on mobile devices:

1. **Mentor Chat**:
   - Student list stacks on top
   - Chat area below
   - Swipe to navigate

2. **Admin Chat**:
   - User list stacks on top
   - Filter buttons wrap
   - Chat area below

3. **Notifications**:
   - Bell icon in mobile header
   - Dropdown adapts to screen size
   - Touch-friendly buttons

---

## 🎯 FEATURE CHECKLIST

### Mentor Dashboard
- [ ] Login as mentor
- [ ] See dashboard stats
- [ ] Click notification bell
- [ ] See unread count
- [ ] Open notification dropdown
- [ ] Mark notification as read
- [ ] Navigate to Messages
- [ ] See assigned students
- [ ] Search for student
- [ ] Select student
- [ ] Send message
- [ ] Receive reply in real-time

### Admin Dashboard
- [ ] Login as admin
- [ ] See dashboard overview
- [ ] Click notification bell
- [ ] See system notifications
- [ ] Navigate to User Messages
- [ ] Filter by role (All/Student/Mentor)
- [ ] Search for user
- [ ] Select user
- [ ] Send message
- [ ] Receive reply in real-time

---

## 🔐 SECURITY NOTES

### Authentication
- All chat endpoints require authentication
- JWT token verified on every request
- Socket.io uses token-based auth

### Authorization
- Mentors can only chat with assigned students
- Admins can chat with any user
- Students can only chat with buddies and mentors

### Data Privacy
- Messages are stored in MongoDB
- Only participants can see messages
- Admins have full access for moderation

---

## 📊 MONITORING

### Check Socket.io Connections
```javascript
// Backend logs show:
"socket connected: [socket-id]"
"User [userId] joined their notification room"
"Socket [socket-id] joined room: [room-id]"
```

### Check Message Delivery
```javascript
// Backend logs show:
"socket sendMessage: { roomId, message, sender }"
"Emitting newMessage to room: [room-id]"
```

### Check Notification Delivery
```javascript
// Backend logs show:
"Notification created for user: [userId]"
"Emitting notification to user-[userId]"
```

---

## 🎨 UI COMPONENTS USED

### Shared Components
- `ChatRoom` - Main chat interface
- `MessageList` - Message display
- `MessageInput` - Message input field
- `NotificationBell` - Notification icon with badge
- `NotificationDropdown` - Notification list
- `GlassCard` - Glass morphism container
- `GlassButton` - Styled button

### Icons (Lucide React)
- `MessageSquare` - Chat icon
- `Users` - User list icon
- `Bell` - Notification icon
- `Search` - Search icon
- `Loader2` - Loading spinner

---

## 🚀 DEPLOYMENT CHECKLIST

Before deploying to production:

### Backend
- [ ] Set production Socket.io CORS origins
- [ ] Configure production MongoDB URI
- [ ] Set secure JWT secret
- [ ] Enable HTTPS
- [ ] Configure rate limiting
- [ ] Set up error logging
- [ ] Configure backup strategy

### Frontend
- [ ] Update API base URL
- [ ] Update Socket.io URL
- [ ] Enable production build
- [ ] Configure CDN for assets
- [ ] Set up error tracking
- [ ] Enable analytics
- [ ] Test on multiple devices

### Testing
- [ ] Test all chat features
- [ ] Test notification delivery
- [ ] Test on mobile devices
- [ ] Test with slow network
- [ ] Test with multiple users
- [ ] Load test Socket.io
- [ ] Security audit

---

## 📞 SUPPORT

### Common Issues
1. **Socket not connecting**: Check CORS settings
2. **Messages not sending**: Verify room ID format
3. **Notifications not appearing**: Check user ID in socket auth
4. **Students not showing**: Verify mentor assignment

### Debug Mode
Enable debug logging:
```javascript
// In socket.ts
const socket = io("http://localhost:5001", {
  transports: ["websocket"],
  auth: { token, userId },
  debug: true // Add this
});
```

---

## 🎉 SUCCESS CRITERIA

You've successfully implemented the features when:

✅ Mentors can see and chat with their students  
✅ Admins can chat with any user  
✅ Notifications appear in real-time  
✅ Messages are delivered instantly  
✅ Search and filter work correctly  
✅ Mobile responsive design works  
✅ No console errors  
✅ Socket.io stays connected  

---

**Happy Testing! 🚀**
