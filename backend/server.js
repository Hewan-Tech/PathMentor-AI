const express= require('express');
const path = require('path');
const PORT= process.env.PORT || 5000;
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const dotenv = require ("dotenv");
const cors=require("cors");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorMiddleware");
const levelRoutes = require("./routes/levelRoutes");
const courseRoutes = require("./routes/courseRoutes");
const lessonRoutes = require("./routes/lessonRoutes");
const quizRoutes = require("./routes/quizRoutes");
const progressRoutes = require("./routes/progressRoutes");
const leaderboardRoutes = require("./routes/leaderboardRoutes");
const announcementRoutes = require("./routes/announcementRoutes");
const rateLimit = require("express-rate-limit");


dotenv.config(); 
console.log("MONGO_URI:", process.env.MONGO_URI);

connectDB();

const app= express();
app.use(express.json());
app.use(cors({
  origin: "http://localhost:8080",
  credentials: true
}));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100 // max requests
});

app.use(limiter);

app.use("/api/auth", authRoutes);
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/admin", adminRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/levels", levelRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/announcements", announcementRoutes);

app.use(errorHandler);
app.listen(PORT, ()=>{
    console.log(`server is running on port ${PORT}`);
})
