const express = require('express');
const app = express()

const cookieParser = require("cookie-parser");
const cors = require("cors");

const adminAuth = require("./routes/adminAuth.route")
const adminPanel = require("./routes/adminPanel.route")
const userAuth = require("./routes/userAuth.route")
const userPanel = require("./routes/userPanel.route")
const {userAuthMiddlewareForAuth} = require("./middleware/userAuth.middleware")

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,                // cookies/jwt bhejne ke liye
}));

app.use(cookieParser());
app.use(express.json())


//my Routes Goes from here :>
app.use("/api/admin", adminAuth)   //Admin ✅
app.use("/api/admin", adminPanel)   //Admin

app.use("/api/userAuth", userAuth)  //User ✅
// app.use("/api/userPanel",userAuthMiddlewareForAuth, userPanel) //User
app.use("/api/userPanel", userPanel) //User



// {
// const jwt = require("jsonwebtoken")
// const userModel = require("./model/users.model")
// app.get("/profile", async (req, res) => {
//   try {
//     const token = req.cookies.token;
//     if (!token) {
//       return res.send(`
//         <h1 style="color:red;">Unauthorized</h1>
//         <p>No token found in cookies.</p>
//       `);
//     }

//     // verify token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     // fetch user
//     const user = await userModel.findById(decoded._id).select("-password");
//     if (!user) {
//       return res.send(`
//         <h1 style="color:red;">User Not Found</h1>
//       `);
//     }

//     // send HTML response
//     res.send(`
//       <html>
//         <head>
//           <title>User Profile</title>
//         </head>
//         <body style="font-family:sans-serif; background:#f9f9f9; padding:20px;">
//           <h1 style="color:green;">Profile Fetched Successfully ✅</h1>
//           <p><strong>Name:</strong> ${user.name}</p>
//           <p><strong>Email:</strong> ${user.email}</p>
//           <p><strong>ID:</strong> ${user._id}</p>
//         </body>
//       </html>
//     `);
//   } catch (err) {
//     res.send(`
//       <h1 style="color:red;">Invalid or Expired Token</h1>
//       <pre>${err.message}</pre>
//     `);
//   }
// });


// }



module.exports = app
