const bcrypt=require("bcryptjs");
const User=require("../models/User");
const jwt= require("jsonwebtoken");

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
      "Password must be at least 8 characters and include uppercase letter, number, and special character"
  });
}

        // hash password
        const salt= await bcrypt.genSalt(10);
        const hashed= await bcrypt.hash(password, salt);

        // create user
        const user= await User.create({
            name,
            email,
            password: hashed,
            role
        }); 

        // send response 
        res.status(201).json({
            message: "User registerd sccessfully ",
        
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


// login
const loginUser= async (req,res)=>{
  try{
    const {email, password} = req.body;

    // find user
    const user = await User.findOne({email});
    if(!user){
        return res.status(400).json({
            message: "Invalid emaill"
        });
    }

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
        return res.status(400).json({
            message: "Invalid Password"
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

module.exports= {registerUser, loginUser};