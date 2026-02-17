const mongoose=require("mongoose");

const userSchema=new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        }, 
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true
        },
        password: {
            type: String,
            required: true,
            minlength: 8
        },
        role: {
            type: String,
            enum: ["student", "mentor", "admin"], 
            
        }, 
        isVerified: {
            type: Boolean,
            default: false
        }, 
        verificationToken: {
            type: String
        },
        learningProfile: {
            skillTrack: String,
            experienceLevel: String,
            commitmentTime: String,
            learningStyle: String,
            learningGoal: String,
            personalGoal: String,
            persona: String,
            strengths: [String],
            recommendation: String
      },
     onboardingCompleted: {
             type: Boolean,
            default: false
     },
     // mentor verification
     mentorVerification: {
             status: {
              type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending"
             },
             documents: [String], //file paths, /URL
             reviewdBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
             },
             reviewedAt: Date
     }


        
    }, 
    { timestamps: true}
); 

module.exports = mongoose.model("User", userSchema);