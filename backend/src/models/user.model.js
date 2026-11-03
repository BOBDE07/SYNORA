import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    username: {
        type: String , 
        required: true , 
        trim: true , 
        unique: [true , 'Username already taken'] , 
        lowercase: true ,     
    }, 
    email: {
        type: String , 
        required: true , 
        trim: true , 
        unique: [true , 'Email already taken'] , 
        lowercase: true , 
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
    }, 
    password: {
        type: String , 
        required: true ,
        minLength: [6, 'Password length atleast 6 characters'] ,
    }   , 
    fullname : {
        type: String , 
        required: true , 
        trim : true ,
    }
    
} , { timestamps: true }) ; 


userSchema.pre('save', async function (next ) {
    if(this.isModified('password') ) {
        this.password = await bcrypt.hash(this.password , 10 ) ; 
    }
    return next ; 
})

userSchema.methods.isPasswordValid = async function (password) {
    return await bcrypt.compare(password , this.password) ; 
}


export const User = mongoose.model('User' , userSchema) ;

