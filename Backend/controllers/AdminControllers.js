import Admin from "../models/Admin.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const adminSignup = async (req, res, next)=> {
    const { email, password } = req.body;
    if (!email || !password || email.trim() === "" || password.trim() === "") {
        return res.status(422).json({message: "Invalid Inputs"});
    }
    let existingAdmin;
    try{
        existingAdmin = await Admin.findOne({email});
    }
    catch(err){
        return console.log(err);
    }
    if(existingAdmin){
        return res.status(400).json({message:"Admin Already Exists !"});
    }

let admin;
const hashedPassword = bcrypt.hashSync(password);
try{
admin = new Admin({ email , password: hashedPassword});
admin = await admin.save();
}
catch(err){
    return console.log(err);
}
if (!admin){
    res.status(500).json({message:"cannot store admin"});
}

return res.status(201).json({ admin });
};

export const adminLogin = async(req, res, next )=>{
    const { email, password} = req.body;
    if (!email || !password || email.trim() === "" || password.trim() === "") {
        return res.status(422).json({message: "Invalid Inputs"});
    }
    let existingAdmin;
    try{
        existingAdmin = await Admin.findOne({email});
    }
    catch(err){
        return console.log(err);
    }
    

    if(!existingAdmin){
        return res.status(404).json({message:"Cannot Find Such Admin"});
    }

    const comparePassword = bcrypt.compareSync(password, existingAdmin.password);
     if(!comparePassword){
        return res.status(400).json({message:"Incorrect Password"});
     }
     const token = jwt.sign({id: existingAdmin._id}, process.env.SECRET_KEY, { expiresIn: "7d"});
     return res.status(200).json({message: "Login Sucessfull", token, id:existingAdmin._id});
};

export const getAllAdmin = async(req,res,next)=>{
    let admins;
    try {
        admins = await Admin.find();
        
    } catch (err) {
        return console.log(err);
        
    }
    if(!admins){
        return res.status(500).json({message:"Internal Server Error"});

    }

    return res.status(200).json({ admins });
}