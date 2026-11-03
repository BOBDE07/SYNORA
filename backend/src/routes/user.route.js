import express from 'express' 
import { deleteUser, getCurrentUserProfile, registerUser, userLogOut, userLogin } from '../controllers/user.controller.js'
import verifyUser from '../middleware/user.middleware.js';
import { verify } from 'jsonwebtoken';

const userRouter = express.Router() ; 

userRouter.post('/register' , registerUser) ; 
userRouter.post('/login' , userLogin) ; 
userRouter.get('/profile', verifyUser, getCurrentUserProfile ) ; 
userRouter.post('/logout' , verifyUser, userLogOut) ; 
userRouter.delete('/delete' , verifyUser, deleteUser ) ; 

export default userRouter ; 