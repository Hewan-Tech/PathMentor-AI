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
        skill:{
           type:String
        },
        level: {
            type: String,
            enum: ["beginner", "intermediate", "advanced"], 
            default: "beginner"
        },
        
        documents: [
            {
                type: String,
            }
        ],

        verificationStatus: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending"
        }
    }, 
    { timestamps: true}
); 

module.exports = mongoose.model("User", userSchema);