const bcrypt=require("bcryptjs");
const User=require("../models/User");
const jwt= require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const registerUser = async (req, res)=>{
    try {
        const {name, email, password, role }= req.body;

        // check whether the user already register
        const userExists = await User.findOne({email});

        if(userExists) {
            return res.status(400).json({
                message: "User already exists"
            });
        }
        // check whether password is valid
       const passwordRegex =
  /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%#*?&])[A-Za-z\d@$!%*?&]{8,}$/;

if (!passwordRegex.test(password)) {
  return res.status(400).json({
    message:
      "Use Strong Password"
  });
}

        // hash password
        const salt= await bcrypt.genSalt(10);
        const hashed= await bcrypt.hash(password, salt);
  // generate verification token 
  const verificationToken = crypto.randomBytes(32).toString("hex");
        // create user
        const user= await User.create({
            name,
            email,
            password: hashed,
            role,
            verificationToken, 
            isVerified: false
        }); 

        // send verification email
       const transporter = nodemailer.createTransport({
            host: "smtp-relay.brevo.com",
            port: 587,

            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
});

            const verifyLink = `http://localhost:5000/api/auth/verify/${verificationToken}`;

    await transporter.sendMail({
      from: '"PathMentor AI" ',
      to: email,
      subject: "Verify your email",
      html: `
        <h3>Hello ${name}</h3>
        <p>Please verify your email by clicking the link below:</p>
        <a href="${verifyLink}">Verify Account</a>
      `
    });

            await user.save();
        // send response 
        res.status(201).json({
            message: "User registerd sccessfully. Please check your email to verify! ",
        
           user: {
              id: user._id,
              name: user.name,
              email: user.email,
              role: user.role
           }
    });
    } catch(error) {
        console.log("error ", error )
        res.status(500).json({
            message: "server error",
             error: error.message
        })
    }
} 

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.status(400).send("Invalid or expired verification link");
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    // redirect to frontend login
    res.redirect("http://localhost:8080/login");
  } catch (error) {
    console.error("Verify error:", error);
    res.status(500).send("Server error", error);
  }
};



// login
const loginUser= async (req,res)=>{
  try{
    const {email, password} = req.body;

    // find user
    const user = await User.findOne({email});
    if(!user){
        return res.status(400).json({
            message: "Check your email or password"
        });
    }
      // check if verified
      if (!user.isVerified) {
      return res.status(401).json({
        message: "Please verify your email first"
      });
    }
    // compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
        return res.status(400).json({
            message: "Check your email or password"
        })
    }

    // generate token 
    const token =jwt.sign(
        {
            id: user._id,
            role: user.role
        }, 
        process.env.JWT_SECRET, 
        {expiresIn:"7d"}
    );

    // response
    res.json({
        message:"Login Successful",
        token,
        user:{
            id:user._id,
            name: user.name,
            role:user.role
        }
    });
  } catch(error){
    console.error("Error ", error)

  }
}

module.exports= {registerUser, loginUser, verifyEmail};