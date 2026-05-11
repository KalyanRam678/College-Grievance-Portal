const jwt = require("jsonwebtoken");

const generateToken=(id,role)=>{
 return jwt.sign({id,role},"SECRETKEY",{expiresIn:"1d"});
};

module.exports=generateToken;