import mongoose,{Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";


const userSchema=new Schema({
      
    username:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true                 // index is true becz to enable the search.it can be done without index also but for optimization
    },

    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true                
    },

    fullName:{
        type:String,
        required:true,
        trim:true,
        index:true               
    },

    avatar:{
        type:String,
        required:true  //cloudinary url
    },

    coverImage:{
        type:String  //cloudinary url
    },

    watchHistory:[
      {
        type:Schema.Types.ObjectId,
        ref:"Video"
      }
    ],
    
    password:{
        type:String,
        required:[true,'Password is required']
    },

    refreshToken:{
        type:String
    }   

},
{
    timestamps:true
}
)

userSchema.pre("save", async function(next){      //Encrypts the Password  
    if(!this.isModified("password")) return next();

    this.password=bcrypt.hash(this.password,10)
    next()
}
)

userSchema.methods.isPassword=async function(password){ 
    return await bcrypt.compare(password,this.password)    //Checking Whether Password is Correct or not
}


userSchema.methods.generateAccessToken=function(){
    jwt.sign(                                             //Generate Access Token
        {
            _id=this._id,
            email=this.email,
            username=this.username,
            fullName=this.fullName
        },
         process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn=ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken=function(){
    jwt.sign(                                             //Generate Access Token
        {
            _id=this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn=REFRESH_TOKEN_EXPIRY
        }
    )
}




export const User = mongoose.model("User",userSchema)