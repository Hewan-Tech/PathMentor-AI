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
const completeProfile= async (req, res) =>{
   try{
    // get onboarding data from frontend
    const {
      skillTrack,
      experienceLevel,
      commitmentTime,
      learningStyle,
      learningGoal, 
      personalGoal
    } = req.body; 

    // find user by user id
    
    const user = await User.findById(req.user._id);

    if(!user){
     return res.status(404).json({
        message: "user not found"
      });
    };

    // save to database
    user.learningProfile = {
      skillTrack,
      experienceLevel,
      commitmentTime,
      learningStyle,
      learningGoal,
      personalGoal
    }; 

    user.onboardingCompleted = true;

    await user.save();

    // response
    res.status(200).json({
      message: "completed successsfully"
    })
     
   } catch(error){
    console.error("onboarding error: ", error);
    res.status(500).json({message: "Server error"})
   }
}
module.exports= { getMyProfile, updateMyProfile, changePassword, completeProfile };