import { Response, NextFunction } from "express";
import User from "../models/User";
import { AuthRequest } from "../middleware/auth.middleware";

export const getProfile = async (
req: AuthRequest,
res: Response,
next: NextFunction
)=>{

try{

const user=await User.findById(req.userId).select("-password");

if(!user){

return res.status(404).json({
success:false,
message:"User not found"
});

}

res.json({

success:true,

data:user

});

}
catch(err){

next(err);

}

};
export const updateProfile=async(

req:AuthRequest,

res:Response,

next:NextFunction

)=>{

try{

const updated=await User.findByIdAndUpdate(

req.userId,

req.body,

{

new:true

}

).select("-password");

res.json({

success:true,

message:"Profile updated",

data:updated

});

}

catch(err){

next(err);

}

};