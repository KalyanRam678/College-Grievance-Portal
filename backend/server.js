require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const fs = require("fs");
const cors = require("cors");


const app = express();


// CREATE UPLOADS FOLDER
if(!fs.existsSync("uploads")){
 fs.mkdirSync("uploads");
}


// CORS
app.use(cors({
 origin: [
  "http://localhost:4200",
  "https://college-grievance-tracking-portal.netlify.app"
 ]
}));


// BODY PARSER
app.use(express.json());


// STATIC FILES
app.use("/uploads",express.static("uploads"));


// ROUTES
app.use("/api/auth",require("./routes/authRoutes"));
app.use("/api/grievance",require("./routes/grievanceRoutes"));


// MONGODB
mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log("MongoDB Connected");
  console.log("MONGO_URI =", process.env.MONGO_URI);
  console.log("DB NAME =", mongoose.connection.name);
})
.catch(err => console.log(err));


// PORT
const PORT = process.env.PORT || 5000;
app.get("/check-grievances", async (req, res) => {
  try {
    const Grievance = require("./models/Grievance");
    const data = await Grievance.find().sort({ _id: -1 });
    res.json({
      dbName: mongoose.connection.name,
      count: data.length,
      data
    });
  } catch (err) {
    console.log("CHECK GRIEVANCES ERROR:", err);
    res.status(500).json({ msg: "Error", error: err.message });
  }
});
app.listen(PORT,()=>{
 console.log("Server running on port "+PORT);
});