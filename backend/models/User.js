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