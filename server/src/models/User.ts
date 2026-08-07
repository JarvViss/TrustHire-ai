import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;

  role: "candidate" | "recruiter" | "admin";

  profileImage: string;
  coverImage: string;

  phone: string;

  headline: string;

  bio: string;

  walletAddress: string;

  github: string;

  linkedin: string;

  portfolio: string;

  verificationHash: string;

  verificationTxHash: string;

  location: string;

  isVerified: boolean;

  resetToken: string;

  resetTokenExpiry: Date;
}

const userSchema = new Schema<IUser>(
{
name:{
type:String,
required:true
},

email:{
type:String,
required:true,
unique:true
},

password:{
type:String,
required:true
},

role:{
type:String,
enum:["candidate","recruiter","admin"],
default:"candidate",
index: true,
},

profileImage:{
type:String,
default:""
},

coverImage:{
type:String,
default:""
},

phone:{
type:String,
default:""
},

headline:{
type:String,
default:""
},

bio:{
type:String,
default:""
},

walletAddress:{
type:String,
default:""
},

github:{
type:String,
default:""
},

linkedin:{
type:String,
default:""
},

portfolio:{
type:String,
default:""
},


verificationHash: {
    type: String,
    default: "",
},

verificationTxHash: {
    type: String,
    default: "",
},



location:{
type:String,
default:""
},

isVerified:{
type:Boolean,
default:false
},

resetToken:{
type:String,
default:""
},

resetTokenExpiry:{
type:Date,
default:null
}

},
{
timestamps:true
}
);

export default mongoose.model<IUser>("User",userSchema);