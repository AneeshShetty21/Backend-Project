import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiErrors.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser=asyncHandler( async (req,res)=>{
    const {fullName,password,email,username}=req.body
    console.log("email:",email)




if(
    [fullName,password,email,username].some((field)=>
    field?.trim()==="")                                        //checks whether all fields are entered
){
    throw new ApiError(400,"All Fields are Required")
}



const existedUser=User.findOne({
    $or:[{ username },{ email }]    //checking whether user with above email or username exists
})

if(existedUser){
    throw new ApiError(409,"User with the above email or Password already exists")
}



const avatarLocalPath=req.files?.avatar[0]?.path;    //Fetching the LocalPath of Avatar and coverImage
const coverImageLocalPath=req.files?.coverImage[0]?.path;

if(!avatarLocalPath){
    throw new ApiError(400,"Avatar is required")
}


const avatar=await uploadOnCloudinary(avatarLocalPath)
const coverImage=await uploadOnCloudinary(coverImageLocalPath)

if(!avatar){
    throw new ApiError(400,"Avatar is required")  //checking whether avatar is present
}




const user=await User.create({
       
    fullName,
    avatar:avatar.url,              //Created user in DB
    coverImage:coverImage?.url||"",
    email,
    password,
    username:username.toLowerCase()

})


const createdUser=await User.findById(user._id).select(
    "-password -refreshToken"                                 //select is used to select the items which has to be removed
)

if(!createdUser){
    throw new ApiError(500,"Something went wrong while registering the user")
}


return res.status(201).json(
    new ApiResponse(200,createdUser,"User Registered Successfully")
)






} )

export {
    registerUser,
}