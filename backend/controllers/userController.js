const User = require("../models/User");
const bcrypt = require("bcryptjs");


const getMyProfile= async (req,res) => {
        res.status(200).json({
            user: req.user
        });
};

// update user profile
// get user from req.user ->update fields from req.body -> save to mongoDB -> return updated profile
const updateMyProfile = async (req, res) => {
      try{
        const { name, skill, level } = req.body;

        const updates = {};
        if (name) updates.name = name;
        if(skill) updates.skill = skill
        if(level) updates.level = level;

        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            
            { $set: updates },
            { new: true, runValidators: true},
        ).select("-password");

        res.status(200).json({
            message:"Profile updated successfully",
            user: updatedUser
        });
      } catch(error){
        console.error(error)
      }
}

// change the password
const changePassword = async (req, res) =>{
  try{
    const {currentPassword, newPassword } = req.body;

    // check input
    if(!currentPassword || !newPassword) {
      return res.status(400).json({
        message : "All fields are required"
      });
    }

    // get user with password
    const user = await User.findById(req.user._id).select("+password");

    //compare old password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }
        // 4️⃣ Validate new password strength
    const strongPassword =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (!strongPassword.test(newPassword)) {
      return res.status(400).json({
        message:
          "Use Strong Password"
      });
    }

    // 5️⃣ Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    // 6️⃣ Save user
    await user.save();

    res.status(200).json({
      message: "Password changed successfully"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }

}

// onboarding data 
const completeProfile = async (req, res) => {
  try {
    const {
      skillTrack,
      experienceLevel,
      commitmentTime,
      learningStyle,
      learningGoal,
      personalGoal,
      persona,
      strengths,
      recommendation
    } = req.body;

    const user = await User.findById(req.user._id);

 
   if (!user) {
  res.status(404);
  throw new Error("User not found");
}

    user.learningProfile = {
      skillTrack,
      experienceLevel,
      commitmentTime,
      learningStyle,
      learningGoal,
      personalGoal,
      persona,
      strengths,
      recommendation
    };

    user.onboardingCompleted = true;

    await user.save();

    res.status(200).json({
      message: "Profile completed successfully"
    });

  } catch (error) {
    console.error("Onboarding error:", error);
    res.status(500).json({
      message: "Server error"
    });
  }
};

// ADMIN : get all users
const getAllUsers= async (req,res) =>{
  const users = await User.find().select("-password");
  res.json(users);

}; 

// ADMIN:  delete users
 const deleteUser = async (req, res) => {
   await User.findByIdAndDelete(req.params.id);
   res.json ({ 
     message: "User deleted"
   });
 }; 
 //ADMIN: update role
 const updateUserRole = async (req, res) =>{
  const user = await User.findByIdAndUpdate (
    req.params.id,
    {role: req.body.role},
    {new: true}
  );
  res.json(user);
 }; 

//Dashboard
  const getDashboardStats = async (req, res) => {
  const totalUsers = await User.countDocuments();
  const mentors = await User.countDocuments({ role: "mentor" });
  const students = await User.countDocuments({ role: "student" });
  const pending = await User.countDocuments({ mentorStatus: "pending" });

  res.json({
    totalUsers,
    mentors,
    students,
    pending
  });
};

module.exports= { getMyProfile,
                  updateMyProfile, 
                  changePassword,
                  completeProfile,
                  getAllUsers,
                  deleteUser,
                  updateUserRole,
                  getDashboardStats
   
 };