const userModel = require("../model/users.model")
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken")
const axios = require("axios")
const querystring = require('querystring');

async function signup(req, res){
  try {
      const {name, email, password} = req.body
        if (!name.trim()) return res.status(400).json({"message":"Please Enter a Name"})

        const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        if (!validEmail)  return res.status(400).json({"message":"Please Enter a Vaild Email"})

        const validPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password)
        if (!validPassword) return res.status(400).json({"message":"Please Enter a Strong Password!"})

        const getUser = await userModel.findOne({email})
        if (getUser) return res.status(400).json({"message":"User Already Exist"})

        const encryptedPassword = await bcrypt.hash(password, 13)
        const resisterUser = await userModel.create({
            name: name,
            email: email,
            password: encryptedPassword
        })

        const token = jwt.sign({_id:resisterUser._id},process.env.JWT_SECRET )
        res.cookie("token",token)
        return res.status(201).json({"message" :"user Created Successfully!!!",token})

    } catch (error) {
        res.status(500).json({"message": `Someting Went Wrong At Server ${error}`})
    }
}

async function login(req, res){
    try{
        const {email, password} = req.body;

        const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        if (!validEmail)  return res.status(400).json({"message":"Please Enter a Vaild Email"})

        const theUser = await userModel.findOne({email})
        if (!theUser) return res.status(400).json({"message": "Invalid email or password"});
        
        const validPassword = await bcrypt.compare(password, theUser.password)
        if (!validPassword) return res.status(400).json({"message": "Invalid email or password"});
        
        const token = jwt.sign({_id: theUser._id}, process.env.JWT_SECRET) 
        res.cookie("token", token)
        return res.status(200).json({"message": `hello ${theUser.name}, Wellcome Back`, token})
    }
    catch(error){
        res.status(500).json({"message":`Someting Went Wrong At Server ${error}`})        
    }
}

  function googleAuth(req, res){
      const redirectUrl =`https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.BACKEND_URL}/api/auth/google/callback&response_type=code&scope=openid%20profile%20email`;
      res.redirect(redirectUrl);
  }

    async function googleAuthCallback(req,res){
      try{
        const code = req.query.code;

        const { data } = await axios.post(
          "https://oauth2.googleapis.com/token",
          querystring.stringify({
            code,
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            redirect_uri: `${process.env.BACKEND_URL}/api/auth/google/callback`,
            grant_type: "authorization_code",
          }),
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );
        
        const { access_token } = data;
        
        const newdata = await axios.get(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${access_token}`)

        let user = await userModel.findOne({email: newdata.data.email})
        if(!user){
            user = await userModel.create({
                email:newdata.data.email,
                name:newdata.data.name,
                picture:newdata.data.picture,
                googleId:newdata.data.id
            });
        }

        // ---we left the Approach 1(cookies), this is Approach 2: Redirect to frontend with token ---
        const token = jwt.sign({_id:user._id}, process.env.JWT_SECRET, {expiresIn:"7d"})
        // res.redirect(`https://96f5dbd56ae7.ngrok-free.app/frontend/html/auth-control.html?token=${token}`);
        res.redirect(`http://localhost:5500/frontend/html/auth-control.html?token=${token}`);
      }
      catch(error){
        res.status(500).json({"message": `something  went Wrong: ${error}`})
      }
    }

  async function profile(req, res){
    try {
      // token should come from header (Authorization: Bearer <token>)
      const token = req.headers.authorization?.split(" ")[1];

      
      if (!token) {
        return res.status(401).json({ message: "No token provided" });
      }

      
      // verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // decoded contains whatever you put while signing (e.g., { _id, email })
      const userId = decoded._id;

      // fetch user info
      const user = await userModel.findById(userId).select("name email picture");
      console.log(user)
      res.json({ name: user.name, email: user.email, picture:user.picture });
    } catch (err) {
      res.status(401).json({ message: "Invalid token", error: err.message });
    }
  }

  function logout(req,res){
      res.clearCookie("token")
      res.status(200).json({"message": "LogOut Successfully!!!"})
  }


function checkAuth(req, res){
  try{
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
    return res.status(401).json({ message: "No token provided" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    if (decoded) return res.json("True")
  }
  catch(error){
    res.status(500).json("Good Try Mate, But better Next Time :)")
  }
}


module.exports = {
    login,
    signup,
    googleAuth,
    googleAuthCallback,
    logout,
    profile,
    checkAuth
}