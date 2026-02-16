const express= require('express');
const PORT= process.env.PORT || 5000;
const authRoutes = require("./routes/authRoutes");
const dotenv = require ("dotenv");
const cors=require("cors");
const connectDB = require("./config/db");

dotenv.config(); 
console.log("MONGO_URI:", process.env.MONGO_URI);

connectDB();

const app= express();
app.use(express.json());
app.use(cors({
  origin: "http://localhost:8080",
  credentials: true
}));

app.use("/api/auth", authRoutes);
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/mentor", require("./routes/mentorRoutes"));

app.listen(PORT, ()=>{
    console.log(`server is running on port ${PORT}`);
})
