const userModel = require("../model/users.model")
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken")
const axios = require("axios")
const querystring = require('querystring');

async function signup(req, res) {
  try {
    const { name, email, password, phone } = req.body;
    if (!name.trim())
      return res.status(400).json({ message: "Please Enter a Name" });

    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!validEmail)
      return res.status(400).json({ message: "Please Enter a Vaild Email" });

    // const validPassword =
    //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
    //     password
    //   );
    // if (!validPassword)
    //   return res
    //     .status(400)
    //     .json({ message: "Please Enter a Strong Password!" });

    const getUser = await userModel.findOne({ email });
    if (getUser) return res.status(400).json({ message: "User Already Exist With this Email" });

    const encryptedPassword = await bcrypt.hash(password, 10);
    const resisterUser = await userModel.create({
      name: name,
      email: email,
      password: encryptedPassword,
      phone:phone
    });

    const token = jwt.sign({ _id: resisterUser._id }, process.env.JWT_SECRET, {expiresIn: "90d"});
    res.cookie("token", token);
    return res
      .status(201)
      .json({ message: "user Created Successfully!!!", token, name });
  } catch (error) {
    res.status(500).json({ message: `Someting Went Wrong ${error}` });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!validEmail)
      return res.status(400).json({ message: "Please Enter a Vaild Email" });

    const theUser = await userModel.findOne({ email });
    if (!theUser)
      return res.status(400).json({ message: "No User Exist with This Email or password" });
    console.log("hheey")
    const validPassword = await bcrypt.compare(password, theUser.password);
    if (!validPassword)
      return res.status(400).json({ message: "Invalid email or password" });
    console.log("hhee2y")

    const token = jwt.sign({ _id: theUser._id }, process.env.JWT_SECRET, {expiresIn: "90d"});
    res.cookie("token", token);
    const name = theUser.name
    return res
      .status(200)
      .json({ message: `Login Successfull!`, token, name});
  } catch (error) {
    res.status(500).json({ message: `Someting Went Wrong ${error}`});
  }
}


async function verify(req, res) {
  try {
    const token = req.cookies.token; 
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Fetch the user from database using the decoded ID
    const user = await userModel.findById(decoded._id).select('-password'); // Exclude password
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Return user data that matches your frontend User interface
    return res.status(200).json({ 
      success: true,
      user: {
        _id: user._id,
        // id: user._id, // Include both for compatibility
        email: user.email,
        name: user.name,
        phone: user.phone,
      }
    });
    
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: "Invalid token" });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: "Token expired" });
    }
    
    console.error('Verify error:', error);
    return res.status(500).json({ message: "Internal server error" });
  }
}


function googleAuth(req, res) {
  const redirectUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.BACKEND_URL}/api/auth/google/callback&response_type=code&scope=openid%20profile%20email`;
  res.redirect(redirectUrl);
}

async function googleAuthCallback(req, res) {
  try {
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

    const newdata = await axios.get(
      `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${access_token}`
    );

    let user = await userModel.findOne({ email: newdata.data.email });
    if (!user) {
      user = await userModel.create({
        email: newdata.data.email,
        name: newdata.data.name,
        picture: newdata.data.picture,
        googleId: newdata.data.id,
      });
    }

    // ---we left the Approach 1(cookies), this is Approach 2: Redirect to frontend with token ---
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    // res.redirect(`https://96f5dbd56ae7.ngrok-free.app/frontend/html/auth-control.html?token=${token}`);
    res.redirect(
      `${process.env.GOOGLE_FRONTEND_REDIRECT}?token=${token}`
    );
  } catch (error) {
    res.status(500).json({ message: `something  went Wrong: ${error}` });
  }
}

async function profile(req, res) {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    // const token = req.cookies.token;
    // const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    console.log(token)
    if (!token) {
      return res.status(401).json({ message: "Nooooo token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded._id;

    const user = await userModel.findById(userId).select("name email picture");

    res.json({ name: user.name, email: user.email, picture: user.picture });
  } 
  catch (err) {
    res.status(401).json({ message: "Invalid token", error: err.message });
  }
}

function logout(req, res) {
  res.clearCookie("token");
  res.status(200).json({ message: "LogOut Successfully!!!" });
}

module.exports = {
    login,
    signup,
    verify,
    googleAuth,
    googleAuthCallback,
    logout,
    profile,
}